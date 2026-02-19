import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/suppliers/admin-suppliers.routes.ts
var ADMIN_SUPPLIERS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Proveedores",
    loadComponent: () => import("./chunk-WPJJKP2E.js").then((m) => m.AdminSuppliersPage)
  }, false ? { \u0275entryName: "src/app/admin/suppliers/admin-suppliers-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Proveedor",
    loadComponent: () => import("./chunk-H4EMVMHN.js").then((m) => m.AdminSupplierFormPage)
  }, false ? { \u0275entryName: "src/app/admin/suppliers/admin-supplier-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Proveedor",
    loadComponent: () => import("./chunk-H4EMVMHN.js").then((m) => m.AdminSupplierFormPage)
  }, false ? { \u0275entryName: "src/app/admin/suppliers/admin-supplier-form-page.ts" } : {})
];
export {
  ADMIN_SUPPLIERS_ROUTES
};
//# sourceMappingURL=chunk-5YKBQRV5.js.map
