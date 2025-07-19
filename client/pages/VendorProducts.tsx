import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Bell,
  User,
  X,
  Trash2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function VendorProducts() {
  const [searchParams] = useSearchParams();
  const vendorName = searchParams.get("vendor") || "Dr. Sarah Johnson";
  const vendorCity = searchParams.get("city") || "New York, USA";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const clearItemFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (productId: number) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

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
          <Bell className="w-6 h-6 text-white" />
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

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-20 right-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-app-yellow text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {getTotalItems()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-app-purple to-app-sky">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Your Cart</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center text-2xl">
                            {item.product.image}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-sm">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                              ${item.product.price} each
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    removeFromCart(item.product.id)
                                  }
                                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item.product)}
                                  className="w-6 h-6 bg-app-purple text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Remove Item */}
                              <button
                                onClick={() =>
                                  clearItemFromCart(item.product.id)
                                }
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="mt-2 text-right">
                              <span className="font-bold text-app-purple">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  {/* Clear All Button */}
                  <button
                    onClick={clearCart}
                    className="w-full text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Clear All Items
                  </button>

                  {/* Total */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">
                      Total ({getTotalItems()} items)
                    </span>
                    <span className="font-bold text-xl text-app-purple">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full bg-app-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">
              Total ({getTotalItems()} items)
            </span>
            <span className="font-bold text-lg text-app-purple">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          <button className="w-full bg-app-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
