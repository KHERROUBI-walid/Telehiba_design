import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Heart } from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, sanitizeInput, checkRateLimit, recordAttempt } from "../utils/security";
import DemoInstructions from "../components/common/DemoInstructions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default redirects based on role
  const getRedirectPath = (userRole: UserRole): string => {
    // Check if there's a specific page the user was trying to access
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      return from;
    }

    // Default redirects based on user role
    const roleRedirects: Record<UserRole, string> = {
      family: "/",
      vendor: "/vendor-dashboard",
      donator: "/donator-dashboard"
    };

    return roleRedirects[userRole];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email);
    const trimmedPassword = password.trim();

    if (!sanitizedEmail || !trimmedPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    // Email format validation
    if (!validateEmail(sanitizedEmail)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Format d'email invalide"
      });
      return;
    }

    // Rate limiting check
    if (!checkRateLimit('login', 5, 15 * 60 * 1000)) {
      toast({
        variant: "destructive",
        title: "Trop de tentatives",
        description: "Trop de tentatives de connexion. Réessayez dans 15 minutes."
      });
      return;
    }

    try {
      const success = await login(sanitizedEmail, trimmedPassword);

      if (success) {
        // Wait a moment for the auth context to update with user data
        setTimeout(() => {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          if (currentUser.role) {
            const redirectPath = getRedirectPath(currentUser.role);
            toast({
              title: "Connexion réussie",
              description: `Bienvenue ! Redirection vers votre espace ${currentUser.role}.`
            });
            navigate(redirectPath, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } else {
        recordAttempt('login');
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect"
        });
      }
    } catch (error) {
      recordAttempt('login');
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-app-purple/10 to-app-pink/10 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link to="/" className="text-white hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Connexion</h1>
            <p className="text-white/80 text-sm mt-1">Accédez à votre espace</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 mx-auto max-w-md shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-app-pink to-app-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">TeleHiba</h2>
            <p className="text-gray-600 text-sm">Marketplace solidaire</p>
          </div>

          {/* Demo Instructions */}
          <DemoInstructions />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-app-pink to-app-purple hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{" "}
              <Link 
                to="/signup" 
                className="text-app-purple font-semibold hover:text-app-pink transition-colors duration-300"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
