import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/admin/clients/admin-clients.routes.ts
var ADMIN_CLIENTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Clientes",
    loadComponent: () => import("./chunk-CPBNVNPR.mjs").then((m) => m.AdminClientsPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-clients-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Cliente",
    loadComponent: () => import("./chunk-KUEBSRB2.mjs").then((m) => m.AdminClientFormPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Cliente",
    loadComponent: () => import("./chunk-KUEBSRB2.mjs").then((m) => m.AdminClientFormPage)
  }, true ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {})
];
export {
  ADMIN_CLIENTS_ROUTES
};
//# sourceMappingURL=chunk-5SCYCA3P.mjs.map
