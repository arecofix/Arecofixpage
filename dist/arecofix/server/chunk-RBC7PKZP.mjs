import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/suppliers/admin-suppliers.routes.ts
var ADMIN_SUPPLIERS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Proveedores",
    loadComponent: () => import("./chunk-HSL2ILJK.mjs").then((m) => m.AdminSuppliersPage)
  }, true ? { \u0275entryName: "src/app/admin/suppliers/admin-suppliers-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Proveedor",
    loadComponent: () => import("./chunk-ZZ3MF5DS.mjs").then((m) => m.AdminSupplierFormPage)
  }, true ? { \u0275entryName: "src/app/admin/suppliers/admin-supplier-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Proveedor",
    loadComponent: () => import("./chunk-ZZ3MF5DS.mjs").then((m) => m.AdminSupplierFormPage)
  }, true ? { \u0275entryName: "src/app/admin/suppliers/admin-supplier-form-page.ts" } : {})
];
export {
  ADMIN_SUPPLIERS_ROUTES
};
//# sourceMappingURL=chunk-RBC7PKZP.mjs.map
