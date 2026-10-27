import { ProductMapper } from './product.mapper';
import { Product } from '../../domain/entities/product.entity';

describe('ProductMapper', () => {
  describe('mapToDb', () => {
    it('should map domain properties to canonical PostgreSQL columns without non-existent Spanish keys', () => {
      const input: Partial<Product> = {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        price: 1500000,
        sale_price: 1350000,
        warranty_days: 365,
        tax_percentage: 21,
        weight: 0.221,
        dimensions: { length: 15.9, width: 7.6, height: 0.8 },
        seo_keywords: 'apple, iphone, pro max',
        is_featured: true,
        is_active: true,
        stock: 10,
        condition: 'Nuevo',
        warranty_type: 'Fábrica',
        free_shipping: true,
        includes_tax: true,
        tags: ['apple', 'flagship'],
        ml_category_id: 'MLA1055'
      };

      const dbPayload = ProductMapper.mapToDb(input);

      // Verify canonical English DB columns exist
      expect(dbPayload['name']).toBe('iPhone 15 Pro Max');
      expect(dbPayload['slug']).toBe('iphone-15-pro-max');
      expect(dbPayload['price']).toBe(1500000);
      expect(dbPayload['sale_price']).toBe(1350000);
      expect(dbPayload['warranty_days']).toBe(365);
      expect(dbPayload['tax_percentage']).toBe(21);
      expect(dbPayload['weight']).toBe(0.221);
      expect(dbPayload['dimensions']).toEqual({ length: 15.9, width: 7.6, height: 0.8 });
      expect(dbPayload['seo_keywords']).toBe('apple, iphone, pro max');
      expect(dbPayload['is_featured']).toBe(true);

      // Verify no invalid Spanish column names exist (Root cause prevention)
      expect(dbPayload['precio_oferta']).toBeUndefined();
      expect(dbPayload['garantia_meses']).toBeUndefined();
      expect(dbPayload['porcentaje_impuesto']).toBeUndefined();
      expect(dbPayload['peso_kg']).toBeUndefined();
      expect(dbPayload['largo_cm']).toBeUndefined();
      expect(dbPayload['ancho_cm']).toBeUndefined();
      expect(dbPayload['alto_cm']).toBeUndefined();
      expect(dbPayload['is_destacado']).toBeUndefined();
      expect(dbPayload['envio_gratis']).toBeUndefined();
      expect(dbPayload['tipo_garantia']).toBeUndefined();
      expect(dbPayload['incluye_iva']).toBeUndefined();
      expect(dbPayload['etiquetas_tags']).toBeUndefined();

      // Verify non-column fields were safely encapsulated in specifications
      const specs = dbPayload['specifications'] as Record<string, any>;
      expect(specs).toBeDefined();
      expect(specs['condition']).toBe('Nuevo');
      expect(specs['warranty_type']).toBe('Fábrica');
      expect(specs['free_shipping']).toBe(true);
      expect(specs['includes_tax']).toBe(true);
      expect(specs['tags']).toEqual(['apple', 'flagship']);
      expect(specs['ml_category_id']).toBe('MLA1055');
    });

    it('should strip computed fields and relation arrays that cannot be inserted into products', () => {
      const input = {
        id: 'some-uuid',
        name: 'Product With Relations',
        price: 100,
        retail_price: 120, // computed column
        search_tsv: 'tsvector', // generated always stored
        variants: [{ id: 'var-1', name: 'Red', stock: 5 }],
        branch_stock: [{ branch_id: 'b-1', quantity: 5 }],
        branches: { name: 'Main Branch' },
        convertedPrice: 100,
        category_name: 'Smartphones'
      } as any;

      const dbPayload = ProductMapper.mapToDb(input);

      expect(dbPayload['retail_price']).toBeUndefined();
      expect(dbPayload['search_tsv']).toBeUndefined();
      expect(dbPayload['variants']).toBeUndefined();
      expect(dbPayload['branch_stock']).toBeUndefined();
      expect(dbPayload['branches']).toBeUndefined();
      expect(dbPayload['convertedPrice']).toBeUndefined();
      expect(dbPayload['category_name']).toBeUndefined();
      expect(dbPayload['name']).toBe('Product With Relations');
    });
  });

  describe('mapFromDb', () => {
    it('should hydrate Product entity from DB row with canonical columns', () => {
      const dbRow: Record<string, unknown> = {
        id: 'prod-uuid-1',
        name: 'Display Samsung S23',
        slug: 'display-samsung-s23',
        description: 'Original AMOLED Display',
        price: 250000,
        sale_price: 220000,
        currency: 'ARS',
        stock: 8,
        cost_price: 150000,
        is_active: true,
        is_featured: true,
        is_global: false,
        warranty_days: 90,
        tax_percentage: 21,
        weight: 0.15,
        dimensions: { length: 14.6, width: 7.0, height: 0.7 },
        seo_keywords: 'samsung, display, oled',
        meta_title: 'Display Samsung S23 OLED - Calidad Original',
        meta_description: 'Repuesto original para pantalla Samsung S23. Stock disponible.',
        og_image: 'https://worker.arecofix.com.ar/public-assets/tenant/products/display.webp',
        image_url: 'https://worker.arecofix.com.ar/public-assets/tenant/products/display.webp',
        gallery_urls: ['https://worker.arecofix.com.ar/public-assets/tenant/products/display.webp'],
        specifications: {
          condition: 'Nuevo',
          warranty_type: 'Fábrica',
          includes_tax: true,
          free_shipping: true,
          tags: ['repuestos', 'samsung']
        }
      };

      const product = ProductMapper.mapFromDb(dbRow);

      expect(product.id).toBe('prod-uuid-1');
      expect(product.name).toBe('Display Samsung S23');
      expect(product.description).toBe('Original AMOLED Display');
      expect(product.meta_title).toBe('Display Samsung S23 OLED - Calidad Original');
      expect(product.meta_description).toBe('Repuesto original para pantalla Samsung S23. Stock disponible.');
      expect(product.og_image).toBe('https://worker.arecofix.com.ar/public-assets/tenant/products/display.webp');
      expect(product.price).toBe(250000);
      expect(product.sale_price).toBe(220000);
      expect(product.warranty_days).toBe(90);
      expect(product.tax_percentage).toBe(21);
      expect(product.weight).toBe(0.15);
      expect(product.dimensions).toEqual({ length: 14.6, width: 7.0, height: 0.7 });
      expect(product.is_featured).toBe(true);
      expect(product.condition).toBe('Nuevo');
      expect(product.warranty_type).toBe('Fábrica');
      expect(product.free_shipping).toBe(true);
      expect(product.includes_tax).toBe(true);
      expect(product.tags).toEqual(['repuestos', 'samsung']);
    });

    it('should maintain backward compatibility with legacy Spanish column names if present in legacy rows', () => {
      const legacyRow: Record<string, unknown> = {
        id: 'prod-legacy-1',
        name: 'Legacy Product',
        slug: 'legacy-product',
        price: 5000,
        precio_oferta: 4500,
        garantia_meses: 60,
        porcentaje_impuesto: 10.5,
        peso_kg: 1.2,
        largo_cm: 20,
        ancho_cm: 15,
        alto_cm: 10,
        is_destacado: true,
        envio_gratis: true,
        condicion: 'Usado',
        tipo_garantia: 'Vendedor'
      };

      const product = ProductMapper.mapFromDb(legacyRow);

      expect(product.sale_price).toBe(4500);
      expect(product.warranty_days).toBe(60);
      expect(product.tax_percentage).toBe(10.5);
      expect(product.weight).toBe(1.2);
      expect(product.dimensions).toEqual({ length: 20, width: 15, height: 10 });
      expect(product.is_featured).toBe(true);
      expect(product.free_shipping).toBe(true);
      expect(product.condition).toBe('Usado');
      expect(product.warranty_type).toBe('Vendedor');
    });
  });

  describe('mapUpdateToDb - Safe Partial Updates', () => {
    it('should return a payload with ONLY the single field when DTO has one field', () => {
      const dto: Partial<Product> = { price: 299999 };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ price: 299999 });
      expect(Object.keys(payload).length).toBe(1);
    });

    it('should return an empty payload when DTO is empty', () => {
      const dto: Partial<Product> = {};
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({});
      expect(Object.keys(payload).length).toBe(0);
    });

    it('should NOT wipe specifications if neither specifications nor spec attributes are passed', () => {
      const dto: Partial<Product> = { stock: 15 };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ stock: 15 });
      expect('specifications' in payload).toBe(false);
    });

    it('should preserve explicit null when field is intentionally set to null', () => {
      const dto: Partial<Product> = {
        description: null as unknown as string,
        category_id: null as unknown as string
      };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload['description']).toBeNull();
      expect(payload['category_id']).toBeNull();
      expect(Object.keys(payload).length).toBe(2);
    });

    it('should NOT include undefined fields in payload', () => {
      const dto: Partial<Product> = {
        name: 'Updated Name',
        price: undefined,
        description: undefined,
        stock: undefined
      };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ name: 'Updated Name' });
      expect('price' in payload).toBe(false);
      expect('description' in payload).toBe(false);
      expect('stock' in payload).toBe(false);
    });

    it('should include all provided fields when DTO contains multiple attributes', () => {
      const dto: Partial<Product> = {
        name: 'Nuevo Repuesto',
        price: 50000,
        cost_price: 30000,
        sku: 'REP-001',
        is_active: true
      };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload['name']).toBe('Nuevo Repuesto');
      expect(payload['price']).toBe(50000);
      expect(payload['cost_price']).toBe(30000);
      expect(payload['sku']).toBe('REP-001');
      expect(payload['is_active']).toBe(true);
    });

    it('should strip primary keys and computed fields from update payload', () => {
      const dto: Partial<Product> = {
        id: 'prod-123',
        tenant_id: 'tenant-456',
        name: 'Clean Name',
        retail_price: 60000 as unknown as number
      };
      const payload = ProductMapper.mapUpdateToDb(dto);

      expect(payload['name']).toBe('Clean Name');
      expect('id' in payload).toBe(false);
      expect('tenant_id' in payload).toBe(false);
      expect('retail_price' in payload).toBe(false);
    });
  });
});
