import React, { useState, useMemo, memo } from "react";
import { Produit, ProductFilters } from "../../types/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  Tag,
  Euro,
  RotateCcw,
} from "lucide-react";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  products: Produit[];
  className?: string;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = memo(
  ({ filters, onFiltersChange, products, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({
      min: filters.minPrice?.toString() || "",
      max: filters.maxPrice?.toString() || "",
    });

    // Extraire les options disponibles depuis les produits
    const filterOptions = useMemo(() => {
      const categories = new Set<string>();
      const cities = new Set<string>();
      let minPrice = Infinity;
      let maxPrice = 0;

      products.forEach((product) => {
        // Catégories
        if (typeof product.categorie === "object" && product.categorie) {
          categories.add(product.categorie.nom_categorie);
        }

        // Villes
        if (typeof product.vendeur === "object" && product.vendeur) {
          const user =
            typeof product.vendeur.user === "object"
              ? product.vendeur.user
              : null;
          if (user?.ville) {
            cities.add(user.ville);
          }
        }

        // Prix
        if (product.prix < minPrice) minPrice = product.prix;
        if (product.prix > maxPrice) maxPrice = product.prix;
      });

      return {
        categories: Array.from(categories).sort(),
        cities: Array.from(cities).sort(),
        priceRange: {
          min: minPrice === Infinity ? 0 : minPrice,
          max: maxPrice,
        },
      };
    }, [products]);

    // Handlers
    const updateFilters = (newFilters: Partial<ProductFilters>) => {
      onFiltersChange({ ...filters, ...newFilters });
    };

    const handleCategoryChange = (category: string) => {
      if (filters.category === category) {
        updateFilters({ category: undefined });
      } else {
        updateFilters({ category });
      }
    };

    const handleCityChange = (city: string) => {
      if (filters.city === city) {
        updateFilters({ city: undefined });
      } else {
        updateFilters({ city });
      }
    };

    const handlePriceRangeChange = (type: "min" | "max", value: string) => {
      setPriceRange((prev) => ({ ...prev, [type]: value }));

      const numValue = value === "" ? undefined : parseFloat(value);
      if (type === "min") {
        updateFilters({ minPrice: numValue });
      } else {
        updateFilters({ maxPrice: numValue });
      }
    };

    const handleAvailabilityToggle = () => {
      updateFilters({
        available: filters.available === true ? undefined : true,
      });
    };

    const clearAllFilters = () => {
      onFiltersChange({});
      setPriceRange({ min: "", max: "" });
    };

    const getActiveFiltersCount = () => {
      let count = 0;
      if (filters.category) count++;
      if (filters.city) count++;
      if (filters.minPrice !== undefined) count++;
      if (filters.maxPrice !== undefined) count++;
      if (filters.available) count++;
      return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
      <Card className={className}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      className="text-sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Catégories */}
              {filterOptions.categories.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Tag className="w-4 h-4" />
                    Catégories
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.categories.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.category === category ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                        {filters.category === category && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Villes */}
              {filterOptions.cities.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <MapPin className="w-4 h-4" />
                    Villes
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.cities.map((city) => (
                      <Badge
                        key={city}
                        variant={filters.city === city ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => handleCityChange(city)}
                      >
                        {city}
                        {filters.city === city && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Fourchette de prix */}
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Euro className="w-4 h-4" />
                  Prix (€)
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Min (${filterOptions.priceRange.min.toFixed(2)})`}
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", e.target.value)
                      }
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Max (${filterOptions.priceRange.max.toFixed(2)})`}
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", e.target.value)
                      }
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fourchette: {filterOptions.priceRange.min.toFixed(2)}€ -{" "}
                  {filterOptions.priceRange.max.toFixed(2)}€
                </div>
              </div>

              {/* Disponibilité */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Disponibilité
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={filters.available === true}
                    onChange={handleAvailabilityToggle}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="available" className="text-sm text-gray-700">
                    Uniquement les produits en stock
                  </label>
                </div>
              </div>

              {/* Résumé des filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium mb-2 block">
                    Filtres actifs
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <Badge variant="secondary" className="gap-1">
                        Catégorie: {filters.category}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => updateFilters({ category: undefined })}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.city && (
                      <Badge variant="secondary" className="gap-1">
                        Ville: {filters.city}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => updateFilters({ city: undefined })}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.minPrice !== undefined && (
                      <Badge variant="secondary" className="gap-1">
                        Prix min: {filters.minPrice}€
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => {
                            updateFilters({ minPrice: undefined });
                            setPriceRange((prev) => ({ ...prev, min: "" }));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.maxPrice !== undefined && (
                      <Badge variant="secondary" className="gap-1">
                        Prix max: {filters.maxPrice}€
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => {
                            updateFilters({ maxPrice: undefined });
                            setPriceRange((prev) => ({ ...prev, max: "" }));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.available && (
                      <Badge variant="secondary" className="gap-1">
                        En stock uniquement
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() =>
                            updateFilters({ available: undefined })
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  },
);

ProductFiltersComponent.displayName = "ProductFilters";
