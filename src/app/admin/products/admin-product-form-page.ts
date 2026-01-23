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
  privateproductService = inject(AdminProductService); // Fix typo and logic
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
    currency: 'ARS', // Default to ARS
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
            currency: (data as any).currency || 'ARS', // Handle legacy data
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
        return;
    }

    let slug = formVal.slug;
    if (!slug) {
      slug = this.productService.slugify(formVal.name);
    }

    const payload: any = {
      sku: formVal.sku,
      barcode: formVal.barcode,
      name: formVal.name,
      slug: slug, // Ensure unique? Service handles conflict usually or DB constraint
      description: formVal.description,
      price: formVal.price,
      currency: formVal.currency, // New Field
      stock: formVal.stock,
      brand_id: formVal.brand_id || null,
      category_id: formVal.category_id || null,
      is_active: formVal.is_active,
      gallery_urls: Array.isArray(formVal.images) ? formVal.images : [], // List of strings
      image_url: formVal.images.length > 0 ? formVal.images[0] : null // Main image is first
    };

    try {
      if (this.id) {
        await this.productService.updateProduct(this.id, payload);
      } else {
        await this.productService.createProduct(payload);
      }
      this.router.navigate(['/admin/products']);
    } catch (e: any) {
      this.error = e.message || 'Error al guardar producto';
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