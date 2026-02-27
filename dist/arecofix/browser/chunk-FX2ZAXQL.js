import {
  AccessibilitySidebarComponent
} from "./chunk-GUMHHYLY.js";
import {
  PreferencesService
} from "./chunk-EECV4RMG.js";
import {
  NotificationService
} from "./chunk-2PFUEYPY.js";
import {
  AuthService
} from "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-CP6GQXNM.js";
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  NgClass
} from "./chunk-F32QBW3I.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-DPJFS6PI.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/layout/admin-layout.ts
var _c0 = (a0) => [a0];
var _c1 = () => ["/"];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.path;
function AdminLayout_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.notificationService.unreadCount());
  }
}
function AdminLayout_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function AdminLayout_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.notificationService.markAllAsRead());
    });
    \u0275\u0275text(1, "Marcar le\xEDdas");
    \u0275\u0275elementEnd();
  }
}
function AdminLayout_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 37);
    \u0275\u0275elementStart(2, "p", 38);
    \u0275\u0275text(3, "Sin alertas por ahora");
    \u0275\u0275elementEnd()();
  }
}
function AdminLayout_For_28_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 43);
  }
}
function AdminLayout_For_28_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 44);
  }
}
function AdminLayout_For_28_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 45);
  }
}
function AdminLayout_For_28_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 46);
  }
}
function AdminLayout_For_28_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 47);
  }
}
function AdminLayout_For_28_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 49);
  }
}
function AdminLayout_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 39)(1, "a", 40);
    \u0275\u0275listener("click", function AdminLayout_For_28_Template_a_click_1_listener() {
      const notif_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.handleNotificationClick(notif_r4));
    });
    \u0275\u0275elementStart(2, "div", 41)(3, "span", 42);
    \u0275\u0275conditionalCreate(4, AdminLayout_For_28_Conditional_4_Template, 1, 0, "i", 43)(5, AdminLayout_For_28_Conditional_5_Template, 1, 0, "i", 44)(6, AdminLayout_For_28_Conditional_6_Template, 1, 0, "i", 45)(7, AdminLayout_For_28_Conditional_7_Template, 1, 0, "i", 46)(8, AdminLayout_For_28_Conditional_8_Template, 1, 0, "i", 47);
    \u0275\u0275elementStart(9, "span", 48);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, AdminLayout_For_28_Conditional_11_Template, 1, 0, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 50);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 51);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "date");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const notif_r4 = ctx.$implicit;
    \u0275\u0275classProp("bg-blue-50/50", !notif_r4.is_read)("dark:bg-blue-900/10", !notif_r4.is_read);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-base-content", notif_r4.is_read)("text-primary", !notif_r4.is_read);
    \u0275\u0275advance();
    \u0275\u0275conditional(notif_r4.type === "info" ? 4 : notif_r4.type === "success" ? 5 : notif_r4.type === "warning" ? 6 : notif_r4.type === "error" ? 7 : 8);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(notif_r4.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(!notif_r4.is_read ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(notif_r4.message);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(16, 13, notif_r4.created_at, "dd/MM - HH:mm"));
  }
}
function AdminLayout_For_40_Conditional_1_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 58);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const child_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", child_r7.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", child_r7.icon, " w-4 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r7.title);
  }
}
function AdminLayout_For_40_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 57);
    \u0275\u0275repeaterCreate(1, AdminLayout_For_40_Conditional_1_Conditional_7_For_2_Template, 5, 5, "li", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(item_r6.children);
  }
}
function AdminLayout_For_40_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53)(1, "a", 54);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span", 38);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 55);
    \u0275\u0275listener("click", function AdminLayout_For_40_Conditional_1_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const item_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleMenu(item_r6));
    });
    \u0275\u0275element(6, "i", 56);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, AdminLayout_For_40_Conditional_1_Conditional_7_Template, 3, 0, "ul", 57);
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r6.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", item_r6.icon, " w-5 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("rotate-180", item_r6.expanded);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.expanded ? 7 : -1);
  }
}
function AdminLayout_For_40_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 52);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "span", 38);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", item_r6.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", item_r6.icon, " w-5 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.title);
  }
}
function AdminLayout_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275conditionalCreate(1, AdminLayout_For_40_Conditional_1_Template, 8, 8)(2, AdminLayout_For_40_Conditional_2_Template, 4, 5, "a", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.children ? 1 : 2);
  }
}
var AdminLayout = class _AdminLayout {
  authService = inject(AuthService);
  router = inject(Router);
  preferencesService = inject(PreferencesService);
  notificationService = inject(NotificationService);
  menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: "fa-chart-line" },
    {
      title: "Productos",
      path: "/admin/products",
      icon: "fa-box",
      expanded: false,
      children: [
        { title: "Categor\xEDas", path: "/admin/categories", icon: "fa-tags" },
        { title: "Marcas", path: "/admin/brands", icon: "fa-copyright" },
        { title: "Inventario", path: "/admin/inventory", icon: "fa-warehouse" },
        { title: "Ventas", path: "/admin/sales", icon: "fa-cash-register" },
        { title: "Compras", path: "/admin/purchases", icon: "fa-shopping-bag" },
        { title: "Pedidos", path: "/admin/orders", icon: "fa-shopping-cart" },
        { title: "Clientes", path: "/admin/clients", icon: "fa-users" }
      ]
    },
    {
      title: "Empresa",
      path: "/admin/company",
      icon: "fa-building",
      expanded: false,
      children: [
        { title: "Empleados", path: "/admin/employees", icon: "fa-id-card" },
        { title: "Proveedores", path: "/admin/suppliers", icon: "fa-truck" },
        { title: "Facturaci\xF3n", path: "/admin/sales/invoices", icon: "fa-file-invoice-dollar" }
      ]
    },
    { title: "Cursos", path: "/admin/courses", icon: "fa-graduation-cap" },
    { title: "Servicios", path: "/admin/services", icon: "fa-tools" },
    { title: "Taller", path: "/admin/repairs", icon: "fa-wrench" },
    { title: "Usuarios", path: "/admin/users", icon: "fa-user-cog" },
    { title: "Mensajes", path: "/admin/messages", icon: "fa-envelope" },
    { title: "Entradas", path: "/admin/posts", icon: "fa-newspaper" }
  ];
  toggleMenu(item) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
  async ngOnInit() {
    await this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();
  }
  ngOnDestroy() {
    this.notificationService.unsubscribe();
  }
  handleNotificationClick(notif) {
    if (!notif.is_read) {
      this.notificationService.markAsRead(notif.id);
    }
    if (notif.link) {
      this.router.navigateByUrl(notif.link);
    }
  }
  async logout() {
    await this.authService.signOut();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function AdminLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminLayout)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminLayout, selectors: [["app-admin-layout"]], decls: 53, vars: 14, consts: [[1, "drawer", "lg:drawer-open"], ["id", "admin-drawer", "type", "checkbox", 1, "drawer-toggle"], [1, "drawer-content", "flex", "flex-col", "bg-base-200", "min-h-screen", "text-base-content", 3, "ngClass"], [1, "w-full", "navbar", "bg-base-100", "border-b", "border-base-300", "text-base-content", "sticky", "top-0", "z-40", "shadow-sm"], [1, "flex-none", "lg:hidden"], ["for", "admin-drawer", "aria-label", "open sidebar", 1, "btn", "btn-square", "btn-ghost", "text-base-content"], [1, "fas", "fa-bars", "text-xl"], [1, "flex-1", "px-2", "mx-2", "font-bold", "text-lg", "lg:hidden"], [1, "flex-1", "hidden", "lg:flex", "px-4", "font-bold", "text-base-content"], [1, "flex-none"], [1, "dropdown", "dropdown-end"], ["tabindex", "0", "role", "button", 1, "btn", "btn-ghost", "btn-circle"], [1, "indicator"], [1, "fas", "fa-bell", "text-xl", "text-gray-500", "hover:text-primary", "transition-colors"], [1, "badge", "badge-xs", "indicator-item", "badge-error", "px-1.5", "py-2", "animate-bounce", "cursor-pointer"], ["tabindex", "0", 1, "mt-3", "z-1", "card", "card-compact", "dropdown-content", "w-80", "bg-base-100", "shadow-2xl", "border", "border-base-300"], [1, "card-body", "p-0", "max-h-96", "overflow-y-auto"], [1, "px-4", "py-3", "border-b", "border-base-200", "flex", "justify-between", "items-center", "bg-base-200/50", "rounded-t-2xl", "sticky", "top-0", "z-10", "backdrop-blur"], [1, "font-bold", "text-base"], ["type", "button", 1, "text-xs", "text-primary", "font-medium", "hover:underline"], [1, "p-8", "text-center", "text-gray-500"], [1, "menu", "p-0", "w-full", "mb-2"], [1, "border-b", "border-base-200", "last:border-0", 3, "bg-blue-50/50", "dark:bg-blue-900/10"], [1, "flex-1", "p-6"], [1, "drawer-side", "z-50"], ["for", "admin-drawer", "aria-label", "close sidebar", 1, "drawer-overlay"], [1, "menu", "p-4", "w-64", "min-h-full", "bg-gray-900", "text-green-400", "gap-2"], [1, "mb-6"], [1, "flex", "items-center", "gap-3", "px-2", "hover:bg-transparent", "cursor-pointer", 3, "routerLink"], ["src", "/assets/img/brands/logo/logo-normal.PNG", "alt", "Arecofix Logo", "height", "32", 1, "h-8", "w-auto"], [1, "text-xl", "font-bold", "text-white"], [1, "divider", "divider-neutral", "my-4"], ["routerLink", "/perfil", 1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300"], [1, "fas", "fa-user-circle", "w-5", "text-center"], [1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-red-900/30", "text-red-400", "hover:text-red-300", 3, "click"], [1, "fas", "fa-sign-out-alt", "w-5", "text-center"], ["type", "button", 1, "text-xs", "text-primary", "font-medium", "hover:underline", 3, "click"], [1, "fas", "fa-bell-slash", "text-4xl", "mb-3", "opacity-30"], [1, "font-medium"], [1, "border-b", "border-base-200", "last:border-0"], [1, "flex", "flex-col", "items-start", "p-3", "gap-1", "hover:bg-base-200", "rounded-none", "cursor-pointer", 3, "click"], [1, "flex", "w-full", "justify-between", "items-start"], [1, "font-bold", "text-sm", "flex", "items-center", "gap-2"], [1, "fas", "fa-info-circle", "text-blue-500", "text-base"], [1, "fas", "fa-check-circle", "text-green-500", "text-base"], [1, "fas", "fa-exclamation-triangle", "text-amber-500", "text-base"], [1, "fas", "fa-times-circle", "text-rose-500", "text-base"], [1, "fas", "fa-bell", "text-gray-400", "text-base"], [1, "leading-tight"], [1, "w-2.5", "h-2.5", "rounded-full", "bg-primary", "shrink-0", "mt-1", "shadow", "shadow-primary/40"], [1, "text-xs", "text-base-content/70", "line-clamp-2", "leading-tight", "pl-6"], [1, "text-[10px]", "text-gray-400", "mt-1", "pl-6"], ["routerLinkActive", "bg-green-800 text-white", 1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300", "transition-colors", 3, "routerLink"], [1, "flex", "items-center", "gap-1"], ["routerLinkActive", "bg-green-800 text-white", 1, "flex-1", "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300", "transition-colors", 3, "routerLink"], [1, "px-3", "py-3", "rounded-lg", "hover:bg-gray-800", "transition-colors", "text-green-400", "hover:text-green-300", 3, "click"], [1, "fas", "fa-chevron-down", "transition-transform", "duration-200"], [1, "pl-4", "mt-1", "space-y-1", "border-l", "border-gray-700", "ml-6"], ["routerLinkActive", "text-green-300 font-bold", 1, "flex", "items-center", "gap-3", "px-4", "py-2", "rounded-lg", "hover:bg-gray-800", "transition-colors", "text-sm", "text-green-500", "hover:text-green-300", 3, "routerLink"]], template: function AdminLayout_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "input", 1);
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275pipe(3, "async");
      \u0275\u0275pipe(4, "async");
      \u0275\u0275elementStart(5, "div", 3)(6, "div", 4)(7, "label", 5);
      \u0275\u0275element(8, "i", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 7);
      \u0275\u0275text(10, "Arecofix Admin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 8);
      \u0275\u0275text(12, "Panel de Administraci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 9)(14, "div", 10)(15, "div", 11)(16, "div", 12);
      \u0275\u0275element(17, "i", 13);
      \u0275\u0275conditionalCreate(18, AdminLayout_Conditional_18_Template, 2, 1, "span", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 15)(20, "div", 16)(21, "div", 17)(22, "span", 18);
      \u0275\u0275text(23, "Notificaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, AdminLayout_Conditional_24_Template, 2, 0, "button", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(25, AdminLayout_Conditional_25_Template, 4, 0, "div", 20);
      \u0275\u0275elementStart(26, "ul", 21);
      \u0275\u0275repeaterCreate(27, AdminLayout_For_28_Template, 17, 16, "li", 22, _forTrack0);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(29, "main", 23);
      \u0275\u0275element(30, "router-outlet");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 24);
      \u0275\u0275element(32, "label", 25);
      \u0275\u0275elementStart(33, "ul", 26)(34, "li", 27)(35, "a", 28);
      \u0275\u0275element(36, "img", 29);
      \u0275\u0275elementStart(37, "span", 30);
      \u0275\u0275text(38, "Arecofix");
      \u0275\u0275elementEnd()()();
      \u0275\u0275repeaterCreate(39, AdminLayout_For_40_Template, 3, 1, "li", null, _forTrack1);
      \u0275\u0275element(41, "div", 31);
      \u0275\u0275elementStart(42, "li")(43, "a", 32);
      \u0275\u0275element(44, "i", 33);
      \u0275\u0275elementStart(45, "span");
      \u0275\u0275text(46, "Mi Perfil");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(47, "li")(48, "button", 34);
      \u0275\u0275listener("click", function AdminLayout_Template_button_click_48_listener() {
        return ctx.logout();
      });
      \u0275\u0275element(49, "i", 35);
      \u0275\u0275elementStart(50, "span");
      \u0275\u0275text(51, "Cerrar Sesi\xF3n");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275element(52, "app-accessibility-sidebar");
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("font-size", \u0275\u0275pipeBind1(3, 7, ctx.preferencesService.fontSize$), "px");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c0, \u0275\u0275pipeBind1(4, 9, ctx.preferencesService.highContrast$) ? "high-contrast" : ""));
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.notificationService.unreadCount() > 0 ? 18 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.notificationService.unreadCount() > 0 ? 24 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.notificationService.dbNotifications().length === 0 ? 25 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.notificationService.dbNotifications());
      \u0275\u0275advance(8);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(13, _c1));
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.menuItems);
    }
  }, dependencies: [CommonModule, NgClass, RouterOutlet, RouterLink, RouterLinkActive, AccessibilitySidebarComponent, AsyncPipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminLayout, [{
    type: Component,
    args: [{ selector: "app-admin-layout", standalone: true, imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AccessibilitySidebarComponent], template: `<div class="drawer lg:drawer-open">\r
  <input id="admin-drawer" type="checkbox" class="drawer-toggle" />\r
\r
  <div class="drawer-content flex flex-col bg-base-200 min-h-screen text-base-content"\r
    [ngClass]="[(preferencesService.highContrast$ | async) ? 'high-contrast' : '']"\r
    [style.font-size.px]="(preferencesService.fontSize$ | async)">\r
    <!-- Navbar -->\r
    <div class="w-full navbar bg-base-100 border-b border-base-300 text-base-content sticky top-0 z-40 shadow-sm">\r
      <div class="flex-none lg:hidden">\r
        <label for="admin-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost text-base-content">\r
          <i class="fas fa-bars text-xl"></i>\r
        </label>\r
      </div>\r
      <div class="flex-1 px-2 mx-2 font-bold text-lg lg:hidden">Arecofix Admin</div>\r
      <div class="flex-1 hidden lg:flex px-4 font-bold text-base-content">Panel de Administraci\xF3n</div>\r
      \r
      <!-- Notifications Bell -->\r
      <div class="flex-none">\r
        <div class="dropdown dropdown-end">\r
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">\r
            <div class="indicator">\r
              <i class="fas fa-bell text-xl text-gray-500 hover:text-primary transition-colors"></i>\r
              @if (notificationService.unreadCount() > 0) {\r
              <span class="badge badge-xs indicator-item badge-error px-1.5 py-2 animate-bounce cursor-pointer">{{ notificationService.unreadCount() }}</span>\r
              }\r
            </div>\r
          </div>\r
          <div tabindex="0" class="mt-3 z-1 card card-compact dropdown-content w-80 bg-base-100 shadow-2xl border border-base-300">\r
            <div class="card-body p-0 max-h-96 overflow-y-auto">\r
              <div class="px-4 py-3 border-b border-base-200 flex justify-between items-center bg-base-200/50 rounded-t-2xl sticky top-0 z-10 backdrop-blur">\r
                <span class="font-bold text-base">Notificaciones</span>\r
                @if (notificationService.unreadCount() > 0) {\r
                <button type="button" class="text-xs text-primary font-medium hover:underline" (click)="notificationService.markAllAsRead()">Marcar le\xEDdas</button>\r
                }\r
              </div>\r
              \r
              @if (notificationService.dbNotifications().length === 0) {\r
                <div class="p-8 text-center text-gray-500">\r
                  <i class="fas fa-bell-slash text-4xl mb-3 opacity-30"></i>\r
                  <p class="font-medium">Sin alertas por ahora</p>\r
                </div>\r
              }\r
              \r
              <ul class="menu p-0 w-full mb-2">\r
                @for (notif of notificationService.dbNotifications(); track notif.id) {\r
                <li class="border-b border-base-200 last:border-0" [class.bg-blue-50/50]="!notif.is_read" [class.dark:bg-blue-900/10]="!notif.is_read">\r
                  <a class="flex flex-col items-start p-3 gap-1 hover:bg-base-200 rounded-none cursor-pointer" (click)="handleNotificationClick(notif)">\r
                    <div class="flex w-full justify-between items-start">\r
                      <span class="font-bold text-sm flex items-center gap-2" [class.text-base-content]="notif.is_read" [class.text-primary]="!notif.is_read">\r
                        @if (notif.type === 'info') { <i class="fas fa-info-circle text-blue-500 text-base"></i> }\r
                        @else if (notif.type === 'success') { <i class="fas fa-check-circle text-green-500 text-base"></i> }\r
                        @else if (notif.type === 'warning') { <i class="fas fa-exclamation-triangle text-amber-500 text-base"></i> }\r
                        @else if (notif.type === 'error') { <i class="fas fa-times-circle text-rose-500 text-base"></i> }\r
                        @else { <i class="fas fa-bell text-gray-400 text-base"></i> }\r
                        <span class="leading-tight">{{ notif.title }}</span>\r
                      </span>\r
                      @if (!notif.is_read) {\r
                        <div class="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1 shadow shadow-primary/40"></div>\r
                      }\r
                    </div>\r
                    <span class="text-xs text-base-content/70 line-clamp-2 leading-tight pl-6">{{ notif.message }}</span>\r
                    <span class="text-[10px] text-gray-400 mt-1 pl-6">{{ notif.created_at | date:'dd/MM - HH:mm' }}</span>\r
                  </a>\r
                </li>\r
                }\r
              </ul>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Page Content -->\r
    <main class="flex-1 p-6">\r
      <router-outlet></router-outlet>\r
    </main>\r
  </div>\r
\r
  <!-- Sidebar -->\r
  <div class="drawer-side z-50">\r
    <label for="admin-drawer" aria-label="close sidebar" class="drawer-overlay"></label>\r
    <ul class="menu p-4 w-64 min-h-full bg-gray-900 text-green-400 gap-2">\r
      <!-- Logo -->\r
      <li class="mb-6">\r
        <a class="flex items-center gap-3 px-2 hover:bg-transparent cursor-pointer" [routerLink]="['/']">\r
          <img src="/assets/img/brands/logo/logo-normal.PNG" alt="Arecofix Logo" class="h-8 w-auto" height="32" />\r
          <span class="text-xl font-bold text-white">Arecofix</span>\r
        </a>\r
      </li>\r
      <!-- Menu Items -->\r
      @for (item of menuItems; track item.path) {\r
      <li>\r
        @if (item.children) {\r
        <div class="flex items-center gap-1">\r
          <a [routerLink]="item.path" routerLinkActive="bg-green-800 text-white"\r
            class="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-green-300 transition-colors">\r
            <i class="fas {{item.icon}} w-5 text-center"></i>\r
            <span class="font-medium">{{item.title}}</span>\r
          </a>\r
          <button (click)="toggleMenu(item)"\r
            class="px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-green-400 hover:text-green-300">\r
            <i class="fas fa-chevron-down transition-transform duration-200" [class.rotate-180]="item.expanded"></i>\r
          </button>\r
        </div>\r
\r
        @if (item.expanded) {\r
        <ul class="pl-4 mt-1 space-y-1 border-l border-gray-700 ml-6">\r
          @for (child of item.children; track child.path) {\r
          <li>\r
            <a [routerLink]="child.path" routerLinkActive="text-green-300 font-bold"\r
              class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-green-500 hover:text-green-300">\r
              <i class="fas {{child.icon}} w-4 text-center"></i>\r
              <span>{{child.title}}</span>\r
            </a>\r
          </li>\r
          }\r
        </ul>\r
        }\r
        } @else {\r
        <a [routerLink]="item.path" routerLinkActive="bg-green-800 text-white"\r
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-green-300 transition-colors">\r
          <i class="fas {{item.icon}} w-5 text-center"></i>\r
          <span class="font-medium">{{item.title}}</span>\r
        </a>\r
        }\r
      </li>\r
      }\r
\r
      <div class="divider divider-neutral my-4"></div>\r
\r
      <!-- User & Logout -->\r
      <li>\r
        <a routerLink="/perfil" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-green-300">\r
          <i class="fas fa-user-circle w-5 text-center"></i>\r
          <span>Mi Perfil</span>\r
        </a>\r
      </li>\r
      <li>\r
        <button (click)="logout()"\r
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300">\r
          <i class="fas fa-sign-out-alt w-5 text-center"></i>\r
          <span>Cerrar Sesi\xF3n</span>\r
        </button>\r
      </li>\r
    </ul>\r
  </div>\r
</div>\r
\r
<app-accessibility-sidebar></app-accessibility-sidebar>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminLayout, { className: "AdminLayout", filePath: "src/app/admin/layout/admin-layout.ts", lineNumber: 15 });
})();
export {
  AdminLayout
};
//# sourceMappingURL=chunk-FX2ZAXQL.js.map
