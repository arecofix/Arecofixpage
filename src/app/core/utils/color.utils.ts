/**
 * Color utility functions for input validation and normalization.
 */

/**
 * Validates and normalizes a CSS color string to ensure HTML5 <input type="color"> compliance (#RRGGBB).
 * If the input is not a valid 3-digit or 6-digit hex color, returns the provided fallback.
 *
 * @param color Candidate color string (e.g., from DB or user input)
 * @param fallback Safe default hex color conforming to HTML5 specification (default: #000000)
 * @returns Standard 7-character lowercase hex color (#RRGGBB)
 */
export function sanitizeHexColor(color: string | null | undefined, fallback: string = '#000000'): string {
  if (!color || typeof color !== 'string') {
    return fallback;
  }

  const trimmed = color.trim().toLowerCase();

  // Standard 6-digit hex (#rrggbb)
  if (/^#[0-9a-f]{6}$/.test(trimmed)) {
    return trimmed;
  }

  // 3-digit shorthand hex (#rgb -> #rrggbb)
  if (/^#[0-9a-f]{3}$/.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
  }

  // 6-digit hex without leading '#'
  if (/^[0-9a-f]{6}$/.test(trimmed)) {
    return `#${trimmed}`;
  }

  // 3-digit hex without leading '#'
  if (/^[0-9a-f]{3}$/.test(trimmed)) {
    return `#${trimmed[0]}${trimmed[0]}${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}`;
  }

  return fallback;
}
