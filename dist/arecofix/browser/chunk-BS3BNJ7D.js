import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/sales/admin-sales.routes.ts
var ADMIN_SALES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Ventas",
    loadComponent: () => import("./chunk-TPFYDBP2.js").then((m) => m.AdminSalesPage)
  }, false ? { \u0275entryName: "src/app/admin/sales/admin-sales-page.ts" } : {}),
  __spreadValues({
    path: "invoices",
    title: "Facturaci\xF3n",
    loadComponent: () => import("./chunk-3TAX7UAD.js").then((m) => m.AdminInvoicesPage)
  }, false ? { \u0275entryName: "src/app/admin/sales/admin-invoices-page.ts" } : {}),
  __spreadValues({
    path: "invoices/:id",
    title: "Ver Factura",
    loadComponent: () => import("./chunk-WF4A666W.js").then((m) => m.AdminInvoiceDetailPage)
  }, false ? { \u0275entryName: "src/app/admin/sales/admin-invoice-detail-page.ts" } : {})
];
export {
  ADMIN_SALES_ROUTES
};
//# sourceMappingURL=chunk-BS3BNJ7D.js.map
