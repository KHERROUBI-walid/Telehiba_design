import { Link, useLocation } from "react-router-dom";
import { Home, List, ShoppingCart, MessageCircle, User } from "lucide-react";

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

  if (!isVisible) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-3">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 transition-colors ${
            isActive("/")
              ? "text-app-purple"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className={`text-xs ${isActive("/") ? "font-medium" : ""}`}>
            Home
          </span>
        </Link>

        <Link
          to="/orders"
          className={`flex flex-col items-center gap-1 px-4 transition-colors ${
            isActive("/orders")
              ? "text-app-purple"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <List className="w-6 h-6" />
          <span
            className={`text-xs ${isActive("/orders") ? "font-medium" : ""}`}
          >
            Orders
          </span>
        </Link>

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

        <Link
          to="/chat"
          className={`flex flex-col items-center gap-1 px-4 transition-colors ${
            isActive("/chat")
              ? "text-app-purple"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className={`text-xs ${isActive("/chat") ? "font-medium" : ""}`}>
            Chat
          </span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 px-4 transition-colors ${
            isActive("/profile")
              ? "text-app-purple"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User className="w-6 h-6" />
          <span
            className={`text-xs ${isActive("/profile") ? "font-medium" : ""}`}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
