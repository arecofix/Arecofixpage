import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/sales/admin-sales.routes.ts
var ADMIN_SALES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Ventas",
    loadComponent: () => import("./chunk-ZFHX4QCF.mjs").then((m) => m.AdminSalesPage)
  }, true ? { \u0275entryName: "src/app/admin/sales/admin-sales-page.ts" } : {}),
  __spreadValues({
    path: "invoices",
    title: "Facturaci\xF3n",
    loadComponent: () => import("./chunk-JANTUZML.mjs").then((m) => m.AdminInvoicesPage)
  }, true ? { \u0275entryName: "src/app/admin/sales/admin-invoices-page.ts" } : {}),
  __spreadValues({
    path: "invoices/:id",
    title: "Ver Factura",
    loadComponent: () => import("./chunk-YYERM5NM.mjs").then((m) => m.AdminInvoiceDetailPage)
  }, true ? { \u0275entryName: "src/app/admin/sales/admin-invoice-detail-page.ts" } : {})
];
export {
  ADMIN_SALES_ROUTES
};
//# sourceMappingURL=chunk-BT5HCZJZ.mjs.map
