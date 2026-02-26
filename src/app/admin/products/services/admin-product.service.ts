import { Injectable, inject } from '@angular/core';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { ProductRepository, BulkPriceUpdate, ImportProductSummary } from '@app/features/products/domain/repositories/product.repository';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { AuthService } from '@app/core/services/auth.service';
import { CsvService } from '@app/shared/services/csv.service';
import { StringUtils } from '@app/shared/utils/string.utils';
import { firstValueFrom } from 'rxjs';

// ─── Import Report ──────────────────────────────────────────────────────────
export interface ImportReport {
    /** Products actually inserted as new */
    inserted: number;
    /** Products where only the price was updated */
    priceUpdated: number;
    /** Products renamed from 'repuesto' + price updated */
    renamed: number;
    /** Rows in the CSV that could not be processed */
    skipped: number;
    /** Human-readable summary lines */
    details: string[];
}

// ─── Raw CSV row after parsing ────────────────────────────────────────────
interface CsvRow {
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
    is_active?: boolean;
    is_featured?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private productRepo = inject(ProductRepository);
    private brandRepo = inject(BrandRepository);
    private categoryRepo = inject(CategoryRepository);
    private csvService = inject(CsvService);
    private auth = inject(AuthService);

    async getProducts(): Promise<Product[]> {
        const user = this.auth.getCurrentUser();
        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            return firstValueFrom(this.productRepo.getAll(profile?.branch_id));
        }
        return firstValueFrom(this.productRepo.getAll());
    }

    async getProduct(id: string): Promise<Product> {
        return firstValueFrom(this.productRepo.getById(id));
    }

    async getBrands(): Promise<Brand[]> {
        return firstValueFrom(this.brandRepo.getAll());
    }

    async getCategories(): Promise<Category[]> {
        return firstValueFrom(this.categoryRepo.getAll());
    }

    async createProduct(payload: Partial<Product>): Promise<void> {
        await firstValueFrom(this.productRepo.create(payload as Product));
    }

    async updateProduct(id: string, payload: Partial<Product>): Promise<void> {
        await firstValueFrom(this.productRepo.update(id, payload));
    }

    async uploadImage(file: File): Promise<string> {
        return this.productRepo.uploadImage(file);
    }

    slugify(text: string): string {
        return StringUtils.slugify(text);
    }

    async exportProductsToCSV(): Promise<void> {
        const products = await this.getProducts();
        if (!products.length) return;

        const headers = [
            'id', 'name', 'slug', 'description', 'price',
            'stock', 'category_id', 'brand_id', 'image_url',
            'is_active', 'is_featured', 'sku', 'barcode'
        ];

        this.csvService.exportToCsv(products, 'products_export', headers);
    }

    // ────────────────────────────────────────────────────────────────────────
    // SMART IMPORT
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Intelligent CSV import that:
     * 1. Parses and validates the CSV
     * 2. Fetches all existing products (lean projection for speed)
     * 3. Classifies each CSV row as: UPDATE (price only) | RENAME+UPDATE | INSERT (new)
     * 4. Never overwrites images, descriptions, categories or other data on existing products
     */
    async importProductsFromCSV(file: File): Promise<ImportReport> {
        // ── STEP 1: Parse CSV ──────────────────────────────────────────────
        const parseResult = await this.csvService.parse<CsvRow>(file, (values, headers) => {
            const raw: Record<string, any> = {};
            headers.forEach((h: string, i: number) => {
                let v = values[i]?.trim();
                if (v === '' || v === undefined) {
                    raw[h] = null;
                } else if (['price', 'stock', 'min_stock_alert'].includes(h)) {
                    raw[h] = Number(v);
                } else if (['is_active', 'is_featured'].includes(h)) {
                    raw[h] = v.toLowerCase() === 'true';
                } else {
                    raw[h] = v;
                }
            });

            // must have at least a name and a non-negative price
            const name = (raw['name'] as string)?.trim();
            const price = raw['price'];
            if (!name || price === null || price === undefined || isNaN(Number(price))) {
                return null;
            }

            // clean up sentinel IDs
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
                is_active: raw['is_active'] != null ? Boolean(raw['is_active']) : true,
                is_featured: raw['is_featured'] != null ? Boolean(raw['is_featured']) : false,
            } as CsvRow;
        });


        const csvRows: CsvRow[] = parseResult.data as CsvRow[];
        const skipped = parseResult.errors;

        if (csvRows.length === 0) {
            return { inserted: 0, priceUpdated: 0, renamed: 0, skipped, details: ['No se encontraron filas válidas en el CSV.'] };
        }

        // ── STEP 2: Load existing products (lean) ─────────────────────────
        const existing: ImportProductSummary[] = await firstValueFrom(this.productRepo.getAllForImport());

        // Build fast lookup indexes
        const byId   = new Map<string, ImportProductSummary>();
        const bySku  = new Map<string, ImportProductSummary>();
        const byName = new Map<string, ImportProductSummary>(); // normalised name → product

        for (const p of existing) {
            byId.set(p.id, p);
            if (p.sku) bySku.set(p.sku.trim().toLowerCase(), p);
            byName.set(this._normaliseName(p.name), p);
        }

        // ── STEP 3: Classify ───────────────────────────────────────────────
        const priceUpdates: BulkPriceUpdate[] = [];   // existing – price only (±name fix)
        const toInsert: Partial<Product>[] = [];       // truly new products

        for (const row of csvRows) {
            const found = this._findExisting(row, byId, bySku, byName);

            if (found) {
                // Product EXISTS → only update fields allowed
                const update: BulkPriceUpdate = { id: found.id, price: row.price };

                // Rename only if current name is a generic "repuesto" variant
                if (this._isGenericRepuesto(found.name) && row.name && !this._isGenericRepuesto(row.name)) {
                    update.newName = row.name;
                }

                priceUpdates.push(update);
            } else {
                // Product does NOT EXIST → prepare for insertion
                const slug = row.slug || StringUtils.slugify(row.name);
                toInsert.push({
                    name: row.name,
                    slug: slug,
                    price: row.price,
                    stock: row.stock ?? 1,
                    sku: row.sku || undefined,
                    barcode: row.barcode || undefined,
                    description: row.description || '',
                    category_id: row.category_id || undefined,
                    brand_id: row.brand_id || undefined,
                    image_url: row.image_url || undefined,
                    is_active: row.is_active ?? true,
                    is_featured: row.is_featured ?? false,
                });
            }
        }

        // ── STEP 4: Execute ────────────────────────────────────────────────
        let priceUpdated = 0;
        let renamed = 0;
        let inserted = 0;

        const details: string[] = [];

        // 4a. Bulk price updates
        if (priceUpdates.length > 0) {
            const { updated, errors: updateErrors } = await firstValueFrom(
                this.productRepo.bulkUpdatePrices(priceUpdates)
            );
            priceUpdated = priceUpdates.filter(u => !u.newName).length;
            renamed = priceUpdates.filter(u => !!u.newName).length;
            const effectivelyUpdated = updated;
            details.push(`✅ ${effectivelyUpdated} productos actualizados (precio${renamed > 0 ? ` + ${renamed} renombrados` : ''}).`);
            if (updateErrors > 0) {
                details.push(`⚠️ ${updateErrors} actualizaciones fallaron.`);
            }
        }

        // 4b. Bulk inserts in batches of 100
        if (toInsert.length > 0) {
            const INSERT_CHUNK = 100;
            for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
                const chunk = toInsert.slice(i, i + INSERT_CHUNK);
                try {
                    const upserted = await firstValueFrom(this.productRepo.upsertMany(chunk));
                    inserted += upserted.length;
                } catch (e: any) {
                    details.push(`⚠️ Error al insertar lote ${Math.floor(i / INSERT_CHUNK) + 1}: ${e.message}`);
                }
            }
            details.push(`🆕 ${inserted} productos nuevos insertados.`);
        }

        if (skipped > 0) {
            details.push(`⛔ ${skipped} filas omitidas (datos inválidos o mal formateados).`);
        }

        return { inserted, priceUpdated, renamed, skipped, details };
    }

    // ────────────────────────────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────────────────────────────

    /** Try to match a CSV row to an existing product by ID → SKU → Name */
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

    /** Normalise a product name for comparison: lowercase, trim, collapse spaces */
    private _normaliseName(name: string): string {
        return (name || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }

    /**
     * Returns true if a product name is a generic "repuesto" marker.
     * Covers: "Repuesto", "repuesto", "Repuesto Generic", "Repuesto Samsung", etc.
     */
    private _isGenericRepuesto(name: string): boolean {
        const n = (name || '').trim().toLowerCase();
        return n === 'repuesto' || n.startsWith('repuesto ') || n.endsWith(' repuesto');
    }

    // ────────────────────────────────────────────────────────────────────────
    // Bulk operations (used by BulkEditModal)
    // ────────────────────────────────────────────────────────────────────────

    async bulkUpdate(ids: string[], payload: Partial<Product>): Promise<void> {
        const updates = ids.map(id => ({ id, ...payload }));
        await firstValueFrom(this.productRepo.updateMany(updates));
    }

    async bulkCustomUpdate(updates: Partial<Product>[]): Promise<void> {
        await firstValueFrom(this.productRepo.upsertMany(updates));
    }

    async bulkIncreasePrice(ids: string[], percentage: number): Promise<void> {
        const response = await firstValueFrom(this.productRepo.findWithFilters({ ids: ids }));
        const products = response.data;

        if (!products || products.length === 0) return;

        const updates = products.map(p => ({
            id: p.id,
            price: Math.round(p.price * (1 + percentage / 100))
        }));

        await firstValueFrom(this.productRepo.updateMany(updates));
    }
}
