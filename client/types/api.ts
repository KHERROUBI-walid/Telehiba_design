// Types basés sur la vraie structure de base de données hiba_db.sql

export interface ApiEntity {
  "@id"?: string;
  "@context"?: string;
  id: number;
}

// ===== TABLE USER =====
export interface User extends ApiEntity {
  "@type": "User";
  email: string;
  roles: string[]; // JSON field in DB
  type_utilisateur: "famille" | "vendeur" | "donateur"; // enum field
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
  date_creation: string; // datetime
  date_mise_ajour: string; // datetime
  is_verified: boolean; // tinyint(1)

  // Relations
  famille?: Famille;
  vendeur?: Vendeur;
  donateur?: Donateur;
}

// ===== TABLE FAMILLE =====
export interface Famille extends ApiEntity {
  "@type": "Famille";
  user_id: number;
  parrain_id?: number;
  nombre_membres?: number;
  revenu_mensuel?: number;

  // Relations
  user: User;
  parrain?: Famille;
  commandes?: CommandeFamille[];
}

// ===== TABLE VENDEUR =====
export interface Vendeur extends ApiEntity {
  "@type": "Vendeur";
  user_id: number;
  nom_societe?: string;
  siren?: number;

  // Relations
  user: User;
  produits?: Produit[];
}

// ===== TABLE DONATEUR =====
export interface Donateur extends ApiEntity {
  "@type": "Donateur";
  user_id: number;
  est_anonyme?: boolean; // tinyint(1)
  montant_total_don?: number;

  // Relations
  user: User;
}

// ===== TABLE CATEGORIE =====
export interface Categorie extends ApiEntity {
  "@type": "Categorie";
  nom_categorie: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  produits?: Produit[];
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
  est_disponible: boolean; // tinyint(1)
  image_url: string;
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  vendeur: Vendeur;
  categorie: Categorie;
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
  famille: Famille;
  paiement: Paiement;
  commandes_vendeur?: CommandeVendeur[];
  cagnotte?: Cagnotte;
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
  commande_famille: CommandeFamille;
  transaction: TransactionVendeur;
  lignes_produit?: LigneProduit[];
}

// ===== TABLE LIGNE_PRODUIT =====
export interface LigneProduit extends ApiEntity {
  "@type": "LigneProduit";
  produit_id: number;
  commande_vendeur_id: number;
  quantite: number;
  prix_unitaire: number;
  total_ligne: number;
  est_validee: boolean; // tinyint(1)
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  produit: Produit;
  commande_vendeur: CommandeVendeur;
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
  donateur: Donateur;
  plateforme?: Plateforme;
}

// ===== TABLE CAGNOTTE =====
export interface Cagnotte extends ApiEntity {
  "@type": "Cagnotte";
  commande_famille_id: number;
  montant_objectif: number;
  montant_actuel: number;
  statut: string;

  // Relations
  commande_famille: CommandeFamille;
  paiements_cagnotte?: PaiementCagnotte[];
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
  donateur: Donateur;
  cagnotte: Cagnotte;
}

// ===== TABLE PLATEFORME =====
export interface Plateforme extends ApiEntity {
  "@type": "Plateforme";
  nom: string;
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
  plateforme?: Plateforme;
}

// ===== TABLE NOTIFICATION =====
export interface Notification extends ApiEntity {
  "@type": "Notification";
  user_id: number;
  message: string;
  type: string;
  vue: boolean; // tinyint(1)
  date_creation: string;
  date_mise_ajour: string;

  // Relations
  user: User;
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
  famille: Famille;
  vendeur: Vendeur;
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
  user: User;
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

// ===== Frontend Types (pour l'affichage) =====
export interface ProductFrontend {
  id: number;
  nom_produit: string;
  description?: string;
  prix: number;
  quantite_dispo: number;
  est_disponible: boolean;
  image_url: string;
  vendeur_nom: string;
  categorie_nom: string;
}

export interface VendorOrderFrontend {
  id: number;
  statut: string;
  date_creation: string;
  total_commande_v?: number;
  famille_nom: string;
  lignes_produit: Array<{
    produit_nom: string;
    quantite: number;
    prix_unitaire: number;
    total_ligne: number;
  }>;
}

export interface FamilyFrontend {
  id: number;
  nom_complet: string;
  ville?: string;
  nombre_membres?: number;
  revenu_mensuel?: number;
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
  telephone?: string;
  ville?: string;
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
