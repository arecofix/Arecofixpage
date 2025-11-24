import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';

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
  private auth = inject(AuthService);
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
    const supabase = this.auth.getSupabaseClient();

    // Load brands and categories
    const [brandsRes, categoriesRes] = await Promise.all([
      supabase.from('brands').select('*').eq('is_active', true).order('name'),
      supabase.from('categories').select('*').eq('is_active', true).order('name')
    ]);

    if (brandsRes.data) this.brands.set(brandsRes.data);
    if (categoriesRes.data) this.categories.set(categoriesRes.data);

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const { data, error } = await supabase.from('products').select('*').eq('id', this.id).single();
      if (error) {
        this.error = error.message;
      } else if (data) {
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
    this.loading = false;
    this.cdr.markForCheck();
  }

  async onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const filePath = `products/${Date.now()}-${file.name}`;

    try {
      const { data, error } = await supabase.storage.from('public-assets').upload(filePath, file);
      if (error) {
        this.error = error.message;
        return;
      }
      const { data: publicUrl } = supabase.storage.from('public-assets').getPublicUrl(data.path);
      this.form.update((f) => ({ ...f, images: [...f.images, publicUrl.publicUrl] }));
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
    const supabase = this.auth.getSupabaseClient();
    const formVal = this.form();

    let slug = formVal.slug;
    if (!slug) {
      slug = this.slugify(formVal.name);
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
        const { error } = await supabase.from('products').update(payload).eq('id', this.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      this.router.navigate(['/admin/products']);
    } catch (e: any) {
      this.error = e.message || 'Error al guardar producto';
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }
}