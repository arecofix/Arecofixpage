import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/employees/admin-employees.routes.ts
var ADMIN_EMPLOYEES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Empleados",
    loadComponent: () => import("./chunk-SXKGCMZT.js").then((m) => m.AdminEmployeesPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employees-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Empleado",
    loadComponent: () => import("./chunk-F6TAT6CQ.js").then((m) => m.AdminEmployeeFormPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Empleado",
    loadComponent: () => import("./chunk-F6TAT6CQ.js").then((m) => m.AdminEmployeeFormPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {})
];
export {
  ADMIN_EMPLOYEES_ROUTES
};
//# sourceMappingURL=chunk-HQDEGFGF.js.map
