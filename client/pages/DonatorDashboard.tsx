import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Heart, CreditCard, Users, TrendingUp, Gift, Eye, Calendar, Search,
  MapPin, Star, Filter, Globe, Target, Award, DollarSign,
  Clock, CheckCircle, AlertCircle, Zap, Crown, Shield, Bell, Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "../services/api";
import BottomNavigation from "../components/BottomNavigation";
import StripePayment from "../components/common/StripePayment";
import DonatorNotifications from "../components/common/DonatorNotifications";
import useNotifications from "../hooks/useNotifications";

interface Family {
  id: string;
  name: string;
  avatar: string;
  city: string;
  memberCount: number;
  monthlyNeed: number;
  currentNeed: number;
  story: string;
  isSponsored: boolean;
  sponsorId?: string;
  urgencyLevel: "low" | "medium" | "high";
  lastDonation?: string;
  totalReceived: number;
  children: number;
  verified: boolean;
}

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
  impact?: string;
}

interface PendingPayment {
  id: string;
  familyId: string;
  familyName: string;
  familyAvatar: string;
  familyCity: string;
  vendorName: string;
  items?: Array<{
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
  deadlineDate?: string;
}

interface CityStats {
  city: string;
  familiesCount: number;
  totalNeeded: number;
  avgMonthlyNeed: number;
}

interface DonatorStats {
  totalDonated: number;
  familiesHelped: number;
  activeSponsorships: number;
  impactScore: number;
}

export default function DonatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pending" | "families" | "cities" | "history" | "stats">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data states
  const [families, setFamilies] = useState<Family[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [cityStats, setCityStats] = useState<CityStats[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>([]);
  const [donatorStats, setDonatorStats] = useState<DonatorStats>({
    totalDonated: 0,
    familiesHelped: 0,
    activeSponsorships: 0,
    impactScore: 0
  });
  const [loading, setLoading] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  } = useNotifications();

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case "pending":
            const payments = await apiService.getPendingPayments({
              city: selectedCity !== "all" ? selectedCity : undefined,
              urgency: urgencyFilter !== "all" ? urgencyFilter : undefined,
              search: searchTerm || undefined
            });
            setPendingPayments(payments);
            break;

          case "families":
            const familiesData = await apiService.searchFamilies(searchTerm, selectedCity);
            setFamilies(familiesData);
            break;

          case "cities":
            const cities = await apiService.getCityStats();
            setCityStats(cities);
            break;

          case "history":
            // Load donation history - this would need an API endpoint
            setDonationHistory([]);
            break;

          case "stats":
            const stats = await apiService.getDonatorStats();
            setDonatorStats(stats);
            break;
        }
      } catch (error) {
        console.warn(`Data not available for ${activeTab}:`, error.message);

        // Don't show error toast in demo mode, just log it
        if (!error.message.includes('API non configurée') && !error.message.includes('contacter le serveur')) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: `Impossible de charger les données de ${activeTab}`
          });
        }

        // Use demo data when API fails for better user experience
        switch (activeTab) {
          case "pending":
            setPendingPayments([
              {
                id: "DEMO001",
                familyId: "FAM001",
                familyName: "Famille Martin",
                familyAvatar: "/placeholder-family.jpg",
                familyCity: "Paris",
                vendorName: "Épicerie Bio Paris",
                amount: 69.30,
                urgency: "high",
                requestDate: "2024-01-15",
                familyStory: "Famille de 4 personnes en difficulté financière temporaire."
              }
            ]);
            break;
          case "families":
            setFamilies([
              {
                id: "FAM001",
                name: "Famille Martin",
                avatar: "/placeholder-family.jpg",
                city: "Paris",
                memberCount: 4,
                monthlyNeed: 450,
                currentNeed: 120,
                story: "Famille de 4 personnes, parents au chômage suite à la pandémie.",
                isSponsored: false,
                urgencyLevel: "high",
                totalReceived: 340,
                children: 2,
                verified: true
              }
            ]);
            break;
          case "cities":
            setCityStats([
              { city: "Paris", familiesCount: 45, totalNeeded: 12500, avgMonthlyNeed: 278 },
              { city: "Lyon", familiesCount: 32, totalNeeded: 8900, avgMonthlyNeed: 278 },
              { city: "Marseille", familiesCount: 28, totalNeeded: 7800, avgMonthlyNeed: 279 }
            ]);
            break;
          case "history":
            setDonationHistory([]);
            break;
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, selectedCity, urgencyFilter, searchTerm, toast]);

  const handlePayment = async (payment: PendingPayment, paymentMethodId: string) => {
    try {
      const result = await apiService.processPayment({
        paymentId: payment.id,
        amount: payment.amount,
        paymentMethodId,
        familyId: payment.familyId
      });

      toast({
        title: "Paiement réussi",
        description: `Paiement de ${payment.amount}€ effectué pour ${payment.familyName}`
      });

      // Remove from pending payments
      setPendingPayments(prev => prev.filter(p => p.id !== payment.id));
      
      // Add notification
      addNotification({
        id: `payment_${Date.now()}`,
        type: "success",
        title: "Paiement confirmé",
        message: `Votre don de ${payment.amount}€ pour ${payment.familyName} a été traité avec succès.`,
        timestamp: new Date(),
        priority: "high"
      });

      setShowStripePayment(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: "Le paiement n'a pas pu être traité"
      });
    }
  };

  const handleSponsorFamily = async (family: Family) => {
    try {
      await apiService.sponsorFamily(family.id, {
        sponsorType: "monthly",
        amount: family.monthlyNeed
      });

      toast({
        title: "Parrainage confirmé",
        description: `Vous parrainez maintenant ${family.name}`
      });

      // Update family status
      setFamilies(prev => prev.map(f => 
        f.id === family.id 
          ? { ...f, isSponsored: true, sponsorId: user?.id?.toString() }
          : f
      ));

      addNotification({
        id: `sponsor_${Date.now()}`,
        type: "success",
        title: "Nouveau parrainage",
        message: `Vous parrainez maintenant ${family.name}. Votre première contribution sera prélevée le mois prochain.`,
        timestamp: new Date(),
        priority: "medium"
      });

      setShowSponsorModal(false);
      setSelectedFamily(null);
    } catch (error) {
      console.error('Sponsorship error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de confirmer le parrainage"
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return AlertCircle;
      case "medium": return Clock;
      case "low": return CheckCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-app-purple" />
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-blue-200/30 rounded-full animate-bounce [animation-duration:3s]"></div>

      {/* Header with notification bell */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link to="/" className="text-gray-700 hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow-lg">
              Espace Donateur
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Bienvenue, {user?.name}
            </p>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-700 hover:bg-white/50 rounded-xl transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/30">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: "pending", label: "En Attente", icon: Clock },
              { id: "families", label: "Familles", icon: Users },
              { id: "cities", label: "Villes", icon: MapPin },
              { id: "history", label: "Historique", icon: Calendar },
              { id: "stats", label: "Impact", icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-medium transition-all duration-300 flex flex-col items-center gap-1 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      {(activeTab === "pending" || activeTab === "families") && (
        <div className="relative z-10 px-6 mb-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/70 border-white/50"
              />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-gray-700"
              >
                <option value="all">Toutes les villes</option>
                <option value="Paris">Paris</option>
                <option value="Lyon">Lyon</option>
                <option value="Marseille">Marseille</option>
              </select>
              {activeTab === "pending" && (
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value as any)}
                  className="bg-white/70 border border-white/50 rounded-lg px-3 py-2 text-gray-700"
                >
                  <option value="all">Toutes urgences</option>
                  <option value="high">Urgence élevée</option>
                  <option value="medium">Urgence moyenne</option>
                  <option value="low">Urgence faible</option>
                </select>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        {/* Pending Payments Tab */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingPayments.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun paiement en attente</h3>
                <p className="text-gray-500">Toutes les demandes de paiement ont été traitées</p>
              </div>
            ) : (
              pendingPayments.map((payment) => {
                const UrgencyIcon = getUrgencyIcon(payment.urgency);
                return (
                  <div key={payment.id} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={payment.familyAvatar} 
                          alt={payment.familyName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{payment.familyName}</h3>
                          <p className="text-sm text-gray-600">{payment.familyCity}</p>
                          <p className="text-xs text-gray-500">{payment.vendorName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${getUrgencyColor(payment.urgency)}`}>
                          <UrgencyIcon className="w-3 h-3" />
                          {payment.urgency === "high" ? "Urgent" : payment.urgency === "medium" ? "Modéré" : "Normal"}
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mt-1">{payment.amount.toFixed(2)}€</p>
                      </div>
                    </div>

                    {payment.familyStory && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{payment.familyStory}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowStripePayment(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payer maintenant
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        className="bg-white/70"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Families Tab */}
        {activeTab === "families" && (
          <div className="space-y-4">
            {families.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune famille trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              families.map((family) => (
                <div key={family.id} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={family.avatar} 
                        alt={family.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{family.name}</h3>
                        <p className="text-sm text-gray-600">{family.city}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {family.memberCount} membres
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {family.children} enfants
                          </span>
                          {family.verified && (
                            <Shield className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Besoin mensuel</p>
                      <p className="text-xl font-bold text-purple-600">{family.monthlyNeed}€</p>
                      <p className="text-xs text-gray-500">Reçu: {family.totalReceived}€</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{family.story}</p>
                  </div>

                  <div className="flex gap-3">
                    {family.isSponsored ? (
                      <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center font-medium">
                        <Crown className="w-4 h-4 inline mr-2" />
                        Déjà parrainée
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedFamily(family);
                          setShowSponsorModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Parrainer cette famille
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === "cities" && (
          <div className="space-y-4">
            {cityStats.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune statistique disponible</h3>
                <p className="text-gray-500">Les données des villes seront bientôt disponibles</p>
              </div>
            ) : (
              cityStats.map((city) => (
                <div key={city.city} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-purple-600" />
                      <div>
                        <h3 className="font-bold text-gray-800">{city.city}</h3>
                        <p className="text-sm text-gray-600">{city.familiesCount} familles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Besoin total</p>
                      <p className="text-xl font-bold text-purple-600">{city.totalNeeded}€</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Moyenne mensuelle</p>
                      <p className="font-semibold text-gray-800">{city.avgMonthlyNeed}€</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Par famille</p>
                      <p className="font-semibold text-gray-800">{Math.round(city.totalNeeded / city.familiesCount)}€</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{donatorStats.totalDonated}€</p>
                <p className="text-sm text-gray-600">Total donné</p>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{donatorStats.familiesHelped}</p>
                <p className="text-sm text-gray-600">Familles aidées</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{donatorStats.activeSponsorships}</p>
                <p className="text-sm text-gray-600">Parrainages actifs</p>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{donatorStats.impactScore}%</p>
                <p className="text-sm text-gray-600">Score d'impact</p>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl border border-white/20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Historique des dons</h3>
            <p className="text-gray-500">L'historique détaillé sera bientôt disponible</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showStripePayment && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Paiement sécurisé</h3>
              <button
                onClick={() => {
                  setShowStripePayment(false);
                  setSelectedPayment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={selectedPayment.familyAvatar} 
                  alt={selectedPayment.familyName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">{selectedPayment.familyName}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.familyCity}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">{selectedPayment.amount.toFixed(2)}€</p>
            </div>

            <StripePayment
              amount={selectedPayment.amount}
              description={`Don pour ${selectedPayment.familyName}`}
              onSuccess={(result) => handlePayment(selectedPayment, result.id)}
              onError={(error) => {
                console.error('Payment error:', error);
                toast({
                  variant: "destructive",
                  title: "Erreur de paiement",
                  description: "Le paiement a échoué"
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifications && (
        <DonatorNotifications
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}

      <BottomNavigation />
    </div>
  );
}
