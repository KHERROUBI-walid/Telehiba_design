import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isChanging, setIsChanging] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    return { score, checks };
  };

  const passwordStrength = checkPasswordStrength(formData.newPassword);

  const getStrengthColor = (score: number) => {
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Faible";
    if (score < 4) return "Moyenne";
    return "Forte";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Le mot de passe actuel est requis";
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 8 caractères";
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword =
        "Le mot de passe doit être plus fort (au moins 3 critères)";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez confirmer le nouveau mot de passe";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Check if new password is same as current
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "Le nouveau mot de passe doit être différent de l'actuel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsChanging(true);
    setErrors({});

    try {
      // Simulate API call to change password
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate server validation of current password
          if (formData.currentPassword !== "oldpassword123") {
            reject(new Error("Mot de passe actuel incorrect"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      setShowSuccess(true);

      // Hide success message and navigate back after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 3000);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du changement de mot de passe",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const securityTips = [
    "Utilisez un mélange de lettres majuscules et minuscules",
    "Incluez des chiffres et des caractères spéciaux",
    "Évitez d'utiliser des informations personnelles",
    "Ne réutilisez pas vos anciens mots de passe",
    "Utilisez un gestionnaire de mots de passe",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-app-purple to-app-sky">
        <div className="flex items-center gap-3">
          <Link to="/edit-profile" className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              Changer le mot de passe
            </h1>
            <p className="text-sm text-white/80">Sécurisez votre compte</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Mot de passe changé avec succès!</span>
        </div>
      )}

      {/* Form */}
      <div className="p-4">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}

        {/* Password Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Modification du mot de passe
          </h3>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                    errors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      Force du mot de passe:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength.score < 2
                          ? "text-red-500"
                          : passwordStrength.score < 4
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(passwordStrength.checks).map(
                      ([key, isValid]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2 text-xs ${
                            isValid ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {isValid ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>
                            {key === "length" && "Au moins 8 caractères"}
                            {key === "uppercase" && "Une lettre majuscule"}
                            {key === "lowercase" && "Une lettre minuscule"}
                            {key === "number" && "Un chiffre"}
                            {key === "special" && "Un caractère spécial"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-purple transition-colors ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword &&
                formData.newPassword === formData.confirmPassword && (
                  <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Les mots de passe correspondent
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Conseils de sécurité
          </h3>
          <ul className="space-y-2">
            {securityTips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-blue-700"
              >
                <Check className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isChanging || passwordStrength.score < 3}
            className="w-full bg-app-purple text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChanging ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changement en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Changer le mot de passe
              </>
            )}
          </button>

          <Link
            to="/edit-profile"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Annuler
          </Link>
        </div>

        {/* Additional Security Info */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">
                Important à savoir
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Vous serez déconnecté de tous vos appareils après le
                  changement
                </li>
                <li>• Assurez-vous de mémoriser votre nouveau mot de passe</li>
                <li>• Cette action ne peut pas être annulée facilement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
