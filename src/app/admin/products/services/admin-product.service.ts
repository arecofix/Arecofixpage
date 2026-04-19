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
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';
import { NotificationBaseRepository } from '../../../features/messages/domain/repositories/notification.repository';

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
    private notificationRepo = inject(NotificationBaseRepository);

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

    async getProductsPaginated(params: ProductsParams): Promise<ProductsResponse> {
        const contextBranchId = this.branchContextService.getBranchId();

        const enrichedParams = {
            ...params,
            include_inactive: params.include_inactive ?? true,
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
                // Staff-created products require manual approval
                payload.is_active = false;
                payload.is_global = false;
                payload.branch_id = profile.branch_id;
                
                // Trigger approval request for admins
                const tenantId = profile.tenant_id || this.tenantService.getTenantId();

                // Get admins for this tenant to notify them
                const supabase = this.auth.getSupabaseClient();
                const { data: admins } = await supabase
                    .from('profiles')
                    .select('id')
                    .in('role', [ROLES.ADMIN, ROLES.TENANT_OWNER, ROLES.SUPER_ADMIN])
                    .eq('tenant_id', tenantId);

                if (admins && admins.length > 0) {
                    const notifications = (admins as any[]).map(a => ({
                        tenant_id: tenantId,
                        user_id: a.id,
                        title: 'Nuevo Producto (Requiere Revisión)',
                        message: `El empleado ha solicitado dar de alta el producto: ${payload.name}. Revísalo y apruébalo desde el catálogo.`,
                        type: 'warning',
                        link: '/admin/products'
                    }));
                    await this.notificationRepo.createMany(notifications as any);
                }
            } else if (profile && (profile.role === ROLES.ADMIN || profile.role === ROLES.TENANT_OWNER)) {
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

    async importProductsFromCSV(file: File): Promise<ImportReport> {
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

        const [existing, brands, categories] = await Promise.all([
            firstValueFrom(this.productRepo.getAllForImport()),
            this.getBrands(),
            this.getCategories()
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
        const toInsert: Partial<Product>[] = [];       
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
                    unit_cost_at_time: row.unit_cost_at_time || 0,
                    is_active: row.is_active ?? true,
                    is_featured: row.is_featured ?? false,
                });
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
                    const upserted = await firstValueFrom(this.productRepo.upsertMany(chunk));
                    inserted += (upserted || []).length;
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

        if (skipped > 0) {
            details.push(`⛔ ${skipped} filas omitidas.`);
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

    async getInventorySummary(branchId?: string) {
        return firstValueFrom(this.productRepo.getInventorySummary(branchId || this.branchContextService.getBranchId() || undefined));
    }

    async bulkIncreasePrice(ids: string[], percentage: number): Promise<void> {
        const response = await firstValueFrom(this.productRepo.findWithFilters({ ids: ids }));
        const products = response.data;
        if (!products || products.length === 0) return;
        const updates = products.map(p => ({ id: p.id, price: Math.round(p.price * (1 + percentage / 100)) }));
        await firstValueFrom(this.productRepo.updateMany(updates));
    }
}
