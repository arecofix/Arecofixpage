import "./chunk-GOMI4DH3.js";

// src/app/admin/products/admin-products.routes.ts
var ADMIN_PRODUCTS_ROUTES = [
  {
    path: "",
    title: "Productos",
    loadComponent: () => import("./chunk-7IVYRKXH.js").then((m) => m.AdminProductsPage)
  },
  {
    path: "new",
    title: "Nuevo Producto",
    loadComponent: () => import("./chunk-P2QNNE35.js").then((m) => m.AdminProductFormPage)
  },
  {
    path: ":id",
    title: "Editar Producto",
    loadComponent: () => import("./chunk-P2QNNE35.js").then((m) => m.AdminProductFormPage)
  }
];
export {
  ADMIN_PRODUCTS_ROUTES
};
//# sourceMappingURL=chunk-JDEO5FT4.js.map
