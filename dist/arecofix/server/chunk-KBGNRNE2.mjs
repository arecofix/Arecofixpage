import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/purchases/admin-purchases.routes.ts
var ADMIN_PURCHASES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Compras",
    loadComponent: () => import("./chunk-WBWBWSYR.mjs").then((m) => m.AdminPurchasesPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchases-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Compra",
    loadComponent: () => import("./chunk-OGIESYPO.mjs").then((m) => m.AdminPurchaseFormPage)
  }, true ? { \u0275entryName: "src/app/admin/purchases/admin-purchase-form-page.ts" } : {})
];
export {
  ADMIN_PURCHASES_ROUTES
};
//# sourceMappingURL=chunk-KBGNRNE2.mjs.map
