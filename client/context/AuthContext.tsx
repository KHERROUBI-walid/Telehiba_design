import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiService } from "../services/api";

export type UserRole = "family" | "vendor" | "donator";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  // Vendor specific fields
  businessName?: string;
  specialty?: string;
  rating?: number;
  // Donator specific fields
  totalDonations?: number;
  donationsCount?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authResponse = await apiService.login({ email, password });
      setUser(authResponse.user);
      localStorage.setItem("user", JSON.stringify(authResponse.user));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      // Clear any existing auth data on login failure
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authResponse = await apiService.register({ email, password, name, role });
      setUser(authResponse.user);
      localStorage.setItem("user", JSON.stringify(authResponse.user));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('auth_token')) return;

    setIsLoading(true);
    try {
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("Refresh user error:", error);
      // If token is invalid, clear authentication
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for stored token and user on initialization
  React.useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("auth_token");

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          await refreshUser();
        } catch (error) {
          // Token is invalid, clear stored data
          localStorage.removeItem("user");
          localStorage.removeItem("auth_token");
        }
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
