import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/courses/admin-courses.routes.ts
var ADMIN_COURSES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Cursos",
    loadComponent: () => import("./chunk-HG5F557G.js").then((m) => m.AdminCoursesPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-courses-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Curso",
    loadComponent: () => import("./chunk-RIW5QKMM.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Curso",
    loadComponent: () => import("./chunk-RIW5QKMM.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {})
];
export {
  ADMIN_COURSES_ROUTES
};
//# sourceMappingURL=chunk-2IUEKYYW.js.map
