import { Link } from "react-router-dom";
import { ArrowLeft, Bell, User } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart } from "../context/CartContext";

interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  productCount: number;
}

export default function AllCategories() {
  const { getTotalItems, openCart } = useCart();

  const categories: Category[] = [
    {
      id: "vegetables",
      name: "Légumes",
      icon: "🥬",
      gradient: "from-app-purple to-app-pink",
      description: "Légumes frais et bio de nos vendeurs locaux",
      productCount: 25,
    },
    {
      id: "fruits",
      name: "Fruits",
      icon: "🍎",
      gradient: "from-app-sky to-app-purple",
      description: "Fruits de saison, juteux et délicieux",
      productCount: 32,
    },
    {
      id: "clothes",
      name: "Vêtements",
      icon: "👕",
      gradient: "from-app-pink to-app-sky",
      description: "Mode et vêtements pour toute la famille",
      productCount: 18,
    },
    {
      id: "medicine",
      name: "Médicaments",
      icon: "💊",
      gradient: "from-app-purple to-app-sky",
      description: "Médicaments et produits de santé",
      productCount: 12,
    },
    {
      id: "electronics",
      name: "Électronique",
      icon: "📱",
      gradient: "from-app-sky to-app-pink",
      description: "Appareils électroniques et accessoires",
      productCount: 15,
    },
    {
      id: "books",
      name: "Livres",
      icon: "📚",
      gradient: "from-app-purple to-app-pink",
      description: "Livres, magazines et matériel éducatif",
      productCount: 8,
    },
    {
      id: "cosmetics",
      name: "Cosmétiques",
      icon: "💄",
      gradient: "from-app-pink to-app-purple",
      description: "Produits de beauté et soins personnels",
      productCount: 22,
    },
    {
      id: "sports",
      name: "Sport",
      icon: "⚽",
      gradient: "from-app-sky to-app-purple",
      description: "Équipements et vêtements de sport",
      productCount: 16,
    },
    {
      id: "home",
      name: "Maison",
      icon: "🏠",
      gradient: "from-app-purple to-app-sky",
      description: "Décoration et articles pour la maison",
      productCount: 20,
    },
    {
      id: "toys",
      name: "Jouets",
      icon: "🧸",
      gradient: "from-app-pink to-app-sky",
      description: "Jouets et jeux pour enfants",
      productCount: 14,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              Toutes les Catégories
            </h1>
            <p className="text-sm text-white/80">
              {categories.length} catégories disponibles
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

      {/* Categories Grid */}
      <div className="p-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category-products?category=${category.id}`}
              className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-6 text-white hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              {/* Category Icon */}
              <div className="text-4xl mb-4 text-center">{category.icon}</div>

              {/* Category Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90 mb-3 leading-relaxed">
                  {category.description}
                </p>

                {/* Product Count */}
                <div className="inline-flex items-center bg-white/20 rounded-full px-3 py-1">
                  <span className="text-sm font-medium">
                    {category.productCount} produits
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Statistiques des Catégories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-app-purple">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-app-sky">
                {categories.reduce((total, cat) => total + cat.productCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-app-pink">
                {Math.round(
                  categories.reduce(
                    (total, cat) => total + cat.productCount,
                    0,
                  ) / categories.length,
                )}
              </div>
              <div className="text-sm text-gray-600">Moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-app-yellow">
                {
                  categories.find(
                    (cat) =>
                      cat.productCount ===
                      Math.max(...categories.map((c) => c.productCount)),
                  )?.name
                }
              </div>
              <div className="text-sm text-gray-600">Populaire</div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Catégories Populaires
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categories
              .sort((a, b) => b.productCount - a.productCount)
              .slice(0, 4)
              .map((category) => (
                <Link
                  key={category.id}
                  to={`/category-products?category=${category.id}`}
                  className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center text-xl`}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {category.productCount} produits
                      </p>
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
