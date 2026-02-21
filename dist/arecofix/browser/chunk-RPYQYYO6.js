import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/clients/admin-clients.routes.ts
var ADMIN_CLIENTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Clientes",
    loadComponent: () => import("./chunk-OSQDXE2S.js").then((m) => m.AdminClientsPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-clients-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Cliente",
    loadComponent: () => import("./chunk-22WV5BJA.js").then((m) => m.AdminClientFormPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Cliente",
    loadComponent: () => import("./chunk-22WV5BJA.js").then((m) => m.AdminClientFormPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {})
];
export {
  ADMIN_CLIENTS_ROUTES
};
//# sourceMappingURL=chunk-RPYQYYO6.js.map
