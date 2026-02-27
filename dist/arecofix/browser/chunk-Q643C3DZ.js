import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/clients/admin-clients.routes.ts
var ADMIN_CLIENTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Clientes",
    loadComponent: () => import("./chunk-WPUGHKY7.js").then((m) => m.AdminClientsPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-clients-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Cliente",
    loadComponent: () => import("./chunk-VROIPWCJ.js").then((m) => m.AdminClientFormPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Cliente",
    loadComponent: () => import("./chunk-VROIPWCJ.js").then((m) => m.AdminClientFormPage)
  }, false ? { \u0275entryName: "src/app/admin/clients/admin-client-form-page.ts" } : {})
];
export {
  ADMIN_CLIENTS_ROUTES
};
//# sourceMappingURL=chunk-Q643C3DZ.js.map
