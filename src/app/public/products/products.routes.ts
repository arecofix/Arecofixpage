import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  // Special route to show Repuestos content when visiting products/category/repuestos
  {
    title: 'Repuestos',
    path: 'category/repuestos',
    loadComponent: () =>
      import('@app/public/repuestos/repuestos').then((m) => m.RepuestosComponent),
  },
  // Redirect /products/category/cursos to /cursos
  {
    path: 'category/cursos',
    redirectTo: '/cursos',
    pathMatch: 'full'
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
