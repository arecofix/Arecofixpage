import {
  isPlatformBrowser
} from "./chunk-3EP36GV6.js";
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-TQTEFGZE.js";

// src/app/core/services/theme.service.ts
var STORAGE_KEY = "arecofix-theme-mode";
var ThemeService = class _ThemeService {
  platformId = inject(PLATFORM_ID);
  mediaQuery = null;
  mediaListener = null;
  /** Raw user preference: 'light' | 'dark' | 'system' */
  mode = signal(this.loadInitialMode(), ...ngDevMode ? [{ debugName: "mode" }] : []);
  /** Whether OS currently prefers dark */
  osDark = signal(this.detectOsDark(), ...ngDevMode ? [{ debugName: "osDark" }] : []);
  /** The resolved theme that should be applied */
  resolvedTheme = computed(() => {
    const m = this.mode();
    if (m === "system")
      return this.osDark() ? "dark" : "light";
    return m;
  }, ...ngDevMode ? [{ debugName: "resolvedTheme" }] : []);
  /** Convenience boolean for templates */
  isDark = computed(() => this.resolvedTheme() === "dark", ...ngDevMode ? [{ debugName: "isDark" }] : []);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaListener = (e) => this.osDark.set(e.matches);
      this.mediaQuery.addEventListener("change", this.mediaListener);
    }
    effect(() => {
      const theme = this.resolvedTheme();
      const rawMode = this.mode();
      this.applyTheme(theme);
      this.persistMode(rawMode);
    });
  }
  // ── Public API ──────────────────────────────────────
  /** Set theme mode explicitly */
  setMode(mode) {
    this.mode.set(mode);
  }
  /** Toggle between light ↔ dark (skips system) */
  toggle() {
    this.mode.set(this.isDark() ? "light" : "dark");
  }
  /** Cycle through: system → light → dark → system */
  cycle() {
    const current = this.mode();
    const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
    this.mode.set(next);
  }
  // ── Private Helpers ─────────────────────────────────
  loadInitialMode() {
    if (!isPlatformBrowser(this.platformId))
      return "dark";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["light", "dark", "system"].includes(stored))
      return stored;
    return "system";
  }
  detectOsDark() {
    if (!isPlatformBrowser(this.platformId))
      return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme(theme) {
    if (!isPlatformBrowser(this.platformId))
      return;
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.setAttribute("data-theme", "dark");
    } else {
      html.classList.remove("dark");
      html.setAttribute("data-theme", "light");
    }
  }
  persistMode(mode) {
    if (!isPlatformBrowser(this.platformId))
      return;
    localStorage.setItem(STORAGE_KEY, mode);
  }
  ngOnDestroy() {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener("change", this.mediaListener);
      this.mediaQuery = null;
      this.mediaListener = null;
    }
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  ThemeService
};
//# sourceMappingURL=chunk-WEDM36GW.js.map
