import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/products/admin-products.routes.ts
var ADMIN_PRODUCTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Productos",
    loadComponent: () => import("./chunk-3HFJTMIO.mjs").then((m) => m.AdminProductsPage)
  }, true ? { \u0275entryName: "src/app/admin/products/admin-products-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Producto",
    loadComponent: () => import("./chunk-JD2SMDBA.mjs").then((m) => m.AdminProductFormPage)
  }, true ? { \u0275entryName: "src/app/admin/products/admin-product-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Producto",
    loadComponent: () => import("./chunk-JD2SMDBA.mjs").then((m) => m.AdminProductFormPage)
  }, true ? { \u0275entryName: "src/app/admin/products/admin-product-form-page.ts" } : {})
];
export {
  ADMIN_PRODUCTS_ROUTES
};
//# sourceMappingURL=chunk-4FULPESV.mjs.map
