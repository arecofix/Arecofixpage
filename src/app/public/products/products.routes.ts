import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    title: 'Products by Category',
    path: 'category/:categorySlug',
    loadComponent: () =>
      import(
        '@app/public/products/pages/by-category/products-by-category-page'
      ),
  },
  {
    title: 'Product Details',
    path: 'details/:productSlug',
    loadComponent: () =>
      import('@app/public/products/pages/details/products-details-page'),
  },
  {
    title: 'Featured Product',
    path: 'featured',
    loadComponent: () =>
      import('@app/public/products/pages/featured/products-featured-page'),
  },
];

export default productsRoutes;
