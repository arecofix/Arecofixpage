import { Injectable, inject, PLATFORM_ID, signal, computed, effect, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'arecofix-theme-mode';

/**
 * ThemeService
 *
 * Handles light/dark mode with three priorities:
 *   1. User's explicit manual choice (persisted in localStorage)
 *   2. OS-level `prefers-color-scheme` media query
 *   3. Fallback to dark mode
 *
 * Architecture:
 *   - `mode` signal holds the raw selection ('light' | 'dark' | 'system')
 *   - `resolvedTheme` computed resolves 'system' into the actual OS preference
 *   - An `effect` applies the `.dark` class on <html> and persists the choice
 *   - A MediaQueryList listener reacts to OS-level theme changes in real time
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private mediaQuery: MediaQueryList | null = null;
  private mediaListener: ((e: MediaQueryListEvent) => void) | null = null;

  /** Raw user preference: 'light' | 'dark' | 'system' */
  readonly mode = signal<ThemeMode>(this.loadInitialMode());

  /** Whether OS currently prefers dark */
  readonly osDark = signal<boolean>(this.detectOsDark());

  /** The resolved theme that should be applied */
  readonly resolvedTheme = computed<'light' | 'dark'>(() => {
    const m = this.mode();
    if (m === 'system') return this.osDark() ? 'dark' : 'light';
    return m;
  });

  /** Convenience boolean for templates */
  readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  constructor() {
    // Listen for OS-level theme changes
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaListener = (e: MediaQueryListEvent) => this.osDark.set(e.matches);
      this.mediaQuery.addEventListener('change', this.mediaListener);
    }

    // React to resolved theme changes → apply DOM class + persist
    effect(() => {
      const theme = this.resolvedTheme();
      const rawMode = this.mode();
      this.applyTheme(theme);
      this.persistMode(rawMode);
    });
  }

  // ── Public API ──────────────────────────────────────

  /** Set theme mode explicitly */
  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  /** Toggle between light ↔ dark (skips system) */
  toggle(): void {
    this.mode.set(this.isDark() ? 'light' : 'dark');
  }

  /** Cycle through: system → light → dark → system */
  cycle(): void {
    const current = this.mode();
    const next: ThemeMode = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
    this.mode.set(next);
  }

  // ── Private Helpers ─────────────────────────────────

  private loadInitialMode(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) return 'dark';

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) return stored;

    // No stored preference → use 'system' to respect OS setting
    return 'system';
  }

  private detectOsDark(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  }

  private persistMode(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(STORAGE_KEY, mode);
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
      this.mediaQuery = null;
      this.mediaListener = null;
    }
  }
}
