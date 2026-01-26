import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminProductService } from './services/admin-product.service';
import { ProductImagesManagerComponent } from './components/product-images-manager/product-images-manager.component';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductImagesManagerComponent],
  templateUrl: './admin-product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);

  id: string | null = null;
  
  // Form State
  form = signal({
    sku: '',
    barcode: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    brand_id: '',
    category_id: '',
    is_active: true,
    images: [] as string[],
  });

  // Resources
  brands = signal<any[]>([]);
  categories = signal<any[]>([]);

  // UI State
  loading = true;
  saving = false;
  uploading = signal(false); // Can be controlled by child
  error: string | null = null;
  activeTab = signal<'general' | 'price' | 'media'>('general');

  async ngOnInit() {
    try {
      const [brands, categories] = await Promise.all([
        this.productService.getBrands(),
        this.productService.getCategories()
      ]);

      this.brands.set(brands);
      this.categories.set(categories);

      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id) {
        const data = await this.productService.getProduct(this.id);
        if (data) {
          this.form.set({
            sku: data.sku || '',
            barcode: data.barcode || '',
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            price: data.price || 0,
            stock: data.stock || 0,
            brand_id: data.brand_id || '',
            category_id: data.category_id || '',
            is_active: data.is_active ?? true,
            images: data.gallery_urls || (data.image_url ? [data.image_url] : []),
          });
        }
      }
    } catch (e: any) {
      this.error = e.message || 'Error al cargar datos';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  generateBarcode() {
    const sku = this.form().sku;
    const barcode = sku ? sku : `GEN-${Date.now()}`;
    this.form.update(f => ({ ...f, barcode }));
  }

  generateSlug() {
    const name = this.form().name;
    if (name) {
      const slug = this.productService.slugify(name);
      this.form.update(f => ({ ...f, slug }));
    }
  }

  async save() {
    this.saving = true;
    this.error = null;
    const formVal = this.form();

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
      stock: formVal.stock,
      brand_id: formVal.brand_id || null,
      category_id: formVal.category_id || null,
      is_active: formVal.is_active,
      image_url: formVal.images.length > 0 ? formVal.images[0] : null, // Main image
    };

    // Add optional fields only if they have values
    if (formVal.sku) payload.sku = formVal.sku;
    if (formVal.barcode) payload.barcode = formVal.barcode;
    
    // Store gallery_urls only if the column exists (check if we're updating and it works)
    if (Array.isArray(formVal.images) && formVal.images.length > 0) {
      payload.gallery_urls = formVal.images;
    }

    try {
      if (this.id) {
        await this.productService.updateProduct(this.id, payload);
      } else {
        await this.productService.createProduct(payload);
      }
      this.router.navigate(['/admin/products']);
    } catch (e: any) {
      this.error = e.message || 'Error al guardar producto';
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