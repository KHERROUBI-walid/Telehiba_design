import { useState } from "react";
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
  const [selectedCity, setSelectedCity] = useState<string>("");
  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
  } = useCart();

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
      icon: "��",
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
      avatar: "👩‍⚕️",
      city: "New York, USA",
      specialty: "Fruits & Vegetables",
      rating: 4.8,
      gradient: "from-app-purple to-app-sky",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar: "👨‍⚕️",
      city: "Brooklyn, NY",
      specialty: "Medicine & Health",
      rating: 4.9,
      gradient: "from-app-pink to-app-purple",
    },
    {
      id: 3,
      name: "Dr. Emma Wilson",
      avatar: "👩‍🍳",
      city: "Manhattan, NY",
      specialty: "Organic Foods",
      rating: 4.7,
      gradient: "from-app-sky to-app-pink",
    },
    {
      id: 4,
      name: "Dr. James Rodriguez",
      avatar: "👨‍💼",
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
      image: "🍅",
      category: "vegetables",
      vendor: {
        id: 1,
        name: "Dr. Sarah Johnson",
        avatar: "👩‍⚕️",
        city: "New York, USA",
      },
      rating: 4.8,
    },
    {
      id: 2,
      name: "Red Apples",
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
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
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
    },
    {
      id: 4,
      name: "Fresh Carrots",
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
    },
    {
      id: 5,
      name: "Bananas",
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
    },
    {
      id: 6,
      name: "Denim Jeans",
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
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <h1 className="text-xl font-bold text-white">TeleHiba</h1>
        <div className="flex items-center gap-3">
          <Link to="/notifications">
            <Bell className="w-6 h-6 text-white hover:text-white/80 transition-colors" />
          </Link>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Search Bar and Location */}
      <div className="p-4 space-y-3 bg-white">
        {/* Location - visible on small screens below search */}
        <div className="flex md:hidden justify-center">
          <div className="bg-app-dark-blue text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            New York, USA
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Location - visible on larger screens */}
          <div className="hidden md:flex bg-app-dark-blue text-white px-4 py-2 rounded-full text-sm items-center gap-2">
            <MapPin className="w-4 h-4" />
            New York, USA
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 shadow-lg">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search Doctor"
                className="flex-1 outline-none text-xs placeholder-gray-400 bg-transparent"
                style={{ fontSize: "9px" }}
              />
              <Filter className="w-5 h-5 text-gray-400 ml-3" />
            </div>
          </div>
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
          <h3 className="text-lg font-semibold text-gray-800">Catégories</h3>
          <Link
            to="/all-categories"
            className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2">
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
          {categories.map((category) => (
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
      </div>

      {/* Vendors Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Vendeurs</h3>
          <Link
            to="/all-vendors"
            className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2">
          {vendors.map((vendor) => (
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
      </div>

      {/* Products Section */}
      <div className="px-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedCategory === "all"
              ? "Produits Populaires"
              : `Produits ${categories.find((c) => c.id === selectedCategory)?.name}`}
          </h3>
          <Link
            to="/all-products"
            className="flex items-center gap-1 text-app-purple text-sm font-medium hover:text-app-purple/80 transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const quantity = getItemQuantity(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
              >
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

                {/* Add to Cart Controls */}
                {quantity === 0 ? (
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
                )}
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Aucun produit trouvé dans cette catégorie</p>
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
