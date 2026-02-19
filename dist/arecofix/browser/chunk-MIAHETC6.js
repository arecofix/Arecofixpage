import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/purchases/admin-purchases.routes.ts
var ADMIN_PURCHASES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Compras",
    loadComponent: () => import("./chunk-A4DYJSGH.js").then((m) => m.AdminPurchasesPage)
  }, false ? { \u0275entryName: "src/app/admin/purchases/admin-purchases-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Compra",
    loadComponent: () => import("./chunk-S5WBSCMM.js").then((m) => m.AdminPurchaseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/purchases/admin-purchase-form-page.ts" } : {})
];
export {
  ADMIN_PURCHASES_ROUTES
};
//# sourceMappingURL=chunk-MIAHETC6.js.map
