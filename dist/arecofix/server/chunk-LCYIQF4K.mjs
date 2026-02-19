import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  __spreadValues({
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-GBY2C436.mjs").then((m) => m.ProductsAllPage)
  }, true ? { \u0275entryName: "src/app/public/products/pages/all/products-all-page.ts" } : {}),
  __spreadValues({
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-5QHAT2GT.mjs").then((m) => m.ProductsIndexPage)
  }, true ? { \u0275entryName: "src/app/public/products/pages/index/products-index-page.ts" } : {}),
  __spreadValues({
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-ETPVJCRW.mjs").then((m) => m.RepuestosComponent)
  }, true ? { \u0275entryName: "src/app/public/repuestos/repuestos.ts" } : {}),
  // Redirect /productos/categoria/cursos to /cursos
  {
    path: "categoria/cursos",
    redirectTo: "/academy",
    pathMatch: "full"
  },
  __spreadValues({
    title: "Productos por Categor\xEDa",
    path: "categoria/:categorySlug",
    loadComponent: () => import("./chunk-FXAJBVYN.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/by-category/products-by-category-page.ts" } : {}),
  __spreadValues({
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-6ZCTO5WD.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/details/products-details-page.ts" } : {}),
  __spreadValues({
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-V3Y4NZYE.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/featured/products-featured-page.ts" } : {})
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-LCYIQF4K.mjs.map
