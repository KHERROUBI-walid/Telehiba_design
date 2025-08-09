import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Eye,
  QrCode,
  Phone,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import BottomNavigation from "../components/BottomNavigation";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface VendorOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  donatorName: string;
  donatorAvatar: string;
  items: OrderItem[];
  total: number;
  status: "paid_by_donator" | "preparing" | "ready_for_pickup";
  orderDate: string;
  pickupCode: string;
  notes?: string;
}

export default function VendorOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [filter, setFilter] = useState<
    "all" | "paid_by_donator" | "preparing" | "ready_for_pickup"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const statusInfo = {
    paid_by_donator: {
      label: "Payée par donateur",
      icon: Clock,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    preparing: {
      label: "En préparation",
      icon: Package,
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    ready_for_pickup: {
      label: "Prête pour retrait",
      icon: CheckCircle,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  };

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVendorOrders();
        setOrders(response);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les commandes. Vérifiez que l'API est disponible."
        });
        // Keep orders empty if API fails
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [toast]);

  const filteredOrders = orders
    .filter((order) => filter === "all" || order.status === filter)
    .filter(
      (order) =>
        searchQuery === "" ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.donatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const updateOrderStatus = async (
    orderId: string,
    newStatus: VendorOrder["status"],
  ) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      const statusLabels = {
        preparing: "en préparation",
        ready_for_pickup: "prête pour retrait",
      };

      toast({
        title: "Statut mis à jour",
        description: `Commande ${orderId} marquée comme ${statusLabels[newStatus]}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("fr-FR") +
      " à " +
      date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-app-purple" />
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div
        className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce"
        style={{ animationDuration: "3s" }}
      ></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link
            to="/vendor-dashboard"
            className="text-white hover:scale-110 transition-transform duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Mes Commandes
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {filteredOrders.length} commande
              {filteredOrders.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setFilter("all")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === "all"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setFilter("paid_by_donator")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === "paid_by_donator"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Nouvelles (
              {orders.filter((o) => o.status === "paid_by_donator").length})
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFilter("preparing")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === "preparing"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              En cours ({orders.filter((o) => o.status === "preparing").length})
            </button>
            <button
              onClick={() => setFilter("ready_for_pickup")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === "ready_for_pickup"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Prêtes (
              {orders.filter((o) => o.status === "ready_for_pickup").length})
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <Input
            placeholder="Rechercher par client, donateur ou numéro de commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/50 border-white/30 text-gray-800 placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="relative z-10 px-6 pb-24">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune commande
            </h3>
            <p className="text-gray-500">
              Pas de commandes dans cette catégorie
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusInfo[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        Commande #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-app-purple/10 text-app-purple rounded-xl hover:bg-app-purple/20 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/vendor-scanner?orderId=${order.id}`}
                        className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                      >
                        <QrCode className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${status.bgColor} ${status.borderColor} border mb-4`}
                  >
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Customer & Donator Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Client</p>
                      <div className="flex items-center gap-2">
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {order.customerName}
                          </p>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-xs text-app-purple hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Payé par</p>
                      <div className="flex items-center gap-2">
                        <img
                          src={order.donatorAvatar}
                          alt={order.donatorName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {order.donatorName}
                          </p>
                          <p className="text-xs text-green-600">💝 Donateur</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-app-purple">
                        {order.total.toFixed(2)}€
                      </span>
                      {order.pickupCode && (
                        <p className="text-sm text-gray-500">
                          Code: {order.pickupCode}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {order.status === "paid_by_donator" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "preparing")
                          }
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Commencer
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "ready_for_pickup")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Terminer
                        </Button>
                      )}
                      {order.status === "ready_for_pickup" && (
                        <Button
                          onClick={() =>
                            navigate(
                              `/vendor-scanner?orderId=${order.id}&mode=verify`,
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1"
                        >
                          Vérifier le client
                        </Button>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Commande #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Customer Contact */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Contact client
              </h4>
              <div className="flex gap-3">
                <a
                  href={`tel:${selectedOrder.customerPhone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-xl hover:bg-green-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Appeler</span>
                </a>
                <a
                  href={`sms:${selectedOrder.customerPhone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">SMS</span>
                </a>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Articles commandés
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.price}€ × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-app-purple">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-app-purple">
                  {selectedOrder.total.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
