import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/repairs/admin-repairs.routes.ts
var ADMIN_REPAIRS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Taller",
    loadComponent: () => import("./chunk-4JLAHUKC.mjs").then((m) => m.AdminRepairsPage)
  }, true ? { \u0275entryName: "src/app/admin/repairs/admin-repairs-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Reparaci\xF3n",
    loadComponent: () => import("./chunk-JPHL7YSE.mjs").then((m) => m.AdminRepairFormPage)
  }, true ? { \u0275entryName: "src/app/admin/repairs/admin-repair-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Reparaci\xF3n",
    loadComponent: () => import("./chunk-JPHL7YSE.mjs").then((m) => m.AdminRepairFormPage)
  }, true ? { \u0275entryName: "src/app/admin/repairs/admin-repair-form-page.ts" } : {})
];
export {
  ADMIN_REPAIRS_ROUTES
};
//# sourceMappingURL=chunk-CQDBOI5C.mjs.map
