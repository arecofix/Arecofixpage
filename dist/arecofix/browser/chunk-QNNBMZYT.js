import {
  isPlatformBrowser
} from "./chunk-WHLM5VZW.js";
import {
  BehaviorSubject,
  Injectable,
  PLATFORM_ID,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XQFVERLD.js";

// src/app/shared/services/preferences.service.ts
var PreferencesService = class _PreferencesService {
  platformId = inject(PLATFORM_ID);
  languageSubject = new BehaviorSubject("es");
  language$ = this.languageSubject.asObservable();
  themeSubject = new BehaviorSubject("gradient-5");
  theme$ = this.themeSubject.asObservable();
  fontSizeSubject = new BehaviorSubject(16);
  fontSize$ = this.fontSizeSubject.asObservable();
  highContrastSubject = new BehaviorSubject(false);
  highContrast$ = this.highContrastSubject.asObservable();
  sidebarOpenSubject = new BehaviorSubject(false);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  backgroundOptions = [
    { id: "gradient-5", name: "Dark Gray", class: "bg-gradient-to-br from-gray-900 via-gray-800 to-black", isDark: true },
    { id: "gradient-1", name: "Blue Gradient", class: "bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900", isDark: true },
    { id: "light", name: "Light Mode", class: "bg-gray-50", isDark: false }
  ];
  constructor() {
    this.loadPreferences();
  }
  getBackgroundClass(themeId) {
    const selected = this.backgroundOptions.find((bg) => bg.id === themeId);
    return selected?.class || this.backgroundOptions[0].class;
  }
  toggleSidebar() {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }
  closeSidebar() {
    this.sidebarOpenSubject.next(false);
  }
  setLanguage(lang) {
    this.languageSubject.next(lang);
    this.savePreference("portfolio-language", lang);
  }
  setTheme(themeId) {
    this.themeSubject.next(themeId);
    this.savePreference("portfolio-background", themeId);
    this.applyTheme(themeId);
  }
  increaseFontSize() {
    const current = this.fontSizeSubject.value;
    if (current < 24) {
      const newSize = current + 2;
      this.fontSizeSubject.next(newSize);
      this.savePreference("portfolio-font-size", newSize.toString());
    }
  }
  decreaseFontSize() {
    const current = this.fontSizeSubject.value;
    if (current > 12) {
      const newSize = current - 2;
      this.fontSizeSubject.next(newSize);
      this.savePreference("portfolio-font-size", newSize.toString());
    }
  }
  toggleHighContrast() {
    const newValue = !this.highContrastSubject.value;
    this.highContrastSubject.next(newValue);
    this.savePreference("portfolio-high-contrast", newValue.toString());
    this.applyHighContrast(newValue);
  }
  getCurrentLanguage() {
    return this.languageSubject.value;
  }
  getCurrentTheme() {
    return this.themeSubject.value;
  }
  savePreference(key, value) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }
  loadPreferences() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const savedLanguage = localStorage.getItem("portfolio-language");
    const savedBackground = localStorage.getItem("portfolio-background");
    const savedFontSize = localStorage.getItem("portfolio-font-size");
    const savedContrast = localStorage.getItem("portfolio-high-contrast");
    if (savedLanguage) {
      this.languageSubject.next(savedLanguage);
    }
    if (savedBackground) {
      this.themeSubject.next(savedBackground);
      this.applyTheme(savedBackground);
    } else {
      this.applyTheme(this.backgroundOptions[0].id);
    }
    if (savedFontSize) {
      this.fontSizeSubject.next(parseInt(savedFontSize, 10));
    }
    if (savedContrast) {
      const isHighContrast = savedContrast === "true";
      this.highContrastSubject.next(isHighContrast);
      this.applyHighContrast(isHighContrast);
    }
  }
  applyTheme(themeId) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const theme = this.backgroundOptions.find((t) => t.id === themeId) || this.backgroundOptions[0];
    if (theme.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const daisyTheme = theme.isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", daisyTheme);
  }
  applyHighContrast(isHighContrast) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }
  static \u0275fac = function PreferencesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PreferencesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PreferencesService, factory: _PreferencesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreferencesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  PreferencesService
};
//# sourceMappingURL=chunk-QNNBMZYT.js.map
