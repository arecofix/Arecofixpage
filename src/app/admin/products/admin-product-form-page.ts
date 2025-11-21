import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-product-form-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  id: string | null = null;
  form = signal({
    sku: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    is_active: true,
    images: [] as string[],
  });

  loading = true;
  saving = false;
  error: string | null = null;

  async ngOnInit() {
    const supabase = this.auth.getSupabaseClient();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const { data, error } = await supabase.from('products').select('*').eq('id', this.id).single();
      if (error) {
        this.error = error.message;
      } else if (data) {
        this.form.set({
          sku: data.sku || '',
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          price: data.price || 0,
          stock: data.stock || 0,
          is_active: data.is_active ?? true,
          images: data.images || [],
        });
      }
    }
    this.loading = false;
  }

  async onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;
    const supabase = this.auth.getSupabaseClient();
    const filePath = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('product-images').upload(filePath, file);
    if (error) {
      this.error = error.message;
      return;
    }
    const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path);
    this.form.update((f) => ({ ...f, images: [...f.images, publicUrl.publicUrl] }));
  }

  async save() {
    this.saving = true;
    this.error = null;
    const supabase = this.auth.getSupabaseClient();
    const payload = { ...this.form() };
    if (!payload.slug) {
      payload.slug = this.slugify(payload.name);
    }

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