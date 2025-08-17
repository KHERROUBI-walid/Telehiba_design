import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  Building,
  Heart,
  Check,
  Mail,
  Clock,
  Shield,
  UserCheck,
  Home,
  Store,
} from "lucide-react";
import { RegisterRequest } from "../../types/api";

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Type de compte",
    icon: User,
    description: "Choisissez votre rôle",
    color: "from-app-pink to-app-purple",
  },
  {
    id: 2,
    title: "Informations personnelles",
    icon: UserCheck,
    description: "Vos coordonnées",
    color: "from-app-purple to-app-blue",
  },
  {
    id: 3,
    title: "Adresse",
    icon: MapPin,
    description: "Votre localisation",
    color: "from-app-blue to-app-cyan",
  },
  {
    id: 4,
    title: "Informations spécifiques",
    icon: Building,
    description: "Détails selon votre rôle",
    color: "from-app-cyan to-app-green",
  },
];

export const MultiStepSignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    type_utilisateur: "famille",
    civilite: "M.",
    telephone: "",
    adresse: "",
    compl_adresse: "",
    code_postal: "",
    ville: "",
    pays: "France",
    // Champs spécifiques
    nombre_membres: 1,
    revenu_mensuel: 0,
    nom_societe: "",
    siren: 0,
    est_anonyme: false,
  });

  const updateFormData = useCallback((updates: Partial<RegisterRequest>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError("");
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.type_utilisateur);
      case 2:
        return Boolean(
          formData.email &&
            formData.password &&
            formData.nom &&
            formData.prenom &&
            formData.civilite,
        );
      case 3:
        return Boolean(formData.ville);
      case 4:
        if (formData.type_utilisateur === "vendeur") {
          return Boolean(formData.nom_societe);
        }
        if (formData.type_utilisateur === "famille") {
          return Boolean(
            formData.nombre_membres && formData.nombre_membres > 0,
          );
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setError("Veuillez remplir tous les champs requis");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup(
        formData.email,
        formData.password,
        formData.nom,
        formData.prenom,
        formData.type_utilisateur,
      );
      setIsComplete(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Success component for account activation
  const SuccessContent = () => {
    const isDonator = formData.type_utilisateur === "donateur";

    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <Check className="w-12 h-12 text-white" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            🎉 Inscription réussie !
          </h3>
          <p className="text-gray-600">Votre compte a été créé avec succès</p>
        </div>

        {isDonator ? (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-green-600 mr-2" />
              <h4 className="text-lg font-semibold text-green-800">
                Accès immédiat - Donateur
              </h4>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              En tant que <strong>donateur</strong>, vous pouvez commencer à
              aider les familles immédiatement ! Votre compte est activé et vous
              pouvez faire des dons sans attendre.
            </p>
            <Button
              onClick={() => navigate("/donator-dashboard")}
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Commencer à donner
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-blue-600 mr-2" />
              <h4 className="text-lg font-semibold text-blue-800">
                Activation en cours
              </h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">
                  <strong>
                    Votre compte sera activé par un administrateur
                  </strong>{" "}
                  dans les plus brefs délais pour garantir la sécurité de notre
                  plateforme.
                </p>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">
                  <strong>Vous recevrez un email de confirmation</strong> à
                  l'adresse{" "}
                  <span className="font-medium">{formData.email}</span> dès
                  l'activation.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-app-purple to-app-pink hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <User className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (isComplete) {
      return <SuccessContent />;
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Quel est votre rôle ?
              </h3>
              <p className="text-gray-600 text-sm">
                Sélectionnez le type de compte qui vous correspond
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  value: "famille",
                  title: "Famille",
                  description: "Je souhaite recevoir de l'aide alimentaire",
                  icon: "👨‍👩‍👧‍👦",
                  gradient: "from-blue-500 to-purple-600",
                  bgGradient: "from-blue-50 to-purple-50",
                  borderColor: "border-blue-500",
                },
                {
                  value: "vendeur",
                  title: "Vendeur",
                  description: "Je souhaite vendre des produits alimentaires",
                  icon: "🏪",
                  gradient: "from-purple-500 to-pink-600",
                  bgGradient: "from-purple-50 to-pink-50",
                  borderColor: "border-purple-500",
                },
                {
                  value: "donateur",
                  title: "Donateur",
                  description: "Je souhaite aider les familles dans le besoin",
                  icon: "❤️",
                  gradient: "from-pink-500 to-red-600",
                  bgGradient: "from-pink-50 to-red-50",
                  borderColor: "border-pink-500",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative overflow-hidden flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                    ${
                      formData.type_utilisateur === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.bgGradient} shadow-lg scale-105`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="type_utilisateur"
                    value={option.value}
                    checked={formData.type_utilisateur === option.value}
                    onChange={(e) =>
                      updateFormData({
                        type_utilisateur: e.target.value as any,
                      })
                    }
                    className="sr-only"
                  />

                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div
                      className={`w-full h-full bg-gradient-to-br ${option.gradient} rounded-full transform translate-x-6 -translate-y-6`}
                    ></div>
                  </div>

                  <span className="text-3xl mr-4 z-10">{option.icon}</span>
                  <div className="z-10">
                    <div className="font-semibold text-lg text-gray-800">
                      {option.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </div>
                  </div>

                  {formData.type_utilisateur === option.value && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Informations personnelles
              </h3>
              <p className="text-gray-600 text-sm">
                Renseignez vos coordonnées de base
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="civilite" className="text-gray-700 font-medium">
                  Civilité *
                </Label>
                <select
                  id="civilite"
                  value={formData.civilite}
                  onChange={(e) =>
                    updateFormData({ civilite: e.target.value as any })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent bg-gray-50 transition-all duration-200"
                  required
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
              </div>

              <div>
                <Label htmlFor="prenom" className="text-gray-700 font-medium">
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => updateFormData({ prenom: e.target.value })}
                  placeholder="Votre prénom"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nom" className="text-gray-700 font-medium">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => updateFormData({ nom: e.target.value })}
                  placeholder="Votre nom"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="votre@email.com"
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Mot de passe *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="Minimum 8 caractères"
                className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Minimum 8 caractères requis
              </p>
            </div>

            <div>
              <Label htmlFor="telephone" className="text-gray-700 font-medium">
                Téléphone
              </Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone || ""}
                onChange={(e) => updateFormData({ telephone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Adresse</h3>
              <p className="text-gray-600 text-sm">Où êtes-vous situé(e) ?</p>
            </div>

            <div>
              <Label htmlFor="adresse" className="text-gray-700 font-medium">
                Adresse
              </Label>
              <Input
                id="adresse"
                type="text"
                value={formData.adresse || ""}
                onChange={(e) => updateFormData({ adresse: e.target.value })}
                placeholder="Numéro et nom de rue"
                className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
              />
            </div>

            <div>
              <Label
                htmlFor="compl_adresse"
                className="text-gray-700 font-medium"
              >
                Complément d'adresse
              </Label>
              <Input
                id="compl_adresse"
                type="text"
                value={formData.compl_adresse || ""}
                onChange={(e) =>
                  updateFormData({ compl_adresse: e.target.value })
                }
                placeholder="Appartement, étage, etc."
                className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="code_postal"
                  className="text-gray-700 font-medium"
                >
                  Code postal
                </Label>
                <Input
                  id="code_postal"
                  type="text"
                  value={formData.code_postal || ""}
                  onChange={(e) =>
                    updateFormData({ code_postal: e.target.value })
                  }
                  placeholder="75001"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="ville" className="text-gray-700 font-medium">
                  Ville *
                </Label>
                <Input
                  id="ville"
                  type="text"
                  value={formData.ville || ""}
                  onChange={(e) => updateFormData({ ville: e.target.value })}
                  placeholder="Votre ville"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pays" className="text-gray-700 font-medium">
                Pays
              </Label>
              <Input
                id="pays"
                type="text"
                value={formData.pays || "France"}
                onChange={(e) => updateFormData({ pays: e.target.value })}
                placeholder="France"
                className="h-12 bg-gray-50 border-gray-200 focus:border-app-purple focus:ring-app-purple rounded-xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Informations spécifiques
              </h3>
              <p className="text-gray-600 text-sm">
                Derniers détails selon votre profil
              </p>
            </div>

            {formData.type_utilisateur === "famille" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Informations du foyer
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="nombre_membres"
                        className="text-gray-700 font-medium"
                      >
                        Nombre de membres dans le foyer *
                      </Label>
                      <Input
                        id="nombre_membres"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.nombre_membres || 1}
                        onChange={(e) =>
                          updateFormData({
                            nombre_membres: parseInt(e.target.value) || 1,
                          })
                        }
                        className="h-12 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="revenu_mensuel"
                        className="text-gray-700 font-medium"
                      >
                        Revenu mensuel du foyer (€)
                      </Label>
                      <Input
                        id="revenu_mensuel"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.revenu_mensuel || ""}
                        onChange={(e) =>
                          updateFormData({
                            revenu_mensuel: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Montant en euros"
                        className="h-12 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                      />
                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Cette information nous aide à mieux évaluer vos besoins
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.type_utilisateur === "vendeur" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Informations de l'entreprise
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="nom_societe"
                        className="text-gray-700 font-medium"
                      >
                        Nom de l'entreprise *
                      </Label>
                      <Input
                        id="nom_societe"
                        type="text"
                        value={formData.nom_societe || ""}
                        onChange={(e) =>
                          updateFormData({ nom_societe: e.target.value })
                        }
                        placeholder="Nom de votre commerce"
                        className="h-12 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="siren"
                        className="text-gray-700 font-medium"
                      >
                        Numéro SIREN
                      </Label>
                      <Input
                        id="siren"
                        type="number"
                        value={formData.siren || ""}
                        onChange={(e) =>
                          updateFormData({
                            siren: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="123456789"
                        className="h-12 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                      />
                      <p className="text-xs text-purple-600 mt-2 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Facultatif mais recommandé pour la crédibilité
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.type_utilisateur === "donateur" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-2xl border border-pink-100">
                  <h4 className="font-semibold text-pink-800 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Préférences de don
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        id="est_anonyme"
                        type="checkbox"
                        checked={formData.est_anonyme || false}
                        onChange={(e) =>
                          updateFormData({ est_anonyme: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      <div>
                        <Label
                          htmlFor="est_anonyme"
                          className="text-gray-700 font-medium cursor-pointer"
                        >
                          Je souhaite rester anonyme dans mes dons
                        </Label>
                        <p className="text-sm text-pink-600 mt-1">
                          Si coché, votre nom ne sera pas visible par les
                          familles aidées
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100">
              <p className="text-sm text-green-800 flex items-start">
                <Shield className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                Toutes vos informations sont sécurisées et ne seront utilisées
                que pour améliorer votre expérience sur la plateforme TeleHiba.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-pink/10 via-app-purple/10 to-app-blue/10 flex items-center justify-center px-4 py-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-app-pink/20 to-app-purple/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-app-blue/20 to-app-cyan/20 rounded-full blur-3xl"></div>
        </div>

        <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl">
          <CardContent className="p-8">
            <SuccessContent />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink/10 via-app-purple/10 to-app-blue/10 flex items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-app-pink/20 to-app-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-app-blue/20 to-app-cyan/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-3xl relative z-10 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl">
        <CardHeader className="pb-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-app-pink to-app-purple rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-app-pink to-app-purple bg-clip-text text-transparent">
              Créer un compte TeleHiba
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">Marketplace solidaire</p>
          </div>

          {/* Modern Step Indicator */}
          <div className="space-y-4">
            {/* Step numbers with lines */}
            <div className="flex justify-between items-center relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2">
                <div
                  className="h-full bg-gradient-to-r from-app-pink to-app-purple transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>

              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg
                      ${
                        currentStep > step.id
                          ? `bg-gradient-to-r ${step.color} text-white scale-110`
                          : currentStep === step.id
                            ? `bg-gradient-to-r ${step.color} text-white scale-110 ring-4 ring-white`
                            : "bg-white text-gray-400 border-2 border-gray-200"
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Step titles */}
            <div className="flex justify-between text-xs">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center max-w-[80px] ${
                    currentStep >= step.id
                      ? "text-gray-800 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  <div className="truncate">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current step info with icon */}
          <div className="text-center">
            <div className="flex items-center justify-center">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-5 h-5 text-app-purple mr-2",
              })}
              <span className="text-sm text-gray-600 font-medium">
                Étape {currentStep} sur {steps.length}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 rounded-xl border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-app-purple to-app-pink hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || isLoading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Login link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-app-purple hover:text-app-pink font-semibold transition-colors duration-300"
              >
                Se connecter
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
