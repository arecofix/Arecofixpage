import './polyfills.server.mjs';
import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-KMT4KQ2P.mjs";
import {
  AuthService
} from "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  Router
} from "./chunk-GLYZDHZB.mjs";
import "./chunk-NQCCIK3J.mjs";
import {
  inject
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import {
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

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
    loadComponent: () => import("./chunk-ZZYVAIAJ.mjs").then((m) => m.AdminLayout),
    providers: [
      // Charts are only needed in admin — keep them out of the public bundle
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-XFVE4BJF.mjs").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-TYBTPAHY.mjs").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-DHDSNOUR.mjs").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-HKGROMKP.mjs").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-5SCYCA3P.mjs").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-DZB7LUTZ.mjs").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-SYCE3O53.mjs").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-GQQ4VSBH.mjs").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-ZTBMO5VE.mjs").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-3Q3EDUHU.mjs").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-D4XVPUYK.mjs").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-SAXXRMLC.mjs").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-IPKDO7RJ.mjs").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-UJJ3EGM5.mjs").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-CJKQPNPA.mjs").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-JAVQKY7V.mjs").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-X7I6YIZU.mjs").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-U46HAPVP.mjs").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, true ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-UWZSBIJZ.mjs.map
