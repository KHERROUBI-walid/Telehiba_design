import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import { ArrowLeft, ArrowRight, User, MapPin, Building, Heart } from "lucide-react";
import { RegisterRequest } from "../../types/api";

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Type de compte",
    icon: User,
    description: "Choisissez votre rôle",
  },
  {
    id: 2,
    title: "Informations personnelles",
    icon: User,
    description: "Vos coordonnées",
  },
  {
    id: 3,
    title: "Adresse",
    icon: MapPin,
    description: "Votre localisation",
  },
  {
    id: 4,
    title: "Informations spécifiques",
    icon: Building,
    description: "Détails selon votre rôle",
  },
];

export const MultiStepSignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    setFormData(prev => ({ ...prev, ...updates }));
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
          formData.civilite
        );
      case 3:
        return Boolean(formData.ville);
      case 4:
        if (formData.type_utilisateur === "vendeur") {
          return Boolean(formData.nom_societe);
        }
        if (formData.type_utilisateur === "famille") {
          return Boolean(formData.nombre_membres && formData.nombre_membres > 0);
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
        formData.type_utilisateur
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quel est votre rôle ?</h3>
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
                },
                {
                  value: "vendeur",
                  title: "Vendeur",
                  description: "Je souhaite vendre des produits alimentaires",
                  icon: "🏪",
                },
                {
                  value: "donateur",
                  title: "Donateur",
                  description: "Je souhaite aider les familles dans le besoin",
                  icon: "❤️",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.type_utilisateur === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="type_utilisateur"
                    value={option.value}
                    checked={formData.type_utilisateur === option.value}
                    onChange={(e) => updateFormData({ type_utilisateur: e.target.value as any })}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.title}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
              <p className="text-gray-600 text-sm">
                Renseignez vos coordonnées de base
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="civilite">Civilité *</Label>
                <select
                  id="civilite"
                  value={formData.civilite}
                  onChange={(e) => updateFormData({ civilite: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
              </div>

              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => updateFormData({ prenom: e.target.value })}
                  placeholder="Votre prénom"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => updateFormData({ nom: e.target.value })}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="Minimum 8 caractères"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 caractères requis
              </p>
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone || ""}
                onChange={(e) => updateFormData({ telephone: e.target.value })}
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600 text-sm">
                Où êtes-vous situé(e) ?
              </p>
            </div>

            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                type="text"
                value={formData.adresse || ""}
                onChange={(e) => updateFormData({ adresse: e.target.value })}
                placeholder="Numéro et nom de rue"
              />
            </div>

            <div>
              <Label htmlFor="compl_adresse">Complément d'adresse</Label>
              <Input
                id="compl_adresse"
                type="text"
                value={formData.compl_adresse || ""}
                onChange={(e) => updateFormData({ compl_adresse: e.target.value })}
                placeholder="Appartement, étage, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  type="text"
                  value={formData.code_postal || ""}
                  onChange={(e) => updateFormData({ code_postal: e.target.value })}
                  placeholder="75001"
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  type="text"
                  value={formData.ville || ""}
                  onChange={(e) => updateFormData({ ville: e.target.value })}
                  placeholder="Votre ville"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pays">Pays</Label>
              <Input
                id="pays"
                type="text"
                value={formData.pays || "France"}
                onChange={(e) => updateFormData({ pays: e.target.value })}
                placeholder="France"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Informations spécifiques
              </h3>
              <p className="text-gray-600 text-sm">
                Derniers détails selon votre profil
              </p>
            </div>

            {formData.type_utilisateur === "famille" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre_membres">Nombre de membres dans le foyer *</Label>
                  <Input
                    id="nombre_membres"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.nombre_membres || 1}
                    onChange={(e) => updateFormData({ nombre_membres: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="revenu_mensuel">Revenu mensuel du foyer (€)</Label>
                  <Input
                    id="revenu_mensuel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.revenu_mensuel || ""}
                    onChange={(e) => updateFormData({ revenu_mensuel: parseFloat(e.target.value) || 0 })}
                    placeholder="Montant en euros"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cette information nous aide à mieux évaluer vos besoins
                  </p>
                </div>
              </div>
            )}

            {formData.type_utilisateur === "vendeur" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nom_societe">Nom de l'entreprise *</Label>
                  <Input
                    id="nom_societe"
                    type="text"
                    value={formData.nom_societe || ""}
                    onChange={(e) => updateFormData({ nom_societe: e.target.value })}
                    placeholder="Nom de votre commerce"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="siren">Numéro SIREN</Label>
                  <Input
                    id="siren"
                    type="number"
                    value={formData.siren || ""}
                    onChange={(e) => updateFormData({ siren: parseInt(e.target.value) || 0 })}
                    placeholder="123456789"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Facultatif mais recommandé pour la crédibilité
                  </p>
                </div>
              </div>
            )}

            {formData.type_utilisateur === "donateur" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="est_anonyme"
                    type="checkbox"
                    checked={formData.est_anonyme || false}
                    onChange={(e) => updateFormData({ est_anonyme: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="est_anonyme">
                    Je souhaite rester anonyme dans mes dons
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Si coché, votre nom ne sera pas visible par les familles aidées
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                🔒 Toutes vos informations sont sécurisées et ne seront utilisées que pour
                améliorer votre expérience sur la plateforme.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">
            Créer un compte TeleHiba
          </CardTitle>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`${
                    currentStep >= step.id ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>

          {/* Current step info */}
          <div className="flex items-center justify-center mt-4">
            {React.createElement(steps[currentStep - 1].icon, {
              className: "w-6 h-6 text-blue-600 mr-2",
            })}
            <span className="text-sm text-gray-600">
              Étape {currentStep} sur {steps.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-medium"
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
