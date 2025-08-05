import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Heart,
  Package,
  Truck,
  Bell,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import ShareOrderModal from "../components/common/ShareOrderModal";
import { useCart } from "../context/CartContext";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  vendorName: string;
  vendorCity: string;
  items: OrderItem[];
  total: number;
  status: "waiting" | "paid_by_donator" | "preparing" | "shipped" | "delivered";
  orderDate: string;
  donatorName?: string;
}

const statusConfig = {
  waiting: {
    label: "En attente",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    description: "En attente d'un donateur",
  },
  paid_by_donator: {
    label: "Payé par donateur",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    description: "Un donateur a payé votre commande",
  },
  preparing: {
    label: "En préparation",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    description: "Le vendeur prépare votre commande",
  },
  shipped: {
    label: "Expédié",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    description: "Votre commande est en route",
  },
  delivered: {
    label: "Livré",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100",
    description: "Commande livrée avec succès",
  },
};

export default function Orders() {
  const { getTotalItems, openCart } = useCart();
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; order: Order | null }>({
    isOpen: false,
    order: null
  });

  const handleShareOrder = (order: Order) => {
    setShareModal({ isOpen: true, order });
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, order: null });
  };

  // Mock orders data
  const orders: Order[] = [
    {
      id: 1,
      vendorName: "Dr. Sarah Johnson",
      vendorCity: "New York, USA",
      items: [
        {
          id: 1,
          name: "Fresh Organic Tomatoes",
          price: 4.99,
          quantity: 2,
          image: "🍅",
        },
        { id: 2, name: "Red Apples", price: 3.5, quantity: 1, image: "🍎" },
      ],
      total: 13.48,
      status: "paid_by_donator",
      orderDate: "2024-01-15",
      donatorName: "Marie Dubois",
    },
    {
      id: 2,
      vendorName: "Dr. Michael Chen",
      vendorCity: "Brooklyn, NY",
      items: [
        {
          id: 3,
          name: "Cotton T-Shirt",
          price: 19.99,
          quantity: 1,
          image: "👕",
        },
        { id: 4, name: "Fresh Carrots", price: 2.99, quantity: 3, image: "🥕" },
      ],
      total: 28.96,
      status: "waiting",
      orderDate: "2024-01-16",
    },
    {
      id: 3,
      vendorName: "Dr. Emma Wilson",
      vendorCity: "Manhattan, NY",
      items: [
        { id: 5, name: "Bananas", price: 2.49, quantity: 2, image: "🍌" },
        {
          id: 6,
          name: "Spinach Leaves",
          price: 3.99,
          quantity: 1,
          image: "🥬",
        },
      ],
      total: 8.97,
      status: "preparing",
      orderDate: "2024-01-14",
    },
    {
      id: 4,
      vendorName: "Dr. James Rodriguez",
      vendorCity: "Queens, NY",
      items: [{ id: 7, name: "Orange", price: 4.2, quantity: 1, image: "🍊" }],
      total: 4.2,
      status: "delivered",
      orderDate: "2024-01-12",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: Order["status"]) => {
    const StatusIcon = statusConfig[status].icon;
    return <StatusIcon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-app-purple/10 to-app-sky/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 -left-10 w-32 h-32 bg-gradient-to-br from-app-pink/10 to-app-purple/10 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-6 bg-gradient-to-r from-app-purple via-app-sky to-app-pink shadow-2xl">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-white hover:scale-110 transition-transform duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Mes Commandes
            </h1>
            <p className="text-sm text-white/90 flex items-center gap-2">
              📦 {orders.length} commande{orders.length > 1 ? "s" : ""} • 🎯
              Suivi en temps réel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative group">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Bell className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Orders List */}
      <div className="relative p-6 pb-24">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-500">
                Vous n'avez pas encore passé de commande
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-app-purple via-app-sky to-app-pink"></div>
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-gray-800">
                          Commande #{order.id}
                        </span>
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${statusInfo.color} ${statusInfo.bgColor} shadow-lg`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>
                      <p className="text-base text-gray-600 font-medium">
                        {statusInfo.description}
                      </p>
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-app-purple to-app-sky rounded-full"></div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">
                          {order.vendorName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {order.vendorCity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-app-purple to-app-sky rounded-lg flex items-center justify-center text-lg">
                          {item.image}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-app-purple">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-app-purple" />
                        <span className="font-bold text-app-purple">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Donator Info */}
                    {order.status === "paid_by_donator" &&
                      order.donatorName && (
                        <div className="bg-pink-50 rounded-lg p-2 mt-2">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span className="text-sm text-pink-700">
                              Payé par <strong>{order.donatorName}</strong>
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      {order.status === "waiting" && (
                        <button
                          onClick={() => handleShareOrder(order)}
                          className="flex-1 bg-app-purple text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                        >
                          Partager la commande
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
                          Suivre le colis
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
                          Confirmer réception
                        </button>
                      )}

                      <Link
                        to={`/order-details/${order.id}`}
                        className="px-6 py-3 border-2 border-app-purple text-app-purple rounded-2xl text-sm font-semibold hover:bg-app-purple hover:text-white transition-all duration-300 text-center"
                      >
                        🔍 Détails
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
    </div>
  );
}
