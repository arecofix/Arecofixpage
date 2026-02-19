import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '@app/shared/interfaces/product.interface'; 
import { LoggerService } from '@app/core/services/logger.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private logger = inject(LoggerService);
    private toastService = inject(ToastService);
    private platformId = inject(PLATFORM_ID);
    
    // Store array of products
    favorites = signal<Product[]>([]);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load favorites from local storage
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) {
                try {
                    this.favorites.set(JSON.parse(savedFavorites));
                } catch (e) {
                    console.error('Error parsing favorites', e);
                    this.favorites.set([]);
                }
            }
        }

        // Persist to local storage
        effect(() => {
            const currentFavorites = this.favorites();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('favorites', JSON.stringify(currentFavorites));
            }
        });
    }

    toggleFavorite(product: Product) {
        const exists = this.isFavorite(product.id);
        if (exists) {
            this.removeFavorite(product.id);
        } else {
            this.addFavorite(product);
        }
    }

    addFavorite(product: Product) {
        this.favorites.update(items => {
            if (items.some(i => i.id === product.id)) return items;
            return [...items, product];
        });
        this.logger.debug('Product added to favorites', { productName: product.name });
        this.toastService.show('Agregado a favoritos', 'success');
    }

    removeFavorite(productId: string) {
        this.favorites.update(items => items.filter(i => i.id !== productId));
        this.logger.debug('Product removed from favorites', { productId });
        this.toastService.show('Eliminado de favoritos', 'info');
    }

    isFavorite(productId: string): boolean {
        return this.favorites().some(p => p.id === productId);
    }
    
    // Helper signal to check reactive status inside templates easily if needed, 
    // though calling isFavorite() in a computed or effect is common.
    // For templates, we might use a method or a pipe, but signals are fine.
}
