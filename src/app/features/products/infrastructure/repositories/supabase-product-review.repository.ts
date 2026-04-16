import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { ProductReview, ProductReviewBaseRepository } from '../../domain/repositories/product-review.repository';

@Injectable({
  providedIn: 'root'
})
export class SupabaseProductReviewRepository extends ProductReviewBaseRepository {
  private authService = inject(AuthService);

  async getByProductId(productId: string): Promise<ProductReview[]> {
    const supabase = this.authService.getSupabaseClient();
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(review: ProductReview): Promise<{ error: any }> {
    const supabase = this.authService.getSupabaseClient();
    const { error } = await supabase
      .from('product_reviews')
      .insert(review);
    
    return { error };
  }
}
