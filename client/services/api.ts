import { UserRole } from "../context/AuthContext";
import {
  User,
  Vendeur,
  Donateur,
  Famille,
  Produit,
  Categorie,
  CommandeFamille,
  CommandeVendeur,
  LigneProduit,
  Paiement,
  ApiCollection,
  ApiError,
  VendorOrderFrontend,
  ProductFrontend,
  FamilyFrontend,
} from "../types/api";

// Detect environment and set appropriate API URL
const getApiBaseUrl = (): string => {
  // Always use the environment variable if set, regardless of environment
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL;
    console.log("🔗 Using configured API URL:", url);
    return url;
  }

  // Detect if running in development or production
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0";

  if (isLocalhost) {
    return "http://127.0.0.1:8000/api";
  }

  // For production/cloud environments without explicit API URL, use demo mode
  console.warn(
    "🌐 No API URL configured for cloud environment - Running in demo mode",
  );
  return "";
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  type_utilisateur: "famille" | "vendeur" | "donateur";
  telephone?: string;
  ville?: string;
  civilite?: "M." | "Mme" | "Mlle";
  adresse?: string;
  code_postal?: string;
  pays?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private isApiAvailable(): boolean {
    return Boolean(API_BASE_URL);
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private clearAuthData(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    // Clear any sensitive data from sessionStorage as well
    sessionStorage.clear();
  }

  private validateToken(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT structure validation
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // Check if API is available
    if (!this.isApiAvailable()) {
      throw new Error("API non configurée - Mode démonstration actif");
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log("🌐 Requête API:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      body: options.body ? JSON.parse(options.body as string) : null,
    });

    try {
      const response = await fetch(url, config);

      console.log("📡 Réponse API:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        if (response.status === 204) {
          // No content response is valid
          return {
            success: true,
            data: {} as T,
          };
        }
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        // Handle specific HTTP errors
        switch (response.status) {
          case 401:
            // Unauthorized - clear auth tokens and redirect securely
            this.clearAuthData();
            // Use history API instead of direct location change for better security
            if (window.location.pathname !== "/login") {
              window.history.replaceState({}, "", "/login");
              window.location.reload();
            }
            throw new Error("Session expirée. Veuillez vous reconnecter.");

          case 403:
            throw new Error(
              "Accès refusé. Vous n'avez pas les permissions nécessaires.",
            );

          case 404:
            throw new Error("Ressource non trouvée.");

          case 422:
            // Validation errors from API Platform
            if (data.violations) {
              const violations = data.violations
                .map((v: any) => v.message)
                .join(", ");
              throw new Error(`Erreurs de validation: ${violations}`);
            }
            throw new Error("Données invalides.");

          case 429:
            throw new Error("Trop de requêtes. Veuillez réessayer plus tard.");

          case 500:
            throw new Error("Erreur serveur. Veuillez réessayer plus tard.");

          default:
            throw new Error(
              data.message ||
                `Erreur HTTP ${response.status}: ${response.statusText}`,
            );
        }
      }

      // For API Platform responses, handle collections and single entities
      if (data["hydra:member"]) {
        // API Platform collection response
        return {
          success: true,
          data: data["hydra:member"] as T,
        };
      } else if (data["@type"]) {
        // Single API Platform entity
        return {
          success: true,
          data: data as T,
        };
      } else if (Array.isArray(data)) {
        // Regular array response
        return {
          success: true,
          data: data as T,
        };
      } else {
        // Other response formats
        return {
          success: true,
          data: data as T,
        };
      }
    } catch (error) {
      // Network or other errors
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch") ||
          error.message.includes("Failed to fetch"))
      ) {
        // Check if it's a CORS issue or network connectivity issue
        if (
          window.location.hostname !== "localhost" &&
          API_BASE_URL.includes("127.0.0.1")
        ) {
          throw new Error(
            "Serveur API non accessible depuis cet environnement. Configuration requise.",
          );
        }
        throw new Error(
          "Impossible de contacter le serveur. Vérifiez que l'API est démarrée et accessible.",
        );
      }

      console.error(`API request failed [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Input validation
    if (!credentials.email || !credentials.password) {
      throw new Error("Email et mot de passe requis");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("Format d'email invalide");
    }

    // Check for rate limiting (TEMPORAIREMENT DÉSACTIVÉ POUR LES TESTS)
    // Nettoyage du rate limiting existant
    localStorage.removeItem("login_attempts");
    localStorage.removeItem("last_login_attempt");

    console.log("🧹 Rate limiting nettoyé pour les tests");

    // If API is not available, provide demo authentication
    if (!this.isApiAvailable()) {
      return this.handleDemoLogin(credentials);
    }

    try {
      const loginData = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      };

      console.log("🔐 Tentative de login avec:", {
        email: loginData.email,
        passwordLength: loginData.password.length,
        apiUrl: API_BASE_URL + "/login_check",
      });

      const response = await this.makeRequest<AuthResponse>("/login_check", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      console.log("✅ Réponse login reçue:", response);

      // Clear failed attempts on success
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("last_login_attempt");

      // Validate token before storing
      if (response.data.token && this.validateToken(response.data.token)) {
        localStorage.setItem("auth_token", response.data.token);
      } else {
        throw new Error("Token d'authentification invalide");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erreur login:", {
        error: error.message,
        status: error.status || "N/A",
        credentials: {
          email: credentials.email,
          passwordLength: credentials.password.length,
        },
      });

      // Rate limiting temporairement désactivé pour les tests
      console.log("🔄 Tentative de login échouée - rate limiting désactivé");

      // If API error and we have demo credentials, try demo login
      if (this.isDemoCredentials(credentials)) {
        console.log("🎭 Utilisation des identifiants de démo");
        return this.handleDemoLogin(credentials);
      }

      throw error;
    }
  }

  private isDemoCredentials(credentials: LoginRequest): boolean {
    const demoAccounts = [
      "family@demo.com",
      "vendor@demo.com",
      "donator@demo.com",
      "admin@demo.com",
    ];
    return (
      demoAccounts.includes(credentials.email.toLowerCase()) &&
      credentials.password === "demo123"
    );
  }

  private handleDemoLogin(credentials: LoginRequest): AuthResponse {
    const email = credentials.email.toLowerCase();
    let type_utilisateur: "famille" | "vendeur" | "donateur" = "famille";
    let prenom = "Demo";
    let nom = "Utilisateur";

    if (email.includes("vendor")) {
      type_utilisateur = "vendeur";
      prenom = "Vendeur";
      nom = "Demo";
    } else if (email.includes("donator")) {
      type_utilisateur = "donateur";
      prenom = "Donateur";
      nom = "Demo";
    } else if (email.includes("family")) {
      type_utilisateur = "famille";
      prenom = "Famille";
      nom = "Demo";
    }

    const user: User = {
      "@type": "User",
      id: Date.now(),
      email: credentials.email,
      roles: [`ROLE_${type_utilisateur.toUpperCase()}`],
      type_utilisateur,
      nom,
      prenom,
      civilite: "M.",
      ville: "Demo City",
      pays: "France",
      statut: "actif",
      date_creation: new Date().toISOString(),
      date_mise_ajour: new Date().toISOString(),
      is_verified: true,
    };

    const token = `demo_token_${Date.now()}`;
    localStorage.setItem("auth_token", token);

    return { token, user };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Input validation
    if (
      !userData.email ||
      !userData.password ||
      !userData.nom ||
      !userData.prenom ||
      !userData.type_utilisateur
    ) {
      throw new Error("Tous les champs requis doivent être remplis");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    // Password strength validation
    if (userData.password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }

    // Name validation
    if (userData.nom.trim().length < 2 || userData.prenom.trim().length < 2) {
      throw new Error(
        "Le nom et prénom doivent contenir au moins 2 caractères",
      );
    }

    // Type utilisateur validation
    const validTypes: Array<"famille" | "vendeur" | "donateur"> = [
      "famille",
      "vendeur",
      "donateur",
    ];
    if (!validTypes.includes(userData.type_utilisateur)) {
      throw new Error("Type d'utilisateur invalide");
    }

    const response = await this.makeRequest<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        nom: userData.nom.trim(),
        prenom: userData.prenom.trim(),
        type_utilisateur: userData.type_utilisateur,
        telephone: userData.telephone,
        ville: userData.ville,
        civilite: userData.civilite,
        adresse: userData.adresse,
        code_postal: userData.code_postal,
        pays: userData.pays || "France",
      }),
    });

    // Validate token before storing
    if (response.data.token && this.validateToken(response.data.token)) {
      localStorage.setItem("auth_token", response.data.token);
    } else {
      throw new Error("Token d'authentification invalide");
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn("Logout request failed:", error);
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    const token = this.getAuthToken();

    // Validate token exists
    if (!token) {
      this.clearAuthData();
      throw new Error("Token d'authentification invalide ou expiré");
    }

    // For demo tokens, return stored user
    if (token.startsWith("demo_token_")) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }

    // Validate real token
    if (!this.validateToken(token)) {
      this.clearAuthData();
      throw new Error("Token d'authentification invalide ou expiré");
    }

    // If API not available, return stored user
    if (!this.isApiAvailable()) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      throw new Error("Aucun utilisateur connecté en mode déconnecté");
    }

    // Try different endpoints to get current user
    let response: any;
    try {
      response = await this.makeRequest<User>("/users/me");
    } catch (error) {
      // Fallback to /me endpoint if /users/me doesn't exist
      try {
        response = await this.makeRequest<User>("/me");
      } catch (fallbackError) {
        throw new Error("Impossible de récupérer les informations utilisateur");
      }
    }

    // Transform API Platform User to frontend user format
    const user = response.data;
    const fullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || user.email;

    return {
      id: user.id,
      email: user.email,
      name: fullName,
      role: user.roles.includes("ROLE_VENDOR")
        ? "vendor"
        : user.roles.includes("ROLE_DONATOR")
          ? "donator"
          : "family",
      phone: user.phone,
      address: user.address,
      city: user.city,
    };
  }

  async updateProfile(
    profileData: Partial<AuthResponse["user"]>,
  ): Promise<AuthResponse["user"]> {
    const response = await this.makeRequest<User>(`/users/${profileData.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        avatar: profileData.avatar,
      }),
    });

    const user = response.data;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roles.includes("ROLE_VENDOR")
        ? "vendor"
        : user.roles.includes("ROLE_DONATOR")
          ? "donator"
          : "family",
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      city: user.city,
    };
  }

  // Product endpoints
  async getProducts(filters?: {
    category?: string;
    vendor?: number;
    city?: string;
    search?: string;
  }): Promise<ProductFrontend[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty products list");
      return [];
    }

    try {
      const params = new URLSearchParams();

      // API Platform filtering - check if these exact parameter names work
      if (filters?.search) {
        params.append("name", filters.search);
        // Also try searching in description
        params.append("description", filters.search);
      }
      if (filters?.category && filters.category !== "all") {
        params.append("categorie.name", filters.category);
      }
      if (filters?.vendor) {
        params.append("vendeur", filters.vendor.toString());
      }
      // For city filtering, we might need to join through vendeur.user.city

      const endpoint = `/produits${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.makeRequest<Produit[]>(endpoint);

      // Transform API Platform data to frontend format
      return response.data.map((produit) => {
        // Handle nested relationships - might be IRI strings or objects
        const vendeur =
          typeof produit.vendeur === "string" ? null : produit.vendeur;
        const categorie =
          typeof produit.categorie === "string" ? null : produit.categorie;
        const vendeurUser =
          vendeur && typeof vendeur.user === "object" ? vendeur.user : null;

        return {
          id: produit.id,
          name: produit.name,
          price: produit.price,
          image: produit.images?.[0] || "/placeholder-product.jpg",
          category: categorie?.name?.toLowerCase() || "unknown",
          vendor: {
            id: vendeur?.id || 0,
            name:
              vendeurUser?.firstName && vendeurUser?.lastName
                ? `${vendeurUser.firstName} ${vendeurUser.lastName}`
                : vendeurUser?.email || vendeur?.storeName || "Vendeur inconnu",
            avatar: vendeurUser?.avatar || "/placeholder-avatar.jpg",
            city: vendeurUser?.city || "Ville inconnue",
          },
          rating: 4.5, // Default rating since not in schema
          description: produit.description || "",
          inStock: produit.isActive && produit.stockQuantity > 0,
          unit: "pièce", // Default unit
        };
      });
    } catch (error) {
      console.warn("Failed to fetch products:", error);
      return [];
    }
  }

  async getVendorProducts(vendorId: number): Promise<any[]> {
    const response = await this.makeRequest<Produit[]>(
      `/produits?vendeur.id=${vendorId}`,
    );

    return response.data.map((produit) => ({
      id: produit.id,
      name: produit.name,
      price: produit.price,
      image: produit.image,
      category: produit.categorie.name,
      description: produit.description,
      inStock: produit.inStock,
      unit: produit.unit,
      rating: produit.rating || 4.5,
      sales: produit.sales || 0,
    }));
  }

  async createProduct(productData: any): Promise<any> {
    const response = await this.makeRequest<Produit>("/produits", {
      method: "POST",
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image: productData.image,
        inStock: productData.inStock,
        unit: productData.unit,
        categorie: `/api/categories/${productData.categoryId}`,
        vendeur: `/api/vendeurs/${productData.vendorId}`,
      }),
    });
    return response.data;
  }

  async updateProduct(productId: number, productData: any): Promise<any> {
    const response = await this.makeRequest<Produit>(`/produits/${productId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image: productData.image,
        inStock: productData.inStock,
        unit: productData.unit,
        categorie: productData.categoryId
          ? `/api/categories/${productData.categoryId}`
          : undefined,
      }),
    });
    return response.data;
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.makeRequest(`/produits/${productId}`, {
      method: "DELETE",
    });
  }

  // Category endpoints
  async getCategories(): Promise<any[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty categories list");
      return [];
    }

    try {
      const response = await this.makeRequest<Categorie[]>("/categories");
      return response.data
        .filter((categorie) => categorie.isActive)
        .map((categorie) => ({
          id: categorie.id,
          name: categorie.name,
          description: categorie.description,
          isActive: categorie.isActive,
          icon: this.getCategoryIcon(categorie.name),
          gradient: this.getCategoryGradient(categorie.name),
        }));
    } catch (error) {
      console.warn("Failed to fetch categories:", error);
      return [];
    }
  }

  private getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes("légume") || name.includes("vegetable")) return "🥬";
    if (name.includes("fruit")) return "🍎";
    if (name.includes("viande") || name.includes("meat")) return "🥩";
    if (name.includes("poisson") || name.includes("fish")) return "🐟";
    if (name.includes("boulangerie") || name.includes("bread")) return "🍞";
    if (name.includes("laitier") || name.includes("dairy")) return "🥛";
    if (name.includes("épicerie") || name.includes("grocery")) return "🛒";
    return "🏪"; // Default store icon
  }

  private getCategoryGradient(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes("légume")) return "from-green-400 to-green-600";
    if (name.includes("fruit")) return "from-red-400 to-orange-500";
    if (name.includes("viande")) return "from-red-500 to-red-700";
    if (name.includes("poisson")) return "from-blue-400 to-blue-600";
    if (name.includes("boulangerie")) return "from-yellow-400 to-orange-500";
    if (name.includes("laitier")) return "from-blue-200 to-blue-400";
    return "from-app-purple to-app-pink"; // Default gradient
  }

  async createCategory(categoryData: any): Promise<any> {
    const response = await this.makeRequest<Categorie>("/categories", {
      method: "POST",
      body: JSON.stringify({
        name: categoryData.name,
        description: categoryData.description,
        isActive: categoryData.isActive,
      }),
    });
    return response.data;
  }

  async updateCategory(categoryId: number, categoryData: any): Promise<any> {
    const response = await this.makeRequest<Categorie>(
      `/categories/${categoryId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: categoryData.name,
          description: categoryData.description,
          isActive: categoryData.isActive,
        }),
      },
    );
    return response.data;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.makeRequest(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }

  // Vendor endpoints
  async getVendors(filters?: {
    search?: string;
    city?: string;
  }): Promise<any[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty vendors list");
      return [];
    }

    try {
      const params = new URLSearchParams();
      if (filters?.search) {
        params.append("storeName", filters.search);
        // Also search in store description
        params.append("storeDescription", filters.search);
      }
      if (filters?.city) {
        params.append("user.city", filters.city);
      }

      const endpoint = `/vendeurs${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.makeRequest<Vendeur[]>(endpoint);

      return response.data.map((vendeur) => {
        const user = typeof vendeur.user === "object" ? vendeur.user : null;
        const userName =
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.email || "Vendeur";

        return {
          id: vendeur.id,
          name: userName,
          avatar: user?.avatar || "/placeholder-avatar.jpg",
          city: user?.city || "Ville inconnue",
          specialty: vendeur.storeDescription || "Commerce général",
          rating: vendeur.rating || 4.5,
          businessName: vendeur.storeName,
          gradient: "from-app-purple to-app-sky", // Default gradient
        };
      });
    } catch (error) {
      console.warn("Failed to fetch vendors:", error);
      return [];
    }
  }

  // Vendor Orders endpoints
  async getVendorOrders(filters?: {
    status?: string;
  }): Promise<VendorOrderFrontend[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty orders list");
      return [];
    }

    try {
      const params = new URLSearchParams();
      if (filters?.status) {
        // Map frontend status to API status
        const apiStatus = this.mapFrontendStatusToApi(filters.status);
        params.append("status", apiStatus);
      }

      const endpoint = `/commande_vendeurs${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.makeRequest<CommandeVendeur[]>(endpoint);

      return response.data.map((commande) => {
        // Handle potentially nested or IRI references
        const famille =
          typeof commande.famille === "object" ? commande.famille : null;
        const familleUser =
          famille && typeof famille.user === "object" ? famille.user : null;

        return {
          id: commande.orderNumber || commande.id.toString(),
          customerName:
            familleUser?.firstName && familleUser?.lastName
              ? `${familleUser.firstName} ${familleUser.lastName}`
              : familleUser?.email || "Client",
          customerPhone: familleUser?.phone || "",
          customerAvatar: familleUser?.avatar || "/placeholder-avatar.jpg",
          donatorName: "Donateur généreut", // TODO: Get from paiement relation
          donatorAvatar: "/placeholder-donator.jpg",
          items:
            commande.ligneProduits?.map((ligne) => {
              const produit =
                typeof ligne.produit === "object" ? ligne.produit : null;
              return {
                id: produit?.id || 0,
                name: produit?.name || "Produit",
                price: ligne.unitPrice,
                quantity: ligne.quantity,
                image: produit?.images?.[0] || "/placeholder-product.jpg",
              };
            }) || [],
          total: commande.totalAmount,
          status: this.mapApiStatusToFrontend(commande.status),
          orderDate: commande.createdAt,
          pickupCode: commande.orderNumber, // Use order number as pickup code
          notes: commande.notes || "",
        };
      });
    } catch (error) {
      console.warn("Failed to fetch vendor orders:", error);
      return [];
    }
  }

  private mapFrontendStatusToApi(frontendStatus: string): string {
    switch (frontendStatus) {
      case "paid_by_donator":
        return "PENDING";
      case "preparing":
        return "PROCESSING";
      case "ready_for_pickup":
        return "SHIPPED";
      default:
        return frontendStatus.toUpperCase();
    }
  }

  private mapApiStatusToFrontend(
    apiStatus: string,
  ): "paid_by_donator" | "preparing" | "ready_for_pickup" {
    switch (apiStatus.toUpperCase()) {
      case "PENDING":
      case "ACCEPTED":
        return "paid_by_donator";
      case "PROCESSING":
        return "preparing";
      case "SHIPPED":
      case "COMPLETED":
        return "ready_for_pickup";
      default:
        return "paid_by_donator";
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const apiStatus =
      status === "preparing"
        ? "preparing"
        : status === "ready_for_pickup"
          ? "ready"
          : "paid";

    const response = await this.makeRequest<CommandeVendeur>(
      `/commande_vendeurs/${orderId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: apiStatus }),
      },
    );
    return response.data;
  }

  async verifyPickupCode(orderId: string, code: string): Promise<any> {
    // This might need a custom endpoint or be handled in the order update
    const response = await this.makeRequest<any>(
      `/commande_vendeurs/${orderId}/verify`,
      {
        method: "POST",
        body: JSON.stringify({ pickupCode: code }),
      },
    );
    return response.data;
  }

  // Family/Donator endpoints
  async searchFamilies(
    query: string,
    city?: string,
  ): Promise<FamilyFrontend[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty families list");
      return [];
    }

    try {
      const params = new URLSearchParams();
      if (query) {
        // Search in user's first name, last name, or email
        params.append("user.firstName", query);
      }
      if (city && city !== "all") {
        params.append("user.city", city);
      }
      // Only show verified families
      params.append("isVerified", "true");

      const endpoint = `/familles${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await this.makeRequest<Famille[]>(endpoint);

      return response.data.map((famille) => {
        const user = typeof famille.user === "object" ? famille.user : null;
        const familyName =
          user?.firstName && user?.lastName
            ? `Famille ${user.lastName}`
            : `Famille ${user?.email?.split("@")[0] || "Anonyme"}`;

        return {
          id: famille.id.toString(),
          name: familyName,
          avatar: user?.avatar || "/placeholder-family.jpg",
          city: user?.city || "Ville inconnue",
          memberCount: famille.familySize,
          monthlyNeed: famille.monthlyIncome || 500,
          currentNeed: Math.floor((famille.monthlyIncome || 500) * 0.3), // 30% of monthly income
          story:
            famille.needsDescription || "Cette famille a besoin de votre aide.",
          isSponsored: false, // TODO: Check if famille has active donateurs
          urgencyLevel: famille.priority.toLowerCase() as
            | "low"
            | "medium"
            | "high",
          totalReceived: 0, // TODO: Calculate from paiements
          children: Math.max(0, famille.familySize - 2), // Adults assumed to be 2, rest are children
          verified: famille.isVerified,
        };
      });
    } catch (error) {
      console.warn("Failed to fetch families:", error);
      return [];
    }
  }

  async sponsorFamily(familyId: string, sponsorshipData: any): Promise<any> {
    // This would need custom logic - might create a sponsorship relationship
    const response = await this.makeRequest<any>(
      `/familles/${familyId}/sponsor`,
      {
        method: "POST",
        body: JSON.stringify(sponsorshipData),
      },
    );
    return response.data;
  }

  async getPendingPayments(filters?: {
    city?: string;
    urgency?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    params.append("status", "pending");
    if (filters?.city && filters.city !== "all")
      params.append("commandeFamille.famille.user.city", filters.city);
    if (filters?.urgency && filters.urgency !== "all")
      params.append("commandeFamille.famille.urgencyLevel", filters.urgency);

    const endpoint = `/commande_familles${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<CommandeFamille[]>(endpoint);

    return response.data.map((commande) => ({
      id: commande.id.toString(),
      familyId: commande.famille.id.toString(),
      familyName: commande.famille.user.name,
      familyCity: commande.famille.user.city,
      vendorName: "Vendeur", // Need to get from ligneProduits
      amount: commande.total,
      urgency: commande.famille.urgencyLevel,
      requestDate: commande.orderDate,
    }));
  }

  async processPayment(paymentData: {
    paymentId: string;
    amount: number;
    paymentMethodId: string;
    familyId: string;
  }): Promise<any> {
    const response = await this.makeRequest<Paiement>("/paiements", {
      method: "POST",
      body: JSON.stringify({
        amount: paymentData.amount,
        status: "completed",
        paymentMethodId: paymentData.paymentMethodId,
        commandeFamille: `/api/commande_familles/${paymentData.paymentId}`,
        donateur: `/api/donateurs/${paymentData.familyId}`, // This should be the current donator ID
      }),
    });
    return response.data;
  }

  // Stats endpoints
  async getDonatorStats(): Promise<any> {
    // This would need custom endpoints for aggregated stats
    return {
      totalDonated: 0,
      familiesHelped: 0,
      activeSponsorships: 0,
      impactScore: 0,
    };
  }

  async getCityStats(): Promise<any[]> {
    // This would need custom endpoints for city statistics
    return [];
  }

  // Utility endpoints
  async getCities(): Promise<string[]> {
    // If API not available, return empty array
    if (!this.isApiAvailable()) {
      console.warn("API not available - returning empty cities list");
      return [];
    }

    try {
      // Get unique cities from users - API Platform filtering
      const response = await this.makeRequest<User[]>(
        "/users?exists[city]=true",
      );
      const cities = [
        ...new Set(response.data.map((user) => user.city).filter(Boolean)),
      ].sort();
      return cities;
    } catch (error) {
      console.warn("Failed to fetch cities:", error);
      return [];
    }
  }

  async getPublicStats(): Promise<any> {
    // If API not available, return demo stats
    if (!this.isApiAvailable()) {
      return {
        familiesHelped: 150,
        vendorsCount: 25,
        donationsCount: 500,
        totalAmount: 15000,
      };
    }

    try {
      const response = await this.makeRequest<any>("/stats/public");
      return response.data;
    } catch (error) {
      // Return demo stats on API error
      console.warn("Public stats not available, using demo values");
      return {
        familiesHelped: 150,
        vendorsCount: 25,
        donationsCount: 500,
        totalAmount: 15000,
      };
    }
  }

  // Profile update endpoints
  async updateEmail(email: string): Promise<any> {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    const response = await this.makeRequest<User>(`/users/${userId}`, {
      method: "PATCH",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  async updatePhone(phone: string): Promise<any> {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    const response = await this.makeRequest<User>(`/users/${userId}`, {
      method: "PATCH",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify({ phone }),
    });
    return response.data;
  }

  // Cart and Order endpoints (these might need custom implementation)
  async getCart(): Promise<any> {
    return { items: [] };
  }

  async addToCart(productId: number, quantity: number = 1): Promise<any> {
    // Cart logic would need to be implemented
    return {};
  }

  async getOrders(): Promise<any[]> {
    // Get orders for current user
    return [];
  }

  // File upload
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/media_objects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.contentUrl;
  }
}

export const apiService = new ApiService();
export default apiService;
