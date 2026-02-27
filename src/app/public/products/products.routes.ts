import { Routes, UrlSegment } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '', // /productos -> All Products
    loadComponent: () => import('@app/public/products/pages/all/products-all-page').then(m => m.ProductsAllPage),
  },
  {
      path: 'inicio', // /productos/inicio -> Old Index (optional)
      loadComponent: () => import('@app/public/products/pages/index/products-index-page').then(m => m.ProductsIndexPage),
  },

  {
    title: 'Repuestos',
    matcher: (segments: UrlSegment[]) => {
      if (segments.length === 2 &&
        segments[0].path === 'categoria' &&
        segments[1].path.toLowerCase() === 'repuestos') {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () =>
      import('@app/public/repuestos/repuestos').then((m) => m.RepuestosComponent),
  },
  // Redirect /productos/categoria/cursos to /cursos
  {
    path: 'categoria/cursos',
    redirectTo: '/academy',
    pathMatch: 'full'
  },
  {
    title: 'Productos por Categoría',
    matcher: (segments: UrlSegment[]) => {
      if (segments.length >= 2 && segments[0].path === 'categoria') {
        const slug = segments.slice(1).map(s => s.path).join('/');
        // Don't match if it's 'cursos' as that's handled above
        if (slug === 'cursos') return null;
        
        return {
          consumed: segments,
          posParams: {
            categorySlug: new UrlSegment(slug, {})
          }
        };
      }
      return null;
    },
    loadComponent: () =>
      import(
        '@app/public/products/pages/by-category/products-by-category-page'
      ),
  },
  {
    title: 'Detalle de Producto',
    path: 'detalle/:productSlug',
    loadComponent: () =>
      import('@app/public/products/pages/details/products-details-page'),
  },
  {
    title: 'Productos Destacados',
    path: 'destacados', // featured -> destacados
    loadComponent: () =>
      import('@app/public/products/pages/featured/products-featured-page'),
  },
];

export default productsRoutes;
