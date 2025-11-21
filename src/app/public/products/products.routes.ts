import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  // Special route to show Cursos content when visiting products/category/cursos
  {
    title: 'Cursos',
    path: 'category/cursos',
    loadComponent: () =>
      import('@app/public/cursos/cursos').then((m) => m.CursosComponent),
  },
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
