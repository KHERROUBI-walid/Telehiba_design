import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Heart,
  ShoppingCart,
  Store,
  Gift,
} from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserTypeOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    ville: "",
  });
  const [selectedRole, setSelectedRole] = useState<
    "famille" | "vendeur" | "donateur" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pre-select role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get("role") as UserRole;
    if (roleParam && ["family", "vendor", "donator"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const userTypes: UserTypeOption[] = [
    {
      value: "family",
      label: "Famille",
      description: "J'achète des produits pour ma famille",
      icon: <ShoppingCart className="w-6 h-6" />,
      gradient: "from-green-400 to-blue-500",
    },
    {
      value: "vendor",
      label: "Vendeur",
      description: "Je vends des produits alimentaires",
      icon: <Store className="w-6 h-6" />,
      gradient: "from-orange-400 to-red-500",
    },
    {
      value: "donator",
      label: "Donateur",
      description: "J'aide les familles en payant leurs commandes",
      icon: <Gift className="w-6 h-6" />,
      gradient: "from-purple-400 to-pink-500",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner votre type de compte",
      });
      return;
    }

    if (
      !formData.prenom ||
      !formData.nom ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    const success = await signup(
      formData.email,
      formData.password,
      formData.nom,
      formData.prenom,
      selectedRole,
    );

    if (success) {
      toast({
        title: "Compte cr��é avec succès",
        description: "Bienvenue ! Votre compte a été créé.",
      });
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un compte avec cet email existe déjà",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div
        className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-app-purple/10 to-app-pink/10 rounded-full animate-spin"
        style={{ animationDuration: "8s" }}
      ></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link
            to="/login"
            className="text-white hover:scale-110 transition-transform duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Créer un compte
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Rejoignez la communauté
            </p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="relative z-10 px-6 pb-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 mx-auto max-w-md shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-app-pink to-app-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">TeleHiba</h2>
            <p className="text-gray-600 text-sm">Marketplace solidaire</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de compte
              </label>
              <div className="space-y-3">
                {userTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedRole(type.value)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedRole === type.value
                        ? "border-app-purple bg-app-purple/10 shadow-lg"
                        : "border-gray-200 bg-gray-50 hover:border-app-purple/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${type.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                      >
                        {type.icon}
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                      {selectedRole === type.value && (
                        <div className="w-6 h-6 bg-app-purple rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="ex: Walid"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="ex: Kherroubi"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign up button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-app-pink to-app-purple hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Création...
                </div>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-app-purple font-semibold hover:text-app-pink transition-colors duration-300"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
