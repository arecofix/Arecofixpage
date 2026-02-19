import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-XXRJQVX5.mjs";
import "./chunk-2DAXHXIZ.mjs";
import "./chunk-PTNHDWI2.mjs";
import {
  Router
} from "./chunk-OW3O3C6K.mjs";
import {
  inject
} from "./chunk-TFR7QWGS.mjs";
import {
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/core/constants/roles.constants.ts
var ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user"
};

// src/app/guards/auth.guard.ts
var authGuard = (async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const session = await authService.getSession();
  if (!session) {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  if (state.url.startsWith("/admin")) {
    const userProfile = await authService.getUserProfile(session.user.id);
    if (userProfile?.role === ROLES.ADMIN || userProfile?.role === ROLES.STAFF) {
      return true;
    }
    router.navigate(["/"]);
    return false;
  }
  return true;
});

// src/app/admin/admin.routes.ts
var adminRoutes = [
  __spreadValues({
    title: "Admin",
    path: "",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-YRETFQHP.mjs").then((m) => m.AdminLayout),
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-K2CHO7CE.mjs").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-UEEZRG6J.mjs").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-YGLRAFTU.mjs").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-VZX4XHMU.mjs").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-TVAQLCXS.mjs").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-HNXYLANT.mjs").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-AYUZY24H.mjs").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-GFDT7JPN.mjs").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-H663SEZX.mjs").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-37PX35A6.mjs").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-CWSVKIOA.mjs").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-JU5BRHZD.mjs").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-SGBMDVUE.mjs").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-UJADWOVM.mjs").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-LLSGBGRG.mjs").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-2TXQ7YRK.mjs").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-NNNZBEFT.mjs").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-BIC7NH42.mjs").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, true ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-UYH46SLK.mjs.map
