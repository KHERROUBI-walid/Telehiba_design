import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Store, Gift, Users, ArrowRight, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const userTypes = [
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

  const stats = [
    { number: "500+", label: "Familles aidées" },
    { number: "50+", label: "Vendeurs partenaires" },
    { number: "1000+", label: "Donations effectuées" },
    { number: "€25k+", label: "Montant total donné" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-app-purple/10 to-app-pink/10 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
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
              to="/login"
              className="bg-white/20 backdrop-blur-xl border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 mb-12">
        <div className="text-center text-white mb-8">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Une Marketplace<br />
            <span className="text-app-yellow">Solidaire</span> et <span className="text-app-yellow">Inclusive</span>
          </h2>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            TeleHiba connecte les familles dans le besoin avec des vendeurs locaux 
            et des donateurs généreux pour créer une communauté d'entraide.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
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
      </div>

      {/* How it works */}
      <div className="relative z-10 px-6 mb-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Comment ça marche ?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Les familles passent commande</p>
                <p className="text-sm text-gray-600">Sélection de produits essentiels chez des vendeurs locaux</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Les donateurs paient</p>
                <p className="text-sm text-gray-600">Des personnes généreuses financent les commandes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Les vendeurs préparent</p>
                <p className="text-sm text-gray-600">Préparation soignée des commandes par les vendeurs</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Retrait sécurisé</p>
                <p className="text-sm text-gray-600">Code QR pour un retrait simple et sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Types */}
      <div className="relative z-10 px-6 pb-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Choisissez votre profil
        </h3>
        
        <div className="space-y-6">
          {userTypes.map((userType, index) => {
            const IconComponent = userType.icon;
            return (
              <div key={index} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{userType.title}</h4>
                    <p className="text-sm text-gray-600">{userType.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {userType.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <Link
                  to={`${userType.route}?role=${userType.type}`}
                  className={`block w-full`}
                >
                  <Button className={`w-full bg-gradient-to-r ${userType.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold h-12`}>
                    {userType.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 pb-8">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30">
          <p className="text-white/90 text-sm mb-4">
            Déjà membre de notre communauté ?
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-app-purple px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
