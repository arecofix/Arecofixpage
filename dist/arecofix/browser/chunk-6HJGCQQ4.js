import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/employees/admin-employees.routes.ts
var ADMIN_EMPLOYEES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Empleados",
    loadComponent: () => import("./chunk-KJLNV7WJ.js").then((m) => m.AdminEmployeesPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employees-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Empleado",
    loadComponent: () => import("./chunk-B37JQTN2.js").then((m) => m.AdminEmployeeFormPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Empleado",
    loadComponent: () => import("./chunk-B37JQTN2.js").then((m) => m.AdminEmployeeFormPage)
  }, false ? { \u0275entryName: "src/app/admin/employees/admin-employee-form-page.ts" } : {})
];
export {
  ADMIN_EMPLOYEES_ROUTES
};
//# sourceMappingURL=chunk-6HJGCQQ4.js.map
