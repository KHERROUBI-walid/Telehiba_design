import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Package,
  Star,
  Calendar,
  DollarSign,
  Copy,
  Check,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useCart } from "../context/CartContext";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

interface Order {
  id: number;
  vendorName: string;
  vendorCity: string;
  vendorPhone: string;
  vendorAddress: string;
  items: OrderItem[];
  total: number;
  status:
    | "waiting"
    | "paid_by_donator"
    | "preparing"
    | "ready_for_pickup"
    | "delivered";
  orderDate: string;
  donatorName?: string;
  pickupCode: string;
  estimatedReadyTime?: string;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const { getTotalItems, openCart } = useCart();
  const [codeCopied, setCodeCopied] = useState(false);
  const [orderReceived, setOrderReceived] = useState(false);

  // Mock order data - in real app, fetch based on orderId
  const order: Order = {
    id: parseInt(orderId || "1"),
    vendorName: "Dr. Sarah Johnson",
    vendorCity: "New York, USA",
    vendorPhone: "+1 (555) 123-4567",
    vendorAddress: "123 Main Street, New York, NY 10001",
    items: [
      {
        id: 1,
        name: "Fresh Organic Tomatoes",
        price: 4.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=100&h=100&fit=crop&crop=center",
        unit: "Kg",
      },
      {
        id: 2,
        name: "Red Apples",
        price: 3.5,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop&crop=center",
        unit: "Kg",
      },
    ],
    total: 13.48,
    status: "ready_for_pickup",
    orderDate: "2024-01-15",
    donatorName: "Marie Dubois",
    pickupCode: "TH" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    estimatedReadyTime: "15:30",
  };

  const copyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const confirmReceived = () => {
    setOrderReceived(true);
    // In real app, update order status to "delivered"
  };

  const getStatusInfo = () => {
    switch (order.status) {
      case "waiting":
        return {
          title: "En attente de paiement",
          subtitle: "Votre commande attend un donateur",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          icon: Clock,
        };
      case "paid_by_donator":
        return {
          title: "Payé par un donateur",
          subtitle: "Le vendeur prépare votre commande",
          color: "text-pink-600",
          bgColor: "bg-pink-50",
          icon: Package,
        };
      case "preparing":
        return {
          title: "En préparation",
          subtitle: `Prêt vers ${order.estimatedReadyTime}`,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          icon: Package,
        };
      case "ready_for_pickup":
        return {
          title: "Prêt à récupérer",
          subtitle: "Votre commande vous attend !",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          icon: QrCode,
        };
      case "delivered":
        return {
          title: "Commandé récupérée",
          subtitle: "Merci pour votre confiance",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        };
      default:
        return {
          title: "État inconnu",
          subtitle: "",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          icon: AlertCircle,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-app-purple/10 to-app-sky/10 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -left-10 w-32 h-32 bg-gradient-to-br from-app-pink/10 to-app-purple/10 rounded-full animate-bounce"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-6 bg-gradient-to-r from-app-purple via-app-sky to-app-pink shadow-2xl">
        <div className="flex items-center gap-4">
          <Link
            to="/orders"
            className="text-white hover:scale-110 transition-transform duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Détails Commande
            </h1>
            <p className="text-sm text-white/90">#{order.id}</p>
          </div>
        </div>
      </header>

      <div className="relative p-6 pb-24">
        {/* Status Card */}
        <div
          className={`${statusInfo.bgColor} rounded-3xl p-6 mb-6 shadow-xl border-2 border-white`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 ${statusInfo.bgColor} rounded-2xl flex items-center justify-center border-2 border-white shadow-lg`}
            >
              <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                {statusInfo.title}
              </h2>
              <p className="text-gray-600 text-lg">{statusInfo.subtitle}</p>
            </div>
          </div>

          {order.donatorName && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-center text-pink-700 font-semibold">
                💝 Payé avec amour par{" "}
                <span className="font-bold">{order.donatorName}</span>
              </p>
            </div>
          )}
        </div>

        {/* Pickup Instructions - Only show if ready for pickup */}
        {order.status === "ready_for_pickup" && !orderReceived && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-6 mb-6 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center">
              🎯 Instructions de récupération
            </h3>

            {/* QR Code Section */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-4 border-gray-200">
                  <QrCode className="w-20 h-20 text-gray-400" />
                </div>
                <p className="text-gray-800 font-semibold mb-2">
                  Présentez ce QR code au vendeur
                </p>
                <p className="text-gray-600 text-sm">
                  Ou utilisez le code ci-dessous
                </p>
              </div>
            </div>

            {/* Pickup Code */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
              <p className="text-center text-white/80 mb-2">
                Code de récupération
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-mono font-bold text-white bg-black/20 px-4 py-2 rounded-xl">
                  {order.pickupCode}
                </span>
                <button
                  onClick={copyCode}
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {codeCopied ? (
                    <Check className="w-6 h-6 text-green-300" />
                  ) : (
                    <Copy className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-500 font-bold">
                  1
                </div>
                <p className="text-white font-medium">
                  Rendez-vous chez le vendeur
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-500 font-bold">
                  2
                </div>
                <p className="text-white font-medium">
                  Présentez le QR code ou le code {order.pickupCode}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-500 font-bold">
                  3
                </div>
                <p className="text-white font-medium">
                  Récupérez votre commande
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-500 font-bold">
                  4
                </div>
                <p className="text-white font-medium">
                  Confirmez la réception ci-dessous
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Information */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 mb-6 shadow-xl border border-white/50">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-app-purple" />
            Informations du vendeur
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-app-purple to-app-sky rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">
                  {order.vendorName}
                </h4>
                <p className="text-gray-600">{order.vendorCity}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">{order.vendorAddress}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">{order.vendorPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 mb-6 shadow-xl border border-white/50">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-app-purple" />
            Articles commandés
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-gray-600">
                    ${item.price} × {item.quantity} {item.unit}
                  </p>
                </div>
                <span className="font-bold text-app-purple text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-app-purple">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        {order.status === "ready_for_pickup" && !orderReceived && (
          <button
            onClick={confirmReceived}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            ✅ J'ai récupéré ma commande
          </button>
        )}

        {orderReceived && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Commande récupérée !
            </h3>
            <p className="text-green-600 mb-4">
              Merci d'avoir confirmé la réception de votre commande.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Star className="w-5 h-5 fill-current" />
              <span>N'hésitez pas à laisser un avis sur le vendeur</span>
            </div>
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
