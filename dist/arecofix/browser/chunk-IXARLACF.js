import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/services/admin-services.routes.ts
var ADMIN_SERVICES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Servicios",
    loadComponent: () => import("./chunk-7RT4WD5O.js").then((m) => m.AdminServicesPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-services-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Servicio",
    loadComponent: () => import("./chunk-INMDQWMO.js").then((m) => m.AdminServiceFormPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Servicio",
    loadComponent: () => import("./chunk-INMDQWMO.js").then((m) => m.AdminServiceFormPage)
  }, false ? { \u0275entryName: "src/app/admin/services/admin-service-form-page.ts" } : {})
];
export {
  ADMIN_SERVICES_ROUTES
};
//# sourceMappingURL=chunk-IXARLACF.js.map
