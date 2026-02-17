import "./chunk-GOMI4DH3.js";

// src/app/admin/courses/admin-courses.routes.ts
var ADMIN_COURSES_ROUTES = [
  {
    path: "",
    title: "Cursos",
    loadComponent: () => import("./chunk-D7LDDIV3.js").then((m) => m.AdminCoursesPage)
  },
  {
    path: "new",
    title: "Nuevo Curso",
    loadComponent: () => import("./chunk-AWFY535H.js").then((m) => m.AdminCourseFormPage)
  },
  {
    path: ":id",
    title: "Editar Curso",
    loadComponent: () => import("./chunk-AWFY535H.js").then((m) => m.AdminCourseFormPage)
  }
];
export {
  ADMIN_COURSES_ROUTES
};
//# sourceMappingURL=chunk-6B4ZDOLP.js.map
