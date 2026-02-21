import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/orders/admin-orders.routes.ts
var ADMIN_ORDERS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Pedidos",
    loadComponent: () => import("./chunk-GJGLB4ST.mjs").then((m) => m.AdminOrdersPage)
  }, true ? { \u0275entryName: "src/app/admin/orders/admin-orders-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Pedido",
    loadComponent: () => import("./chunk-OLT5UIMN.mjs").then((m) => m.AdminOrderFormPage)
  }, true ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Ver Pedido",
    loadComponent: () => import("./chunk-OLT5UIMN.mjs").then((m) => m.AdminOrderFormPage)
  }, true ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {}),
  __spreadValues({
    path: ":id/edit",
    title: "Editar Pedido",
    loadComponent: () => import("./chunk-OLT5UIMN.mjs").then((m) => m.AdminOrderFormPage)
  }, true ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {})
];
export {
  ADMIN_ORDERS_ROUTES
};
//# sourceMappingURL=chunk-ZI6XIDMQ.mjs.map
