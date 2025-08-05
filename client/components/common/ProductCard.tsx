import React from "react";
import { Star, Plus, Minus } from "lucide-react";
import { Product } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  className = ""
}) => {
  return (
    <div className={`min-w-[160px] sm:min-w-[200px] bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}>
      <img
        src={product.image}
        alt={`${product.name} - ${product.description}`}
        className="w-full h-32 object-cover rounded-xl mb-3"
        loading="lazy"
      />
      
      <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-tight">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-1 mb-2" aria-label={`Note: ${product.rating} sur 5 étoiles`}>
        <Star className="w-3 h-3 text-yellow-400 fill-current" aria-hidden="true" />
        <span className="text-xs text-gray-600">{product.rating}</span>
      </div>
      
      <p className="text-app-purple font-bold text-lg mb-3">
        €{product.price.toFixed(2)}
        <span className="text-xs text-gray-500 font-normal">/{product.unit}</span>
      </p>
      
      {quantity === 0 ? (
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-app-purple text-white py-2 rounded-xl hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-app-purple/50 transition-colors text-sm font-medium"
          aria-label={`Ajouter ${product.name} au panier`}
        >
          <Plus className="w-4 h-4 inline mr-1" aria-hidden="true" />
          Ajouter
        </button>
      ) : (
        <div className="flex items-center justify-between" role="group" aria-label={`Quantité de ${product.name}: ${quantity}`}>
          <button
            onClick={() => onRemoveFromCart(product.id)}
            className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-colors"
            aria-label={`Réduire la quantité de ${product.name}`}
          >
            <Minus className="w-3 h-3" aria-hidden="true" />
          </button>
          
          <span className="font-medium text-gray-800 text-sm" aria-live="polite">
            {quantity} {product.unit || ""}
          </span>
          
          <button
            onClick={() => onAddToCart(product)}
            className="w-7 h-7 bg-app-purple text-white rounded-full flex items-center justify-center hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-app-purple/50 transition-colors"
            aria-label={`Augmenter la quantité de ${product.name}`}
          >
            <Plus className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
