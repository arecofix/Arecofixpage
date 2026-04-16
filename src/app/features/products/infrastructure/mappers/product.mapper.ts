import { Product } from '../../domain/entities/product.entity';

export class ProductMapper {
  static mapFromDb(p: any, branchId?: string): Product {
    const isFeatured = Boolean(p['featured'] ?? p['is_featured'] ?? false);
    let displayedStock = 0;
    const branchStockList = p.branch_stock && Array.isArray(p.branch_stock) ? p.branch_stock : [];
    
    if (branchId) {
       const specificBranch = branchStockList.find((b: any) => b.branch_id === branchId);
       displayedStock = specificBranch ? Number(specificBranch.quantity) : 0;
    } else if (branchStockList.length > 0) {
       displayedStock = branchStockList.reduce((acc: number, curr: any) => acc + (Number(curr.quantity) || 0), 0);
    } else {
       displayedStock = Number(p['stock'] || 0);
    }

    return {
          id: p['id'] as string,
          name: p['name'] as string,
          slug: p['slug'] as string,
          description: p['description'] as string,
          price: Number(p['price']),
          image_url: p['image_url'] as string,
          gallery_urls: p['gallery_urls'] || (p['image_url'] ? [p['image_url']] : []),
          category_id: p['category_id'] as string,
          brand_id: p['brand_id'] as string,
          stock: displayedStock,
          is_active: Boolean(p['is_active']),
          is_featured: isFeatured,
          sku: p['sku'] as string || '',
          barcode: p['barcode'] as string || '',
          currency: p['currency'] as 'ARS' | 'USD' || 'ARS',
          unit_cost_at_time: p['unit_cost_at_time'] ? Number(p['unit_cost_at_time']) : 0,
          min_stock_alert: p['min_stock_alert'] ? Number(p['min_stock_alert']) : undefined,
          is_global: Boolean(p['is_global']),
          created_at: p['created_at'] as string,
          updated_at: p['updated_at'] as string,
          branch_stock: p.branch_stock,
          branches: p.branches
    };
  }
}
