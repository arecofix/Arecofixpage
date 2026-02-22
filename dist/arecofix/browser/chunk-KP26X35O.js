import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/categories/admin-categories.routes.ts
var ADMIN_CATEGORIES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Categor\xEDas",
    loadComponent: () => import("./chunk-DPPOMBLY.js").then((m) => m.AdminCategoriesPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-categories-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Categor\xEDa",
    loadComponent: () => import("./chunk-FFKBUIRY.js").then((m) => m.AdminCategoryFormPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Categor\xEDa",
    loadComponent: () => import("./chunk-FFKBUIRY.js").then((m) => m.AdminCategoryFormPage)
  }, false ? { \u0275entryName: "src/app/admin/categories/admin-category-form-page.ts" } : {})
];
export {
  ADMIN_CATEGORIES_ROUTES
};
//# sourceMappingURL=chunk-KP26X35O.js.map
