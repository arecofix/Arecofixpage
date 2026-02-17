import "./chunk-GOMI4DH3.js";

// src/app/admin/suppliers/admin-suppliers.routes.ts
var ADMIN_SUPPLIERS_ROUTES = [
  {
    path: "",
    title: "Proveedores",
    loadComponent: () => import("./chunk-WKA7EQAM.js").then((m) => m.AdminSuppliersPage)
  },
  {
    path: "new",
    title: "Nuevo Proveedor",
    loadComponent: () => import("./chunk-D7QR3SCK.js").then((m) => m.AdminSupplierFormPage)
  },
  {
    path: ":id",
    title: "Editar Proveedor",
    loadComponent: () => import("./chunk-D7QR3SCK.js").then((m) => m.AdminSupplierFormPage)
  }
];
export {
  ADMIN_SUPPLIERS_ROUTES
};
//# sourceMappingURL=chunk-PL2FBVE4.js.map
