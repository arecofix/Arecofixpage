import { Injectable, inject } from '@angular/core';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { ProductRepository, BulkPriceUpdate, ImportProductSummary } from '@app/features/products/domain/repositories/product.repository';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { CategoryRepository } from '@app/features/products/domain/repositories/category.repository';
import { BranchRepository } from '@app/core/repositories/branch.repository';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';
import { CsvService } from '@app/shared/services/csv.service';
import { StringUtils } from '@app/shared/utils/string.utils';
import { firstValueFrom } from 'rxjs';
import { ROLES } from '@app/core/constants/roles.constants';
import { TenantService } from '@app/core/services/tenant.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { environment } from '@env/environment';

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
    unit_cost_at_time?: number;
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
    private tenantService = inject(TenantService);
    private notificationService = inject(NotificationService);
    private branchContextService = inject(BranchContextService);
    private branchRepo = inject(BranchRepository);

    async getProducts(): Promise<Product[]> {
        const user = this.auth.getCurrentUser();
        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            const contextBranchId = this.branchContextService.getBranchId();

            // Si es súper administrador o el dueño central
            if (this.auth.isSuperAdmin() || profile?.role === ROLES.TENANT_OWNER) {
                // Si hay una sucursal seleccionada en el contexto, filtramos por ella
                if (contextBranchId) {
                    return firstValueFrom(this.productRepo.getAll(contextBranchId));
                }
                // Si no, vemos todo
                return firstValueFrom(this.productRepo.getAll());
            }
            // Para empleados, siempre su sucursal
            return firstValueFrom(this.productRepo.getAll(profile?.branch_id));
        }
        return firstValueFrom(this.productRepo.getAll());
    }

    async getProductsPaginated(params: import('@app/public/products/interfaces').ProductsParams): Promise<import('@app/public/products/interfaces').ProductsResponse> {
        const contextBranchId = this.branchContextService.getBranchId();

        const enrichedParams = {
            ...params,
            include_inactive: params.include_inactive ?? true,
            // If superadmin has a branch selected, filter by it. 
            // Note: repository findWithFilters needs to support this.
            branch_id: params.branch_id || contextBranchId
        };
        return firstValueFrom(this.productRepo.findWithFilters(enrichedParams));
    }

    async getProduct(id: string): Promise<Product | null> {
        return firstValueFrom(this.productRepo.getById(id));
    }

    async getBrands(): Promise<Brand[]> {
        return firstValueFrom(this.brandRepo.getAll());
    }

    async getCategories(): Promise<Category[]> {
        return firstValueFrom(this.categoryRepo.getAll());
    }

    async getBranches(): Promise<Branch[]> {
        return firstValueFrom(this.branchRepo.getActiveBranches());
    }

    async getPendingApprovals(): Promise<Product[]> {
        return firstValueFrom(this.productRepo.getPendingApprovals());
    }

    async approveProduct(id: string): Promise<void> {
        await firstValueFrom(this.productRepo.approveProduct(id));
    }

    async rejectProduct(id: string): Promise<void> {
        await firstValueFrom(this.productRepo.rejectProduct(id));
    }

    async getPendingApprovalsCount(): Promise<number> {
        return firstValueFrom(this.productRepo.getPendingApprovalsCount());
    }

    async createProduct(payload: Partial<Product>): Promise<void> {
        const user = this.auth.getCurrentUser();
        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            if (profile && profile.role === ROLES.STAFF) {
                // Si es empleado, se aprueba manual por el dueño. Queda vinculado a la sucursal inactivo.
                payload.is_active = false;
                payload.is_global = false;
                payload.branch_id = profile.branch_id;
                
                // Dispara solicitud al administrador/dueño para revisión
                const supabase = this.auth.getSupabaseClient();
                const tenantId = profile.tenant_id || this.tenantService.getTenantId();

                // Buscar a los administradores del tenant para notificar
                const { data: admins } = await supabase
                    .from('profiles')
                    .select('id')
                    .in('role', [ROLES.ADMIN, ROLES.TENANT_OWNER, ROLES.SUPER_ADMIN])
                    .eq('tenant_id', tenantId);

                if (admins && admins.length > 0) {
                    const noficationsToInsert = admins.map(a => ({
                        tenant_id: tenantId,
                        user_id: a.id,
                        title: 'Nuevo Producto (Requiere Revisión)',
                        message: `El empleado ha solicitado dar de alta el producto: ${payload.name}. Revísalo y apruébalo desde el catálogo.`,
                        type: 'warning',
                        link: '/admin/products'
                    }));
                    await supabase.from('notifications').insert(noficationsToInsert);
                }
            } else if (profile && (profile.role === ROLES.ADMIN || profile.role === ROLES.TENANT_OWNER)) {
                // Admin que crea define por defecto como global y sin branch fija, o puede definir a cuál va.
                if (payload.is_global === undefined) payload.is_global = true; 
            }
        }
        await firstValueFrom(this.productRepo.create(payload as Product));
    }

    async updateProduct(id: string, payload: Partial<Product>): Promise<void> {
        await firstValueFrom(this.productRepo.update(id, payload));
    }

    async getProductsByIds(ids: string[]): Promise<Product[]> {
        if (!ids.length) return [];
        const res = await firstValueFrom(this.productRepo.findWithFilters({ ids }));
        return res.data as unknown as Product[];
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

        this.csvService.exportToCsv(products as any, 'products_export', headers as any);
    }

    /**
     * Specialized export for Meta Product Catalog (Facebook/Instagram Shops)
     * Solves issues with missing titles, links, prices and images.
     */
    async exportToMetaCSV(): Promise<void> {
        const products = await this.getProducts();
        if (!products.length) return;

        // Load brands to map IDs to names
        const brands = await this.getBrands();
        const brandMap = new Map(brands.map(b => [b.id, b.name]));

        const metaProducts = products.map(p => {
            // Ensure absolute image URL
            let imageLink = p.image_url || '';
            if (imageLink && !imageLink.startsWith('http')) {
                // Ensure no double slash if imageLink starts with /
                const cleanPath = imageLink.startsWith('/') ? imageLink.substring(1) : imageLink;
                imageLink = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${cleanPath}`;
            }

            // Ensure absolute product link
            const productLink = `${environment.baseUrl}/productos/${p.slug}`;

            // Format price: Amount + ' ' + ISO Currency (e.g. 1500.00 ARS)
            const priceValue = Number(p.price) || 0;
            const currency = p.currency || 'ARS';
            const formattedPrice = `${priceValue.toFixed(2)} ${currency}`;

            // Meta supported tokens for availability
            const availability = (p.is_active && (p.stock > 0 || p.stock === null)) ? 'in stock' : 'out of stock';
            
            // Ensure we always have a title
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

    /**
     * Audit products for Meta Catalog compliance.
     * Checks for mandatory fields: id, title, description, availability, condition, price, link, image_link, brand.
     */
    async validateProductsForMeta(): Promise<{ id: string, name: string, issues: string[] }[]> {
        const products = await this.getProducts();
        const brands = await this.getBrands();
        const brandMap = new Map(brands.map(b => [b.id, b.name]));
        
        const report: { id: string, name: string, issues: string[] }[] = [];
        const seenIds = new Set<string>();
        const seenSkus = new Set<string>();

        // First pass: collect duplicates
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

            // Meta image validation (Google/Meta requirement)
            if (p.image_url && !p.image_url.startsWith('http')) {
                // If it's a relative path, we check if it follows our pattern
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
                } else if (['price', 'stock', 'min_stock_alert', 'unit_cost_at_time'].includes(h)) {
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
                unit_cost_at_time: raw['unit_cost_at_time'] != null ? Number(raw['unit_cost_at_time']) : undefined,
                is_active: raw['is_active'] != null ? Boolean(raw['is_active']) : true,
                is_featured: raw['is_featured'] != null ? Boolean(raw['is_featured']) : false,
            } as CsvRow;
        });


        const csvRows: CsvRow[] = parseResult.data as CsvRow[];
        const skipped = parseResult.errors;

        if (csvRows.length === 0) {
            return { inserted: 0, priceUpdated: 0, renamed: 0, skipped, details: ['No se encontraron filas válidas en el CSV.'] };
        }

        // ── STEP 2: Load existing metadata ──────────────────────────────
        const [existing, brands, categories] = await Promise.all([
            firstValueFrom(this.productRepo.getAllForImport()),
            this.getBrands(),
            this.getCategories()
        ]);

        // Build fast lookup indexes
        const byId   = new Map<string, ImportProductSummary>();
        const bySku  = new Map<string, ImportProductSummary>();
        const byName = new Map<string, ImportProductSummary>(); // normalised name → product
        const bySlug = new Set<string>();

        for (const p of existing) {
            byId.set(p.id, p);
            if (p.sku) bySku.set(p.sku.trim().toLowerCase(), p);
            byName.set(this._normaliseName(p.name), p);
            bySlug.add(p.slug);
        }

        // Metadata lookups (mutable: we'll add auto-created entries)
        const brandByName = new Map<string, string>();   // normalised name → brand id
        const brandById   = new Set<string>();             // known brand UUIDs
        brands.forEach(b => { brandByName.set(this._normaliseName(b.name), b.id); brandById.add(b.id); });

        const catByName = new Map<string, string>();      // normalised name → category id
        const catById   = new Set<string>();               // known category UUIDs
        categories.forEach(c => { catByName.set(this._normaliseName(c.name), c.id); catById.add(c.id); });

        // ── STEP 2b: Collect all brand/category names from CSV and auto-create missing ones ──
        const details: string[] = [];
        const brandNamesToCreate = new Set<string>();
        const catNamesToCreate = new Set<string>();

        for (const row of csvRows) {
            // Brand: if provided and either NOT a UUID or a UUID that doesn't exist in DB
            if (row.brand_id) {
                if (this._isUuid(row.brand_id)) {
                    // UUID that doesn't exist in DB → treat the CSV value as a problem; strip it
                    // (We cannot reliably create a brand from a UUID string)
                    if (!brandById.has(row.brand_id)) {
                        // Mark as needing strip — handled in STEP 3
                    }
                } else {
                    const normName = this._normaliseName(row.brand_id);
                    if (!brandByName.has(normName)) {
                        brandNamesToCreate.add(normName);
                    }
                }
            }
            // Category: same logic
            if (row.category_id) {
                if (this._isUuid(row.category_id)) {
                    if (!catById.has(row.category_id)) {
                        // invalid UUID → strip in STEP 3
                    }
                } else {
                    const normName = this._normaliseName(row.category_id);
                    if (!catByName.has(normName)) {
                        catNamesToCreate.add(normName);
                    }
                }
            }
        }

        // Auto-create missing brands in parallel
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

        // Auto-create missing categories in parallel
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


        // ── STEP 3: Classify ───────────────────────────────────────────────
        const priceUpdates: BulkPriceUpdate[] = [];   // existing – price only (±name fix)
        const toInsert: Partial<Product>[] = [];       // truly new products
        const usedSlugsInBatch = new Set<string>();

        for (const row of csvRows) {
            const found = this._findExisting(row, byId, bySku, byName);

            if (found) {
                // Product EXISTS → only update fields allowed
                // Cap price to avoid numeric overflow (e.g. numeric(10,2))
                const safePrice = Math.min(row.price, 99999999.99);
                const update: BulkPriceUpdate = { id: found.id, price: safePrice };

                if (this._isGenericRepuesto(found.name) && row.name && !this._isGenericRepuesto(row.name)) {
                    update.newName = row.name;
                }

                priceUpdates.push(update);
            } else {
                // Product does NOT EXIST → prepare for insertion
                
                // Resolve Brand ID — 3-way check:
                // 1. If it's a valid UUID that exists in DB → use it directly
                // 2. If it's a name (or unknown UUID) → look up by normalised name
                // 3. Still not found → strip it (null) to avoid FK violation
                let brandId: string | undefined = undefined;
                if (row.brand_id) {
                    if (this._isUuid(row.brand_id) && brandById.has(row.brand_id)) {
                        brandId = row.brand_id;
                    } else {
                        // Try by name (covers both plain names and unrecognised UUIDs treated as strings)
                        const norm = this._isUuid(row.brand_id)
                            ? undefined  // unknown UUID — can't resolve as name, strip
                            : brandByName.get(this._normaliseName(row.brand_id));
                        brandId = norm;
                    }
                }

                // Resolve Category ID — same 3-way logic
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

                // Ensure unique slug
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
                    unit_cost_at_time: row.unit_cost_at_time || 0,
                    is_active: row.is_active ?? true,
                    is_featured: row.is_featured ?? false,
                });
            }
        }

        // ── STEP 4: Execute ────────────────────────────────────────────────
        let priceUpdated = 0;
        let renamed = 0;
        let inserted = 0;

        // 4a. Bulk price updates
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

        // 4b. Bulk inserts in batches of 100
        if (toInsert.length > 0) {
            const INSERT_CHUNK = 100;
            for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
                const chunk = toInsert.slice(i, i + INSERT_CHUNK);
                try {
                    const upserted = await firstValueFrom(this.productRepo.upsertMany(chunk));
                    inserted += (upserted || []).length;
                } catch (e: any) {
                    console.error('Batch error:', e);
                    let errorMsg = e.message;
                    if (errorMsg.includes('products_brand_id_fkey')) {
                        errorMsg = 'Marca no encontrada (el ID o nombre no coincide)';
                    } else if (errorMsg.includes('numeric field overflow')) {
                        errorMsg = 'Número demasiado grande (precio o stock excede el límite)';
                    } else if (errorMsg.includes('duplicate key')) {
                        errorMsg = 'Nombre o SKU ya existe';
                    }
                    details.push(`⚠️ Error lote ${Math.floor(i / INSERT_CHUNK) + 1}: ${errorMsg}`);
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

    private _isUuid(text: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(text);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Bulk operations (used by BulkEditModal)
    // ────────────────────────────────────────────────────────────────────────

    /** Build minimal clean payloads so only REAL DB columns reach Supabase */
    async bulkCustomUpdate(updates: Array<{ id: string; payload: Record<string, any> }>): Promise<void> {
        const products = updates.map(u => ({ id: u.id, ...u.payload }));
        await firstValueFrom(this.productRepo.updateMany(products));
    }

    async bulkDelete(ids: string[]): Promise<void> {
        await firstValueFrom(this.productRepo.bulkDelete(ids));
    }

    async bulkUpdateCategory(ids: string[], categoryId: string): Promise<void> {
        await firstValueFrom(this.productRepo.bulkUpdateCategory(ids, categoryId));
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
