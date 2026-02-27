import {
  UrlSegment
} from "./chunk-CP6GQXNM.js";
import "./chunk-F32QBW3I.js";
import "./chunk-DPJFS6PI.js";
import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/public/products/products.routes.ts
var productsRoutes = [
  __spreadValues({
    path: "",
    // /productos -> All Products
    loadComponent: () => import("./chunk-SAPNKFNE.js").then((m) => m.ProductsAllPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/all/products-all-page.ts" } : {}),
  __spreadValues({
    path: "inicio",
    // /productos/inicio -> Old Index (optional)
    loadComponent: () => import("./chunk-S4GEAWGH.js").then((m) => m.ProductsIndexPage)
  }, false ? { \u0275entryName: "src/app/public/products/pages/index/products-index-page.ts" } : {}),
  __spreadValues({
    title: "Repuestos",
    matcher: (segments) => {
      if (segments.length === 2 && segments[0].path === "categoria" && segments[1].path.toLowerCase() === "repuestos") {
        return { consumed: segments };
      }
      return null;
    },
    loadComponent: () => import("./chunk-TXMYKTSF.js").then((m) => m.RepuestosComponent)
  }, false ? { \u0275entryName: "src/app/public/repuestos/repuestos.ts" } : {}),
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
    loadComponent: () => import("./chunk-IQJF5OBN.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/by-category/products-by-category-page.ts" } : {}),
  __spreadValues({
    title: "Detalle de Producto",
    path: "detalle/:productSlug",
    loadComponent: () => import("./chunk-KVS7FPYD.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/details/products-details-page.ts" } : {}),
  __spreadValues({
    title: "Productos Destacados",
    path: "destacados",
    // featured -> destacados
    loadComponent: () => import("./chunk-HLFQJU4X.js")
  }, false ? { \u0275entryName: "src/app/public/products/pages/featured/products-featured-page.ts" } : {})
];
var products_routes_default = productsRoutes;
export {
  products_routes_default as default,
  productsRoutes
};
//# sourceMappingURL=chunk-7WAA6YND.js.map
