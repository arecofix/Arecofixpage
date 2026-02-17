import "./chunk-GOMI4DH3.js";

// src/app/admin/categories/admin-categories.routes.ts
var ADMIN_CATEGORIES_ROUTES = [
  {
    path: "",
    title: "Categor\xEDas",
    loadComponent: () => import("./chunk-SURKE3F2.js").then((m) => m.AdminCategoriesPage)
  },
  {
    path: "new",
    title: "Nueva Categor\xEDa",
    loadComponent: () => import("./chunk-U6CZCAUW.js").then((m) => m.AdminCategoryFormPage)
  },
  {
    path: ":id",
    title: "Editar Categor\xEDa",
    loadComponent: () => import("./chunk-U6CZCAUW.js").then((m) => m.AdminCategoryFormPage)
  }
];
export {
  ADMIN_CATEGORIES_ROUTES
};
//# sourceMappingURL=chunk-UVC6QJTU.js.map
