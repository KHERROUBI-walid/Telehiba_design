import React, { memo } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, MapPin, Store, Package } from "lucide-react";
import { Produit } from "../../types/api";
import { useCart } from "../../context/CartContext";
import { toast } from "../ui/use-toast";

interface ProductCardProps {
  product: Produit;
  className?: string;
  onProductClick?: (product: Produit) => void;
  showVendorInfo?: boolean;
  isCompact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  className = "",
  onProductClick,
  showVendorInfo = true,
  isCompact = false,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.est_disponible || product.quantite_dispo <= 0) {
      toast({
        title: "Produit indisponible",
        description: "Ce produit n'est plus en stock",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      nom_produit: product.nom_produit,
      prix: product.prix,
      image_url: product.image_url,
      vendeur_id: product.vendeur_id,
      quantite_dispo: product.quantite_dispo,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.nom_produit} a été ajouté au panier`,
    });
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getVendorInfo = () => {
    if (typeof product.vendeur === 'object' && product.vendeur) {
      const vendeur = product.vendeur;
      const user = typeof vendeur.user === 'object' ? vendeur.user : null;
      
      return {
        nom_societe: vendeur.nom_societe || 'Commerce local',
        ville: user?.ville || 'Non spécifiée',
        nom_complet: user ? `${user.prenom} ${user.nom}` : 'Vendeur',
      };
    }
    return {
      nom_societe: 'Commerce local',
      ville: 'Non spécifiée',
      nom_complet: 'Vendeur',
    };
  };

  const getCategoryInfo = () => {
    if (typeof product.categorie === 'object' && product.categorie) {
      return product.categorie.nom_categorie;
    }
    return 'Non catégorisé';
  };

  const vendorInfo = getVendorInfo();
  const categoryName = getCategoryInfo();

  if (isCompact) {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.nom_produit}
                className="w-16 h-16 object-cover rounded-lg"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
              {!product.est_disponible && (
                <div className="absolute inset-0 bg-gray-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Indisponible</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {product.nom_produit}
              </h3>
              <p className="text-sm text-gray-600">
                {formatPrice(product.prix)}
              </p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Package className="w-3 h-3 mr-1" />
                <span>{product.quantite_dispo} disponible(s)</span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.est_disponible || product.quantite_dispo <= 0}
              className="shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.nom_produit}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
        
        {!product.est_disponible && (
          <div className="absolute inset-0 bg-gray-500/50 rounded-t-lg flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-gray-800 font-medium">
              Indisponible
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {categoryName}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge 
            variant={product.est_disponible ? "default" : "destructive"}
            className="bg-white/90"
          >
            {product.quantite_dispo} en stock
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {product.nom_produit}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {showVendorInfo && (
            <div className="border-t pt-3">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Store className="w-4 h-4 mr-2" />
                <span className="font-medium">{vendorInfo.nom_societe}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{vendorInfo.ville}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(product.prix)}
              </span>
              <span className="text-xs text-gray-500">
                Prix unitaire
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.est_disponible || product.quantite_dispo <= 0}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
