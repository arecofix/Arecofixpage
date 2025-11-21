import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage {
  private auth = inject(AuthService);
  products: any[] = [];
  loading = true;
  error: string | null = null;

  async ngOnInit() {
    try {
      const supabase = this.auth.getSupabaseClient();
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      this.products = data || [];
    } catch (e: any) {
      this.error = e.message || 'Error al cargar productos';
    } finally {
      this.loading = false;
    }
  }
}