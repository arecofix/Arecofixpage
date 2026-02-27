import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/admin/categories/admin-categories.routes.ts
var ADMIN_CATEGORIES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Categor\xEDas",
    loadComponent: () => import("./chunk-OVNKB25P.mjs").then((m) => m.AdminCategoriesPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-categories-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Categor\xEDa",
    loadComponent: () => import("./chunk-S6NCLHN2.mjs").then((m) => m.AdminCategoryFormPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Categor\xEDa",
    loadComponent: () => import("./chunk-S6NCLHN2.mjs").then((m) => m.AdminCategoryFormPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {})
];
export {
  ADMIN_CATEGORIES_ROUTES
};
//# sourceMappingURL=chunk-DHDSNOUR.mjs.map
