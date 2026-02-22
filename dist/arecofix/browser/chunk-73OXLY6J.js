import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/repairs/admin-repairs.routes.ts
var ADMIN_REPAIRS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Taller",
    loadComponent: () => import("./chunk-ZK6OE5IM.js").then((m) => m.AdminRepairsPage)
  }, false ? { \u0275entryName: "src/app/admin/repairs/admin-repairs-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Reparaci\xF3n",
    loadComponent: () => import("./chunk-624YZTZZ.js").then((m) => m.AdminRepairFormPage)
  }, false ? { \u0275entryName: "src/app/admin/repairs/admin-repair-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Reparaci\xF3n",
    loadComponent: () => import("./chunk-624YZTZZ.js").then((m) => m.AdminRepairFormPage)
  }, false ? { \u0275entryName: "src/app/admin/repairs/admin-repair-form-page.ts" } : {})
];
export {
  ADMIN_REPAIRS_ROUTES
};
//# sourceMappingURL=chunk-73OXLY6J.js.map
