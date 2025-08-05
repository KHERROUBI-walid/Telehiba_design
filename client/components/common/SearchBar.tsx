import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Rechercher des produits ou vendeurs...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor="search-input" className="sr-only">
        {placeholder}
      </label>
      <Search
        className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"
        aria-hidden="true"
      />
      <input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-app-purple/50 focus:border-app-purple transition-all duration-300 text-sm sm:text-base"
        autoComplete="off"
        aria-describedby="search-description"
      />
      <div id="search-description" className="sr-only">
        Recherchez par nom de produit ou nom de vendeur
      </div>
    </div>
  );
};

export default SearchBar;
