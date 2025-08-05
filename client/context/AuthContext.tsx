import React, { createContext, useContext, useState, ReactNode } from "react";

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
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  // Mock users for development
  const mockUsers: User[] = [
    {
      id: 1,
      email: "family@test.com",
      name: "Sophie Martin",
      role: "family",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5b85644?w=100&h=100&fit=crop&crop=center",
      phone: "+33 6 12 34 56 78",
      address: "15 rue de la Paix",
      city: "Paris"
    },
    {
      id: 2,
      email: "vendor@test.com",
      name: "Ahmed Benali",
      role: "vendor",
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
      role: "donator",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
      totalDonations: 450.50,
      donationsCount: 23,
      phone: "+33 6 11 22 33 44",
      city: "Lyon"
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now(),
        email,
        name,
        role,
        avatar: `https://images.unsplash.com/photo-${role === 'family' ? '1494790108755-2616b5b85644' : role === 'vendor' ? '1472099645785-5658abf4ff4e' : '1438761681033-6461ffad8d80'}?w=100&h=100&fit=crop&crop=center`
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Check for stored user on initialization
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
