/**
 * Navigation Data Model
 *
 * Recursive structure supporting unlimited nesting levels.
 * Each item can be tagged with a `theme` to visually group
 * items by business vertical (Tienda, Software, Academia).
 */

export type NavTheme = 'tienda' | 'software' | 'academia' | 'general';

export interface NavItem {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Router link path (null for section headers) */
  path: string | null;

  /** FontAwesome icon class */
  icon: string;

  /** Business vertical tag */
  theme: NavTheme;

  /** Short description for mega menu */
  description?: string;

  /** Badge text (e.g. "Nuevo", "Hot") */
  badge?: string;

  /** Recursive children */
  children?: NavItem[];

  /** Whether this item is only shown in mobile */
  mobileOnly?: boolean;

  /** External URL (opens new tab) */
  external?: boolean;
}
