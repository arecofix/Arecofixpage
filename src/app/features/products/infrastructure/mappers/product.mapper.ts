import { Product } from '../../domain/entities/product.entity';
import { environment } from '@env/environment';

export class ProductMapper {
  private static sanitizeImageUrl(url: unknown): string {
    let sanitized = '';
    if (!url) return '';
    if (typeof url === 'string') {
        // Check if it's a stringified JSON object
        if (url.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(url);
                sanitized = parsed.url || '';
            } catch {
                sanitized = url;
            }
        } else {
            sanitized = url;
        }
    } else if (typeof url === 'object' && (url as {url?: string}).url) {
        sanitized = (url as {url?: string}).url as string;
    } else {
        sanitized = String(url);
    }
    
    if (sanitized && !sanitized.startsWith('http') && sanitized !== '_' && sanitized !== 'null' && !sanitized.startsWith('assets/')) {
        const encodedPath = sanitized.split('/').map((s: string) => encodeURIComponent(s)).join('/');
        return `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
    }
    
    return sanitized;
  }

  static mapFromDb(p: Record<string, unknown>, branchId?: string): Product {
    const isFeatured = Boolean(p['is_destacado'] ?? p['is_featured'] ?? false);
    let displayedStock = 0;
    const branchStockList = p['branch_stock'] && Array.isArray(p['branch_stock']) ? p['branch_stock'] : [];
    
    if (branchId) {
       const specificBranch = branchStockList.find((b: Record<string, unknown>) => b['branch_id'] === branchId);
       if (specificBranch) {
           displayedStock = Number(specificBranch['quantity']);
       } else if (p['stock'] !== undefined && p['stock'] !== null) {
           // Fallback general stock si no hay registro específico o si RLS bloquea branch_stock
           displayedStock = Number(p['stock']);
       } else {
           displayedStock = 0;
       }
    } else {
       // Calcular stock total sumando todas las sucursales si no se filtró por sucursal
       displayedStock = branchStockList.reduce((acc: number, curr: Record<string, unknown>) => acc + (Number(curr['quantity']) || 0), 0);
       if (displayedStock === 0 && p['stock'] !== undefined && p['stock'] !== null) {
           displayedStock = Number(p['stock']);
       }
    }

    const rawGallery = p['gallery_urls'] || (p['image_url'] ? [p['image_url']] : []);
    const sanitizedGallery = Array.isArray(rawGallery) 
        ? rawGallery.map(img => this.sanitizeImageUrl(img))
        : [this.sanitizeImageUrl(rawGallery)];

    return {
          id: p['id'] as string,
          name: p['name'] as string,
          slug: p['slug'] as string,
          description: p['description'] as string,
          price: Number(p['price']),
          retail_price: p['retail_price'] !== undefined && p['retail_price'] !== null ? Number(p['retail_price']) : undefined,
          image_url: this.sanitizeImageUrl(p['image_url']),
          gallery_urls: sanitizedGallery,
          media_metadata: (p['media_metadata'] || []) as Product['media_metadata'],
          category_id: p['category_id'] as string,
          brand_id: p['brand_id'] as string,
          stock: displayedStock,
          is_active: Boolean(p['is_active']),
          is_featured: isFeatured,
          sku: p['sku'] as string || '',
          barcode: p['barcode'] as string || '',
          currency: p['currency'] as 'ARS' | 'USD' || 'ARS',
          cost_price: p['cost_price'] ? Number(p['cost_price']) : 0,
          min_stock_alert: p['min_stock_alert'] ? Number(p['min_stock_alert']) : undefined,
          is_global: Boolean(p['is_global']),
          created_at: p['created_at'] as string,
          updated_at: p['updated_at'] as string,
          
          // New marketing and logistics fields
          sale_price: p['precio_oferta'] ? Number(p['precio_oferta']) : undefined,
          offer_start_date: p['fecha_inicio_oferta'] as string,
          offer_end_date: p['fecha_fin_oferta'] as string,
          warranty_days: p['garantia_meses'] ? Number(p['garantia_meses']) : 0,
          tax_percentage: p['porcentaje_impuesto'] ? Number(p['porcentaje_impuesto']) : 21,
          weight: p['peso_kg'] ? Number(p['peso_kg']) : undefined,
          dimensions: p['largo_cm'] ? { length: Number(p['largo_cm']), width: Number(p['ancho_cm']), height: Number(p['alto_cm']) } : undefined,
          seo_keywords: p['seo_keywords'] as string,
          cross_sell_products: p['productos_relacionados'] as string[],
          reference_exchange_rate: p['tasa_cambio_referencia'] ? Number(p['tasa_cambio_referencia']) : undefined,
          free_shipping: Boolean(p['envio_gratis']),
          supplier_id: p['proveedor_id'] as string,
          condition: p['condicion'] as 'Nuevo' | 'Usado' | 'Reacondicionado',
          warranty_type: p['tipo_garantia'] as 'Fábrica' | 'Vendedor' | 'Sin garantía',
          includes_tax: p['incluye_iva'] !== undefined ? Boolean(p['incluye_iva']) : true,
          tags: p['etiquetas_tags'] as string[],
          
          // Variants
          variants: (() => {
            const vars = p['variants'] || p['product_variants'];
            const arr = Array.isArray(vars) ? vars : [];
            return arr.map((v: Record<string, unknown>) => {
              // Handle both mapped and raw DB rows just in case
              if (v['sku_variante'] !== undefined) {
                return {
                  id: v['id'] as string,
                  product_id: v['product_id'] as string,
                  name: (v['atributos'] as Record<string, unknown>)?.['name'] as string || 'Default',
                  sku: v['sku_variante'] as string,
                  price: v['precio_adicional'] ? Number(v['precio_adicional']) : 0,
                  stock: v['stock_disponible'] ? Number(v['stock_disponible']) : 0,
                  attributes: (v['atributos'] as Record<string, unknown>) || {},
                  is_active: true
                } as any; // Cast as any and then to ProductVariant to satisfy interface if fields mismatch slightly
              }
              return v as any;
            });
          })(),
          branch_stock: p['branch_stock'] as Product['branch_stock'],
          branches: p['branches'] as Product['branches']
    };
  }

  static mapToDb(p: Partial<Product>): Record<string, unknown> {
    const dbObj: Record<string, unknown> = { ...p };
    
    // Reverse map Marketing and Logistics fields
    if (p.sale_price !== undefined) dbObj['precio_oferta'] = p.sale_price;
    if (p.offer_start_date !== undefined) dbObj['fecha_inicio_oferta'] = p.offer_start_date;
    if (p.offer_end_date !== undefined) dbObj['fecha_fin_oferta'] = p.offer_end_date;
    if (p.warranty_days !== undefined) dbObj['garantia_meses'] = p.warranty_days;
    if (p.tax_percentage !== undefined) dbObj['porcentaje_impuesto'] = p.tax_percentage;
    if (p.weight !== undefined) dbObj['peso_kg'] = p.weight;
    if (p.dimensions) {
      dbObj['largo_cm'] = p.dimensions.length;
      dbObj['ancho_cm'] = p.dimensions.width;
      dbObj['alto_cm'] = p.dimensions.height;
    }
    if (p.cross_sell_products !== undefined) dbObj['productos_relacionados'] = p.cross_sell_products;
    if (p.reference_exchange_rate !== undefined) dbObj['tasa_cambio_referencia'] = p.reference_exchange_rate;
    if (p.free_shipping !== undefined) dbObj['envio_gratis'] = p.free_shipping;
    if (p.supplier_id !== undefined) dbObj['proveedor_id'] = p.supplier_id;
    if (p.condition !== undefined) dbObj['condicion'] = p.condition;
    if (p.warranty_type !== undefined) dbObj['tipo_garantia'] = p.warranty_type;
    if (p.includes_tax !== undefined) dbObj['incluye_iva'] = p.includes_tax;
    if (p.tags !== undefined) dbObj['etiquetas_tags'] = p.tags;
    if (p.is_featured !== undefined) dbObj['is_destacado'] = p.is_featured;

    // Delete the entity-only fields from the DB object to prevent inserting nonexistent columns
    delete dbObj['sale_price'];
    delete dbObj['offer_start_date'];
    delete dbObj['offer_end_date'];
    delete dbObj['warranty_days'];
    delete dbObj['tax_percentage'];
    delete dbObj['weight'];
    delete dbObj['dimensions'];
    delete dbObj['cross_sell_products'];
    delete dbObj['reference_exchange_rate'];
    delete dbObj['free_shipping'];
    delete dbObj['supplier_id'];
    delete dbObj['condition'];
    delete dbObj['warranty_type'];
    delete dbObj['includes_tax'];
    delete dbObj['tags'];
    
    // Also remove relations
    delete dbObj['variants'];
    delete dbObj['branch_stock'];
    delete dbObj['branches'];
    delete dbObj['convertedPrice'];
    delete dbObj['category_name'];
    
    return dbObj;
  }
}
