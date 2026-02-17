import "./chunk-GOMI4DH3.js";

// src/app/admin/clients/admin-clients.routes.ts
var ADMIN_CLIENTS_ROUTES = [
  {
    path: "",
    title: "Clientes",
    loadComponent: () => import("./chunk-YGSEUB32.js").then((m) => m.AdminClientsPage)
  },
  {
    path: "new",
    title: "Nuevo Cliente",
    loadComponent: () => import("./chunk-7TSFE2RB.js").then((m) => m.AdminClientFormPage)
  },
  {
    path: ":id",
    title: "Editar Cliente",
    loadComponent: () => import("./chunk-7TSFE2RB.js").then((m) => m.AdminClientFormPage)
  }
];
export {
  ADMIN_CLIENTS_ROUTES
};
//# sourceMappingURL=chunk-5RVAYUIG.js.map
