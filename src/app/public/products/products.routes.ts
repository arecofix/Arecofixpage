import { Routes, UrlSegment } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/public/products/pages/index/products-index-page').then(m => m.ProductsIndexPage),
  },
  // Special route to show Repuestos content when visiting products/category/repuestos

  {
    title: 'Repuestos',
    matcher: (segments: UrlSegment[]) => {
      if (segments.length === 2 &&
        segments[0].path === 'category' &&
        segments[1].path.toLowerCase() === 'repuestos') {
        return { consumed: segments };
      }
      return null;
    },
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
