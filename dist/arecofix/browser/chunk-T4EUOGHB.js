import {
  AuthService
} from "./chunk-NJJ5IL4Q.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  Router
} from "./chunk-WHLM5VZW.js";
import {
  inject
} from "./chunk-XQFVERLD.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

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
    loadComponent: () => import("./chunk-BFX6BOYM.js").then((m) => m.AdminLayout),
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-LRJQ5PRF.js").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-Q6O52C75.js").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-WHGYG4RG.js").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-2IBZJIWH.js").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-QDOKSSXF.js").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-5YKBQRV5.js").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-KEPLA44D.js").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-3NQH4XQV.js").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-BCDZVJZU.js").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-XC5WGZYN.js").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-MIAHETC6.js").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-YAQQCLIV.js").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-D3B5FCJD.js").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-FF5XOJ7G.js").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-V2QWFN62.js").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-F33NZZXM.js").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-KPKSNAIC.js").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-TZZKX2H3.js").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, false ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-T4EUOGHB.js.map
