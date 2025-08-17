// Types basés sur la vraie structure de base de données hiba_db.sql
// Version optimisée - Révision complète 2025

export interface ApiEntity {
  "@id"?: string;
  "@context"?: string;
  "@type": string;
  id: number;
}

// ===== TABLE USER =====
export interface User extends ApiEntity {
  "@type": "User";
  email: string;
  roles: string[]; // JSON field in DB
  type_utilisateur: "famille" | "vendeur" | "donateur";
  civilite?: "M." | "Mme" | "Mlle";
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  compl_adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  statut?: string;
  date_creation: string;
  date_mise_ajour: string;
  is_verified: boolean;

  // Relations (lazy loading via IRIs)
  famille?: string | Famille;
  vendeur?: string | Vendeur;
  donateur?: string | Donateur;
  notifications?: string | Notification[];
  problemes?: string | Probleme[];
}

// ===== TABLE FAMILLE =====
export interface Famille extends ApiEntity {
  "@type": "Famille";
  user_id: number;
  parrain_id?: number;
  nombre_membres?: number;
  revenu_mensuel?: number;

  // Relations
  user: string | User;
  parrain?: string | Donateur;
  commandes?: string | CommandeFamille[];
  evaluations?: string | Evaluation[];
}

// ===== TABLE VENDEUR =====
export interface Vendeur extends ApiEntity {
  "@type": "Vendeur";
  user_id: number;
  nom_societe?: string;
  siren?: number;

  // Relations
  user: string | User;
  produits?: string | Produit[];
  evaluations?: string | Evaluation[];
}

// ===== TABLE DONATEUR =====
export interface Donateur extends ApiEntity {
  "@type": "Donateur";
  user_id: number;
  est_anonyme?: boolean;
  montant_total_don?: number;

  // Relations
  user: string | User;
  paiements?: string | Paiement[];
  paiements_cagnotte?: string | PaiementCagnotte[];
  familles_parrainées?: string | Famille[];
}

// ===== TABLE CATEGORIE =====
export interface Categorie extends ApiEntity {
  "@type": "Categorie";
  nom_categorie: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  produits?: string | Produit[];
}

// ===== TABLE PRODUIT =====
export interface Produit extends ApiEntity {
  "@type": "Produit";
  vendeur_id: number;
  categorie_id: number;
  nom_produit: string;
  description?: string;
  prix: number;
  quantite_dispo: number;
  est_disponible: boolean;
  image_url: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  vendeur: string | Vendeur;
  categorie: string | Categorie;
  lignes_produit?: string | LigneProduit[];
}

// ===== TABLE COMMANDE_FAMILLE =====
export interface CommandeFamille extends ApiEntity {
  "@type": "CommandeFamille";
  famille_id: number;
  paiement_id: number;
  statut: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  famille: string | Famille;
  paiement: string | Paiement;
  commandes_vendeur?: string | CommandeVendeur[];
  cagnotte?: string | Cagnotte;
}

// ===== TABLE COMMANDE_VENDEUR =====
export interface CommandeVendeur extends ApiEntity {
  "@type": "CommandeVendeur";
  commande_famille_id: number;
  transaction_id: number;
  statut: string;
  date_creation: string;
  date_mise_ajour: string;
  total_commande_v?: number;

  // Relations
  commande_famille: string | CommandeFamille;
  transaction: string | TransactionVendeur;
  lignes_produit?: string | LigneProduit[];
}

// ===== TABLE LIGNE_PRODUIT =====
export interface LigneProduit extends ApiEntity {
  "@type": "LigneProduit";
  produit_id: number;
  commande_vendeur_id: number;
  quantite: number;
  prix_unitaire: number;
  total_ligne: number;
  est_validee: boolean;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  produit: string | Produit;
  commande_vendeur: string | CommandeVendeur;
}

// ===== TABLE PAIEMENT =====
export interface Paiement extends ApiEntity {
  "@type": "Paiement";
  donateur_id: number;
  plateforme_id?: number;
  montant_total: number;
  moyen_paiement: string;
  statut: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  donateur: string | Donateur;
  plateforme?: string | Plateforme;
  commandes_famille?: string | CommandeFamille[];
}

// ===== TABLE CAGNOTTE =====
export interface Cagnotte extends ApiEntity {
  "@type": "Cagnotte";
  commande_famille_id: number;
  montant_objectif: number;
  montant_actuel: number;
  statut: string;

  // Relations
  commande_famille: string | CommandeFamille;
  paiements_cagnotte?: string | PaiementCagnotte[];
}

// ===== TABLE PAIEMENT_CAGNOTTE =====
export interface PaiementCagnotte extends ApiEntity {
  "@type": "PaiementCagnotte";
  donateur_id: number;
  cagnotte_id: number;
  montant: number;
  statut: string;
  date_creation: string;

  // Relations
  donateur: string | Donateur;
  cagnotte: string | Cagnotte;
}

// ===== TABLE PLATEFORME =====
export interface Plateforme extends ApiEntity {
  "@type": "Plateforme";
  nom: string;

  // Relations
  paiements?: string | Paiement[];
  transactions?: string | TransactionVendeur[];
}

// ===== TABLE TRANSACTION_VENDEUR =====
export interface TransactionVendeur extends ApiEntity {
  "@type": "TransactionVendeur";
  plateforme_id?: number;
  montant: number;
  moyen_transfert: string;
  statut: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  plateforme?: string | Plateforme;
  commandes_vendeur?: string | CommandeVendeur[];
}

// ===== TABLE NOTIFICATION =====
export interface Notification extends ApiEntity {
  "@type": "Notification";
  user_id: number;
  message: string;
  type: string;
  vue: boolean;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  user: string | User;
}

// ===== TABLE EVALUATION =====
export interface Evaluation extends ApiEntity {
  "@type": "Evaluation";
  famille_id: number;
  vendeur_id: number;
  note: number;
  commentaire?: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  famille: string | Famille;
  vendeur: string | Vendeur;
}

// ===== TABLE PROBLEME =====
export interface Probleme extends ApiEntity {
  "@type": "Probleme";
  user_id: number;
  type: string;
  description: string;
  statut: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  user: string | User;
}

// ===== API Collections =====
export interface ApiCollection<T> {
  "@context": string;
  "@id": string;
  "@type": "hydra:Collection";
  "hydra:member": T[];
  "hydra:totalItems": number;
  "hydra:view"?: {
    "@id": string;
    "@type": string;
    "hydra:first"?: string;
    "hydra:last"?: string;
    "hydra:previous"?: string;
    "hydra:next"?: string;
  };
  "hydra:search"?: {
    "@type": string;
    "hydra:template": string;
    "hydra:variableRepresentation": string;
    "hydra:mapping": Array<{
      "@type": string;
      variable: string;
      property: string;
      required: boolean;
    }>;
  };
}

// ===== Auth & API Types =====
export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  type_utilisateur: "famille" | "vendeur" | "donateur";
  civilite?: "M." | "Mme" | "Mlle";
  telephone?: string;
  adresse?: string;
  compl_adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  
  // Champs spécifiques selon le type
  // Pour famille
  nombre_membres?: number;
  revenu_mensuel?: number;
  
  // Pour vendeur
  nom_societe?: string;
  siren?: number;
  
  // Pour donateur
  est_anonyme?: boolean;
}

export interface ApiError {
  "@context"?: string;
  "@type": string;
  "hydra:title": string;
  "hydra:description": string;
  detail?: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
}

// ===== User Roles =====
export type UserRole = "family" | "vendor" | "donator";
export const ROLE_MAPPING: Record<string, UserRole> = {
  famille: "family",
  vendeur: "vendor",
  donateur: "donator",
};

// ===== Frontend Helper Types =====
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Types pour les filtres et recherches
export interface ProductFilters {
  category?: string;
  vendor?: number;
  city?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export interface VendorFilters {
  search?: string;
  city?: string;
  category?: string;
}

export interface FamilyFilters {
  search?: string;
  city?: string;
  minMembers?: number;
  maxMembers?: number;
  minIncome?: number;
  maxIncome?: number;
}

export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Status enums pour une meilleure type safety
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification"
}
