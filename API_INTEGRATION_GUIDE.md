# Guide d'Intégration API - TeleHiba

Ce guide détaille comment adapter le frontend à votre API Symfony/API Platform.

## 🔍 Étapes de Vérification

### 1. Vérifiez les Endpoints Disponibles

Visitez `http://127.0.0.1:8000/api` et vérifiez que ces endpoints existent :

```
✅ /api/users
✅ /api/vendeurs
✅ /api/donateurs
✅ /api/familles
✅ /api/produits
✅ /api/categories
✅ /api/commande_vendeurs
✅ /api/commande_familles
✅ /api/ligne_produits
✅ /api/paiements
```

### 2. Testez l'Authentification

Le frontend attend ces endpoints d'auth :

```bash
# Test login
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Test user info
curl -X GET http://127.0.0.1:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Si ces endpoints n'existent pas**, vous devez :

- Créer un endpoint `/auth/login` qui retourne `{token, user}`
- Créer un endpoint `/me` qui retourne les infos utilisateur

### 3. Vérifiez la Structure des Données

#### User Structure Attendue :

```json
{
  "@id": "/api/users/1",
  "@type": "User",
  "id": 1,
  "email": "user@test.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+33123456789",
  "city": "Paris",
  "roles": ["ROLE_USER"]
}
```

#### Produit Structure Attendue :

```json
{
  "@id": "/api/produits/1",
  "@type": "Produit",
  "id": 1,
  "name": "Tomates Bio",
  "price": 4.99,
  "stockQuantity": 50,
  "images": ["url1.jpg", "url2.jpg"],
  "isActive": true,
  "vendeur": "/api/vendeurs/1", // or embedded object
  "categorie": "/api/categories/1"
}
```

### 4. Configurer les Relations

Le frontend attend ces relations :

- `Vendeur.user` → User object ou IRI
- `Famille.user` → User object ou IRI
- `Produit.vendeur` → Vendeur object ou IRI
- `Produit.categorie` → Categorie object ou IRI
- `CommandeVendeur.ligneProduits` → Array of LigneProduit

## 🛠️ Ajustements Nécessaires

### Si vos champs sont différents :

1. **Noms de champs différents** :

   Editez `client/services/api.ts` et adaptez les mappings :

   ```typescript
   // Si votre API utilise 'title' au lieu de 'name'
   name: produit.title,

   // Si votre API utilise 'full_name' au lieu de firstName/lastName
   name: produit.full_name,
   ```

2. **Structure de relations différente** :

   Modifiez les transformations dans `getProducts()`, `getVendors()`, etc.

3. **Endpoints différents** :

   Editez `client/config/api-config.ts` :

   ```typescript
   export const API_ENDPOINTS = {
     PRODUITS: "/api/products", // Si vous utilisez /products au lieu de /produits
     // ...
   };
   ```

### Si vous n'avez pas certaines entités :

Désactivez les fonctionnalités correspondantes :

```typescript
// Dans les composants, ajoutez des vérifications
if (!isFeatureEnabled('donator')) {
  return <div>Fonctionnalité donateur non disponible</div>;
}
```

## 🔧 Paramètres de Filtrage

Votre API doit supporter ces filtres :

### Produits :

```
GET /api/produits?name=tomate                 # Recherche par nom
GET /api/produits?categorie.name=legumes      # Filtrage par catégorie
GET /api/produits?vendeur=1                   # Filtrage par vendeur
GET /api/produits?isActive=true               # Produits actifs uniquement
```

### Vendeurs :

```
GET /api/vendeurs?user.city=Paris             # Filtrage par ville
GET /api/vendeurs?storeName=bio               # Recherche par nom magasin
GET /api/vendeurs?isVerified=true             # Vendeurs vérifiés
```

### Familles :

```
GET /api/familles?user.city=Lyon              # Filtrage par ville
GET /api/familles?isVerified=true             # Familles vérifiées
GET /api/familles?priority=HIGH               # Filtrage par priorité
```

## 🚨 Problèmes Courants

### 1. CORS (Cross-Origin Resource Sharing)

Si vous obtenez des erreurs CORS, ajoutez dans votre Symfony :

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
  defaults:
    origin_regex: true
    allow_origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
    allow_methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_headers: ["Content-Type", "Authorization"]
    max_age: 3600
```

### 2. Authentification JWT

Assurez-vous que votre API retourne un JWT valide :

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@test.com",
    "roles": ["ROLE_USER"]
  }
}
```

### 3. Pagination API Platform

Le frontend gère automatiquement les réponses paginées :

```json
{
  "@context": "/api/contexts/Produit",
  "@id": "/api/produits",
  "@type": "hydra:Collection",
  "hydra:member": [...],
  "hydra:totalItems": 150
}
```

## 🧪 Test de l'Intégration

1. **Démarrez votre API** : `symfony serve`
2. **Démarrez le frontend** : `npm run dev`
3. **Testez la connexion** : Utilisez les comptes démo
4. **Vérifiez les logs** : Ouvrez la console navigateur

### Debug les Requêtes API

Dans la console navigateur, vous devriez voir :

```
✅ API request: GET /api/produits
✅ API response: 200 OK
❌ API request failed: 404 Not Found
```

## 📝 Checklist Finale

- [ ] API démarre sur `http://127.0.0.1:8000`
- [ ] Endpoints `/api/produits`, `/api/vendeurs`, etc. existent
- [ ] CORS configuré pour `localhost:5173`
- [ ] Authentification JWT fonctionne
- [ ] Relations entre entités chargées correctement
- [ ] Filtres de recherche supportés
- [ ] Frontend charge les données sans erreur

## 🆘 Si Ça Ne Fonctionne Pas

1. **Partagez les logs d'erreur** de la console navigateur
2. **Vérifiez la structure** de vos entités avec `/api/docs`
3. **Testez manuellement** vos endpoints avec curl/Postman
4. **Adaptez les mappings** dans `client/services/api.ts`

Le frontend est conçu pour être flexible et s'adapter à votre structure API !
