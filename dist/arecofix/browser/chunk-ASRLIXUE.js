import "./chunk-GOMI4DH3.js";

// src/app/admin/orders/admin-orders.routes.ts
var ADMIN_ORDERS_ROUTES = [
  {
    path: "",
    title: "Pedidos",
    loadComponent: () => import("./chunk-3QNKDXQE.js").then((m) => m.AdminOrdersPage)
  },
  {
    path: "new",
    title: "Nuevo Pedido",
    loadComponent: () => import("./chunk-7IO4N6V5.js").then((m) => m.AdminOrderFormPage)
  },
  {
    path: ":id",
    title: "Ver Pedido",
    loadComponent: () => import("./chunk-7IO4N6V5.js").then((m) => m.AdminOrderFormPage)
  },
  {
    path: ":id/edit",
    title: "Editar Pedido",
    loadComponent: () => import("./chunk-7IO4N6V5.js").then((m) => m.AdminOrderFormPage)
  }
];
export {
  ADMIN_ORDERS_ROUTES
};
//# sourceMappingURL=chunk-ASRLIXUE.js.map
