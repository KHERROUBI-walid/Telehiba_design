import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { categories } from "../data/mockData";
import PageContainer from "../components/common/PageContainer";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import CitySelector from "../components/common/CitySelector";
import VendorProductSection from "../components/common/VendorProductSection";
import BottomNavigation from "../components/BottomNavigation";

export default function Shopping() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [showMenu, setShowMenu] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    addToCart,
    removeFromCart,
    getItemQuantity,
    getTotalItems,
    openCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productsData, vendorsData, citiesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getVendors(),
          apiService.getCities()
        ]);

        setProducts(productsData);
        setVendors(vendorsData);
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch filtered products when search criteria change
  useEffect(() => {
    if (!isLoading) {
      const fetchFilteredProducts = async () => {
        try {
          const filters: any = {};
          if (selectedCategory !== "all") filters.category = selectedCategory;
          if (searchTerm) filters.search = searchTerm;
          if (currentLocation) filters.city = currentLocation;

          const filteredProducts = await apiService.getProducts(filters);
          setProducts(filteredProducts);
        } catch (error) {
          console.error("Error fetching filtered products:", error);
        }
      };

      fetchFilteredProducts();
    }
  }, [selectedCategory, searchTerm, currentLocation, isLoading]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group products by vendor
  const productsByVendor = (() => {
    const grouped: Record<number, { vendor: any; products: any[] }> = {};

    products.forEach((product) => {
      const vendorId = product.vendor.id!;
      if (!grouped[vendorId]) {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          grouped[vendorId] = { vendor, products: [] };
        }
      }
      if (grouped[vendorId]) {
        grouped[vendorId].products.push(product);
      }
    });

    return Object.values(grouped);
  })();

  return (
    <PageContainer backgroundVariant="families">
      {/* Header */}
      <Header
        title="TeleHiba"
        showMenu={showMenu}
        onMenuToggle={() => setShowMenu(!showMenu)}
        menuRef={menuRef}
        onLogout={() => setShowMenu(false)}
      />

      {/* Promotional Banner */}
      <section className="mx-4 mt-6 mb-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-app-purple via-app-sky to-app-pink rounded-3xl opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full animate-bounce [animation-duration:3s]"></div>
        <div className="relative p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            🎉 Bienvenue sur TeleHiba!
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Découvrez des produits de qualité chez nos vendeurs partenaires.
            Profitez de l'aide solidaire pour vos achats essentiels!
          </p>
        </div>
      </section>

      {/* Search Section */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        className="px-4 mb-6"
      />

      {/* City Selection */}
      {cities.length > 0 && (
        <div className="mx-4 mb-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-app-purple">📍</span>
              Choisir votre ville
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setCurrentLocation(city === currentLocation ? "" : city)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-app-purple/50 ${
                    currentLocation === city
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-pressed={currentLocation === city}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products by Vendor Section */}
      <section className="px-4 mb-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choisir ton vendeur, tes produits
          </h1>

          {error ? (
            <div className="text-center py-8 px-4">
              <div className="text-red-400 text-4xl mb-2" aria-hidden="true">⚠️</div>
              <p className="text-red-600 text-sm mb-1">Erreur de chargement</p>
              <p className="text-red-500 text-xs">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 px-4">
              <div className="text-gray-400 text-4xl mb-2" aria-hidden="true">⏳</div>
              <p className="text-gray-500 text-sm mb-1">Chargement des produits...</p>
              <div className="animate-spin w-6 h-6 border-2 border-app-purple border-t-transparent rounded-full mx-auto mt-4"></div>
            </div>
          ) : productsByVendor.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-gray-400 text-4xl mb-2" aria-hidden="true">📦</div>
              <p className="text-gray-500 text-sm mb-1">Aucun produit trouvé</p>
              <p className="text-gray-400 text-xs">
                {searchTerm || currentLocation
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucun produit disponible"}
              </p>
            </div>
          ) : (
            <div className="space-y-8" role="main" aria-label="Produits par vendeur">
              {productsByVendor.map(({ vendor, products }) => (
                <VendorProductSection
                  key={vendor.id}
                  vendor={vendor}
                  products={products}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  getItemQuantity={getItemQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </PageContainer>
  );
}
