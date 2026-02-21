import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/clients/admin-clients.routes.ts
var ADMIN_CLIENTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Clientes",
    loadComponent: () => import("./chunk-YHM6AFN6.mjs").then((m) => m.AdminClientsPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-clients-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Cliente",
    loadComponent: () => import("./chunk-ARECATDJ.mjs").then((m) => m.AdminClientFormPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Cliente",
    loadComponent: () => import("./chunk-ARECATDJ.mjs").then((m) => m.AdminClientFormPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {})
];
export {
  ADMIN_CLIENTS_ROUTES
};
//# sourceMappingURL=chunk-AQTQDGQQ.mjs.map
