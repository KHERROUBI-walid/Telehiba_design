import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  backgroundVariant?: "default" | "families" | "vendors" | "donators";
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  backgroundVariant = "default",
  className = ""
}) => {
  const getBackgroundClasses = () => {
    switch (backgroundVariant) {
      case "families":
        return "bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50";
      case "vendors":
        return "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50";
      case "donators":
        return "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50";
      default:
        return "bg-gradient-to-br from-app-pink via-app-purple to-app-blue";
    }
  };

  const getAnimationElements = () => {
    switch (backgroundVariant) {
      case "families":
        return (
          <>
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-blue-300/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>
          </>
        );
      case "vendors":
        return (
          <>
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>
          </>
        );
      case "donators":
        return (
          <>
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-blue-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>
          </>
        );
      default:
        return (
          <>
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce [animation-duration:3s]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-app-purple/10 to-app-pink/10 rounded-full animate-spin [animation-duration:8s]"></div>
          </>
        );
    }
  };

  const isDevelopmentMode = import.meta.env.VITE_APP_ENV === 'development' &&
    (import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.VITE_API_BASE_URL?.includes('localhost'));

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} relative overflow-hidden ${className}`}>
      {/* Animated background elements */}
      {getAnimationElements()}

      {/* Content */}
      <div className={`relative z-10 ${isDevelopmentMode ? 'pt-10' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
