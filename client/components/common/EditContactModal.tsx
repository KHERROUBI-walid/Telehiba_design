import React, { useState } from 'react';
import { X, Mail, Phone, Check } from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '@/hooks/use-toast';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: 'email' | 'phone';
  currentValue: string;
  onUpdate: (newValue: string) => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  field,
  currentValue,
  onUpdate,
}) => {
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (field === 'email') {
        await apiService.updateEmail(value);
        toast({
          title: "Email mis à jour",
          description: "Votre adresse email a été mise à jour avec succès",
        });
      } else {
        await apiService.updatePhone(value);
        toast({
          title: "Téléphone mis à jour", 
          description: "Votre numéro de téléphone a été mis à jour avec succès",
        });
      }
      
      onUpdate(value);
      onClose();
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Erreur lors de la mise à jour du ${field === 'email' ? 'email' : 'téléphone'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const isValid = field === 'email' ? validateEmail(value) : validatePhone(value);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-app-purple/10 rounded-full flex items-center justify-center">
              {field === 'email' ? (
                <Mail className="w-5 h-5 text-app-purple" />
              ) : (
                <Phone className="w-5 h-5 text-app-purple" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Modifier {field === 'email' ? 'Email' : 'Téléphone'}
              </h2>
              <p className="text-sm text-gray-600">
                Mettre à jour vos informations de contact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field === 'email' ? 'Adresse Email' : 'Numéro de Téléphone'}
            </label>
            <input
              id={field}
              type={field === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={field === 'email' ? 'exemple@email.com' : '+33 6 12 34 56 78'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-purple/50 focus:border-app-purple transition-colors"
              autoFocus
            />
            {!isValid && value && (
              <p className="text-red-500 text-xs mt-1">
                {field === 'email' 
                  ? 'Veuillez entrer une adresse email valide'
                  : 'Veuillez entrer un numéro de téléphone français valide'
                }
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading || value === currentValue}
              className="flex-1 px-4 py-3 bg-app-purple text-white rounded-xl hover:bg-app-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {isLoading ? 'Mise à jour...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
