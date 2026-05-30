import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface FavoriteItem {
  title: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();
  private isBrowser: boolean;
  private readonly STORAGE_KEY = 'arecofix_favorites';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFavorites();
  }

  private loadFavorites() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.favoritesSubject.next(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    }
  }

  private saveFavorites(favorites: FavoriteItem[]) {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
    this.favoritesSubject.next(favorites);
  }

  public addFavorite(item: FavoriteItem) {
    const current = this.favoritesSubject.value;
    if (!current.find(f => f.url === item.url)) {
      this.saveFavorites([...current, item]);
    }
  }

  public removeFavorite(url: string) {
    const current = this.favoritesSubject.value;
    this.saveFavorites(current.filter(f => f.url !== url));
  }

  public toggleFavorite(item: FavoriteItem) {
    const current = this.favoritesSubject.value;
    if (current.find(f => f.url === item.url)) {
      this.removeFavorite(item.url);
    } else {
      this.addFavorite(item);
    }
  }

  public isFavorite(url: string): boolean {
    return !!this.favoritesSubject.value.find(f => f.url === url);
  }
}
