import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Product } from '@app/features/products/domain/entities/product.entity';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-products-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage implements OnInit {
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  products: Product[] = [];
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
      this.cdr.markForCheck();
    }
  }
}