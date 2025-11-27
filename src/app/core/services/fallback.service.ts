import { Injectable } from '@angular/core';
import { iProduct } from '@app/public/products/interfaces';

@Injectable({
    providedIn: 'root'
})
export class FallbackService {

    private readonly fallbackProducts: iProduct[] = [
        {
            id: '1001',
            category_id: 0,
            slug: 'joystick-play-station-4',
            name: 'Joystick Play Station 4',
            description: 'En venta Joystick nuevo de play station 4 DUALSHOCK',
            price: 29800,
            featured: true,
            image_url: 'assets/img/products/joystick-ps4-v2.webp'
        },
        {
            id: '1002',
            category_id: 0,
            slug: 'iphone-8-plus',
            name: 'iPhone 8 Plus',
            description: 'En venta iPhone 8 Plus vidrio astillado no afecta su uso',
            price: 96000,
            featured: true,
            image_url: 'assets/img/products/iph8plus.webp'
        },
        {
            id: '1003',
            category_id: 0,
            slug: 'iphone-x',
            name: 'iPhone X',
            description: 'En venta celular iphone x a wifi',
            price: 149000,
            featured: true,
            image_url: 'assets/img/products/iphx.webp'
        }
    ];

    getFallbackProduct(slug: string): iProduct | undefined {
        return this.fallbackProducts.find(p => p.slug === slug);
    }

    getAllFallbackProducts(): iProduct[] {
        return [...this.fallbackProducts];
    }

    isFallbackProduct(slug: string): boolean {
        return this.fallbackProducts.some(p => p.slug === slug);
    }
}
