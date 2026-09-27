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
import { NotificationBaseRepository } from '../../../features/messages/domain/repositories/notification.repository';
import { UserProfileRepository } from '@app/core/repositories/user-profile.repository';
import { ProductsParams, ProductsResponse } from '@app/shared/interfaces/product.interface';
import { ProductsStore } from '@app/features/products/application/services/products.store';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';

// Extracted to AdminProductImportService

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
    private userProfileRepo = inject(UserProfileRepository);
    private productsStore = inject(ProductsStore);
    private stockService = inject(StockManagementService);

    async getProducts(): Promise<Product[]> {
        const user = this.auth.getCurrentUser();
        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            const contextBranchId = this.branchContextService.getBranchId();
            const isGlobalAdmin = this.auth.isSuperAdmin() || profile?.role === ROLES.TENANT_OWNER;
            const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

            // Si es súper administrador o el dueño central
            if (isGlobalAdmin) {
                // Si hay una sucursal seleccionada en el contexto y no es central, filtramos por ella
                if (contextBranchId && !isCentralBranch) {
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

    // --- MERCADO LIBRE ---
    async syncWithMercadoLibre(id: string): Promise<{ success: boolean; ml_item_id: string }> {
        return firstValueFrom(this.productRepo.syncWithMercadoLibre(id));
    }

    async getProductsPaginated(params: ProductsParams): Promise<ProductsResponse> {
        const contextBranchId = this.branchContextService.getBranchId();
        const profile = this.auth.getCurrentProfile();
        const isGlobalAdmin = this.auth.isSuperAdmin() || (profile?.role as string) === 'tenant_owner' || (profile?.role as string) === ROLES.TENANT_OWNER;
        const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

        const enrichedParams = {
            ...params,
            include_inactive: params.include_inactive ?? true,
            branch_id: (isGlobalAdmin && isCentralBranch) ? undefined : (params.branch_id || contextBranchId)
        };
        return firstValueFrom(this.productsStore.getProductsPage(enrichedParams));
    }

    async getProduct(id: string): Promise<Product | null> {
        return firstValueFrom(this.productsStore.getProductDetail(id));
    }

    async getBrands(): Promise<Brand[]> {
        return firstValueFrom(this.brandRepo.getAll());
    }

    async getCategories(): Promise<Category[]> {
        return firstValueFrom(this.categoryRepo.getAll());
    }

    async getBranches(): Promise<Branch[]> {
        if (this.auth.isSuperAdmin()) {
            // Bypass tenant filter for SuperAdmins so they can see all created branches
            const supabase = (this.auth as any).supabase || this.branchRepo['supabase'];
            const { data, error } = await supabase
                .from('branches')
                .select('*')
                .eq('is_active', true)
                .order('name');
            
            if (!error && data) {
                return data as Branch[];
            }
        }
        return firstValueFrom(this.branchRepo.getActiveBranches());
    }

    async getPendingApprovals(): Promise<Product[]> {
        return firstValueFrom(this.productRepo.getPendingApprovals());
    }

    async approveProduct(id: string): Promise<void> {
        await firstValueFrom(this.productRepo.approveProduct(id));
        this.productsStore.clearCache();
    }

    async rejectProduct(id: string): Promise<void> {
        await firstValueFrom(this.productRepo.rejectProduct(id));
        this.productsStore.clearCache();
    }

    async getPendingApprovalsCount(): Promise<number> {
        return firstValueFrom(this.productRepo.getPendingApprovalsCount());
    }

    async createProduct(payload: Partial<Product>): Promise<void> {
        const user = this.auth.getCurrentUser();
        
        // Extract stock and branch_id
        const initialStock = payload.stock;
        let branchId = payload.branch_id || this.branchContextService.getBranchId() || 'de967f68-7b15-44c0-bc98-952ccf06e1e5';
        
        // 🐛 BUGFIX: Anteriormente se eliminaba el branch_id aquí. Ahora lo asignamos
        // explícitamente para asegurar que el producto pertenezca a la sucursal actual.
        payload.branch_id = branchId || undefined;

        if (user) {
            const profile = await this.auth.getUserProfile(user.id);
            if (profile && profile.role === ROLES.STAFF) {
                // Staff-created products require manual approval
                payload.is_active = false;
                payload.is_global = false;
                branchId = profile.branch_id || branchId;
                
                // Trigger approval request for admins
                const tenantId = profile.tenant_id || this.tenantService.getTenantId();

                // Get admins for this tenant to notify them
                const admins = await firstValueFrom(this.userProfileRepo.getAdminsByTenant(tenantId));

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
        const createdProduct = await firstValueFrom(this.productRepo.create(payload as Product));
        
        if (createdProduct && createdProduct.id && branchId && initialStock !== undefined) {
            await this.stockService.updateStock(createdProduct.id, branchId, initialStock);
        }
        
        this.productsStore.clearCache();
    }

    async updateProduct(id: string, payload: Partial<Product>): Promise<void> {
        // Extract stock and branch_id
        const initialStock = payload.stock;
        const branchId = payload.branch_id || this.branchContextService.getBranchId() || 'de967f68-7b15-44c0-bc98-952ccf06e1e5';
        
        // 🐛 BUGFIX: Mantener el branch_id para no perder la asignación del producto.
        payload.branch_id = branchId || undefined;

        await firstValueFrom(this.productRepo.update(id, payload));

        if (branchId && initialStock !== undefined) {
            await this.stockService.updateStock(id, branchId, initialStock);
        }

        this.productsStore.clearCache();
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


    async bulkCustomUpdate(updates: Array<{ id: string; payload: Record<string, any> }>): Promise<void> {
        const products = updates.map(u => ({ id: u.id, ...u.payload }));
        await firstValueFrom(this.productRepo.updateMany(products));
        
        // Ensure stock is updated correctly in the dedicated table per branch
        const branchId = this.branchContextService.getBranchId();
        if (branchId) {
            for (const u of updates) {
                if (u.payload['stock'] !== undefined) {
                    await this.stockService.updateStock(u.id, branchId, u.payload['stock']);
                }
            }
        }

        this.productsStore.clearCache();
    }

    async bulkDelete(ids: string[]): Promise<void> {
        await firstValueFrom(this.productRepo.bulkDelete(ids));
        this.productsStore.clearCache();
    }

    async bulkUpdateCategory(ids: string[], categoryId: string): Promise<void> {
        await firstValueFrom(this.productRepo.bulkUpdateCategory(ids, categoryId));
        this.productsStore.clearCache();
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
        this.productsStore.clearCache();
    }
}
