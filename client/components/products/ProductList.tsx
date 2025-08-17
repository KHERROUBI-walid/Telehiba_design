import React, { useState, useEffect, useMemo, memo } from "react";
import { Produit, ProductFilters } from "../../types/api";
import { ProductCard } from "./ProductCard";
import { ProductFiltersComponent } from "./ProductFilters";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { 
  Search, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc, 
  Package,
  AlertCircle 
} from "lucide-react";

interface ProductListProps {
  products: Produit[];
  loading?: boolean;
  error?: string;
  onProductClick?: (product: Produit) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
  className?: string;
}

type SortOption = "nom_asc" | "nom_desc" | "prix_asc" | "prix_desc" | "date_desc";
type ViewMode = "grid" | "list";

export const ProductList: React.FC<ProductListProps> = memo(({
  products,
  loading = false,
  error,
  onProductClick,
  showFilters = true,
  showSearch = true,
  itemsPerPage = 12,
  className = "",
}) => {
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Réinitialiser la page lors du changement de filtres
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  // Produits filtrés et triés
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nom_produit.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    // Filtrer par catégorie
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(product => {
        const categorie = typeof product.categorie === 'object' 
          ? product.categorie?.nom_categorie 
          : '';
        return categorie?.toLowerCase() === filters.category?.toLowerCase();
      });
    }

    // Filtrer par ville
    if (filters.city && filters.city !== "all") {
      filtered = filtered.filter(product => {
        const vendeur = typeof product.vendeur === 'object' ? product.vendeur : null;
        const user = vendeur && typeof vendeur.user === 'object' ? vendeur.user : null;
        return user?.ville?.toLowerCase() === filters.city?.toLowerCase();
      });
    }

    // Filtrer par prix
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.prix >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.prix <= filters.maxPrice!);
    }

    // Filtrer par disponibilité
    if (filters.available !== undefined) {
      filtered = filtered.filter(product => 
        product.est_disponible === filters.available && 
        product.quantite_dispo > 0
      );
    }

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "nom_asc":
          return a.nom_produit.localeCompare(b.nom_produit);
        case "nom_desc":
          return b.nom_produit.localeCompare(a.nom_produit);
        case "prix_asc":
          return a.prix - b.prix;
        case "prix_desc":
          return b.prix - a.prix;
        case "date_desc":
          return new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  // Composant de pagination
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Barre de recherche et contrôles */}
      <div className="space-y-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Sélecteur de tri */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="date_desc">Plus récents</option>
              <option value="nom_asc">Nom A-Z</option>
              <option value="nom_desc">Nom Z-A</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>

          {/* Contrôles de vue */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} produit(s)
            </span>
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={handleFilterChange}
          products={products}
        />
      )}

      {/* Liste des produits */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche ou filtres.
          </p>
        </div>
      ) : (
        <>
          <div 
            className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                isCompact={viewMode === 'list'}
                showVendorInfo={true}
              />
            ))}
          </div>

          <Pagination />
        </>
      )}
    </div>
  );
});

ProductList.displayName = "ProductList";
