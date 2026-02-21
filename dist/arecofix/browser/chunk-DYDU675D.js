import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/posts/admin-posts.routes.ts
var ADMIN_POSTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Entradas",
    loadComponent: () => import("./chunk-LWGPYLRP.js").then((m) => m.AdminPostsPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-posts-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Entrada",
    loadComponent: () => import("./chunk-WQHLFPLO.js").then((m) => m.AdminPostFormPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Entrada",
    loadComponent: () => import("./chunk-WQHLFPLO.js").then((m) => m.AdminPostFormPage)
  }, false ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {})
];
export {
  ADMIN_POSTS_ROUTES
};
//# sourceMappingURL=chunk-DYDU675D.js.map
