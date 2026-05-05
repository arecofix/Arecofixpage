import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Product } from '@app/public/products/interfaces';

/**
 * Servicio de Estrategia de UX y Ventas B2B/B2C.
 * Centraliza la lógica de conversión, visualización de precios y
 * políticas comerciales según la categoría del producto.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductStrategicService {
  private authService = inject(AuthService);

  /**
   * Determina si un producto pertenece a la categoría de Repuestos/Microelectrónica.
   */
  isTechnicalCategory(product: Product): boolean {
    const lowerName = (product.name || '').toLowerCase();
    const lowerCat = (product.category_name || '').toLowerCase();
    
    const technicalKeywords = [
      'repuesto', 'módulo', 'modulo', 'pantalla', 'batería', 'bateria',
      'cámara', 'camara', 'pin de carga', 'flex', 'tapa', 'ic ', 
      'microelectronica', 'herramientas', 'soldar', 'flux'
    ];

    return technicalKeywords.some(key => lowerName.includes(key)) || 
           lowerCat.includes('repuestos') || 
           lowerCat.includes('microelectronica') ||
           lowerCat.includes('herramientas');
  }

  /**
   * Verifica si el usuario actual tiene permisos de Gremio o superior.
   */
  isWholesaleAuthorized(): boolean {
    const profile = this.authService.getCurrentProfile();
    if (!profile) return false;
    const allowedRoles = ['gremio', 'tecnico', 'admin', 'super_admin'];
    return allowedRoles.includes(profile.role?.toLowerCase() || '');
  }

  /**
   * REGLAS DE NEGOCIO ESTRATÉGICAS:
   * 1. Repuestos: Solo Gremio/Técnicos pueden ver precios y comprar.
   * 2. Accesorios/Retail: Abierto a todo el público.
   */
  canViewPriceAndBuy(product: Product): boolean {
    if (this.isTechnicalCategory(product)) {
      return this.isWholesaleAuthorized();
    }
    return true;
  }

  /**
   * Muestra si se debe presentar el "Gate" de autenticación para técnicos.
   */
  shouldShowWholesaleGate(product: Product): boolean {
    return this.isTechnicalCategory(product) && !this.isWholesaleAuthorized();
  }

  /**
   * Propuesta de valor o disclaimer estratégico.
   */
  getValueProposition(product: Product): string {
    if (this.isTechnicalCategory(product)) {
      return 'Precios promocionales válidos únicamente para pedidos realizados y autogestionados a través de la plataforma web.';
    }
    return 'Descuento exclusivo online aplicado. Comprando por la web garantizás el mejor precio.';
  }

  /**
   * Visibilidad de Favoritos (Wishlist).
   * Para categorías técnicas, solo visible si el usuario está autenticado.
   */
  canShowWishlist(product: Product): boolean {
    if (this.isTechnicalCategory(product)) {
      return !!this.authService.getCurrentProfile();
    }
    return true;
  }
}
