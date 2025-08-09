import React, { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { apiService } from "../../services/api";

interface CitySelectorProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCitySelect,
  className = ""
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // City reverse geocoding (mock implementation)
  const getCityFromCoordinates = async (lat: number, lon: number): Promise<string> => {
    // In a real app, you'd use a reverse geocoding service
    // For now, return a mock city based on French coordinates
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock logic for common French cities coordinates
        if (lat >= 48.8 && lat <= 48.9 && lon >= 2.3 && lon <= 2.4) {
          resolve("Paris");
        } else if (lat >= 45.7 && lat <= 45.8 && lon >= 4.8 && lon <= 4.9) {
          resolve("Lyon");
        } else if (lat >= 43.2 && lat <= 43.3 && lon >= 5.3 && lon <= 5.4) {
          resolve("Marseille");
        } else {
          resolve("Ville détectée");
        }
      }, 1500);
    });
  };

  const handleCityClick = (city: string) => {
    onCitySelect(city === selectedCity ? "" : city);
  };

  const handleGpsLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée");
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const detectedCity = await getCityFromCoordinates(latitude, longitude);
          onCitySelect(detectedCity);
          setIsGettingLocation(false);
        } catch (error) {
          setLocationError("Erreur lors de la détection de la ville");
          setIsGettingLocation(false);
        }
      },
      (error) => {
        let errorMessage = "Erreur de géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Géolocalisation refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleManualInput = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      onCitySelect(inputValue.trim());
      setInputValue("");
      setShowInput(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setInputValue("");
      setShowInput(false);
    }
  };

  const cancelInput = () => {
    setInputValue("");
    setShowInput(false);
  };

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.city-input-container')?.contains(event.target as Node)) {
        setShowInput(false);
        setInputValue("");
      }
    };

    if (showInput) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showInput]);

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50 ${className}`}>
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-app-purple" aria-hidden="true" />
        <span className="text-sm sm:text-base">Choisir votre ville</span>
      </h2>

      {/* Manual Input Section */}
      {showInput && (
        <div className="city-input-container mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyPress}
              placeholder="Entrez votre ville..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
            />
            <button
              onClick={handleInputSubmit}
              disabled={!inputValue.trim()}
              className="bg-app-purple text-white px-3 py-1 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-app-purple/90 transition-colors"
            >
              OK
            </button>
            <button
              onClick={cancelInput}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={handleManualInput}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-app-purple text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-app-purple/90 transition-colors focus:outline-none focus:ring-2 focus:ring-app-purple/50"
        >
          <Search className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Saisir</span>
        </button>

        <button
          onClick={handleGpsLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
        >
          <Navigation className={`w-3 h-3 sm:w-4 sm:h-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
          <span>
            {isGettingLocation ? "Localisation..." : "GPS"}
          </span>
        </button>

        {selectedCity && (
          <button
            onClick={() => onCitySelect("")}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-xs">{locationError}</p>
        </div>
      )}

      {/* Current Selection */}
      {selectedCity && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-xs sm:text-sm font-medium">
            📍 Ville sélectionnée: {selectedCity}
          </p>
        </div>
      )}

      {/* City Suggestions */}
      <div 
        className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide"
        role="group"
        aria-label="Sélection de ville"
      >
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-app-purple/50 text-xs sm:text-sm ${
              selectedCity === city
                ? "bg-black text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={selectedCity === city}
            aria-label={`${selectedCity === city ? 'Désélectionner' : 'Sélectionner'} ${city}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;
