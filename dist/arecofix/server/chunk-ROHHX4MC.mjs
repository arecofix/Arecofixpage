import './polyfills.server.mjs';
import {
  AccessibilitySidebarComponent
} from "./chunk-AGTVVFVN.mjs";
import {
  PreferencesService
} from "./chunk-5KBL4BBC.mjs";
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  AsyncPipe,
  CommonModule,
  NgClass,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-JEV3MPEL.mjs";
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
} from "./chunk-DXH6IVIR.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/admin/layout/admin-layout.ts
var _c0 = (a0) => [a0];
var _c1 = () => ["/"];
var _forTrack0 = ($index, $item) => $item.path;
function AdminLayout_For_22_Conditional_1_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 28);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const child_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", child_r4.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", child_r4.icon, " w-4 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r4.title);
  }
}
function AdminLayout_For_22_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 27);
    \u0275\u0275repeaterCreate(1, AdminLayout_For_22_Conditional_1_Conditional_7_For_2_Template, 5, 5, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(item_r2.children);
  }
}
function AdminLayout_For_22_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "a", 23);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 25);
    \u0275\u0275listener("click", function AdminLayout_For_22_Conditional_1_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const item_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleMenu(item_r2));
    });
    \u0275\u0275element(6, "i", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, AdminLayout_For_22_Conditional_1_Conditional_7_Template, 3, 0, "ul", 27);
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r2.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", item_r2.icon, " w-5 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("rotate-180", item_r2.expanded);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.expanded ? 7 : -1);
  }
}
function AdminLayout_For_22_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 21);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "span", 24);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", item_r2.path);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", item_r2.icon, " w-5 text-center"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.title);
  }
}
function AdminLayout_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275conditionalCreate(1, AdminLayout_For_22_Conditional_1_Template, 8, 8)(2, AdminLayout_For_22_Conditional_2_Template, 4, 5, "a", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.children ? 1 : 2);
  }
}
var AdminLayout = class _AdminLayout {
  authService = inject(AuthService);
  router = inject(Router);
  preferencesService = inject(PreferencesService);
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
  async logout() {
    await this.authService.signOut();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function AdminLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminLayout)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminLayout, selectors: [["app-admin-layout"]], decls: 35, vars: 11, consts: [[1, "drawer", "lg:drawer-open"], ["id", "admin-drawer", "type", "checkbox", 1, "drawer-toggle"], [1, "drawer-content", "flex", "flex-col", "bg-base-200", "min-h-screen", "text-base-content", 3, "ngClass"], [1, "w-full", "navbar", "bg-base-100", "border-b", "border-base-300", "lg:hidden", "text-base-content", "sticky", "top-0", "z-40", "shadow-sm"], [1, "flex-none"], ["for", "admin-drawer", "aria-label", "open sidebar", 1, "btn", "btn-square", "btn-ghost", "text-base-content"], [1, "fas", "fa-bars", "text-xl"], [1, "flex-1", "px-2", "mx-2", "font-bold", "text-lg"], [1, "flex-1", "p-6"], [1, "drawer-side", "z-50"], ["for", "admin-drawer", "aria-label", "close sidebar", 1, "drawer-overlay"], [1, "menu", "p-4", "w-64", "min-h-full", "bg-gray-900", "text-green-400", "gap-2"], [1, "mb-6"], [1, "flex", "items-center", "gap-3", "px-2", "hover:bg-transparent", "cursor-pointer", 3, "routerLink"], ["src", "/assets/img/brands/logo/logo-normal.PNG", "alt", "Arecofix Logo", "height", "32", 1, "h-8", "w-auto"], [1, "text-xl", "font-bold", "text-white"], [1, "divider", "divider-neutral", "my-4"], ["routerLink", "/perfil", 1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300"], [1, "fas", "fa-user-circle", "w-5", "text-center"], [1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-red-900/30", "text-red-400", "hover:text-red-300", 3, "click"], [1, "fas", "fa-sign-out-alt", "w-5", "text-center"], ["routerLinkActive", "bg-green-800 text-white", 1, "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300", "transition-colors", 3, "routerLink"], [1, "flex", "items-center", "gap-1"], ["routerLinkActive", "bg-green-800 text-white", 1, "flex-1", "flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "hover:bg-gray-800", "hover:text-green-300", "transition-colors", 3, "routerLink"], [1, "font-medium"], [1, "px-3", "py-3", "rounded-lg", "hover:bg-gray-800", "transition-colors", "text-green-400", "hover:text-green-300", 3, "click"], [1, "fas", "fa-chevron-down", "transition-transform", "duration-200"], [1, "pl-4", "mt-1", "space-y-1", "border-l", "border-gray-700", "ml-6"], ["routerLinkActive", "text-green-300 font-bold", 1, "flex", "items-center", "gap-3", "px-4", "py-2", "rounded-lg", "hover:bg-gray-800", "transition-colors", "text-sm", "text-green-500", "hover:text-green-300", 3, "routerLink"]], template: function AdminLayout_Template(rf, ctx) {
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
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "main", 8);
      \u0275\u0275element(12, "router-outlet");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 9);
      \u0275\u0275element(14, "label", 10);
      \u0275\u0275elementStart(15, "ul", 11)(16, "li", 12)(17, "a", 13);
      \u0275\u0275element(18, "img", 14);
      \u0275\u0275elementStart(19, "span", 15);
      \u0275\u0275text(20, "Arecofix");
      \u0275\u0275elementEnd()()();
      \u0275\u0275repeaterCreate(21, AdminLayout_For_22_Template, 3, 1, "li", null, _forTrack0);
      \u0275\u0275element(23, "div", 16);
      \u0275\u0275elementStart(24, "li")(25, "a", 17);
      \u0275\u0275element(26, "i", 18);
      \u0275\u0275elementStart(27, "span");
      \u0275\u0275text(28, "Mi Perfil");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "li")(30, "button", 19);
      \u0275\u0275listener("click", function AdminLayout_Template_button_click_30_listener() {
        return ctx.logout();
      });
      \u0275\u0275element(31, "i", 20);
      \u0275\u0275elementStart(32, "span");
      \u0275\u0275text(33, "Cerrar Sesi\xF3n");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275element(34, "app-accessibility-sidebar");
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("font-size", \u0275\u0275pipeBind1(3, 4, ctx.preferencesService.fontSize$), "px");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(8, _c0, \u0275\u0275pipeBind1(4, 6, ctx.preferencesService.highContrast$) ? "high-contrast" : ""));
      \u0275\u0275advance(15);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(10, _c1));
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.menuItems);
    }
  }, dependencies: [CommonModule, NgClass, RouterOutlet, RouterLink, RouterLinkActive, AccessibilitySidebarComponent, AsyncPipe], encapsulation: 2 });
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
    <div class="w-full navbar bg-base-100 border-b border-base-300 lg:hidden text-base-content sticky top-0 z-40 shadow-sm">\r
      <div class="flex-none">\r
        <label for="admin-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost text-base-content">\r
          <i class="fas fa-bars text-xl"></i>\r
        </label>\r
      </div>\r
      <div class="flex-1 px-2 mx-2 font-bold text-lg">Arecofix Admin</div>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminLayout, { className: "AdminLayout", filePath: "src/app/admin/layout/admin-layout.ts", lineNumber: 14 });
})();
export {
  AdminLayout
};
//# sourceMappingURL=chunk-ROHHX4MC.mjs.map
