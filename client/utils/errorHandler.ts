// Gestionnaire d'erreurs global et logging sécurisé

export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT = "RATE_LIMIT",
  UNKNOWN = "UNKNOWN",
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string | number;
  context?: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public code?: string | number,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON(): ErrorInfo {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.id?.toString();
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 50;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Gestion des erreurs par type
  handleError(error: unknown, context?: Record<string, any>): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = this.mapErrorToAppError(error, context);
    } else {
      appError = new AppError(
        ErrorType.UNKNOWN,
        "Une erreur inconnue s'est produite",
        undefined,
        { originalError: String(error), ...context }
      );
    }

    this.logError(appError);
    return appError;
  }

  private mapErrorToAppError(error: Error, context?: Record<string, any>): AppError {
    const message = error.message.toLowerCase();

    // Erreurs de validation
    if (message.includes("validation") || message.includes("invalid")) {
      return new AppError(ErrorType.VALIDATION, error.message, undefined, context);
    }

    // Erreurs d'authentification
    if (
      message.includes("unauthorized") ||
      message.includes("token") ||
      message.includes("session")
    ) {
      return new AppError(ErrorType.AUTHENTICATION, error.message, undefined, context);
    }

    // Erreurs d'autorisation
    if (message.includes("forbidden") || message.includes("permission")) {
      return new AppError(ErrorType.AUTHORIZATION, error.message, undefined, context);
    }

    // Erreurs réseau
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection")
    ) {
      return new AppError(ErrorType.NETWORK, error.message, undefined, context);
    }

    // Erreurs de rate limiting
    if (message.includes("rate") || message.includes("too many")) {
      return new AppError(ErrorType.RATE_LIMIT, error.message, undefined, context);
    }

    // Erreurs 404
    if (message.includes("not found") || message.includes("404")) {
      return new AppError(ErrorType.NOT_FOUND, error.message, undefined, context);
    }

    // Erreurs serveur (5xx)
    if (message.includes("server") || message.includes("5")) {
      return new AppError(ErrorType.SERVER, error.message, undefined, context);
    }

    return new AppError(ErrorType.UNKNOWN, error.message, undefined, context);
  }

  private logError(error: AppError): void {
    const errorInfo = error.toJSON();

    // Log en console en développement
    if (import.meta.env.DEV) {
      console.group(`🚨 ${error.type} Error`);
      console.error("Message:", error.message);
      console.error("Context:", error.context);
      console.error("Stack:", error.stack);
      console.groupEnd();
    }

    // Ajouter à la queue pour envoi ultérieur
    this.addToQueue(errorInfo);

    // Notifier les services de monitoring en production
    if (import.meta.env.PROD) {
      this.sendToMonitoring(errorInfo);
    }
  }

  private addToQueue(errorInfo: ErrorInfo): void {
    this.errorQueue.push(errorInfo);
    
    // Limiter la taille de la queue
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Persister en localStorage pour récupération après refresh
    try {
      localStorage.setItem("error_queue", JSON.stringify(this.errorQueue));
    } catch {
      // Ignore storage errors
    }
  }

  private async sendToMonitoring(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Ici vous pouvez intégrer avec des services comme Sentry, LogRocket, etc.
      // Pour l'instant, on log juste l'erreur
      
      // Exemple d'intégration Sentry :
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(errorInfo.message), {
      //     extra: errorInfo.context,
      //     tags: {
      //       errorType: errorInfo.type,
      //       userId: errorInfo.userId,
      //     },
      //   });
      // }

      console.warn("Error sent to monitoring:", errorInfo);
    } catch (monitoringError) {
      console.error("Failed to send error to monitoring:", monitoringError);
    }
  }

  // Récupération des erreurs persistées
  getPersistedErrors(): ErrorInfo[] {
    try {
      const stored = localStorage.getItem("error_queue");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Nettoyage des erreurs
  clearErrors(): void {
    this.errorQueue = [];
    localStorage.removeItem("error_queue");
  }

  // Messages d'erreur utilisateur-friendly
  getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return "Les informations saisies ne sont pas valides. Veuillez vérifier vos données.";
      
      case ErrorType.AUTHENTICATION:
        return "Votre session a expiré. Veuillez vous reconnecter.";
      
      case ErrorType.AUTHORIZATION:
        return "Vous n'avez pas les permissions nécessaires pour cette action.";
      
      case ErrorType.NETWORK:
        return "Problème de connexion. Vérifiez votre connexion internet.";
      
      case ErrorType.SERVER:
        return "Erreur du serveur. Veuillez réessayer plus tard.";
      
      case ErrorType.NOT_FOUND:
        return "La ressource demandée n'a pas été trouvée.";
      
      case ErrorType.RATE_LIMIT:
        return "Trop de tentatives. Veuillez patienter avant de réessayer.";
      
      default:
        return "Une erreur inattendue s'est produite. Veuillez réessayer.";
    }
  }
}

// Fonctions utilitaires
export const errorHandler = ErrorHandler.getInstance();

export function handleApiError(error: unknown, context?: Record<string, any>): never {
  const appError = errorHandler.handleError(error, context);
  throw appError;
}

export function createValidationError(message: string, field?: string): AppError {
  return new AppError(
    ErrorType.VALIDATION,
    message,
    "VALIDATION_ERROR",
    { field }
  );
}

export function createNetworkError(message: string, url?: string): AppError {
  return new AppError(
    ErrorType.NETWORK,
    message,
    "NETWORK_ERROR",
    { url }
  );
}

export function createAuthError(message: string): AppError {
  return new AppError(
    ErrorType.AUTHENTICATION,
    message,
    "AUTH_ERROR"
  );
}

// Hook React pour la gestion d'erreurs
export function useErrorHandler() {
  const handleError = (error: unknown, context?: Record<string, any>) => {
    const appError = errorHandler.handleError(error, context);
    const userMessage = errorHandler.getUserFriendlyMessage(appError);
    
    // Ici vous pouvez intégrer avec votre système de notifications
    // toast.error(userMessage);
    
    return { error: appError, userMessage };
  };

  return { handleError };
}

// Error Boundary Context
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorId?: string;
}

export const ErrorBoundaryContext = React.createContext<{
  state: ErrorBoundaryState;
  resetError: () => void;
  reportError: (error: AppError) => void;
} | null>(null);

// Utilitaires de debugging
export class DebugUtils {
  static logPerformance(label: string, startTime: number): void {
    if (import.meta.env.DEV) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  static logAPICall(method: string, url: string, data?: any): void {
    if (import.meta.env.DEV) {
      console.group(`📡 API Call: ${method} ${url}`);
      if (data) console.log("Data:", data);
      console.groupEnd();
    }
  }

  static logStateChange(component: string, oldState: any, newState: any): void {
    if (import.meta.env.DEV) {
      console.group(`🔄 State Change: ${component}`);
      console.log("Old:", oldState);
      console.log("New:", newState);
      console.groupEnd();
    }
  }
}
