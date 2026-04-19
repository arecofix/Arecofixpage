import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type Language = 'en' | 'es';
export type Theme = 'gradient-1' | 'gradient-5'; // Add more as needed

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private lastWasAdmin = false;
  
  private languageSubject = new BehaviorSubject<Language>('es');
  language$ = this.languageSubject.asObservable();

  private themeSubject = new BehaviorSubject<string>('gradient-5');
  theme$ = this.themeSubject.asObservable();

  private fontSizeSubject = new BehaviorSubject<number>(16);
  fontSize$ = this.fontSizeSubject.asObservable();

  private highContrastSubject = new BehaviorSubject<boolean>(false);
  highContrast$ = this.highContrastSubject.asObservable();

  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  private forcedLightSubject = new BehaviorSubject<boolean>(false);
  forcedLight$ = this.forcedLightSubject.asObservable();

  readonly backgroundOptions = [
    { id: 'system', name: 'Sistema (Auto)', class: 'bg-gray-100 dark:bg-gray-800', isDark: false },
    { id: 'light', name: 'Modo Claro', class: 'bg-gray-50', isDark: false },
    { id: 'gradient-5', name: 'Modo Oscuro', class: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black', isDark: true }
  ];

  constructor() {
    this.loadPreferences();
    this.initAdminThemeListener();
  }

  private initAdminThemeListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      const isAdminPath = url.startsWith('/admin') || url.includes('/admin/');
      
      if (isAdminPath && !this.lastWasAdmin) {
        // Al ingresar al admin, forzar tema light por defecto si no es el actual
        if (this.themeSubject.value !== 'light') {
          this.setTheme('light');
        }
      } else if (!isAdminPath && this.lastWasAdmin) {
        // Al salir del admin, volver al tema del sistema por defecto
        this.setTheme('system');
      }
      this.lastWasAdmin = isAdminPath;
    });
  }

  getBackgroundClass(themeId: string): string {
    const selected = this.backgroundOptions.find(bg => bg.id === themeId);
    return selected?.class || this.backgroundOptions[0].class;
  }

  toggleSidebar(): void {
    const newState = !this.sidebarOpenSubject.value;
    this.sidebarOpenSubject.next(newState);
    this.toggleBodyScroll(newState);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
    this.toggleBodyScroll(false);
  }

  private toggleBodyScroll(lock: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (lock) {
      document.body.classList.add('overflow-hidden', 'touch-none');
    } else {
      document.body.classList.remove('overflow-hidden', 'touch-none');
    }
  }

  setLanguage(lang: Language): void {
    this.languageSubject.next(lang);
    this.savePreference('portfolio-language', lang);
  }

  setTheme(themeId: string): void {
    this.themeSubject.next(themeId);
    this.savePreference('portfolio-background', themeId);
    if (!this.forcedLightSubject.value) {
      this.applyTheme(themeId);
    }
  }

  setForceLight(force: boolean): void {
    this.forcedLightSubject.next(force);
    if (force) {
      this.applyTheme('light');
    } else {
      this.applyTheme(this.themeSubject.value);
    }
  }

  increaseFontSize(): void {
    const current = this.fontSizeSubject.value;
    if (current < 24) {
      const newSize = current + 2;
      this.fontSizeSubject.next(newSize);
      this.savePreference('portfolio-font-size', newSize.toString());
    }
  }

  decreaseFontSize(): void {
    const current = this.fontSizeSubject.value;
    if (current > 12) {
      const newSize = current - 2;
      this.fontSizeSubject.next(newSize);
      this.savePreference('portfolio-font-size', newSize.toString());
    }
  }

  toggleHighContrast(): void {
    const newValue = !this.highContrastSubject.value;
    this.highContrastSubject.next(newValue);
    this.savePreference('portfolio-high-contrast', newValue.toString());
    this.applyHighContrast(newValue);
  }

  getCurrentLanguage(): Language {
    return this.languageSubject.value;
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }

  private savePreference(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private loadPreferences(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedLanguage = localStorage.getItem('portfolio-language') as Language | null;
    const savedBackground = localStorage.getItem('portfolio-background');
    const savedFontSize = localStorage.getItem('portfolio-font-size');
    const savedContrast = localStorage.getItem('portfolio-high-contrast');

    if (savedLanguage) {
      this.languageSubject.next(savedLanguage);
    }
    if (savedBackground && this.backgroundOptions.find(o => o.id === savedBackground)) {
      this.themeSubject.next(savedBackground);
      this.applyTheme(savedBackground);
    } else {
      // Default to first theme (System)
      this.themeSubject.next('system');
      this.applyTheme('system');
    }
    if (savedFontSize) {
      this.fontSizeSubject.next(parseInt(savedFontSize, 10));
    }
    if (savedContrast) {
      const isHighContrast = savedContrast === 'true';
      this.highContrastSubject.next(isHighContrast);
      this.applyHighContrast(isHighContrast);
    }
  }

  private applyTheme(themeId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (themeId === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setThemeDOM(isDark);
      return;
    }

    const theme = this.backgroundOptions.find(t => t.id === themeId) || this.backgroundOptions[0];
    this.setThemeDOM(theme.isDark);
  }

  private setThemeDOM(isDark: boolean): void {
    // Toggle .dark class for Tailwind @custom-variant
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set data-theme for DaisyUI (and semantic colors)
    const daisyTheme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', daisyTheme);
  }

  private applyHighContrast(isHighContrast: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }
}
