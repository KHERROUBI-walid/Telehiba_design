# TeleHiba - Marketplace Solidaire

Une plateforme qui connecte les familles dans le besoin avec des donateurs généreux et des vendeurs locaux.

## 🚀 Démarrage rapide

### Mode Développement Local

Si vous avez l'API Symfony en cours d'exécution sur `http://127.0.0.1:8000` :

```bash
npm install
npm run dev
```

### Mode Démonstration

L'application fonctionne automatiquement en mode démonstration si l'API n'est pas disponible.

#### Comptes de démonstration :

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| **Famille** | `family@demo.com` | `demo123` | Commandez des produits essentiels |
| **Vendeur** | `vendor@demo.com` | `demo123` | Gérez vos produits et commandes |
| **Donateur** | `donator@demo.com` | `demo123` | Aidez les familles en besoin |

## 🏗️ Configuration

### Variables d'environnement

Créez un fichier `.env` :

```env
# Pour développement local avec API
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Pour production (remplacez par votre URL d'API)
# VITE_API_BASE_URL=https://votre-api.com/api
```

### Déploiement

L'application détecte automatiquement l'environnement :
- **Local** : Utilise `http://127.0.0.1:8000/api`
- **Production** : Mode démonstration si l'API n'est pas configurée

## 🔧 Résolution des problèmes

### "API déconnectée"

Si vous voyez cette bannière :
1. Vérifiez que votre serveur Symfony/API Platform est démarré
2. Vérifiez l'URL dans le fichier `.env`
3. En mode cloud/production, configurez `VITE_API_BASE_URL` avec l'URL publique de votre API

### Erreurs CORS

Si vous avez des erreurs CORS en développement, configurez votre serveur Symfony pour accepter les requêtes depuis votre frontend.

## 🎯 Fonctionnalités

- ✅ **Authentification sécurisée** avec validation et rate limiting
- ✅ **Mode démonstration** automatique sans API
- ✅ **Gestion d'erreurs robuste** avec fallbacks gracieux
- ✅ **Interface responsive** optimisée mobile
- ✅ **Validation côté client** avec sécurité renforcée

## 🔒 Sécurité

- Validation des entrées utilisateur
- Protection contre les attaques XSS
- Rate limiting sur les tentatives de connexion
- Validation des tokens JWT
- Gestion sécurisée des erreurs

## 📱 Utilisation

1. **Familles** : Créent des commandes de produits essentiels
2. **Donateurs** : Paient les commandes des familles dans le besoin
3. **Vendeurs** : Fournissent les produits et gèrent les commandes

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Tailwind CSS
- **Backend** : Symfony, API Platform (optionnel en mode démo)
- **Base de données** : Compatible avec l'API Platform
- **Paiements** : Intégration Stripe (configurable)

## 📋 API Endpoints

L'application utilise les endpoints API Platform standard :
- `/api/users` - Gestion des utilisateurs
- `/api/produits` - Catalogue de produits
- `/api/commande_vendeurs` - Commandes vendeurs
- `/api/familles` - Gestion des familles
- Et plus...

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Commitez vos changements
4. Ouvrez une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur le repository.
