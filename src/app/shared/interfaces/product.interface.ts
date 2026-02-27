/* eslint-disable */
/* tslint:disable */
export interface ProductsResponse {
  first: number;
  prev?: number;
  next?: number;
  last: number;
  pages: number;
  items: number;
  data: Product[];
}

export interface Product {
  id: string;
  sku?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  sale_price?: number | null;
  stock?: number;
  min_stock_alert?: number;
  category_id?: string | null;
  brand_id?: string | null;
  model_id?: string | null;
  image_url?: string | null;
  gallery_urls?: string[]; // array of strings (text[])
  specifications?: any; // jsonb
  featured?: boolean; // map to 'is_featured' but typically used as 'featured' in frontend, maybe both
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  barcode?: string | null;
  currency?: string;
  tenant_id?: string;
  is_global?: boolean;
  deleted_at?: string | null;
  // some properties kept for backwards compatibility in UI:
  regular_price?: number;
}

export type PageNumber = number;
export type PageSize = number;

export interface ProductsParams extends Partial<Product> {
  _page?: PageNumber;
  _per_page?: PageSize;
  _sort?: string;
  _order?: 'asc' | 'desc';
  category_ids?: string[];
  min_price?: number;
  max_price?: number;
  q?: string;
  ids?: string[];
  include_inactive?: boolean;
}
