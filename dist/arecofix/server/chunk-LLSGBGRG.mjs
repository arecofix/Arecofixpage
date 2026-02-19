import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/services/admin-services.routes.ts
var ADMIN_SERVICES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Servicios",
    loadComponent: () => import("./chunk-E34NYFZZ.mjs").then((m) => m.AdminServicesPage)
  }, true ? { \u0275entryName: "src/app/admin/services/admin-services-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Servicio",
    loadComponent: () => import("./chunk-OAZA5NFO.mjs").then((m) => m.AdminServiceFormPage)
  }, true ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Servicio",
    loadComponent: () => import("./chunk-OAZA5NFO.mjs").then((m) => m.AdminServiceFormPage)
  }, true ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {})
];
export {
  ADMIN_SERVICES_ROUTES
};
//# sourceMappingURL=chunk-LLSGBGRG.mjs.map
