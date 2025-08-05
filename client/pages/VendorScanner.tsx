import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle, X, AlertCircle, RefreshCw, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "../components/BottomNavigation";

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  donatorName: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  pickupCode: string;
  status: string;
}

export default function VendorScanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [manualCode, setManualCode] = useState("");
  const [scannedOrder, setScannedOrder] = useState<OrderDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);

  const orderId = searchParams.get("orderId");
  const mode = searchParams.get("mode") || "scan"; // "scan" or "verify"

  // Mock orders database
  const mockOrders: Record<string, OrderDetails> = {
    "AB123": {
      id: "ORD001",
      customerName: "Sophie Martin",
      customerPhone: "+33 6 12 34 56 78",
      customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=100&h=100&fit=crop&crop=center",
      donatorName: "Marie Dubois",
      items: [
        {
          id: 1,
          name: "Tomates Bio",
          price: 4.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 2,
          name: "Pommes Golden",
          price: 3.50,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop&crop=center"
        }
      ],
      total: 13.48,
      pickupCode: "AB123",
      status: "ready_for_pickup"
    },
    "CD456": {
      id: "ORD002",
      customerName: "Lucas Petit",
      customerPhone: "+33 6 98 76 54 32",
      customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
      donatorName: "Pierre Durand",
      items: [
        {
          id: 3,
          name: "Pain de Campagne",
          price: 2.80,
          quantity: 3,
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center"
        }
      ],
      total: 8.40,
      pickupCode: "CD456",
      status: "preparing"
    },
    "EF789": {
      id: "ORD003",
      customerName: "Emma Laurent",
      customerPhone: "+33 6 55 44 33 22",
      customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b5b85644?w=100&h=100&fit=crop&crop=center",
      donatorName: "Jean Martin",
      items: [
        {
          id: 1,
          name: "Tomates Bio",
          price: 4.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=100&h=100&fit=crop&crop=center"
        },
        {
          id: 2,
          name: "Pommes Golden",
          price: 3.50,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop&crop=center"
        }
      ],
      total: 11.99,
      pickupCode: "EF789",
      status: "ready_for_pickup"
    }
  };

  const simulateQRScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const codes = Object.keys(mockOrders);
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      const order = mockOrders[randomCode];
      
      if (order && order.status === "ready_for_pickup") {
        setScannedOrder(order);
        setScanResult("success");
        toast({
          title: "Code scanné avec succès",
          description: `Commande de ${order.customerName} trouvée`
        });
      } else if (order && order.status !== "ready_for_pickup") {
        setScanResult("error");
        toast({
          variant: "destructive",
          title: "Commande non prête",
          description: "Cette commande n'est pas encore prête pour le retrait"
        });
      } else {
        setScanResult("error");
        toast({
          variant: "destructive",
          title: "Code invalide",
          description: "Ce code n'existe pas ou a déjà été utilisé"
        });
      }
      setIsScanning(false);
    }, 2000);
  };

  const handleManualCodeSubmit = () => {
    if (!manualCode.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un code"
      });
      return;
    }

    const order = mockOrders[manualCode.toUpperCase()];
    
    if (order && order.status === "ready_for_pickup") {
      setScannedOrder(order);
      setScanResult("success");
      toast({
        title: "Code validé",
        description: `Commande de ${order.customerName} trouvée`
      });
    } else if (order && order.status !== "ready_for_pickup") {
      setScanResult("error");
      toast({
        variant: "destructive",
        title: "Commande non prête",
        description: "Cette commande n'est pas encore prête pour le retrait"
      });
    } else {
      setScanResult("error");
      toast({
        variant: "destructive",
        title: "Code invalide",
        description: "Ce code n'existe pas ou a déjà été utilisé"
      });
    }
  };

  const confirmDelivery = () => {
    if (scannedOrder) {
      toast({
        title: "Commande livrée",
        description: `Commande ${scannedOrder.id} marquée comme livrée`
      });
      
      // Reset state
      setScannedOrder(null);
      setScanResult(null);
      setManualCode("");
      
      // Navigate back to orders
      setTimeout(() => {
        navigate("/vendor-orders");
      }, 1500);
    }
  };

  const resetScanner = () => {
    setScannedOrder(null);
    setScanResult(null);
    setManualCode("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-pink via-app-purple to-app-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-app-pink/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-app-blue/20 to-white/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="flex items-center justify-between px-6">
          <Link to="/vendor-orders" className="text-white hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Scanner QR</h1>
            <p className="text-white/80 text-sm mt-1">Vérification retrait commande</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-24">
        {!scannedOrder ? (
          <div className="space-y-6">
            {/* QR Scanner Simulation */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Scanner le QR code client</h2>
              
              {/* Scanner Viewport */}
              <div className="relative w-64 h-64 mx-auto mb-6 bg-black rounded-2xl overflow-hidden">
                <div className="absolute inset-4 border-2 border-white rounded-xl opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isScanning ? (
                    <div className="text-white">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Analyse en cours...</p>
                    </div>
                  ) : (
                    <div className="text-white/70">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Caméra prête</p>
                    </div>
                  )}
                </div>
                
                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute inset-x-4 h-1 bg-green-400 animate-pulse" 
                       style={{
                         top: '50%',
                         animation: 'scan 2s ease-in-out infinite'
                       }}>
                  </div>
                )}
              </div>

              <Button
                onClick={simulateQRScan}
                disabled={isScanning}
                className="w-full bg-gradient-to-r from-app-purple to-app-pink hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-semibold h-12 mb-4"
              >
                {isScanning ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Scanner en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Commencer le scan
                  </div>
                )}
              </Button>

              {scanResult === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Échec du scan</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">Code invalide ou commande non prête</p>
                </div>
              )}
            </div>

            {/* Manual Code Entry */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Saisie manuelle du code</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Saisir le code (ex: AB123)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono tracking-wider"
                />
                <Button
                  onClick={handleManualCodeSubmit}
                  className="w-full bg-app-purple hover:bg-app-purple/90"
                >
                  Vérifier le code
                </Button>
              </div>
            </div>

            {/* Demo Codes */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Codes de démonstration</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <span className="font-mono font-bold text-green-800">AB123</span>
                    <p className="text-sm text-green-600">Sophie Martin - Prêt pour retrait</p>
                  </div>
                  <button
                    onClick={() => setManualCode("AB123")}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Utiliser
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div>
                    <span className="font-mono font-bold text-orange-800">CD456</span>
                    <p className="text-sm text-orange-600">Lucas Petit - En préparation</p>
                  </div>
                  <button
                    onClick={() => setManualCode("CD456")}
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    Utiliser
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <span className="font-mono font-bold text-green-800">EF789</span>
                    <p className="text-sm text-green-600">Emma Laurent - Prêt pour retrait</p>
                  </div>
                  <button
                    onClick={() => setManualCode("EF789")}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Order Confirmation */
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Code validé !</h2>
              <p className="text-gray-600">Commande trouvée et vérifiée</p>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={scannedOrder.customerAvatar} 
                  alt={scannedOrder.customerName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{scannedOrder.customerName}</h3>
                  <p className="text-gray-600">Commande #{scannedOrder.id}</p>
                  <p className="text-sm text-gray-500">Payé par {scannedOrder.donatorName} 💝</p>
                </div>
                <a
                  href={`tel:${scannedOrder.customerPhone}`}
                  className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Articles à remettre</h4>
              <div className="space-y-3">
                {scannedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-app-purple">{(item.price * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-lg">Total</span>
                <span className="text-2xl font-bold text-app-purple">{scannedOrder.total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={confirmDelivery}
                className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg font-semibold"
              >
                ✅ Confirmer la remise
              </Button>
              <Button
                onClick={resetScanner}
                variant="outline"
                className="w-full h-12"
              >
                <X className="w-5 h-5 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0% { top: 20%; }
          50% { top: 80%; }
          100% { top: 20%; }
        }
      `}</style>
    </div>
  );
}
