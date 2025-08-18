# ⏱️ Corrections Timeout API & Headers

## 🐛 Problème Initial

```
Login error: Error: Timeout: Requête trop lente
```

L'API répond (status 200 OK), mais les requêtes de login dépassaient le timeout de 10 secondes.

## ✅ Corrections Appliquées

### 1. **Timeout Augmenté et Configurable**

```typescript
// ❌ Avant : Timeout fixe de 10 secondes
setTimeout(() => controller.abort(), 10000);

// ✅ Après : Timeout configurable par requête
private async makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = 20000, // 20s par défaut
): Promise<ApiResponse<T>>

setTimeout(() => controller.abort(), timeoutMs);
```

### 2. **Timeouts Spécifiques par Type de Requête**

#### **Login** - 30 secondes

```typescript
const response = await this.makeRequest<AuthResponse>(
  "/login_check",
  {
    method: "POST",
    body: JSON.stringify(sanitizedCredentials),
  },
  30000, // 30 secondes pour le login
);
```

#### **Inscription** - 30 secondes

```typescript
const response = await this.makeRequest<AuthResponse>(
  "/users",
  {
    method: "POST",
    body: JSON.stringify({...}),
  },
  30000 // 30 secondes pour l'inscription
);
```

#### **Autres requêtes** - 20 secondes par défaut

Toutes les autres requêtes utilisent le timeout par défaut de 20 secondes.

### 3. **Headers Content-Type Garantis**

#### ✅ **Vérification Headers**

La requête de login **utilise bien** `Content-Type: application/json` :

```typescript
// Headers par défaut appliqués à toutes les requêtes
private getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",  // ✅ PRÉSENT
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  // ...
}
```

#### ✅ **Protection contre l'écrasement**

```typescript
// ❌ Avant : Les options pouvaient écraser les headers
const config: RequestInit = {
  headers: this.getAuthHeaders(),
  ...options, // ⚠️ Pouvait écraser headers
};

// ✅ Après : Fusion intelligente des headers
const config: RequestInit = {
  ...options,
  headers: {
    ...this.getAuthHeaders(), // Headers par défaut
    ...(options.headers || {}), // Headers spécifiques préservés
  },
};
```

### 4. **Logging Amélioré**

```typescript
console.log("🌐 API Request:", {
  url,
  method: config.method || "GET",
  timeout: timeoutMs, // ✅ Timeout affiché
  headers: config.headers, // ✅ Headers vérifiables
  hasBody: !!config.body, // ✅ Présence du body
});
```

## 🎯 Résultat

### ✅ **Timeouts Appropriés**

- **Login/Inscription** : 30 secondes (operations lentes)
- **API générale** : 20 secondes (au lieu de 10s)
- **Configurable** par requête

### ✅ **Headers Garantis**

- `Content-Type: application/json` toujours présent
- Protection contre l'écrasement accidentel
- Logging détaillé pour débogage

### ✅ **Robustesse**

- Plus de timeouts prématurés
- Headers cohérents sur toutes les requêtes
- Debugging facilité avec logs étendus

## 🚀 Test

Pour vérifier que les headers sont bien envoyés, consultez la console du navigateur :

```javascript
🌐 API Request: {
  url: "/api/login_check",
  method: "POST",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",  // ✅ Présent
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  hasBody: true
}
```

**⚡ Les requêtes de login ne devraient plus dépasser le timeout !**
