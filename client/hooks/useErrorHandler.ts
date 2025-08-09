import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectOnAuth?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { showToast = true, redirectOnAuth = true } = options;

  const handleError = (error: Error | unknown, customMessage?: string) => {
    let errorMessage = customMessage || "Une erreur est survenue";
    let shouldRedirect = false;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for authentication errors
      if (error.message.includes('Session expirée') || 
          error.message.includes('Unauthorized') ||
          error.message.includes('401')) {
        shouldRedirect = redirectOnAuth;
        errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
      }
      
      // Check for permission errors
      if (error.message.includes('Accès refusé') || 
          error.message.includes('Forbidden') ||
          error.message.includes('403')) {
        errorMessage = "Vous n'avez pas les permissions nécessaires pour cette action.";
      }
      
      // Check for network errors
      if (error.message.includes('contacter le serveur') ||
          error.message.includes('Network')) {
        errorMessage = "Problème de connexion. Vérifiez votre connexion internet.";
      }
      
      // Check for validation errors
      if (error.message.includes('validation')) {
        errorMessage = error.message; // Use the detailed validation message
      }
    }

    // Show toast notification
    if (showToast) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    }

    // Redirect to login if authentication error
    if (shouldRedirect) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }

    // Log error for debugging
    console.error("Error handled:", error);

    return {
      message: errorMessage,
      shouldRedirect
    };
  };

  const handleApiError = async (apiCall: () => Promise<any>, customMessage?: string) => {
    try {
      return await apiCall();
    } catch (error) {
      handleError(error, customMessage);
      throw error; // Re-throw so calling code can handle it if needed
    }
  };

  return {
    handleError,
    handleApiError
  };
};

export default useErrorHandler;
