import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  is_active: boolean;
  global_markup_percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private auth = inject(AuthService);

  /**
   * Obtiene la información completa de una sucursal basándose en su slug
   */
  async getBranchBySlug(slug: string): Promise<Branch | null> {
    if (!slug) return null;
    
    // Lista de palabras reservadas para evitar consultas innecesarias y errores 406
    const reservedSlugs = [
      'admin', 'login', 'register', 'perfil', 'nosotros', 'contacto', 
      'servicios', 'academy', 'checkout', 'posts', 'tracking', 'blog', 
      'portfolio', 'productos', 'categories', 'repuestos', 'gsm', 'fixtecnicos', 'recursos',
      'api', 'static', 'assets'
    ];
    
    if (reservedSlugs.includes(slug.toLowerCase())) {
      return null;
    }

    const supabase = this.auth.getSupabaseClient();
    const { data: branch, error } = await supabase
      .from('branches')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !branch) {
      return null;
    }
    return branch as Branch;
  }

  /**
   * Obtiene todos los productos aplicables a una sucursal, aplicando el margen de 
   * reventa para aquellos productos globales que vengan de la central.
   */
  async getBranchCatalog(branchId: string, globalMarkup: number): Promise<Product[]> {
    const supabase = this.auth.getSupabaseClient();
    
    // Consulta optimizada aprovechando RLS (que permite leer lo local y lo global)
    // Para simplificar y asegurar performance, filtramos directamente.
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`branch_id.eq.${branchId},is_global.eq.true`);

    if (error || !products) {
      return [];
    }

    return this.applyMarkupMapping(products as Product[], branchId, globalMarkup);
  }

  /**
   * Mapea un array de productos, alterando su precio si el producto es global
   * y no le pertenece nativamente a esta sucursal (reventa).
   */
  public applyMarkupMapping(products: Product[], currentBranchId: string, markupPercentage: number): Product[] {
    return products.map(product => {
      // Si el producto pertenece a la sucursal actual (fue creado por un admin de ahí),
      // no le aplicamos markup. Lo respeta crudo.
      // Si el producto es global (Central) y no fue creado en esta sucursal, lo re-cotizamos.
      if (product.is_global && product.branch_id !== currentBranchId && markupPercentage > 0) {
        const multiplier = 1 + (markupPercentage / 100);
        return {
          ...product,
          price: product.price * multiplier,
          sale_price: product.sale_price ? product.sale_price * multiplier : undefined
        };
      }
      return product;
    });
  }
}
