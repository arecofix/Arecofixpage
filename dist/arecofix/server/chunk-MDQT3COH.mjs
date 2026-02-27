import './polyfills.server.mjs';
import {
  UrlSegment
} from "./chunk-GLYZDHZB.mjs";
import "./chunk-NQCCIK3J.mjs";
import "./chunk-RN3QJLYL.mjs";
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  __spreadValues({
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-G6FFMSV6.mjs").then((m) => m.ProductsAllPage)
  }, true ? { \u0275entryName: "src/app/public/products/pages/all/products-all-page.ts" } : {}),
  __spreadValues({
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-UX4FKYLD.mjs").then((m) => m.ProductsIndexPage)
  }, true ? { \u0275entryName: "src/app/public/products/pages/index/products-index-page.ts" } : {}),
  __spreadValues({
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-5LKOCBY5.mjs").then((m) => m.RepuestosComponent)
  }, true ? { \u0275entryName: "src/app/public/repuestos/repuestos.ts" } : {}),
  // Redirect /productos/categoria/cursos to /cursos
  {
    path: "categoria/cursos",
    redirectTo: "/academy",
    pathMatch: "full"
  },
  __spreadValues({
    title: "Productos por Categor\xEDa",
    matcher: (segments) => {
      if (segments.length >= 2 && segments[0].path === "categoria") {
        const slug = segments.slice(1).map((s) => s.path).join("/");
        if (slug === "cursos")
          return null;
        return {
          consumed: segments,
          posParams: {
            categorySlug: new UrlSegment(slug, {})
          }
        };
      }
      return null;
    },
    loadComponent: () => import("./chunk-C2MM2PJI.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/by-category/products-by-category-page.ts" } : {}),
  __spreadValues({
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-FBCSVDGO.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/details/products-details-page.ts" } : {}),
  __spreadValues({
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-YXY77TGX.mjs")
  }, true ? { \u0275entryName: "src/app/public/products/pages/featured/products-featured-page.ts" } : {})
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-MDQT3COH.mjs.map
