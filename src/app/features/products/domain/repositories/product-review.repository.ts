export interface ProductReview {
    id?: string;
    product_id: string;
    tenant_id: string;
    user_name: string;
    comment: string;
    rating: number;
    created_at?: string;
}

export abstract class ProductReviewBaseRepository {
    abstract getByProductId(productId: string): Promise<ProductReview[]>;
    abstract create(review: ProductReview): Promise<{ error: any }>;
}
