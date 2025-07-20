import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Filter,
  Grid3X3,
  List as ListIcon,
  Search,
  X,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  vendor: {
    id: number;
    name: string;
    avatar: string;
    city: string;
  };
  rating: number;
  description: string;
  inStock: boolean;
}

interface Vendor {
  id: number;
  name: string;
  avatar: string;
  city: string;
  specialty: string;
  rating: number;
  gradient: string;
  totalProducts: number;
}

const categoryData = {
  vegetables: {
    name: "Vegetables",
    icon: "🥬",
    gradient: "from-app-purple to-app-pink",
  },
  fruits: {
    name: "Fruits",
    icon: "🍎",
    gradient: "from-app-sky to-app-purple",
  },
  clothes: {
    name: "Clothes",
    icon: "👕",
    gradient: "from-app-pink to-app-sky",
  },
  medicine: {
    name: "Medicine",
    icon: "💊",
    gradient: "from-app-purple to-app-sky",
  },
  electronics: {
    name: "Electronics",
    icon: "📱",
    gradient: "from-app-sky to-app-pink",
  },
};

export default function CategoryProducts() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "vegetables";
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
  } = useCart();

  const category =
    categoryData[categoryId as keyof typeof categoryData] ||
    categoryData.vegetables;

  // Mock data - vendors that have products in this category
  const allCategoryVendors: Vendor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "👩‍⚕️",
      city: "New York, USA",
      specialty: "Organic Farming",
      rating: 4.8,
      gradient: "from-app-purple to-app-sky",
      totalProducts: 12,
    },
    {
      id: 2,
      name: "Dr. Emma Wilson",
      avatar: "👩‍🍳",
      city: "Manhattan, NY",
      specialty: "Fresh Produce",
      rating: 4.7,
      gradient: "from-app-sky to-app-pink",
      totalProducts: 8,
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      avatar: "👨‍⚕️",
      city: "Brooklyn, NY",
      specialty: "Health Foods",
      rating: 4.9,
      gradient: "from-app-pink to-app-purple",
      totalProducts: 15,
    },
    {
      id: 4,
      name: "Dr. Lisa Martinez",
      avatar: "👩‍🌾",
      city: "Paris, France",
      specialty: "Organic Vegetables",
      rating: 4.6,
      gradient: "from-app-purple to-app-pink",
      totalProducts: 10,
    },
    {
      id: 5,
      name: "Dr. Ahmed Hassan",
      avatar: "👨‍🌾",
      city: "Montreal, Canada",
      specialty: "Farm Fresh",
      rating: 4.8,
      gradient: "from-app-sky to-app-purple",
      totalProducts: 14,
    },
    {
      id: 6,
      name: "Dr. Sophie Dubois",
      avatar: "👩‍🍳",
      city: "Lyon, France",
      specialty: "Gourmet Produce",
      rating: 4.9,
      gradient: "from-app-pink to-app-sky",
      totalProducts: 9,
    },
  ];

  // Get unique cities for filter
  const uniqueCities = Array.from(
    new Set(allCategoryVendors.map((vendor) => vendor.city)),
  );

  // Filter vendors based on search term and city
  const filteredVendors = allCategoryVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "" || vendor.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const categoryVendors = filteredVendors;

  // Filter products based on search term and city (vendor city)
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      selectedCity === "" || product.vendor.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  // Mock products for the category
  const categoryProducts: Product[] = [
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      price: 4.99,
      image: "🍅",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "👩‍⚕️",
        city: "New York, USA",
      },
      rating: 4.8,
      description:
        "Locally grown organic tomatoes, perfect for salads and cooking",
      inStock: true,
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: 2.99,
      image: "🥕",
      category: "vegetables",
      vendor: {
        id: 2,
        name: "Dr. Emma Wilson",
        avatar: "👩��🍳",
        city: "Manhattan, NY",
      },
      rating: 4.6,
      description: "Sweet and crunchy carrots, rich in vitamins",
      inStock: true,
    },
    {
      id: 3,
      name: "Spinach Leaves",
      price: 3.99,
      image: "🥬",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "👩‍⚕️",
        city: "New York, USA",
      },
      rating: 4.4,
      description: "Fresh green spinach, perfect for smoothies and salads",
      inStock: true,
    },
    {
      id: 4,
      name: "Bell Peppers",
      price: 5.49,
      image: "🫑",
      category: "vegetables",
      vendor: {
        id: 3,
        name: "Dr. Michael Chen",
        avatar: "👨‍⚕️",
        city: "Brooklyn, NY",
      },
      rating: 4.7,
      description: "Colorful bell peppers, great for cooking and grilling",
      inStock: true,
    },
    {
      id: 5,
      name: "Broccoli",
      price: 3.49,
      image: "🥦",
      category: "vegetables",
      vendor: {
        id: 2,
        name: "Dr. Emma Wilson",
        avatar: "👩‍🍳",
        city: "Manhattan, NY",
      },
      rating: 4.5,
      description: "Fresh broccoli crowns, packed with nutrients",
      inStock: false,
    },
    {
      id: 6,
      name: "Cucumber",
      price: 2.49,
      image: "🥒",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "👩‍⚕️",
        city: "New York, USA",
      },
      rating: 4.3,
      description: "Crisp and refreshing cucumbers, perfect for salads",
      inStock: true,
    },
  ];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="text-2xl">{category.icon}</div>
            <div>
              <h1 className="text-lg font-bold text-white">{category.name}</h1>
              <p className="text-sm text-white/80">
                {filteredProducts.length} produits • {categoryVendors.length}{" "}
                vendeurs
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-white hover:text-white/80 transition-colors" />
          </Link>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Vendors Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Vendeurs qui ont des produits de cette categorie
          </h3>
          <span className="text-sm text-gray-500">
            {categoryVendors.length} vendeur
            {categoryVendors.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un vendeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent text-sm bg-white min-w-[140px]"
          >
            <option value="">Toutes les villes</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Vendors List */}
        {categoryVendors.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categoryVendors.map((vendor) => (
              <Link
                key={vendor.id}
                to={`/vendor-products?vendor=${vendor.name}&city=${vendor.city}`}
                className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow w-48"
              >
                <div
                  className={`w-full h-16 bg-gradient-to-br ${vendor.gradient} rounded-xl mb-3 flex items-center justify-center text-xl`}
                >
                  {vendor.avatar}
                </div>
                <h4 className="font-medium text-gray-800 text-sm mb-1">
                  {vendor.name}
                </h4>
                <p className="text-xs text-gray-500 mb-1">{vendor.city}</p>
                <p className="text-xs text-app-purple font-medium mb-2">
                  {vendor.specialty}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">
                      {vendor.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {vendor.totalProducts} produits
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🔍</div>
            <p className="text-gray-500 text-sm mb-1">Aucun vendeur trouvé</p>
            <p className="text-gray-400 text-xs">
              {searchTerm || selectedCity
                ? "Essayez de modifier vos critères de recherche"
                : "Aucun vendeur disponible dans cette catégorie"}
            </p>
            {(searchTerm || selectedCity) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("");
                }}
                className="mt-3 text-app-purple text-sm hover:underline"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Sort */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-app-purple"
          >
            <option value="rating">Mieux notés</option>
            <option value="price">Prix croissant</option>
            <option value="name">Nom A-Z</option>
          </select>

          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-app-purple text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-app-purple text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="p-4 pb-24">
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"
          }
        >
          {sortedProducts.map((product) => {
            const quantity = getItemQuantity(product.id);

            if (viewMode === "list") {
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex gap-4"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-app-purple to-app-sky rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {product.image}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm mb-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      {!product.inStock && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                          Rupture
                        </span>
                      )}
                    </div>

                    {/* Vendor Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-xs">
                        {product.vendor.avatar}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          {product.vendor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.vendor.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                        <span className="font-bold text-app-purple">
                          ${product.price}
                        </span>
                      </div>

                      {product.inStock && (
                        <div className="flex items-center gap-2">
                          {quantity === 0 ? (
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-app-purple text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition-colors"
                            >
                              Ajouter
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-medium text-gray-800 min-w-[1rem] text-center">
                                {quantity}
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
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 relative"
              >
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    Rupture
                  </div>
                )}

                {/* Product Image */}
                <div className="w-full h-32 bg-gradient-to-br from-app-purple to-app-sky rounded-xl mb-3 flex items-center justify-center text-4xl">
                  {product.image}
                </div>

                {/* Product Info */}
                <h4 className="font-medium text-gray-800 text-sm mb-1">
                  {product.name}
                </h4>

                {/* Vendor Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-xs">
                    {product.vendor.avatar}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      {product.vendor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.vendor.city}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">
                    {product.rating}
                  </span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-app-purple">
                    ${product.price}
                  </span>
                </div>

                {product.inStock ? (
                  quantity === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-app-purple text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Ajouter au panier</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 bg-app-purple text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg text-sm cursor-not-allowed"
                  >
                    Non disponible
                  </button>
                )}
              </div>
            );
          })}
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
