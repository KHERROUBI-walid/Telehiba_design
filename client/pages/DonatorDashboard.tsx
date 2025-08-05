import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, CreditCard, Users, TrendingUp, Gift, Eye, Calendar, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "../components/BottomNavigation";

interface DonationRecord {
  id: string;
  familyName: string;
  familyAvatar: string;
  vendorName: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  amount: number;
  date: string;
  status: "completed" | "delivered" | "pending";
  message?: string;
}

interface PendingPayment {
  id: string;
  familyName: string;
  familyAvatar: string;
  vendorName: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  amount: number;
  requestDate: string;
  urgency: "low" | "medium" | "high";
  familyStory?: string;
}

export default function DonatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pending" | "history" | "stats">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);

  // Mock donation history
  const [donationHistory] = useState<DonationRecord[]>([
    {
      id: "DON001",
      familyName: "Famille Martin",
      familyAvatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=100&h=100&fit=crop&crop=center",
      vendorName: "Épicerie du Soleil",
      items: [
        {
          id: 1,
          name: "Tomates Bio",
          price: 4.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 2,
          name: "Pain complet",
          price: 3.20,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center"
        }
      ],
      amount: 13.18,
      date: "2024-01-15T14:30:00Z",
      status: "delivered",
      message: "Merci infiniment pour votre générosité ! 🙏"
    },
    {
      id: "DON002",
      familyName: "Famille Dubois",
      familyAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
      vendorName: "Marché Bio Local",
      items: [
        {
          id: 3,
          name: "Pommes Golden",
          price: 3.50,
          quantity: 3,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop&crop=center"
        }
      ],
      amount: 10.50,
      date: "2024-01-12T09:45:00Z",
      status: "completed"
    },
    {
      id: "DON003",
      familyName: "Famille Laurent",
      familyAvatar: "https://images.unsplash.com/photo-1494790108755-2616b5b85644?w=100&h=100&fit=crop&crop=center",
      vendorName: "Boulangerie Artisanale",
      items: [
        {
          id: 4,
          name: "Pain de campagne",
          price: 2.80,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center"
        }
      ],
      amount: 5.60,
      date: "2024-01-10T16:20:00Z",
      status: "delivered"
    }
  ]);

  // Mock pending payments
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([
    {
      id: "PAY001",
      familyName: "Famille Petit",
      familyAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
      vendorName: "Épicerie Solidaire",
      items: [
        {
          id: 1,
          name: "Lait bio",
          price: 1.85,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 2,
          name: "Œufs fermiers",
          price: 4.20,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=100&h=100&fit=crop&crop=center"
        }
      ],
      amount: 7.90,
      requestDate: "2024-01-16T08:30:00Z",
      urgency: "high",
      familyStory: "Famille monoparentale avec 3 enfants en bas âge"
    },
    {
      id: "PAY002",
      familyName: "Famille Moreau",
      familyAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
      vendorName: "Fruits & Légumes",
      items: [
        {
          id: 3,
          name: "Bananes",
          price: 2.30,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 4,
          name: "Carottes bio",
          price: 3.10,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=100&h=100&fit=crop&crop=center"
        }
      ],
      amount: 7.70,
      requestDate: "2024-01-15T19:15:00Z",
      urgency: "medium"
    }
  ]);

  const urgencyInfo = {
    high: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Urgent" },
    medium: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", label: "Modéré" },
    low: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", label: "Normal" }
  };

  const statusInfo = {
    completed: { color: "text-blue-700", bg: "bg-blue-50", label: "Payé" },
    delivered: { color: "text-green-700", bg: "bg-green-50", label: "Livré" },
    pending: { color: "text-orange-700", bg: "bg-orange-50", label: "En attente" }
  };

  const totalDonated = donationHistory.reduce((sum, donation) => sum + donation.amount, 0);
  const familiesHelped = new Set(donationHistory.map(d => d.familyName)).size;
  const averageDonation = donationHistory.length > 0 ? totalDonated / donationHistory.length : 0;

  const payForOrder = (paymentId: string) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (payment) {
      // Remove from pending
      setPendingPayments(pendingPayments.filter(p => p.id !== paymentId));
      
      toast({
        title: "Paiement effectué",
        description: `Merci d'avoir aidé ${payment.familyName} ! 💝`
      });
      
      setSelectedPayment(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredHistory = donationHistory.filter(donation =>
    donation.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link to="/" className="text-white hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Mes Donations</h1>
            <p className="text-white/80 text-sm mt-1">Solidarité & Partage</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "pending"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              À payer ({pendingPayments.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Historique ({donationHistory.length})
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "stats"
                  ? "bg-white text-app-purple shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Statistiques
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingPayments.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune demande</h3>
                <p className="text-gray-500">Pas de demandes de paiement en attente</p>
              </div>
            ) : (
              pendingPayments.map((payment) => {
                const urgency = urgencyInfo[payment.urgency];
                return (
                  <div key={payment.id} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                    {/* Urgency Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${urgency.bg} ${urgency.border} border mb-4`}>
                      <div className={`w-2 h-2 rounded-full ${urgency.color.replace('text-', 'bg-')}`}></div>
                      <span className={`text-xs font-medium ${urgency.color}`}>{urgency.label}</span>
                    </div>

                    {/* Family Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <img src={payment.familyAvatar} alt={payment.familyName} className="w-16 h-16 rounded-full" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{payment.familyName}</h3>
                        <p className="text-sm text-gray-600">{payment.vendorName}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.requestDate)}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 bg-app-purple/10 text-app-purple rounded-xl hover:bg-app-purple/20 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Family Story */}
                    {payment.familyStory && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                        <p className="text-sm text-blue-800">{payment.familyStory}</p>
                      </div>
                    )}

                    {/* Items Preview */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-2">{payment.items.length} article{payment.items.length > 1 ? 's' : ''}</p>
                      <div className="flex gap-2 mb-2">
                        {payment.items.slice(0, 3).map((item) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ))}
                        {payment.items.length > 3 && (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{payment.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount and Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-app-purple">{payment.amount.toFixed(2)}€</span>
                      <Button
                        onClick={() => payForOrder(payment.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Payer
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une famille ou un vendeur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Donation History */}
            <div className="space-y-4">
              {filteredHistory.map((donation) => {
                const status = statusInfo[donation.status];
                return (
                  <div key={donation.id} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img src={donation.familyAvatar} alt={donation.familyName} className="w-12 h-12 rounded-full" />
                        <div>
                          <h3 className="font-bold text-gray-800">{donation.familyName}</h3>
                          <p className="text-sm text-gray-600">{donation.vendorName}</p>
                          <p className="text-xs text-gray-500">{formatDate(donation.date)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="p-2 bg-app-purple/10 text-app-purple rounded-xl hover:bg-app-purple/20 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-app-purple">{donation.amount.toFixed(2)}€</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {donation.message && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-800">{donation.message}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{totalDonated.toFixed(2)}€</p>
                <p className="text-sm text-gray-600">Total donné</p>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{familiesHelped}</p>
                <p className="text-sm text-gray-600">Familles aidées</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{donationHistory.length}</p>
                <p className="text-sm text-gray-600">Donations</p>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center">
                <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{averageDonation.toFixed(2)}€</p>
                <p className="text-sm text-gray-600">Moyenne</p>
              </div>
            </div>

            {/* Impact Message */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-6 text-white text-center">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Votre Impact</h3>
              <p className="text-white/90 mb-4">
                Grâce à votre générosité, vous avez aidé {familiesHelped} famille{familiesHelped > 1 ? 's' : ''} à accéder à des produits essentiels.
              </p>
              <p className="text-white/80 text-sm">
                Chaque don compte et fait la différence dans la vie des familles ! 💝
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Détails de la donation</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={selectedDonation.familyAvatar} alt={selectedDonation.familyName} className="w-16 h-16 rounded-full" />
                <div>
                  <h4 className="font-bold text-gray-800">{selectedDonation.familyName}</h4>
                  <p className="text-sm text-gray-600">{selectedDonation.vendorName}</p>
                  <p className="text-xs text-gray-500">{formatDate(selectedDonation.date)}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Articles achetés</h5>
                <div className="space-y-3">
                  {selectedDonation.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price}€ × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-app-purple">{(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total donné</span>
                  <span className="text-2xl font-bold text-app-purple">{selectedDonation.amount.toFixed(2)}€</span>
                </div>
              </div>

              {selectedDonation.message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-800">{selectedDonation.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Détails de la commande</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={selectedPayment.familyAvatar} alt={selectedPayment.familyName} className="w-16 h-16 rounded-full" />
                <div>
                  <h4 className="font-bold text-gray-800">{selectedPayment.familyName}</h4>
                  <p className="text-sm text-gray-600">{selectedPayment.vendorName}</p>
                  <p className="text-xs text-gray-500">{formatDate(selectedPayment.requestDate)}</p>
                </div>
              </div>

              {selectedPayment.familyStory && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <h5 className="font-semibold text-blue-800 mb-1">Histoire de la famille</h5>
                  <p className="text-sm text-blue-700">{selectedPayment.familyStory}</p>
                </div>
              )}

              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Articles demandés</h5>
                <div className="space-y-3">
                  {selectedPayment.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price}€ × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-app-purple">{(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800">Total à payer</span>
                  <span className="text-2xl font-bold text-app-purple">{selectedPayment.amount.toFixed(2)}€</span>
                </div>
                
                <Button
                  onClick={() => payForOrder(selectedPayment.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Payer cette commande
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
