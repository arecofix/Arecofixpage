import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/categories/admin-categories.routes.ts
var ADMIN_CATEGORIES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Categor\xEDas",
    loadComponent: () => import("./chunk-H552RYMP.js").then((m) => m.AdminCategoriesPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-categories-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Categor\xEDa",
    loadComponent: () => import("./chunk-KID5SB36.js").then((m) => m.AdminCategoryFormPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Categor\xEDa",
    loadComponent: () => import("./chunk-KID5SB36.js").then((m) => m.AdminCategoryFormPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {})
];
export {
  ADMIN_CATEGORIES_ROUTES
};
//# sourceMappingURL=chunk-KYWYQLPY.js.map
