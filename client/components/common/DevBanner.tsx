import React from "react";

interface DevBannerProps {
  isVisible: boolean;
}

const DevBanner: React.FC<DevBannerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 z-50 text-sm font-medium">
      🚧 Mode Développement - Utilisation de données fictives (Backend non connecté)
    </div>
  );
};

export default DevBanner;
