import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/admin/brands/admin-brands.routes.ts
var ADMIN_BRANDS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Marcas",
    loadComponent: () => import("./chunk-W4NDVPY7.mjs").then((m) => m.AdminBrandsPage)
  }, true ? { \u0275entryName: "src/app/admin/brands/admin-brands-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Marca",
    loadComponent: () => import("./chunk-75LUZDSN.mjs").then((m) => m.AdminBrandFormPage)
  }, true ? { \u0275entryName: "src/app/admin/brands/admin-brand-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Marca",
    loadComponent: () => import("./chunk-75LUZDSN.mjs").then((m) => m.AdminBrandFormPage)
  }, true ? { \u0275entryName: "src/app/admin/brands/admin-brand-form-page.ts" } : {})
];
export {
  ADMIN_BRANDS_ROUTES
};
//# sourceMappingURL=chunk-HKGROMKP.mjs.map
