import "./chunk-GOMI4DH3.js";

// src/app/admin/brands/admin-brands.routes.ts
var ADMIN_BRANDS_ROUTES = [
  {
    path: "",
    title: "Marcas",
    loadComponent: () => import("./chunk-6QWZ4RKV.js").then((m) => m.AdminBrandsPage)
  },
  {
    path: "new",
    title: "Nueva Marca",
    loadComponent: () => import("./chunk-J5B2FO5F.js").then((m) => m.AdminBrandFormPage)
  },
  {
    path: ":id",
    title: "Editar Marca",
    loadComponent: () => import("./chunk-J5B2FO5F.js").then((m) => m.AdminBrandFormPage)
  }
];
export {
  ADMIN_BRANDS_ROUTES
};
//# sourceMappingURL=chunk-LKLJVGLO.js.map
