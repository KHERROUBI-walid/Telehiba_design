// TypeScript interfaces based on API Platform schemas

export interface ApiEntity {
  '@id': string;
  '@type': string;
  id: number;
}

export interface User extends ApiEntity {
  '@type': 'User';
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vendeur extends ApiEntity {
  '@type': 'Vendeur';
  user: User | string; // Can be populated or just IRI
  storeName: string;
  storeDescription?: string;
  businessNumber?: string;
  isVerified: boolean;
  rating?: number;
  totalSales?: number;
  produits?: Produit[];
  commandeVendeurs?: CommandeVendeur[];
  createdAt: string;
  updatedAt: string;
}

export interface Donateur extends ApiEntity {
  '@type': 'Donateur';
  user: User | string;
  organization?: string;
  donationCapacity?: number;
  isActive: boolean;
  totalDonated?: number;
  famillesAidees?: Famille[];
  createdAt: string;
  updatedAt: string;
}

export interface Famille extends ApiEntity {
  '@type': 'Famille';
  user: User | string;
  familySize: number;
  monthlyIncome?: number;
  needsDescription?: string;
  isVerified: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  donateurs?: Donateur[];
  commandeFamilles?: CommandeFamille[];
  createdAt: string;
  updatedAt: string;
}

export interface Categorie extends ApiEntity {
  '@type': 'Categorie';
  name: string;
  description?: string;
  parentCategory?: Categorie | string;
  subCategories?: Categorie[];
  produits?: Produit[];
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Produit extends ApiEntity {
  '@type': 'Produit';
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  sku?: string;
  images?: string[];
  weight?: number;
  dimensions?: string;
  vendeur: Vendeur | string;
  categorie: Categorie | string;
  ligneProduits?: LigneProduit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommandeFamille extends ApiEntity {
  '@type': 'CommandeFamille';
  famille: Famille | string;
  donateur?: Donateur | string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  ligneProduits?: LigneProduit[];
  paiements?: Paiement[];
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface CommandeVendeur extends ApiEntity {
  '@type': 'CommandeVendeur';
  vendeur: Vendeur | string;
  orderNumber: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';
  totalAmount: number;
  commission?: number;
  ligneProduits?: LigneProduit[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface LigneProduit extends ApiEntity {
  '@type': 'LigneProduit';
  produit: Produit | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  commandeFamille?: CommandeFamille | string;
  commandeVendeur?: CommandeVendeur | string;
  createdAt: string;
}

export interface Paiement extends ApiEntity {
  '@type': 'Paiement';
  commandeFamille: CommandeFamille | string;
  amount: number;
  paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'DONATION';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  paymentDate?: string;
  donateur?: Donateur | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend data transformation types
export interface VendorOrderFrontend {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  donatorName: string;
  donatorAvatar: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: "paid_by_donator" | "preparing" | "ready_for_pickup";
  orderDate: string;
  pickupCode: string;
  notes?: string;
}

export interface ProductFrontend {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  vendor: {
    id: number;
    name: string;
    avatar: string;
    city: string;
  };
  rating: number;
  description: string;
  inStock: boolean;
  unit: string;
}

export interface FamilyFrontend {
  id: string;
  name: string;
  avatar: string;
  city: string;
  memberCount: number;
  monthlyNeed: number;
  currentNeed: number;
  story: string;
  isSponsored: boolean;
  urgencyLevel: "low" | "medium" | "high";
  totalReceived: number;
  children: number;
  verified: boolean;
}

// API Collection response
export interface ApiCollection<T> {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection';
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:search'?: any;
}

// Error response
export interface ApiError {
  '@context': string;
  '@type': 'hydra:Error';
  'hydra:title': string;
  'hydra:description': string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
}
