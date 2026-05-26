export abstract class ProductStockRepository {
    abstract updateBranchStock(productId: string, branchId: string, quantity: number, tenantId: string | null): Promise<void>;
    abstract deductStock(productId: string, branchId: string, quantityToDeduct: number, tenantId: string | null): Promise<void>;
}
