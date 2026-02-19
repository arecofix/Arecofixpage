import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/brands/admin-brands.routes.ts
var ADMIN_BRANDS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Marcas",
    loadComponent: () => import("./chunk-K2JY2US3.js").then((m) => m.AdminBrandsPage)
  }, false ? { \u0275entryName: "src/app/admin/brands/admin-brands-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Marca",
    loadComponent: () => import("./chunk-ANPOZI34.js").then((m) => m.AdminBrandFormPage)
  }, false ? { \u0275entryName: "src/app/admin/brands/admin-brand-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Marca",
    loadComponent: () => import("./chunk-ANPOZI34.js").then((m) => m.AdminBrandFormPage)
  }, false ? { \u0275entryName: "src/app/admin/brands/admin-brand-form-page.ts" } : {})
];
export {
  ADMIN_BRANDS_ROUTES
};
//# sourceMappingURL=chunk-2IBZJIWH.js.map
