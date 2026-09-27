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
    const isFeatured = Boolean(p['featured'] ?? p['is_featured'] ?? false);
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
       displayedStock = branchStockList.reduce((acc: number, curr: any) => acc + (Number(curr.quantity) || 0), 0);
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
          branch_stock: p['branch_stock'] as Product['branch_stock'],
          branches: p['branches'] as Product['branches']
    };
  }
}
