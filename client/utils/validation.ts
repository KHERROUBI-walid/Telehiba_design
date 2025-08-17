import { z } from "zod";

// ===== VALIDATION SCHEMAS =====

// Base schemas
export const emailSchema = z
  .string()
  .email("Format d'email invalide")
  .min(1, "Email requis")
  .max(180, "Email trop long");

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(100, "Mot de passe trop long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
  );

export const nameSchema = z
  .string()
  .min(2, "Minimum 2 caractères")
  .max(50, "Maximum 50 caractères")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides dans le nom");

export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^(?:\+33|0)[1-9](?:[0-9]{8})$/.test(val), {
    message: "Format de téléphone français invalide",
  });

export const postalCodeSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^[0-9]{5}$/.test(val), {
    message: "Code postal invalide (5 chiffres requis)",
  });

export const sirenSchema = z
  .number()
  .optional()
  .refine((val) => !val || (val >= 100000000 && val <= 999999999), {
    message: "Numéro SIREN invalide (9 chiffres)",
  });

// ===== USER SCHEMAS =====

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nom: nameSchema,
  prenom: nameSchema,
  type_utilisateur: z.enum(["famille", "vendeur", "donateur"], {
    errorMap: () => ({ message: "Type d'utilisateur invalide" }),
  }),
  civilite: z.enum(["M.", "Mme", "Mlle"]).optional(),
  telephone: phoneSchema,
  adresse: z.string().max(150, "Adresse trop longue").optional(),
  compl_adresse: z
    .string()
    .max(50, "Complément d'adresse trop long")
    .optional(),
  code_postal: postalCodeSchema,
  ville: z
    .string()
    .min(2, "Ville requise")
    .max(70, "Nom de ville trop long")
    .optional(),
  pays: z.string().max(70, "Nom de pays trop long").optional(),

  // Champs spécifiques famille
  nombre_membres: z
    .number()
    .min(1, "Au moins 1 membre")
    .max(20, "Maximum 20 membres")
    .optional(),
  revenu_mensuel: z
    .number()
    .min(0, "Revenu ne peut pas être négatif")
    .optional(),

  // Champs spécifiques vendeur
  nom_societe: z
    .string()
    .min(2, "Nom de société requis")
    .max(50, "Nom trop long")
    .optional(),
  siren: sirenSchema,

  // Champs spécifiques donateur
  est_anonyme: z.boolean().optional(),
});

// ===== PRODUCT SCHEMAS =====

export const productSchema = z.object({
  nom_produit: z
    .string()
    .min(2, "Nom de produit requis")
    .max(70, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, "Caractères invalides"),
  description: z.string().max(200, "Description trop longue").optional(),
  prix: z
    .number()
    .min(0.01, "Prix doit être positif")
    .max(9999.99, "Prix trop élevé"),
  quantite_dispo: z.number().min(0, "Quantité ne peut pas être négative"),
  est_disponible: z.boolean(),
  image_url: z.string().url("URL d'image invalide").optional(),
  categorie_id: z.number().positive("Catégorie requise"),
  vendeur_id: z.number().positive("Vendeur requis"),
});

export const categorySchema = z.object({
  nom_categorie: z
    .string()
    .min(2, "Nom de catégorie requis")
    .max(70, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides"),
});

// ===== ORDER SCHEMAS =====

export const orderSchema = z.object({
  famille_id: z.number().positive("Famille requise"),
  items: z
    .array(
      z.object({
        produit_id: z.number().positive("Produit requis"),
        quantite: z
          .number()
          .min(1, "Quantité minimum 1")
          .max(100, "Quantité maximum 100"),
        prix_unitaire: z.number().min(0.01, "Prix unitaire requis"),
      }),
    )
    .min(1, "Au moins un produit requis"),
});

// ===== EVALUATION SCHEMAS =====

export const evaluationSchema = z.object({
  note: z.number().min(1, "Note minimum 1").max(5, "Note maximum 5"),
  commentaire: z.string().max(255, "Commentaire trop long").optional(),
  famille_id: z.number().positive("Famille requise"),
  vendeur_id: z.number().positive("Vendeur requis"),
});

// ===== NOTIFICATION SCHEMAS =====

export const notificationSchema = z.object({
  message: z.string().min(1, "Message requis").max(255, "Message trop long"),
  type: z.string().min(1, "Type requis").max(50, "Type trop long"),
  user_id: z.number().positive("Utilisateur requis"),
});

// ===== SEARCH AND FILTER SCHEMAS =====

export const searchSchema = z.object({
  q: z.string().min(1, "Terme de recherche requis").max(100, "Terme trop long"),
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});

export const filterSchema = z.object({
  search: z.string().max(100, "Recherche trop longue").optional(),
  category: z.string().max(50, "Catégorie invalide").optional(),
  city: z.string().max(70, "Ville invalide").optional(),
  vendor: z.number().positive().optional(),
  minPrice: z.number().min(0, "Prix minimum invalide").optional(),
  maxPrice: z.number().min(0, "Prix maximum invalide").optional(),
  available: z.boolean().optional(),
});

// ===== VALIDATION UTILITIES =====

export type ValidationError = {
  field: string;
  message: string;
};

export class ValidationResult<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public errors?: ValidationError[],
  ) {}

  static success<T>(data: T): ValidationResult<T> {
    return new ValidationResult(true, data);
  }

  static error<T>(errors: ValidationError[]): ValidationResult<T> {
    return new ValidationResult(false, undefined, errors);
  }
}

export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  try {
    const validData = schema.parse(data);
    return ValidationResult.success(validData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return ValidationResult.error(errors);
    }
    return ValidationResult.error([
      { field: "unknown", message: "Erreur de validation inconnue" },
    ]);
  }
}

// ===== SANITIZATION UTILITIES =====

export class Sanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>'"]/g, "") // Remove potential XSS characters
      .replace(/\s+/g, " "); // Normalize whitespace
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/\s/g, "").replace(/[^\d+]/g, "");
  }

  static sanitizeNumber(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value.replace(",", "."));
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  static sanitizeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      // Only allow http/https protocols
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }
}

// ===== SECURITY UTILITIES =====

export class SecurityUtils {
  static isValidJWT(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp > now;
    } catch {
      return false;
    }
  }

  static sanitizeForStorage(data: any): any {
    if (typeof data === "string") {
      return Sanitizer.sanitizeString(data);
    }
    if (typeof data === "object" && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeForStorage(value);
      }
      return sanitized;
    }
    return data;
  }

  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) return false;
    return token === expectedToken;
  }
}

// ===== RATE LIMITING =====

export class RateLimiter {
  private static attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  static checkRateLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000,
  ): { allowed: boolean; remainingTime?: number } {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now - attempt.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return { allowed: true };
    }

    if (attempt.count >= maxAttempts) {
      const remainingTime = windowMs - (now - attempt.lastAttempt);
      return { allowed: false, remainingTime };
    }

    attempt.count++;
    attempt.lastAttempt = now;
    return { allowed: true };
  }

  static resetRateLimit(key: string): void {
    this.attempts.delete(key);
  }
}

// Export all schemas for easy import
export const schemas = {
  login: loginSchema,
  register: registerSchema,
  product: productSchema,
  category: categorySchema,
  order: orderSchema,
  evaluation: evaluationSchema,
  notification: notificationSchema,
  search: searchSchema,
  filter: filterSchema,
};
