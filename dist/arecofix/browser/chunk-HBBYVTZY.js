import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/posts/admin-posts.routes.ts
var ADMIN_POSTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Entradas",
    loadComponent: () => import("./chunk-TPP6NATR.js").then((m) => m.AdminPostsPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-posts-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Entrada",
    loadComponent: () => import("./chunk-J54U5LXL.js").then((m) => m.AdminPostFormPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Entrada",
    loadComponent: () => import("./chunk-J54U5LXL.js").then((m) => m.AdminPostFormPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {})
];
export {
  ADMIN_POSTS_ROUTES
};
//# sourceMappingURL=chunk-HBBYVTZY.js.map
