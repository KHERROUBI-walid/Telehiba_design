import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  Package,
  Heart,
  MessageCircle,
  DollarSign,
  Gift,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Settings,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "order" | "donation" | "message" | "payment" | "system" | "promo";
  actionUrl?: string;
  avatar?: string;
  priority: "low" | "medium" | "high";
}

const notificationTypes = [
  { id: "all", name: "Toutes", icon: Bell, color: "text-gray-600" },
  { id: "order", name: "Commandes", icon: Package, color: "text-app-purple" },
  { id: "donation", name: "Donations", icon: Heart, color: "text-pink-500" },
  {
    id: "message",
    name: "Messages",
    icon: MessageCircle,
    color: "text-blue-500",
  },
  {
    id: "payment",
    name: "Paiements",
    icon: DollarSign,
    color: "text-green-500",
  },
  { id: "system", name: "Système", icon: Settings, color: "text-gray-500" },
];

export default function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Commande payée par un donateur",
      message:
        "Marie Dubois a payé votre commande #1. Vous pouvez maintenant la récupérer chez Dr. Sarah Johnson.",
      timestamp: "Il y a 2 minutes",
      isRead: false,
      type: "donation",
      actionUrl: "/orders",
      avatar: "❤️",
      priority: "high",
    },
    {
      id: 2,
      title: "Nouveau message",
      message: "Dr. Sarah Johnson: Votre commande est prête pour la livraison",
      timestamp: "Il y a 15 minutes",
      isRead: false,
      type: "message",
      actionUrl: "/chat",
      avatar: "👩‍⚕️",
      priority: "medium",
    },
    {
      id: 3,
      title: "Commande livrée",
      message:
        "Votre commande #4 a été livrée avec succès. N'oubliez pas de laisser un avis!",
      timestamp: "Il y a 1 heure",
      isRead: true,
      type: "order",
      actionUrl: "/orders",
      avatar: "📦",
      priority: "medium",
    },
    {
      id: 4,
      title: "Points de fidélité gagnés",
      message:
        "Félicitations! Vous avez gagné 50 points pour votre dernière commande.",
      timestamp: "Il y a 2 heures",
      isRead: false,
      type: "system",
      actionUrl: "/loyalty",
      avatar: "⭐",
      priority: "low",
    },
    {
      id: 5,
      title: "Paiement confirmé",
      message:
        "Votre don de 25€ pour la commande de Jean Martin a été confirmé.",
      timestamp: "Il y a 3 heures",
      isRead: true,
      type: "payment",
      actionUrl: "/donations",
      avatar: "💰",
      priority: "medium",
    },
    {
      id: 6,
      title: "Offre spéciale",
      message: "🎉 Livraison gratuite sur toutes les commandes cette semaine!",
      timestamp: "Hier",
      isRead: true,
      type: "promo",
      actionUrl: "/",
      avatar: "🎁",
      priority: "low",
    },
    {
      id: 7,
      title: "Commande en préparation",
      message:
        "Dr. Michael Chen prépare votre commande #2. Livraison estimée: 2h",
      timestamp: "Hier",
      isRead: true,
      type: "order",
      actionUrl: "/orders",
      avatar: "👨‍⚕️",
      priority: "medium",
    },
    {
      id: 8,
      title: "Nouveau donateur",
      message:
        "Votre commande #3 a attiré l'attention d'un donateur potentiel!",
      timestamp: "Il y a 2 jours",
      isRead: true,
      type: "donation",
      actionUrl: "/orders",
      avatar: "💝",
      priority: "medium",
    },
  ]);

  const getNotificationIcon = (
    type: Notification["type"],
    priority: Notification["priority"],
  ) => {
    const iconProps = "w-5 h-5";

    switch (type) {
      case "order":
        return <Package className={`${iconProps} text-app-purple`} />;
      case "donation":
        return <Heart className={`${iconProps} text-pink-500`} />;
      case "message":
        return <MessageCircle className={`${iconProps} text-blue-500`} />;
      case "payment":
        return <DollarSign className={`${iconProps} text-green-500`} />;
      case "system":
        return <Settings className={`${iconProps} text-gray-500`} />;
      case "promo":
        return <Gift className={`${iconProps} text-yellow-500`} />;
      default:
        return <Bell className={`${iconProps} text-gray-500`} />;
    }
  };

  const getPriorityIndicator = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case "medium":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case "low":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId),
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    const typeFilter =
      selectedFilter === "all" || notif.type === selectedFilter;
    const readFilter = !showUnreadOnly || !notif.isRead;
    return typeFilter && readFilter;
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Notifications</h1>
            <p className="text-sm text-white/80">
              {unreadCount > 0 ? `${unreadCount} non lues` : "Toutes lues"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Tout lire
            </button>
          )}
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto mb-3">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedFilter(type.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === type.id
                    ? "bg-app-purple text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {type.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showUnreadOnly
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Non lues seulement
          </button>

          <span className="text-sm text-gray-500">
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 px-4">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucune notification trouvée</p>
            {showUnreadOnly && (
              <p className="text-sm mt-2">
                Toutes vos notifications sont lues!
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 border-l-4 border-app-purple"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar/Icon */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-lg">
                      {notification.avatar || "🔔"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority,
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`font-semibold text-gray-800 ${!notification.isRead ? "text-app-purple" : ""}`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        {getPriorityIndicator(notification.priority)}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </span>

                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-app-purple hover:text-app-purple/80 font-medium"
                          >
                            Marquer comme lu
                          </button>
                        )}

                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs bg-app-purple text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-colors"
                          >
                            Voir
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions (if unread notifications exist) */}
      {unreadCount > 0 && (
        <div className="fixed bottom-20 right-4 bg-white rounded-full shadow-lg border border-gray-200 p-2">
          <button
            onClick={markAllAsRead}
            className="bg-app-purple text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
