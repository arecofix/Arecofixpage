import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/purchases/admin-purchases.routes.ts
var ADMIN_PURCHASES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Compras",
    loadComponent: () => import("./chunk-QDSIVRRS.mjs").then((m) => m.AdminPurchasesPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchases-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Compra",
    loadComponent: () => import("./chunk-QUVV5WE5.mjs").then((m) => m.AdminPurchaseFormPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchase-form-page.ts" } : {})
];
export {
  ADMIN_PURCHASES_ROUTES
};
//# sourceMappingURL=chunk-VI5B3FTD.mjs.map
