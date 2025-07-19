import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize with current user data
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Utilisatrice active de TeleHiba, j'aime aider la communauté et recevoir de l'aide quand j'en ai besoin.",
    avatar: "👩‍💼",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
      newErrors.phone = "Format de téléphone invalide";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "La localisation est requise";
    }

    // Bio validation
    if (formData.bio.length > 200) {
      newErrors.bio = "La bio ne peut pas dépasser 200 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowSuccessMessage(true);

      // Hide success message and navigate back after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const avatarOptions = ["👩‍💼", "👨‍💼", "👩‍🎓", "👨‍🎓", "👩‍⚕️", "👨‍⚕️", "👩‍🍳", "👨‍🍳"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Modifier le Profil</h1>
            <p className="text-sm text-white/80">
              Mettre à jour vos informations
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white/20 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </header>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Profil mis à jour avec succès!</span>
        </div>
      )}

      {/* Form */}
      <div className="p-4 pb-8">
        {/* Avatar Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Photo de Profil
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-app-purple to-app-sky rounded-full flex items-center justify-center text-3xl">
              {formData.avatar}
            </div>
            <div>
              <p className="font-medium text-gray-800">Choisir un avatar</p>
              <p className="text-sm text-gray-600">
                Sélectionnez un emoji pour votre profil
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleInputChange("avatar", avatar)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-colors ${
                  formData.avatar === avatar
                    ? "border-app-purple bg-app-purple/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informations Personnelles
          </h3>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Entrez votre nom complet"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Adresse email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Localisation *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ville, Pays"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors resize-none ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Parlez-nous de vous..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio ? (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.bio}
                  </p>
                ) : (
                  <div></div>
                )}
                <span
                  className={`text-sm ${formData.bio.length > 180 ? "text-red-500" : "text-gray-500"}`}
                >
                  {formData.bio.length}/200
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sécurité</h3>

          <Link
            to="/change-password"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-blue-600" />
                ) : (
                  <Eye className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Changer le mot de passe
                </p>
                <p className="text-sm text-gray-600">
                  Mise à jour de vos identifiants
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-app-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>

          <Link
            to="/profile"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Annuler
          </Link>
        </div>
      </div>
    </div>
  );
}
