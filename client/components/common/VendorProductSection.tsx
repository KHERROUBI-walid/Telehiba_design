import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Vendor } from "../../data/mockData";
import { Product } from "../../context/CartContext";
import ProductCard from "./ProductCard";

interface VendorProductSectionProps {
  vendor: Vendor;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  getItemQuantity: (productId: number) => number;
  className?: string;
}

const VendorProductSection: React.FC<VendorProductSectionProps> = ({
  vendor,
  products,
  onAddToCart,
  onRemoveFromCart,
  getItemQuantity,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      {/* Vendor Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={vendor.avatar}
            alt={`Photo de profil de ${vendor.name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{vendor.name}</h3>
            <p className="text-sm text-gray-600">{vendor.specialty}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1" aria-label={`Note du vendeur: ${vendor.rating} sur 5 étoiles`}>
                <Star className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                <span className="text-sm text-gray-600">{vendor.rating}</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true"></span>
              <span className="text-sm text-green-600 font-medium">● En ligne</span>
            </div>
          </div>
        </div>
        <Link
          to={`/vendor-products?vendor=${vendor.id}`}
          className="bg-app-purple text-white px-4 py-2 rounded-xl hover:bg-app-purple/90 focus:outline-none focus:ring-2 focus:ring-app-purple/50 transition-colors font-medium text-sm"
          aria-label={`Voir tous les produits de ${vendor.name}`}
        >
          Voir tous
        </Link>
      </div>

      {/* Products Carousel */}
      <div className="overflow-x-auto">
        <div 
          className="flex gap-6 pb-4 scrollbar-hide"
          role="group"
          aria-label={`Produits de ${vendor.name}`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getItemQuantity(product.id)}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorProductSection;
