// Test temporaire pour vérifier que les types sont cohérents
import { User, ROLE_MAPPING } from "./client/types/api";

// Test d'un utilisateur famille
const familleUser: User = {
  '@type': 'User',
  id: 1,
  email: 'test@example.com',
  roles: ['ROLE_FAMILLE'],
  type_utilisateur: 'famille',
  nom: 'Dupont',
  prenom: 'Jean',
  civilite: 'M.',
  ville: 'Paris',
  pays: 'France',
  statut: 'actif',
  date_creation: '2025-01-01T00:00:00Z',
  date_mise_ajour: '2025-01-01T00:00:00Z',
  is_verified: true
};

// Test d'un utilisateur vendeur
const vendeurUser: User = {
  '@type': 'User',
  id: 2,
  email: 'vendeur@example.com',
  roles: ['ROLE_VENDEUR'],
  type_utilisateur: 'vendeur',
  nom: 'Martin',
  prenom: 'Paul',
  civilite: 'M.',
  ville: 'Lyon',
  pays: 'France',
  statut: 'actif',
  date_creation: '2025-01-01T00:00:00Z',
  date_mise_ajour: '2025-01-01T00:00:00Z',
  is_verified: true
};

// Test du mapping des rôles
console.log('Famille role mapping:', ROLE_MAPPING[familleUser.type_utilisateur]);
console.log('Vendeur role mapping:', ROLE_MAPPING[vendeurUser.type_utilisateur]);

export { familleUser, vendeurUser };
