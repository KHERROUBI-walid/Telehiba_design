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
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
      city: "New York, USA",
      specialty: "Fruits & Vegetables",
      rating: 4.8,
      gradient: "from-app-purple to-app-sky",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      city: "Brooklyn, NY",
      specialty: "Medicine & Health",
      rating: 4.9,
      gradient: "from-app-pink to-app-purple",
    },
    {
      id: 3,
      name: "Dr. Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=80&h=80&fit=crop&crop=face",
      city: "Manhattan, NY",
      specialty: "Organic Foods",
      rating: 4.7,
      gradient: "from-app-sky to-app-pink",
    },
    {
      id: 4,
      name: "Dr. James Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
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
      image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.8,
      unit: "Kg",
    },
    {
      id: 2,
      name: "Red Apples",
      price: 3.5,
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face",
        city: "New York, USA",
      },
      rating: 4.7,
      unit: "Kg",
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
      category: "clothes",
      vendor: {
        id: 2,
        name: "Dr. Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
        city: "Brooklyn, NY",
      },
      rating: 4.9,
      unit: "unité",
    },
    {
      id: 4,
      name: "Fresh Carrots",
      price: 2.99,
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center",
      category: "vegetables",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=60&h=60&fit=crop&crop=face",
        city: "Manhattan, NY",
      },
      rating: 4.6,
      unit: "Kg",
    },
    {
      id: 5,
      name: "Bananas",
      price: 2.49,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
      category: "fruits",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=60&h=60&fit=crop&crop=face",
        city: "Manhattan, NY",
      },
      rating: 4.5,
      unit: "Kg",
    },
    {
      id: 6,
      name: "Denim Jeans",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&crop=center",
      category: "clothes",
      vendor: {
        id: 4,
        name: "Dr. James Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
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
    const matchesCity = currentLocation === "" || vendor.city === currentLocation;
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
    const matchesCity = currentLocation === "" || product.vendor.city === currentLocation;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <h1 className="text-xl font-bold text-white">TeleHiba</h1>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-white hover:text-white/80 transition-colors" />
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 w-48 py-2 z-50">
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Nous contacter
                </Link>
                <Link
                  to="/report-problem"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Signaler un problème
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <Info className="w-4 h-4" />
                  À propos de nous
                </Link>
                <Link
                  to="/help"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <Info className="w-4 h-4" />
                  Aide & Support
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar and Location */}
      <div className="p-4 space-y-3 bg-white">
        {/* Location Selector */}
        <div className="flex justify-center">
          <select
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="bg-app-dark-blue text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 border-none outline-none cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 8px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "16px",
              paddingRight: "32px",
            }}
          >
            <option value="">🌍 Toutes les villes</option>
            <option value="New York, USA">📍 New York, USA</option>
            <option value="Manhattan, NY">📍 Manhattan, NY</option>
            <option value="Brooklyn, NY">📍 Brooklyn, NY</option>
            <option value="Paris, France">📍 Paris, France</option>
            <option value="Montreal, Canada">📍 Montreal, Canada</option>
            <option value="Lyon, France">📍 Lyon, France</option>
          </select>
        </div>

        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 shadow-lg">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Rechercher catégories, vendeurs, produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Clear search button */}
          {searchTerm && (
            <div className="flex justify-center">
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-app-purple to-app-pink rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-2">
          Choisi ton vendeur, tes produits
        </h2>
        <p className="text-sm opacity-90">
          Envoi la commande et attends la notif
        </p>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Catégories {searchTerm && `(${filteredCategories.length})`}
          </h3>
          <Link
            to="/all-categories"
            className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2">
            {!searchTerm && (
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all ${
                  selectedCategory === "all"
                    ? "bg-app-purple text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="text-lg mb-1">🏪</span>
                <span className="text-xs font-medium">Tous</span>
              </button>
            )}
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category-products?category=${category.id}`}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all bg-gradient-to-br ${category.gradient} text-white hover:shadow-lg hover:scale-105`}
              >
                <span className="text-lg mb-1">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8 px-4">
            <div className="text-gray-400 text-3xl mb-2">🔍</div>
            <p className="text-gray-500 text-sm">Aucune catégorie trouvée</p>
            <p className="text-gray-400 text-xs">
              Essayez un autre terme de recherche
            </p>
          </div>
        ) : null}
      </div>

      {/* Vendors Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Vendeurs{" "}
            {(searchTerm || currentLocation) && `(${filteredVendors.length})`}
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
                  className={`w-full h-20 bg-gradient-to-br ${vendor.gradient} rounded-xl mb-3 flex items-center justify-center text-2xl`}
                >
                  {vendor.avatar}
                </div>
                <h4 className="font-medium text-gray-800 text-sm mb-1">
                  {vendor.name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{vendor.city}</p>
                <p className="text-xs text-app-purple font-medium mb-2">
                  {vendor.specialty}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{vendor.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : searchTerm || currentLocation ? (
          <div className="text-center py-8 px-4">
            <div className="text-gray-400 text-3xl mb-2">👩‍⚕️</div>
            <p className="text-gray-500 text-sm">Aucun vendeur trouvé</p>
            <p className="text-gray-400 text-xs">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : null}
      </div>

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
          const productsByVendor = filteredProducts.reduce((acc, product) => {
            const vendorKey = `${product.vendor.name}-${product.vendor.city}`;
            if (!acc[vendorKey]) {
              acc[vendorKey] = {
                vendor: product.vendor,
                products: []
              };
            }
            acc[vendorKey].products.push(product);
            return acc;
          }, {} as Record<string, { vendor: any; products: typeof filteredProducts }>);

          const vendorGroups = Object.values(productsByVendor);

          return vendorGroups.length > 0 ? (
            <div className="space-y-6">
              {vendorGroups.map((group, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                  {/* Vendor Header */}
                  <div className="px-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-xl">
                        {group.vendor.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          {group.vendor.name}
                        </h4>
                        <p className="text-sm text-gray-500">{group.vendor.city}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-sm text-app-purple font-medium">
                          {group.products.length} produit{group.products.length > 1 ? 's' : ''}
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
                            <div className="w-full h-32 bg-gradient-to-br from-app-purple to-app-sky rounded-xl mb-3 flex items-center justify-center text-3xl">
                              {product.image}
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
                                  {quantity} {product.unit || ''}
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
