import React from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, LogOut, LogIn, MessageCircle, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  menuRef?: React.RefObject<HTMLDivElement>;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showMenu = false,
  onMenuToggle,
  menuRef,
  onLogout
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="relative flex items-center justify-between p-4 bg-gradient-to-r from-app-purple via-app-sky to-app-pink shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
            <span className="text-app-purple font-bold text-sm">T</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xs text-white/80">
            {subtitle || (isAuthenticated && user ?
              `Bonjour ${user.prenom} (${user.type_utilisateur === 'famille' ? 'Famille' : user.type_utilisateur === 'vendeur' ? 'Vendeur' : 'Donateur'})` :
              "Votre marketplace de confiance"
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Link 
          to="/notifications" 
          className="relative group"
          aria-label="Notifications"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
            <Bell className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
          </div>
        </Link>
        
        {onMenuToggle && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={onMenuToggle}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
              aria-label="Menu principal"
              aria-expanded={showMenu}
              aria-haspopup="true"
            >
              <Menu
                className={`w-5 h-5 text-white transition-transform duration-300 ${showMenu ? "rotate-90" : "group-hover:rotate-12"}`}
              />
            </button>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                  onClick={onMenuToggle}
                />
                {/* Menu */}
                <div
                  className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-200 w-64 py-2 z-[101] animate-in slide-in-from-top-2 duration-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* Authentication Section */}
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-500">Connecté en tant que</p>
                        <p className="text-sm font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs text-app-purple capitalize">{user?.type_utilisateur}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 group w-full text-left"
                        role="menuitem"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <LogOut className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Se déconnecter</span>
                      </button>
                      <div className="h-2 border-b border-gray-200"></div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-purple/10 hover:to-app-sky/10 transition-all duration-300 group"
                        role="menuitem"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <LogIn className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">Se connecter</span>
                      </Link>
                      <div className="h-2 border-b border-gray-200"></div>
                    </>
                  )}

                  {/* Menu Options */}
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-purple/10 hover:to-app-sky/10 transition-all duration-300 group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Nous contacter</span>
                  </Link>
                  <Link
                    to="/report-problem"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-pink/10 hover:to-app-purple/10 transition-all duration-300 group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-app-pink to-app-purple rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Signaler un problème</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-sky/10 hover:to-app-pink/10 transition-all duration-300 group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-app-sky to-app-pink rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">À propos de nous</span>
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-purple/10 hover:to-app-sky/10 transition-all duration-300 group"
                    role="menuitem"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Aide & Support</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
