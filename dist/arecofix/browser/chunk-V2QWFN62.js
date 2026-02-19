import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/services/admin-services.routes.ts
var ADMIN_SERVICES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Servicios",
    loadComponent: () => import("./chunk-3Q5XYRGO.js").then((m) => m.AdminServicesPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-services-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Servicio",
    loadComponent: () => import("./chunk-K27R5R7L.js").then((m) => m.AdminServiceFormPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Servicio",
    loadComponent: () => import("./chunk-K27R5R7L.js").then((m) => m.AdminServiceFormPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {})
];
export {
  ADMIN_SERVICES_ROUTES
};
//# sourceMappingURL=chunk-V2QWFN62.js.map
