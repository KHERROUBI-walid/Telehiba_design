import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Heart, CreditCard, Users, TrendingUp, Gift, Eye, Calendar, Search, 
  MapPin, Star, Filter, UserHeart, Globe, Target, Award, DollarSign, 
  Clock, CheckCircle, AlertCircle, Zap, Crown, Shield
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "../components/BottomNavigation";
import StripePayment from "../components/common/StripePayment";

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
  deadlineDate?: string;
}

interface CityStats {
  city: string;
  familiesCount: number;
  totalNeeded: number;
  avgMonthlyNeed: number;
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
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);

  // Mock data for families
  const [families] = useState<Family[]>([
    {
      id: "FAM001",
      name: "Famille Martin",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b85644?w=100&h=100&fit=crop&crop=center",
      city: "Paris",
      memberCount: 4,
      monthlyNeed: 450,
      currentNeed: 120,
      story: "Famille de 4 personnes, parents au chômage suite à la pandémie. Recherche aide pour alimentation et frais scolaires.",
      isSponsored: false,
      urgencyLevel: "high",
      totalReceived: 340,
      children: 2,
      verified: true
    },
    {
      id: "FAM002", 
      name: "Famille Dubois",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center",
      city: "Lyon",
      memberCount: 3,
      monthlyNeed: 350,
      currentNeed: 89,
      story: "Mère célibataire avec 2 enfants, travaille à temps partiel. Besoin d'aide pour les courses alimentaires.",
      isSponsored: true,
      sponsorId: "DON123",
      urgencyLevel: "medium",
      lastDonation: "2024-01-10",
      totalReceived: 890,
      children: 2,
      verified: true
    },
    {
      id: "FAM003",
      name: "Famille Ahmed",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
      city: "Marseille",
      memberCount: 5,
      monthlyNeed: 600,
      currentNeed: 245,
      story: "Grande famille, père malade, besoin urgent d'aide pour médicaments et alimentation.",
      isSponsored: false,
      urgencyLevel: "high",
      totalReceived: 156,
      children: 3,
      verified: true
    }
  ]);

  // Mock data for pending payments
  const [pendingPayments] = useState<PendingPayment[]>([
    {
      id: "PAY001",
      familyId: "FAM001",
      familyName: "Famille Martin",
      familyAvatar: "https://images.unsplash.com/photo-1494790108755-2616b85644?w=100&h=100&fit=crop&crop=center",
      familyCity: "Paris",
      vendorName: "Épicerie Bio Paris",
      items: [
        { id: 1, name: "Légumes bio", price: 25.50, quantity: 2, image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=100&h=100&fit=crop" },
        { id: 2, name: "Fruits de saison", price: 18.30, quantity: 1, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&h=100&fit=crop" }
      ],
      amount: 69.30,
      requestDate: "2024-01-15",
      urgency: "high",
      familyStory: "Famille en difficulté depuis la perte d'emploi du père. 2 enfants en bas âge.",
      deadlineDate: "2024-01-18"
    },
    {
      id: "PAY002", 
      familyId: "FAM003",
      familyName: "Famille Ahmed",
      familyAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center",
      familyCity: "Marseille",
      vendorName: "Pharmacie Centrale",
      items: [
        { id: 3, name: "Médicaments", price: 45.80, quantity: 1, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop" }
      ],
      amount: 45.80,
      requestDate: "2024-01-14",
      urgency: "high",
      familyStory: "Père malade, besoin urgent de médicaments non remboursés.",
      deadlineDate: "2024-01-16"
    }
  ]);

  // Mock data for cities
  const [cityStats] = useState<CityStats[]>([
    { city: "Paris", familiesCount: 45, totalNeeded: 12500, avgMonthlyNeed: 278 },
    { city: "Lyon", familiesCount: 32, totalNeeded: 8900, avgMonthlyNeed: 278 },
    { city: "Marseille", familiesCount: 28, totalNeeded: 7800, avgMonthlyNeed: 279 },
    { city: "Toulouse", familiesCount: 23, totalNeeded: 6200, avgMonthlyNeed: 270 },
    { city: "Nice", familiesCount: 18, totalNeeded: 4900, avgMonthlyNeed: 272 }
  ]);

  // Mock data for donation history
  const [donationHistory] = useState<DonationRecord[]>([
    {
      id: "DON001",
      familyName: "Famille Martin",
      familyAvatar: "https://images.unsplash.com/photo-1494790108755-2616b85644?w=100&h=100&fit=crop&crop=center",
      vendorName: "Épicerie Bio",
      items: [
        { id: 1, name: "Légumes bio", price: 25.50, quantity: 2, image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=100&h=100&fit=crop" }
      ],
      amount: 51.00,
      date: "2024-01-10",
      status: "delivered",
      message: "Merci beaucoup pour votre générosité !",
      impact: "Cette donation a permis de nourrir la famille pendant 3 jours"
    }
  ]);

  // Filter functions
  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || family.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const filteredPendingPayments = pendingPayments.filter(payment => {
    const matchesSearch = payment.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.familyCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || payment.familyCity === selectedCity;
    const matchesUrgency = urgencyFilter === "all" || payment.urgency === urgencyFilter;
    return matchesSearch && matchesCity && matchesUrgency;
  });

  const uniqueCities = ["all", ...Array.from(new Set(families.map(f => f.city)))];

  const handleSponsorFamily = (family: Family) => {
    setSelectedFamily(family);
    setShowSponsorModal(true);
  };

  const confirmSponsorship = () => {
    if (selectedFamily) {
      toast({
        title: "Parrainage confirmé!",
        description: `Vous parrainez maintenant ${selectedFamily.name}`,
      });
      setShowSponsorModal(false);
      setSelectedFamily(null);
    }
  };

  const handlePayOrder = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPayment) return;

    // Simulate Stripe payment process
    try {
      // In real implementation, this would integrate with Stripe API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Paiement réussi!",
        description: `Vous avez payé €${selectedPayment.amount} pour ${selectedPayment.familyName}`,
      });
      
      setShowPaymentModal(false);
      setSelectedPayment(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: "Le paiement n'a pas pu être traité",
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
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Espace Donateur</h1>
            <p className="text-white/80 text-sm mt-1">Votre impact solidaire</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 px-6 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total donné</p>
                <p className="text-white text-lg font-bold">€2,450</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Familles aidées</p>
                <p className="text-white text-lg font-bold">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Parrainages</p>
                <p className="text-white text-lg font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Impact score</p>
                <p className="text-white text-lg font-bold">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30">
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: "pending", label: "À payer", icon: AlertCircle },
              { key: "families", label: "Familles", icon: Users },
              { key: "cities", label: "Villes", icon: MapPin },
              { key: "history", label: "Historique", icon: Calendar },
              { key: "stats", label: "Impact", icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-300 ${
                  activeTab === key
                    ? "bg-white text-app-purple shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      {(activeTab === "pending" || activeTab === "families" || activeTab === "cities") && (
        <div className="relative z-10 px-6 mb-6">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher familles, villes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/50 border-white/30 text-gray-800 placeholder:text-gray-600"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-white/30 rounded-lg text-gray-800"
              >
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city === "all" ? "Toutes les villes" : city}
                  </option>
                ))}
              </select>
            </div>
            
            {activeTab === "pending" && (
              <div className="flex gap-2">
                {["all", "high", "medium", "low"].map(urgency => (
                  <button
                    key={urgency}
                    onClick={() => setUrgencyFilter(urgency as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      urgencyFilter === urgency
                        ? "bg-white text-app-purple"
                        : "bg-white/30 text-white hover:bg-white/40"
                    }`}
                  >
                    {urgency === "all" ? "Toutes" : 
                     urgency === "high" ? "Urgent" :
                     urgency === "medium" ? "Moyen" : "Bas"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        {/* Pending Payments Tab */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {filteredPendingPayments.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune commande en attente</h3>
                <p className="text-gray-600">Modifiez vos filtres pour voir plus de commandes</p>
              </div>
            ) : (
              filteredPendingPayments.map(payment => (
                <div key={payment.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={payment.familyAvatar}
                        alt={payment.familyName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{payment.familyName}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {payment.familyCity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getUrgencyColor(payment.urgency)}`}>
                        {payment.urgency === "high" ? "Urgent" :
                         payment.urgency === "medium" ? "Moyen" : "Bas"}
                      </div>
                      {payment.deadlineDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Échéance: {new Date(payment.deadlineDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-700 font-medium mb-2">Commande chez {payment.vendorName}</p>
                    <div className="space-y-1">
                      {payment.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {payment.familyStory && (
                    <div className="bg-blue-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-blue-800">{payment.familyStory}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-app-purple">€{payment.amount.toFixed(2)}</span>
                      <p className="text-xs text-gray-500">Demandé le {new Date(payment.requestDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePayOrder(payment)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const family = families.find(f => f.id === payment.familyId);
                          if (family) handleSponsorFamily(family);
                        }}
                        className="border-app-purple text-app-purple hover:bg-app-purple hover:text-white"
                      >
                        <UserHeart className="w-4 h-4 mr-2" />
                        Parrainer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Families Tab */}
        {activeTab === "families" && (
          <div className="space-y-4">
            {filteredFamilies.map(family => (
              <div key={family.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={family.avatar}
                        alt={family.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {family.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {family.isSponsored && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{family.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {family.city} • {family.memberCount} membres • {family.children} enfants
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {family.isSponsored ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg font-medium">
                            Parrainée
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg font-medium">
                            Disponible
                          </span>
                        )}
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getUrgencyColor(family.urgencyLevel)}`}>
                          {family.urgencyLevel === "high" ? "Urgent" :
                           family.urgencyLevel === "medium" ? "Moyen" : "Bas"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-3">{family.story}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Besoin mensuel</p>
                      <p className="font-semibold text-gray-800">€{family.monthlyNeed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Besoin actuel</p>
                      <p className="font-semibold text-app-purple">€{family.currentNeed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total reçu</p>
                      <p className="font-semibold text-green-600">€{family.totalReceived}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dernière donation</p>
                      <p className="font-semibold text-gray-600">
                        {family.lastDonation ? new Date(family.lastDonation).toLocaleDateString('fr-FR') : 'Jamais'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!family.isSponsored && (
                    <Button
                      onClick={() => handleSponsorFamily(family)}
                      className="flex-1 bg-app-purple text-white hover:bg-app-purple/90"
                    >
                      <UserHeart className="w-4 h-4 mr-2" />
                      Parrainer cette famille
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-app-purple text-app-purple hover:bg-app-purple hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === "cities" && (
          <div className="space-y-4">
            {cityStats.map(city => (
              <div key={city.city} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-app-purple to-app-sky rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{city.city}</h3>
                      <p className="text-sm text-gray-600">{city.familiesCount} familles en attente d'aide</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-app-purple">€{city.totalNeeded.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Besoin total</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">{city.familiesCount}</p>
                    <p className="text-xs text-gray-500">Familles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">€{city.avgMonthlyNeed}</p>
                    <p className="text-xs text-gray-500">Besoin moyen</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">{Math.round(city.totalNeeded / city.familiesCount)}</p>
                    <p className="text-xs text-gray-500">€ par famille</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedCity(city.city)}
                    className="flex-1 bg-app-purple text-white hover:bg-app-purple/90"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Aider cette ville
                  </Button>
                  <Button
                    variant="outline"
                    className="border-app-purple text-app-purple hover:bg-app-purple hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir familles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {donationHistory.map(donation => (
              <div key={donation.id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={donation.familyAvatar}
                      alt={donation.familyName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{donation.familyName}</h3>
                      <p className="text-sm text-gray-600">{donation.vendorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">€{donation.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {donation.impact && (
                  <div className="bg-green-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-green-800 font-medium">Impact:</p>
                    <p className="text-sm text-green-700">{donation.impact}</p>
                  </div>
                )}

                {donation.message && (
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-sm text-blue-800 font-medium">Message de la famille:</p>
                    <p className="text-sm text-blue-700">"{donation.message}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Votre Impact Social
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-1">23</div>
                  <div className="text-sm text-gray-600">Familles aidées</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">€2,450</div>
                  <div className="text-sm text-gray-600">Total donné</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">Parrainages actifs</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">85%</div>
                  <div className="text-sm text-gray-600">Score d'impact</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Objectif mensuel</span>
                    <span className="font-medium">€500 / €500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Engagement communautaire</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition par ville</h3>
              <div className="space-y-3">
                {cityStats.slice(0, 3).map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="font-medium">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">€{(city.totalNeeded * 0.3).toFixed(0)}</div>
                      <div className="text-xs text-gray-500">donné</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sponsorship Modal */}
      {showSponsorModal && selectedFamily && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Parrainer une famille</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedFamily.avatar}
                alt={selectedFamily.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-800">{selectedFamily.name}</h4>
                <p className="text-sm text-gray-600">{selectedFamily.city} • {selectedFamily.memberCount} membres</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Engagement de parrainage</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Donation mensuelle recommandée: €{selectedFamily.monthlyNeed}</li>
                <li>• Suivi privilégié de la famille</li>
                <li>• Messages de remerciement directs</li>
                <li>• Rapport d'impact personnalisé</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmSponsorship}
                className="flex-1 bg-app-purple text-white hover:bg-app-purple/90"
              >
                <UserHeart className="w-4 h-4 mr-2" />
                Confirmer le parrainage
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSponsorModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal with Stripe Integration */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Paiement sécurisé</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Commande pour {selectedPayment.familyName}</span>
                <span className="font-bold text-app-purple">€{selectedPayment.amount.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600">Chez {selectedPayment.vendorName}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte
                </label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration
                  </label>
                  <Input placeholder="MM/AA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <Input placeholder="123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom sur la carte
                </label>
                <Input placeholder="Nom complet" />
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Paiement sécurisé par Stripe</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={processPayment}
                className="flex-1 bg-green-500 text-white hover:bg-green-600"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payer €{selectedPayment.amount.toFixed(2)}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
