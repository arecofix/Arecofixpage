import "./chunk-GOMI4DH3.js";

// src/app/admin/employees/admin-employees.routes.ts
var ADMIN_EMPLOYEES_ROUTES = [
  {
    path: "",
    title: "Empleados",
    loadComponent: () => import("./chunk-HEKQVSGE.js").then((m) => m.AdminEmployeesPage)
  },
  {
    path: "new",
    title: "Nuevo Empleado",
    loadComponent: () => import("./chunk-KITZCPYB.js").then((m) => m.AdminEmployeeFormPage)
  },
  {
    path: ":id",
    title: "Editar Empleado",
    loadComponent: () => import("./chunk-KITZCPYB.js").then((m) => m.AdminEmployeeFormPage)
  }
];
export {
  ADMIN_EMPLOYEES_ROUTES
};
//# sourceMappingURL=chunk-VIWZPEFU.js.map
