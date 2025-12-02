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
  category_id: string;
  brand_id?: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
  image_url?: string;
  gallery_urls?: string[];
}

export type PageNumber = number;
export type PageSize = number;

export interface ProductsParams extends Partial<Product> {
  _page?: PageNumber;
  _per_page?: PageSize;
}
