import { Injectable, inject } from '@angular/core';
import { ProductReview, ProductReviewBaseRepository } from '../../domain/repositories/product-review.repository';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

@Injectable({ providedIn: 'root' })
export class SupabaseProductReviewRepository extends ProductReviewBaseRepository {
  private scoped = inject(TenantScopedQueryService);

  async getByProductId(productId: string): Promise<ProductReview[]> {
    const { data, error } = await this.scoped
      .withTenantScope(this.scoped.from('product_reviews').select('*'))
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(review: ProductReview): Promise<{ error: unknown }> {
    const { error } = await this.scoped
      .from('product_reviews')
      .insert(this.scoped.withTenant({ ...review }));

    return { error };
  }

  async incrementHelpful(reviewId: string): Promise<void> {
    const { error } = await this.scoped.client.rpc('increment_review_helpful', { review_id: reviewId });
    if (error) throw error;
  }
}
