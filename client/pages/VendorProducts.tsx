import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Plus, Minus, Bell, User, Filter } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart, Product } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description: string;
}

export default function VendorProducts() {
  const [searchParams] = useSearchParams();
  const vendorName = searchParams.get("vendor") || "Dr. Sarah Johnson";
  const vendorCity = searchParams.get("city") || "New York, USA";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
    isCartOpen,
  } = useCart();

  const products: Product[] = [
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      price: 4.99,
      image: "🍅",
      rating: 4.8,
      category: "vegetables",
      description: "Fresh, organic tomatoes grown locally",
    },
    {
      id: 2,
      name: "Red Apples",
      price: 3.5,
      image: "🍎",
      rating: 4.7,
      category: "fruits",
      description: "Sweet and crispy red apples",
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 19.99,
      image: "👕",
      rating: 4.9,
      category: "clothes",
      description: "100% cotton comfortable t-shirt",
    },
    {
      id: 4,
      name: "Fresh Carrots",
      price: 2.99,
      image: "🥕",
      rating: 4.6,
      category: "vegetables",
      description: "Organic carrots perfect for cooking",
    },
    {
      id: 5,
      name: "Bananas",
      price: 2.49,
      image: "🍌",
      rating: 4.5,
      category: "fruits",
      description: "Ripe yellow bananas rich in potassium",
    },
    {
      id: 6,
      name: "Denim Jeans",
      price: 39.99,
      image: "👖",
      rating: 4.8,
      category: "clothes",
      description: "Premium denim jeans with perfect fit",
    },
    {
      id: 7,
      name: "Spinach Leaves",
      price: 3.99,
      image: "🥬",
      rating: 4.4,
      category: "vegetables",
      description: "Fresh green spinach leaves",
    },
    {
      id: 8,
      name: "Orange",
      price: 4.2,
      image: "🍊",
      rating: 4.6,
      category: "fruits",
      description: "Juicy oranges packed with vitamin C",
    },
  ];

  const categories = [
    { id: "all", name: "All", icon: "🏪" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "clothes", name: "Clothes", icon: "👕" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">{vendorName}</h1>
            <p className="text-sm text-white/80">{vendorCity}</p>
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

      {/* Category Filter */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
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
      </div>

      {/* Products Grid */}
      <div className="p-4 pb-32">
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
                <h3 className="font-medium text-gray-800 text-sm mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">
                    {product.rating}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
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
                    <span className="text-sm">Add to Cart</span>
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
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        isVisible={!isCartOpen}
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
