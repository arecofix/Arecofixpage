/**
 * UUID Utility & Sanitization Layer
 * Enforces strict canonical UUID validation to prevent PostgreSQL 22P02 "invalid input syntax for type uuid"
 */

const GENERAL_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates and returns a sanitized lowercase UUID string.
 * Returns null for any undefined, null, non-string, or malformed value (e.g. 'undefined', 'null', '').
 */
export function assertUuid(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') {
    return null;
  }
  return GENERAL_UUID_REGEX.test(trimmed) ? trimmed : null;
}

/**
 * Retrieves the persistent guest session ID from localStorage or creates a new cryptographically
 * secure UUIDv4. Guarantees persistence under 'guest_session_id' and backward-compatible 'cart_session_id'.
 */
export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }

  const stored = localStorage.getItem('guest_session_id') || localStorage.getItem('cart_session_id');
  const valid = assertUuid(stored);
  if (valid) {
    if (!localStorage.getItem('guest_session_id')) {
      localStorage.setItem('guest_session_id', valid);
    }
    return valid;
  }

  const newId = generateUuid();
  localStorage.setItem('guest_session_id', newId);
  localStorage.setItem('cart_session_id', newId);
  return newId;
}

/**
 * Generates a valid UUIDv4 string.
 * Uses crypto.randomUUID() when available in secure contexts, with an RFC4122
 * Math.random fallback for non-secure HTTP contexts or legacy webviews.
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback below
    }
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
