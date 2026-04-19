import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdminProductService } from './services/admin-product.service';
import { ProductImagesManagerComponent } from './components/product-images-manager/product-images-manager.component';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ProductImagesManagerComponent],
  templateUrl: './admin-product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

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
    is_active: true,
    is_global: true,
    branch_id: '',
    images: [] as any[], // Now holds { url: string, color?: string }
    unit_cost_at_time: 0,
  };

  // Resources
  brands = signal<any[]>([]);
  categories = signal<any[]>([]);
  branches = signal<any[]>([]);

  // UI State
  loading = true;
  saving = false;
  uploading = signal(false); // Can be controlled by child
  error: string | null = null;
  activeTab = signal<'general' | 'price' | 'media'>('general');

  async ngOnInit() {
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
            is_global: data.is_global ?? true,
            branch_id: data.branch_id || '',
            images: data.media_metadata && data.media_metadata.length > 0 
                    ? data.media_metadata 
                    : (data.gallery_urls || (data.image_url ? [data.image_url] : [])).map(url => ({ url, color: '' })),
            unit_cost_at_time: data.unit_cost_at_time || 0,
          };
        }
      }
    } catch (e: any) {
      this.error = e.message || 'Error al cargar datos';
      this.notificationService.showError(this.error || '');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
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

  async save() {
    this.saving = true;
    this.error = null;
    const formVal = this.formVal;

    // Basic Validation
    if (!formVal.name || formVal.price < 0) {
        this.error = 'Por favor complete los campos requeridos correctamente.';
        this.saving = false;
        this.cdr.markForCheck();
        return;
    }

    let slug = formVal.slug;
    if (!slug) {
      slug = this.productService.slugify(formVal.name);
    }

    // Only include fields that exist in the database schema
    const payload: any = {
      name: formVal.name,
      slug: slug,
      description: formVal.description,
      price: formVal.price,
      currency: formVal.currency,
      stock: formVal.stock,
      brand_id: formVal.brand_id || null,
      category_id: formVal.category_id || null,
      is_active: formVal.is_active,
      is_global: formVal.is_global,
      branch_id: formVal.branch_id || null,
      image_url: formVal.images.length > 0 ? formVal.images[0].url : null, // Main image
      unit_cost_at_time: formVal.unit_cost_at_time || 0,
    };

    // Add optional fields only if they have values
    if (formVal.sku) payload.sku = formVal.sku;
    if (formVal.barcode) payload.barcode = formVal.barcode;
    
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
    } catch (e: any) {
      this.error = e.message || 'Error al guardar producto';
      this.notificationService.showError(this.error || '');
      console.error('Save error:', e);
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  handleUploadError(msg: string) {
    this.error = msg;
    this.cdr.markForCheck();
    // Auto clear error after 3s
    setTimeout(() => {
        this.error = null;
        this.cdr.markForCheck();
    }, 3000);
  }
}