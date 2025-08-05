import React from "react";
import { MapPin } from "lucide-react";
import { cities } from "../../data/mockData";

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
  const handleCityClick = (city: string) => {
    onCitySelect(city === selectedCity ? "" : city);
  };

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50 ${className}`}>
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-app-purple" aria-hidden="true" />
        Choisir votre ville
      </h2>
      <div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        role="group"
        aria-label="Sélection de ville"
      >
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-app-purple/50 ${
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
