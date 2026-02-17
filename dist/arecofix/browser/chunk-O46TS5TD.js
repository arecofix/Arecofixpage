import "./chunk-GOMI4DH3.js";

// src/app/admin/posts/admin-posts.routes.ts
var ADMIN_POSTS_ROUTES = [
  {
    path: "",
    title: "Entradas",
    loadComponent: () => import("./chunk-RKIDKSCJ.js").then((m) => m.AdminPostsPage)
  },
  {
    path: "new",
    title: "Nueva Entrada",
    loadComponent: () => import("./chunk-46OVUEBH.js").then((m) => m.AdminPostFormPage)
  },
  {
    path: ":id",
    title: "Editar Entrada",
    loadComponent: () => import("./chunk-46OVUEBH.js").then((m) => m.AdminPostFormPage)
  }
];
export {
  ADMIN_POSTS_ROUTES
};
//# sourceMappingURL=chunk-O46TS5TD.js.map
