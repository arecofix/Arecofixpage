import {
  Component, inject, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, signal
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Branch, BranchLandingConfig, BranchServiceCard, BranchHighlight } from '@app/shared/interfaces/branch.interface';
import { BranchService } from '@app/core/services/branch.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { BranchContextService } from '@app/core/services/branch-context.service';

// ---------------------------------------------------------------------------
// HELPERS: Detectar el tipo de sucursal y elegir defaults apropiados
// Se ejecuta cuando la sucursal no tiene el nuevo formato de modules_config
// ---------------------------------------------------------------------------

/**
 * Determina si el modules_config es "legacy" (solo tiene campos viejos
 * como dashboard/repairs/inventory/customers pero NO los nuevos has_*).
 */
function isLegacyConfig(cfg: BranchLandingConfig): boolean {
  return cfg.has_catalog === undefined
    && cfg.has_services === undefined
    && cfg.has_about === undefined;
}

/**
 * Detecta si la sucursal es orientada a catálogo de productos.
 * En el formato legacy, inventory: true indica que vende productos.
 */
function isCatalogBranch(branch: Branch, cfg: BranchLandingConfig): boolean {
  // 1. Si tiene inventory: true en el config legacy
  if ((cfg as any).inventory === true) return true;
  
  // 2. Casos especiales por slug (Lubreze es una tienda de tecnología/librería)
  const slug = (branch.slug || '').toLowerCase().trim();
  if (slug === 'lubreze' || slug.includes('lubreze')) return true;
  
  // 3. Heurística: si el nombre sugiere una tienda
  const name = (branch.name || '').toLowerCase();
  if (name.includes('shop') || name.includes('tienda') || name.includes('libreria') || name.includes('lubreze')) return true;

  return false;
}

/**
 * Config por defecto para sucursales de CATÁLOGO / TIENDA
 * (ej: Accesorios de Tecnología, Kiosco, Librería, etc.)
 */
function buildCatalogDefaults(branch: Branch): BranchLandingConfig {
  const isLubreze = branch.slug?.toLowerCase()?.includes('lubreze');

  return {
    has_catalog:  true,
    has_services: false,
    has_about:    true,

    hero_title:    isLubreze 
      ? 'Tecnología, Kiosco y Librería (LUBREZE)' 
      : `Bienvenidos a ${branch.official_name || branch.name}`,
    
    hero_subtitle: isLubreze
      ? 'Los mejores accesorios de tecnología, artículos de oficina y regalería en un solo lugar.'
      : 'Encontrá los mejores productos al mejor precio. Calidad garantizada y atención personalizada.',
    
    hero_cta_label: 'Ver Catálogo',

    about_title: `Sobre Nosotros`,
    about_text: isLubreze
      ? `En ${branch.name} nos dedicamos a brindarte soluciones en tecnología y suministros para tu día a día. Variedad, precio y calidad.`
      : `Somos ${branch.official_name || branch.name}, tu tienda de confianza. Nos especializamos en ofrecerte los mejores productos.`,

    highlights: isLubreze ? [
      { icon: '💻', label: 'Tecnología' },
      { icon: '📚', label: 'Librería' },
      { icon: '🍬', label: 'Kiosco' },
      { icon: '💳', label: 'Todos los pagos' },
    ] : [
      { icon: '✅', label: 'Calidad garantizada' },
      { icon: '🚀', label: 'Entrega rápida' },
      { icon: '💳', label: 'Múltiples pagos' },
      { icon: '📦', label: 'Stock disponible' },
    ],

    contact_title: '¿Necesitás algo?',
    contact_subtitle: 'Consultanos por stock o precios. Estamos para ayudarte.',
    contact_area: branch.address || '',
  };
}

/**
 * Config por defecto para sucursales de SERVICIOS / REPARACIONES
 * (sin has_catalog explícito y sin inventory legacy)
 */
function buildServiceDefaults(branch: Branch): BranchLandingConfig {
  return {
    has_catalog:  false,
    has_services: true,
    has_about:    true,

    hero_title:    `¿En qué podemos ayudarte?`,
    hero_subtitle: 'Contanos qué necesitás. Nos encargamos de todo con profesionalismo y puntualidad.',
    hero_cta_label: 'Contactanos',

    about_title: `Lo que hacemos`,
    about_text: `En ${branch.official_name || branch.name} brindamos servicios profesionales con compromiso, calidad y atención personalizada. Tu satisfacción es nuestra prioridad.`,

    highlights: [
      { icon: '🛡️', label: 'Trabajo garantizado' },
      { icon: '🧹', label: 'Limpieza al terminar' },
      { icon: '⏰', label: 'Cumplidor de horarios' },
      { icon: '💰', label: 'Buenos presupuestos' },
    ],

    service_cards: [],

    contact_title: '¡Queremos ayudarte!',
    contact_subtitle: 'Llamanos o escribinos por WhatsApp. ¿Tenés preguntas? No dudes en contactarnos.',
    contact_area: branch.address || '',
  };
}

/**
 * Resuelve la config final de landing fusionando:
 * 1. El default apropiado según tipo de sucursal
 * 2. Los campos de la BD (siempre ganan sobre el default)
 */
function resolveLandingConfig(branch: Branch): BranchLandingConfig {
  const dbConfig = branch.modules_config ?? ({} as BranchLandingConfig);

  if (isLegacyConfig(dbConfig)) {
    // Sucursal con config viejo — detectar tipo
    const baseDefaults = isCatalogBranch(branch, dbConfig)
      ? buildCatalogDefaults(branch)
      : buildServiceDefaults(branch);

    // Los campos legacy se preservan (inventory, repairs, etc.)
    return { ...baseDefaults, ...dbConfig };
  }

  // Sucursal con nuevo config — fusionar con un default mínimo genérico
  const genericBase: BranchLandingConfig = {
    has_catalog:  false,
    has_services: false,
    has_about:    true,
    hero_title:   branch.official_name || branch.name,
    hero_subtitle: 'Bienvenidos. Consultá nuestros servicios y productos.',
    hero_cta_label: 'Contactanos',
    about_title: 'Quiénes somos',
    about_text: `En ${branch.official_name || branch.name} trabajamos con dedicación y compromiso.`,
    highlights: [],
    contact_title: '¡Contactanos!',
    contact_subtitle: 'Estamos para ayudarte.',
  };

  return { ...genericBase, ...dbConfig };
}

@Component({
  selector: 'app-branch-home',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './branch-home.component.html',
  styleUrls: ['./branch-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchHomeComponent implements OnInit {
  private route         = inject(ActivatedRoute);
  private cdr           = inject(ChangeDetectorRef);
  private branchService = inject(BranchService);
  private supabase      = inject(SUPABASE_CLIENT);
  private branchCtx     = inject(BranchContextService);

  branch   = signal<Branch | null>(null);
  landing  = signal<BranchLandingConfig>({} as BranchLandingConfig);
  products = signal<Product[]>([]);
  loading  = signal(true);

  // Paginación
  currentPage   = signal(1);
  readonly pageSize = 12;
  totalProducts = signal(0);
  totalPages    = signal(1);

  get highlights(): BranchHighlight[] {
    return this.landing().highlights ?? [];
  }

  get serviceCards(): BranchServiceCard[] {
    return this.landing().service_cards ?? [];
  }

  ngOnInit(): void {
    const branchData: Branch | null =
      this.route.parent?.snapshot.data['branchData'] ??
      this.route.snapshot.data['branchData'] ??
      null;

    if (!branchData) return;

    this.branch.set(branchData);

    // Resolver la config según el tipo de sucursal
    const resolvedConfig = resolveLandingConfig(branchData);
    
    // Usamos microtask para asegurar que la detección de cambios en modo zoneless
    // capte la actualización del signal correctamente.
    Promise.resolve().then(() => {
      this.landing.set(resolvedConfig);
      this.branchCtx.setResolvedConfig(resolvedConfig);
      
      if (resolvedConfig.has_catalog) {
        this.loadProducts(1);
      } else {
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  async loadProducts(page: number): Promise<void> {
    const branch = this.branch();
    if (!branch) return;

    this.loading.set(true);
    this.currentPage.set(page);
    this.cdr.markForCheck();

    try {
      const from = (page - 1) * this.pageSize;
      const to   = from + this.pageSize - 1;

      const config        = this.landing();
      const includeGlobal = (config as any).inventory !== false;
      const filter        = includeGlobal
        ? `branch_id.eq.${branch.id},is_global.eq.true`
        : `branch_id.eq.${branch.id}`;

      const { data, count, error } = await this.supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .or(filter)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const withMarkup = this.branchService.applyMarkupMapping(
        (data ?? []) as Product[],
        branch.id,
        branch.global_markup_percentage ?? 0
      );

      this.products.set(withMarkup);
      this.totalProducts.set(count ?? 0);
      this.totalPages.set(Math.ceil((count ?? 0) / this.pageSize));
    } catch (err) {
      console.error('[BranchHome] Error loading products:', err);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) this.loadProducts(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.loadProducts(this.currentPage() - 1);
  }
}
