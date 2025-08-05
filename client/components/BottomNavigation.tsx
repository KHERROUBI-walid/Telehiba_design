import { Link, useLocation } from "react-router-dom";
import { Home, List, ShoppingCart, MessageCircle, User, LogIn, Store, Gift, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface BottomNavigationProps {
  isVisible?: boolean;
  onCartClick?: () => void;
  cartItemCount?: number;
}

export default function BottomNavigation({
  isVisible = true,
  onCartClick,
  cartItemCount = 0,
}: BottomNavigationProps) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isVisible) return null;

  const isActive = (path: string) => location.pathname === path;

  // Role-based navigation items
  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { to: "/", icon: Home, label: "Accueil" },
        { to: "/login", icon: LogIn, label: "Connexion" },
      ];
    }

    const baseItems = [
      { to: "/", icon: Home, label: "Accueil" },
    ];

    switch (user?.role) {
      case "family":
        return [
          ...baseItems,
          { to: "/orders", icon: List, label: "Commandes" },
          { to: "/chat", icon: MessageCircle, label: "Chat" },
          { to: "/profile", icon: User, label: "Profil" },
        ];
      case "vendor":
        return [
          ...baseItems,
          { to: "/vendor-dashboard", icon: Store, label: "Boutique" },
          { to: "/vendor-orders", icon: Package, label: "Commandes" },
          { to: "/profile", icon: User, label: "Profil" },
        ];
      case "donator":
        return [
          ...baseItems,
          { to: "/donator-dashboard", icon: Gift, label: "Donations" },
          { to: "/chat", icon: MessageCircle, label: "Chat" },
          { to: "/profile", icon: User, label: "Profil" },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-3">
        {navigationItems.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 px-4 transition-colors ${
              isActive(item.to)
                ? "text-app-purple"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className={`text-xs ${isActive(item.to) ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Cart button only for families */}
        {isAuthenticated && user?.role === "family" && (
          <button
            onClick={onCartClick}
            className="bg-app-yellow w-12 h-12 rounded-full flex items-center justify-center -mt-2 shadow-lg hover:bg-opacity-90 transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
