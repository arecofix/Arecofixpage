import "./chunk-GOMI4DH3.js";

// src/app/admin/repairs/admin-repairs.routes.ts
var ADMIN_REPAIRS_ROUTES = [
  {
    path: "",
    title: "Taller",
    loadComponent: () => import("./chunk-FCASYQD6.js").then((m) => m.AdminRepairsPage)
  },
  {
    path: "new",
    title: "Nueva Reparaci\xF3n",
    loadComponent: () => import("./chunk-FQSUW3PN.js").then((m) => m.AdminRepairFormPage)
  },
  {
    path: ":id",
    title: "Editar Reparaci\xF3n",
    loadComponent: () => import("./chunk-FQSUW3PN.js").then((m) => m.AdminRepairFormPage)
  }
];
export {
  ADMIN_REPAIRS_ROUTES
};
//# sourceMappingURL=chunk-BKQYCXG6.js.map
