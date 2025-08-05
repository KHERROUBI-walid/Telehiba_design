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
  LogIn,
  LogOut,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart, Product } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

export default function Shopping() {
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
  const { user, isAuthenticated, logout } = useAuth();

  // Filter content based on user role
  const shouldShowCart = !isAuthenticated || user?.role === "family";
  const shouldShowProducts = !isAuthenticated || user?.role === "family";

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
      icon: "📱",
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
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.8,
      description: "Fresh organic tomatoes grown locally",
      inStock: true,
      unit: "Kg",
    },
    {
      id: 2,
      name: "Golden Apples",
      price: 3.50,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.6,
      description: "Sweet and crispy golden apples",
      inStock: true,
      unit: "Kg",
    },
    {
      id: 3,
      name: "Artisan Bread",
      price: 2.80,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center",
      category: "food",
      vendor: {
        id: 2,
        name: "Dr. Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        city: "Brooklyn, NY",
      },
      rating: 4.9,
      description: "Freshly baked artisan bread",
      inStock: true,
      unit: "piece",
    },
    {
      id: 4,
      name: "Organic Bananas",
      price: 2.20,
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=40&h=40&fit=crop&crop=face",
        city: "Manhattan, NY",
      },
      rating: 4.7,
      description: "Organic bananas packed with nutrients",
      inStock: true,
      unit: "Kg",
    },
    {
      id: 5,
      name: "Fresh Milk",
      price: 1.85,
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop&crop=center",
      category: "dairy",
      vendor: {
        id: 4,
        name: "Dr. James Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        city: "Queens, NY",
      },
      rating: 4.8,
      description: "Fresh whole milk from local farms",
      inStock: true,
      unit: "L",
    },
    {
      id: 6,
      name: "Farm Eggs",
      price: 4.20,
      image:
        "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=300&h=300&fit=crop&crop=center",
      category: "dairy",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.9,
      description: "Fresh farm eggs from free-range chickens",
      inStock: true,
      unit: "dozen",
    },
  ];

  // Filter products based on search, category, and location
  const filteredProducts = (() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesLocation =
        !currentLocation ||
        product.vendor.city.toLowerCase().includes(currentLocation.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });
  })();

  // Group products by vendor
  const productsByVendor = (() => {
    const grouped: Record<number, { vendor: Vendor; products: Product[] }> = {};
    
    filteredProducts.forEach((product) => {
      const vendorId = product.vendor.id!;
      if (!grouped[vendorId]) {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          grouped[vendorId] = { vendor, products: [] };
        }
      }
      if (grouped[vendorId]) {
        grouped[vendorId].products.push(product);
      }
    });
    
    return Object.values(grouped);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 relative">
      {/* Animated background elements - using Tailwind classes */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-blue-300/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>

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
              {isAuthenticated && user ? 
                `Bonjour ${user.name} (${user.role === 'family' ? 'Famille' : user.role === 'vendor' ? 'Vendeur' : 'Donateur'})` :
                "Votre marketplace de confiance"
              }
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
                {/* Authentication Section */}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-app-purple capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 group w-full text-left"
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
                      onClick={() => setShowMenu(false)}
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
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full animate-bounce [animation-duration:3s]"></div>
        <div className="relative p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            🎉 Bienvenue sur TeleHiba!
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Découvrez des produits de qualité chez nos vendeurs partenaires.
            Profitez de l'aide solidaire pour vos achats essentiels!
          </p>
        </div>
      </div>

      {/* Search Section - Now before location */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des produits ou vendeurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-app-purple/50 focus:border-app-purple transition-all duration-300"
          />
        </div>
      </div>

      {/* City Selection */}
      <div className="px-4 mb-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-app-purple" />
            Choisir votre ville
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["Paris", "Lyon", "Marseille", "Toulouse", "Nice"].map((city) => (
              <button
                key={city}
                onClick={() => setCurrentLocation(city === currentLocation ? "" : city)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                  currentLocation === city
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products by Vendor Section */}
      <div className="px-4 mb-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choisir ton vendeur, tes produits
          </h2>

          {(() => {
            if (productsByVendor.length === 0) {
              return (
                <div className="text-center py-8 px-4">
                  <div className="text-gray-400 text-4xl mb-2">📦</div>
                  <p className="text-gray-500 text-sm mb-1">Aucun produit trouvé</p>
                  <p className="text-gray-400 text-xs">
                    {searchTerm || currentLocation
                      ? "Essayez de modifier vos critères de recherche"
                      : "Aucun produit disponible"}
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                {productsByVendor.map(({ vendor, products }) => (
                  <div key={vendor.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={vendor.avatar}
                          alt={vendor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{vendor.name}</h3>
                          <p className="text-sm text-gray-600">{vendor.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{vendor.rating}</span>
                            </div>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-sm text-green-600 font-medium">● En ligne</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/vendor-products?vendor=${vendor.id}`}
                        className="bg-app-purple text-white px-4 py-2 rounded-xl hover:bg-app-purple/90 transition-colors font-medium text-sm"
                      >
                        Voir tous
                      </Link>
                    </div>

                    {/* Products Carousel */}
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 pb-4 scrollbar-hide">
                        {products.map((product) => {
                          const quantity = getItemQuantity(product.id);
                          return (
                            <div
                              key={product.id}
                              className="min-w-[200px] bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-xl mb-3"
                              />
                              <h4 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{product.rating}</span>
                              </div>
                              <p className="text-app-purple font-bold text-lg mb-3">
                                €{product.price.toFixed(2)}
                                <span className="text-xs text-gray-500 font-normal">/{product.unit}</span>
                              </p>
                              {quantity === 0 ? (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="w-full bg-app-purple text-white py-2 rounded-xl hover:bg-opacity-90 transition-colors text-sm font-medium"
                                >
                                  <Plus className="w-4 h-4 inline mr-1" />
                                  Ajouter
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
            );
          })()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
