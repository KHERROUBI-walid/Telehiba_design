import React from "react";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";

interface ConnectionBannerProps {
  isConnected: boolean;
  isDemoMode: boolean;
}

const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ isConnected, isDemoMode }) => {
  // Detect cloud environment
  const isCloudEnvironment = window.location.hostname.includes('.fly.dev') ||
                            window.location.hostname.includes('.vercel.app') ||
                            window.location.hostname.includes('.netlify.app') ||
                            window.location.hostname.includes('.herokuapp.com');

  if (isConnected && !isDemoMode) {
    return null; // Don't show banner when everything is working normally
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium ${
      isDemoMode
        ? 'bg-blue-500 text-white'
        : 'bg-yellow-500 text-black'
    }`}>
      <div className="flex items-center justify-center gap-2">
        {isDemoMode ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>
              {isCloudEnvironment
                ? '🌐 Mode Démo - Application cloud avec données de démonstration'
                : '📱 Mode Démo - API non connectée, données de démonstration'
              }
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>API déconnectée - Vérifiez que votre serveur backend est démarré</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionBanner;
