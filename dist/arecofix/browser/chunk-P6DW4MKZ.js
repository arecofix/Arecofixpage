import {
  AuthService
} from "./chunk-QVICQRN7.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  Router
} from "./chunk-OCHCYWDE.js";
import {
  inject
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

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
  {
    title: "Admin",
    path: "",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-62XNHVUB.js").then((m) => m.AdminLayout),
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        title: "Dashboard",
        path: "dashboard",
        loadComponent: () => import("./chunk-VURW7TW7.js").then((m) => m.AdminDashboardPage)
      },
      {
        path: "products",
        loadChildren: () => import("./chunk-JDEO5FT4.js").then((m) => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: "categories",
        loadChildren: () => import("./chunk-UVC6QJTU.js").then((m) => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: "brands",
        loadChildren: () => import("./chunk-LKLJVGLO.js").then((m) => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: "clients",
        loadChildren: () => import("./chunk-5RVAYUIG.js").then((m) => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: "suppliers",
        loadChildren: () => import("./chunk-PL2FBVE4.js").then((m) => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: "company",
        loadChildren: () => import("./chunk-MJPRDJ5T.js").then((m) => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: "employees",
        loadChildren: () => import("./chunk-VIWZPEFU.js").then((m) => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: "sales",
        loadChildren: () => import("./chunk-B2IS7EK5.js").then((m) => m.ADMIN_SALES_ROUTES)
      },
      {
        path: "inventory",
        loadChildren: () => import("./chunk-5LS4CFVA.js").then((m) => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: "purchases",
        loadChildren: () => import("./chunk-KJ7DWUHI.js").then((m) => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: "users",
        loadChildren: () => import("./chunk-TMFUHA5N.js").then((m) => m.ADMIN_USERS_ROUTES)
      },
      {
        path: "courses",
        loadChildren: () => import("./chunk-6B4ZDOLP.js").then((m) => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: "orders",
        loadChildren: () => import("./chunk-ASRLIXUE.js").then((m) => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: "services",
        loadChildren: () => import("./chunk-BP4HO6DS.js").then((m) => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: "repairs",
        loadChildren: () => import("./chunk-BKQYCXG6.js").then((m) => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: "messages",
        loadChildren: () => import("./chunk-OCWTP3O4.js").then((m) => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: "posts",
        loadChildren: () => import("./chunk-O46TS5TD.js").then((m) => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }
];
var admin_routes_default = adminRoutes;
export {
  adminRoutes,
  admin_routes_default as default
};
//# sourceMappingURL=chunk-P6DW4MKZ.js.map
