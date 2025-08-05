import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Store, Gift, Users, ArrowRight, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { statisticsData } from "../data/mockData";
import PageContainer from "../components/common/PageContainer";
import { useAuth } from "../context/AuthContext";

interface UserType {
  type: "family" | "vendor" | "donator";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
  ctaText: string;
  route: string;
}

interface StatItem {
  number: string;
  label: string;
}

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  const getProfileLink = () => {
    if (!isAuthenticated || !user) return "/login";

    switch (user.role) {
      case "vendor":
        return "/vendor-dashboard";
      case "donator":
        return "/donator-dashboard";
      case "family":
      default:
        return "/profile";
    }
  };

  const userTypes: UserType[] = [
    {
      type: "family",
      title: "Je suis une Famille",
      subtitle: "J'ai besoin d'aide pour acheter des produits essentiels",
      icon: ShoppingCart,
      color: "from-green-400 to-blue-500",
      features: [
        "Accès à des produits de qualité",
        "Aide financière de donateurs généreux",
        "Commandes sécurisées et livrées rapidement",
        "Interface simple et intuitive"
      ],
      ctaText: "Commencer mes achats",
      route: "/signup"
    },
    {
      type: "vendor",
      title: "Je suis un Vendeur",
      subtitle: "Je veux vendre mes produits et aider la communauté",
      icon: Store,
      color: "from-orange-400 to-red-500",
      features: [
        "Gestion complète de vos produits",
        "Suivi des commandes en temps réel",
        "Scanner QR pour les retraits",
        "Participation à l'économie solidaire"
      ],
      ctaText: "Ouvrir ma boutique",
      route: "/signup"
    },
    {
      type: "donator",
      title: "Je suis un Donateur",
      subtitle: "Je veux aider les familles en payant leurs commandes",
      icon: Gift,
      color: "from-purple-400 to-pink-500",
      features: [
        "Aidez des familles dans le besoin",
        "Transparence totale sur vos donations",
        "Impact mesurable et suivi détaillé",
        "Communauté solidaire et bienveillante"
      ],
      ctaText: "Commencer à donner",
      route: "/signup"
    }
  ];

  const stats: StatItem[] = [
    { number: "500+", label: "Familles aidées" },
    { number: "50+", label: "Vendeurs partenaires" },
    { number: "1000+", label: "Donations effectuées" },
    { number: "€25k+", label: "Montant total donné" }
  ];

  const howItWorksSteps = [
    {
      number: "1",
      title: "Les familles passent commande",
      description: "Sélection de produits essentiels chez des vendeurs locaux",
      color: "from-green-400 to-blue-500"
    },
    {
      number: "2", 
      title: "Les donateurs paient",
      description: "Des personnes généreuses financent les commandes",
      color: "from-purple-400 to-pink-500"
    },
    {
      number: "3",
      title: "Les vendeurs préparent",
      description: "Préparation soignée des commandes par les vendeurs",
      color: "from-orange-400 to-red-500"
    },
    {
      number: "4",
      title: "Retrait sécurisé",
      description: "Code QR pour un retrait simple et sécurisé",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <PageContainer>
      {/* Header */}
      <header className="relative z-10 pt-12 pb-8">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-app-purple font-bold text-lg">T</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">TeleHiba</h1>
                <p className="text-xs text-white/80">Marketplace Solidaire</p>
              </div>
            </div>
            <Link
              to={getProfileLink()}
              className="bg-white/20 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              {isAuthenticated ? "Mon espace" : "Se connecter"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 mb-12">
        <div className="text-center text-white mb-8">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Une Marketplace<br />
            <span className="text-app-yellow">Solidaire</span> et <span className="text-app-yellow">Inclusive</span>
          </h2>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            TeleHiba connecte les familles dans le besoin avec des vendeurs locaux 
            et des donateurs généreux pour créer une communauté d'entraide.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8" aria-hidden="true">
            <Heart className="w-6 h-6 text-red-400" />
            <Users className="w-6 h-6 text-blue-400" />
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/30">
              <p className="text-2xl font-bold text-white">{stat.number}</p>
              <p className="text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 mb-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Comment ça marche ?
          </h2>
          
          <div className="space-y-4">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="relative z-10 px-6 pb-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Choisissez votre profil
        </h2>
        
        <div className="space-y-6">
          {userTypes.map((userType, index) => {
            const IconComponent = userType.icon;
            return (
              <article key={index} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{userType.title}</h3>
                    <p className="text-sm text-gray-600">{userType.subtitle}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={`${userType.route}?role=${userType.type}`}
                  className="block w-full"
                >
                  <Button className={`w-full bg-gradient-to-r ${userType.color} hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 transition-all duration-300 text-white font-semibold h-12`}>
                    {userType.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-8">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30">
          <p className="text-white/90 text-sm mb-4">
            Déjà membre de notre communauté ?
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-app-purple px-6 py-3 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </footer>
    </PageContainer>
  );
}
