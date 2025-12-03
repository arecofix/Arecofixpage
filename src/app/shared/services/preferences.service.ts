import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'es';
export type Theme = 'gradient-1' | 'gradient-5'; // Add more as needed

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
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

  readonly backgroundOptions = [
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black', isDark: true },
    { id: 'gradient-1', name: 'Blue Gradient', class: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900', isDark: true },
    { id: 'light', name: 'Light Mode', class: 'bg-gray-50', isDark: false }
  ];

  constructor() {
    this.loadPreferences();
  }

  getBackgroundClass(themeId: string): string {
    const selected = this.backgroundOptions.find(bg => bg.id === themeId);
    return selected?.class || this.backgroundOptions[0].class;
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  setLanguage(lang: Language): void {
    this.languageSubject.next(lang);
    this.savePreference('portfolio-language', lang);
  }

  setTheme(themeId: string): void {
    this.themeSubject.next(themeId);
    this.savePreference('portfolio-background', themeId);
    this.applyTheme(themeId);
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
    localStorage.setItem(key, value);
  }

  private loadPreferences(): void {
    const savedLanguage = localStorage.getItem('portfolio-language') as Language | null;
    const savedBackground = localStorage.getItem('portfolio-background');
    const savedFontSize = localStorage.getItem('portfolio-font-size');
    const savedContrast = localStorage.getItem('portfolio-high-contrast');

    if (savedLanguage) {
      this.languageSubject.next(savedLanguage);
    }
    if (savedBackground) {
      this.themeSubject.next(savedBackground);
      this.applyTheme(savedBackground);
    } else {
      // Default to first theme (Dark Gray)
      this.applyTheme(this.backgroundOptions[0].id);
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
    const theme = this.backgroundOptions.find(t => t.id === themeId) || this.backgroundOptions[0];
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private applyHighContrast(isHighContrast: boolean): void {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }
}
