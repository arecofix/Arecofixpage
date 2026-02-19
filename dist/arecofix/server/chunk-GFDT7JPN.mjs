import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/employees/admin-employees.routes.ts
var ADMIN_EMPLOYEES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Empleados",
    loadComponent: () => import("./chunk-HL3GZMVK.mjs").then((m) => m.AdminEmployeesPage)
  }, true ? { \u0275entryName: "src/app/admin/employees/admin-employees-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Empleado",
    loadComponent: () => import("./chunk-BMSRFKNP.mjs").then((m) => m.AdminEmployeeFormPage)
  }, true ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Empleado",
    loadComponent: () => import("./chunk-BMSRFKNP.mjs").then((m) => m.AdminEmployeeFormPage)
  }, true ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {})
];
export {
  ADMIN_EMPLOYEES_ROUTES
};
//# sourceMappingURL=chunk-GFDT7JPN.mjs.map
