import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  __spreadValues({
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-Q5QFUOXA.js").then((m) => m.ProductsAllPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/all/products-all-page.ts" } : {}),
  __spreadValues({
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-KZJQ5HSG.js").then((m) => m.ProductsIndexPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/index/products-index-page.ts" } : {}),
  __spreadValues({
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-MDEZECN4.js").then((m) => m.RepuestosComponent)
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
    loadComponent: () => import("./chunk-T7CQINDO.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/by-category/products-by-category-page.ts" } : {}),
  __spreadValues({
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-VP5DQF2I.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/details/products-details-page.ts" } : {}),
  __spreadValues({
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-XYNQU45V.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/featured/products-featured-page.ts" } : {})
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-NUPBL2EH.js.map
