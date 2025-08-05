import { UserRole } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
  name: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
    businessName?: string;
    specialty?: string;
    rating?: number;
    totalDonations?: number;
    donationsCount?: number;
  };
}

// Mock data for development when API is not available
const mockUsers = [
  {
    id: 1,
    email: "family@test.com",
    name: "Sophie Martin",
    role: "family" as UserRole,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b5b85644?w=100&h=100&fit=crop&crop=center",
    phone: "+33 6 12 34 56 78",
    address: "15 rue de la Paix",
    city: "Paris"
  },
  {
    id: 2,
    email: "vendor@test.com",
    name: "Ahmed Benali",
    role: "vendor" as UserRole,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
    businessName: "Épicerie du Soleil",
    specialty: "Produits frais et épicerie",
    rating: 4.8,
    phone: "+33 6 87 65 43 21",
    city: "Marseille"
  },
  {
    id: 3,
    email: "donator@test.com",
    name: "Marie Dubois",
    role: "donator" as UserRole,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
    totalDonations: 450.50,
    donationsCount: 23,
    phone: "+33 6 11 22 33 44",
    city: "Lyon"
  }
];

class ApiService {
  private apiAvailable: boolean = true;

  constructor() {
    // Start with API unavailable to use mock data by default
    this.apiAvailable = false;
    console.warn('🚧 Starting in mock data mode - Backend API will be detected on first request');
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // If forced to use mock data or API is not available, use mock responses
    if (USE_MOCK_DATA || !this.apiAvailable) {
      return this.getMockResponse<T>(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // If we can't parse JSON, the server might not be running properly
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON response');
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // API is working, mark as available
      this.apiAvailable = true;
      return data;
    } catch (error) {
      console.warn(`🚧 API request failed [${endpoint}], using mock data:`, error.message);

      // Any error means switch to mock mode
      this.apiAvailable = false;
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private async getMockResponse<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Mock authentication endpoints
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email } = body;
      const user = mockUsers.find(u => u.email === email);

      if (user) {
        const token = `mock_token_${Date.now()}`;
        return {
          success: true,
          data: { token, user } as T
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      const { email, name, role } = body;
      const newUser = {
        id: Date.now(),
        email,
        name,
        role,
        avatar: `https://images.unsplash.com/photo-${role === 'family' ? '1494790108755-2616b5b85644' : role === 'vendor' ? '1472099645785-5658abf4ff4e' : '1438761681033-6461ffad8d80'}?w=100&h=100&fit=crop&crop=center`
      };

      const token = `mock_token_${Date.now()}`;
      return {
        success: true,
        data: { token, user: newUser } as T
      };
    }

    if (endpoint === '/auth/logout' && method === 'POST') {
      // Mock logout - just return success
      return {
        success: true,
        data: {} as T,
        message: 'Logged out successfully'
      };
    }

    if (endpoint === '/users/profile' && method === 'GET') {
      // Return mock user based on stored token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return {
          success: true,
          data: JSON.parse(storedUser) as T
        };
      }
    }

    // Profile update endpoints
    if (endpoint === '/users/profile/email' && method === 'PUT') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const requestBody = JSON.parse(options.body as string);
        user.email = requestBody.email;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          data: user as T,
          message: 'Email mis à jour avec succès'
        };
      }
    }

    if (endpoint === '/users/profile/phone' && method === 'PUT') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const requestBody = JSON.parse(options.body as string);
        user.phone = requestBody.phone;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          data: user as T,
          message: 'Téléphone mis à jour avec succès'
        };
      }
    }

    if (endpoint === '/users/profile' && method === 'PUT') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const requestBody = JSON.parse(options.body as string);
        // Update user data with provided fields
        Object.assign(user, requestBody);
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          data: user as T,
          message: 'Profil mis à jour avec succès'
        };
      }
    }

    // Mock product endpoints with search filtering
    if (endpoint.startsWith('/products') && method === 'GET') {
      const mockProducts = [
        {
          id: 1,
          name: "Fresh Organic Tomatoes",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
          category: "vegetables",
          vendor: {
            id: 1,
            name: "Dr. Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
            city: "Paris",
          },
          rating: 4.8,
          description: "Fresh organic tomatoes grown locally",
          inStock: true,
          unit: "Kg",
        },
        {
          id: 2,
          name: "Golden Apples",
          price: 3.50,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
          category: "fruits",
          vendor: {
            id: 1,
            name: "Dr. Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
            city: "Paris",
          },
          rating: 4.6,
          description: "Sweet and crispy golden apples",
          inStock: true,
          unit: "Kg",
        },
        {
          id: 3,
          name: "Fresh Bread",
          price: 2.50,
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center",
          category: "bakery",
          vendor: {
            id: 2,
            name: "Ahmed Benali",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            city: "Lyon",
          },
          rating: 4.9,
          description: "Freshly baked bread every morning",
          inStock: true,
          unit: "piece",
        },
        {
          id: 4,
          name: "Cheese Selection",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop&crop=center",
          category: "dairy",
          vendor: {
            id: 2,
            name: "Ahmed Benali",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            city: "Lyon",
          },
          rating: 4.7,
          description: "Premium cheese selection from local farms",
          inStock: true,
          unit: "portion",
        }
      ];

      // Parse URL parameters for filtering
      const url = new URL(endpoint, 'http://localhost');
      const searchParam = url.searchParams.get('search');
      const categoryParam = url.searchParams.get('category');
      const vendorParam = url.searchParams.get('vendor');
      const cityParam = url.searchParams.get('city');

      let filteredProducts = mockProducts;

      // Apply search filter
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.vendor.name.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (categoryParam && categoryParam !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === categoryParam
        );
      }

      // Apply vendor filter
      if (vendorParam) {
        filteredProducts = filteredProducts.filter(product =>
          product.vendor.id === parseInt(vendorParam)
        );
      }

      // Apply city filter
      if (cityParam) {
        filteredProducts = filteredProducts.filter(product =>
          product.vendor.city.toLowerCase().includes(cityParam.toLowerCase())
        );
      }

      return {
        success: true,
        data: filteredProducts as T
      };
    }

    if (endpoint.startsWith('/vendors') && method === 'GET') {
      const mockVendors = [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
          city: "Paris",
          specialty: "Fruits & Vegetables",
          rating: 4.8,
          gradient: "from-app-purple to-app-sky",
        },
        {
          id: 2,
          name: "Ahmed Benali",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
          city: "Lyon",
          specialty: "Épicerie & Produits frais",
          rating: 4.9,
          gradient: "from-app-pink to-app-purple",
        },
        {
          id: 3,
          name: "Marie Dubois",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b68a7ad2?w=80&h=80&fit=crop&crop=face",
          city: "Marseille",
          specialty: "Boulangerie & Pâtisserie",
          rating: 4.7,
          gradient: "from-app-sky to-app-yellow",
        },
        {
          id: 4,
          name: "Pierre Martin",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
          city: "Toulouse",
          specialty: "Poissonnerie",
          rating: 4.6,
          gradient: "from-app-yellow to-app-purple",
        }
      ];

      // Parse URL parameters for search filtering
      const url = new URL(endpoint, 'http://localhost');
      const searchParam = url.searchParams.get('search');
      const cityParam = url.searchParams.get('city');

      let filteredVendors = mockVendors;

      // Apply search filter
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.name.toLowerCase().includes(searchLower) ||
          vendor.specialty.toLowerCase().includes(searchLower) ||
          vendor.city.toLowerCase().includes(searchLower)
        );
      }

      // Apply city filter
      if (cityParam) {
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.city.toLowerCase().includes(cityParam.toLowerCase())
        );
      }

      return {
        success: true,
        data: filteredVendors as T
      };
    }

    // Mock vendor products endpoint
    if (endpoint.startsWith('/vendors/') && endpoint.endsWith('/products') && method === 'GET') {
      // Return products for specific vendor
      const mockVendorProducts = [
        {
          id: 1,
          name: "Fresh Organic Tomatoes",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
          category: "Légumes",
          description: "Tomates biologiques fraîches",
          inStock: true,
          unit: "kg",
          rating: 4.8,
          sales: 45
        }
      ];

      return {
        success: true,
        data: mockVendorProducts as T
      };
    }

    if (endpoint === '/categories' && method === 'GET') {
      const mockCategories = [
        { id: 1, name: "Légumes", description: "Légumes frais et biologiques", isActive: true },
        { id: 2, name: "Fruits", description: "Fruits de saison", isActive: true },
        { id: 3, name: "Boulangerie", description: "Pain et viennoiseries", isActive: true },
        { id: 4, name: "Épicerie", description: "Produits d'épicerie fine", isActive: true }
      ];

      return {
        success: true,
        data: mockCategories as T
      };
    }

    if (endpoint === '/cities' && method === 'GET') {
      return {
        success: true,
        data: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"] as T
      };
    }

    if (endpoint === '/cart' && method === 'GET') {
      return {
        success: true,
        data: { items: [] } as T
      };
    }

    // Default mock response
    return {
      success: true,
      data: {} as T,
      message: 'Mock response'
    };
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await this.makeRequest<AuthResponse['user']>('/users/profile');
    return response.data;
  }

  async updateProfile(profileData: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
    const response = await this.makeRequest<AuthResponse['user']>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  }

  // Product endpoints
  async getProducts(filters?: {
    category?: string;
    vendor?: number;
    city?: string;
    search?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const endpoint = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.makeRequest<any[]>(endpoint);
    return response.data;
  }

  async getVendorProducts(vendorId: number): Promise<any[]> {
    const response = await this.makeRequest<any[]>(`/vendors/${vendorId}/products`);
    return response.data;
  }

  async createProduct(productData: any): Promise<any> {
    const response = await this.makeRequest<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data;
  }

  async updateProduct(productId: number, productData: any): Promise<any> {
    const response = await this.makeRequest<any>(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data;
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.makeRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Category endpoints
  async getCategories(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/categories');
    return response.data;
  }

  async createCategory(categoryData: any): Promise<any> {
    const response = await this.makeRequest<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }

  async updateCategory(categoryId: number, categoryData: any): Promise<any> {
    const response = await this.makeRequest<any>(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.makeRequest(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Vendor endpoints
  async getVendors(filters?: {
    search?: string;
    city?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const endpoint = `/vendors${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.makeRequest<any[]>(endpoint);
    return response.data;
  }

  async getVendorOrders(filters?: {
    status?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const endpoint = `/vendors/orders${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.makeRequest<any[]>(endpoint);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const response = await this.makeRequest<any>(`/vendors/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  }

  async verifyPickupCode(orderId: string, code: string): Promise<any> {
    const response = await this.makeRequest<any>(`/vendors/orders/${orderId}/verify-pickup`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<any> {
    const response = await this.makeRequest<any>('/cart');
    return response.data;
  }

  async addToCart(productId: number, quantity: number = 1): Promise<any> {
    const response = await this.makeRequest<any>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data;
  }

  async updateCartItem(productId: number, quantity: number): Promise<any> {
    const response = await this.makeRequest<any>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return response.data;
  }

  async removeFromCart(productId: number): Promise<void> {
    await this.makeRequest(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<void> {
    await this.makeRequest('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async getOrders(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/orders');
    return response.data;
  }

  async getOrder(orderId: string): Promise<any> {
    const response = await this.makeRequest<any>(`/orders/${orderId}`);
    return response.data;
  }

  async createOrder(): Promise<any> {
    const response = await this.makeRequest<any>('/orders', {
      method: 'POST',
    });
    return response.data;
  }

  async confirmOrderReceived(orderId: string): Promise<any> {
    const response = await this.makeRequest<any>(`/orders/${orderId}/confirm-received`, {
      method: 'PUT',
    });
    return response.data;
  }

  async getPickupCode(orderId: string): Promise<string> {
    const response = await this.makeRequest<{ code: string }>(`/orders/${orderId}/pickup-code`);
    return response.data.code;
  }

  // Donation endpoints
  async getPendingDonations(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/donations/pending');
    return response.data;
  }

  async payForOrder(orderId: string): Promise<any> {
    const response = await this.makeRequest<any>(`/donations/${orderId}/pay`, {
      method: 'POST',
    });
    return response.data;
  }

  async getDonationHistory(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/donations/history');
    return response.data;
  }

  // Profile update endpoints
  async updateEmail(email: string): Promise<any> {
    const response = await this.makeRequest<any>('/users/profile/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  async updatePhone(phone: string): Promise<any> {
    const response = await this.makeRequest<any>('/users/profile/phone', {
      method: 'PUT',
      body: JSON.stringify({ phone }),
    });
    return response.data;
  }



  // Utility endpoints
  async getCities(): Promise<string[]> {
    const response = await this.makeRequest<string[]>('/cities');
    return response.data;
  }

  async getPublicStats(): Promise<any> {
    const response = await this.makeRequest<any>('/stats/public');
    return response.data;
  }

  async getVendorStats(): Promise<any> {
    const response = await this.makeRequest<any>('/stats/vendors');
    return response.data;
  }

  async getDonatorStats(): Promise<any> {
    const response = await this.makeRequest<any>('/stats/donators');
    return response.data;
  }

  async getFamilyStats(): Promise<any> {
    const response = await this.makeRequest<any>('/stats/families');
    return response.data;
  }

  // File upload
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.data.url;
  }
}

export const apiService = new ApiService();
export default apiService;
