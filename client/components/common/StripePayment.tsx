import React, { useState } from 'react';
import { CreditCard, Shield, Lock, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  familyName: string;
  vendorName: string;
}

interface StripePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: PaymentDetails;
  onSuccess: (paymentResult: any) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  isOpen,
  onClose,
  paymentDetails,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Numéro de carte invalide"
      });
      return false;
    }

    if (!expiryDate || expiryDate.length < 5) {
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: "Date d'expiration invalide"
      });
      return false;
    }

    if (!cvc || cvc.length < 3) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Code CVC invalide"
      });
      return false;
    }

    if (!cardholderName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Nom du titulaire requis"
      });
      return false;
    }

    if (!email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Email invalide"
      });
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would:
      // 1. Create a payment intent with Stripe
      // 2. Confirm the payment with the card details
      // 3. Handle 3D Secure if required
      // 4. Return the payment result

      const mockPaymentResult = {
        id: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: paymentDetails.amount * 100, // Stripe uses cents
        currency: paymentDetails.currency,
        payment_method: {
          card: {
            brand: 'visa',
            last4: cardNumber.slice(-4)
          }
        },
        created: Date.now() / 1000,
        receipt_url: `https://pay.stripe.com/receipts/test_${Date.now()}`
      };

      onSuccess(mockPaymentResult);
      
      toast({
        title: "Paiement réussi!",
        description: `€${paymentDetails.amount.toFixed(2)} payés pour ${paymentDetails.familyName}`,
      });

      onClose();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Erreur de paiement",
        description: "Le paiement n'a pas pu être traité. Veuillez réessayer."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  const getCardBrand = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'generic';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Paiement sécurisé</h2>
              <p className="text-sm text-gray-600">Powered by Stripe</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Payment Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">Donation pour {paymentDetails.familyName}</span>
              <span className="text-2xl font-bold text-green-600">
                €{paymentDetails.amount.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{paymentDetails.description}</p>
            <p className="text-sm text-gray-600">Chez {paymentDetails.vendorName}</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de confirmation
            </label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de carte
            </label>
            <div className="relative">
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="font-mono pr-12"
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getCardBrand(cardNumber) === 'visa' && (
                  <div className="text-xs font-bold text-blue-600 bg-blue-100 px-1 rounded">VISA</div>
                )}
                {getCardBrand(cardNumber) === 'mastercard' && (
                  <div className="text-xs font-bold text-red-600 bg-red-100 px-1 rounded">MC</div>
                )}
                {getCardBrand(cardNumber) === 'amex' && (
                  <div className="text-xs font-bold text-green-600 bg-green-100 px-1 rounded">AMEX</div>
                )}
              </div>
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration
              </label>
              <Input
                placeholder="MM/AA"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                className="font-mono"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <Input
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                maxLength={4}
                className="font-mono"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du titulaire
            </label>
            <Input
              placeholder="Nom complet"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          {/* Save Card Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="save-card"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              disabled={isProcessing}
              className="rounded border-gray-300 text-app-purple focus:ring-app-purple"
            />
            <label htmlFor="save-card" className="text-sm text-gray-600">
              Sauvegarder cette carte pour les prochains paiements
            </label>
          </div>
        </div>

        {/* Security Information */}
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-800">Paiement sécurisé</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Chiffrement SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Certifié PCI DSS Level 1</span>
              </div>
              <p>Vos informations de paiement sont protégées par Stripe</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="p-6 pt-0">
          <Button
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg font-semibold"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Traitement en cours...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Payer €{paymentDetails.amount.toFixed(2)}</span>
              </div>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center text-xs text-gray-500">
            En confirmant ce paiement, vous acceptez nos{' '}
            <a href="#" className="text-app-purple underline">conditions de service</a> et notre{' '}
            <a href="#" className="text-app-purple underline">politique de confidentialité</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;
