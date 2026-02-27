import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/purchases/admin-purchases.routes.ts
var ADMIN_PURCHASES_ROUTES = [
  __spreadValues({
    path: "",
    title: "Compras",
    loadComponent: () => import("./chunk-UEVYHIG5.js").then((m) => m.AdminPurchasesPage)
  }, false ? { \u0275entryName: "src/app/admin/purchases/admin-purchases-page.ts" } : {}),
  __spreadValues({
    path: "new",
    title: "Nueva Compra",
    loadComponent: () => import("./chunk-JDQJSZ7T.js").then((m) => m.AdminPurchaseFormPage)
  }, false ? { \u0275entryName: "src/app/admin/purchases/admin-purchase-form-page.ts" } : {})
];
export {
  ADMIN_PURCHASES_ROUTES
};
//# sourceMappingURL=chunk-2U53JNL5.js.map
