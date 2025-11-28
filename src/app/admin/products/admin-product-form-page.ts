import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminProductService } from './services/admin-product.service';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);
  private cdr = inject(ChangeDetectorRef);

  id: string | null = null;
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

  brands = signal<any[]>([]);
  categories = signal<any[]>([]);

  loading = true;
  saving = false;
  uploading = signal(false);
  error: string | null = null;

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

  async onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    try {
      const publicUrl = await this.productService.uploadImage(file);
      this.form.update((f) => ({ ...f, images: [...f.images, publicUrl] }));
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.uploading.set(false);
      this.cdr.markForCheck();
    }
  }

  removeImage(index: number) {
    this.form.update((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
    this.cdr.markForCheck();
  }

  generateBarcode() {
    const sku = this.form().sku;
    const barcode = sku ? sku : `GEN-${Date.now()}`;
    this.form.update(f => ({ ...f, barcode }));
  }

  async save() {
    this.saving = true;
    this.error = null;
    const formVal = this.form();

    let slug = formVal.slug;
    if (!slug) {
      slug = this.productService.slugify(formVal.name);
    }

    const payload: any = {
      sku: formVal.sku,
      barcode: formVal.barcode,
      name: formVal.name,
      slug: slug,
      description: formVal.description,
      price: formVal.price,
      stock: formVal.stock,
      brand_id: formVal.brand_id || null,
      category_id: formVal.category_id || null,
      is_active: formVal.is_active,
      gallery_urls: Array.isArray(formVal.images) ? formVal.images : [],
      image_url: formVal.images.length > 0 ? formVal.images[0] : null
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
}