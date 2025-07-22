import { useCart } from "../context/CartContext";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

export default function CartSidebar() {
  const {
    cart,
    isCartOpen,
    closeCart,
    addToCart,
    removeFromCart,
    clearItemFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      ></div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-app-purple to-app-sky">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Votre Panier</h2>
            </div>
            <button
              onClick={closeCart}
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
                <p>Votre panier est vide</p>
                <button
                  onClick={closeCart}
                  className="mt-4 text-app-purple hover:text-app-purple/80 font-medium"
                >
                  Continuer vos achats
                </button>
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
                          ${item.product.price} chacun
                        </p>

                        {/* Vendor Info */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-xs">
                            {item.product.vendor.avatar}
                          </div>
                          <span className="text-xs text-gray-600">
                            {item.product.vendor.name}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-medium text-sm">
                              {item.quantity} {item.product.unit || ''}
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
                            onClick={() => clearItemFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="font-bold text-app-purple">
                            ${(item.product.price * item.quantity).toFixed(2)}
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
                Vider le panier
              </button>

              {/* Total */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">
                  Total ({getTotalItems()} articles)
                </span>
                <span className="font-bold text-xl text-app-purple">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  // Handle order submission
                  console.log("Sending order:", cart);
                  closeCart();
                }}
                className="w-full bg-app-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Envoyer la commande
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
