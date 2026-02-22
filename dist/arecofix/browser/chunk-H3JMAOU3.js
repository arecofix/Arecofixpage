import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  __spreadValues({
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-D6PASCF3.js").then((m) => m.ProductsAllPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/all/products-all-page.ts" } : {}),
  __spreadValues({
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-S4CTPJZL.js").then((m) => m.ProductsIndexPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/index/products-index-page.ts" } : {}),
  __spreadValues({
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-6TVZNXP5.js").then((m) => m.RepuestosComponent)
  }, false ? { \u0275entryName: "src/app/public/repuestos/repuestos.ts" } : {}),
  // Redirect /productos/categoria/cursos to /cursos
  {
    path: "categoria/cursos",
    redirectTo: "/academy",
    pathMatch: "full"
  },
  __spreadValues({
    title: "Productos por Categor\xEDa",
    path: "categoria/:categorySlug",
    loadComponent: () => import("./chunk-AYMMMW7U.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/by-category/products-by-category-page.ts" } : {}),
  __spreadValues({
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-TW5GBNRR.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/details/products-details-page.ts" } : {}),
  __spreadValues({
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-V4B74CRN.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/featured/products-featured-page.ts" } : {})
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-H3JMAOU3.js.map
