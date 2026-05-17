import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { TenantService } from './tenant.service';
import { BranchRepository } from '../repositories/branch.repository';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { LoggerService } from './logger.service';

import { Branch } from '@app/shared/interfaces/branch.interface';
export type { Branch };

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);
  private branchRepo = inject(BranchRepository);
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  
  private _currentBranch = signal<Branch | null>(null);
  public currentBranch = this._currentBranch.asReadonly();
  public currentBranchId = computed(() => this._currentBranch()?.id || null);

  // Simple runtime cache for branches by slug
  private branchCache = new Map<string, Branch>();

  constructor() {
    this.hydrateFromStorage();
  }

  /**
   * Carga la sucursal guardada en persistencia local
   */
  private async hydrateFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return;

    // Si estamos cargando directamente la URL de Sede Central, ignoramos la hidratación del caché
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(s => s);
    if (pathSegments.length > 0 && pathSegments[0] === 'admin') {
      console.log('[BranchService] Sede Central URL detected on initialization, bypassing localStorage hydration.');
      this.setCurrentBranch(null);
      return;
    }

    const savedId = localStorage.getItem('arecofix_current_branch_id');
    if (savedId && savedId !== 'global') {
      try {
        // We do it asynchronously to not block constructor, but set signal asap
        await this.setBranchById(savedId);
        console.log('[BranchService] Context hydrated from storage:', this._currentBranch()?.name);
      } catch (e) {
        console.warn('[BranchService] Hydration failed:', e);
      }
    }
  }

  /**
   * Establece la sucursal activa en el contexto actual
   */
  setCurrentBranch(branch: Branch | null): void {
    this._currentBranch.set(branch);
    if (typeof window !== 'undefined' && window.localStorage) {
      if (branch) {
        if (branch.slug) this.branchCache.set(branch.slug, branch);
        localStorage.setItem('arecofix_current_branch_id', branch.id);
      } else {
        localStorage.removeItem('arecofix_current_branch_id');
      }
    }
  }

  /**
   * Sets the active branch by its unique ID.
   * If ID is null or 'global', it resets to the global context.
   */
  async setBranchById(id: string | null): Promise<void> {
    if (!id || id === 'global') {
      this.setCurrentBranch(null);
      return;
    }

    if (this._currentBranch()?.id === id) return;

    // Try to find in cache or repo
    const branches = await firstValueFrom(this.branchRepo.getWhere('id', id));
    if (branches && branches.length > 0) {
      this.setCurrentBranch(branches[0] as Branch);
    } else {
      console.warn('[BranchService] Branch not found by ID:', id);
      this.setCurrentBranch(null);
    }
  }

  /**
   * Obtiene el ID de la sucursal activa
   */
  getCurrentBranchId(): string | null {
    return this._currentBranch()?.id || null;
  }

  /**
   * Resolves the most appropriate branch ID for an operation.
   * Priority: Active Context > Provided Profile > Global Profile Context > SuperAdmin Central Fallback.
   */
  async resolveEffectiveBranchId(inputProfile?: any): Promise<string | null> {
    // 1. Check current active signal context
    const contextId = this.currentBranchId();
    if (contextId) return contextId;

    // 2. Check provided or global user profile assignment
    const profile = inputProfile || this.auth.getCurrentProfile();
    if (profile?.branch_id) return profile.branch_id;

    // 3. SuperAdmin Fallback to Central Branch
    if (this.auth.isSuperAdmin()) {
      try {
        const branches = await this.getAllAdminBranches();
        const central = branches.find(b => b.name?.toLowerCase().includes('central')) || branches[0];
        return central?.id || null;
      } catch (err) {
        this.logger.error('[BranchService] Failed to resolve fallback branch', err);
      }
    }

    return null;
  }

  /**
   * Obtiene la información completa de una sucursal basándose en su slug
   */
  async getBranchBySlug(slug: string): Promise<Branch | null> {
    if (!slug) return null;
    
    // Check cache first
    if (this.branchCache.has(slug)) {
      return this.branchCache.get(slug)!;
    }

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

    // Delega al repositorio buscar de forma aislada
    const branches = await firstValueFrom(this.branchRepo.getWhere('slug', slug));
    
    if (!branches || branches.length === 0 || !branches[0].is_active) {
      return null;
    }

    const branch = branches[0] as Branch;
    this.branchCache.set(slug, branch);
    return branch;
  }

  /**
   * Obtiene todos los productos aplicables a una sucursal, aplicando el margen de 
   * reventa para aquellos productos globales que vengan de la central.
   */
  async getBranchCatalog(branchId: string, globalMarkup: number): Promise<Product[]> {
    // Consulta robusta con soporte para UUIDs y filtrado de catálogo activo.
    const { data: products, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`branch_id.eq.${branchId},is_global.is.true`);

    if (error) {
      console.error('[BranchService] Catalog error:', error);
      return [];
    }
    
    if (!products) return [];

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

  // --- ADMIN SETTINGS METHODS ---

  async getAllAdminBranches(): Promise<Branch[]> {
    return (await firstValueFrom(this.branchRepo.getAll({ column: 'name' }))) as Branch[];
  }

  async addBranch(payload: Partial<Branch>, slug: string): Promise<void> {
    const branding = payload.branding_settings || {
        logo_url: null,
        favicon_url: null,
        primary_color: '#3b82f6',
        owner_name: ''
    };

    await firstValueFrom(this.branchRepo.create({
        name: payload.name,
        address: payload.address,
        slug: slug,
        global_markup_percentage: payload.global_markup_percentage,
        is_active: payload.is_active,
        plan_id: payload.plan_id || 'basic',
        official_name: payload.official_name || payload.name,
        contact_email: payload.contact_email,
        contact_phone: payload.contact_phone,
        whatsapp_number: payload.whatsapp_number,
        tax_id: payload.tax_id,
        bank_info: payload.bank_info || {},
        branding_settings: branding,
        modules_config: payload.modules_config || {
            dashboard: true,
            repairs: false,
            inventory: false,
            customers: true
        }
    }));
  }

  async updateBranch(branch: Branch): Promise<void> {
    await firstValueFrom(this.branchRepo.update(branch.id, {
        name: branch.name,
        address: branch.address,
        slug: branch.slug,
        global_markup_percentage: branch.global_markup_percentage,
        is_active: branch.is_active,
        plan_id: branch.plan_id,
        official_name: branch.official_name,
        contact_email: branch.contact_email,
        contact_phone: branch.contact_phone,
        whatsapp_number: branch.whatsapp_number,
        tax_id: branch.tax_id,
        branding_settings: branch.branding_settings,
        modules_config: branch.modules_config,
        bank_info: branch.bank_info
    }));
  }

  async deleteBranch(id: string): Promise<void> {
    await firstValueFrom(this.branchRepo.delete(id));
  }

  async toggleBranchStatus(branch: Branch): Promise<void> {
    await firstValueFrom(this.branchRepo.update(branch.id, { is_active: !branch.is_active }));
  }

  async uploadLogo(file: File): Promise<string> {
    return this.branchRepo.uploadLogo(file);
  }
}
