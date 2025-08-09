import React from "react";
import { Info, User, Users, Heart, Store } from "lucide-react";

const DemoInstructions: React.FC = () => {
  const demoAccounts = [
    {
      icon: Users,
      type: "Famille",
      email: "family@demo.com",
      password: "demo123",
      description: "Commandez des produits essentiels"
    },
    {
      icon: Store,
      type: "Vendeur", 
      email: "vendor@demo.com",
      password: "demo123",
      description: "Gérez vos produits et commandes"
    },
    {
      icon: Heart,
      type: "Donateur",
      email: "donator@demo.com", 
      password: "demo123",
      description: "Aidez les familles en besoin"
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">Mode Démonstration</h3>
          <p className="text-blue-800 text-sm mb-3">
            L'API n'est pas connectée. Utilisez ces comptes de démonstration :
          </p>
          
          <div className="space-y-2">
            {demoAccounts.map((account) => {
              const IconComponent = account.icon;
              return (
                <div key={account.type} className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{account.type}</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <div className="font-mono bg-blue-100 px-2 py-1 rounded text-xs mb-1">
                      {account.email}
                    </div>
                    <div className="font-mono bg-blue-100 px-2 py-1 rounded text-xs mb-2">
                      Mot de passe: {account.password}
                    </div>
                    <p className="text-blue-600">{account.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInstructions;
