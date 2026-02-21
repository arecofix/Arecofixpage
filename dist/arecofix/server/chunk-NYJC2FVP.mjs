import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/posts/admin-posts.routes.ts
var ADMIN_POSTS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Entradas",
    loadComponent: () => import("./chunk-JXDCZSO7.mjs").then((m) => m.AdminPostsPage)
  }, true ? { \u0275entryName: "src/app/admin/posts/admin-posts-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Entrada",
    loadComponent: () => import("./chunk-INKIC5SX.mjs").then((m) => m.AdminPostFormPage)
  }, true ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Editar Entrada",
    loadComponent: () => import("./chunk-INKIC5SX.mjs").then((m) => m.AdminPostFormPage)
  }, true ? { \u0275entryName: "src/app/admin/posts/admin-post-form-page.ts" } : {})
];
export {
  ADMIN_POSTS_ROUTES
};
//# sourceMappingURL=chunk-NYJC2FVP.mjs.map
