export interface iProductsResponse {
  first: number;
  prev: null | number;
  next: null | number;
  last: number;
  pages: number;
  items: number;
  data: iProduct[];
}

export interface iProduct {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
  image_url?: string;
  gallery_urls?: string[];
}

export interface iProductsParams extends Partial<iProduct> {
  _page?: number;
  _per_page?: number;
}
