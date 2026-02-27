import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/admin/purchases/admin-purchases.routes.ts
var ADMIN_PURCHASES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Compras",
    loadComponent: () => import("./chunk-MHRWBTJY.mjs").then((m) => m.AdminPurchasesPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchases-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Compra",
    loadComponent: () => import("./chunk-4JY2JLGK.mjs").then((m) => m.AdminPurchaseFormPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchase-form-page.ts" } : {})
];
export {
  ADMIN_PURCHASES_ROUTES
};
//# sourceMappingURL=chunk-D4XVPUYK.mjs.map
