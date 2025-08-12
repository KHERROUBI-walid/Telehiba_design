import React, { useState, useEffect } from "react";

const ApiStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Always show status in production
    setShowStatus(true);

    const checkConnection = async () => {
      try {
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

        // Don't try to connect if API URL is empty (demo mode)
        if (!apiUrl) {
          console.warn("📱 API Status: Demo mode - no API configured");
          setIsConnected(false);
          return;
        }

        console.log("🔍 API Status: Checking connection to:", apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000);

        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        clearTimeout(timeoutId);
        setIsConnected(response.ok);
      } catch (error) {
        // Any error means API is not available (including timeouts)
        console.warn("⚠️  API Status: Connection check failed:", error.message);
        setIsConnected(false);
      }
    };

    // Initial check after a delay to let the app load
    const initialTimeout = setTimeout(() => {
      checkConnection().catch(() => {
        // Silently handle any errors in the initial check
        setIsConnected(false);
      });
    }, 5000);

    // Check every 60 seconds (less frequent to avoid spam)
    const interval = setInterval(() => {
      checkConnection().catch(() => {
        // Silently handle any errors in periodic checks
        setIsConnected(false);
      });
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!showStatus || isConnected === null) {
    return null; // Don't show if still loading
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium ${
        isConnected
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-yellow-500"
          }`}
        ></div>
        <span>{isConnected ? "API Connectée" : "API Déconnectée"}</span>
      </div>
    </div>
  );
};

export default ApiStatus;
