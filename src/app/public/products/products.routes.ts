import { Routes, UrlSegment } from '@angular/router';

/**
 * Products Routes — Supports hierarchical category paths.
 *
 * URL structure:
 *   /productos                         → All products
 *   /productos/categoria/repuestos     → Repuestos landing (RepuestosComponent)
 *   /productos/categoria/repuestos/modulos   → Products for "modulos" below "repuestos"
 *   /productos/categoria/celulares     → Products for "celulares" category
 *
 * 301 redirects preserve SEO authority for previously-indexed flat URLs:
 *   /productos/categoria/modulos   → /productos/categoria/repuestos/modulos
 *   /productos/categoria/baterias  → /productos/categoria/repuestos/baterias
 *   /productos/categoria/consolas  → /productos/categoria/repuestos/consolas
 */
export const productsRoutes: Routes = [
  // ── Root: all products ───────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('@app/public/products/pages/all/products-all-page').then(
        (m) => m.ProductsAllPage
      ),
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('@app/public/products/pages/index/products-index-page').then(
        (m) => m.ProductsIndexPage
      ),
  },

  // ── 301 Redirects: flat slugs → hierarchical paths ──────────────────────
  // Add subcategories here as the taxonomy grows.
  {
    path: 'categoria/modulos',
    redirectTo: '/productos/categoria/repuestos/modulos',
    pathMatch: 'full',
  },
  {
    path: 'categoria/baterias',
    redirectTo: '/productos/categoria/repuestos/baterias',
    pathMatch: 'full',
  },
  {
    path: 'categoria/pantallas',
    redirectTo: '/productos/categoria/repuestos/pantallas',
    pathMatch: 'full',
  },
  {
    path: 'categoria/pines',
    redirectTo: '/productos/categoria/repuestos/pines',
    pathMatch: 'full',
  },
  {
    path: 'categoria/consolas',
    redirectTo: '/productos/categoria/repuestos/consolas',
    pathMatch: 'full',
  },

  // ── Canonical redirect: courses ─────────────────────────────────────────
  {
    path: 'categoria/cursos',
    redirectTo: '/academy',
    pathMatch: 'full',
  },

  // ── Special landing: /productos/categoria/repuestos ──────────────────────
  // Renders the dedicated RepuestosComponent instead of the generic grid.
  {
    title: 'Repuestos para Celulares y Consolas | Arecofix',
    matcher: (segments: UrlSegment[]) => {
      if (
        segments.length === 2 &&
        segments[0].path === 'categoria' &&
        segments[1].path.toLowerCase() === 'repuestos'
      ) {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () =>
      import('@app/public/repuestos/repuestos').then(
        (m) => m.RepuestosComponent
      ),
  },

  // ── Generic multi-segment category matcher ───────────────────────────────
  // Handles both:
  //   /productos/categoria/celulares           (1 segment → leaf slug)
  //   /productos/categoria/repuestos/modulos   (2 segments → hierarchical)
  // The full joined path is passed as `categorySlug` param; the component
  // extracts the leaf segment to resolve the actual DB category.
  {
    title: 'Productos por Categoría | Arecofix',
    matcher: (segments: UrlSegment[]) => {
      if (segments.length >= 2 && segments[0].path === 'categoria') {
        const slug = segments
          .slice(1)
          .map((s) => s.path)
          .join('/');
        // Already handled by dedicated routes above
        if (slug === 'cursos' || slug === 'repuestos') return null;

        return {
          consumed: segments,
          posParams: {
            categorySlug: new UrlSegment(slug, {}),
          },
        };
      }
      return null;
    },
    loadComponent: () =>
      import(
        '@app/public/products/pages/by-category/products-by-category-page'
      ),
  },

  // ── Product detail ───────────────────────────────────────────────────────
  {
    title: 'Detalle de Producto | Arecofix',
    path: 'detalle/:productSlug',
    loadComponent: () =>
      import('@app/public/products/pages/details/products-details-page'),
  },

  // ── Featured products ────────────────────────────────────────────────────
  {
    title: 'Productos Destacados | Arecofix',
    path: 'destacados',
    loadComponent: () =>
      import('@app/public/products/pages/featured/products-featured-page'),
  },
];

export default productsRoutes;
