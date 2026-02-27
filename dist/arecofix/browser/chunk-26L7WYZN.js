import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-7I3KJFJA.js";
import {
  AuthService
} from "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import {
  Router
} from "./chunk-CP6GQXNM.js";
import "./chunk-F32QBW3I.js";
import {
  inject
} from "./chunk-DPJFS6PI.js";
import {
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/core/constants/roles.constants.ts
var ROLES = {
  SUPER_ADMIN: "super_admin",
  TENANT_OWNER: "tenant_owner",
  TECHNICIAN: "technician",
  STAFF: "staff",
  USER: "user",
  ADMIN: "admin"
  // Deprecated, keeping for compatibility during migration
};

// src/app/guards/auth.guard.ts
var authGuard = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const session = await authService.getSession();
  if (!session) {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  const userProfile = await authService.getUserProfile(session.user.id);
  const allowedRoles = [
    ROLES.ADMIN,
    ROLES.STAFF,
    ROLES.SUPER_ADMIN,
    ROLES.TENANT_OWNER,
    ROLES.TECHNICIAN
  ];
  if (userProfile?.role && allowedRoles.includes(userProfile.role)) {
    return true;
  }
  router.navigate(["/"]);
  return false;
};

// src/app/admin/admin.routes.ts
var adminRoutes = [
  __spreadValues({
    title: "Admin",
    path: "",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-FX2ZAXQL.js").then((m) => m.AdminLayout),
    providers: [
      // Charts are only needed in admin — keep them out of the public bundle
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-C2BDW7ZJ.js").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-UALDFV77.js").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-NYWSOUQE.js").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-QFMP7JJB.js").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-Q643C3DZ.js").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-ZQ3VTRJZ.js").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-VBCHBUZG.js").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-F4FF3WTZ.js").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-3BWLKJAN.js").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-OUKUHMZT.js").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-2U53JNL5.js").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-UM42WHUY.js").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-EKTIOQAS.js").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-IXNYTB4U.js").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-3SKUTR4Z.js").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-Z22KUITM.js").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-BKKHZY4Z.js").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-JCHD6AIY.js").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, false ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-26L7WYZN.js.map
