// Service API optimisé pour hiba_db - Révision complète 2025
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
  Cagnotte,
  Notification,
  Evaluation,
  Probleme,
  ApiCollection,
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  ProductFilters,
  VendorFilters,
  FamilyFilters,
  OrderFilters,
  OrderStatus,
  PaymentStatus,
} from "../types/api";
import {
  validateData,
  schemas,
  Sanitizer,
  SecurityUtils,
  RateLimiter
} from "../utils/validation";

// Configuration API
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0";

  if (isLocalhost) {
    return "http://127.0.0.1:8000/api";
  }

  console.warn("🌐 No API URL configured for cloud environment - Demo mode");
  return "";
};

const API_BASE_URL = getApiBaseUrl();

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
    sessionStorage.clear();
  }

  private validateToken(token: string): boolean {
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

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
    if (!this.isApiAvailable()) {
      throw new Error("API non configurée - Mode démonstration actif");
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log("🌐 API Request:", { url, method: config.method || "GET" });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        const responseText = await response.text();
        if (!responseText.trim()) {
          data = {};
        } else {
          data = JSON.parse(responseText);
        }
      } catch (jsonError) {
        if (response.status === 204) {
          return { success: true, data: {} as T };
        }
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        switch (response.status) {
          case 401:
            this.clearAuthData();
            if (window.location.pathname !== "/login") {
              window.history.replaceState({}, "", "/login");
              window.location.reload();
            }
            throw new Error("Session expirée. Veuillez vous reconnecter.");

          case 403:
            throw new Error("Accès refusé. Permissions insuffisantes.");

          case 404:
            throw new Error("Ressource non trouvée.");

          case 422:
            if (data.violations) {
              const violations = data.violations
                .map((v: any) => v.message)
                .join(", ");
              throw new Error(`Erreurs de validation: ${violations}`);
            }
            throw new Error("Données invalides.");

          case 429:
            throw new Error("Trop de requêtes. Réessayez plus tard.");

          case 500:
            throw new Error("Erreur serveur. Réessayez plus tard.");

          default:
            throw new Error(
              data.message || `Erreur HTTP ${response.status}`,
            );
        }
      }

      // Handle API Platform responses
      if (data["hydra:member"]) {
        return { success: true, data: data["hydra:member"] as T };
      } else if (data["@type"]) {
        return { success: true, data: data as T };
      } else {
        return { success: true, data: data as T };
      }
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Timeout: Requête trop lente");
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Impossible de contacter le serveur API");
      }

      throw error;
    }
  }

  // ===== AUTH ENDPOINTS =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Validation avec Zod
    const validation = validateData(schemas.login, credentials);
    if (!validation.success) {
      const errorMessage = validation.errors?.map(e => e.message).join(", ") || "Données invalides";
      throw new Error(errorMessage);
    }

    // Rate limiting
    const rateLimitKey = `login:${credentials.email}`;
    const rateLimit = RateLimiter.checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.remainingTime || 0) / 60000);
      throw new Error(`Trop de tentatives de connexion. Réessayez dans ${minutes} minutes.`);
    }

    // Sanitisation
    const sanitizedCredentials = {
      email: Sanitizer.sanitizeEmail(credentials.email),
      password: credentials.password, // Ne pas sanitiser le mot de passe
    };

    if (!this.isApiAvailable()) {
      return this.handleDemoLogin(sanitizedCredentials);
    }

    try {
      const response = await this.makeRequest<AuthResponse>("/login_check", {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      if (response.data.token && this.validateToken(response.data.token)) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error("Token d'authentification invalide");
      }

      return response.data;
    } catch (error) {
      if (this.isDemoCredentials(credentials)) {
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
      date_creation: new Date().toISOString(),
      date_mise_ajour: new Date().toISOString(),
      is_verified: true,
    };

    const token = `demo_token_${Date.now()}`;
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Validation des données
    if (
      !userData.email ||
      !userData.password ||
      !userData.nom ||
      !userData.prenom ||
      !userData.type_utilisateur
    ) {
      throw new Error("Tous les champs requis doivent être remplis");
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Format d'email invalide");
    }

    if (userData.password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }

    const response = await this.makeRequest<AuthResponse>("/users", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        nom: userData.nom.trim(),
        prenom: userData.prenom.trim(),
        type_utilisateur: userData.type_utilisateur,
        civilite: userData.civilite,
        telephone: userData.telephone,
        adresse: userData.adresse,
        compl_adresse: userData.compl_adresse,
        code_postal: userData.code_postal,
        ville: userData.ville,
        pays: userData.pays || "France",
      }),
    });

    if (response.data.token && this.validateToken(response.data.token)) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  async logout(): Promise<void> {
    this.clearAuthData();
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("Non authentifié");
    }

    if (token.startsWith("demo_token_")) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }

    if (!this.validateToken(token)) {
      this.clearAuthData();
      throw new Error("Token expiré");
    }

    const response = await this.makeRequest<User>("/users/me");
    return response.data;
  }

  // ===== USER ENDPOINTS =====
  async updateProfile(userId: number, profileData: Partial<User>): Promise<User> {
    const response = await this.makeRequest<User>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        nom: profileData.nom,
        prenom: profileData.prenom,
        telephone: profileData.telephone,
        adresse: profileData.adresse,
        compl_adresse: profileData.compl_adresse,
        code_postal: profileData.code_postal,
        ville: profileData.ville,
        pays: profileData.pays,
      }),
    });

    return response.data;
  }

  // ===== PRODUIT ENDPOINTS =====
  async getProducts(filters?: ProductFilters): Promise<Produit[]> {
    if (!this.isApiAvailable()) {
      return [];
    }

    const params = new URLSearchParams();

    if (filters?.search) {
      params.append("nom_produit", filters.search);
    }
    if (filters?.category && filters.category !== "all") {
      params.append("categorie.nom_categorie", filters.category);
    }
    if (filters?.vendor) {
      params.append("vendeur.id", filters.vendor.toString());
    }
    if (filters?.city) {
      params.append("vendeur.user.ville", filters.city);
    }
    if (filters?.minPrice) {
      params.append("prix[gte]", filters.minPrice.toString());
    }
    if (filters?.maxPrice) {
      params.append("prix[lte]", filters.maxPrice.toString());
    }
    if (filters?.available !== undefined) {
      params.append("est_disponible", filters.available.toString());
    }

    const endpoint = `/produits${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<Produit[]>(endpoint);

    return response.data;
  }

  async getProduct(id: number): Promise<Produit> {
    const response = await this.makeRequest<Produit>(`/produits/${id}`);
    return response.data;
  }

  async createProduct(productData: Partial<Produit>): Promise<Produit> {
    const response = await this.makeRequest<Produit>("/produits", {
      method: "POST",
      body: JSON.stringify({
        nom_produit: productData.nom_produit,
        description: productData.description,
        prix: productData.prix,
        quantite_dispo: productData.quantite_dispo,
        est_disponible: productData.est_disponible,
        image_url: productData.image_url,
        categorie: `/api/categories/${productData.categorie_id}`,
        vendeur: `/api/vendeurs/${productData.vendeur_id}`,
      }),
    });
    return response.data;
  }

  async updateProduct(id: number, productData: Partial<Produit>): Promise<Produit> {
    const response = await this.makeRequest<Produit>(`/produits/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nom_produit: productData.nom_produit,
        description: productData.description,
        prix: productData.prix,
        quantite_dispo: productData.quantite_dispo,
        est_disponible: productData.est_disponible,
        image_url: productData.image_url,
      }),
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.makeRequest(`/produits/${id}`, {
      method: "DELETE",
    });
  }

  // ===== CATEGORIE ENDPOINTS =====
  async getCategories(): Promise<Categorie[]> {
    if (!this.isApiAvailable()) {
      return [];
    }

    const response = await this.makeRequest<Categorie[]>("/categories");
    return response.data;
  }

  async createCategory(categoryData: Partial<Categorie>): Promise<Categorie> {
    const response = await this.makeRequest<Categorie>("/categories", {
      method: "POST",
      body: JSON.stringify({
        nom_categorie: categoryData.nom_categorie,
      }),
    });
    return response.data;
  }

  // ===== VENDEUR ENDPOINTS =====
  async getVendors(filters?: VendorFilters): Promise<Vendeur[]> {
    if (!this.isApiAvailable()) {
      return [];
    }

    const params = new URLSearchParams();
    if (filters?.search) {
      params.append("nom_societe", filters.search);
    }
    if (filters?.city) {
      params.append("user.ville", filters.city);
    }

    const endpoint = `/vendeurs${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<Vendeur[]>(endpoint);

    return response.data;
  }

  async getVendor(id: number): Promise<Vendeur> {
    const response = await this.makeRequest<Vendeur>(`/vendeurs/${id}`);
    return response.data;
  }

  // ===== FAMILLE ENDPOINTS =====
  async getFamilies(filters?: FamilyFilters): Promise<Famille[]> {
    if (!this.isApiAvailable()) {
      return [];
    }

    const params = new URLSearchParams();
    if (filters?.search) {
      params.append("user.prenom", filters.search);
    }
    if (filters?.city) {
      params.append("user.ville", filters.city);
    }
    if (filters?.minMembers) {
      params.append("nombre_membres[gte]", filters.minMembers.toString());
    }
    if (filters?.maxMembers) {
      params.append("nombre_membres[lte]", filters.maxMembers.toString());
    }

    const endpoint = `/familles${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<Famille[]>(endpoint);

    return response.data;
  }

  // ===== COMMANDE ENDPOINTS =====
  async getCommandesFamille(filters?: OrderFilters): Promise<CommandeFamille[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append("statut", filters.status);
    }
    if (filters?.dateFrom) {
      params.append("date_creation[gte]", filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append("date_creation[lte]", filters.dateTo);
    }

    const endpoint = `/commande_familles${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<CommandeFamille[]>(endpoint);

    return response.data;
  }

  async getCommandesVendeur(filters?: OrderFilters): Promise<CommandeVendeur[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append("statut", filters.status);
    }

    const endpoint = `/commande_vendeurs${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await this.makeRequest<CommandeVendeur[]>(endpoint);

    return response.data;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<CommandeVendeur> {
    const response = await this.makeRequest<CommandeVendeur>(
      `/commande_vendeurs/${orderId}`,
      {
        method: "PUT",
        body: JSON.stringify({ statut: status }),
      },
    );
    return response.data;
  }

  // ===== PAIEMENT ENDPOINTS =====
  async createPaiement(paiementData: Partial<Paiement>): Promise<Paiement> {
    const response = await this.makeRequest<Paiement>("/paiements", {
      method: "POST",
      body: JSON.stringify({
        montant_total: paiementData.montant_total,
        moyen_paiement: paiementData.moyen_paiement,
        statut: paiementData.statut || PaymentStatus.PENDING,
        donateur: `/api/donateurs/${paiementData.donateur_id}`,
      }),
    });
    return response.data;
  }

  // ===== NOTIFICATION ENDPOINTS =====
  async getNotifications(userId: number): Promise<Notification[]> {
    const response = await this.makeRequest<Notification[]>(
      `/notifications?user.id=${userId}`,
    );
    return response.data;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.makeRequest<Notification>(`/notifications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ vue: true }),
    });
    return response.data;
  }

  // ===== EVALUATION ENDPOINTS =====
  async createEvaluation(evaluationData: Partial<Evaluation>): Promise<Evaluation> {
    const response = await this.makeRequest<Evaluation>("/evaluations", {
      method: "POST",
      body: JSON.stringify({
        note: evaluationData.note,
        commentaire: evaluationData.commentaire,
        famille: `/api/familles/${evaluationData.famille_id}`,
        vendeur: `/api/vendeurs/${evaluationData.vendeur_id}`,
      }),
    });
    return response.data;
  }

  // ===== UTILITY ENDPOINTS =====
  async getCities(): Promise<string[]> {
    if (!this.isApiAvailable()) {
      return [];
    }

    try {
      const response = await this.makeRequest<User[]>("/users?exists[ville]=true");
      const cities = [
        ...new Set(response.data.map((user) => user.ville).filter(Boolean)),
      ].sort();
      return cities;
    } catch {
      return [];
    }
  }

  async getStats(): Promise<any> {
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
    } catch {
      return {
        familiesHelped: 150,
        vendorsCount: 25,
        donationsCount: 500,
        totalAmount: 15000,
      };
    }
  }

  // ===== FILE UPLOAD =====
  async uploadFile(file: File): Promise<string> {
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
