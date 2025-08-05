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

class ApiService {
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
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
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
  async getVendors(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/vendors');
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
