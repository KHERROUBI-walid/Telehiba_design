# TeleHiba - Plateforme de Solidarité Alimentaire

> **Révision complète 2025** - Application React/TypeScript optimisée connectée à API Platform Symfony

![TeleHiba Logo](./public/images/telehiba-logo.png)

## 📋 Vue d'ensemble

TeleHiba est une plateforme de solidarité alimentaire qui connecte trois types d'utilisateurs :
- **Familles** dans le besoin qui recherchent de l'aide alimentaire
- **Vendeurs** locaux qui proposent leurs produits
- **Donateurs** généreux qui financent les achats des familles

## 🛠️ Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et dev server
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **React Router** pour la navigation
- **React Helmet Async** pour le SEO
- **TanStack Query** pour la gestion des données

### Backend
- **Symfony 6+** avec API Platform
- **MySQL 8.2** base de données
- **JWT** pour l'authentification
- **Doctrine ORM** pour la gestion des données

## 🗃️ Structure de la Base de Données

### Tables Principales

#### 1. **user** (Utilisateurs)
```sql
- id (PK)
- email (UNIQUE)
- roles (JSON)
- password (hashed)
- type_utilisateur (famille|vendeur|donateur)
- civilite (M.|Mme|Mlle)
- nom, prenom
- telephone, adresse, compl_adresse
- code_postal, ville, pays
- statut, date_creation, date_mise_ajour
- is_verified (boolean)
```

#### 2. **famille** (Familles)
```sql
- id (PK)
- user_id (FK → user)
- parrain_id (FK → donateur, nullable)
- nombre_membres
- revenu_mensuel
```

#### 3. **vendeur** (Vendeurs)
```sql
- id (PK)
- user_id (FK → user)
- nom_societe
- siren
```

#### 4. **donateur** (Donateurs)
```sql
- id (PK)
- user_id (FK → user)
- est_anonyme (boolean)
- montant_total_don
```

#### 5. **produit** (Produits)
```sql
- id (PK)
- vendeur_id (FK → vendeur)
- categorie_id (FK → categorie)
- nom_produit
- description
- prix (double)
- quantite_dispo (double)
- est_disponible (boolean)
- image_url
- date_creation, date_mise_ajour
```

#### 6. **categorie** (Catégories)
```sql
- id (PK)
- nom_categorie
- date_creation, date_mise_ajour
```

#### 7. **commande_famille** (Commandes des familles)
```sql
- id (PK)
- famille_id (FK → famille)
- paiement_id (FK → paiement)
- statut
- date_creation, date_mise_ajour
```

#### 8. **commande_vendeur** (Commandes par vendeur)
```sql
- id (PK)
- commande_famille_id (FK → commande_famille)
- transaction_id (FK → transaction_vendeur)
- statut
- total_commande_v
- date_creation, date_mise_ajour
```

#### 9. **ligne_produit** (Lignes de commande)
```sql
- id (PK)
- produit_id (FK → produit)
- commande_vendeur_id (FK → commande_vendeur)
- quantite (double)
- prix_unitaire (double)
- total_ligne (double)
- est_validee (boolean)
- date_creation, date_mise_ajour
```

#### 10. **paiement** (Paiements)
```sql
- id (PK)
- donateur_id (FK → donateur)
- plateforme_id (FK → plateforme, nullable)
- montant_total (double)
- moyen_paiement
- statut
- date_creation, date_mise_ajour
```

#### 11. **cagnotte** (Cagnottes)
```sql
- id (PK)
- commande_famille_id (FK → commande_famille)
- montant_objectif (double)
- montant_actuel (double)
- statut
```

#### Autres tables
- **notification** - Notifications utilisateurs
- **evaluation** - Évaluations vendeurs
- **probleme** - Signalements
- **paiement_cagnotte** - Paiements vers cagnottes
- **plateforme** - Plateformes de paiement
- **transaction_vendeur** - Transactions vendeurs

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+
- npm ou yarn
- Backend Symfony API Platform configuré

### Installation Frontend
```bash
# Cloner le projet
git clone https://github.com/your-repo/telehiba.git
cd telehiba

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Lancer en développement
npm run dev
```

### Configuration Environment
```env
# .env
VITE_API_BASE_URL=/api
```

### Configuration Vite (CORS Proxy)
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

## 📡 Endpoints API Disponibles

### ✅ Endpoints Confirmés (selon votre liste)

#### **Authentification**
- `POST /api/login_check` - Connexion utilisateur

#### **Utilisateurs**
- `POST /api/users` - Création utilisateur (inscription)
- `GET /api/users/{id}` - Récupération utilisateur
- `PUT /api/users/{id}` - Modification utilisateur
- `PATCH /api/users/{id}` - Modification partielle
- `DELETE /api/users/{id}` - Suppression utilisateur

#### **Familles**
- `POST /api/familles` - Création famille
- `GET /api/familles/{id}` - Récupération famille
- `PUT /api/familles/{id}` - Modification famille
- `DELETE /api/familles/{id}` - Suppression famille

#### **Vendeurs**
- `GET /api/vendeurs` - Liste des vendeurs
- `POST /api/vendeurs` - Création vendeur
- `GET /api/vendeurs/{id}` - Récupération vendeur
- `PATCH /api/vendeurs/{id}` - Modification vendeur
- `DELETE /api/vendeurs/{id}` - Suppression vendeur

#### **Donateurs**
- `GET /api/donateurs` - Liste des donateurs
- `POST /api/donateurs` - Création donateur
- `GET /api/donateurs/{id}` - Récupération donateur
- `PATCH /api/donateurs/{id}` - Modification donateur
- `DELETE /api/donateurs/{id}` - Suppression donateur

#### **Produits**
- `POST /api/produits` - Création produit
- `GET /api/produits/{id}` - Récupération produit
- `PUT /api/produits/{id}` - Modification produit
- `DELETE /api/produits/{id}` - Suppression produit

#### **Catégories**
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Création catégorie
- `GET /api/categories/{id}` - Récupération catégorie
- `PUT /api/categories/{id}` - Modification catégorie
- `DELETE /api/categories/{id}` - Suppression catégorie

#### **Commandes**
- `GET /api/commande_familles` - Liste commandes familles
- `POST /api/commande_familles` - Création commande famille
- `GET /api/commande_familles/{id}` - Récupération commande famille
- `PUT /api/commande_familles/{id}` - Modification commande famille
- `DELETE /api/commande_familles/{id}` - Suppression commande famille

- `POST /api/commande_vendeurs` - Création commande vendeur
- `GET /api/commande_vendeurs/{id}` - Récupération commande vendeur
- `PUT /api/commande_vendeurs/{id}` - Modification commande vendeur
- `DELETE /api/commande_vendeurs/{id}` - Suppression commande vendeur

#### **Autres Endpoints**
- `POST /api/ligne_produits` - Gestion lignes produits
- `POST /api/paiements` - Gestion paiements
- `GET /api/cagnottes` - Gestion cagnottes
- `POST /api/notifications` - Gestion notifications
- `POST /api/evaluations` - Gestion évaluations
- `POST /api/problemes` - Gestion signalements

### ❌ Endpoints Manquants (Recommandés)

#### **Collections et Filtres**
```http
# Produits avec filtres
GET /api/produits?categorie.nom_categorie=Légume
GET /api/produits?vendeur.user.ville=Paris
GET /api/produits?prix[gte]=5&prix[lte]=20
GET /api/produits?est_disponible=true

# Familles avec filtres
GET /api/familles?user.ville=Lyon
GET /api/familles?nombre_membres[gte]=3

# Vendeurs avec filtres  
GET /api/vendeurs?user.ville=Marseille
GET /api/vendeurs?nom_societe=boulangerie

# Commandes vendeur avec filtres
GET /api/commande_vendeurs?statut=pending
GET /api/commande_vendeurs?date_creation[gte]=2025-01-01
```

#### **Endpoints Utilitaires**
```http
# Statistiques
GET /api/stats/public
GET /api/stats/donateur/{id}
GET /api/stats/vendeur/{id}
GET /api/stats/famille/{id}

# Utilisateur courant
GET /api/users/me

# Upload de fichiers
POST /api/media_objects

# Recherche globale
GET /api/search?q=tomate

# Villes disponibles
GET /api/cities

# Dashboard data
GET /api/dashboard/famille/{id}
GET /api/dashboard/vendeur/{id}
GET /api/dashboard/donateur/{id}
```

#### **Endpoints Workflow**
```http
# Validation commandes
PUT /api/commande_vendeurs/{id}/status
POST /api/commande_vendeurs/{id}/validate

# Processus de don
POST /api/donations/process
POST /api/cagnottes/{id}/contribute

# Notifications
GET /api/notifications?user={userId}&vue=false
PUT /api/notifications/{id}/mark-read
```

## 🔧 Configuration Recommandée

### 1. **Filtres API Platform**
Ajouter dans vos entités Symfony :

```php
// src/Entity/Produit.php
#[ApiFilter(SearchFilter::class, properties: [
    'nom_produit' => 'partial',
    'categorie.nom_categorie' => 'exact',
    'vendeur.user.ville' => 'exact',
    'est_disponible' => 'exact'
])]
#[ApiFilter(RangeFilter::class, properties: ['prix'])]
#[ApiFilter(OrderFilter::class, properties: ['prix', 'date_creation'])]
```

### 2. **Groupes de Sérialisation**
```php
// src/Entity/User.php
#[Groups(['user:read', 'user:write'])]
private string $email;

#[Groups(['user:read'])]
private array $roles;

#[Groups(['user:write'])]
private string $password;
```

### 3. **Relations Lazy Loading**
Optimiser les performances avec des IRIs au lieu de l'embed complet.

### 4. **Validation**
```php
// src/Entity/User.php
#[Assert\Email]
#[Assert\NotBlank]
private string $email;

#[Assert\Length(min: 8)]
#[Assert\NotBlank]
private string $password;
```

## 🎨 Composants Frontend

### Structure des Composants
```
client/
├── components/
│   ├── auth/
│   │   ├── MultiStepSignup.tsx    ✅ (Inscription multi-étapes)
│   │   └── LoginForm.tsx
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── BottomNavigation.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductFilter.tsx
│   ├── ui/                       ✅ (Components Radix)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx          ✅ (Nouveau)
│   └── SEO/
│       └── MetaTags.tsx          ✅ (Nouveau)
├── pages/
│   ├── HomePage.tsx
│   ├── Shopping.tsx
│   ├── VendorDashboard.tsx
│   ├── DonatorDashboard.tsx
│   └── SignUp.tsx                ✅ (Mise à jour)
├── context/
│   ├── AuthContext.tsx           ✅ (Mis à jour)
│   └── CartContext.tsx
├── services/
│   └── api.ts                    ✅ (Complètement refactorisé)
├── types/
│   └── api.ts                    ✅ (Structure BDD exacte)
└── utils/
    └── security.ts
```

## 🔐 Sécurité et Bonnes Pratiques

### ✅ Implémenté
- Validation JWT côté client
- Headers de sécurité (CSP, XSS Protection)
- Sanitisation des inputs
- Rate limiting sur login (désactivé en dev)
- CORS configuration via Vite proxy

### 🔄 À Implémenter
- CSRF Protection
- Input validation avec Zod
- Error boundary global
- Logging des erreurs
- Tests automatisés

## 📱 PWA et Performance

### ✅ Implémenté
- Manifest.json configuré
- Meta tags optimisés pour mobile
- Service worker ready
- Responsive design
- Code splitting automatique (Vite)

### 📊 SEO et Accessibilité

### ✅ Implémenté
- Meta tags complets (Open Graph, Twitter Card)
- Structured Data (JSON-LD)
- Robots.txt optimisé
- HTML sémantique
- React Helmet Async pour dynamic meta tags

## 🧪 Tests et Déploiement

### Tests Recommandés
```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Déploiement
```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

## 🚀 Roadmap

### Phase 1 (Complété ✅)
- [x] Nettoyage architecture
- [x] Types TypeScript exacts
- [x] Service API optimisé
- [x] Inscription multi-étapes
- [x] SEO et PWA

### Phase 2 (En cours)
- [ ] Validation et sécurité
- [ ] Gestion d'erreurs robuste
- [ ] Tests automatisés
- [ ] Optimisation performance

### Phase 3 (Planifié)
- [ ] Notifications push
- [ ] Paiements intégrés
- [ ] Chat en temps réel
- [ ] Analytics avancées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- **Email**: contact@telehiba.com
- **Site**: https://telehiba.com
- **Documentation**: https://docs.telehiba.com

---

> **Note**: Cette documentation reflète l'état après la révision complète de 2025. Toutes les anciennes dépendances aux fichiers Twig et au serveur de démo ont été supprimées.
