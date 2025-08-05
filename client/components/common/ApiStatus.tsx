import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";

const ApiStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 3000);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        });

        clearTimeout(timeoutId);
        setIsConnected(response.ok);
      } catch (error) {
        // Any error means API is not available
        setIsConnected(false);
      }
    };

    // Initial check after a delay to let the app load
    const initialTimeout = setTimeout(checkConnection, 2000);

    // Check every 60 seconds (less frequent to avoid spam)
    const interval = setInterval(checkConnection, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (isConnected === null) {
    return null; // Loading state
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium ${
      isConnected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
        <span>
          {isConnected ? 'API Connectée' : 'Mode Développement'}
        </span>
      </div>
    </div>
  );
};

export default ApiStatus;
