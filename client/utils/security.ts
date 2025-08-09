// Security utilities for input validation and sanitization

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Le mot de passe doit contenir au moins 8 caractères" };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre minuscule" };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre majuscule" };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre" };
  }
  
  return { valid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

export const validateName = (name: string): boolean => {
  const sanitized = sanitizeInput(name);
  return sanitized.length >= 2 && sanitized.length <= 50;
};

export const validatePhone = (phone: string): boolean => {
  // French phone number validation
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isStrongPassword = (password: string): boolean => {
  return validatePassword(password).valid;
};

// Rate limiting utilities
export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  return true;
};

export const recordAttempt = (key: string): void => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  attempts.push(now);
  
  // Keep only the last 10 attempts
  const recentAttempts = attempts.slice(-10);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
};

export const clearRateLimit = (key: string): void => {
  localStorage.removeItem(`rate_limit_${key}`);
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Content Security Policy helpers
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
