import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/courses/admin-courses.routes.ts
var ADMIN_COURSES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Cursos",
    loadComponent: () => import("./chunk-RV72LVCK.js").then((m) => m.AdminCoursesPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-courses-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Curso",
    loadComponent: () => import("./chunk-Z2QUC5OV.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Curso",
    loadComponent: () => import("./chunk-Z2QUC5OV.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {})
];
export {
  ADMIN_COURSES_ROUTES
};
//# sourceMappingURL=chunk-EKTIOQAS.js.map
