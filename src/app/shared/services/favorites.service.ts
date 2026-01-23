import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { Product } from '@app/shared/interfaces/product.interface'; // Using the entity path seen in previous steps or metadata
import { LoggerService } from '@app/core/services/logger.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private logger = inject(LoggerService);
    private toastService = inject(ToastService);
    
    // Store array of products
    favorites = signal<Product[]>([]);

    constructor() {
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

        // Persist to local storage
        effect(() => {
            localStorage.setItem('favorites', JSON.stringify(this.favorites()));
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
