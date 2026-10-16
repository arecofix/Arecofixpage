import { Product } from '../../domain/entities/product.entity';
import { environment } from '@env/environment';

export class ProductMapper {
  /**
   * Set of strictly valid database column names on public.products table.
   * Prevents PostgREST PGRST204 errors when inserting/updating.
   * Note: search_tsv is GENERATED ALWAYS STORED and must NOT be in insert/update payloads.
   */
  private static readonly VALID_DB_COLUMNS = new Set<string>([
    'id',
    'sku',
    'name',
    'slug',
    'description',
    'price',
    'sale_price',
    'min_stock_alert',
    'category_id',
    'brand_id',
    'model_id',
    'image_url',
    'gallery_urls',
    'specifications',
    'is_featured',
    'is_active',
    'created_at',
    'updated_at',
    'barcode',
    'currency',
    'tenant_id',
    'is_global',
    'deleted_at',
    'cost_price',
    'media_metadata',
    'stock',
    'branch_id',
    'total_units_sold',
    'meta_title',
    'meta_description',
    'og_image',
    'has_variants',
    'variant_options',
    'offer_start_date',
    'offer_end_date',
    'warranty_days',
    'tax_percentage',
    'weight',
    'dimensions',
    'seo_keywords',
    'cross_sell_products'
  ]);

  private static sanitizeImageUrl(url: unknown): string {
    let sanitized = '';
    if (!url) return '';
    if (typeof url === 'string') {
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
    } else if (typeof url === 'object' && (url as { url?: string }).url) {
      sanitized = (url as { url?: string }).url as string;
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
    const isFeatured = Boolean(p['is_featured'] ?? p['is_destacado'] ?? false);
    let displayedStock = 0;
    const branchStockList = p['branch_stock'] && Array.isArray(p['branch_stock']) ? p['branch_stock'] : [];

    if (branchId) {
      const specificBranch = branchStockList.find((b: Record<string, unknown>) => b['branch_id'] === branchId);
      if (specificBranch) {
        displayedStock = Number(specificBranch['quantity']);
      } else if (p['stock'] !== undefined && p['stock'] !== null) {
        displayedStock = Number(p['stock']);
      } else {
        displayedStock = 0;
      }
    } else {
      displayedStock = branchStockList.reduce((acc: number, curr: Record<string, unknown>) => acc + (Number(curr['quantity']) || 0), 0);
      if (displayedStock === 0 && p['stock'] !== undefined && p['stock'] !== null) {
        displayedStock = Number(p['stock']);
      }
    }

    const rawGallery = p['gallery_urls'] || (p['image_url'] ? [p['image_url']] : []);
    const sanitizedGallery = Array.isArray(rawGallery)
      ? rawGallery.map(img => this.sanitizeImageUrl(img))
      : [this.sanitizeImageUrl(rawGallery)];

    const specs = (typeof p['specifications'] === 'object' && p['specifications'] ? p['specifications'] : {}) as Record<string, any>;

    // Dimensions: read from real jsonb column dimensions first, or fallback to largo/ancho/alto
    let parsedDimensions: { length: number; width: number; height: number } | undefined;
    if (p['dimensions'] && typeof p['dimensions'] === 'object') {
      const d = p['dimensions'] as Record<string, any>;
      parsedDimensions = {
        length: Number(d['length'] || d['largo'] || 0),
        width: Number(d['width'] || d['ancho'] || 0),
        height: Number(d['height'] || d['alto'] || 0)
      };
    } else if (p['largo_cm'] !== undefined) {
      parsedDimensions = {
        length: Number(p['largo_cm'] || 0),
        width: Number(p['ancho_cm'] || 0),
        height: Number(p['alto_cm'] || 0)
      };
    }

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
      sku: (p['sku'] as string) || '',
      barcode: (p['barcode'] as string) || '',
      currency: (p['currency'] as 'ARS' | 'USD') || 'ARS',
      cost_price: p['cost_price'] ? Number(p['cost_price']) : 0,
      min_stock_alert: p['min_stock_alert'] ? Number(p['min_stock_alert']) : undefined,
      is_global: Boolean(p['is_global']),
      created_at: p['created_at'] as string,
      updated_at: p['updated_at'] as string,
      specifications: specs,

      // Marketing and logistics: read from canonical English columns first, fallback to legacy Spanish / specs
      sale_price: p['sale_price'] !== null && p['sale_price'] !== undefined ? Number(p['sale_price']) : (p['precio_oferta'] ? Number(p['precio_oferta']) : undefined),
      offer_start_date: (p['offer_start_date'] ?? p['fecha_inicio_oferta']) as string,
      offer_end_date: (p['offer_end_date'] ?? p['fecha_fin_oferta']) as string,
      warranty_days: p['warranty_days'] !== null && p['warranty_days'] !== undefined ? Number(p['warranty_days']) : (p['garantia_meses'] ? Number(p['garantia_meses']) : 0),
      tax_percentage: p['tax_percentage'] !== null && p['tax_percentage'] !== undefined ? Number(p['tax_percentage']) : (p['porcentaje_impuesto'] ? Number(p['porcentaje_impuesto']) : 21),
      weight: p['weight'] !== null && p['weight'] !== undefined ? Number(p['weight']) : (p['peso_kg'] ? Number(p['peso_kg']) : undefined),
      dimensions: parsedDimensions,
      seo_keywords: (p['seo_keywords'] as string) || '',
      meta_title: (p['meta_title'] as string) || undefined,
      meta_description: (p['meta_description'] as string) || undefined,
      og_image: p['og_image'] ? this.sanitizeImageUrl(p['og_image']) : undefined,
      cross_sell_products: (p['cross_sell_products'] ?? p['productos_relacionados'] ?? []) as string[],

      // Attributes preserved in specifications JSONB
      reference_exchange_rate: specs['reference_exchange_rate'] !== undefined ? Number(specs['reference_exchange_rate']) : (p['tasa_cambio_referencia'] ? Number(p['tasa_cambio_referencia']) : undefined),
      free_shipping: Boolean(specs['free_shipping'] ?? p['envio_gratis'] ?? false),
      supplier_id: (specs['supplier_id'] ?? p['proveedor_id']) as string,
      condition: (specs['condition'] ?? p['condicion'] ?? 'Nuevo') as 'Nuevo' | 'Usado' | 'Reacondicionado',
      warranty_type: (specs['warranty_type'] ?? p['tipo_garantia'] ?? 'Sin garantía') as 'Fábrica' | 'Vendedor' | 'Sin garantía',
      includes_tax: specs['includes_tax'] !== undefined ? Boolean(specs['includes_tax']) : (p['incluye_iva'] !== undefined ? Boolean(p['incluye_iva']) : true),
      tags: (specs['tags'] ?? p['etiquetas_tags'] ?? []) as string[],
      ml_category_id: (specs['ml_category_id'] ?? p['ml_category_id']) as string,

      // Variants
      variants: (() => {
        const vars = p['variants'] || p['product_variants'];
        const arr = Array.isArray(vars) ? vars : [];
        return arr.map((v: Record<string, unknown>) => {
          if (v['sku_variante'] !== undefined) {
            return {
              id: v['id'] as string,
              product_id: v['product_id'] as string,
              name: ((v['atributos'] as Record<string, unknown>)?.['name'] as string) || 'Default',
              sku: v['sku_variante'] as string,
              price: v['precio_adicional'] ? Number(v['precio_adicional']) : 0,
              stock: v['stock_disponible'] ? Number(v['stock_disponible']) : 0,
              attributes: (v['atributos'] as Record<string, unknown>) || {},
              is_active: true
            } as any;
          }
          return v as any;
        });
      })(),
      branch_stock: p['branch_stock'] as Product['branch_stock'],
      branches: p['branches'] as Product['branches']
    };
  }

  static mapToDb(p: Partial<Product>): Record<string, unknown> {
    const raw = { ...p } as Record<string, any>;

    // Encapsulate UI-specific non-column fields into specifications JSONB
    const specifications: Record<string, any> = {
      ...(typeof raw['specifications'] === 'object' && raw['specifications'] ? raw['specifications'] : {})
    };

    if (raw['condition'] !== undefined) specifications['condition'] = raw['condition'];
    if (raw['warranty_type'] !== undefined) specifications['warranty_type'] = raw['warranty_type'];
    if (raw['includes_tax'] !== undefined) specifications['includes_tax'] = raw['includes_tax'];
    if (raw['free_shipping'] !== undefined) specifications['free_shipping'] = raw['free_shipping'];
    if (raw['supplier_id'] !== undefined) specifications['supplier_id'] = raw['supplier_id'];
    if (raw['reference_exchange_rate'] !== undefined) specifications['reference_exchange_rate'] = raw['reference_exchange_rate'];
    if (raw['tags'] !== undefined) specifications['tags'] = raw['tags'];
    if (raw['ml_category_id'] !== undefined) specifications['ml_category_id'] = raw['ml_category_id'];

    raw['specifications'] = specifications;

    // Ensure dimensions is a JSONB object if provided
    if (raw['dimensions'] && typeof raw['dimensions'] === 'object') {
      raw['dimensions'] = {
        length: Number(raw['dimensions'].length || 0),
        width: Number(raw['dimensions'].width || 0),
        height: Number(raw['dimensions'].height || 0)
      };
    }

    // Filter strictly against existing database columns
    const dbObj: Record<string, unknown> = {};
    for (const key of Object.keys(raw)) {
      if (this.VALID_DB_COLUMNS.has(key)) {
        dbObj[key] = raw[key];
      }
    }

    // Remove any computed or read-only fields that must never be sent to PostgREST
    delete dbObj['retail_price'];
    delete dbObj['search_tsv'];
    delete dbObj['variants'];
    delete dbObj['branch_stock'];
    delete dbObj['branches'];
    delete dbObj['convertedPrice'];
    delete dbObj['category_name'];

    return dbObj;
  }
}
