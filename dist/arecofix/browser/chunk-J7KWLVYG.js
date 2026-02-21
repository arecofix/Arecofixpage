import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-DTP6GVLH.js";
import {
  AuthService
} from "./chunk-65AYZUFN.js";
import "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  Router
} from "./chunk-B7SLUDL7.js";
import {
  inject
} from "./chunk-4O7IFJFV.js";
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
    loadComponent: () => import("./chunk-D37M7V5U.js").then((m) => m.AdminLayout),
    providers: [
      // Charts are only needed in admin — keep them out of the public bundle
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-I6TL32FF.js").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-THZKSTUW.js").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-KYWYQLPY.js").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-5B5CHCWX.js").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-RPYQYYO6.js").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-5FRE5BPK.js").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-WJFNDKDB.js").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-6HJGCQQ4.js").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-I6ZGDUMA.js").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-AR2UGFBS.js").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-TIL6DEED.js").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-V5XSEALF.js").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-AGLWS7MH.js").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-XOQVFQZA.js").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-ADLX4G5D.js").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-L6S3AN5O.js").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-OKTBSSDG.js").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-DYDU675D.js").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }, false ? { \u0275entryName: "src/app/admin/layout/admin-layout.ts" } : {})
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-J7KWLVYG.js.map
