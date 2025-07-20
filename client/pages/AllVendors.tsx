import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Star,
  MapPin,
  Filter,
  Search,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart } from "../context/CartContext";

interface Vendor {
  id: number;
  name: string;
  avatar: string;
  city: string;
  specialty: string;
  rating: number;
  gradient: string;
  totalProducts: number;
  verified: boolean;
  joinDate: string;
}

export default function AllVendors() {
  const { getTotalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "products" | "name">(
    "rating",
  );
  const [filterVerified, setFilterVerified] = useState(false);

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar: "👩‍⚕️",
      city: "New York, USA",
      specialty: "Fruits & Légumes Bio",
      rating: 4.8,
      gradient: "from-app-purple to-app-sky",
      totalProducts: 35,
      verified: true,
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar: "👨‍⚕️",
      city: "Brooklyn, NY",
      specialty: "Médicaments & Santé",
      rating: 4.9,
      gradient: "from-app-pink to-app-purple",
      totalProducts: 42,
      verified: true,
      joinDate: "2022-11-20",
    },
    {
      id: 3,
      name: "Dr. Emma Wilson",
      avatar: "👩‍🍳",
      city: "Manhattan, NY",
      specialty: "Alimentation Bio",
      rating: 4.7,
      gradient: "from-app-sky to-app-pink",
      totalProducts: 28,
      verified: true,
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Dr. James Rodriguez",
      avatar: "👨‍💼",
      city: "Queens, NY",
      specialty: "Magasin Général",
      rating: 4.6,
      gradient: "from-app-purple to-app-sky",
      totalProducts: 56,
      verified: false,
      joinDate: "2023-05-22",
    },
    {
      id: 5,
      name: "Marie Dubois",
      avatar: "��‍🎨",
      city: "Paris, France",
      specialty: "Mode & Vêtements",
      rating: 4.8,
      gradient: "from-app-pink to-app-sky",
      totalProducts: 24,
      verified: true,
      joinDate: "2023-02-08",
    },
    {
      id: 6,
      name: "Hassan Al-Rashid",
      avatar: "👨‍🔬",
      city: "Dubai, UAE",
      specialty: "Électronique",
      rating: 4.5,
      gradient: "from-app-sky to-app-purple",
      totalProducts: 31,
      verified: true,
      joinDate: "2022-12-15",
    },
    {
      id: 7,
      name: "Lucia González",
      avatar: "👩‍💄",
      city: "Barcelona, Spain",
      specialty: "Cosmétiques",
      rating: 4.9,
      gradient: "from-app-purple to-app-pink",
      totalProducts: 19,
      verified: true,
      joinDate: "2023-04-03",
    },
    {
      id: 8,
      name: "Robert Smith",
      avatar: "👨‍🏫",
      city: "London, UK",
      specialty: "Livres & Éducation",
      rating: 4.4,
      gradient: "from-app-sky to-app-pink",
      totalProducts: 15,
      verified: false,
      joinDate: "2023-06-12",
    },
  ];

  const filteredVendors = vendors
    .filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((vendor) => !filterVerified || vendor.verified)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "products":
          return b.totalProducts - a.totalProducts;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
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
            <h1 className="text-lg font-bold text-white">Tous les Vendeurs</h1>
            <p className="text-sm text-white/80">
              {filteredVendors.length} vendeur
              {filteredVendors.length !== 1 ? "s" : ""} trouvé
              {filteredVendors.length !== 1 ? "s" : ""}
            </p>
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

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un vendeur, spécialité ou ville..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-app-purple"
          >
            <option value="rating">Mieux notés</option>
            <option value="products">Plus de produits</option>
            <option value="name">Nom A-Z</option>
          </select>

          <button
            onClick={() => setFilterVerified(!filterVerified)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterVerified
                ? "bg-app-purple text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Vérifiés seulement
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="p-4 pb-24">
        {filteredVendors.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucun vendeur trouvé</p>
            <p className="text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                to={`/vendor-products?vendor=${vendor.name}&city=${vendor.city}`}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                {/* Vendor Header */}
                <div className="relative mb-3">
                  <div
                    className={`w-full h-20 bg-gradient-to-br ${vendor.gradient} rounded-xl flex items-center justify-center text-2xl relative`}
                  >
                    {vendor.avatar}
                    {vendor.verified && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {vendor.name}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{vendor.city}</span>
                  </div>

                  <p className="text-xs text-app-purple font-medium">
                    {vendor.specialty}
                  </p>

                  {/* Rating and Products */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {vendor.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {vendor.totalProducts} produits
                    </span>
                  </div>

                  {/* Join Date */}
                  <p className="text-xs text-gray-400">
                    Membre depuis {formatDate(vendor.joinDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Statistics */}
        {filteredVendors.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Statistiques des Vendeurs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-app-purple">
                  {vendors.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-app-sky">
                  {vendors.filter((v) => v.verified).length}
                </div>
                <div className="text-sm text-gray-600">Vérifiés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-app-pink">
                  {(
                    vendors.reduce((sum, v) => sum + v.rating, 0) /
                    vendors.length
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-app-yellow">
                  {vendors.reduce((sum, v) => sum + v.totalProducts, 0)}
                </div>
                <div className="text-sm text-gray-600">Produits</div>
              </div>
            </div>
          </div>
        )}

        {/* Top Vendors */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Vendeurs les Mieux Notés
          </h3>
          <div className="space-y-3">
            {vendors
              .filter((v) => v.verified)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((vendor, index) => (
                <Link
                  key={vendor.id}
                  to={`/vendor-products?vendor=${vendor.name}&city=${vendor.city}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${vendor.gradient} rounded-full flex items-center justify-center text-lg relative`}
                  >
                    {vendor.avatar}
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {vendor.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{vendor.rating}</span>
                      <span>•</span>
                      <span>{vendor.totalProducts} produits</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
