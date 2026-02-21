import './polyfills.server.mjs';
import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-FYQL5OOI.mjs";
import {
  AuthService
} from "./chunk-ZWWV2735.mjs";
import "./chunk-7NQOFK7J.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  Router
} from "./chunk-YFUS3N4N.mjs";
import {
  inject
} from "./chunk-CGATP5QV.mjs";
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
    loadComponent: () => import("./chunk-D34M7LRK.mjs").then((m) => m.AdminLayout),
    providers: [
      // Charts are only needed in admin — keep them out of the public bundle
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-TWB7MBYC.mjs").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-PXFODU55.mjs").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-UFYYMHFT.mjs").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-TPDH427P.mjs").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-AQTQDGQQ.mjs").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-VIB2G5BQ.mjs").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-T7L7FWTT.mjs").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-S4JLEPDS.mjs").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-BT5HCZJZ.mjs").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-3M6XZFSS.mjs").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-VI5B3FTD.mjs").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-YOVIYFRC.mjs").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-GJ5MXUU5.mjs").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-ZI6XIDMQ.mjs").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-XQ2XNF3C.mjs").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-CQDBOI5C.mjs").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-YRR2WC44.mjs").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-NYJC2FVP.mjs").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, true ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-CDVEK6XK.mjs.map
