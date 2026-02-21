import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/courses/admin-courses.routes.ts
var ADMIN_COURSES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Cursos",
    loadComponent: () => import("./chunk-V7QJTYTA.mjs").then((m) => m.AdminCoursesPage)
  }, true ? { \u0275entryName: "src/app/admin/courses/admin-courses-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Curso",
    loadComponent: () => import("./chunk-D6KOQY2Y.mjs").then((m) => m.AdminCourseFormPage)
  }, true ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Curso",
    loadComponent: () => import("./chunk-D6KOQY2Y.mjs").then((m) => m.AdminCourseFormPage)
  }, true ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {})
];
export {
  ADMIN_COURSES_ROUTES
};
//# sourceMappingURL=chunk-GJ5MXUU5.mjs.map
