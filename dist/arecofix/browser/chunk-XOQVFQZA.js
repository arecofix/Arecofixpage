import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/orders/admin-orders.routes.ts
var ADMIN_ORDERS_ROUTES = [
  __spreadValues({
    path: "",
    title: "Pedidos",
    loadComponent: () => import("./chunk-AS5I4RWR.js").then((m) => m.AdminOrdersPage)
  }, false ? { \u0275entryName: "src/app/admin/orders/admin-orders-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nuevo Pedido",
    loadComponent: () => import("./chunk-B2UD4RFJ.js").then((m) => m.AdminOrderFormPage)
  }, false ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {}),
  __spreadValues({
    path: ":id",
    title: "Ver Pedido",
    loadComponent: () => import("./chunk-B2UD4RFJ.js").then((m) => m.AdminOrderFormPage)
  }, false ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {}),
  __spreadValues({
    path: ":id/edit",
    title: "Editar Pedido",
    loadComponent: () => import("./chunk-B2UD4RFJ.js").then((m) => m.AdminOrderFormPage)
  }, false ? { \u0275entryName: "src/app/admin/orders/admin-order-form-page.ts" } : {})
];
export {
  ADMIN_ORDERS_ROUTES
};
//# sourceMappingURL=chunk-XOQVFQZA.js.map
