# Interface TeleHiba - Templates Twig + Tailwind CSS

## Structure des templates

### 📁 **base/**

- `layout.html.twig` - Template de base avec Tailwind CSS
- `navigation.html.twig` - Navigation principale
- `bottom_navigation.html.twig` - Navigation du bas (mobile)

### 📁 **auth/** - Authentification

- `landing.html.twig` - Page d'accueil principale
- `login.html.twig` - Page de connexion
- `signup.html.twig` - Page d'inscription

### 📁 **famille_accueil/** - Interface Famille

- `dashboard.html.twig` - Dashboard famille avec solde, commandes récentes

### 📁 **vendeur_accueil/** - Interface Vendeur

- `dashboard.html.twig` - Dashboard vendeur avec statistiques
- `produits.html.twig` - Gestion des produits vendeur

### 📁 **donateur_accueil/** - Interface Donateur

- `dashboard.html.twig` - Dashboard donateur avec impact des donations

### 📁 **produits/** - Shopping

- `shopping.html.twig` - Page de shopping pour les familles

### 📁 **commandes/** - Gestion des commandes

- `famille_commandes.html.twig` - Commandes côté famille
- `vendeur_commandes.html.twig` - Commandes côté vendeur

### 📁 **profil/** - Profil utilisateur

- `profil.html.twig` - Page de profil utilisateur

## Données d'exemple utilisées

### Utilisateurs

- **Famille**: Alberto Machado, Nice, 2 membres, €200/mois
- **Vendeur**: Walid Kherroubi, Boulangerie Walid, SIREN: 457845125
- **Donateur**: Alberto Machado, €450.75 total de dons

### Produits

- **Tomates**: €10.00, Boulangerie Walid, Stock: 10
- **Salade**: €4.00, Épicerie Bio, Stock: 15
- **Pain complet**: €2.50, Boulangerie Walid, Stock: 15
- **Pommes**: €13.00, Marché Local, Stock: 14

### Commandes

- **#12345**: €18.50, Baguette + Croissant + Pain
- **#12344**: €24.30, Pain au chocolat + Baguette bio + Tarte
- **#V001**: Commande vendeur en attente
- **#V002**: Commande vendeur en préparation

### Statistiques

- **Familles aidées**: 150
- **Vendeurs partenaires**: 45
- **Total donations**: €25,430
- **Commandes traitées**: 680

## Fonctionnalités implémentées

### 🎨 Design

- Interface responsive avec Tailwind CSS
- Dégradés de couleurs (rose, violet, bleu)
- Icônes Lucide intégrées
- Animations CSS (pulse, bounce)

### 🔧 Fonctionnalités

- Navigation adaptée selon le type d'utilisateur
- Gestion des statuts de commandes
- Barres de progression pour stocks/cagnottes
- QR codes pour validation commandes
- Système de notifications
- Profils adaptés par type d'utilisateur

### 📱 Mobile-first

- Navigation du bas pour mobile
- Layout optimisé pour petit écran
- Boutons et zones de clic adaptés au tactile

## Variables Twig utilisées

```twig
{# Variables utilisateur #}
{{ user.prenom|default('Prénom') }}
{{ user.nom|default('Nom') }}
{{ user.email|default('email@example.com') }}
{{ user.type_utilisateur }} {# famille|vendeur|donateur #}

{# Variables spécifiques #}
{{ solde|default('€45.20') }} {# Solde famille #}
{{ stats.ventes_jour|default('8') }} {# Stats vendeur #}
{{ total_dons|default('€450.75') }} {# Total donateur #}

{# Variables système #}
{{ user_type }} {# Pour navigation: famille|vendeur|donateur #}
{{ hide_navigation|default(false) }} {# Masquer nav #}
{{ show_bottom_navigation|default(false) }} {# Nav du bas #}
```

## Couleurs personnalisées

```css
app-pink: #FF6B9D
app-purple: #9B59B6
app-blue: #3498DB
```

## Notes d'implémentation

- Tous les templates utilisent des données d'exemple statiques
- Les formulaires pointent vers des routes à implémenter
- JavaScript minimal pour toggles (mot de passe, etc.)
- Prêt pour intégration avec Symfony + API Platform
- Structure modulaire et maintenable
