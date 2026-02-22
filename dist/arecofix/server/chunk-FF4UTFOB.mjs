import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/categories/admin-categories.routes.ts
var ADMIN_CATEGORIES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Categor\xEDas",
    loadComponent: () => import("./chunk-PVXAMWPL.mjs").then((m) => m.AdminCategoriesPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-categories-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Categor\xEDa",
    loadComponent: () => import("./chunk-SQS6BT3S.mjs").then((m) => m.AdminCategoryFormPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Categor\xEDa",
    loadComponent: () => import("./chunk-SQS6BT3S.mjs").then((m) => m.AdminCategoryFormPage)
  }, true ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {})
];
export {
  ADMIN_CATEGORIES_ROUTES
};
//# sourceMappingURL=chunk-FF4UTFOB.mjs.map
