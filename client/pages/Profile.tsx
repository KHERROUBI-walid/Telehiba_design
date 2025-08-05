import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Heart,
  Package,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  Camera,
  Shield,
  CreditCard,
  Gift,
  Star,
  ChevronRight,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  bio: string;
}

interface UserStats {
  totalOrders: number;
  ordersReceived: number;
  totalSaved: number;
  donationsReceived: number;
  rating: number;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const { getTotalItems, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès"
    });
    navigate("/", { replace: true });
  };

  const userProfile: UserProfile = {
    name: user?.name || "Utilisateur",
    email: user?.email || "email@example.com",
    phone: user?.phone || "+33 X XX XX XX XX",
    location: user?.city || "Ville non renseignée",
    joinDate: "2024-01-01",
    avatar: user?.avatar || "👤",
    bio: user?.role === 'family'
      ? "Membre de la communauté TeleHiba, j'aime pouvoir accéder à des produits de qualité grâce à la solidarité."
      : user?.role === 'vendor'
      ? "Vendeur partenaire de TeleHiba, je contribue à l'économie solidaire en proposant mes produits."
      : "Donateur TeleHiba, j'aide les familles dans le besoin en finançant leurs commandes.",
  };

  const userStats: UserStats = {
    totalOrders: 12,
    ordersReceived: 8,
    totalSaved: 156.75,
    donationsReceived: 5,
    rating: 4.8,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const menuItems = [
    {
      icon: Package,
      title: "Mes Commandes",
      subtitle: `${userStats.totalOrders} commandes passées`,
      link: "/orders",
      color: "text-app-purple",
    },
    {
      icon: Heart,
      title: "Mes Donations",
      subtitle: `${userStats.donationsReceived} donations reçues`,
      link: "/donations",
      color: "text-pink-500",
    },
    {
      icon: CreditCard,
      title: "Méthodes de Paiement",
      subtitle: "Gérer vos cartes",
      link: "/payment-methods",
      color: "text-blue-500",
    },
    {
      icon: Gift,
      title: "Programme de Fidélité",
      subtitle: "Vos points et récompenses",
      link: "/loyalty",
      color: "text-yellow-500",
    },
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Gérer vos préférences",
      action: () => setShowNotifications(!showNotifications),
      color: "text-orange-500",
    },
    {
      icon: Shield,
      title: "Sécurité",
      subtitle: "Mot de passe et sécurité",
      link: "/security",
      color: "text-red-500",
    },
    {
      icon: Settings,
      title: "Paramètres",
      subtitle: "Préférences de l'application",
      link: "/settings",
      color: "text-gray-500",
    },
    {
      icon: HelpCircle,
      title: "Aide & Support",
      subtitle: "FAQ et contact",
      link: "/help",
      color: "text-indigo-500",
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
            <h1 className="text-lg font-bold text-white">Mon Profil</h1>
            <p className="text-sm text-white/80">Gérer votre compte</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <Bell className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              {user?.avatar && user.avatar.startsWith('http') ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-3xl">
                  {userProfile.avatar}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {userProfile.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {userStats.rating}
                    </span>
                  </div>
                </div>
                <Link
                  to="/edit-profile"
                  className="bg-app-purple text-white p-2 rounded-full hover:bg-opacity-90 transition-colors inline-block"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-sm text-gray-600 mt-2 mb-3">
                {userProfile.bio}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {formatDate(userProfile.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-app-purple to-app-sky rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5" />
              <span className="text-sm opacity-90">Commandes</span>
            </div>
            <p className="text-2xl font-bold">{userStats.totalOrders}</p>
            <p className="text-xs opacity-80">
              {userStats.ordersReceived} reçues
            </p>
          </div>

          <div className="bg-gradient-to-br from-app-pink to-app-purple rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm opacity-90">Économisé</span>
            </div>
            <p className="text-2xl font-bold">${userStats.totalSaved}</p>
            <p className="text-xs opacity-80">
              {userStats.donationsReceived} donations
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Informations de Contact
        </h3>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Email</p>
              <p className="text-sm text-gray-600">{userProfile.email}</p>
            </div>
            <button className="text-app-purple hover:bg-app-purple/10 rounded-full p-1 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Téléphone</p>
              <p className="text-sm text-gray-600">{userProfile.phone}</p>
            </div>
            <button className="text-app-purple hover:bg-app-purple/10 rounded-full p-1 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-24">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Menu</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index}>
                {item.link ? (
                  <Link
                    to={item.link}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ${item.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ${item.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.title === "Notifications" && (
                        <div
                          className={`w-6 h-6 rounded-full border-2 transition-colors ${
                            showNotifications
                              ? "bg-app-purple border-app-purple"
                              : "border-gray-300"
                          }`}
                        >
                          {showNotifications && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                )}
              </div>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors mt-4"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-600">Se Déconnecter</p>
              <p className="text-sm text-red-500">
                Déconnectez-vous de votre compte
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
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
