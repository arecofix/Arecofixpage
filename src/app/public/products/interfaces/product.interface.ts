export interface iProductsResponse {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: iProduct[];
}

export interface iProduct {
  id: string;
  category_id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
}

export interface iProductsParams extends Partial<iProduct> {
  _page?: number;
  _per_page?: number;
}
