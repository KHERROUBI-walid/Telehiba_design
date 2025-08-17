import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { apiService } from "../services/api";
import { useAuth } from "./AuthContext";
import { Produit } from "../types/api";

export interface CartItem {
  product: Produit;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  addToCart: (product: Produit) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearItemFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const refreshCart = async () => {
    if (!isAuthenticated || user?.type_utilisateur !== "famille") {
      setCart([]);
      return;
    }

    setIsLoading(true);
    try {
      const cartData = await apiService.getCart();
      setCart(cartData.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Produit) => {
    if (!isAuthenticated || user?.type_utilisateur !== "famille") {
      console.warn("Only families can add items to cart");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.addToCart(product.id, 1);

      // Update local cart state optimistically
      setCart((prev) => {
        const existingItem = prev.find(
          (item) => item.product.id === product.id,
        );
        if (existingItem) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated || user?.type_utilisateur !== "famille") {
      console.warn("Only families can modify cart");
      return;
    }

    setIsLoading(true);
    try {
      const existingItem = cart.find((item) => item.product.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // Update quantity
        await apiService.updateCartItem(productId, existingItem.quantity - 1);
        setCart((prev) =>
          prev.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        );
      } else {
        // Remove item completely
        await apiService.removeFromCart(productId);
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const clearItemFromCart = async (productId: number) => {
    if (!isAuthenticated || user?.type_utilisateur !== "famille") {
      console.warn("Only families can modify cart");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.removeFromCart(productId);
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (error) {
      console.error("Error clearing item from cart:", error);
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || user?.type_utilisateur !== "famille") {
      console.warn("Only families can modify cart");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.clearCart();
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const getItemQuantity = (productId: number) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.prix * item.quantity,
      0,
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Load cart when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user?.type_utilisateur === "famille") {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, user?.role]);

  const value: CartContextType = {
    cart,
    isCartOpen,
    isLoading,
    addToCart,
    removeFromCart,
    clearItemFromCart,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
    openCart,
    closeCart,
    toggleCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
