import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdminProductService } from './services/admin-product.service';
import { ProductImagesManagerComponent } from './components/product-images-manager/product-images-manager.component';
import { NotificationService } from '@app/core/services/notification.service';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { AdminLayout } from '@app/admin/layout/admin-layout';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ProductImagesManagerComponent],
  templateUrl: './admin-product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);
  private adminLayout = inject(AdminLayout, { optional: true });
  private branchContextService = inject(BranchContextService);

  id: string | null = null;
  
  // Form State
  formVal = {
    sku: '',
    barcode: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    currency: 'ARS',
    stock: 0,
    brand_id: '',
    category_id: '',
    is_active: true, is_featured: false,
    is_global: true,
    branch_id: '',
    model_id: '',
    specifications: {} as Record<string, any>,
    images: [] as any[], // Now holds { url: string, color?: string }
    cost_price: 0,
    meta_title: '',
    meta_description: '',
    og_image: '',
    ml_category_id: '',
    
    // Marketing & Logistics
    offer_start_date: '',
    offer_end_date: '',
    warranty_days: 0,
    tax_percentage: 21,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    seo_keywords: '',
    sale_price: 0,
    reference_exchange_rate: 0,
    free_shipping: false,
    supplier_id: '',
    condition: 'Nuevo',
    warranty_type: 'Sin garantía',
    includes_tax: true,
    tags: '',
    
    // Variants
    variants: [] as any[],
  };

  // Resources
  brands = signal<Brand[]>([]);
  categories = signal<Category[]>([]);
  branches = signal<Branch[]>([]);

  // UI State
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  uploading = signal(false); // Can be controlled by child
  error = signal<string | null>(null);
  activeTab = signal<'general' | 'price' | 'media'>('general');

  async ngOnInit() {
    // Cerrar el menú lateral automáticamente para mejor experiencia de llenado de formulario
    if (this.adminLayout) {
      this.adminLayout.isMainMenuOpen.set(false);
    }

    try {
      const [brands, categories, branches] = await Promise.all([
        this.productService.getBrands(),
        this.productService.getCategories(),
        this.productService.getBranches()
      ]);

      this.brands.set(brands);
      this.categories.set(categories);
      this.branches.set(branches);

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        const data = await this.productService.getProduct(this.id);
        if (data) {
          const specs = data.specifications || {};
          this.formVal = {
            sku: data.sku || '',
            barcode: data.barcode || '',
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            price: data.price || 0,
            currency: data.currency || 'ARS',
            stock: data.stock || 0,
            brand_id: data.brand_id || '',
            category_id: data.category_id || '',
            is_active: data.is_active ?? true, 
            is_featured: data.is_featured ?? false,
            is_global: data.is_global ?? true,
            branch_id: data.branch_id || '',
            model_id: data.model_id || '',
            specifications: specs,
            images: data.media_metadata && data.media_metadata.length > 0 
                    ? data.media_metadata 
                    : (data.gallery_urls || (data.image_url ? [data.image_url] : [])).map(url => ({ url, color: '' })),
            cost_price: data.cost_price || 0,
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            og_image: data.og_image || '',
            ml_category_id: data.ml_category_id || specs['ml_category_id'] || '',
            offer_start_date: data.offer_start_date ? data.offer_start_date.substring(0, 16) : '',
            offer_end_date: data.offer_end_date ? data.offer_end_date.substring(0, 16) : '',
            warranty_days: data.warranty_days ?? specs['warranty_days'] ?? 0,
            tax_percentage: data.tax_percentage ?? specs['tax_percentage'] ?? 21,
            weight: data.weight ?? specs['weight'] ?? 0,
            dimensions: data.dimensions || specs['dimensions'] || { length: 0, width: 0, height: 0 },
            seo_keywords: data.seo_keywords || specs['seo_keywords'] || '',
            sale_price: data.sale_price ?? specs['sale_price'] ?? 0,
            reference_exchange_rate: data.reference_exchange_rate ?? specs['reference_exchange_rate'] ?? 0,
            free_shipping: data.free_shipping ?? specs['free_shipping'] ?? false,
            supplier_id: data.supplier_id || specs['supplier_id'] || '',
            condition: data.condition || specs['condition'] || 'Nuevo',
            warranty_type: data.warranty_type || specs['warranty_type'] || 'Sin garantía',
            includes_tax: data.includes_tax ?? specs['includes_tax'] ?? true,
            tags: data.tags ? data.tags.join(', ') : (Array.isArray(specs['tags']) ? specs['tags'].join(', ') : ''),
            variants: data.variants ? [...data.variants] : [],
          };
        }
      } else {
        // En creación de producto, asignar la sucursal actual por defecto
        this.formVal.branch_id = this.branchContextService.getBranchId() || '';
      }
    } catch (e: unknown) {
      this.error.set((e instanceof Error ? e.message : String(e)) || 'Error al cargar datos');
      this.notificationService.showError(this.error() || '');
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (!this.saving()) {
        this.save();
      }
    } else if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON') {
        event.preventDefault();
        if (!this.saving()) {
          this.save();
        }
      }
    }
  }

  generateBarcode() {
    const sku = this.formVal.sku;
    this.formVal.barcode = sku ? sku : `GEN-${Date.now()}`;
    this.cdr.markForCheck();
  }

  generateSlug() {
    const name = this.formVal.name;
    if (name) {
      this.formVal.slug = this.productService.slugify(name);
      this.cdr.markForCheck();
    }
  }

  addVariant() {
    this.formVal.variants.push({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      sku: '',
      barcode: '',
      price: null,
      stock: 0,
      attributes: {},
      is_active: true
    });
    this.cdr.markForCheck();
  }

  removeVariant(index: number) {
    this.formVal.variants.splice(index, 1);
    this.cdr.markForCheck();
  }

  async save() {
    this.saving.set(true);
    this.error.set(null);
    const formVal = this.formVal;

    // Robust Validations
    if (!formVal.name || !formVal.name.trim()) {
        this.error.set('Por favor ingrese el nombre del producto.');
        this.saving.set(false);
        this.cdr.markForCheck();
        return;
    }

    if (formVal.price === null || formVal.price === undefined || formVal.price < 0 || isNaN(Number(formVal.price))) {
        this.error.set('El precio debe ser un número válido mayor o igual a 0.');
        this.saving.set(false);
        this.cdr.markForCheck();
        return;
    }

    if (formVal.stock !== null && formVal.stock !== undefined && (Number(formVal.stock) < 0 || isNaN(Number(formVal.stock)))) {
        this.error.set('El stock debe ser un número mayor o igual a 0.');
        this.saving.set(false);
        this.cdr.markForCheck();
        return;
    }

    if (formVal.cost_price !== null && formVal.cost_price !== undefined && (Number(formVal.cost_price) < 0 || isNaN(Number(formVal.cost_price)))) {
        this.error.set('El costo de compra debe ser mayor o igual a 0.');
        this.saving.set(false);
        this.cdr.markForCheck();
        return;
    }

    let slug = formVal.slug ? formVal.slug.trim() : '';
    if (!slug) {
      slug = this.productService.slugify(formVal.name);
    }

    // Encapsulate UI-specific non-column fields into specifications JSONB
    const specifications: Record<string, any> = {
      ...(formVal.specifications || {}),
      condition: formVal.condition || 'Nuevo',
      warranty_type: formVal.warranty_type || 'Sin garantía',
      includes_tax: Boolean(formVal.includes_tax),
      free_shipping: Boolean(formVal.free_shipping),
      supplier_id: formVal.supplier_id ? formVal.supplier_id.trim() : null,
      reference_exchange_rate: formVal.reference_exchange_rate ? Number(formVal.reference_exchange_rate) : null,
      tags: formVal.tags ? formVal.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      ml_category_id: formVal.ml_category_id ? formVal.ml_category_id.trim() : null
    };

    // Clean payload strictly adhering to database schema
    const payload: any = {
      name: formVal.name.trim(),
      slug: slug,
      description: formVal.description ? formVal.description.trim() : '',
      price: Number(formVal.price) || 0,
      currency: formVal.currency || 'ARS',
      stock: Number(formVal.stock) || 0,
      brand_id: formVal.brand_id || null,
      category_id: formVal.category_id || null,
      is_active: Boolean(formVal.is_active),
      is_featured: Boolean(formVal.is_featured),
      is_global: Boolean(formVal.is_global),
      branch_id: formVal.branch_id || null,
      model_id: formVal.model_id || null,
      specifications: specifications,
      image_url: formVal.images.length > 0 ? formVal.images[0].url : null,
      cost_price: Number(formVal.cost_price) || 0,
      meta_title: formVal.meta_title?.trim() || formVal.name?.trim() || null,
      meta_description: formVal.meta_description?.trim() || (formVal.description ? formVal.description.substring(0, 160).trim() : null),
      og_image: formVal.og_image?.trim() || (formVal.images.length > 0 ? formVal.images[0].url : null),
      
      // Marketing & Logistics
      offer_start_date: formVal.offer_start_date ? new Date(formVal.offer_start_date).toISOString() : null,
      offer_end_date: formVal.offer_end_date ? new Date(formVal.offer_end_date).toISOString() : null,
      warranty_days: Number(formVal.warranty_days) || 0,
      tax_percentage: Number(formVal.tax_percentage) || 21,
      weight: formVal.weight ? Number(formVal.weight) : null,
      dimensions: formVal.dimensions || { length: 0, width: 0, height: 0 },
      seo_keywords: formVal.seo_keywords?.trim() || null,
      sale_price: formVal.sale_price ? Number(formVal.sale_price) : null,
      
      // Variants
      variants: formVal.variants
    };

    // Add optional identifiers only if present
    if (formVal.sku) payload.sku = formVal.sku.trim();
    if (formVal.barcode) payload.barcode = formVal.barcode.trim();
    
    // Store gallery_urls and media_metadata
    if (Array.isArray(formVal.images) && formVal.images.length > 0) {
      payload.gallery_urls = formVal.images.map(img => img.url);
      payload.media_metadata = formVal.images;
    } else {
      payload.gallery_urls = [];
      payload.media_metadata = [];
    }

    try {
      if (this.id) {
        await this.productService.updateProduct(this.id, payload);
        this.notificationService.showSuccess('Producto actualizado correctamente');
      } else {
        await this.productService.createProduct(payload);
        this.notificationService.showSuccess('Producto creado correctamente');
      }
      this.router.navigate(['/admin/products']);
    } catch (e: unknown) {
      this.error.set((e instanceof Error ? e.message : String(e)) || 'Error al guardar producto');
      this.notificationService.showError(this.error() || '');
      console.error('Save error:', e);
    } finally {
      this.saving.set(false);
      this.cdr.markForCheck();
    }
  }

  handleUploadError(msg: string) {
    this.error.set(msg);
    this.cdr.markForCheck();
    // Auto clear error after 3s
    setTimeout(() => {
        this.error.set(null);
        this.cdr.markForCheck();
    }, 3000);
  }

  ngOnDestroy() {
    // Restaurar el menú lateral al salir del formulario
    if (this.adminLayout) {
      this.adminLayout.isMainMenuOpen.set(true);
    }
  }
}

