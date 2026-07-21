import { Injectable, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface FavoriteItem {
  title: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  public favorites = signal<FavoriteItem[]>([]);
  private isBrowser: boolean;
  private readonly STORAGE_KEY = 'arecofix_favorites';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFavorites();

    // Persist to local storage automatically when the signal changes
    effect(() => {
      const current = this.favorites();
      if (this.isBrowser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
      }
    });
  }

  private loadFavorites() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.favorites.set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    }
  }

  public addFavorite(item: FavoriteItem) {
    this.favorites.update(current => {
      if (!current.find(f => f.url === item.url)) {
        return [...current, item];
      }
      return current;
    });
  }

  public removeFavorite(url: string) {
    this.favorites.update(current => current.filter(f => f.url !== url));
  }

  public toggleFavorite(item: FavoriteItem) {
    if (this.isFavorite(item.url)) {
      this.removeFavorite(item.url);
    } else {
      this.addFavorite(item);
    }
  }

  public isFavorite(url: string): boolean {
    return !!this.favorites().find(f => f.url === url);
  }
}
