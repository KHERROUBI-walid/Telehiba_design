import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Bell,
  User,
  MapPin,
  ChevronRight,
  Star,
  Plus,
  Minus,
  X,
  Menu,
  MessageCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart, Product } from "../context/CartContext";

interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

interface Vendor {
  id: number;
  name: string;
  avatar: string;
  city: string;
  specialty: string;
  rating: number;
  gradient: string;
}

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
  } = useCart();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories: Category[] = [
    {
      id: "vegetables",
      name: "Vegetables",
      icon: "🥬",
      gradient: "from-app-purple to-app-pink",
    },
    {
      id: "fruits",
      name: "Fruits",
      icon: "🍎",
      gradient: "from-app-sky to-app-purple",
    },
    {
      id: "clothes",
      name: "Clothes",
      icon: "👕",
      gradient: "from-app-pink to-app-sky",
    },
    {
      id: "medicine",
      name: "Medicine",
      icon: "💊",
      gradient: "from-app-purple to-app-sky",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "��",
      gradient: "from-app-sky to-app-pink",
    },
  ];

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
      city: "New York, USA",
      specialty: "Fruits & Vegetables",
      rating: 4.8,
      gradient: "from-app-purple to-app-sky",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      city: "Brooklyn, NY",
      specialty: "Medicine & Health",
      rating: 4.9,
      gradient: "from-app-pink to-app-purple",
    },
    {
      id: 3,
      name: "Dr. Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=80&h=80&fit=crop&crop=face",
      city: "Manhattan, NY",
      specialty: "Organic Foods",
      rating: 4.7,
      gradient: "from-app-sky to-app-pink",
    },
    {
      id: 4,
      name: "Dr. James Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      city: "Queens, NY",
      specialty: "General Store",
      rating: 4.6,
      gradient: "from-app-purple to-app-sky",
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.8,
      unit: "Kg",
    },
    {
      id: 2,
      name: "Red Apples",
      price: 3.5,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.7,
      unit: "Kg",
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
      category: "clothes",
      vendor: {
        id: 2,
        name: "Dr. Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
        city: "Brooklyn, NY",
      },
      rating: 4.9,
      unit: "unité",
    },
    {
      id: 4,
      name: "Fresh Carrots",
      price: 2.99,
      image:
        "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center",
      category: "vegetables",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=60&h=60&fit=crop&crop=face",
        city: "Manhattan, NY",
      },
      rating: 4.6,
      unit: "Kg",
    },
    {
      id: 5,
      name: "Bananas",
      price: 2.49,
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=60&h=60&fit=crop&crop=face",
        city: "Manhattan, NY",
      },
      rating: 4.5,
      unit: "Kg",
    },
    {
      id: 6,
      name: "Denim Jeans",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&crop=center",
      category: "clothes",
      vendor: {
        id: 4,
        name: "Dr. James Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
        city: "Queens, NY",
      },
      rating: 4.8,
      unit: "unité",
    },
  ];

  // Get unique cities for filter
  const uniqueCities = Array.from(
    new Set(vendors.map((vendor) => vendor.city)),
  );

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter vendors based on search term and city (use current location if no city filter)
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      currentLocation === "" || vendor.city === currentLocation;
    return matchesSearch && matchesCity;
  });

  // Filter products based on category, search term, and current location
  const baseFilteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const filteredProducts = baseFilteredProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      currentLocation === "" || product.vendor.city === currentLocation;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-app-purple/10 to-app-sky/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 -left-10 w-32 h-32 bg-gradient-to-br from-app-pink/10 to-app-purple/10 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-app-sky/10 to-app-pink/10 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-4 bg-gradient-to-r from-app-purple via-app-sky to-app-pink shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
              <span className="text-app-purple font-bold text-sm">T</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg">
              TeleHiba
            </h1>
            <p className="text-xs text-white/80">
              Votre marketplace de confiance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
            >
              <Menu
                className={`w-5 h-5 text-white transition-transform duration-300 ${showMenu ? "rotate-90" : "group-hover:rotate-12"}`}
              />
            </button>

            {showMenu && (
              <div className="fixed right-4 top-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-52 py-3 z-[9999] animate-in slide-in-from-top-5 duration-300">
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-purple/10 hover:to-app-sky/10 transition-all duration-300 group"
                  onClick={() => setShowMenu(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Nous contacter</span>
                </Link>
                <Link
                  to="/report-problem"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-pink/10 hover:to-app-purple/10 transition-all duration-300 group"
                  onClick={() => setShowMenu(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-app-pink to-app-purple rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Signaler un problème</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-sky/10 hover:to-app-pink/10 transition-all duration-300 group"
                  onClick={() => setShowMenu(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-app-sky to-app-pink rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">À propos de nous</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-app-purple/10 hover:to-app-sky/10 transition-all duration-300 group"
                  onClick={() => setShowMenu(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Aide & Support</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="mx-4 mt-6 mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-app-purple via-app-sky to-app-pink rounded-3xl opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>

        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold drop-shadow-lg">
                    Choisi ton vendeur, tes produits
                  </h2>
                  <p className="text-sm opacity-90 mt-1">
                    Envoi la commande et attends la notif 📱
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">
                    En ligne maintenant
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-xs font-medium">
                    🚀 Livraison rapide
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <span
                  className="text-4xl animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  🎯
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar and Location */}
      <div className="relative p-6 bg-gradient-to-b from-white/80 to-white backdrop-blur-sm">
        {/* Location Selector */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <select
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="bg-white text-black px-6 py-3 rounded-2xl text-sm border-2 border-gray-300 outline-none cursor-pointer appearance-none shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 font-semibold hover:border-app-purple"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                paddingRight: "40px",
              }}
            >
              <option value="" style={{ color: "#000" }}>
                🌍 Toutes les villes
              </option>
              <option value="New York, USA" style={{ color: "#000" }}>
                📍 New York, USA
              </option>
              <option value="Manhattan, NY" style={{ color: "#000" }}>
                📍 Manhattan, NY
              </option>
              <option value="Brooklyn, NY" style={{ color: "#000" }}>
                📍 Brooklyn, NY
              </option>
              <option value="Paris, France" style={{ color: "#000" }}>
                📍 Paris, France
              </option>
              <option value="Montreal, Canada" style={{ color: "#000" }}>
                📍 Montreal, Canada
              </option>
              <option value="Lyon, France" style={{ color: "#000" }}>
                📍 Lyon, France
              </option>
            </select>
            <div className="absolute inset-0 bg-gradient-to-r from-app-purple/20 to-app-sky/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-app-purple/20 via-app-sky/20 to-app-pink/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <div className="relative flex items-center bg-white/90 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500">
              <div className="w-10 h-10 bg-gradient-to-br from-app-purple to-app-sky rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Rechercher catégories, vendeurs, produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-base placeholder-gray-500 bg-transparent font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all duration-300 ml-2 group/clear"
                >
                  <X className="w-4 h-4 group-hover/clear:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>

          {/* Clear search button */}
          {searchTerm && (
            <div className="flex justify-center animate-in slide-in-from-top-5 duration-300">
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-red-100 hover:to-red-200 hover:text-red-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✨ Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      {(() => {
        // When searching, prioritize sections with results
        if (searchTerm) {
          const sections = [];

          // Categories section removed - only show vendors and products

          if (filteredVendors.length > 0) {
            sections.push({
              type: "vendors",
              count: filteredVendors.length,
              priority: 2,
            });
          }

          if (filteredProducts.length > 0) {
            sections.push({
              type: "products",
              count: filteredProducts.length,
              priority: 3,
            });
          }

          // Sort by count (descending) to show section with most results first
          sections.sort((a, b) => b.count - a.count);

          return (
            <div className="space-y-6">
              {sections.map((section, index) => {
                if (section.type === "vendors") {
                  return (
                    <div
                      key="vendors"
                      className="mb-6 animate-in slide-in-from-top-5 duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-blue-500 p-4 rounded-r-2xl mx-4 mb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            🎯 Vendeurs trouvés ({filteredVendors.length})
                          </h3>
                          <Link
                            to="/all-vendors"
                            className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                          >
                            Voir tout
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto px-4 pb-2">
                        {filteredVendors.map((vendor) => (
                          <Link
                            key={vendor.id}
                            to={`/vendor-products?vendor=${vendor.name}&city=${vendor.city}`}
                            className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow w-48 ring-2 ring-blue-200 animate-pulse"
                          >
                            <div
                              className={`w-full h-20 bg-gradient-to-br ${vendor.gradient} rounded-xl mb-3 flex items-center justify-center overflow-hidden relative`}
                            >
                              <img
                                src={vendor.avatar}
                                alt={vendor.name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white/50 shadow-lg"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="font-medium text-gray-800 text-sm mb-1">
                              {vendor.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              {vendor.city}
                            </p>
                            <p className="text-xs text-app-purple font-medium mb-2">
                              {vendor.specialty}
                            </p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {vendor.rating}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}

              {/* No results message */}
              {sections.length === 0 && (
                <div className="text-center py-16 mx-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Aucune catégorie, vendeur ou produit ne correspond à "
                      {searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="bg-gradient-to-r from-app-purple to-app-sky text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      ✨ Effacer la recherche
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Default view when not searching
        return (
          <>
            {/* Vendors Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Vendeurs {currentLocation && `(${filteredVendors.length})`}
                </h3>
                <Link
                  to="/all-vendors"
                  className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
                >
                  Voir tout
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {filteredVendors.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto px-4 pb-2">
                  {filteredVendors.map((vendor) => (
                    <Link
                      key={vendor.id}
                      to={`/vendor-products?vendor=${vendor.name}&city=${vendor.city}`}
                      className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow w-48"
                    >
                      <div
                        className={`w-full h-20 bg-gradient-to-br ${vendor.gradient} rounded-xl mb-3 flex items-center justify-center overflow-hidden relative`}
                      >
                        <img
                          src={vendor.avatar}
                          alt={vendor.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white/50 shadow-lg"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">
                        {vendor.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {vendor.city}
                      </p>
                      <p className="text-xs text-app-purple font-medium mb-2">
                        {vendor.specialty}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">
                          {vendor.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : currentLocation ? (
                <div className="text-center py-8 px-4">
                  <div className="text-gray-400 text-3xl mb-2">👩‍⚕️</div>
                  <p className="text-gray-500 text-sm">
                    Aucun vendeur trouvé dans cette ville
                  </p>
                  <p className="text-gray-400 text-xs">
                    Essayez de sélectionner "Toutes les villes"
                  </p>
                </div>
              ) : null}
            </div>
          </>
        );
      })()}

      {/* Products by Vendor Section */}
      <div className="pb-24">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedCategory === "all"
              ? "Produits par Vendeur"
              : `Produits ${categories.find((c) => c.id === selectedCategory)?.name}`}
            {(searchTerm || currentLocation) && ` (${filteredProducts.length})`}
          </h3>
          <Link
            to="/all-products"
            className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {(() => {
          // Group products by vendor
          const productsByVendor = filteredProducts.reduce(
            (acc, product) => {
              const vendorKey = `${product.vendor.name}-${product.vendor.city}`;
              if (!acc[vendorKey]) {
                acc[vendorKey] = {
                  vendor: product.vendor,
                  products: [],
                };
              }
              acc[vendorKey].products.push(product);
              return acc;
            },
            {} as Record<
              string,
              { vendor: any; products: typeof filteredProducts }
            >,
          );

          const vendorGroups = Object.values(productsByVendor);

          return vendorGroups.length > 0 ? (
            <div className="space-y-6">
              {vendorGroups.map((group, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-lg border border-gray-100 mb-8 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Vendor Header */}
                  <div className="px-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={group.vendor.avatar}
                          alt={group.vendor.name}
                          className="w-10 h-10 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          {group.vendor.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {group.vendor.city}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-sm text-app-purple font-medium">
                          {group.products.length} produit
                          {group.products.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Products Carousel */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 px-4 pb-2">
                      {group.products.map((product) => {
                        const quantity = getItemQuantity(product.id);

                        return (
                          <div
                            key={product.id}
                            className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 w-48"
                          >
                            {/* Product Image */}
                            <div className="w-full h-32 bg-gradient-to-br from-app-purple to-app-sky rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-xl"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                            </div>

                            {/* Product Info */}
                            <h5 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
                              {product.name}
                            </h5>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {product.rating}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-app-purple text-sm">
                                ${product.price}
                              </span>
                            </div>

                            {/* Add to Cart Controls */}
                            {quantity === 0 ? (
                              <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-app-purple text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span className="text-xs">Ajouter</span>
                              </button>
                            ) : (
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium text-gray-800 text-sm">
                                  {quantity} {product.unit || ""}
                                </span>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="w-7 h-7 bg-app-purple text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="text-gray-400 text-4xl mb-2">📦</div>
              <p className="text-gray-500 text-sm mb-1">Aucun produit trouvé</p>
              <p className="text-gray-400 text-xs">
                {searchTerm || currentLocation
                  ? "Essayez de modifier vos critères de recherche"
                  : selectedCategory === "all"
                    ? "Aucun produit disponible"
                    : "Aucun produit dans cette catégorie"}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
