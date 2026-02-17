import "./chunk-GOMI4DH3.js";

// src/app/admin/services/admin-services.routes.ts
var ADMIN_SERVICES_ROUTES = [
  {
    path: "",
    title: "Servicios",
    loadComponent: () => import("./chunk-LQ73WGXS.js").then((m) => m.AdminServicesPage)
  },
  {
    path: "new",
    title: "Nuevo Servicio",
    loadComponent: () => import("./chunk-KKPVM6X5.js").then((m) => m.AdminServiceFormPage)
  },
  {
    path: ":id",
    title: "Editar Servicio",
    loadComponent: () => import("./chunk-KKPVM6X5.js").then((m) => m.AdminServiceFormPage)
  }
];
export {
  ADMIN_SERVICES_ROUTES
};
//# sourceMappingURL=chunk-BP4HO6DS.js.map
