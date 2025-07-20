import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Star,
  Plus,
  Minus,
  Filter,
  Search,
  Grid3X3,
  List as ListIcon,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart, Product } from "../context/CartContext";

export default function AllProducts() {
  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    { id: "all", name: "Tous", icon: "🏪" },
    { id: "vegetables", name: "Légumes", icon: "🥬" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "clothes", name: "Vêtements", icon: "👕" },
    { id: "medicine", name: "Médicaments", icon: "💊" },
    { id: "electronics", name: "Électronique", icon: "📱" },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Tomates Bio Fraîches",
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
        "Tomates biologiques cultivées localement, parfaites pour les salades",
      inStock: true,
    },
    {
      id: 2,
      name: "Pommes Rouges",
      price: 3.5,
      image: "🍎",
      category: "fruits",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "👩‍⚕️",
        city: "New York, USA",
      },
      rating: 4.7,
      description: "Pommes sucrées et croquantes, riches en vitamines",
      inStock: true,
    },
    {
      id: 3,
      name: "T-Shirt en Coton",
      price: 19.99,
      image: "👕",
      category: "clothes",
      vendor: {
        id: 2,
        name: "Dr. Michael Chen",
        avatar: "👨‍⚕️",
        city: "Brooklyn, NY",
      },
      rating: 4.9,
      description: "T-shirt 100% coton, confortable et respirant",
      inStock: true,
    },
    {
      id: 4,
      name: "Carottes Fraîches",
      price: 2.99,
      image: "🥕",
      category: "vegetables",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar: "👩‍🍳",
        city: "Manhattan, NY",
      },
      rating: 4.6,
      description: "Carottes biologiques parfaites pour la cuisine",
      inStock: true,
    },
    {
      id: 5,
      name: "Bananes",
      price: 2.49,
      image: "🍌",
      category: "fruits",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar: "👩‍🍳",
        city: "Manhattan, NY",
      },
      rating: 4.5,
      description: "Bananes mûres riches en potassium",
      inStock: true,
    },
    {
      id: 6,
      name: "Jean en Denim",
      price: 39.99,
      image: "👖",
      category: "clothes",
      vendor: {
        id: 4,
        name: "Dr. James Rodriguez",
        avatar: "👨‍💼",
        city: "Queens, NY",
      },
      rating: 4.8,
      description: "Jean en denim premium avec coupe parfaite",
      inStock: true,
    },
    {
      id: 7,
      name: "Épinards Frais",
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
      description: "Épinards verts frais, parfaits pour les smoothies",
      inStock: false,
    },
    {
      id: 8,
      name: "Oranges",
      price: 4.2,
      image: "🍊",
      category: "fruits",
      vendor: {
        id: 3,
        name: "Dr. Emma Wilson",
        avatar: "👩‍🍳",
        city: "Manhattan, NY",
      },
      rating: 4.6,
      description: "Oranges juteuses remplies de vitamine C",
      inStock: true,
    },
    {
      id: 9,
      name: "Smartphone",
      price: 299.99,
      image: "📱",
      category: "electronics",
      vendor: {
        id: 6,
        name: "Hassan Al-Rashid",
        avatar: "👨‍🔬",
        city: "Dubai, UAE",
      },
      rating: 4.7,
      description: "Smartphone moderne avec toutes les fonctionnalités",
      inStock: true,
    },
    {
      id: 10,
      name: "Vitamines",
      price: 15.99,
      image: "💊",
      category: "medicine",
      vendor: {
        id: 2,
        name: "Dr. Michael Chen",
        avatar: "👨‍⚕️",
        city: "Brooklyn, NY",
      },
      rating: 4.8,
      description: "Complexe vitaminique pour une santé optimale",
      inStock: true,
    },
  ];

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory,
    )
    .sort((a, b) => {
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
          <div>
            <h1 className="text-lg font-bold text-white">Tous les Produits</h1>
            <p className="text-sm text-white/80">
              {filteredProducts.length} produit
              {filteredProducts.length !== 1 ? "s" : ""} trouvé
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
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

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit, vendeur..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          />
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-app-purple text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center justify-between">
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
      </div>

      {/* Products Grid/List */}
      <div className="p-4 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucun produit trouvé</p>
            <p className="text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => {
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

                  {/* Price */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-app-purple">
                      ${product.price}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  {product.inStock ? (
                    quantity === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-app-purple text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Ajouter</span>
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
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
