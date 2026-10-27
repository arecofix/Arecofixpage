import { Injectable, inject } from '@angular/core';
import { CsvService } from '@app/shared/services/csv.service';
import { StringUtils } from '@app/shared/utils/string.utils';
import { firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { ProductRepository, BulkPriceUpdate, ImportProductSummary } from '@app/features/products/domain/repositories/product.repository';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { ProductsStore } from '@app/features/products/application/services/products.store';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { AdminProductService } from './admin-product.service';

export interface ImportReport {
    inserted: number;
    priceUpdated: number;
    renamed: number;
    skipped: number;
    details: string[];
}

export interface CsvRow {
    id?: string;
    name: string;
    price: number;
    stock?: number;
    sku?: string;
    barcode?: string;
    description?: string;
    category_id?: string;
    brand_id?: string;
    image_url?: string;
    slug?: string;
    cost_price?: number;
    is_active?: boolean;
    is_featured?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AdminProductImportService {
    private csvService = inject(CsvService);
    private adminProductService = inject(AdminProductService);
    private productRepo = inject(ProductRepository);
    private brandRepo = inject(BrandRepository);
    private categoryRepo = inject(CategoryRepository);
    private productsStore = inject(ProductsStore);
    private stockService = inject(StockManagementService);
    private branchContextService = inject(BranchContextService);

    async exportProductsToCSV(): Promise<void> {
        const products = await this.adminProductService.getProducts();
        if (!products.length) return;

        const headers = [
            'id', 'name', 'slug', 'description', 'price',
            'stock', 'category_id', 'brand_id', 'image_url',
            'is_active', 'is_featured', 'sku', 'barcode'
        ];

        this.csvService.exportToCsv(products as any, 'products_export', headers as any);
    }

    async exportToMetaCSV(): Promise<void> {
        const products = await this.adminProductService.getProducts();
        if (!products.length) return;

        const brands = await this.adminProductService.getBrands();
        const brandMap = new Map(brands.map(b => [b.id, b.name]));

        const metaProducts = products.map(p => {
            let imageLink = p.image_url || '';
            if (imageLink && !imageLink.startsWith('http')) {
                const cleanPath = imageLink.startsWith('/') ? imageLink.substring(1) : imageLink;
                imageLink = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${cleanPath}`;
            }

            const productLink = `${environment.baseUrl}/productos/${p.slug}`;
            const priceValue = Number(p.price) || 0;
            const currency = p.currency || 'ARS';
            const formattedPrice = `${priceValue.toFixed(2)} ${currency}`;
            const availability = (p.is_active && (p.stock > 0 || p.stock === null)) ? 'in stock' : 'out of stock';
            const title = p.name || p.description || 'Producto sin nombre';

            return {
                id: p.id,
                title: title,
                description: (p.description || title).substring(0, 9000),
                availability: availability,
                condition: 'new',
                price: formattedPrice,
                link: productLink,
                image_link: imageLink,
                brand: brandMap.get(p.brand_id || '') || environment.appName,
                quantity_to_sell_on_facebook: p.stock || 0,
                google_product_category: ''
            };
        });

        const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'quantity_to_sell_on_facebook', 'google_product_category'];
        this.csvService.exportToCsv(metaProducts as any, `meta_catalog_${new Date().toISOString().split('T')[0]}`, headers as any);
    }

    async validateProductsForMeta(): Promise<{ id: string, name: string, issues: string[] }[]> {
        const products = await this.adminProductService.getProducts();
        const brands = await this.adminProductService.getBrands();
        const brandMap = new Map(brands.map(b => [b.id, b.name]));
        
        const report: { id: string, name: string, issues: string[] }[] = [];
        const seenIds = new Set<string>();
        const seenSkus = new Set<string>();
        const duplicateIds = new Set<string>();
        const duplicateSkus = new Set<string>();

        for (const p of products) {
            if (seenIds.has(p.id)) duplicateIds.add(p.id);
            seenIds.add(p.id);

            if (p.sku) {
                const normSku = p.sku.trim().toLowerCase();
                if (seenSkus.has(normSku)) duplicateSkus.add(normSku);
                seenSkus.add(normSku);
            }
        }

        for (const p of products) {
            const issues: string[] = [];
            
            if (!p.name) issues.push('Falta Título (name)');
            if (!p.description) issues.push('Falta Descripción');
            if (p.price <= 0) issues.push('Precio debe ser mayor a 0');
            if (!p.image_url) issues.push('Falta Imagen Principal');
            if (!p.brand_id || !brandMap.has(p.brand_id)) issues.push('Falta Marca válida');
            if (!p.slug) issues.push('Falta Slug para generar enlace');
            
            if (duplicateIds.has(p.id)) issues.push('ID Duplicado (Conflicto interno)');
            if (p.sku && duplicateSkus.has(p.sku.trim().toLowerCase())) issues.push(`SKU Duplicado: ${p.sku}`);

            if (p.image_url && !p.image_url.startsWith('http')) {
                if (p.image_url.includes(' ') || p.image_url.includes('?')) {
                     issues.push('URL de imagen contiene caracteres inválidos');
                }
            }

            if (issues.length > 0) {
                report.push({ id: p.id, name: p.name || 'Sin Nombre', issues });
            }
        }

        return report;
    }

    async importProductsFromCSV(file: File): Promise<ImportReport> {
        const parseResult = await this.csvService.parse<CsvRow>(file, (values, headers) => {
            const raw: Record<string, any> = {};
            headers.forEach((h: string, i: number) => {
                let v = values[i]?.trim();
                if (v === '' || v === undefined) {
                    raw[h] = null;
                } else if (['price', 'stock', 'min_stock_alert', 'cost_price'].includes(h)) {
                    raw[h] = Number(v);
                } else if (['is_active', 'is_featured'].includes(h)) {
                    raw[h] = v.toLowerCase() === 'true';
                } else {
                    raw[h] = v;
                }
            });

            const name = (raw['name'] as string)?.trim();
            const price = raw['price'];
            if (!name || price === null || price === undefined || isNaN(Number(price))) {
                return null;
            }

            const id = raw['id'] && raw['id'] !== 'new' && raw['id'] !== '' ? raw['id'] : undefined;

            return {
                id,
                name,
                price: Number(price),
                stock: raw['stock'] != null ? Number(raw['stock']) : undefined,
                sku: raw['sku'] || undefined,
                barcode: raw['barcode'] || undefined,
                description: raw['description'] || undefined,
                category_id: raw['category_id'] || undefined,
                brand_id: raw['brand_id'] || undefined,
                image_url: raw['image_url'] || undefined,
                slug: raw['slug'] || undefined,
                cost_price: raw['cost_price'] != null ? Number(raw['cost_price']) : undefined,
                is_active: raw['is_active'] != null ? Boolean(raw['is_active']) : true,
                is_featured: raw['is_featured'] != null ? Boolean(raw['is_featured']) : false,
            } as CsvRow;
        });

        const csvRows: CsvRow[] = parseResult.data as CsvRow[];
        const skipped = parseResult.errors;

        if (csvRows.length === 0) {
            return { inserted: 0, priceUpdated: 0, renamed: 0, skipped, details: ['No se encontraron filas válidas en el CSV.'] };
        }

        const [existing, brands, categories] = await Promise.all([
            firstValueFrom(this.productRepo.getAllForImport()),
            this.adminProductService.getBrands(),
            this.adminProductService.getCategories()
        ]);

        const byId   = new Map<string, ImportProductSummary>();
        const bySku  = new Map<string, ImportProductSummary>();
        const byName = new Map<string, ImportProductSummary>(); 
        const bySlug = new Set<string>();

        for (const p of existing) {
            byId.set(p.id, p);
            if (p.sku) bySku.set(p.sku.trim().toLowerCase(), p);
            byName.set(this._normaliseName(p.name), p);
            bySlug.add(p.slug);
        }

        const brandByName = new Map<string, string>();   
        const brandById   = new Set<string>();             
        brands.forEach(b => { brandByName.set(this._normaliseName(b.name), b.id); brandById.add(b.id); });

        const catByName = new Map<string, string>();      
        const catById   = new Set<string>();               
        categories.forEach(c => { catByName.set(this._normaliseName(c.name), c.id); catById.add(c.id); });

        const details: string[] = [];
        const brandNamesToCreate = new Set<string>();
        const catNamesToCreate = new Set<string>();

        for (const row of csvRows) {
            if (row.brand_id) {
                if (this._isUuid(row.brand_id)) {
                    if (!brandById.has(row.brand_id)) { }
                } else {
                    const normName = this._normaliseName(row.brand_id);
                    if (!brandByName.has(normName)) {
                        brandNamesToCreate.add(normName);
                    }
                }
            }
            if (row.category_id) {
                if (this._isUuid(row.category_id)) {
                    if (!catById.has(row.category_id)) { }
                } else {
                    const normName = this._normaliseName(row.category_id);
                    if (!catByName.has(normName)) {
                        catNamesToCreate.add(normName);
                    }
                }
            }
        }

        await Promise.all(Array.from(brandNamesToCreate).map(async (normName) => {
            try {
                const displayName = normName.charAt(0).toUpperCase() + normName.slice(1);
                const newBrand = await firstValueFrom(
                    this.brandRepo.create({ name: displayName, slug: StringUtils.slugify(normName), is_active: true } as any)
                );
                brandByName.set(normName, newBrand.id);
                brandById.add(newBrand.id);
                details.push(`ℹ️ Marca creada automáticamente: ${displayName}`);
            } catch (e: any) {
                details.push(`⚠️ No se pudo crear la marca "${normName}": ${e.message ?? e}`);
            }
        }));

        await Promise.all(Array.from(catNamesToCreate).map(async (normName) => {
            try {
                const displayName = normName.charAt(0).toUpperCase() + normName.slice(1);
                const newCat = await firstValueFrom(
                    this.categoryRepo.create({ name: displayName, slug: StringUtils.slugify(normName), type: 'product', is_active: true } as any)
                );
                catByName.set(normName, newCat.id);
                catById.add(newCat.id);
                details.push(`ℹ️ Categoría creada automáticamente: ${displayName}`);
            } catch (e: any) {
                details.push(`⚠️ No se pudo crear la categoría "${normName}": ${e.message ?? e}`);
            }
        }));

        const priceUpdates: BulkPriceUpdate[] = [];   
        const toInsert: any[] = [];       
        const usedSlugsInBatch = new Set<string>();

        for (const row of csvRows) {
            const found = this._findExisting(row, byId, bySku, byName);

            if (found) {
                const safePrice = Math.min(row.price, 99999999.99);
                const update: BulkPriceUpdate = { id: found.id, price: safePrice };

                if (this._isGenericRepuesto(found.name) && row.name && !this._isGenericRepuesto(row.name)) {
                    update.newName = row.name;
                }

                priceUpdates.push(update);
            } else {
                let brandId: string | undefined = undefined;
                if (row.brand_id) {
                    if (this._isUuid(row.brand_id) && brandById.has(row.brand_id)) {
                        brandId = row.brand_id;
                    } else {
                        const norm = this._isUuid(row.brand_id)
                            ? undefined  
                            : brandByName.get(this._normaliseName(row.brand_id));
                        brandId = norm;
                    }
                }

                let catId: string | undefined = undefined;
                if (row.category_id) {
                    if (this._isUuid(row.category_id) && catById.has(row.category_id)) {
                        catId = row.category_id;
                    } else {
                        const norm = this._isUuid(row.category_id)
                            ? undefined
                            : catByName.get(this._normaliseName(row.category_id));
                        catId = norm;
                    }
                }

                let baseSlug = row.slug || StringUtils.slugify(row.name);
                let slug = baseSlug;
                let counter = 1;
                while (bySlug.has(slug) || usedSlugsInBatch.has(slug)) {
                    slug = `${baseSlug}-${counter++}`;
                }
                usedSlugsInBatch.add(slug);

                toInsert.push({
                    name: row.name,
                    slug: slug,
                    price: Math.min(row.price, 99999999.99),
                    stock: Math.min(row.stock ?? 1, 99999), 
                    sku: row.sku || undefined,
                    barcode: row.barcode || undefined,
                    description: row.description || '',
                    category_id: catId || undefined,
                    brand_id: brandId || undefined,
                    image_url: row.image_url || undefined,
                    cost_price: row.cost_price || 0,
                    is_active: row.is_active ?? true,
                    is_featured: row.is_featured ?? false,
                } as any);
            }
        }

        let priceUpdated = 0;
        let renamed = 0;
        let inserted = 0;

        if (priceUpdates.length > 0) {
            try {
                const { updated, errors: updateErrors } = await firstValueFrom(
                    this.productRepo.bulkUpdatePrices(priceUpdates)
                );
                priceUpdated = priceUpdates.filter(u => !u.newName).length;
                renamed = priceUpdates.filter(u => !!u.newName).length;
                details.push(`✅ ${updated} productos actualizados (precio${renamed > 0 ? ` + ${renamed} renombrados` : ''}).`);
                if (updateErrors > 0) {
                    details.push(`⚠️ ${updateErrors} actualizaciones fallaron.`);
                }
            } catch (e: any) {
                details.push(`⚠️ Error crítico en actualización de precios: ${e.message}`);
            }
        }

        if (toInsert.length > 0) {
            const INSERT_CHUNK = 100;
            for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
                const chunk = toInsert.slice(i, i + INSERT_CHUNK);
                try {
                    const upserted = await firstValueFrom(this.productRepo.upsertMany(chunk as any[]));
                    inserted += (upserted || []).length;
                    
                    const currentBranchId = this.branchContextService.getBranchId();
                    if (currentBranchId && upserted && upserted.length > 0) {
                        for (const product of upserted) {
                            const originalItem = chunk.find(c => (c as any).slug === product.slug);
                            if (originalItem && (originalItem as any).stock !== undefined) {
                                await this.stockService.updateStock(product.id, currentBranchId, (originalItem as any).stock);
                            }
                        }
                    }
                } catch (e: any) {
                    let errorMsg = e.message;
                    if (errorMsg.includes('products_brand_id_fkey')) {
                        errorMsg = 'Marca no encontrada';
                    } else if (errorMsg.includes('numeric field overflow')) {
                        errorMsg = 'Número demasiado grande';
                    } else if (errorMsg.includes('duplicate key')) {
                        errorMsg = 'Nombre o SKU ya existe';
                    }
                    details.push(`⚠️ Error lote ${Math.floor(i / INSERT_CHUNK) + 1}: ${errorMsg}`);
                }
            }
            details.push(`🆕 ${inserted} productos nuevos insertados.`);
        }

        if (inserted > 0 || priceUpdated > 0 || renamed > 0) {
            this.productsStore.clearCache();
        }
        return { inserted, priceUpdated, renamed, skipped, details };
    }

    private _findExisting(
        row: CsvRow,
        byId: Map<string, ImportProductSummary>,
        bySku: Map<string, ImportProductSummary>,
        byName: Map<string, ImportProductSummary>
    ): ImportProductSummary | null {
        if (row.id && byId.has(row.id)) return byId.get(row.id)!;
        if (row.sku) {
            const skuMatch = bySku.get(row.sku.trim().toLowerCase());
            if (skuMatch) return skuMatch;
        }
        const normName = this._normaliseName(row.name);
        return byName.get(normName) ?? null;
    }

    private _normaliseName(name: string): string {
        return (name || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }

    private _isGenericRepuesto(name: string): boolean {
        const n = (name || '').trim().toLowerCase();
        return n === 'repuesto' || n.startsWith('repuesto ') || n.endsWith(' repuesto');
    }

    private _isUuid(text: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(text);
    }
}
