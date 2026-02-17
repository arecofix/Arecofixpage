import "./chunk-GOMI4DH3.js";

// src/app/admin/sales/admin-sales.routes.ts
var ADMIN_SALES_ROUTES = [
  {
    path: "",
    title: "Ventas",
    loadComponent: () => import("./chunk-UO3J3LHK.js").then((m) => m.AdminSalesPage)
  },
  {
    path: "invoices",
    title: "Facturaci\xF3n",
    loadComponent: () => import("./chunk-C2STL7D4.js").then((m) => m.AdminInvoicesPage)
  },
  {
    path: "invoices/:id",
    title: "Ver Factura",
    loadComponent: () => import("./chunk-C6RSYTVX.js").then((m) => m.AdminInvoiceDetailPage)
  }
];
export {
  ADMIN_SALES_ROUTES
};
//# sourceMappingURL=chunk-B2IS7EK5.js.map
