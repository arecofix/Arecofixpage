import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/products/admin-products.routes.ts
var ADMIN_PRODUCTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Productos",
    loadComponent: () => import("./chunk-WQIZYPHV.js").then((m) => m.AdminProductsPage)
  }, false ? { \u0275entryName: "src/app/admin/products/admin-products-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Producto",
    loadComponent: () => import("./chunk-PSFFA2YH.js").then((m) => m.AdminProductFormPage)
  }, false ? { \u0275entryName: "src/app/admin/products/admin-product-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Producto",
    loadComponent: () => import("./chunk-PSFFA2YH.js").then((m) => m.AdminProductFormPage)
  }, false ? { \u0275entryName: "src/app/admin/products/admin-product-form-page.ts" } : {})
];
export {
  ADMIN_PRODUCTS_ROUTES
};
//# sourceMappingURL=chunk-IKENKG7Z.js.map
