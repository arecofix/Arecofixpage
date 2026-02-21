import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/courses/admin-courses.routes.ts
var ADMIN_COURSES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Cursos",
    loadComponent: () => import("./chunk-NWRW3OT7.js").then((m) => m.AdminCoursesPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-courses-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Curso",
    loadComponent: () => import("./chunk-G5ZSX5RY.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Curso",
    loadComponent: () => import("./chunk-G5ZSX5RY.js").then((m) => m.AdminCourseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/courses/admin-course-form-page.ts" } : {})
];
export {
  ADMIN_COURSES_ROUTES
};
//# sourceMappingURL=chunk-AGLWS7MH.js.map
