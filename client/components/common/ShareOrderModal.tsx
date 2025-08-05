import React, { useState } from 'react';
import { X, Share2, Copy, MessageCircle, Mail, Facebook, Twitter, Link, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    total: number;
    status: string;
    family?: {
      name: string;
    };
  };
}

const ShareOrderModal: React.FC<ShareOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/order/${order.id}`;
  const shareText = `🙏 Aidez ${order.family?.name || 'une famille'} à payer sa commande de €${order.total.toFixed(2)} sur TeleHiba - Ensemble, soutenons les familles dans le besoin!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans le presse-papiers",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien",
      });
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aidez une famille sur TeleHiba',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Aidez une famille sur TeleHiba')}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
              <Share2 className="w-5 h-5 text-app-purple" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Partager la commande
              </h2>
              <p className="text-sm text-gray-600">
                Aidez cette famille à financer sa commande
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

        {/* Order Info */}
        <div className="bg-gradient-to-r from-app-purple/10 to-app-sky/10 rounded-xl p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Commande #{order.id}</p>
            <p className="text-2xl font-bold text-gray-800">€{order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              pour {order.family?.name || 'une famille'}
            </p>
          </div>
        </div>

        {/* Share Message Preview */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            {shareText}
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Native Share or Copy Link */}
          <button
            onClick={handleWebShare}
            className="w-full flex items-center gap-3 p-3 bg-app-purple text-white rounded-xl hover:bg-app-purple/90 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">
              {navigator.share ? 'Partager' : 'Copier le lien'}
            </span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            <span className="font-medium">
              {copied ? 'Lien copié!' : 'Copier le lien'}
            </span>
          </button>

          {/* Social Media Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="flex items-center gap-2 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm">WhatsApp</span>
            </button>

            <button
              onClick={() => handleSocialShare('email')}
              className="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium text-sm">Email</span>
            </button>

            <button
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span className="font-medium text-sm">Facebook</span>
            </button>

            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center gap-2 p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="font-medium text-sm">Twitter</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Plus vous partagez, plus vous aidez les familles dans le besoin ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareOrderModal;
