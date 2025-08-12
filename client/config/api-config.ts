// API Configuration and mapping documentation

export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGOUT: "/auth/logout",
  USER_ME: "/me", // or '/users/me' depending on your API

  // Core entities
  USERS: "/users",
  VENDEURS: "/vendeurs",
  DONATEURS: "/donateurs",
  FAMILLES: "/familles",
  PRODUITS: "/produits",
  CATEGORIES: "/categories",

  // Orders and transactions
  COMMANDE_FAMILLES: "/commande_familles",
  COMMANDE_VENDEURS: "/commande_vendeurs",
  LIGNE_PRODUITS: "/ligne_produits",
  PAIEMENTS: "/paiements",

  // Additional endpoints
  CAGNOTTES: "/cagnottes",
  NOTIFICATIONS: "/notifications",
  EVALUATIONS: "/evaluations",
} as const;

// Status mapping between API and frontend
export const ORDER_STATUS_MAPPING = {
  // API Platform → Frontend
  fromApi: {
    PENDING: "paid_by_donator",
    ACCEPTED: "paid_by_donator",
    PROCESSING: "preparing",
    SHIPPED: "ready_for_pickup",
    COMPLETED: "ready_for_pickup",
    CANCELLED: "cancelled",
  },
  // Frontend → API Platform
  toApi: {
    paid_by_donator: "PENDING",
    preparing: "PROCESSING",
    ready_for_pickup: "SHIPPED",
    cancelled: "CANCELLED",
  },
} as const;

export const PAYMENT_STATUS_MAPPING = {
  fromApi: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
  },
  toApi: {
    pending: "PENDING",
    completed: "COMPLETED",
    failed: "FAILED",
    refunded: "REFUNDED",
  },
} as const;

export const PRIORITY_MAPPING = {
  fromApi: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  },
  toApi: {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
  },
} as const;

// API Platform query parameters documentation
export const API_QUERY_PARAMS = {
  // Pagination
  pagination: {
    page: "page", // ?page=1
    itemsPerPage: "itemsPerPage", // ?itemsPerPage=30
  },

  // Filtering
  filtering: {
    // Exact match: ?property=value
    exact: (property: string, value: string) => `${property}=${value}`,

    // Partial match: ?property[]=value
    partial: (property: string, value: string) => `${property}[]=${value}`,

    // Range: ?property[gte]=min&property[lte]=max
    range: {
      gte: (property: string, min: number) => `${property}[gte]=${min}`,
      lte: (property: string, max: number) => `${property}[lte]=${max}`,
      gt: (property: string, min: number) => `${property}[gt]=${min}`,
      lt: (property: string, max: number) => `${property}[lt]=${max}`,
    },

    // Existence: ?exists[property]=true/false
    exists: (property: string, exists: boolean) =>
      `exists[${property}]=${exists}`,

    // Search in nested properties: ?user.city=Paris
    nested: (parentProperty: string, childProperty: string, value: string) =>
      `${parentProperty}.${childProperty}=${value}`,
  },

  // Sorting
  sorting: {
    // ?order[property]=asc/desc
    order: (property: string, direction: "asc" | "desc") =>
      `order[${property}]=${direction}`,
  },
} as const;

// Common filters for different entities
export const COMMON_FILTERS = {
  products: {
    byCategory: (categoryName: string) => `categorie.name=${categoryName}`,
    byVendor: (vendorId: number) => `vendeur=${vendorId}`,
    byCity: (city: string) => `vendeur.user.city=${city}`,
    inStock: () => "stockQuantity[gt]=0",
    active: () => "isActive=true",
    search: (term: string) => `name=${term}`, // Consider using a search endpoint instead
  },

  vendors: {
    byCity: (city: string) => `user.city=${city}`,
    verified: () => "isVerified=true",
    active: () => "user.isActive=true",
    search: (term: string) => `storeName=${term}`,
  },

  families: {
    byCity: (city: string) => `user.city=${city}`,
    verified: () => "isVerified=true",
    byPriority: (priority: "LOW" | "MEDIUM" | "HIGH") => `priority=${priority}`,
    active: () => "user.isActive=true",
  },

  orders: {
    byStatus: (status: string) => `status=${status}`,
    byVendor: (vendorId: number) => `vendeur=${vendorId}`,
    byFamily: (familyId: number) => `famille=${familyId}`,
    recent: () => "order[createdAt]=desc",
  },
} as const;

// API Platform response structure helpers
export const API_RESPONSE_HELPERS = {
  // Extract data from Hydra collection
  extractCollection: <T>(response: any): T[] => {
    return response["hydra:member"] || [];
  },

  // Extract total items from Hydra collection
  extractTotalItems: (response: any): number => {
    return response["hydra:totalItems"] || 0;
  },

  // Check if response is a collection
  isCollection: (response: any): boolean => {
    return response["@type"] === "hydra:Collection";
  },

  // Extract entity ID from IRI
  extractIdFromIri: (iri: string): number => {
    const matches = iri.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  },

  // Create IRI from entity type and ID
  createIri: (entityType: string, id: number): string => {
    return `/api/${entityType}/${id}`;
  },
} as const;

// Error handling helpers
export const API_ERROR_HANDLERS = {
  // Handle API Platform validation errors
  handleValidationError: (error: any): string[] => {
    if (error.violations) {
      return error.violations.map(
        (v: any) => `${v.propertyPath}: ${v.message}`,
      );
    }
    return [error.message || "Erreur de validation"];
  },

  // Handle HTTP status codes
  handleHttpError: (status: number, response: any): string => {
    switch (status) {
      case 400:
        return "Données invalides";
      case 401:
        return "Non autorisé - veuillez vous reconnecter";
      case 403:
        return "Accès refusé";
      case 404:
        return "Ressource non trouvée";
      case 422:
        return API_ERROR_HANDLERS.handleValidationError(response).join(", ");
      case 500:
        return "Erreur serveur";
      default:
        return `Erreur HTTP ${status}`;
    }
  },
} as const;

export default {
  API_ENDPOINTS,
  ORDER_STATUS_MAPPING,
  PAYMENT_STATUS_MAPPING,
  PRIORITY_MAPPING,
  API_QUERY_PARAMS,
  COMMON_FILTERS,
  API_RESPONSE_HELPERS,
  API_ERROR_HANDLERS,
};
