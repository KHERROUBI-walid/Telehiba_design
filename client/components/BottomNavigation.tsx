import { Link, useLocation } from "react-router-dom";
import { Home, List, ShoppingCart, MessageCircle, User, LogIn, Store, Gift, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavigationItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

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

    switch (user?.type_utilisateur) {
      case "famille":
        return [
          ...baseItems,
          { to: "/orders", icon: List, label: "Commandes" },
          { to: "/chat", icon: MessageCircle, label: "Chat" },
          { to: "/profile", icon: User, label: "Profil" },
        ];
      case "vendeur":
        return [
          ...baseItems,
          { to: "/vendor-dashboard", icon: Store, label: "Boutique" },
          { to: "/vendor-orders", icon: Package, label: "Commandes" },
          { to: "/profile", icon: User, label: "Profil" },
        ];
      case "donateur":
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40" role="navigation" aria-label="Navigation principale">
      <div className="flex items-center justify-around py-3 relative">
        {/* Left side navigation items */}
        {navigationItems.slice(0, Math.ceil(navigationItems.length / 2)).map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-app-purple/50 rounded-lg ${
              isActive(item.to)
                ? "text-app-purple"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label={item.label}
            aria-current={isActive(item.to) ? "page" : undefined}
          >
            <item.icon className="w-6 h-6" aria-hidden="true" />
            <span className={`text-xs ${isActive(item.to) ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Cart button in center for families */}
        {isAuthenticated && user?.role === "family" && (
          <button
            onClick={onCartClick}
            className="bg-app-yellow w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-app-yellow/50 transition-colors relative mx-2"
            aria-label={`Panier (${cartItemCount} article${cartItemCount > 1 ? 's' : ''})`}
          >
            <ShoppingCart className="w-7 h-7 text-white" aria-hidden="true" />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                aria-hidden="true"
              >
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        {/* Right side navigation items */}
        {navigationItems.slice(Math.ceil(navigationItems.length / 2)).map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-app-purple/50 rounded-lg ${
              isActive(item.to)
                ? "text-app-purple"
                : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label={item.label}
            aria-current={isActive(item.to) ? "page" : undefined}
          >
            <item.icon className="w-6 h-6" aria-hidden="true" />
            <span className={`text-xs ${isActive(item.to) ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
