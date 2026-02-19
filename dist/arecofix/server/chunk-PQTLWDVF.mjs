import './polyfills.server.mjs';
import {
  AccessibilitySidebarComponent
} from "./chunk-G76ETOUX.mjs";
import {
  PreferencesService
} from "./chunk-BAWL3Z4D.mjs";
import {
  CartService
} from "./chunk-YMGO4LTZ.mjs";
import {
  ThemeService
} from "./chunk-D62FU5VD.mjs";
import "./chunk-G6NEPWSD.mjs";
import {
  SeoService
} from "./chunk-PLK7AW4H.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-62W3S7X6.mjs";
import {
  AuthService
} from "./chunk-XXRJQVX5.mjs";
import "./chunk-2DAXHXIZ.mjs";
import {
  environment
} from "./chunk-PTNHDWI2.mjs";
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgIf,
  NgOptimizedImage,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  isPlatformBrowser
} from "./chunk-OW3O3C6K.mjs";
import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EMPTY,
  ElementRef,
  HostListener,
  Injectable,
  Input,
  NgZone,
  PLATFORM_ID,
  Subject,
  Subscription,
  computed,
  debounceTime,
  distinctUntilChanged,
  effect,
  inject,
  map,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-TFR7QWGS.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/shared/services/search.service.ts
var SearchService = class _SearchService {
  // ── Private state ────────────────────────────────────
  querySubject = new BehaviorSubject("");
  focusTrigger = new Subject();
  /** Debounce window in milliseconds */
  static DEBOUNCE_MS = 300;
  // ── Public API ───────────────────────────────────────
  /** Raw, un-debounced query (useful for two-way binding in the template). */
  query$ = this.querySubject.asObservable();
  /** Optimized stream: emits only after the user stops typing and the value changed. */
  debouncedQuery$ = this.querySubject.pipe(debounceTime(_SearchService.DEBOUNCE_MS), distinctUntilChanged());
  /** Fires when the navbar lupa icon is clicked → the drawer should open & focus. */
  focusRequested$ = this.focusTrigger.asObservable();
  // ── Mutations ────────────────────────────────────────
  /** Update the search query (called from the input's ngModel or event). */
  updateQuery(value) {
    this.querySubject.next(value);
  }
  /** Get the current query snapshot. */
  get currentQuery() {
    return this.querySubject.getValue();
  }
  /** Clear the search query. */
  clearQuery() {
    this.querySubject.next("");
  }
  /**
   * Request that the mobile drawer opens and the search input receives focus.
   * Called by the navbar search-icon button.
   */
  requestSearchFocus() {
    this.focusTrigger.next();
  }
  static \u0275fac = function SearchService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SearchService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SearchService, factory: _SearchService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SearchService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/directives/auto-focus.directive.ts
var AutoFocusDirective = class _AutoFocusDirective {
  /** Observable that triggers focus on each emission. */
  focusTrigger$ = EMPTY;
  /** If true, focus the element as soon as the directive initialises. */
  appAutoFocusImmediate = false;
  el = inject(ElementRef);
  platformId = inject(PLATFORM_ID);
  zone = inject(NgZone);
  subscription;
  /** Small delay to ensure the element is rendered and visible before focusing. */
  static FOCUS_DELAY_MS = 80;
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId))
      return;
    if (this.appAutoFocusImmediate) {
      this.focusElement();
    }
    this.subscription = this.focusTrigger$.subscribe(() => this.focusElement());
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  /** Schedule focus with a micro-delay so Angular has time to render the host. */
  focusElement() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.el.nativeElement.focus({ preventScroll: false });
      }, _AutoFocusDirective.FOCUS_DELAY_MS);
    });
  }
  static \u0275fac = function AutoFocusDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AutoFocusDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _AutoFocusDirective, selectors: [["", "appAutoFocus", ""]], inputs: { focusTrigger$: [0, "appAutoFocus", "focusTrigger$"], appAutoFocusImmediate: "appAutoFocusImmediate" } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AutoFocusDirective, [{
    type: Directive,
    args: [{
      selector: "[appAutoFocus]",
      standalone: true
    }]
  }], null, { focusTrigger$: [{
    type: Input,
    args: ["appAutoFocus"]
  }], appAutoFocusImmediate: [{
    type: Input
  }] });
})();

// src/app/shared/models/navigation.data.ts
var NAVIGATION_ITEMS = [
  // ══════════════════════════════════════════════════
  // TIENDA — Productos, repuestos, electrónica
  // ══════════════════════════════════════════════════
  {
    id: "tienda",
    label: "Tienda",
    path: "/productos",
    icon: "fas fa-store",
    theme: "tienda",
    description: "Productos, repuestos y accesorios",
    children: [
      {
        id: "tienda-celulares",
        label: "Celulares",
        path: "/productos/categoria/celulares",
        icon: "fas fa-mobile-alt",
        theme: "tienda",
        description: "Smartphones nuevos y reacondicionados",
        children: [
          {
            id: "tienda-celulares-nuevos",
            label: "Nuevos",
            path: "/productos/categoria/celulares-nuevos",
            icon: "fas fa-box-open",
            theme: "tienda"
          },
          {
            id: "tienda-celulares-reacondicionados",
            label: "Reacondicionados",
            path: "/productos/categoria/celulares-reacondicionados",
            icon: "fas fa-recycle",
            theme: "tienda"
          },
          {
            id: "tienda-celulares-tablets",
            label: "Tablets",
            path: "/productos/categoria/tablets",
            icon: "fas fa-tablet-alt",
            theme: "tienda"
          }
        ]
      },
      {
        id: "tienda-repuestos",
        label: "Repuestos",
        path: "/repuestos",
        icon: "fas fa-microchip",
        theme: "tienda",
        description: "Pantallas, bater\xEDas, flex y m\xE1s",
        children: [
          {
            id: "tienda-repuestos-modulos",
            label: "M\xF3dulos / Pantallas",
            path: "/productos/categoria/modulos",
            icon: "fas fa-th",
            theme: "tienda"
          },
          {
            id: "tienda-repuestos-baterias",
            label: "Bater\xEDas",
            path: "/productos/categoria/baterias",
            icon: "fas fa-battery-full",
            theme: "tienda"
          },
          {
            id: "tienda-repuestos-flex",
            label: "Flex & Cables",
            path: "/productos/categoria/flex",
            icon: "fas fa-plug",
            theme: "tienda"
          },
          {
            id: "tienda-repuestos-pin-carga",
            label: "Pines de Carga",
            path: "/productos/categoria/pin-de-carga",
            icon: "fas fa-charging-station",
            theme: "tienda"
          }
        ]
      },
      {
        id: "tienda-electronicos",
        label: "Electr\xF3nica",
        path: "/productos/categoria/electronicos",
        icon: "fas fa-laptop",
        theme: "tienda",
        description: "Computaci\xF3n, accesorios y gadgets",
        children: [
          {
            id: "tienda-electronicos-accesorios",
            label: "Accesorios",
            path: "/productos/categoria/accesorios",
            icon: "fas fa-headphones",
            theme: "tienda"
          },
          {
            id: "tienda-electronicos-computacion",
            label: "Computaci\xF3n",
            path: "/productos/categoria/computacion",
            icon: "fas fa-desktop",
            theme: "tienda"
          },
          {
            id: "tienda-electronicos-audio",
            label: "Audio & Video",
            path: "/productos/categoria/audio-video",
            icon: "fas fa-volume-up",
            theme: "tienda"
          },
          {
            id: "tienda-electronicos-redes",
            label: "Redes & WiFi",
            path: "/productos/categoria/redes",
            icon: "fas fa-wifi",
            theme: "tienda"
          }
        ]
      },
      {
        id: "tienda-herramientas",
        label: "Herramientas",
        path: "/productos/categoria/herramientas",
        icon: "fas fa-wrench",
        theme: "tienda",
        description: "Kits profesionales de reparaci\xF3n"
      },
      {
        id: "tienda-destacados",
        label: "Destacados",
        path: "/productos/destacados",
        icon: "fas fa-star",
        theme: "tienda",
        badge: "Hot"
      },
      {
        id: "tienda-categorias",
        label: "Todas las Categor\xEDas",
        path: "/categories",
        icon: "fas fa-tags",
        theme: "tienda"
      }
    ]
  },
  // ══════════════════════════════════════════════════
  // SERVICIOS — Técnico, IT, GSM, Portfolio
  // ══════════════════════════════════════════════════
  {
    id: "servicios",
    label: "Servicios",
    path: "/servicios",
    icon: "fas fa-concierge-bell",
    theme: "software",
    description: "Servicio t\xE9cnico, desarrollo y consultor\xEDa IT",
    children: [
      {
        id: "servicios-tecnico",
        label: "Servicio T\xE9cnico de Celulares",
        path: "/celular",
        icon: "fas fa-mobile-alt",
        theme: "software",
        description: "Reparaci\xF3n en el acto en Marcos Paz",
        badge: "\u26A1"
      },
      {
        id: "servicios-it",
        label: "Consultor\xEDa IT",
        path: "/",
        icon: "fas fa-server",
        theme: "software",
        description: "Desarrollo web, apps y transformaci\xF3n digital"
      },
      {
        id: "servicios-gsm",
        label: "GSM Tools",
        path: "/gsm",
        icon: "fas fa-satellite-dish",
        theme: "software",
        description: "Flash, unlock y diagn\xF3stico"
      },
      {
        id: "servicios-tracking",
        label: "Seguimiento de Reparaci\xF3n",
        path: "/tracking/consulta",
        icon: "fas fa-search-location",
        theme: "software",
        description: "Consult\xE1 el estado de tu equipo"
      },
      {
        id: "servicios-portfolio",
        label: "Portfolio",
        path: "/portfolio",
        icon: "fas fa-briefcase",
        theme: "software",
        description: "Proyectos y experiencia profesional"
      }
    ]
  },
  // ══════════════════════════════════════════════════
  // ACADEMIA — Cursos, blog, recursos
  // ══════════════════════════════════════════════════
  {
    id: "academia",
    label: "Academia",
    path: "/academy",
    icon: "fas fa-graduation-cap",
    theme: "academia",
    description: "Cursos, blog y recursos t\xE9cnicos",
    children: [
      {
        id: "academia-cursos",
        label: "Cursos",
        path: "/academy",
        icon: "fas fa-chalkboard-teacher",
        theme: "academia",
        description: "Reparaci\xF3n de celulares y electr\xF3nica",
        badge: "Nuevo"
      },
      {
        id: "academia-blog",
        label: "Blog",
        path: "/blog",
        icon: "fas fa-newspaper",
        theme: "academia",
        description: "Art\xEDculos, gu\xEDas y tutoriales"
      },
      {
        id: "academia-recursos",
        label: "Recursos",
        path: "/recursos",
        icon: "fas fa-download",
        theme: "academia",
        description: "Drivers, manuales y descargas"
      },
      {
        id: "academia-fixtecnicos",
        label: "FixT\xE9cnicos",
        path: "/fixtecnicos",
        icon: "fas fa-users-cog",
        theme: "academia",
        description: "Comunidad de t\xE9cnicos reparadores"
      }
    ]
  },
  // ══════════════════════════════════════════════════
  // LINKS DIRECTOS
  // ══════════════════════════════════════════════════
  {
    id: "nosotros",
    label: "Nosotros",
    path: "/nosotros",
    icon: "fas fa-users",
    theme: "general"
  },
  {
    id: "contacto",
    label: "Contacto",
    path: "/contacto",
    icon: "fas fa-envelope",
    theme: "general"
  }
];
var THEME_STYLES = {
  tienda: { gradient: "from-blue-500 to-cyan-400", accent: "text-blue-400", bg: "bg-blue-500/10" },
  software: { gradient: "from-purple-500 to-pink-400", accent: "text-purple-400", bg: "bg-purple-500/10" },
  academia: { gradient: "from-emerald-500 to-teal-400", accent: "text-emerald-400", bg: "bg-emerald-500/10" },
  general: { gradient: "from-gray-400 to-gray-500", accent: "text-gray-400", bg: "bg-gray-500/10" }
};
var VIEW_ALL_LABELS = {
  tienda: "Ver todos los productos",
  servicios: "Ver todos los servicios",
  academia: "Ver toda la academia"
};

// src/app/shared/components/nav-item-recursive/nav-item-recursive.component.ts
var _c0 = () => ({ exact: true });
var _forTrack0 = ($index, $item) => $item.id;
function NavItemRecursiveComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.item.badge, " ");
  }
}
function NavItemRecursiveComponent_Conditional_0_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 9);
    \u0275\u0275element(1, "i", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", ctx_r1.item.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(3, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getViewAllLabel(ctx_r1.item.id, ctx_r1.item.label), " ");
  }
}
function NavItemRecursiveComponent_Conditional_0_Conditional_8_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nav-item-recursive", 10);
  }
  if (rf & 2) {
    const child_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("item", child_r3)("depth", ctx_r1.depth + 1);
  }
}
function NavItemRecursiveComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275conditionalCreate(1, NavItemRecursiveComponent_Conditional_0_Conditional_8_Conditional_1_Template, 3, 4, "a", 9);
    \u0275\u0275repeaterCreate(2, NavItemRecursiveComponent_Conditional_0_Conditional_8_For_3_Template, 1, 2, "app-nav-item-recursive", 10, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.item.path ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.item.children);
  }
}
function NavItemRecursiveComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 1);
    \u0275\u0275listener("click", function NavItemRecursiveComponent_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isOpen.set(!ctx_r1.isOpen()));
    });
    \u0275\u0275elementStart(1, "span", 2)(2, "span", 3);
    \u0275\u0275element(3, "i", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275conditionalCreate(5, NavItemRecursiveComponent_Conditional_0_Conditional_5_Template, 2, 1, "span", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(6, "svg", 6);
    \u0275\u0275element(7, "path", 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, NavItemRecursiveComponent_Conditional_0_Conditional_8_Template, 4, 1, "div", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("padding-left", ctx_r1.depth * 16, "px");
    \u0275\u0275attribute("aria-expanded", ctx_r1.isOpen());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getThemeBg(ctx_r1.item.theme));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.item.icon);
    \u0275\u0275property("ngClass", ctx_r1.getThemeAccent(ctx_r1.item.theme));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.item.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.item.badge ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("rotate-180", ctx_r1.isOpen());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isOpen() ? 8 : -1);
  }
}
function NavItemRecursiveComponent_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.item.badge, " ");
  }
}
function NavItemRecursiveComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 12)(1, "span", 3);
    \u0275\u0275element(2, "i", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, NavItemRecursiveComponent_Conditional_1_Conditional_4_Template, 2, 1, "span", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("padding-left", ctx_r1.depth * 16, "px");
    \u0275\u0275property("routerLink", ctx_r1.item.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(11, _c0));
    \u0275\u0275attribute("target", ctx_r1.item.external ? "_blank" : null);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getThemeBg(ctx_r1.item.theme));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.item.icon);
    \u0275\u0275property("ngClass", ctx_r1.getThemeAccent(ctx_r1.item.theme));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.item.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.item.badge ? 4 : -1);
  }
}
var NavItemRecursiveComponent = class _NavItemRecursiveComponent {
  item;
  depth = 0;
  /** Controls accordion open/close state */
  isOpen = signal(false, ...ngDevMode ? [{ debugName: "isOpen" }] : []);
  getThemeBg(theme) {
    return THEME_STYLES[theme]?.bg ?? THEME_STYLES["general"].bg;
  }
  getThemeAccent(theme) {
    return THEME_STYLES[theme]?.accent ?? THEME_STYLES["general"].accent;
  }
  /** Context-aware "Ver todo" label */
  getViewAllLabel(itemId, itemLabel) {
    return VIEW_ALL_LABELS[itemId] ?? `Ver todo ${itemLabel}`;
  }
  static \u0275fac = function NavItemRecursiveComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavItemRecursiveComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavItemRecursiveComponent, selectors: [["app-nav-item-recursive"]], inputs: { item: "item", depth: "depth" }, decls: 2, vars: 1, consts: [["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "items-center", "gap-3", "py-2.5", "text-sm", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLink", "routerLinkActiveOptions", "padding-left"], [1, "flex", "items-center", "justify-between", "w-full", "py-2.5", "pr-2", "outline-none", "cursor-pointer", "hover:text-blue-500", "transition-colors", "select-none", "text-left", 3, "click"], [1, "flex", "items-center", "gap-3", "flex-1", "font-medium", "text-sm"], [1, "w-6", "h-6", "rounded-lg", "flex", "items-center", "justify-center", "text-xs", 3, "ngClass"], [3, "ngClass"], [1, "text-[10px]", "font-bold", "px-1.5", "py-0.5", "rounded-full", "bg-red-500/20", "text-red-400"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2.5", 1, "w-3.5", "h-3.5", "opacity-50", "shrink-0", "transition-transform", "duration-300", "ease-out"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M19 9l-7 7-7-7"], [1, "border-l", "border-gray-200", "dark:border-white/10", "ml-5", "mt-0.5", "mb-1", "space-y-0.5", "animate-accordion-open"], ["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "items-center", "gap-3", "py-2", "pl-4", "text-sm", "hover:text-blue-500", "transition-colors", "text-gray-500", "dark:text-gray-400", 3, "routerLink", "routerLinkActiveOptions"], [3, "item", "depth"], [1, "fas", "fa-arrow-right", "text-[10px]", "opacity-40"], ["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "items-center", "gap-3", "py-2.5", "text-sm", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLink", "routerLinkActiveOptions"]], template: function NavItemRecursiveComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, NavItemRecursiveComponent_Conditional_0_Template, 9, 12)(1, NavItemRecursiveComponent_Conditional_1_Template, 5, 12, "a", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.item.children && ctx.item.children.length > 0 ? 0 : 1);
    }
  }, dependencies: [_NavItemRecursiveComponent, CommonModule, NgClass, RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavItemRecursiveComponent, [{
    type: Component,
    args: [{
      selector: "app-nav-item-recursive",
      standalone: true,
      imports: [CommonModule, RouterLink, RouterLinkActive, NavItemRecursiveComponent],
      template: `
    @if (item.children && item.children.length > 0) {
      <!-- Accordion Header (toggle) -->
      <button
        (click)="isOpen.set(!isOpen())"
        class="flex items-center justify-between w-full py-2.5 pr-2 outline-none cursor-pointer
               hover:text-blue-500 transition-colors select-none text-left"
        [style.padding-left.px]="depth * 16"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="flex items-center gap-3 flex-1 font-medium text-sm">
          <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                [ngClass]="getThemeBg(item.theme)">
            <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
          </span>
          {{ item.label }}
          @if (item.badge) {
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
              {{ item.badge }}
            </span>
          }
        </span>
        <svg class="w-3.5 h-3.5 opacity-50 shrink-0 transition-transform duration-300 ease-out"
             [class.rotate-180]="isOpen()"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Accordion Body (children) -->
      @if (isOpen()) {
        <div class="border-l border-gray-200 dark:border-white/10 ml-5 mt-0.5 mb-1 space-y-0.5
                    animate-accordion-open">
          @if (item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="text-blue-500 font-bold"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center gap-3 py-2 pl-4 text-sm hover:text-blue-500
                      transition-colors text-gray-500 dark:text-gray-400">
              <i class="fas fa-arrow-right text-[10px] opacity-40"></i>
              {{ getViewAllLabel(item.id, item.label) }}
            </a>
          }
          @for (child of item.children; track child.id) {
            <app-nav-item-recursive [item]="child" [depth]="depth + 1" />
          }
        </div>
      }

    } @else {
      <!-- Leaf item (no children) \u2192 simple link -->
      <a [routerLink]="item.path"
         routerLinkActive="text-blue-500 font-bold"
         [routerLinkActiveOptions]="{exact: true}"
         class="flex items-center gap-3 py-2.5 text-sm hover:text-blue-500 transition-colors font-medium"
         [style.padding-left.px]="depth * 16"
         [attr.target]="item.external ? '_blank' : null">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
              [ngClass]="getThemeBg(item.theme)">
          <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
        </span>
        {{ item.label }}
        @if (item.badge) {
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
            {{ item.badge }}
          </span>
        }
      </a>
    }
  `
    }]
  }], null, { item: [{
    type: Input,
    args: [{ required: true }]
  }], depth: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavItemRecursiveComponent, { className: "NavItemRecursiveComponent", filePath: "src/app/shared/components/nav-item-recursive/nav-item-recursive.component.ts", lineNumber: 90 });
})();

// src/app/shared/components/theme-toggle/theme-toggle.component.ts
function ThemeToggleComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 1);
    \u0275\u0275domElement(1, "path", 2);
    \u0275\u0275domElementEnd();
  }
}
function ThemeToggleComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 1);
    \u0275\u0275domElement(1, "path", 3);
    \u0275\u0275domElementEnd();
  }
}
function ThemeToggleComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 1);
    \u0275\u0275domElement(1, "path", 4);
    \u0275\u0275domElementEnd();
  }
}
var ThemeToggleComponent = class _ThemeToggleComponent {
  theme = inject(ThemeService);
  modeLabel() {
    const labels = {
      light: "Modo claro",
      dark: "Modo oscuro",
      system: "Autom\xE1tico (sistema)"
    };
    return labels[this.theme.mode()] ?? "";
  }
  static \u0275fac = function ThemeToggleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeToggleComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ThemeToggleComponent, selectors: [["app-theme-toggle"]], decls: 4, vars: 5, consts: [[1, "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-600", "dark:text-gray-300", "transition-all", "duration-300", "relative", "overflow-hidden", 3, "click", "title"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2", 1, "w-[18px]", "h-[18px]", "animate-theme-icon"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]], template: function ThemeToggleComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "button", 0);
      \u0275\u0275domListener("click", function ThemeToggleComponent_Template_button_click_0_listener() {
        return ctx.theme.cycle();
      });
      \u0275\u0275conditionalCreate(1, ThemeToggleComponent_Conditional_1_Template, 2, 0, ":svg:svg", 1);
      \u0275\u0275conditionalCreate(2, ThemeToggleComponent_Conditional_2_Template, 2, 0, ":svg:svg", 1);
      \u0275\u0275conditionalCreate(3, ThemeToggleComponent_Conditional_3_Template, 2, 0, ":svg:svg", 1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275domProperty("title", ctx.modeLabel());
      \u0275\u0275attribute("aria-label", "Cambiar tema: " + ctx.theme.mode());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.theme.mode() === "light" ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.theme.mode() === "dark" ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.theme.mode() === "system" ? 3 : -1);
    }
  }, styles: ["\n\n@keyframes _ngcontent-%COMP%_themeIconIn {\n  0% {\n    transform: scale(0) rotate(-180deg);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1) rotate(0);\n    opacity: 1;\n  }\n}\n[_nghost-%COMP%]   .animate-theme-icon[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_themeIconIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;\n}\n/*# sourceMappingURL=theme-toggle.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeToggleComponent, [{
    type: Component,
    args: [{ selector: "app-theme-toggle", standalone: true, template: `
    <button
      (click)="theme.cycle()"
      class="btn btn-circle btn-sm btn-ghost
             hover:bg-black/10 dark:hover:bg-white/10
             text-gray-600 dark:text-gray-300
             transition-all duration-300 relative overflow-hidden"
      [attr.aria-label]="'Cambiar tema: ' + theme.mode()"
      [title]="modeLabel()">
      <!-- Sun Icon (light mode) -->
      @if (theme.mode() === 'light') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }
      <!-- Moon Icon (dark mode) -->
      @if (theme.mode() === 'dark') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
      <!-- Auto Icon (system mode) -->
      @if (theme.mode() === 'system') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    </button>
  `, styles: ["/* angular:styles/component:css;42ff84a5134fbffa9baa5387b3b4c46456106e7a03c765184b1c5d180372e924;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/shared/components/theme-toggle/theme-toggle.component.ts */\n@keyframes themeIconIn {\n  0% {\n    transform: scale(0) rotate(-180deg);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1) rotate(0);\n    opacity: 1;\n  }\n}\n:host .animate-theme-icon {\n  animation: themeIconIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;\n}\n/*# sourceMappingURL=theme-toggle.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ThemeToggleComponent, { className: "ThemeToggleComponent", filePath: "src/app/shared/components/theme-toggle/theme-toggle.component.ts", lineNumber: 61 });
})();

// src/app/public/layout/components/header/public-layout-header.ts
var _c02 = () => ["/"];
var _c1 = () => ({ exact: true });
var _c2 = (a0) => ["/productos/detalle", a0];
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.product.id;
function PublicLayoutHeader_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 3);
    \u0275\u0275element(1, "path", 30);
    \u0275\u0275elementEnd();
  }
}
function PublicLayoutHeader_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 3);
    \u0275\u0275element(1, "path", 31);
    \u0275\u0275elementEnd();
  }
}
function PublicLayoutHeader_For_13_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "div", 44)(2, "span", 45);
    \u0275\u0275element(3, "i", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "p", 47);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 48);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(item_r3.theme).bg);
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r3.icon);
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(item_r3.theme).accent);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.description);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(child_r6.badge);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(child_r6.description);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 59);
    \u0275\u0275element(1, "i", 61);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("routerLink", child_r6.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(3, _c1));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Ver todo ", child_r6.label, " ");
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 60);
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gc_r7 = ctx.$implicit;
    \u0275\u0275property("routerLink", gc_r7.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c1));
    \u0275\u0275advance();
    \u0275\u0275classMap(gc_r7.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", gc_r7.label, " ");
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "details", 49)(1, "summary", 51)(2, "span", 52);
    \u0275\u0275element(3, "i", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 53)(5, "span", 54);
    \u0275\u0275text(6);
    \u0275\u0275conditionalCreate(7, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_7_Template, 2, 1, "span", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_8_Template, 2, 1, "p", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(9, "svg", 57);
    \u0275\u0275element(10, "path", 37);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "div", 58);
    \u0275\u0275conditionalCreate(12, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Conditional_12_Template, 3, 4, "a", 59);
    \u0275\u0275repeaterCreate(13, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_For_14_Template, 3, 6, "a", 60, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(child_r6.icon);
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(child_r6.theme).accent);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", child_r6.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(child_r6.badge ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(child_r6.description ? 8 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(child_r6.path ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(child_r6.children);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(child_r6.badge);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(child_r6.description);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 50)(1, "span", 63);
    \u0275\u0275element(2, "i", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 53)(4, "span", 54);
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Conditional_6_Template, 2, 1, "span", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Conditional_7_Template, 2, 1, "p", 56);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", child_r6.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(8, _c1));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(child_r6.icon);
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(child_r6.theme).accent);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", child_r6.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(child_r6.badge ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(child_r6.description ? 7 : -1);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_0_Template, 15, 7, "details", 49)(1, PublicLayoutHeader_For_13_Conditional_7_For_5_Conditional_1_Template, 8, 9, "a", 50);
  }
  if (rf & 2) {
    const child_r6 = ctx.$implicit;
    \u0275\u0275conditional(child_r6.children && child_r6.children.length > 0 ? 0 : 1);
  }
}
function PublicLayoutHeader_For_13_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "a", 64);
    \u0275\u0275text(2);
    \u0275\u0275element(3, "i", 65);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r3.path);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.getMegaFooterLabel(item_r3.id), " ");
  }
}
function PublicLayoutHeader_For_13_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275listener("mouseenter", function PublicLayoutHeader_For_13_Conditional_7_Template_div_mouseenter_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.keepMegaMenuOpen());
    })("mouseleave", function PublicLayoutHeader_For_13_Conditional_7_Template_div_mouseleave_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.closeMegaMenuDelayed());
    });
    \u0275\u0275elementStart(1, "div", 40);
    \u0275\u0275conditionalCreate(2, PublicLayoutHeader_For_13_Conditional_7_Conditional_2_Template, 9, 6, "div", 41);
    \u0275\u0275elementStart(3, "div", 42);
    \u0275\u0275repeaterCreate(4, PublicLayoutHeader_For_13_Conditional_7_For_5_Template, 2, 1, null, null, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PublicLayoutHeader_For_13_Conditional_7_Conditional_6_Template, 4, 2, "div", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r3.description ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(item_r3.children);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r3.path ? 6 : -1);
  }
}
function PublicLayoutHeader_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 32);
    \u0275\u0275listener("mouseenter", function PublicLayoutHeader_For_13_Template_li_mouseenter_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openMegaMenu(item_r3.id));
    })("mouseleave", function PublicLayoutHeader_For_13_Template_li_mouseleave_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeMegaMenuDelayed());
    });
    \u0275\u0275elementStart(1, "button", 33)(2, "span", 34);
    \u0275\u0275element(3, "i", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(5, "svg", 36);
    \u0275\u0275element(6, "path", 37);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, PublicLayoutHeader_For_13_Conditional_7_Template, 7, 2, "div", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("text-blue-600", ctx_r3.activeMegaMenu() === item_r3.id)("bg-blue-50", ctx_r3.activeMegaMenu() === item_r3.id)("dark:bg-white/5", ctx_r3.activeMegaMenu() === item_r3.id);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(item_r3.theme).bg);
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r3.icon);
    \u0275\u0275property("ngClass", ctx_r3.getThemeStyles(item_r3.theme).accent);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r3.label, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("rotate-180", ctx_r3.activeMegaMenu() === item_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.activeMegaMenu() === item_r3.id && item_r3.children ? 7 : -1);
  }
}
function PublicLayoutHeader_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 66);
    \u0275\u0275element(2, "i", 67);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r8.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c1));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r8.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r8.label, " ");
  }
}
function PublicLayoutHeader_Conditional_25_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 69);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_25_For_3_Template_a_click_1_listener() {
      const product_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.selectProduct(product_r10));
    });
    \u0275\u0275element(2, "img", 70);
    \u0275\u0275elementStart(3, "div", 53)(4, "span", 71);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 72);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const product_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", product_r10.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", product_r10.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r10.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", product_r10.price);
  }
}
function PublicLayoutHeader_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "ul", 68);
    \u0275\u0275repeaterCreate(2, PublicLayoutHeader_Conditional_25_For_3_Template, 8, 4, "li", null, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.filteredProducts());
  }
}
function PublicLayoutHeader_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.cartService.totalItems(), " ");
  }
}
function PublicLayoutHeader_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 73);
    \u0275\u0275element(2, "i", 74);
    \u0275\u0275elementStart(3, "span", 53)(4, "span", 75);
    \u0275\u0275text(5, "Mi Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 76);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(8, "li")(9, "button", 77);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_38_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.logout());
    });
    \u0275\u0275element(10, "i", 78);
    \u0275\u0275text(11, " Cerrar Sesi\xF3n ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "li")(13, "a", 79);
    \u0275\u0275element(14, "i", 80);
    \u0275\u0275text(15, " Admin ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const user_r12 = \u0275\u0275readContextLet(36);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(user_r12 == null ? null : user_r12.email);
  }
}
function PublicLayoutHeader_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 81);
    \u0275\u0275element(2, "i", 82);
    \u0275\u0275text(3, " Iniciar Sesi\xF3n ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "li")(5, "a", 83);
    \u0275\u0275element(6, "i", 84);
    \u0275\u0275text(7, " Registrarse ");
    \u0275\u0275elementEnd()();
  }
}
function PublicLayoutHeader_Conditional_40_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 114);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Conditional_16_For_2_Template_a_click_0_listener() {
      const product_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectProduct(product_r15));
    });
    \u0275\u0275element(1, "img", 115);
    \u0275\u0275elementStart(2, "div", 53)(3, "span", 116);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 117);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", product_r15.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", product_r15.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r15.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", product_r15.price);
  }
}
function PublicLayoutHeader_Conditional_40_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 99);
    \u0275\u0275repeaterCreate(1, PublicLayoutHeader_Conditional_40_Conditional_16_For_2_Template, 7, 4, "a", 113, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.filteredProducts());
  }
}
function PublicLayoutHeader_Conditional_40_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-nav-item-recursive", 101);
  }
  if (rf & 2) {
    const item_r16 = ctx.$implicit;
    \u0275\u0275property("item", item_r16)("depth", 0);
  }
}
function PublicLayoutHeader_Conditional_40_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 118);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Conditional_34_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r3 = \u0275\u0275nextContext(2);
      ctx_r3.logout();
      return \u0275\u0275resetView(ctx_r3.closeMobileMenu());
    });
    \u0275\u0275element(1, "i", 119);
    \u0275\u0275text(2, " Cerrar Sesi\xF3n ");
    \u0275\u0275elementEnd();
  }
}
function PublicLayoutHeader_Conditional_40_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 120);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Conditional_35_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.closeMobileMenu());
    });
    \u0275\u0275element(1, "i", 121);
    \u0275\u0275text(2, " Iniciar Sesi\xF3n ");
    \u0275\u0275elementEnd();
  }
}
function PublicLayoutHeader_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 85);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeMobileMenu());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "aside", 86)(2, "div", 87)(3, "a", 88);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_a_click_3_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeMobileMenu());
    });
    \u0275\u0275element(4, "img", 89)(5, "img", 90);
    \u0275\u0275elementStart(6, "span", 91);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 92);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeMobileMenu());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(9, "svg", 93);
    \u0275\u0275element(10, "path", 31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "div", 94)(12, "div", 95)(13, "input", 96);
    \u0275\u0275twoWayListener("ngModelChange", function PublicLayoutHeader_Conditional_40_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.searchQuery, $event) || (ctx_r3.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function PublicLayoutHeader_Conditional_40_Template_input_input_13_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onSearchInput());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 97);
    \u0275\u0275element(15, "i", 98);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, PublicLayoutHeader_Conditional_40_Conditional_16_Template, 3, 0, "div", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "nav", 100);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_nav_click_17_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onMobileNavClick($event));
    });
    \u0275\u0275repeaterCreate(18, PublicLayoutHeader_Conditional_40_For_19_Template, 1, 2, "app-nav-item-recursive", 101, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 102)(21, "div", 103)(22, "span", 104);
    \u0275\u0275element(23, "i", 105);
    \u0275\u0275text(24, " Tema ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 106)(26, "button", 107);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.themeService.setMode("light"));
    });
    \u0275\u0275element(27, "i", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 107);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.themeService.setMode("dark"));
    });
    \u0275\u0275element(29, "i", 109);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 107);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_40_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.themeService.setMode("system"));
    });
    \u0275\u0275element(31, "i", 110);
    \u0275\u0275elementEnd()()();
    \u0275\u0275declareLet(32);
    \u0275\u0275pipe(33, "async");
    \u0275\u0275conditionalCreate(34, PublicLayoutHeader_Conditional_40_Conditional_34_Template, 3, 0, "button", 111)(35, PublicLayoutHeader_Conditional_40_Conditional_35_Template, 3, 0, "a", 112);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(33, _c02));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.appName);
    \u0275\u0275advance(6);
    \u0275\u0275property("appAutoFocus", ctx_r3.searchService.focusRequested$)("appAutoFocusImmediate", ctx_r3.searchFocusRequested());
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.searchQuery);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r3.showResults() && ctx_r3.filteredProducts().length > 0 ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.navItems());
    \u0275\u0275advance(8);
    \u0275\u0275classProp("bg-white", ctx_r3.themeService.mode() === "light")("dark:bg-white/10", ctx_r3.themeService.mode() === "light")("shadow-sm", ctx_r3.themeService.mode() === "light")("text-yellow-600", ctx_r3.themeService.mode() === "light");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-white", ctx_r3.themeService.mode() === "dark")("dark:bg-white/10", ctx_r3.themeService.mode() === "dark")("shadow-sm", ctx_r3.themeService.mode() === "dark")("text-blue-500", ctx_r3.themeService.mode() === "dark");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-white", ctx_r3.themeService.mode() === "system")("dark:bg-white/10", ctx_r3.themeService.mode() === "system")("shadow-sm", ctx_r3.themeService.mode() === "system")("text-green-500", ctx_r3.themeService.mode() === "system");
    const user_r19 = \u0275\u0275pipeBind1(33, 31, ctx_r3.user$);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(user_r19 ? 34 : 35);
  }
}
function PublicLayoutHeader_Conditional_41_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 132);
    \u0275\u0275element(1, "i", 135);
    \u0275\u0275elementStart(2, "p", 136);
    \u0275\u0275text(3, "Tu carrito est\xE1 vac\xEDo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "a", 137);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Conditional_14_Template_a_click_4_listener() {
      \u0275\u0275restoreView(_r21);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(5, " Ver Productos \u2192 ");
    \u0275\u0275elementEnd()();
  }
}
function PublicLayoutHeader_Conditional_41_Conditional_15_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 138)(1, "div", 139);
    \u0275\u0275element(2, "img", 140);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 53)(4, "a", 141);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Conditional_15_For_2_Template_a_click_4_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 142)(7, "span", 143);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 144);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Conditional_15_For_2_Template_button_click_10_listener() {
      const item_r23 = \u0275\u0275restoreView(_r22).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.cartService.removeFromCart(item_r23.product.id));
    });
    \u0275\u0275text(11, " Eliminar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r23 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", item_r23.product.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", item_r23.product.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(8, _c2, item_r23.product.slug));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r23.product.name, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", \u0275\u0275pipeBind1(9, 6, item_r23.product.price), " \xD7 ", item_r23.quantity, " ");
  }
}
function PublicLayoutHeader_Conditional_41_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 133);
    \u0275\u0275repeaterCreate(1, PublicLayoutHeader_Conditional_41_Conditional_15_For_2_Template, 12, 10, "li", 138, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.cartService.cartItems());
  }
}
function PublicLayoutHeader_Conditional_41_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 134)(1, "div", 145)(2, "span");
    \u0275\u0275text(3, "Subtotal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "a", 146);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Conditional_16_Template_a_click_7_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(8, " Finalizar Compra ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 147);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Conditional_16_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(10, " Continuar Comprando \u2192 ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 1, ctx_r3.cartService.totalPrice()));
  }
}
function PublicLayoutHeader_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 122);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 123)(3, "div", 124)(4, "div", 125)(5, "div", 126)(6, "div", 127)(7, "div", 128)(8, "h2", 129);
    \u0275\u0275text(9, "Carrito");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 130);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_41_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(11, "svg", 3);
    \u0275\u0275element(12, "path", 31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(13, "div", 131);
    \u0275\u0275conditionalCreate(14, PublicLayoutHeader_Conditional_41_Conditional_14_Template, 6, 0, "div", 132)(15, PublicLayoutHeader_Conditional_41_Conditional_15_Template, 3, 0, "ul", 133);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, PublicLayoutHeader_Conditional_41_Conditional_16_Template, 11, 3, "div", 134);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275conditional(ctx_r3.cartService.cartItems().length === 0 ? 14 : 15);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.cartService.cartItems().length > 0 ? 16 : -1);
  }
}
var PublicLayoutHeader = class _PublicLayoutHeader {
  // ── Dependencies ──────────────────────────────────
  appName = environment.appName;
  authService = inject(AuthService);
  cartService = inject(CartService);
  themeService = inject(ThemeService);
  searchService = inject(SearchService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  user$ = this.authService.authState$.pipe(map((state) => state.user));
  /** Flag: the drawer was opened specifically for search (triggers immediate focus). */
  searchFocusRequested = signal(false, ...ngDevMode ? [{ debugName: "searchFocusRequested" }] : []);
  subscriptions = new Subscription();
  // ── Navigation Data ───────────────────────────────
  /**
   * Static navigation items from the centralized data file.
   * The menu is fully data-driven: add items to navigation.data.ts
   * and they automatically appear in both desktop and mobile menus.
   */
  navItems = signal(NAVIGATION_ITEMS, ...ngDevMode ? [{ debugName: "navItems" }] : []);
  /** Top-level items that have children → rendered as mega-menus or dropdowns */
  megaMenuItems = computed(() => this.navItems().filter((item) => item.children && item.children.length > 0), ...ngDevMode ? [{ debugName: "megaMenuItems" }] : []);
  /** Top-level items without children → rendered as simple links */
  directLinks = computed(() => this.navItems().filter((item) => !item.children || item.children.length === 0), ...ngDevMode ? [{ debugName: "directLinks" }] : []);
  // ── Search Logic ──────────────────────────────────
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  showResults = signal(false, ...ngDevMode ? [{ debugName: "showResults" }] : []);
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query)
      return [];
    return this.products().filter((p) => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query)).slice(0, 10);
  }, ...ngDevMode ? [{ debugName: "filteredProducts" }] : []);
  // ── Mobile Menu ───────────────────────────────────
  isMobileMenuOpen = signal(false, ...ngDevMode ? [{ debugName: "isMobileMenuOpen" }] : []);
  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
    if (!this.isMobileMenuOpen()) {
      this.searchFocusRequested.set(false);
    }
  }
  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    this.searchFocusRequested.set(false);
  }
  /**
   * Opens the mobile drawer and requests focus on the search input.
   * Triggered by the navbar lupa icon.
   */
  openMobileSearch() {
    this.searchFocusRequested.set(true);
    this.isMobileMenuOpen.set(true);
    this.searchService.requestSearchFocus();
  }
  /** Close mobile drawer when a nav link (not accordion toggle) is clicked */
  onMobileNavClick(event) {
    const target = event.target;
    const anchor = target.closest("a[routerLink], a[ng-reflect-router-link]");
    if (anchor) {
      this.closeMobileMenu();
    }
  }
  // ── Desktop Mega Menu ─────────────────────────────
  activeMegaMenu = signal(null, ...ngDevMode ? [{ debugName: "activeMegaMenu" }] : []);
  megaMenuTimeout = null;
  openMegaMenu(id) {
    if (this.megaMenuTimeout)
      clearTimeout(this.megaMenuTimeout);
    this.activeMegaMenu.set(id);
  }
  closeMegaMenuDelayed() {
    this.megaMenuTimeout = setTimeout(() => {
      this.activeMegaMenu.set(null);
    }, 200);
  }
  keepMegaMenuOpen() {
    if (this.megaMenuTimeout)
      clearTimeout(this.megaMenuTimeout);
  }
  // ── Cart ──────────────────────────────────────────
  isCartOpen = this.cartService.isCartOpen;
  toggleCart() {
    this.cartService.toggleCart();
  }
  // ── Navbar Visibility (auto-hide on scroll) ───────
  isVisible = signal(true, ...ngDevMode ? [{ debugName: "isVisible" }] : []);
  lastScrollTop = 0;
  constructor() {
    this.loadProducts();
    effect(() => {
      const items = this.cartService.cartItems();
      if (items.length > 0) {
        this.showNavbar();
        this.lastScrollTop = isPlatformBrowser(this.platformId) ? window.scrollY || document.documentElement.scrollTop : 0;
      }
    });
  }
  ngOnInit() {
    this.subscriptions.add(this.searchService.focusRequested$.subscribe(() => {
      if (!this.isMobileMenuOpen()) {
        this.searchFocusRequested.set(true);
        this.isMobileMenuOpen.set(true);
        this.cdr.markForCheck();
      }
    }));
    this.subscriptions.add(this.searchService.debouncedQuery$.subscribe((term) => {
      this.searchQuery.set(term);
      this.showResults.set(!!term);
      this.cdr.markForCheck();
    }));
  }
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId))
      return;
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll < 50) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
      return;
    }
    const scrollDelta = currentScroll - this.lastScrollTop;
    if (scrollDelta > 0 && Math.abs(scrollDelta) > 10) {
      this.hideNavbar();
      this.lastScrollTop = currentScroll;
    } else if (scrollDelta < 0) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
    }
  }
  showNavbar() {
    if (!this.isVisible()) {
      this.isVisible.set(true);
      this.cdr.markForCheck();
    }
  }
  hideNavbar() {
    if (this.isVisible()) {
      this.isVisible.set(false);
      this.cdr.markForCheck();
    }
  }
  ngOnDestroy() {
    if (this.megaMenuTimeout)
      clearTimeout(this.megaMenuTimeout);
    this.subscriptions.unsubscribe();
  }
  // ── Search ────────────────────────────────────────
  async loadProducts() {
    if (!isPlatformBrowser(this.platformId))
      return;
    try {
      const supabase = this.authService.getSupabaseClient();
      const { data } = await supabase.from("products").select("*").eq("is_active", true).gt("stock", 0).order("name");
      if (data)
        this.products.set(data);
    } catch {
    }
  }
  onSearchInput() {
    this.searchService.updateQuery(this.searchQuery());
    this.showResults.set(!!this.searchQuery());
  }
  selectProduct(product) {
    this.searchQuery.set("");
    this.showResults.set(false);
    this.closeMobileMenu();
    this.router.navigate(["/productos/detalle", product.slug || product.id]);
  }
  // ── Auth ──────────────────────────────────────────
  async logout() {
    try {
      await this.authService.signOut();
      this.cdr.markForCheck();
      this.router.navigate(["/login"]);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }
  // ── Theme Helpers (for template) ──────────────────
  getThemeStyles(theme) {
    return THEME_STYLES[theme] ?? THEME_STYLES["general"];
  }
  /** Context-aware label for the mega menu footer link */
  getMegaFooterLabel(itemId) {
    return VIEW_ALL_LABELS[itemId] ?? "Ver m\xE1s";
  }
  static \u0275fac = function PublicLayoutHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicLayoutHeader)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicLayoutHeader, selectors: [["public-layout-header"]], hostBindings: function PublicLayoutHeader_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("scroll", function PublicLayoutHeader_scroll_HostBindingHandler() {
        return ctx.onWindowScroll();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 42, vars: 16, consts: [["role", "navigation", "aria-label", "Navegaci\xF3n principal", 1, "fixed", "top-0", "inset-x-0", "z-1000", "glass-panel", "border-b", "border-gray-200", "dark:border-white/5", "backdrop-blur-xl", "text-gray-900", "dark:text-white", "transition-transform", "duration-300", "ease-in-out", "h-16", "flex", "items-center", "px-4", "lg:px-6", "will-change-transform"], [1, "flex", "items-center", "gap-2", "shrink-0"], ["aria-label", "Abrir men\xFA", 1, "xl:hidden", "btn", "btn-ghost", "btn-sm", "btn-square", "text-gray-700", "dark:text-gray-200", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", 3, "click"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2", 1, "w-5", "h-5"], [1, "flex", "shrink-0", "items-center", "gap-2", "rounded-xl", "hover:bg-black/5", "dark:hover:bg-white/5", "transition-all", "duration-200", "group", "py-1", "px-1.5", 3, "routerLink"], ["src", "/assets/img/brands/logo/Logo (2).png", "alt", "Arecofix Logo", "height", "32", "width", "100", 1, "h-8", "w-auto", "object-contain", "hidden", "dark:block", "drop-shadow-lg"], ["src", "/assets/img/brands/logo/logo-normal1.PNG", "alt", "Arecofix Logo", "height", "32", "width", "100", 1, "h-8", "w-auto", "object-contain", "dark:hidden", "drop-shadow-md"], [1, "font-bold", "text-base", "xl:text-lg", "text-gray-900", "dark:text-white", "font-heading", "tracking-wide", "group-hover:text-blue-600", "dark:group-hover:text-blue-400", "transition-colors", "hidden", "sm:inline", "truncate", "max-w-[120px]", "xl:max-w-none"], [1, "hidden", "xl:flex", "flex-1", "justify-center"], [1, "flex", "items-center", "gap-0.5"], [1, "relative"], [1, "flex", "items-center", "gap-1", "lg:gap-1.5", "shrink-0", "ml-auto"], ["aria-label", "Buscar", 1, "xl:hidden", "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-700", "dark:text-white", "transition-all", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"], [1, "hidden", "xl:flex", "items-center", "relative", "group"], [1, "join", "transition-all", "duration-300", "focus-within:ring-2", "focus-within:ring-blue-500/40", "rounded-full"], ["type", "text", "placeholder", "Buscar...", 1, "input", "input-sm", "input-bordered", "rounded-l-full", "bg-gray-100", "dark:bg-white/10", "text-gray-900", "dark:text-white", "border-transparent", "focus:border-transparent", "w-28", "2xl:w-48", "focus:w-48", "2xl:focus:w-64", "transition-all", "duration-300", "placeholder-gray-500", "text-sm", 3, "ngModelChange", "input", "ngModel"], ["aria-label", "Buscar", 1, "btn", "btn-sm", "btn-primary", "rounded-r-full", "border-none", "text-white", "px-3"], [1, "fas", "fa-search"], [1, "absolute", "top-full", "right-0", "w-80", "mt-2", "bg-white", "dark:bg-[#1a1c2e]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "shadow-2xl", "z-50", "overflow-hidden", "animate-fade-in-up", "max-h-80", "overflow-y-auto"], [1, "hidden", "xl:block"], ["aria-label", "Carrito", 1, "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-700", "dark:text-white", "transition-all", 3, "click"], [1, "indicator"], [1, "fas", "fa-shopping-cart", "text-base"], [1, "badge", "badge-xs", "indicator-item", "bg-red-500", "text-white", "border-none", "font-bold", "text-[10px]", "min-w-4", "h-4"], [1, "dropdown", "dropdown-end"], ["tabindex", "0", "role", "button", "aria-label", "Men\xFA de usuario", 1, "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-700", "dark:text-white"], [1, "fas", "fa-user", "text-base"], ["tabindex", "0", 1, "menu", "menu-sm", "dropdown-content", "mt-3", "z-50", "p-2", "shadow-2xl", "bg-white", "dark:bg-[#1a1c2e]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "w-56", "text-gray-700", "dark:text-gray-200"], ["role", "dialog", "aria-modal", "true", "aria-label", "Carrito de compras", 1, "z-10000"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M4 6h16M4 12h8m-8 6h16"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M6 18L18 6M6 6l12 12"], [1, "relative", 3, "mouseenter", "mouseleave"], [1, "flex", "items-center", "gap-2", "px-3", "h-10", "rounded-xl", "font-medium", "text-sm", "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "duration-200", "whitespace-nowrap", "group/trig"], [1, "w-5", "h-5", "rounded-md", "flex", "items-center", "justify-center", "text-[10px]", 3, "ngClass"], [3, "ngClass"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2", 1, "w-3", "h-3", "opacity-40", "transition-transform", "duration-200"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M19 9l-7 7-7-7"], [1, "absolute", "top-full", "left-1/2", "-translate-x-1/2", "pt-2", "z-50", "animate-fade-in-up"], [1, "absolute", "top-full", "left-1/2", "-translate-x-1/2", "pt-2", "z-50", "animate-fade-in-up", 3, "mouseenter", "mouseleave"], [1, "bg-white", "dark:bg-[#1a1c2e]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "shadow-2xl", "dark:shadow-black/40", "overflow-hidden", "min-w-[340px]", "max-w-[420px]", "w-max"], [1, "px-4", "py-2.5", "border-b", "border-gray-100", "dark:border-white/5", "bg-gray-50/50", "dark:bg-white/2"], [1, "p-2", "max-h-[70vh]", "overflow-y-auto"], [1, "px-3", "py-2", "border-t", "border-gray-100", "dark:border-white/5"], [1, "flex", "items-center", "gap-2.5"], [1, "w-7", "h-7", "rounded-lg", "flex", "items-center", "justify-center", 3, "ngClass"], [1, "text-xs", 3, "ngClass"], [1, "font-bold", "text-sm", "text-gray-900", "dark:text-white"], [1, "text-[11px]", "text-gray-500", "dark:text-gray-400"], [1, "group/sub", "rounded-xl"], ["routerLinkActive", "bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 font-bold", 1, "flex", "items-center", "gap-3", "px-3", "py-2.5", "rounded-xl", "hover:bg-gray-50", "dark:hover:bg-white/5", "text-gray-700", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "transition-all", "duration-150", "group/child", 3, "routerLink", "routerLinkActiveOptions"], [1, "flex", "items-center", "gap-3", "px-3", "py-2.5", "rounded-xl", "cursor-pointer", "list-none", "[&::-webkit-details-marker]:hidden", "hover:bg-gray-50", "dark:hover:bg-white/5", "text-gray-700", "dark:text-gray-300", "transition-all", "duration-150", "select-none"], [1, "w-7", "h-7", "rounded-lg", "flex", "items-center", "justify-center", "text-xs", "shrink-0", "bg-gray-100", "dark:bg-white/5"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-medium", "flex", "items-center", "gap-1.5"], [1, "text-[9px]", "font-bold", "px-1.5", "py-0.5", "rounded-full", "bg-red-500/10", "text-red-400", "uppercase"], [1, "text-[11px]", "text-gray-400", "dark:text-gray-500", "truncate", "mt-0.5"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2", 1, "w-3.5", "h-3.5", "text-gray-400", "shrink-0", "transition-transform", "duration-200", "group-open/sub:rotate-180"], [1, "ml-10", "mr-2", "mb-2", "mt-1", "pl-3", "border-l-2", "border-gray-100", "dark:border-white/5", "flex", "flex-col", "gap-0.5"], ["routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold", 1, "text-xs", "px-2.5", "py-1.5", "rounded-lg", "text-blue-600", "dark:text-blue-400", "font-medium", "hover:bg-blue-50", "dark:hover:bg-blue-500/10", "transition-all", "inline-flex", "items-center", "gap-1.5", 3, "routerLink", "routerLinkActiveOptions"], ["routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10", 1, "flex", "items-center", "gap-2", "px-2.5", "py-1.5", "rounded-lg", "text-xs", "text-gray-600", "dark:text-gray-400", "hover:bg-gray-50", "dark:hover:bg-white/5", "hover:text-blue-600", "dark:hover:text-white", "transition-all", 3, "routerLink", "routerLinkActiveOptions"], [1, "fas", "fa-arrow-right", "text-[9px]"], [1, "text-[10px]", "w-3.5", "text-center", "opacity-60"], [1, "w-7", "h-7", "rounded-lg", "flex", "items-center", "justify-center", "text-xs", "shrink-0", "bg-gray-100", "dark:bg-white/5", "group-hover/child:bg-blue-100", "dark:group-hover/child:bg-blue-500/10", "transition-colors"], [1, "flex", "items-center", "justify-center", "gap-2", "py-1.5", "rounded-xl", "text-xs", "font-medium", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-500/10", "transition-all", 3, "routerLink"], [1, "fas", "fa-arrow-right", "text-[10px]"], ["routerLinkActive", "text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold", 1, "flex", "items-center", "gap-2", "px-3", "h-10", "rounded-xl", "font-medium", "text-sm", "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "duration-200", "whitespace-nowrap", 3, "routerLink", "routerLinkActiveOptions"], [1, "text-xs", "opacity-60"], [1, "p-1.5"], [1, "flex", "items-center", "gap-3", "p-2", "rounded-xl", "cursor-pointer", "hover:bg-blue-50", "dark:hover:bg-white/5", "transition-colors", 3, "click"], [1, "w-9", "h-9", "object-contain", "rounded-lg", "bg-white", "dark:bg-white/5", "border", "border-gray-100", "dark:border-white/10", 3, "src", "alt"], [1, "font-medium", "text-sm", "text-gray-800", "dark:text-gray-200", "line-clamp-1"], [1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400"], ["routerLink", "/perfil", 1, "rounded-xl", "hover:bg-blue-50", "dark:hover:bg-white/5"], [1, "fas", "fa-user-circle"], [1, "block", "text-sm", "leading-tight"], [1, "block", "text-[11px]", "text-gray-500", "truncate"], [1, "rounded-xl", "hover:bg-red-50", "dark:hover:bg-red-500/10", "text-red-500", 3, "click"], [1, "fas", "fa-sign-out-alt"], ["routerLink", "/admin", 1, "rounded-xl", "hover:bg-blue-50", "dark:hover:bg-white/5"], [1, "fas", "fa-shield-alt"], ["routerLink", "/login", 1, "rounded-xl", "hover:bg-blue-50", "dark:hover:bg-white/5"], [1, "fas", "fa-sign-in-alt"], ["routerLink", "/register", 1, "rounded-xl", "hover:bg-blue-50", "dark:hover:bg-white/5"], [1, "fas", "fa-user-plus"], [1, "fixed", "inset-0", "bg-black/50", "backdrop-blur-sm", "z-9998", "xl:hidden", "animate-fade-in", 3, "click"], [1, "fixed", "top-0", "left-0", "bottom-0", "w-72", "max-w-[85vw]", "z-9999", "xl:hidden", "bg-white", "dark:bg-[#12141f]", "shadow-2xl", "flex", "flex-col", "overflow-hidden", "animate-slide-in-left"], [1, "flex", "items-center", "justify-between", "px-4", "py-3", "border-b", "border-gray-100", "dark:border-white/5", "shrink-0"], [1, "flex", "items-center", "gap-2", 3, "click", "routerLink"], ["src", "/assets/img/brands/logo/Logo (2).png", "alt", "Logo", "height", "24", "width", "80", 1, "h-6", "w-auto", "hidden", "dark:block"], ["src", "/assets/img/brands/logo/logo-normal1.PNG", "alt", "Logo", "height", "24", "width", "80", 1, "h-6", "w-auto", "dark:hidden"], [1, "font-bold", "text-sm", "text-gray-900", "dark:text-white", "font-heading"], [1, "btn", "btn-circle", "btn-xs", "btn-ghost", "text-gray-400", "hover:text-gray-700", "dark:hover:text-white", 3, "click"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", "stroke-width", "2", 1, "w-4", "h-4"], [1, "px-3", "py-2", "border-b", "border-gray-100", "dark:border-white/5", "shrink-0"], [1, "join", "w-full"], ["type", "text", "placeholder", "Buscar productos...", 1, "input", "input-sm", "input-bordered", "w-full", "bg-gray-50", "dark:bg-white/5", "border-gray-200", "dark:border-white/10", "text-gray-900", "dark:text-white", "join-item", "rounded-l-lg", "text-sm", "placeholder-gray-400", 3, "ngModelChange", "input", "appAutoFocus", "appAutoFocusImmediate", "ngModel"], [1, "btn", "btn-sm", "btn-primary", "join-item", "rounded-r-lg", "border-none", "px-3"], [1, "fas", "fa-search", "text-xs"], [1, "mt-1.5", "bg-gray-50", "dark:bg-white/5", "border", "border-gray-200", "dark:border-white/10", "rounded-xl", "overflow-hidden", "max-h-40", "overflow-y-auto"], [1, "flex-1", "overflow-y-auto", "px-2", "py-2", "space-y-0.5", 3, "click"], [3, "item", "depth"], [1, "px-3", "py-2.5", "border-t", "border-gray-100", "dark:border-white/5", "shrink-0", "space-y-2"], [1, "flex", "items-center", "justify-between", "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "flex", "items-center", "gap-1.5"], [1, "fas", "fa-palette", "text-[10px]"], [1, "flex", "items-center", "gap-0.5", "bg-gray-100", "dark:bg-white/5", "rounded-lg", "p-0.5"], [1, "px-2", "py-1", "rounded-md", "text-[11px]", "font-medium", "transition-all", 3, "click"], [1, "fas", "fa-sun"], [1, "fas", "fa-moon"], [1, "fas", "fa-desktop"], [1, "btn", "btn-xs", "btn-ghost", "w-full", "justify-start", "gap-2", "rounded-lg", "text-red-500", "hover:bg-red-50", "dark:hover:bg-red-500/10", "font-medium"], ["routerLink", "/login", 1, "btn", "btn-xs", "btn-primary", "w-full", "rounded-lg", "gap-2", "font-medium"], [1, "flex", "items-center", "gap-2", "p-2", "hover:bg-blue-50", "dark:hover:bg-white/5", "transition-colors", "cursor-pointer", "border-b", "border-gray-100", "dark:border-white/5", "last:border-none"], [1, "flex", "items-center", "gap-2", "p-2", "hover:bg-blue-50", "dark:hover:bg-white/5", "transition-colors", "cursor-pointer", "border-b", "border-gray-100", "dark:border-white/5", "last:border-none", 3, "click"], [1, "w-7", "h-7", "object-contain", "rounded", "bg-white", "border", 3, "src", "alt"], [1, "text-xs", "font-medium", "text-gray-800", "dark:text-gray-200", "line-clamp-1"], [1, "text-[11px]", "text-blue-600", "dark:text-blue-400", "font-bold"], [1, "btn", "btn-xs", "btn-ghost", "w-full", "justify-start", "gap-2", "rounded-lg", "text-red-500", "hover:bg-red-50", "dark:hover:bg-red-500/10", "font-medium", 3, "click"], [1, "fas", "fa-sign-out-alt", "text-[10px]"], ["routerLink", "/login", 1, "btn", "btn-xs", "btn-primary", "w-full", "rounded-lg", "gap-2", "font-medium", 3, "click"], [1, "fas", "fa-sign-in-alt", "text-[10px]"], [1, "fixed", "inset-0", "bg-black/50", "transition-opacity", 3, "click"], [1, "fixed", "inset-0", "overflow-hidden"], [1, "absolute", "inset-0", "overflow-hidden"], [1, "pointer-events-none", "fixed", "inset-y-0", "right-0", "flex", "max-w-full", "pl-10"], [1, "pointer-events-auto", "w-screen", "max-w-md", "bg-white", "dark:bg-[#12141f]", "shadow-xl", "h-dvh"], [1, "flex", "h-full", "flex-col", "overflow-y-auto"], [1, "flex", "items-center", "justify-between", "px-5", "py-4", "border-b", "border-gray-100", "dark:border-white/5"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white"], [1, "btn", "btn-circle", "btn-sm", "btn-ghost", "text-gray-400", "hover:text-gray-600", "dark:hover:text-gray-200", 3, "click"], [1, "flex-1", "px-5", "py-4"], [1, "text-center", "py-12"], [1, "space-y-4"], [1, "border-t", "border-gray-100", "dark:border-white/5", "px-5", "py-4", "shrink-0"], [1, "fas", "fa-shopping-bag", "text-3xl", "text-gray-300", "dark:text-gray-600", "mb-3"], [1, "text-gray-500", "dark:text-gray-400", "text-sm"], ["routerLink", "/productos", 1, "text-blue-600", "dark:text-blue-400", "font-medium", "hover:underline", "mt-3", "inline-block", "text-sm", 3, "click"], [1, "flex", "gap-3", "pb-4", "border-b", "border-gray-100", "dark:border-white/5", "last:border-none"], [1, "w-16", "h-16", "shrink-0", "rounded-xl", "overflow-hidden", "border", "border-gray-100", "dark:border-white/10"], [1, "w-full", "h-full", "object-cover", 3, "src", "alt"], [1, "text-sm", "font-medium", "text-gray-900", "dark:text-white", "line-clamp-2", "hover:text-blue-600", "transition-colors", 3, "click", "routerLink"], [1, "flex", "items-center", "justify-between", "mt-1.5"], [1, "text-sm", "font-bold", "text-blue-600", "dark:text-blue-400"], [1, "text-xs", "text-red-500", "hover:text-red-400", "font-medium", "transition-colors", 3, "click"], [1, "flex", "justify-between", "text-base", "font-bold", "text-gray-900", "dark:text-white", "mb-3"], ["routerLink", "/checkout", 1, "btn", "btn-primary", "w-full", "rounded-xl", "font-medium", 3, "click"], [1, "btn", "btn-ghost", "btn-sm", "w-full", "mt-2", "text-blue-600", "dark:text-blue-400", "font-medium", 3, "click"]], template: function PublicLayoutHeader_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "button", 2);
      \u0275\u0275listener("click", function PublicLayoutHeader_Template_button_click_2_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleMobileMenu());
      });
      \u0275\u0275conditionalCreate(3, PublicLayoutHeader_Conditional_3_Template, 2, 0, ":svg:svg", 3)(4, PublicLayoutHeader_Conditional_4_Template, 2, 0, ":svg:svg", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 4);
      \u0275\u0275element(6, "img", 5)(7, "img", 6);
      \u0275\u0275elementStart(8, "span", 7);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 8)(11, "ul", 9);
      \u0275\u0275repeaterCreate(12, PublicLayoutHeader_For_13_Template, 8, 14, "li", 10, _forTrack02);
      \u0275\u0275repeaterCreate(14, PublicLayoutHeader_For_15_Template, 4, 6, "li", null, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 11)(17, "button", 12);
      \u0275\u0275listener("click", function PublicLayoutHeader_Template_button_click_17_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.openMobileSearch());
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(18, "svg", 3);
      \u0275\u0275element(19, "path", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "div", 14)(21, "div", 15)(22, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function PublicLayoutHeader_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("input", function PublicLayoutHeader_Template_input_input_22_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSearchInput());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "button", 17);
      \u0275\u0275element(24, "i", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(25, PublicLayoutHeader_Conditional_25_Template, 4, 0, "div", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 20);
      \u0275\u0275element(27, "app-theme-toggle");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "button", 21);
      \u0275\u0275listener("click", function PublicLayoutHeader_Template_button_click_28_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleCart());
      });
      \u0275\u0275elementStart(29, "div", 22);
      \u0275\u0275element(30, "i", 23);
      \u0275\u0275conditionalCreate(31, PublicLayoutHeader_Conditional_31_Template, 2, 1, "span", 24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 25)(33, "div", 26);
      \u0275\u0275element(34, "i", 27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "ul", 28);
      \u0275\u0275declareLet(36);
      \u0275\u0275pipe(37, "async");
      \u0275\u0275conditionalCreate(38, PublicLayoutHeader_Conditional_38_Template, 16, 1)(39, PublicLayoutHeader_Conditional_39_Template, 8, 0);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(40, PublicLayoutHeader_Conditional_40_Template, 36, 34);
      \u0275\u0275conditionalCreate(41, PublicLayoutHeader_Conditional_41_Template, 17, 2, "div", 29);
    }
    if (rf & 2) {
      \u0275\u0275classProp("-translate-y-full", !ctx.isVisible());
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-expanded", ctx.isMobileMenuOpen());
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isMobileMenuOpen() ? 3 : 4);
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(15, _c02));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.appName, " ");
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.megaMenuItems());
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.directLinks());
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showResults() && ctx.filteredProducts().length > 0 ? 25 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.cartService.totalItems() > 0 ? 31 : -1);
      \u0275\u0275advance(5);
      const user_r25 = \u0275\u0275storeLet(\u0275\u0275pipeBind1(37, 12, ctx.user$));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(user_r25 ? 38 : 39);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isMobileMenuOpen() ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isCartOpen() ? 41 : -1);
    }
  }, dependencies: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    NgClass,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    NavItemRecursiveComponent,
    ThemeToggleComponent,
    AutoFocusDirective,
    AsyncPipe,
    CurrencyPipe
  ], styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=public-layout-header.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicLayoutHeader, [{
    type: Component,
    args: [{ selector: "public-layout-header", imports: [
      RouterLink,
      RouterLinkActive,
      CommonModule,
      FormsModule,
      NavItemRecursiveComponent,
      ThemeToggleComponent,
      AutoFocusDirective
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\r
     ARECOFIX \u2014 Public Layout Header\r
     Data-driven navigation:\r
       Desktop \u2192 Mega menu with expandable grandchildren\r
       Mobile  \u2192 Full-screen drawer with recursive accordion\r
       Theme   \u2192 Light / Dark / System toggle\r
     \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
\r
<nav class="fixed top-0 inset-x-0 z-1000\r
            glass-panel border-b border-gray-200 dark:border-white/5\r
            backdrop-blur-xl text-gray-900 dark:text-white transition-transform duration-300 ease-in-out\r
            h-16 flex items-center px-4 lg:px-6 will-change-transform"\r
     [class.-translate-y-full]="!isVisible()"\r
     role="navigation"\r
     aria-label="Navegaci\xF3n principal">\r
\r
  <!-- \u2500\u2500\u2500 LEFT: Hamburger + Logo \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
  <div class="flex items-center gap-2 shrink-0">\r
\r
    <!-- Hamburger (Mobile only) -->\r
    <button (click)="toggleMobileMenu()"\r
            class="xl:hidden btn btn-ghost btn-sm btn-square text-gray-700 dark:text-gray-200\r
                   hover:bg-black/5 dark:hover:bg-white/10 transition-all"\r
            [attr.aria-expanded]="isMobileMenuOpen()"\r
            aria-label="Abrir men\xFA">\r
      @if (!isMobileMenuOpen()) {\r
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h8m-8 6h16" />\r
        </svg>\r
      } @else {\r
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\r
        </svg>\r
      }\r
    </button>\r
\r
    <!-- Logo -->\r
    <a class="flex shrink-0 items-center gap-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5\r
              transition-all duration-200 group py-1 px-1.5"\r
       [routerLink]="['/']">\r
      <img src="/assets/img/brands/logo/Logo (2).png" alt="Arecofix Logo"\r
           class="h-8 w-auto object-contain hidden dark:block drop-shadow-lg" height="32" width="100" />\r
      <img src="/assets/img/brands/logo/logo-normal1.PNG" alt="Arecofix Logo"\r
           class="h-8 w-auto object-contain dark:hidden drop-shadow-md" height="32" width="100" />\r
      <span class="font-bold text-base xl:text-lg text-gray-900 dark:text-white font-heading\r
                   tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400\r
                   transition-colors hidden sm:inline truncate max-w-[120px] xl:max-w-none">\r
        {{ appName }}\r
      </span>\r
    </a>\r
  </div>\r
\r
  <!-- \u2500\u2500\u2500 CENTER: Desktop Navigation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
  <div class="hidden xl:flex flex-1 justify-center">\r
    <ul class="flex items-center gap-0.5">\r
\r
      @for (item of megaMenuItems(); track item.id) {\r
        <li class="relative"\r
            (mouseenter)="openMegaMenu(item.id)"\r
            (mouseleave)="closeMegaMenuDelayed()">\r
\r
          <!-- Trigger Button -->\r
          <button class="flex items-center gap-2 px-3 h-10 rounded-xl font-medium text-sm\r
                         text-gray-600 dark:text-gray-300\r
                         hover:text-blue-600 dark:hover:text-white\r
                         hover:bg-black/5 dark:hover:bg-white/10\r
                         transition-all duration-200 whitespace-nowrap group/trig"\r
                  [class.text-blue-600]="activeMegaMenu() === item.id"\r
                  [class.bg-blue-50]="activeMegaMenu() === item.id"\r
                  [class.dark:bg-white/5]="activeMegaMenu() === item.id">\r
            <span class="w-5 h-5 rounded-md flex items-center justify-center text-[10px]"\r
                  [ngClass]="getThemeStyles(item.theme).bg">\r
              <i [class]="item.icon" [ngClass]="getThemeStyles(item.theme).accent"></i>\r
            </span>\r
            {{ item.label }}\r
            <svg class="w-3 h-3 opacity-40 transition-transform duration-200"\r
                 [class.rotate-180]="activeMegaMenu() === item.id"\r
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />\r
            </svg>\r
          </button>\r
\r
          <!-- \u2500\u2500 Mega Menu Dropdown \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
          @if (activeMegaMenu() === item.id && item.children) {\r
            <div class="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-fade-in-up"\r
                 (mouseenter)="keepMegaMenuOpen()"\r
                 (mouseleave)="closeMegaMenuDelayed()">\r
              <div class="bg-white dark:bg-[#1a1c2e] border border-gray-100 dark:border-white/10\r
                          rounded-2xl shadow-2xl dark:shadow-black/40 overflow-hidden\r
                          min-w-[340px] max-w-[420px] w-max">\r
\r
                <!-- Mega Header -->\r
                @if (item.description) {\r
                  <div class="px-4 py-2.5 border-b border-gray-100 dark:border-white/5\r
                              bg-gray-50/50 dark:bg-white/2">\r
                    <div class="flex items-center gap-2.5">\r
                      <span class="w-7 h-7 rounded-lg flex items-center justify-center"\r
                            [ngClass]="getThemeStyles(item.theme).bg">\r
                        <i [class]="item.icon" class="text-xs" [ngClass]="getThemeStyles(item.theme).accent"></i>\r
                      </span>\r
                      <div>\r
                        <p class="font-bold text-sm text-gray-900 dark:text-white">{{ item.label }}</p>\r
                        <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ item.description }}</p>\r
                      </div>\r
                    </div>\r
                  </div>\r
                }\r
\r
                <!-- Children List -->\r
                <div class="p-2 max-h-[70vh] overflow-y-auto">\r
                  @for (child of item.children; track child.id) {\r
                    <!-- \u2726 Child WITH grandchildren \u2192 expandable section -->\r
                    @if (child.children && child.children.length > 0) {\r
                      <details class="group/sub rounded-xl">\r
                        <summary class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer\r
                                        list-none [&::-webkit-details-marker]:hidden\r
                                        hover:bg-gray-50 dark:hover:bg-white/5\r
                                        text-gray-700 dark:text-gray-300\r
                                        transition-all duration-150 select-none">\r
                          <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0\r
                                       bg-gray-100 dark:bg-white/5">\r
                            <i [class]="child.icon" [ngClass]="getThemeStyles(child.theme).accent"></i>\r
                          </span>\r
                          <div class="flex-1 min-w-0">\r
                            <span class="text-sm font-medium flex items-center gap-1.5">\r
                              {{ child.label }}\r
                              @if (child.badge) {\r
                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full\r
                                             bg-red-500/10 text-red-400 uppercase">{{ child.badge }}</span>\r
                              }\r
                            </span>\r
                            @if (child.description) {\r
                              <p class="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{{ child.description }}</p>\r
                            }\r
                          </div>\r
                          <svg class="w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200\r
                                      group-open/sub:rotate-180"\r
                               fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />\r
                          </svg>\r
                        </summary>\r
\r
                        <!-- Grandchildren (3rd level) -->\r
                        <div class="ml-10 mr-2 mb-2 mt-1 pl-3 border-l-2 border-gray-100 dark:border-white/5\r
                                    flex flex-col gap-0.5">\r
                          <!-- "Ver todo" link for the parent category -->\r
                          @if (child.path) {\r
                            <a [routerLink]="child.path"\r
                               routerLinkActive="text-blue-600 dark:text-blue-400 font-bold"\r
                               [routerLinkActiveOptions]="{exact: true}"\r
                               class="text-xs px-2.5 py-1.5 rounded-lg\r
                                      text-blue-600 dark:text-blue-400 font-medium\r
                                      hover:bg-blue-50 dark:hover:bg-blue-500/10\r
                                      transition-all inline-flex items-center gap-1.5">\r
                              <i class="fas fa-arrow-right text-[9px]"></i> Ver todo {{ child.label }}\r
                            </a>\r
                          }\r
                          @for (gc of child.children; track gc.id) {\r
                            <a [routerLink]="gc.path"\r
                               routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10"\r
                               [routerLinkActiveOptions]="{exact: true}"\r
                               class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs\r
                                      text-gray-600 dark:text-gray-400\r
                                      hover:bg-gray-50 dark:hover:bg-white/5\r
                                      hover:text-blue-600 dark:hover:text-white\r
                                      transition-all">\r
                              <i [class]="gc.icon" class="text-[10px] w-3.5 text-center opacity-60"></i>\r
                              {{ gc.label }}\r
                            </a>\r
                          }\r
                        </div>\r
                      </details>\r
\r
                    } @else {\r
                      <!-- \u2726 Child WITHOUT grandchildren \u2192 simple link -->\r
                      <a [routerLink]="child.path"\r
                         routerLinkActive="bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 font-bold"\r
                         [routerLinkActiveOptions]="{exact: true}"\r
                         class="flex items-center gap-3 px-3 py-2.5 rounded-xl\r
                                hover:bg-gray-50 dark:hover:bg-white/5\r
                                text-gray-700 dark:text-gray-300\r
                                hover:text-blue-600 dark:hover:text-white\r
                                transition-all duration-150 group/child">\r
                        <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0\r
                                     bg-gray-100 dark:bg-white/5\r
                                     group-hover/child:bg-blue-100 dark:group-hover/child:bg-blue-500/10\r
                                     transition-colors">\r
                          <i [class]="child.icon" [ngClass]="getThemeStyles(child.theme).accent"></i>\r
                        </span>\r
                        <div class="flex-1 min-w-0">\r
                          <span class="text-sm font-medium flex items-center gap-1.5">\r
                            {{ child.label }}\r
                            @if (child.badge) {\r
                              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full\r
                                           bg-red-500/10 text-red-400 uppercase">{{ child.badge }}</span>\r
                            }\r
                          </span>\r
                          @if (child.description) {\r
                            <p class="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{{ child.description }}</p>\r
                          }\r
                        </div>\r
                      </a>\r
                    }\r
                  }\r
                </div>\r
\r
                <!-- Mega Footer -->\r
                @if (item.path) {\r
                  <div class="px-3 py-2 border-t border-gray-100 dark:border-white/5">\r
                    <a [routerLink]="item.path"\r
                       class="flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs\r
                              font-medium text-blue-600 dark:text-blue-400\r
                              hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">\r
                      {{ getMegaFooterLabel(item.id) }} <i class="fas fa-arrow-right text-[10px]"></i>\r
                    </a>\r
                  </div>\r
                }\r
              </div>\r
            </div>\r
          }\r
        </li>\r
      }\r
\r
      <!-- Desktop Direct Links -->\r
      @for (item of directLinks(); track item.id) {\r
        <li>\r
          <a [routerLink]="item.path"\r
             routerLinkActive="text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold"\r
             [routerLinkActiveOptions]="{exact: true}"\r
             class="flex items-center gap-2 px-3 h-10 rounded-xl font-medium text-sm\r
                    text-gray-600 dark:text-gray-300\r
                    hover:text-blue-600 dark:hover:text-white\r
                    hover:bg-black/5 dark:hover:bg-white/10\r
                    transition-all duration-200 whitespace-nowrap">\r
            <i [class]="item.icon" class="text-xs opacity-60"></i>\r
            {{ item.label }}\r
          </a>\r
        </li>\r
      }\r
    </ul>\r
  </div>\r
\r
  <!-- \u2500\u2500\u2500 RIGHT: Search, Theme, Cart, User \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\r
  <div class="flex items-center gap-1 lg:gap-1.5 shrink-0 ml-auto">\r
\r
    <!-- Mobile Search Icon (lupa) \u2014 visible on mobile only -->\r
    <button (click)="openMobileSearch()"\r
            class="xl:hidden btn btn-circle btn-sm btn-ghost\r
                   hover:bg-black/10 dark:hover:bg-white/10\r
                   text-gray-700 dark:text-white transition-all"\r
            aria-label="Buscar">\r
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
        <path stroke-linecap="round" stroke-linejoin="round"\r
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />\r
      </svg>\r
    </button>\r
\r
    <!-- Desktop Search -->\r
    <div class="hidden xl:flex items-center relative group">\r
      <div class="join transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/40 rounded-full">\r
        <input type="text" placeholder="Buscar..."\r
               [(ngModel)]="searchQuery" (input)="onSearchInput()"\r
               class="input input-sm input-bordered rounded-l-full\r
                      bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white\r
                      border-transparent focus:border-transparent\r
                      w-28 2xl:w-48 focus:w-48 2xl:focus:w-64\r
                      transition-all duration-300 placeholder-gray-500 text-sm" />\r
        <button class="btn btn-sm btn-primary rounded-r-full border-none text-white px-3"\r
                aria-label="Buscar">\r
          <i class="fas fa-search"></i>\r
        </button>\r
      </div>\r
\r
      <!-- Search Results Dropdown -->\r
      @if (showResults() && filteredProducts().length > 0) {\r
        <div class="absolute top-full right-0 w-80 mt-2 bg-white dark:bg-[#1a1c2e]\r
                    border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-50\r
                    overflow-hidden animate-fade-in-up max-h-80 overflow-y-auto">\r
          <ul class="p-1.5">\r
            @for (product of filteredProducts(); track product.id) {\r
              <li>\r
                <a (click)="selectProduct(product)"\r
                   class="flex items-center gap-3 p-2 rounded-xl cursor-pointer\r
                          hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">\r
                  <img [src]="product.image_url || '/assets/img/no-image.png'" [alt]="product.name"\r
                       class="w-9 h-9 object-contain rounded-lg bg-white dark:bg-white/5\r
                              border border-gray-100 dark:border-white/10" />\r
                  <div class="flex-1 min-w-0">\r
                    <span class="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{{ product.name }}</span>\r
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400">\${{ product.price }}</span>\r
                  </div>\r
                </a>\r
              </li>\r
            }\r
          </ul>\r
        </div>\r
      }\r
    </div>\r
\r
    <!-- Theme Toggle (desktop only; mobile uses drawer controls) -->\r
    <div class="hidden xl:block">\r
      <app-theme-toggle />\r
    </div>\r
\r
    <!-- Cart -->\r
    <button (click)="toggleCart()"\r
            class="btn btn-circle btn-sm btn-ghost hover:bg-black/10 dark:hover:bg-white/10\r
                   text-gray-700 dark:text-white transition-all" aria-label="Carrito">\r
      <div class="indicator">\r
        <i class="fas fa-shopping-cart text-base"></i>\r
        @if (cartService.totalItems() > 0) {\r
          <span class="badge badge-xs indicator-item bg-red-500 text-white border-none\r
                       font-bold text-[10px] min-w-4 h-4">\r
            {{ cartService.totalItems() }}\r
          </span>\r
        }\r
      </div>\r
    </button>\r
\r
    <!-- User Menu -->\r
    <div class="dropdown dropdown-end">\r
      <div tabindex="0" role="button"\r
           class="btn btn-circle btn-sm btn-ghost hover:bg-black/10 dark:hover:bg-white/10\r
                  text-gray-700 dark:text-white" aria-label="Men\xFA de usuario">\r
        <i class="fas fa-user text-base"></i>\r
      </div>\r
      <ul tabindex="0"\r
          class="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl\r
                 bg-white dark:bg-[#1a1c2e] border border-gray-100 dark:border-white/10\r
                 rounded-2xl w-56 text-gray-700 dark:text-gray-200">\r
        @let user = (user$ | async);\r
        @if (user) {\r
          <li>\r
            <a routerLink="/perfil" class="rounded-xl hover:bg-blue-50 dark:hover:bg-white/5">\r
              <i class="fas fa-user-circle"></i>\r
              <span class="flex-1 min-w-0">\r
                <span class="block text-sm leading-tight">Mi Perfil</span>\r
                <span class="block text-[11px] text-gray-500 truncate">{{ user?.email }}</span>\r
              </span>\r
            </a>\r
          </li>\r
          <li>\r
            <button (click)="logout()" class="rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500">\r
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesi\xF3n\r
            </button>\r
          </li>\r
          <li>\r
            <a routerLink="/admin" class="rounded-xl hover:bg-blue-50 dark:hover:bg-white/5">\r
              <i class="fas fa-shield-alt"></i> Admin\r
            </a>\r
          </li>\r
        } @else {\r
          <li>\r
            <a routerLink="/login" class="rounded-xl hover:bg-blue-50 dark:hover:bg-white/5">\r
              <i class="fas fa-sign-in-alt"></i> Iniciar Sesi\xF3n\r
            </a>\r
          </li>\r
          <li>\r
            <a routerLink="/register" class="rounded-xl hover:bg-blue-50 dark:hover:bg-white/5">\r
              <i class="fas fa-user-plus"></i> Registrarse\r
            </a>\r
          </li>\r
        }\r
      </ul>\r
    </div>\r
  </div>\r
</nav>\r
\r
\r
<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\r
     MOBILE DRAWER \u2014 Full-screen slide panel\r
     \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
@if (isMobileMenuOpen()) {\r
  <!-- Backdrop -->\r
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 xl:hidden animate-fade-in"\r
       (click)="closeMobileMenu()"></div>\r
\r
  <!-- Drawer -->\r
  <aside class="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] z-9999 xl:hidden\r
                bg-white dark:bg-[#12141f] shadow-2xl\r
                flex flex-col overflow-hidden animate-slide-in-left">\r
\r
    <!-- Drawer Header -->\r
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 shrink-0">\r
      <a class="flex items-center gap-2" [routerLink]="['/']" (click)="closeMobileMenu()">\r
        <img src="/assets/img/brands/logo/Logo (2).png" alt="Logo"\r
             class="h-6 w-auto hidden dark:block" height="24" width="80" />\r
        <img src="/assets/img/brands/logo/logo-normal1.PNG" alt="Logo"\r
             class="h-6 w-auto dark:hidden" height="24" width="80" />\r
        <span class="font-bold text-sm text-gray-900 dark:text-white font-heading">{{ appName }}</span>\r
      </a>\r
      <button (click)="closeMobileMenu()"\r
              class="btn btn-circle btn-xs btn-ghost text-gray-400 hover:text-gray-700\r
                     dark:hover:text-white">\r
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\r
        </svg>\r
      </button>\r
    </div>\r
\r
    <!-- Mobile Search -->\r
    <div class="px-3 py-2 border-b border-gray-100 dark:border-white/5 shrink-0">\r
      <div class="join w-full">\r
        <input type="text" placeholder="Buscar productos..."\r
               [appAutoFocus]="searchService.focusRequested$"\r
               [appAutoFocusImmediate]="searchFocusRequested()"\r
               [(ngModel)]="searchQuery" (input)="onSearchInput()"\r
               class="input input-sm input-bordered w-full bg-gray-50 dark:bg-white/5\r
                      border-gray-200 dark:border-white/10 text-gray-900 dark:text-white\r
                      join-item rounded-l-lg text-sm placeholder-gray-400" />\r
        <button class="btn btn-sm btn-primary join-item rounded-r-lg border-none px-3">\r
          <i class="fas fa-search text-xs"></i>\r
        </button>\r
      </div>\r
\r
      @if (showResults() && filteredProducts().length > 0) {\r
        <div class="mt-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10\r
                    rounded-xl overflow-hidden max-h-40 overflow-y-auto">\r
          @for (product of filteredProducts(); track product.id) {\r
            <a (click)="selectProduct(product)"\r
               class="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-white/5\r
                      transition-colors cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-none">\r
              <img [src]="product.image_url || '/assets/img/no-image.png'" [alt]="product.name"\r
                   class="w-7 h-7 object-contain rounded bg-white border" />\r
              <div class="flex-1 min-w-0">\r
                <span class="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{{ product.name }}</span>\r
                <span class="text-[11px] text-blue-600 dark:text-blue-400 font-bold">\${{ product.price }}</span>\r
              </div>\r
            </a>\r
          }\r
        </div>\r
      }\r
    </div>\r
\r
    <!-- Scrollable Nav -->\r
    <nav class="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" (click)="onMobileNavClick($event)">\r
      @for (item of navItems(); track item.id) {\r
        <app-nav-item-recursive [item]="item" [depth]="0" />\r
      }\r
    </nav>\r
\r
    <!-- Drawer Footer -->\r
    <div class="px-3 py-2.5 border-t border-gray-100 dark:border-white/5 shrink-0 space-y-2">\r
      <!-- Theme Selector -->\r
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">\r
        <span class="flex items-center gap-1.5">\r
          <i class="fas fa-palette text-[10px]"></i> Tema\r
        </span>\r
        <div class="flex items-center gap-0.5 bg-gray-100 dark:bg-white/5 rounded-lg p-0.5">\r
          <button (click)="themeService.setMode('light')"\r
                  class="px-2 py-1 rounded-md text-[11px] font-medium transition-all"\r
                  [class.bg-white]="themeService.mode() === 'light'"\r
                  [class.dark:bg-white/10]="themeService.mode() === 'light'"\r
                  [class.shadow-sm]="themeService.mode() === 'light'"\r
                  [class.text-yellow-600]="themeService.mode() === 'light'">\r
            <i class="fas fa-sun"></i>\r
          </button>\r
          <button (click)="themeService.setMode('dark')"\r
                  class="px-2 py-1 rounded-md text-[11px] font-medium transition-all"\r
                  [class.bg-white]="themeService.mode() === 'dark'"\r
                  [class.dark:bg-white/10]="themeService.mode() === 'dark'"\r
                  [class.shadow-sm]="themeService.mode() === 'dark'"\r
                  [class.text-blue-500]="themeService.mode() === 'dark'">\r
            <i class="fas fa-moon"></i>\r
          </button>\r
          <button (click)="themeService.setMode('system')"\r
                  class="px-2 py-1 rounded-md text-[11px] font-medium transition-all"\r
                  [class.bg-white]="themeService.mode() === 'system'"\r
                  [class.dark:bg-white/10]="themeService.mode() === 'system'"\r
                  [class.shadow-sm]="themeService.mode() === 'system'"\r
                  [class.text-green-500]="themeService.mode() === 'system'">\r
            <i class="fas fa-desktop"></i>\r
          </button>\r
        </div>\r
      </div>\r
\r
      <!-- Auth Shortcut -->\r
      @let user = (user$ | async);\r
      @if (user) {\r
        <button (click)="logout(); closeMobileMenu()"\r
                class="btn btn-xs btn-ghost w-full justify-start gap-2 rounded-lg\r
                       text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium">\r
          <i class="fas fa-sign-out-alt text-[10px]"></i> Cerrar Sesi\xF3n\r
        </button>\r
      } @else {\r
        <a routerLink="/login" (click)="closeMobileMenu()"\r
           class="btn btn-xs btn-primary w-full rounded-lg gap-2 font-medium">\r
          <i class="fas fa-sign-in-alt text-[10px]"></i> Iniciar Sesi\xF3n\r
        </a>\r
      }\r
    </div>\r
  </aside>\r
}\r
\r
\r
<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\r
     CART SIDEBAR\r
     \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
@if (isCartOpen()) {\r
  <div class="z-10000" role="dialog" aria-modal="true" aria-label="Carrito de compras">\r
    <div class="fixed inset-0 bg-black/50 transition-opacity" (click)="toggleCart()"></div>\r
    <div class="fixed inset-0 overflow-hidden">\r
      <div class="absolute inset-0 overflow-hidden">\r
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">\r
          <div class="pointer-events-auto w-screen max-w-md bg-white dark:bg-[#12141f] shadow-xl h-dvh">\r
            <div class="flex h-full flex-col overflow-y-auto">\r
\r
              <!-- Cart Header -->\r
              <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">\r
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Carrito</h2>\r
                <button (click)="toggleCart()"\r
                        class="btn btn-circle btn-sm btn-ghost text-gray-400 hover:text-gray-600\r
                               dark:hover:text-gray-200">\r
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\r
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\r
                  </svg>\r
                </button>\r
              </div>\r
\r
              <!-- Cart Body -->\r
              <div class="flex-1 px-5 py-4">\r
                @if (cartService.cartItems().length === 0) {\r
                  <div class="text-center py-12">\r
                    <i class="fas fa-shopping-bag text-3xl text-gray-300 dark:text-gray-600 mb-3"></i>\r
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Tu carrito est\xE1 vac\xEDo.</p>\r
                    <a (click)="toggleCart()" routerLink="/productos"\r
                       class="text-blue-600 dark:text-blue-400 font-medium hover:underline mt-3 inline-block text-sm">\r
                      Ver Productos \u2192\r
                    </a>\r
                  </div>\r
                } @else {\r
                  <ul class="space-y-4">\r
                    @for (item of cartService.cartItems(); track item.product.id) {\r
                      <li class="flex gap-3 pb-4 border-b border-gray-100 dark:border-white/5 last:border-none">\r
                        <div class="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">\r
                          <img [src]="item.product.image_url || '/assets/img/no-image.png'"\r
                               [alt]="item.product.name" class="w-full h-full object-cover" />\r
                        </div>\r
                        <div class="flex-1 min-w-0">\r
                          <a [routerLink]="['/productos/detalle', item.product.slug]" (click)="toggleCart()"\r
                             class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600\r
                                    transition-colors">\r
                            {{ item.product.name }}\r
                          </a>\r
                          <div class="flex items-center justify-between mt-1.5">\r
                            <span class="text-sm font-bold text-blue-600 dark:text-blue-400">\r
                              {{ item.product.price | currency }} \xD7 {{ item.quantity }}\r
                            </span>\r
                            <button (click)="cartService.removeFromCart(item.product.id)"\r
                                    class="text-xs text-red-500 hover:text-red-400 font-medium transition-colors">\r
                              Eliminar\r
                            </button>\r
                          </div>\r
                        </div>\r
                      </li>\r
                    }\r
                  </ul>\r
                }\r
              </div>\r
\r
              <!-- Cart Footer -->\r
              @if (cartService.cartItems().length > 0) {\r
                <div class="border-t border-gray-100 dark:border-white/5 px-5 py-4 shrink-0">\r
                  <div class="flex justify-between text-base font-bold text-gray-900 dark:text-white mb-3">\r
                    <span>Subtotal</span>\r
                    <span>{{ cartService.totalPrice() | currency }}</span>\r
                  </div>\r
                  <a (click)="toggleCart()" routerLink="/checkout"\r
                     class="btn btn-primary w-full rounded-xl font-medium">\r
                    Finalizar Compra\r
                  </a>\r
                  <button (click)="toggleCart()"\r
                          class="btn btn-ghost btn-sm w-full mt-2 text-blue-600 dark:text-blue-400 font-medium">\r
                    Continuar Comprando \u2192\r
                  </button>\r
                </div>\r
              }\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
}`, styles: ["/* angular:styles/component:css;93756b56e987a68945ac88192773c1a2bb21a2d9096208e7060585053fff0968;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/layout/components/header/public-layout-header.ts */\n:host {\n  display: contents;\n}\n/*# sourceMappingURL=public-layout-header.css.map */\n"] }]
  }], () => [], { onWindowScroll: [{
    type: HostListener,
    args: ["window:scroll"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicLayoutHeader, { className: "PublicLayoutHeader", filePath: "src/app/public/layout/components/header/public-layout-header.ts", lineNumber: 50 });
})();

// src/app/shared/footer/footer.ts
var Footer = class _Footer {
  preferencesService;
  email = "";
  isSubmitting = false;
  successMessage = "";
  errorMessage = "";
  // Exposed configuration
  socialLinks = environment.contact.socialMedia;
  whatsappNumber = environment.contact.whatsappNumber;
  currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  openAccessibilityMenu(event) {
    if (event) {
      event.preventDefault();
    }
    this.preferencesService.toggleSidebar();
  }
  subscribe() {
    if (!this.email) {
      this.errorMessage = "Por favor, ingresa un email v\xE1lido.";
      this.successMessage = "";
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = "";
    this.successMessage = "";
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = "\xA1Gracias por suscribirte!";
      this.email = "";
    }, 1500);
  }
  shareOn(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("\xA1Mira esta p\xE1gina de Arecofix!");
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  }
  static \u0275fac = function Footer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Footer)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Footer, selectors: [["app-footer"]], decls: 101, vars: 9, consts: [[1, "bg-gray-100", "dark:bg-[#050505]", "border-t", "border-gray-200", "dark:border-white/10", "py-10", "lg:py-16", "text-gray-700", "dark:text-gray-300", "transition-colors", "duration-300"], [1, "max-w-7xl", "mx-auto", "px-6", "sm:px-8", "lg:px-12"], [1, "flex", "flex-col", "lg:flex-row", "justify-between", "gap-10", "border-b", "border-gray-200", "dark:border-white/10", "pb-10"], [1, "flex", "flex-col", "items-center", "lg:items-start", "gap-6", "w-full", "lg:w-1/2"], ["ngSrc", "assets/img/brands/logo/log.png", "alt", "Logo Arecofix", "height", "40", "width", "136", 1, "h-10"], ["aria-label", "Footer navigation", 1, "w-full"], [1, "flex", "flex-row", "flex-wrap", "justify-center", "lg:justify-start", "gap-5", "text-sm", "text-gray-700", "dark:text-gray-300"], ["routerLink", "./", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/recursos", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/nosotros", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/productos", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/contacto", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/academy", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/servicios", 1, "hover:text-blue-400", "transition-colors", "font-medium"], [1, "flex", "gap-4", "mt-4", "flex-wrap", "justify-center", "lg:justify-start"], ["aria-label", "Facebook", 1, "w-10", "h-10", "rounded-lg", "bg-blue-100", "dark:bg-blue-600/20", "text-blue-600", "dark:text-blue-500", "hover:bg-blue-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-blue-200", "dark:border-blue-600/30", 3, "href"], [1, "fa-brands", "fa-facebook-f", "text-lg"], ["aria-label", "Instagram", 1, "w-10", "h-10", "rounded-lg", "bg-pink-100", "dark:bg-pink-600/20", "text-pink-600", "dark:text-pink-500", "hover:bg-pink-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-pink-200", "dark:border-pink-600/30", 3, "href"], [1, "fa-brands", "fa-instagram", "text-lg"], ["aria-label", "GitHub", 1, "w-10", "h-10", "rounded-lg", "bg-gray-200", "dark:bg-white/10", "text-gray-800", "dark:text-white", "hover:bg-black", "dark:hover:bg-white", "hover:text-white", "dark:hover:text-black", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-gray-300", "dark:border-white/20", 3, "href"], [1, "fa-brands", "fa-github", "text-lg"], ["aria-label", "LinkedIn", 1, "w-10", "h-10", "rounded-lg", "bg-blue-100", "dark:bg-blue-700/20", "text-blue-700", "dark:text-blue-400", "hover:bg-blue-700", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-blue-200", "dark:border-blue-700/30", 3, "href"], [1, "fa-brands", "fa-linkedin-in", "text-lg"], ["aria-label", "YouTube", 1, "w-10", "h-10", "rounded-lg", "bg-red-100", "dark:bg-red-600/20", "text-red-600", "dark:text-red-500", "hover:bg-red-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-red-200", "dark:border-red-600/30", 3, "href"], [1, "fa-brands", "fa-youtube", "text-lg"], ["aria-label", "Google Maps", 1, "w-10", "h-10", "rounded-lg", "bg-green-100", "dark:bg-green-600/20", "text-green-600", "dark:text-green-500", "hover:bg-green-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-green-200", "dark:border-green-600/30", 3, "href"], [1, "fa-solid", "fa-map-location-dot", "text-lg"], [1, "mt-6", "w-full", "text-center", "lg:text-left"], [1, "text-xs", "font-semibold", "text-gray-600", "dark:text-gray-400", "uppercase", "tracking-widest", "mb-3"], [1, "flex", "gap-3", "flex-wrap", "justify-center", "lg:justify-start"], ["aria-label", "Compartir en Facebook", "title", "Compartir en Facebook", 1, "w-8", "h-8", "rounded-full", "bg-blue-100", "dark:bg-blue-600/20", "text-blue-600", "dark:text-blue-500", "hover:bg-blue-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-facebook-f", "text-sm"], ["aria-label", "Compartir en X", "title", "Compartir en X", 1, "w-8", "h-8", "rounded-full", "bg-gray-200", "dark:bg-white/10", "text-gray-800", "dark:text-white", "hover:bg-black", "dark:hover:bg-white", "hover:text-white", "dark:hover:text-black", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-twitter", "text-sm"], ["aria-label", "Compartir en WhatsApp", "title", "Compartir en WhatsApp", 1, "w-8", "h-8", "rounded-full", "bg-green-100", "dark:bg-green-500/20", "text-green-600", "dark:text-green-500", "hover:bg-green-500", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-whatsapp", "text-sm"], [1, "grid", "grid-cols-2", "gap-4", "sm:gap-10", "w-full", "lg:w-1/2", "lg:flex", "lg:flex-nowrap", "lg:justify-between"], [1, "flex", "flex-col", "gap-6"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white", "border-b-2", "border-blue-500", "pb-2", "inline-block", "w-max"], [1, "space-y-3", "text-sm", "text-gray-600", "dark:text-gray-400"], ["routerLink", "/privacy", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-chevron-right", "text-xs", "text-blue-500/50"], ["routerLink", "/terms", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], ["routerLink", "/nosotros", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], ["routerLink", "/blog", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], [1, "space-y-4", "text-sm", "text-gray-600", "dark:text-gray-400"], [1, "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-location-dot", "text-blue-500", "mt-1"], [1, "flex", "items-center", "gap-3"], [1, "fa-solid", "fa-phone", "text-blue-500"], ["target", "_blank", 1, "hover:text-blue-400", "transition", 3, "href"], [1, "fa-solid", "fa-envelope", "text-blue-500"], ["href", "mailto:info@arecofix.com.ar", 1, "hover:text-blue-400", "transition"], [1, "pt-8", "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "gap-4", "text-sm", "text-gray-600", "dark:text-gray-400", "border-t", "border-gray-200", "dark:border-white/5", "mt-2"], ["routerLink", "/portfolio", 1, "hover:text-blue-400", "transition", "hover-scale", "inline-block"], [1, "font-bold", "text-gradient-premium"], [1, "flex", "gap-6"], ["aria-label", "Cambiar idioma a Espa\xF1ol", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-globe"], ["routerLink", "/sitemap", 1, "hover:text-blue-400", "transition"]], template: function Footer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementStart(5, "nav", 5)(6, "ul", 6)(7, "li")(8, "a", 7);
      \u0275\u0275text(9, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "li")(11, "a", 8);
      \u0275\u0275text(12, "Recursos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "li")(14, "a", 9);
      \u0275\u0275text(15, "Nosotros");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "li")(17, "a", 10);
      \u0275\u0275text(18, "Productos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "li")(20, "a", 11);
      \u0275\u0275text(21, "Contacto");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "li")(23, "a", 12);
      \u0275\u0275text(24, "Cursos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "li")(26, "a", 13);
      \u0275\u0275text(27, "Servicios");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(28, "div", 14)(29, "a", 15);
      \u0275\u0275element(30, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "a", 17);
      \u0275\u0275element(32, "i", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "a", 19);
      \u0275\u0275element(34, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "a", 21);
      \u0275\u0275element(36, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "a", 23);
      \u0275\u0275element(38, "i", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "a", 25);
      \u0275\u0275element(40, "i", 26);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "div", 27)(42, "h4", 28);
      \u0275\u0275text(43, "Compartir esta p\xE1gina");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "div", 29)(45, "button", 30);
      \u0275\u0275listener("click", function Footer_Template_button_click_45_listener() {
        return ctx.shareOn("facebook");
      });
      \u0275\u0275element(46, "i", 31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "button", 32);
      \u0275\u0275listener("click", function Footer_Template_button_click_47_listener() {
        return ctx.shareOn("twitter");
      });
      \u0275\u0275element(48, "i", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "button", 34);
      \u0275\u0275listener("click", function Footer_Template_button_click_49_listener() {
        return ctx.shareOn("whatsapp");
      });
      \u0275\u0275element(50, "i", 35);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(51, "div", 36)(52, "div", 37)(53, "h3", 38);
      \u0275\u0275text(54, "Enlaces R\xE1pidos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "ul", 39)(56, "li")(57, "a", 40);
      \u0275\u0275element(58, "i", 41);
      \u0275\u0275text(59, " Privacidad");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "li")(61, "a", 42);
      \u0275\u0275element(62, "i", 41);
      \u0275\u0275text(63, " T\xE9rminos Legales");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "li")(65, "a", 43);
      \u0275\u0275element(66, "i", 41);
      \u0275\u0275text(67, " Preguntas Frecuentes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "li")(69, "a", 44);
      \u0275\u0275element(70, "i", 41);
      \u0275\u0275text(71, " Blog");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(72, "div", 37)(73, "h3", 38);
      \u0275\u0275text(74, "Contacto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "ul", 45)(76, "li", 46);
      \u0275\u0275element(77, "i", 47);
      \u0275\u0275elementStart(78, "span");
      \u0275\u0275text(79, "Jorge Newbery 69, Marcos Paz");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "li", 48);
      \u0275\u0275element(81, "i", 49);
      \u0275\u0275elementStart(82, "a", 50);
      \u0275\u0275text(83);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "li", 48);
      \u0275\u0275element(85, "i", 51);
      \u0275\u0275elementStart(86, "a", 52);
      \u0275\u0275text(87, "info@arecofix.com.ar");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(88, "div", 53)(89, "p")(90, "a", 54);
      \u0275\u0275text(91);
      \u0275\u0275elementStart(92, "span", 55);
      \u0275\u0275text(93, "Arecofix");
      \u0275\u0275elementEnd();
      \u0275\u0275text(94, ". Todos los derechos reservados. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 56)(96, "button", 57);
      \u0275\u0275listener("click", function Footer_Template_button_click_96_listener() {
        return ctx.openAccessibilityMenu();
      });
      \u0275\u0275element(97, "i", 58);
      \u0275\u0275text(98, " Espa\xF1ol ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "a", 59);
      \u0275\u0275text(100, "Mapa del sitio");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(29);
      \u0275\u0275property("href", ctx.socialLinks.facebook, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.instagram, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.github, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.linkedin, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.youtube, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.googleMaps, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(43);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("+", ctx.whatsappNumber);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1(" \xA9 ", ctx.currentYear, " ");
    }
  }, dependencies: [RouterLink, FormsModule, CommonModule, NgOptimizedImage], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Footer, [{
    type: Component,
    args: [{ selector: "app-footer", standalone: true, imports: [RouterLink, FormsModule, CommonModule, NgOptimizedImage], template: `<footer class="bg-gray-100 dark:bg-[#050505] border-t border-gray-200 dark:border-white/10 py-10 lg:py-16 text-gray-700 dark:text-gray-300 transition-colors duration-300">\r
  <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">\r
    <div class="flex flex-col lg:flex-row justify-between gap-10 border-b border-gray-200 dark:border-white/10 pb-10">\r
\r
      <!-- Logo + Links + Redes -->\r
      <div class="flex flex-col items-center lg:items-start gap-6 w-full lg:w-1/2">\r
        <img ngSrc="assets/img/brands/logo/log.png" alt="Logo Arecofix" class="h-10" height="40"\r
          width="136" />\r
\r
        <nav aria-label="Footer navigation" class="w-full">\r
          <ul class="flex flex-row flex-wrap justify-center lg:justify-start gap-5 text-sm text-gray-700 dark:text-gray-300">\r
            <li><a routerLink="./" class="hover:text-blue-400 transition-colors font-medium">Inicio</a>\r
            </li>\r
            <li><a routerLink="/recursos"\r
                class="hover:text-blue-400 transition-colors font-medium">Recursos</a></li>\r
            <li><a routerLink="/nosotros"\r
                class="hover:text-blue-400 transition-colors font-medium">Nosotros</a></li>\r
            <li><a routerLink="/productos"\r
                class="hover:text-blue-400 transition-colors font-medium">Productos</a></li>\r
            <li><a routerLink="/contacto"\r
                class="hover:text-blue-400 transition-colors font-medium">Contacto</a></li>\r
            <li><a routerLink="/academy"\r
                class="hover:text-blue-400 transition-colors font-medium">Cursos</a></li>\r
            <li><a routerLink="/servicios"\r
                class="hover:text-blue-400 transition-colors font-medium">Servicios</a></li>\r
          </ul>\r
        </nav>\r
\r
        <!-- Social Media Buttons -->\r
        <div class="flex gap-4 mt-4 flex-wrap justify-center lg:justify-start">\r
          <a [href]="socialLinks.facebook" aria-label="Facebook"\r
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-blue-200 dark:border-blue-600/30">\r
            <i class="fa-brands fa-facebook-f text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.instagram" aria-label="Instagram"\r
            class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-600/20 text-pink-600 dark:text-pink-500 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-pink-200 dark:border-pink-600/30">\r
            <i class="fa-brands fa-instagram text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.github" aria-label="GitHub"\r
            class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex items-center justify-center transition-all hover-lift border border-gray-300 dark:border-white/20">\r
            <i class="fa-brands fa-github text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.linkedin" aria-label="LinkedIn"\r
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-700/20 text-blue-700 dark:text-blue-400 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all hover-lift border border-blue-200 dark:border-blue-700/30">\r
            <i class="fa-brands fa-linkedin-in text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.youtube" aria-label="YouTube"\r
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-red-200 dark:border-red-600/30">\r
            <i class="fa-brands fa-youtube text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.googleMaps" aria-label="Google Maps"\r
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-green-200 dark:border-green-600/30">\r
            <i class="fa-solid fa-map-location-dot text-lg"></i>\r
          </a>\r
        </div>\r
\r
        <!-- Share Buttons -->\r
        <div class="mt-6 w-full text-center lg:text-left">\r
          <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">Compartir esta p\xE1gina</h4>\r
          <div class="flex gap-3 flex-wrap justify-center lg:justify-start">\r
            <button (click)="shareOn('facebook')"\r
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"\r
              aria-label="Compartir en Facebook" title="Compartir en Facebook">\r
              <i class="fa-brands fa-facebook-f text-sm"></i>\r
            </button>\r
            <button (click)="shareOn('twitter')"\r
              class="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex items-center justify-center transition-all"\r
              aria-label="Compartir en X" title="Compartir en X">\r
              <i class="fa-brands fa-twitter text-sm"></i>\r
            </button>\r
            <button (click)="shareOn('whatsapp')"\r
              class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all"\r
              aria-label="Compartir en WhatsApp" title="Compartir en WhatsApp">\r
              <i class="fa-brands fa-whatsapp text-sm"></i>\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Links R\xE1pidos y Contacto (Side-by-side on mobile, columns on desktop) -->\r
      <div class="grid grid-cols-2 gap-4 sm:gap-10 w-full lg:w-1/2 lg:flex lg:flex-nowrap lg:justify-between">\r
\r
        <!-- Links R\xE1pidos -->\r
        <div class="flex flex-col gap-6">\r
          <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block w-max">Enlaces\r
            R\xE1pidos</h3>\r
          <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">\r
            <li><a routerLink="/privacy" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Privacidad</a></li>\r
            <li><a routerLink="/terms" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> T\xE9rminos Legales</a></li>\r
            <li><a routerLink="/nosotros" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Preguntas Frecuentes</a></li>\r
            <li><a routerLink="/blog" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Blog</a></li>\r
          </ul>\r
        </div>\r
\r
        <!-- Contacto -->\r
        <div class="flex flex-col gap-6">\r
          <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block w-max">Contacto</h3>\r
          <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">\r
            <li class="flex items-start gap-3">\r
              <i class="fa-solid fa-location-dot text-blue-500 mt-1"></i>\r
              <span>Jorge Newbery 69, Marcos Paz</span>\r
            </li>\r
            <li class="flex items-center gap-3">\r
              <i class="fa-solid fa-phone text-blue-500"></i>\r
              <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="hover:text-blue-400 transition">+{{ whatsappNumber }}</a>\r
            </li>\r
            <li class="flex items-center gap-3">\r
              <i class="fa-solid fa-envelope text-blue-500"></i>\r
              <a href="mailto:info@arecofix.com.ar"\r
                class="hover:text-blue-400 transition">info@arecofix.com.ar</a>\r
            </li>\r
          </ul>\r
        </div>\r
      </div>\r
\r
    </div>\r
\r
    <!-- Copyright -->\r
    <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-white/5 mt-2">\r
      <p>\r
        <a routerLink="/portfolio" class="hover:text-blue-400 transition hover-scale inline-block">\r
          &copy; {{ currentYear }} <span class="font-bold text-gradient-premium">Arecofix</span>. Todos los derechos reservados.\r
        </a>\r
      </p>\r
      <div class="flex gap-6">\r
        <button (click)="openAccessibilityMenu()" class="hover:text-blue-400 transition flex items-center gap-2" aria-label="Cambiar idioma a Espa\xF1ol">\r
          <i class="fa-solid fa-globe"></i> Espa\xF1ol\r
        </button>\r
        <a routerLink="/sitemap" class="hover:text-blue-400 transition">Mapa del sitio</a>\r
      </div>\r
    </div>\r
  </div>\r
</footer>` }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Footer, { className: "Footer", filePath: "src/app/shared/footer/footer.ts", lineNumber: 15 });
})();

// src/app/public/layout/public-layout.ts
var _c03 = (a0, a1) => [a0, a1];
var PublicLayout = class _PublicLayout {
  preferencesService;
  seoService = inject(SeoService);
  // Injection initializes the service
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  static \u0275fac = function PublicLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicLayout)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicLayout, selectors: [["app-public-layout"]], decls: 8, vars: 12, consts: [[1, "min-h-screen", "transition-all", "duration-300", "relative", "text-gray-900", "dark:text-gray-100", "font-sans", "pt-16", 3, "ngClass"]], template: function PublicLayout_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "public-layout-header");
      \u0275\u0275elementStart(1, "div", 0);
      \u0275\u0275pipe(2, "async");
      \u0275\u0275pipe(3, "async");
      \u0275\u0275pipe(4, "async");
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "app-accessibility-sidebar")(7, "app-footer");
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275styleProp("font-size", \u0275\u0275pipeBind1(2, 3, ctx.preferencesService.fontSize$), "px");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(9, _c03, ctx.preferencesService.getBackgroundClass(\u0275\u0275pipeBind1(3, 5, ctx.preferencesService.theme$)), \u0275\u0275pipeBind1(4, 7, ctx.preferencesService.highContrast$) ? "high-contrast" : ""));
    }
  }, dependencies: [CommonModule, NgClass, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicLayout, [{
    type: Component,
    args: [{ selector: "app-public-layout", standalone: true, imports: [CommonModule, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer], changeDetection: ChangeDetectionStrategy.OnPush, template: `<public-layout-header></public-layout-header>\r
<div\r
  [ngClass]="[preferencesService.getBackgroundClass((preferencesService.theme$ | async)!), (preferencesService.highContrast$ | async) ? 'high-contrast' : '']"\r
  [style.font-size.px]="(preferencesService.fontSize$ | async)"\r
  class="min-h-screen transition-all duration-300 relative text-gray-900 dark:text-gray-100 font-sans pt-16"\r
>\r
  <router-outlet></router-outlet>\r
</div>\r
\r
<app-accessibility-sidebar></app-accessibility-sidebar>\r
<app-footer></app-footer>\r
\r
` }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicLayout, { className: "PublicLayout", filePath: "src/app/public/layout/public-layout.ts", lineNumber: 18 });
})();

// src/app/public/home/public-home.content.ts
var HOME_CONTENT = {
  en: {
    hero: {
      title: "AI Solutions & Global IT Consultancy",
      subtitle: "We empower businesses in USA, Europe, and LatAm with custom Artificial Intelligence, Scalable Software, and Digital Transformation. Engineering the future.",
      ctaPrimary: "Start AI Project",
      ctaSecondary: "View Portfolio"
    },
    services: {
      title: "High-Tech Services",
      subtitle: "From AI Agents to Corporate Software",
      items: [
        { icon: "fas fa-brain", title: "AI & Machine Learning", description: "Custom LLMs, Predictive Models, and Intelligent Agents for business automation." },
        { icon: "fas fa-laptop-code", title: "Full Stack Development", description: "Enterprise-grade Web & Mobile applications using Angular, React, and Node.js." },
        { icon: "fas fa-server", title: "Cloud Architecture", description: "Scalable infrastructure on AWS/Azure, DevOps automation, and System Integration." },
        { icon: "fas fa-eye", title: "Computer Vision", description: "Image recognition systems for security, quality control, and healthcare." },
        { icon: "fas fa-shield-halved", title: "Cybersecurity & Audits", description: "Protecting your digital assets with advanced security protocols and ethical hacking." }
      ]
    },
    industries: {
      title: "Industries We Audit",
      subtitle: "Deep Tech Expertise",
      items: [
        {
          title: "Fintech & Banking",
          description: "Fraud detection AI & secure ledgers.",
          icon: "fas fa-coins",
          examples: ["Trading Bots", "Risk Analysis"]
        },
        {
          title: "AgroTech",
          description: "Smart farming solutions for LatAm.",
          icon: "fas fa-tractor",
          examples: ["Crop Monitoring", "Yield Prediction"]
        },
        {
          title: "Healthcare",
          description: "AI diagnostics & telemedicine.",
          icon: "fas fa-heart-pulse",
          examples: ["Patient Data", "Imaging AI"]
        },
        {
          title: "E-commerce",
          description: "Recommendation engines & chatbots.",
          icon: "fas fa-cart-shopping",
          examples: ["Personalization", "Auto-Support"]
        }
      ]
    },
    techServices: {
      title: "Tech Stack",
      subtitle: "Cutting-edge Tools",
      items: [
        {
          title: "Artificial Intelligence",
          description: "Python Powerhouse",
          icon: "fas fa-brain",
          image: "",
          features: ["TensorFlow", "PyTorch", "OpenAI API", "LangChain"]
        },
        {
          title: "Modern Frontend",
          description: "Responsive & Fast",
          icon: "fab fa-react",
          image: "",
          features: ["Angular", "React", "Next.js", "Tailwind"]
        },
        {
          title: "Robust Backend",
          description: "High Availability",
          icon: "fas fa-server",
          image: "",
          features: ["Node.js", "Python/Django", "Java Spring Boot", "PostgreSQL"]
        },
        {
          title: "Cloud & DevOps",
          description: "Scalable Infra",
          icon: "fas fa-cloud",
          image: "",
          features: ["AWS", "Docker", "Kubernetes", "CI/CD"]
        }
      ]
    },
    methodology: {
      title: "Our Methodology",
      subtitle: "Excellence in Every Step",
      description: "We combine strategy, design, and technology to deliver exceptional digital products.",
      steps: [
        { number: "01", title: "Discovery & Strategy", description: "We analyze your data and business goals to define the AI strategy.", icon: "fas fa-magnifying-glass-chart" },
        { number: "02", title: "Design & Prototyping", description: "Designing intuitive interfaces and data architectures.", icon: "fas fa-pen-nib" },
        { number: "03", title: "Agile Development", description: "Iterative coding sprints with continuous feedback loops.", icon: "fas fa-code-branch" },
        { number: "04", title: "QA & Testing", description: "Rigorous automated testing for robust performance.", icon: "fas fa-vial" },
        { number: "05", title: "Deploy & Optimize", description: "Cloud deployment and continuous model training.", icon: "fas fa-rocket" }
      ]
    },
    metrics: {
      title: "Global Impact",
      subtitle: "Proven Results",
      items: [
        { value: "+50", label: "Global Clients" },
        { value: "3", label: "Continents Served" },
        { value: "+10", label: "AI Models Deployed" },
        { value: "24/7", label: "Support Coverage" }
      ]
    },
    techStack: {
      title: "Technology Stack",
      subtitle: "Our Engineering Core",
      items: [
        { name: "Python", icon: "fab fa-python", category: "backend" },
        { name: "TensorFlow", icon: "fas fa-brain", category: "backend" },
        { name: "Angular", icon: "fab fa-angular", category: "frontend" },
        { name: "Node.js", icon: "fab fa-node", category: "backend" },
        { name: "AWS", icon: "fab fa-aws", category: "cloud" },
        { name: "Java", icon: "fab fa-java", category: "backend" }
      ]
    },
    projects: {
      title: "Featured Projects",
      subtitle: "Innovation in Action",
      items: [
        { title: "AI Management Dashboard", description: "Smart analytics platform for business intelligence using Python & React.", image: "assets/img/projects/panel.png", tags: ["AI", "React", "Python"], link: "/portfolio" },
        { title: "GovTech Platform", description: "Large scale beneficiary system for local government.", image: "assets/img/projects/data.png", tags: ["Django", "PostgreSQL", "Security"], link: "/portfolio" }
      ]
    },
    reviews: {
      title: "Testimonials",
      subtitle: "What Clients Say",
      items: [
        { image: "assets/img/utils/profile-placeholder.png", name: "Municipality of Marcos Paz", role: "Government", company: "Envi\xF3n Program", text: "Excellent technical team, providing robust support and system management." },
        { image: "assets/img/utils/profile-placeholder.png", name: "International Client", role: "CEO", company: "Tech Startup", text: "Arecofix delivered a world-class AI solution suitable for the US market." }
      ]
    },
    team: {
      title: "Our Team",
      subtitle: "Passionate Experts",
      members: [
        { name: "Ezequiel Enrico Areco", role: "Lead Software Engineer & AI Specialist", image: "assets/img/hero-illustration.svg", bio: "Specialist in AI Development, Full Stack Engineering using Angular/Spring/Python.", socials: { linkedin: "https://www.linkedin.com/in/ezequiel-enrico/", github: "https://github.com/arecofix" } }
      ]
    },
    remoteWork: {
      title: "Global Talent",
      subtitle: "Remote Work Specialists",
      description: "We collaborate with companies worldwide, offering top-tier talent in your time zone. Fluent English and Agile culture.",
      benefits: ["Fluent English", "Agile Process", "Full Commitment", "International Quality"],
      cta: "Hire Us",
      image: "assets/img/services/software-illustration.png"
    },
    github: {
      title: "Open Source",
      subtitle: "Contributing to the Future",
      repoName: "arecofix-ai-core",
      repoDescription: "Libraries for AI integration and clean architecture.",
      stars: "150+",
      forks: "40+",
      link: "https://github.com/arecofix"
    },
    quote: {
      title: "Let's Talk",
      subtitle: "Ready to transform your business?",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        projectType: "Service of Interest",
        budget: "Estimated Budget",
        description: "Tell us about your project",
        cta: "Send Inquiry"
      }
    },
    coursesTeaser: { title: "New Skill?", subtitle: "Train with pros.", cta: "View Courses", link: "/academy" },
    cellServicePromo: { title: "Hardware Lab", subtitle: "Expert device repair.", cta: "Visit Lab", link: "/celular" },
    businessPillars: {
      title: "Arecofix Ecosystem",
      subtitle: "Comprehensive Tech Solutions",
      items: [
        {
          title: "Hardware Lab",
          description: "Specialized Lab for mobile & console repairs (Argentina).",
          icon: "fas fa-microchip",
          image: "assets/img/services/repair-illustration.png",
          cta: "Go to Lab",
          link: "/celular",
          colorClass: "blue"
        },
        {
          title: "IT Academy",
          description: "Training the next generation of developers in LatAm.",
          icon: "fas fa-graduation-cap",
          image: "assets/img/services/academy-illustration.png",
          cta: "View Academy",
          link: "/academy",
          colorClass: "green"
        }
      ]
    },
    valueProposition: {
      title: "Why Choose Us?",
      subtitle: "",
      items: [
        { title: "AI First", description: "Integrating intelligence into every solution.", icon: "fas fa-brain" },
        { title: "Code Quality", description: "Clean Architecture & Scalable Patterns.", icon: "fas fa-code" },
        { title: "Global Standards", description: "World-class service for US/EU clients.", icon: "fas fa-globe" },
        { title: "Agile & Fast", description: "Rapid prototyping and delivery.", icon: "fas fa-bolt" }
      ]
    },
    faq: {
      title: "FAQ",
      items: [
        { question: "Do you work with US clients?", answer: "Yes, we specialize in remote consulting for US and European markets." },
        { question: "What AI services do you offer?", answer: "We build custom Agents, LLM integrations, and predictive models." }
      ]
    },
    novedadesFooter: {
      title: "Quick Links",
      links: [
        { text: "Home", url: "/" },
        { text: "Services", url: "/servicios" },
        { text: "Contact", url: "/contacto" }
      ]
    }
  },
  es: {
    hero: {
      title: "Consultor\xEDa IT Global & Desarrollo de Inteligencia Artificial",
      subtitle: "Transformamos empresas en Argentina, LatAm, USA y Europa con Software a Medida, Agentes de IA y Arquitecturas Cloud Escalables. Tu socio tecnol\xF3gico estrat\xE9gico.",
      ctaPrimary: "Consultar Proyecto IA",
      ctaSecondary: "Ver Portfolio"
    },
    businessPillars: {
      title: "Ecosistema Tecnol\xF3gico",
      subtitle: "Soluciones Integrales 360\xB0",
      items: [
        {
          title: "Laboratorio de Electr\xF3nica",
          description: "Servicio t\xE9cnico especializado en microelectr\xF3nica y recuperaci\xF3n de dispositivos en Marcos Paz (Sede Argentina).",
          icon: "fas fa-microchip",
          image: "assets/img/services/repair-illustration.png",
          cta: "Ir al Laboratorio",
          link: "/celular",
          colorClass: "blue"
        },
        {
          title: "Arecofix Academy",
          description: "Formaci\xF3n de talento IT de exportaci\xF3n. Cursos de programaci\xF3n y t\xE9cnica.",
          icon: "fas fa-graduation-cap",
          image: "assets/img/services/academy-illustration.png",
          cta: "Ver Academia",
          link: "/academy",
          colorClass: "green"
        }
      ]
    },
    valueProposition: {
      title: "Ingenier\xEDa de Software Premium",
      subtitle: "Calidad Internacional para Proyectos Ambiciosos",
      items: [
        {
          title: "Expertos en IA",
          description: "Implementamos LLMs (GPT/Llama), Computer Vision y Agentes Aut\xF3nomos para optimizar tu negocio.",
          icon: "fas fa-brain"
        },
        {
          title: "Clean Architecture",
          description: "C\xF3digo limpio, modular y testearble (Angular/Spring/Django) listo para escalar globalmente.",
          icon: "fas fa-layer-group"
        },
        {
          title: "Alcance Global",
          description: "Experiencia trabajando con clientes de USA, Espa\xF1a y LatAm. Ingl\xE9s fluido y cultura remota.",
          icon: "fas fa-globe-americas"
        },
        {
          title: "Innovaci\xF3n Continua",
          description: "Siempre a la vanguardia con las \xFAltimas tecnolog\xEDas del mercado.",
          icon: "fas fa-rocket"
        }
      ]
    },
    methodology: {
      title: "Metodolog\xEDa de Trabajo",
      subtitle: "De la Idea a la Producci\xF3n",
      description: "Combinamos agilidad con robustez t\xE9cnica para entregar valor desde el d\xEDa uno.",
      steps: [
        { number: "01", title: "Consultor\xEDa & Estrategia", description: "Analizamos tu modelo de negocio para aplicar la soluci\xF3n de IA/IT correcta.", icon: "fas fa-chess" },
        { number: "02", title: "Dise\xF1o UX/UI System", description: "Creaci\xF3n de interfaces modernas y experiencias de usuario fluidas.", icon: "fas fa-palette" },
        { number: "03", title: "Desarrollo \xC1gil", description: "Sprints de desarrollo con entregables constantes y feedback activo.", icon: "fas fa-laptop-code" },
        { number: "04", title: "QA Automatizado", description: "Tests unitarios y de integraci\xF3n para garantizar cero fallos.", icon: "fas fa-check-double" },
        { number: "05", title: "Despliegue Cloud", description: "Infraestructura el\xE1stica en AWS/Google Cloud y soporte continuo.", icon: "fas fa-cloud-arrow-up" }
      ]
    },
    faq: {
      title: "Preguntas Frecuentes",
      items: [
        { question: "\xBFTrabajan para el exterior?", answer: "S\xED, somos una consultora remota con clientes en USA, Espa\xF1a y toda Latinoam\xE9rica." },
        { question: "\xBFHacen desarrollo de IA?", answer: "S\xED, desarrollamos chatbots inteligentes, sistemas de predicci\xF3n y automatizaci\xF3n con IA." },
        { question: "\xBFQu\xE9 garant\xEDa ofrecen?", answer: "Todos nuestros desarrollos cuentan con garant\xEDa de c\xF3digo y soporte post-implementaci\xF3n." },
        { question: "\xBFSiguen reparando hardware?", answer: "S\xED, mantenemos nuestro laboratorio de hardware de alta complejidad en Argentina." }
      ]
    },
    services: {
      title: "Servicios de Alta Tecnolog\xEDa",
      subtitle: "Soluciones Digitales de Punta a Punta",
      items: [
        { icon: "fas fa-brain", title: "Consultor\xEDa en IA", description: "Integraci\xF3n de Inteligencia Artificial Generativa y Machine Learning en tus procesos." },
        { icon: "fas fa-code", title: "Software Factory", description: "Desarrollo a medida de aplicaciones Web y M\xF3viles (Angular, React, Python, Java)." },
        { icon: "fas fa-users-gear", title: "Staff Augmentation", description: "Producimos talento IT de alto nivel para sumarse a tus equipos (Devs, QA, DevOps)." },
        { icon: "fas fa-robot", title: "Automatizaci\xF3n Inteligente", description: "RPA y bots para reducir costos operativos y eliminar tareas manuales." },
        { icon: "fas fa-server", title: "Cloud & Ciberseguridad", description: "Migraciones a la nube y auditor\xEDas de seguridad inform\xE1tica." }
      ]
    },
    industries: {
      title: "Sectores que Potenciamos",
      subtitle: "Experiencia Multisectorial",
      items: [
        {
          title: "Fintech & Cripto",
          description: "Seguridad y transacciones r\xE1pidas.",
          icon: "fab fa-bitcoin",
          examples: ["Wallets", "Bots de Trading"]
        },
        {
          title: "Agro & Industria",
          description: "Tecnolog\xEDa para el campo y f\xE1bricas.",
          icon: "fas fa-tractor",
          examples: ["Monitoreo Satelital", "IoT"]
        },
        {
          title: "Salud (HealthTech)",
          description: "Digitalizaci\xF3n m\xE9dica segura.",
          icon: "fas fa-user-doctor",
          examples: ["Turneros", "Telemedicina"]
        },
        {
          title: "Retail & E-commerce",
          description: "Ventas online inteligentes.",
          icon: "fas fa-store",
          examples: ["Recomendadores", "Stock AI"]
        }
      ]
    },
    techServices: {
      title: "Stack Tecnol\xF3gico",
      subtitle: "Herramientas de Clase Mundial",
      items: [
        {
          title: "Inteligencia Artificial",
          description: "Python & Modelos",
          icon: "fas fa-head-side-virus",
          image: "",
          features: ["TensorFlow", "OpenAI", "LangChain", "Computer Vision"]
        },
        {
          title: "Frontend & UI",
          description: "Velocidad y Dise\xF1o",
          icon: "fas fa-palette",
          image: "",
          features: ["Angular 17+", "React", "Tailwind CSS", "Figma"]
        },
        {
          title: "Backend Enterprise",
          description: "Escalabilidad Pura",
          icon: "fas fa-network-wired",
          image: "",
          features: ["Java Spring Boot", "Node.js", "Python Django", "Go"]
        },
        {
          title: "Infraestructura",
          description: "Cloud Native",
          icon: "fas fa-server",
          image: "",
          features: ["AWS", "Google Cloud", "Docker", "Terraform"]
        }
      ]
    },
    metrics: {
      title: "Nuestro Impacto",
      subtitle: "M\xE9tricas Reales",
      items: [
        { value: "+60", label: "Proyectos Exitosos" },
        { value: "4", label: "Pa\xEDses Alcanzados" },
        { value: "+15", label: "Soluciones de IA" },
        { value: "100%", label: "Compromiso" }
      ]
    },
    techStack: {
      title: "Tecnolog\xEDas Principales",
      subtitle: "Dominamos el ecosistema moderno",
      items: [
        { name: "Python", icon: "fab fa-python", category: "backend" },
        { name: "Java", icon: "fab fa-java", category: "backend" },
        { name: "Angular", icon: "fab fa-angular", category: "frontend" },
        { name: "React", icon: "fab fa-react", category: "frontend" },
        { name: "AWS", icon: "fab fa-aws", category: "cloud" },
        { name: "Postgres", icon: "fas fa-database", category: "backend" }
      ]
    },
    projects: {
      title: "Portfolio Destacado",
      subtitle: "Innovaci\xF3n aplicada al mundo real",
      items: [
        { title: "Dashboard de IA", description: "Plataforma de an\xE1lisis de datos con modelos predictivos personalizados en Python.", image: "assets/img/projects/panel.png", tags: ["AI", "Python", "React"], link: "/portfolio" },
        { title: "Sistema de Gobierno", description: "Plataforma de gesti\xF3n masiva para el sector p\xFAblico (GovTech).", image: "assets/img/projects/data.png", tags: ["Java", "Spring Boot", "Angular"], link: "/portfolio" }
      ]
    },
    reviews: {
      title: "Testimonios",
      subtitle: "Conf\xEDan en Nosotros",
      items: [
        { image: "assets/img/utils/profile-placeholder.png", name: "Municipio de Marcos Paz", role: "Gobierno", company: "Sec. de Modernizaci\xF3n", text: "Arecofix moderniz\xF3 nuestros sistemas legados con una eficiencia incre\xEDble." },
        { image: "assets/img/utils/profile-placeholder.png", name: "Startup USA", role: "CTO", company: "Fintech", text: "Gran equipo de desarrollo, excelente comunicaci\xF3n en ingl\xE9s y calidad de c\xF3digo top." }
      ]
    },
    team: {
      title: "Liderazgo T\xE9cnico",
      subtitle: "Visi\xF3n y Ejecuci\xF3n",
      members: [
        { name: "Ezequiel Enrico Areco", role: "Lead Software Engineer & AI Architect", image: "assets/img/hero-illustration.svg", bio: "Ingeniero de Software especializado en Inteligencia Artificial, Java Spring Boot y Desarrollo Web Fullstack. Instructor IT.", socials: { linkedin: "https://www.linkedin.com/in/ezequiel-enrico/", github: "https://github.com/arecofix" } }
      ]
    },
    remoteWork: {
      title: "Consultora IT Global",
      subtitle: "Servicios para USA, Europa y LatAm",
      description: "Somos tu partner tecnol\xF3gico ideal. Ofrecemos desarrollo de software de calidad internacional, comunicaci\xF3n fluida y alineaci\xF3n horaria. Llevamos la ingenier\xEDa argentina al mundo.",
      benefits: ["Soporte Biling\xFCe", "Zona Horaria GMT-3", "Talento Senior", "Costos Competitivos"],
      cta: "Agendar Reuni\xF3n",
      image: "assets/img/services/software-illustration.png"
    },
    github: {
      title: "C\xF3digo Abierto",
      subtitle: "Creamos comunidad",
      repoName: "arecofix-core",
      repoDescription: "Nuestras librer\xEDas base para acelerar el desarrollo de software seguro.",
      stars: "150+",
      forks: "40+",
      link: "https://github.com/arecofix"
    },
    quote: {
      title: "Inici\xE1 tu Transformaci\xF3n",
      subtitle: "Lleva tu empresa al siguiente nivel con IA",
      form: {
        name: "Nombre y Apellido",
        email: "Email Corporativo",
        phone: "WhatsApp / Tel\xE9fono",
        company: "Empresa / Organizaci\xF3n",
        projectType: "Servicio de Inter\xE9s",
        budget: "Presupuesto Estimado (USD)",
        description: "Detanos tu desaf\xEDo o idea...",
        cta: "Solicitar Consultor\xEDa"
      }
    },
    coursesTeaser: {
      title: "Arecofix Academy",
      subtitle: "Aprende a programar IA y Web con nuestros expertos.",
      cta: "Ver Cursos",
      link: "/academy"
    },
    cellServicePromo: {
      title: "Laboratorio T\xE9cnico",
      subtitle: "Reparaci\xF3n de hardware (Celulares, Notebooks, Consolas) en Argentina.",
      cta: "Ir al Lab",
      link: "/celular"
    },
    novedadesFooter: {
      title: "Explorar",
      links: [
        { text: "Servicios", url: "/servicios" },
        { text: "Portfolio", url: "/portfolio" },
        { text: "Contacto", url: "/contacto" },
        { text: "Sitemap", url: "/sitemap" }
      ]
    }
  }
};

// src/app/public/home/public-home-page.ts
var _forTrack03 = ($index, $item) => $item.title;
var _forTrack12 = ($index, $item) => $item.number;
var _forTrack2 = ($index, $item) => $item.label;
function PublicHomePage_ng_container_0_For_42_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275element(1, "img", 80)(2, "div", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pillar_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngSrc", pillar_r1.image)("alt", pillar_r1.title);
  }
}
function PublicHomePage_ng_container_0_For_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 73);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PublicHomePage_ng_container_0_For_42_Conditional_3_Template, 3, 2, "div", 74);
    \u0275\u0275elementStart(4, "div", 75)(5, "div");
    \u0275\u0275element(6, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "h3", 76);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 77);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 78);
    \u0275\u0275text(12);
    \u0275\u0275element(13, "i", 79);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const pillar_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(pillar_r1.icon + " text-9xl");
    \u0275\u0275advance();
    \u0275\u0275conditional(pillar_r1.image ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("w-14 h-14 rounded-xl flex items-center justify-center mb-6 " + (pillar_r1.colorClass === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"));
    \u0275\u0275advance();
    \u0275\u0275classMap(pillar_r1.icon + " text-2xl");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pillar_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pillar_r1.description);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", pillar_r1.link);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", pillar_r1.cta, " ");
  }
}
function PublicHomePage_ng_container_0_For_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82)(1, "div", 83);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 84);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 85);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const service_r2 = ctx.$implicit;
    const \u0275$index_123_r3 = ctx.$index;
    const \u0275$count_123_r4 = ctx.$count;
    \u0275\u0275classProp("col-span-2", \u0275$index_123_r3 === \u0275$count_123_r4 - 1)("lg:col-span-1", \u0275$index_123_r3 === \u0275$count_123_r4 - 1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(service_r2.icon + " text-lg md:text-xl");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.description);
  }
}
function PublicHomePage_ng_container_0_For_63_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 89);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const feat_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(feat_r5);
  }
}
function PublicHomePage_ng_container_0_For_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "h3", 86);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 87);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 88);
    \u0275\u0275repeaterCreate(7, PublicHomePage_ng_container_0_For_63_For_8_Template, 2, 1, "span", 89, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r6.icon + " text-2xl md:text-4xl mb-2 md:mb-3 text-gradient block mx-auto");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(item_r6.features);
  }
}
function PublicHomePage_ng_container_0_For_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90)(1, "div", 91)(2, "span", 92);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "div", 93);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "div", 94);
    \u0275\u0275element(7, "i");
    \u0275\u0275elementStart(8, "h3", 95);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 96);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const step_r7 = ctx.$implicit;
    const \u0275$index_186_r8 = ctx.$index;
    const \u0275$count_186_r9 = ctx.$count;
    \u0275\u0275classProp("col-span-2", \u0275$index_186_r8 === \u0275$count_186_r9 - 1)("lg:col-span-1", \u0275$index_186_r8 === \u0275$count_186_r9 - 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(step_r7.number);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(step_r7.icon + " text-blue-400 text-lg md:text-xl lg:hidden");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r7.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r7.description);
  }
}
function PublicHomePage_ng_container_0_For_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "h2", 97);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 98);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const metric_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", metric_r10.value, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r10.label);
  }
}
function PublicHomePage_ng_container_0_For_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "h3", 99);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 100);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const industry_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(industry_r11.icon + " text-4xl mb-4 text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(industry_r11.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(industry_r11.description);
  }
}
function PublicHomePage_ng_container_0_For_103_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275element(1, "i", 101);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const benefit_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", benefit_r12, " ");
  }
}
function PublicHomePage_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 2)(2, "div", 3);
    \u0275\u0275element(3, "div", 4)(4, "div", 5)(5, "div", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 7)(7, "div", 8)(8, "div", 9)(9, "div", 10);
    \u0275\u0275element(10, "span", 11);
    \u0275\u0275elementStart(11, "span", 12);
    \u0275\u0275text(12, "Open to New Projects");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "h1", 13);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 14);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 15)(18, "a", 16);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "a", 17);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 18)(23, "div", 19)(24, "div", 20);
    \u0275\u0275element(25, "img", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 22)(27, "div", 23);
    \u0275\u0275element(28, "div", 24)(29, "div", 25)(30, "div", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 27);
    \u0275\u0275text(32, " > git push origin production");
    \u0275\u0275element(33, "br");
    \u0275\u0275elementStart(34, "span", 28);
    \u0275\u0275text(35, "Build success... \u{1F680}");
    \u0275\u0275elementEnd()()()()()()()();
    \u0275\u0275elementStart(36, "section", 29)(37, "div", 30)(38, "div", 31)(39, "h2", 32);
    \u0275\u0275text(40, "Nuestros Pilares de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(41, PublicHomePage_ng_container_0_For_42_Template, 14, 11, "div", 33, _forTrack03);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "section", 34, 0)(45, "div", 35)(46, "div", 36)(47, "h2", 37);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "p", 38);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div", 39);
    \u0275\u0275repeaterCreate(52, PublicHomePage_ng_container_0_For_53_Template, 7, 8, "div", 40, _forTrack03);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(54, "section", 41)(55, "div", 42)(56, "div", 43)(57, "h2", 44);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "p", 45);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(61, "div", 46);
    \u0275\u0275repeaterCreate(62, PublicHomePage_ng_container_0_For_63_Template, 9, 4, "div", 47, _forTrack03);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(64, "section", 48)(65, "div", 35)(66, "div", 49)(67, "div", 50)(68, "h2", 51);
    \u0275\u0275text(69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "p", 52);
    \u0275\u0275text(71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "a", 53);
    \u0275\u0275text(73, " Start a Project ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "div", 54);
    \u0275\u0275repeaterCreate(75, PublicHomePage_ng_container_0_For_76_Template, 12, 9, "div", 55, _forTrack12);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(77, "section", 56)(78, "div", 35)(79, "div", 57);
    \u0275\u0275repeaterCreate(80, PublicHomePage_ng_container_0_For_81_Template, 5, 2, "div", 58, _forTrack2);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(82, "section", 34)(83, "div", 35)(84, "div", 59)(85, "h2", 60);
    \u0275\u0275text(86);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "p", 61);
    \u0275\u0275text(88);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(89, "div", 62);
    \u0275\u0275repeaterCreate(90, PublicHomePage_ng_container_0_For_91_Template, 6, 4, "div", 63, _forTrack03);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(92, "section", 64);
    \u0275\u0275element(93, "div", 65);
    \u0275\u0275elementStart(94, "div", 66)(95, "span", 67);
    \u0275\u0275text(96, "Global Reach");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "h2", 68);
    \u0275\u0275text(98);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "p", 69);
    \u0275\u0275text(100);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "div", 70);
    \u0275\u0275repeaterCreate(102, PublicHomePage_ng_container_0_For_103_Template, 3, 1, "span", 71, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "a", 72);
    \u0275\u0275text(105);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const content_r13 = ctx.ngIf;
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.subtitle, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.ctaPrimary, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.ctaSecondary, " ");
    \u0275\u0275advance(20);
    \u0275\u0275repeater(content_r13.businessPillars.items);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r13.services.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.services.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.services.items);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(content_r13.techServices.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.techServices.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.techServices.items);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r13.methodology.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.methodology.description);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(content_r13.methodology.steps);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(content_r13.metrics.items);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(content_r13.industries.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.industries.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.industries.items);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(content_r13.remoteWork.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.remoteWork.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.remoteWork.benefits);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", content_r13.remoteWork.cta, " ");
  }
}
var PublicHomePage = class _PublicHomePage {
  preferencesService;
  seoService = inject(SeoService);
  auth = inject(AuthService);
  whatsappNumber = environment.contact.whatsappNumber;
  // Quote Form State
  quoteModel = {
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "web",
    budget: "mid",
    description: "",
    cta: ""
  };
  sendingQuote = false;
  homeContent = HOME_CONTENT;
  content$;
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
    this.content$ = this.preferencesService.language$.pipe(map((lang) => {
      const key = lang;
      const content = this.homeContent[key];
      if (lang === "es") {
        content.coursesTeaser = this.homeContent.es.coursesTeaser || this.homeContent["es"]["coursesTeaser"];
      }
      return content;
    }));
  }
  ngOnInit() {
    this.setSEO();
  }
  setSEO() {
  }
  scrollToSection(element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  async sendQuote() {
    if (!this.quoteModel.name || !this.quoteModel.email || !this.quoteModel.description) {
      alert("Por favor completa los campos principales.");
      return;
    }
    this.sendingQuote = true;
    try {
      const supabase = this.auth.getSupabaseClient();
      await supabase.from("contact_messages").insert({
        name: this.quoteModel.name,
        email: this.quoteModel.email,
        phone: this.quoteModel.phone,
        subject: `Presupuesto IT: ${this.quoteModel.projectType} - ${this.quoteModel.company}`,
        message: `Presupuesto: ${this.quoteModel.budget}
Descripci\xF3n: ${this.quoteModel.description}`,
        is_read: false
      });
      alert("Solicitud enviada. Nos pondremos en contacto pronto.");
      this.quoteModel = __spreadProps(__spreadValues({}, this.quoteModel), { name: "", email: "", phone: "", company: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("Error al enviar. Por favor intenta por WhatsApp.");
      const text = `Hola, quiero cotizar un proyecto de ${this.quoteModel.projectType}. Mi presupuesto es ${this.quoteModel.budget}.`;
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    } finally {
      this.sendingQuote = false;
    }
  }
  static \u0275fac = function PublicHomePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicHomePage)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicHomePage, selectors: [["app-public-home-page"]], decls: 2, vars: 3, consts: [["servicesSection", ""], [4, "ngIf"], [1, "relative", "min-h-[90vh]", "flex", "items-center", "pt-24", "pb-32", "lg:pb-48", "overflow-hidden", "bg-gray-50", "dark:bg-[#0a0a0a]", "text-gray-900", "dark:text-white", "transition-colors", "duration-300"], [1, "absolute", "inset-0", "z-0"], [1, "absolute", "top-[-20%]", "right-[-10%]", "w-[800px]", "h-[800px]", "bg-blue-600/10", "rounded-full", "blur-[120px]", "animate-pulse-slow"], [1, "absolute", "bottom-[-20%]", "left-[-10%]", "w-[600px]", "h-[600px]", "bg-purple-600/5", "rounded-full", "blur-[100px]"], [1, "absolute", "inset-0", "bg-[url('assets/img/pattern-grid.svg')]", "opacity-[0.03]"], [1, "container", "mx-auto", "px-4", "relative", "z-30"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-12", "lg:gap-20"], [1, "lg:w-1/2", "text-center", "lg:text-left"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "rounded-full", "glass-panel", "mb-8"], [1, "w-2", "h-2", "rounded-full", "bg-green-400", "animate-pulse"], [1, "text-xs", "font-mono", "text-gray-300", "tracking-wider", "uppercase"], [1, "text-5xl", "lg:text-7xl", "font-bold", "mb-6", "leading-[1.1]", "tracking-tight", "text-gradient"], [1, "text-xl", "text-gray-600", "dark:text-gray-400", "mb-10", "leading-relaxed", "max-w-2xl", "mx-auto", "lg:mx-0", "font-light", "font-body"], [1, "flex", "flex-col", "sm:flex-row", "items-center", "justify-center", "lg:justify-start", "gap-4"], ["routerLink", "/contacto", 1, "px-8", "py-4", "bg-gray-900", "text-white", "dark:bg-white", "dark:text-black", "rounded-lg", "font-bold", "text-lg", "hover:bg-gray-800", "dark:hover:bg-gray-200", "transition-all", "transform", "hover:scale-105", "shadow-xl", "shadow-blue-900/10", "dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]", "flex", "items-center", "justify-center", "cursor-pointer"], ["routerLink", "/portfolio", 1, "px-8", "py-4", "glass-panel", "text-gray-900", "dark:text-white", "rounded-lg", "font-medium", "text-lg", "hover:bg-black/5", "dark:hover:bg-white/5", "transition-all", "text-center", "flex", "items-center", "justify-center", "cursor-pointer"], [1, "lg:w-1/2", "relative", "hidden", "lg:block", "animate-float"], [1, "relative", "z-10", "glass-card", "p-2", "rounded-2xl", "transform", "rotate-1", "hover:rotate-0", "transition-duration-500", "w-full"], [1, "relative", "w-full", "aspect-video", "rounded-xl", "overflow-hidden"], ["ngSrc", "assets/img/services/software-illustration.png", "alt", "Dashboard Preview", "fill", "", "priority", "", 1, "object-cover"], [1, "absolute", "-bottom-10", "-left-10", "bg-[#1e1e1e]", "p-4", "rounded-lg", "border", "border-gray-700", "shadow-xl", "hidden", "md:block"], [1, "flex", "gap-2", "mb-2"], [1, "w-3", "h-3", "rounded-full", "bg-red-500"], [1, "w-3", "h-3", "rounded-full", "bg-yellow-500"], [1, "w-3", "h-3", "rounded-full", "bg-green-500"], [1, "font-mono", "text-xs", "text-green-400"], [1, "text-white"], [1, "py-20", "bg-white", "dark:bg-black", "text-gray-900", "dark:text-white", "relative", "z-20", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4", "-mt-20", "lg:-mt-32"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "sr-only"], [1, "group", "relative", "overflow-hidden", "rounded-2xl", "glass-card", "transition-all", "duration-300", "hover:border-blue-500/50", "flex", "flex-col", "h-full"], [1, "py-24", "bg-gray-50", "dark:bg-[#050505]", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4"], [1, "text-center", "max-w-3xl", "mx-auto", "mb-20"], [1, "text-3xl", "lg:text-5xl", "font-bold", "text-gray-900", "dark:text-white", "mb-6", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "text-lg", "font-body"], [1, "grid", "grid-cols-2", "lg:grid-cols-3", "gap-3", "md:gap-6"], [1, "glass-card", "rounded-xl", "p-4", "md:p-8", "hover:bg-[#151515]", "transition-all", "group", "h-full", "flex", "flex-col", "items-center", "text-center", 3, "col-span-2", "lg:col-span-1"], [1, "py-20", "bg-white", "dark:bg-black", "border-y", "border-gray-200", "dark:border-white/5", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4", "text-center"], [1, "text-center", "mb-12"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "mt-2"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-3", "md:gap-6"], [1, "glass-panel", "p-3", "md:p-6", "rounded-xl", "flex", "flex-col", "items-center", "justify-center", "text-center", "hover:bg-white/5", "transition-colors", "h-full"], [1, "py-24", "bg-gray-50", "dark:bg-[#0a0a0a]", "text-gray-900", "dark:text-white", "transition-colors", "duration-300"], [1, "flex", "flex-col", "lg:flex-row", "gap-16", "items-start"], [1, "lg:w-1/3", "sticky", "top-24"], [1, "text-4xl", "lg:text-5xl", "font-bold", "mb-6", "font-heading", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-400", "text-lg", "leading-relaxed", "mb-8", "font-body"], ["routerLink", "/contacto", 1, "px-6", "py-3", "bg-blue-600", "hover:bg-blue-700", "rounded-lg", "text-white", "font-bold", "transition-colors", "inline-block"], [1, "lg:w-2/3", "grid", "grid-cols-2", "lg:grid-cols-1", "gap-3", "md:gap-6"], [1, "flex", "flex-col", "lg:flex-row", "gap-3", "md:gap-6", "items-center", "lg:items-start", "p-4", "md:p-8", "rounded-2xl", "glass-panel", "hover:bg-white/10", "transition-colors", "text-center", "lg:text-left", "h-full", 3, "col-span-2", "lg:col-span-1"], [1, "py-16", "bg-white", "dark:bg-black", "border-y", "border-gray-200", "dark:border-white/5", "text-center", "transition-colors", "duration-300"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-8"], [1, "p-4"], [1, "text-center", "mb-16"], [1, "text-3xl", "lg:text-4xl", "font-bold", "text-gray-900", "dark:text-white", "font-heading"], [1, "text-gray-600", "dark:text-gray-400"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "aspect-square", "rounded-2xl", "glass-card", "flex", "flex-col", "items-center", "justify-center", "p-6", "text-center", "group", "cursor-default", "hover:border-green-500/30"], [1, "py-24", "relative", "overflow-hidden", "bg-linear-to-br", "from-blue-900", "via-blue-950", "to-black"], [1, "absolute", "inset-0", "bg-[url('assets/img/pattern-grid.svg')]", "opacity-10"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "text-center", "text-white"], [1, "inline-block", "py-1", "px-3", "rounded", "glass-panel", "text-blue-200", "text-xs", "font-bold", "uppercase", "tracking-wider", "mb-6"], [1, "text-4xl", "lg:text-5xl", "font-bold", "mb-6", "max-w-3xl", "mx-auto", "font-heading"], [1, "text-xl", "text-blue-100", "mb-10", "max-w-2xl", "mx-auto", "font-body"], [1, "flex", "flex-wrap", "justify-center", "gap-4", "mb-10"], [1, "flex", "items-center", "gap-2", "bg-blue-800/30", "backdrop-blur-sm", "px-4", "py-2", "rounded-full", "border", "border-blue-400/30", "text-sm"], ["routerLink", "/contacto", 1, "inline-block", "bg-white", "text-blue-900", "px-10", "py-4", "rounded-xl", "font-bold", "text-lg", "shadow-xl", "hover:bg-gray-100", "transition-colors", "cursor-pointer"], [1, "absolute", "top-0", "right-0", "p-4", "opacity-5", "group-hover:opacity-10", "transition-opacity"], [1, "relative", "h-48", "overflow-hidden"], [1, "relative", "z-10", "p-8", "pt-4", "flex", "flex-col", "text-left", "grow"], [1, "text-2xl", "font-bold", "mb-3", "font-heading", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-400", "mb-6", "leading-relaxed", "grow", "font-body"], [1, "inline-flex", "items-center", "gap-2", "font-bold", "text-sm", "tracking-wide", "uppercase", "hover:text-blue-600", "dark:hover:text-white", "transition-colors", "text-gray-700", "dark:text-gray-300", "mt-auto", 3, "routerLink"], [1, "fas", "fa-arrow-right"], ["fill", "", "sizes", "(max-width: 768px) 100vw, 50vw", 1, "object-cover", "transform", "group-hover:scale-110", "transition-transform", "duration-700", 3, "ngSrc", "alt"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-white", "dark:from-[#1a1a1a]", "to-transparent", "opacity-80"], [1, "glass-card", "rounded-xl", "p-4", "md:p-8", "hover:bg-[#151515]", "transition-all", "group", "h-full", "flex", "flex-col", "items-center", "text-center"], [1, "mb-3", "md:mb-6", "w-10", "h-10", "md:w-12", "md:h-12", "rounded-lg", "bg-indigo-500/10", "flex", "items-center", "justify-center", "text-indigo-400", "group-hover:scale-110", "transition-transform"], [1, "text-sm", "md:text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2", "md:mb-3", "font-heading", "leading-tight"], [1, "text-gray-600", "dark:text-gray-400", "leading-relaxed", "text-xs", "md:text-sm", "font-body", "grow"], [1, "text-sm", "md:text-lg", "font-bold", "text-gray-900", "dark:text-white", "mb-1", "md:mb-2", "leading-tight"], [1, "text-xs", "md:text-sm", "text-gray-600", "dark:text-gray-400", "mb-3", "md:mb-4", "leading-relaxed"], [1, "flex", "flex-wrap", "justify-center", "gap-1", "md:gap-2", "mt-auto"], [1, "text-[10px]", "md:text-xs", "bg-gray-200", "dark:bg-white/10", "px-1.5", "py-0.5", "md:px-2", "md:py-1", "rounded", "text-gray-700", "dark:text-gray-300", "font-mono"], [1, "flex", "flex-col", "lg:flex-row", "gap-3", "md:gap-6", "items-center", "lg:items-start", "p-4", "md:p-8", "rounded-2xl", "glass-panel", "hover:bg-white/10", "transition-colors", "text-center", "lg:text-left", "h-full"], [1, "flex", "flex-col", "items-center", "gap-2", "shrink-0"], [1, "text-xl", "md:text-3xl", "font-black", "text-transparent", "bg-clip-text", "bg-linear-to-b", "from-blue-400", "to-blue-600", "font-mono"], [1, "hidden", "lg:block", "h-12", "w-px", "bg-blue-500/30"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-3", "mb-2", "justify-center", "lg:justify-start"], [1, "text-sm", "md:text-xl", "font-bold", "font-heading", "text-gray-900", "dark:text-white", "leading-tight"], [1, "text-gray-600", "dark:text-gray-400", "font-body", "text-xs", "md:text-base", "leading-relaxed", "line-clamp-4", "lg:line-clamp-none"], [1, "text-4xl", "lg:text-5xl", "font-extrabold", "text-gradient-blue", "mb-2", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "font-mono", "text-xs", "uppercase", "tracking-widest"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-xs", "text-gray-600", "dark:text-gray-400", "hidden", "lg:block"], [1, "fas", "fa-check", "text-green-300"]], template: function PublicHomePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PublicHomePage_ng_container_0_Template, 106, 15, "ng-container", 1);
      \u0275\u0275pipe(1, "async");
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(1, 1, ctx.content$));
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    RouterModule,
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    AsyncPipe
  ], styles: ["\n\n.tech-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 2rem;\n}\n/*# sourceMappingURL=public-home-page.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicHomePage, [{
    type: Component,
    args: [{ selector: "app-public-home-page", standalone: true, imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      NgOptimizedImage
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<ng-container *ngIf="content$ | async as content">\r
\r
  <!-- 1. HERO SECTION: Premium Dark Gradient -->\r
  <section class="relative min-h-[90vh] flex items-center pt-24 pb-32 lg:pb-48 overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">\r
      <!-- Background Effects -->\r
      <div class="absolute inset-0 z-0">\r
          <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>\r
          <div class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px]"></div>\r
          <div class="absolute inset-0 bg-[url('assets/img/pattern-grid.svg')] opacity-[0.03]"></div>\r
      </div>\r
\r
      <div class="container mx-auto px-4 relative z-30">\r
          <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">\r
              <!-- Text Content -->\r
              <div class="lg:w-1/2 text-center lg:text-left">\r
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8">\r
                      <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>\r
                      <span class="text-xs font-mono text-gray-300 tracking-wider uppercase">Open to New Projects</span>\r
                  </div>\r
                  \r
                  <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-gradient">\r
                      {{ content.hero.title }}\r
                  </h1>\r
                  \r
                  <p class="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light font-body">\r
                      {{ content.hero.subtitle }}\r
                  </p>\r
                  \r
                  <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">\r
                      <a routerLink="/contacto" \r
                          class="px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer">\r
                          {{ content.hero.ctaPrimary }}\r
                      </a>\r
                      <a routerLink="/portfolio"\r
                          class="px-8 py-4 glass-panel text-gray-900 dark:text-white rounded-lg font-medium text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center flex items-center justify-center cursor-pointer">\r
                          {{ content.hero.ctaSecondary }}\r
                      </a>\r
                  </div>\r
              </div>\r
\r
              <!-- Visual/Art -->\r
              <div class="lg:w-1/2 relative hidden lg:block animate-float">\r
                  <div class="relative z-10 glass-card p-2 rounded-2xl transform rotate-1 hover:rotate-0 transition-duration-500 w-full">\r
                    <div class="relative w-full aspect-video rounded-xl overflow-hidden">\r
                        <img ngSrc="assets/img/services/software-illustration.png" alt="Dashboard Preview" class="object-cover" fill priority>\r
                    </div>\r
                    \r
                     <!-- Code Snippet Decor -->\r
                    <div class="absolute -bottom-10 -left-10 bg-[#1e1e1e] p-4 rounded-lg border border-gray-700 shadow-xl hidden md:block">\r
                        <div class="flex gap-2 mb-2">\r
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>\r
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>\r
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>\r
                        </div>\r
                        <div class="font-mono text-xs text-green-400">\r
                            > git push origin production<br>\r
                            <span class="text-white">Build success... \u{1F680}</span>\r
                        </div>\r
                    </div>\r
                  </div>\r
              </div>\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 2. BUSINESS PILLARS (Cards) -->\r
  <section class="py-20 bg-white dark:bg-black text-gray-900 dark:text-white relative z-20 transition-colors duration-300">\r
      <div class="container mx-auto px-4 -mt-20 lg:-mt-32">\r
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
              <h2 class="sr-only">Nuestros Pilares de Negocio</h2>\r
              @for(pillar of content.businessPillars.items; track pillar.title) {\r
                  <div class="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:border-blue-500/50 flex flex-col h-full">\r
                      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">\r
                          <i [class]="pillar.icon + ' text-9xl'"></i>\r
                      </div>\r
                      \r
                      <!-- Image Section if available -->\r
                      @if (pillar.image) {\r
                        <div class="relative h-48 overflow-hidden">\r
                            <img [ngSrc]="pillar.image" [alt]="pillar.title" class="object-cover transform group-hover:scale-110 transition-transform duration-700" fill sizes="(max-width: 768px) 100vw, 50vw">\r
                            <div class="absolute inset-0 bg-linear-to-t from-white dark:from-[#1a1a1a] to-transparent opacity-80"></div>\r
                        </div>\r
                      }\r
\r
                      <div class="relative z-10 p-8 pt-4 flex flex-col text-left grow">\r
                          <div [class]="'w-14 h-14 rounded-xl flex items-center justify-center mb-6 ' + (pillar.colorClass === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400')">\r
                              <i [class]="pillar.icon + ' text-2xl'"></i>\r
                          </div>\r
                          \r
                          <h3 class="text-2xl font-bold mb-3 font-heading text-gray-900 dark:text-white">{{ pillar.title }}</h3>\r
                          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed grow font-body">{{ pillar.description }}</p>\r
                          \r
                          <a [routerLink]="pillar.link" class="inline-flex items-center gap-2 font-bold text-sm tracking-wide uppercase hover:text-blue-600 dark:hover:text-white transition-colors text-gray-700 dark:text-gray-300 mt-auto">\r
                              {{ pillar.cta }} <i class="fas fa-arrow-right"></i>\r
                          </a>\r
                      </div>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 3. SERVICES GRID -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300" #servicesSection>\r
      <div class="container mx-auto px-4">\r
          <div class="text-center max-w-3xl mx-auto mb-20">\r
              <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-heading">{{ content.services.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400 text-lg font-body">{{ content.services.subtitle }}</p>\r
          </div>\r
\r
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">\r
              @for(service of content.services.items; track service.title; let last = $last) {\r
                  <div class="glass-card rounded-xl p-4 md:p-8 hover:bg-[#151515] transition-all group h-full flex flex-col items-center text-center"\r
                       [class.col-span-2]="last" [class.lg:col-span-1]="last">\r
                      <div class="mb-3 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">\r
                          <i [class]="service.icon + ' text-lg md:text-xl'"></i>\r
                      </div>\r
                      <h3 class="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 font-heading leading-tight">{{ service.title }}</h3>\r
                      <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-xs md:text-sm font-body grow">{{ service.description }}</p>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
  \r
    <!-- 4. TECH STACK -->\r
  <section class="py-20 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 transition-colors duration-300">\r
      <div class="container mx-auto px-4 text-center">\r
           <div class="text-center mb-12">\r
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white font-heading">{{ content.techServices.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ content.techServices.subtitle }}</p>\r
           </div>\r
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">\r
              @for(item of content.techServices.items; track item.title) {\r
                <div class="glass-panel p-3 md:p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors h-full">\r
                    <!-- Icon always at top -->\r
                    <i [class]="item.icon + ' text-2xl md:text-4xl mb-2 md:mb-3 text-gradient block mx-auto'"></i>\r
                    <h3 class="text-sm md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2 leading-tight">{{ item.title }}</h3>\r
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">{{ item.description }}</p>\r
                    <div class="flex flex-wrap justify-center gap-1 md:gap-2 mt-auto">\r
                         @for(feat of item.features; track feat) {\r
                             <span class="text-[10px] md:text-xs bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-gray-700 dark:text-gray-300 font-mono">{{ feat }}</span>\r
                         }\r
                    </div>\r
                </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
\r
  <!-- 5. METHODOLOGY (Timeline) -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
          <div class="flex flex-col lg:flex-row gap-16 items-start">\r
              <div class="lg:w-1/3 sticky top-24">\r
                  <h2 class="text-4xl lg:text-5xl font-bold mb-6 font-heading text-gray-900 dark:text-white">{{ content.methodology.title }}</h2>\r
                  <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 font-body">{{ content.methodology.description }}</p>\r
                  <a routerLink="/contacto" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors inline-block">\r
                    Start a Project\r
                   </a>\r
              </div>\r
              \r
              <div class="lg:w-2/3 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-6">\r
                  @for(step of content.methodology.steps; track step.number; let last = $last) {\r
                      <div class="flex flex-col lg:flex-row gap-3 md:gap-6 items-center lg:items-start p-4 md:p-8 rounded-2xl glass-panel hover:bg-white/10 transition-colors text-center lg:text-left h-full"\r
                           [class.col-span-2]="last" [class.lg:col-span-1]="last">\r
                          <div class="flex flex-col items-center gap-2 shrink-0">\r
                             <span class="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-600 font-mono">{{ step.number }}</span>\r
                             <div class="hidden lg:block h-12 w-px bg-blue-500/30"></div>\r
                          </div>\r
                          <div>\r
                              <div class="flex flex-col lg:flex-row items-center gap-3 mb-2 justify-center lg:justify-start">\r
                                <i [class]="step.icon + ' text-blue-400 text-lg md:text-xl lg:hidden'"></i>\r
                                <h3 class="text-sm md:text-xl font-bold font-heading text-gray-900 dark:text-white leading-tight">{{ step.title }}</h3>\r
                              </div>\r
                              <p class="text-gray-600 dark:text-gray-400 font-body text-xs md:text-base leading-relaxed line-clamp-4 lg:line-clamp-none">{{ step.description }}</p>\r
                          </div>\r
                      </div>\r
                  }\r
              </div>\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 6. METRICS -->\r
  <section class="py-16 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 text-center transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">\r
              @for(metric of content.metrics.items; track metric.label) {\r
                  <div class="p-4">\r
                      <h2 class="text-4xl lg:text-5xl font-extrabold text-gradient-blue mb-2 font-heading">\r
                          {{ metric.value }}\r
                      </h2>\r
                      <p class="text-gray-600 dark:text-gray-400 font-mono text-xs uppercase tracking-widest">{{ metric.label }}</p>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 7. INDUSTRIES -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
           <div class="text-center mb-16">\r
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-heading">{{ content.industries.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400">{{ content.industries.subtitle }}</p>\r
           </div>\r
           <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
               @for(industry of content.industries.items; track industry.title) {\r
                   <div class="aspect-square rounded-2xl glass-card flex flex-col items-center justify-center p-6 text-center group cursor-default hover:border-green-500/30">\r
                       <i [class]="industry.icon + ' text-4xl mb-4 text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300'"></i>\r
                       <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ industry.title }}</h3>\r
                       <p class="text-xs text-gray-600 dark:text-gray-400 hidden lg:block">{{ industry.description }}</p>\r
                   </div>\r
               }\r
           </div>\r
      </div>\r
  </section>\r
\r
  <!-- 8. REMOTE WORK CTA -->\r
  <section class="py-24 relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-950 to-black">\r
      <div class="absolute inset-0 bg-[url('assets/img/pattern-grid.svg')] opacity-10"></div>\r
      <div class="container mx-auto px-4 relative z-10 text-center text-white">\r
          <span class="inline-block py-1 px-3 rounded glass-panel text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">Global Reach</span>\r
          <h2 class="text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto font-heading">{{ content.remoteWork.title }}</h2>\r
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-body">{{ content.remoteWork.description }}</p>\r
          \r
          <div class="flex flex-wrap justify-center gap-4 mb-10">\r
               @for(benefit of content.remoteWork.benefits; track benefit) {\r
                   <span class="flex items-center gap-2 bg-blue-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30 text-sm">\r
                       <i class="fas fa-check text-green-300"></i> {{ benefit }}\r
                   </span>\r
               }\r
          </div>\r
          \r
          <a routerLink="/contacto" class="inline-block bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors cursor-pointer">\r
              {{ content.remoteWork.cta }}\r
          </a>\r
      </div>\r
  </section>\r
\r
  <!-- 9. CONTACT FORM REDUNDANT REMOVED -->\r
\r
</ng-container>`, styles: ["/* angular:styles/component:css;3167dbd93cee805afea3b23b70cec91ac9e8f04e5e32d620633123319ffe9cbc;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/home/public-home-page.ts */\n.tech-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 2rem;\n}\n/*# sourceMappingURL=public-home-page.css.map */\n"] }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicHomePage, { className: "PublicHomePage", filePath: "src/app/public/home/public-home-page.ts", lineNumber: 34 });
})();

// src/app/public/public.routes.ts
var publicRoutes = [
  {
    title: "Inicio - IT Consultoria y Soluciones - Arecofix",
    path: "",
    component: PublicLayout,
    children: [
      {
        title: "Inicio - IT Consultoria y Soluciones - Arecofix",
        path: "",
        component: PublicHomePage,
        data: {
          seo: {
            title: "Soluciones de Software & Consultor\xEDa IT",
            description: "Expertos en desarrollo de software a medida, aplicaciones m\xF3viles y transformaci\xF3n digital. Consultor\xEDa IT y servicio t\xE9cnico especializado en Marcos Paz.",
            imageUrl: "assets/img/branding/og-services.jpg"
          }
        }
      },
      __spreadValues({
        title: "Reparaci\xF3n de Celulares en Marcos Paz | Servicio T\xE9cnico Arecofix",
        path: "celular",
        loadComponent: () => import("./chunk-IITQO4F2.mjs").then((m) => m.CelularLandingComponent),
        data: {
          seo: {
            title: "Reparaci\xF3n de Celulares en Marcos Paz | Servicio T\xE9cnico Arecofix",
            description: "Arreglo de pantallas, bater\xEDas y pines de carga en el acto. Calidad garantizada en Marcos Paz.",
            imageUrl: "assets/img/branding/og-celulares.jpg",
            keywords: "reparacion de celulares marcos paz, servicio tecnico celulares, arreglo de pantallas, cambio de bateria, arecofix",
            schema: {
              "@context": "https://schema.org",
              "@type": "MobilePhoneRepair",
              "@id": "https://arecofix.com.ar",
              "name": "Arecofix Servicio T\xE9cnico",
              "image": "https://arecofix.com.ar/assets/img/branding/logo/logo-normal1.PNG",
              "description": "Servicio t\xE9cnico especializado en reparaci\xF3n de celulares en Marcos Paz. Cursos de reparaci\xF3n.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jorge Newbery 69",
                "addressLocality": "Marcos Paz",
                "addressRegion": "Buenos Aires",
                "postalCode": "1727",
                "addressCountry": "AR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -34.767191,
                "longitude": -58.817973
              },
              "url": "https://www.arecofix.com.ar/celular",
              "telephone": "+5491125960900",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "19:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "09:00",
                  "closes": "13:00"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "120"
              }
            }
          }
        }
      }, true ? { \u0275entryName: "src/app/public/landing/celular/celular-landing.component.ts" } : {}),
      __spreadValues({
        title: "Categories",
        path: "categories",
        loadChildren: () => import("./chunk-IO5F7HZE.mjs")
      }, true ? { \u0275entryName: "src/app/public/categories/categories.routes.ts" } : {}),
      __spreadValues({
        title: "Productos",
        path: "productos",
        loadChildren: () => import("./chunk-LCYIQF4K.mjs")
      }, true ? { \u0275entryName: "src/app/public/products/products.routes.ts" } : {}),
      __spreadValues({
        title: "Repuestos",
        path: "repuestos",
        loadComponent: () => import("./chunk-ETPVJCRW.mjs").then((m) => m.RepuestosComponent)
      }, true ? { \u0275entryName: "src/app/public/repuestos/repuestos.ts" } : {}),
      __spreadValues({
        title: "Login",
        path: "login",
        loadComponent: () => import("./chunk-6M2JM5KC.mjs").then((m) => m.LoginComponent)
      }, true ? { \u0275entryName: "src/app/public/auth/login/login.component.ts" } : {}),
      __spreadValues({
        title: "Register",
        path: "register",
        loadComponent: () => import("./chunk-S5ZP742B.mjs").then((m) => m.RegisterComponent)
      }, true ? { \u0275entryName: "src/app/public/auth/register/register.component.ts" } : {}),
      __spreadValues({
        title: "Perfil",
        path: "perfil",
        loadComponent: () => import("./chunk-UCJV7PRR.mjs").then((m) => m.ProfileComponent)
      }, true ? { \u0275entryName: "src/app/public/profile/profile.component.ts" } : {}),
      __spreadValues({
        title: "GSM",
        path: "gsm",
        loadChildren: () => import("./chunk-PP6PMYVN.mjs").then((m) => m.gsmRoutes)
      }, true ? { \u0275entryName: "src/app/public/gsm/gsm.routes.ts" } : {}),
      __spreadValues({
        title: "Portfolio - Ezequiel Enrico Areco | Fullstack Engineer",
        path: "portfolio",
        loadComponent: () => import("./chunk-J4SAEAPK.mjs").then((m) => m.PortfolioComponent),
        data: {
          seo: {
            title: "Ezequiel Enrico Areco - Senior Backend & Fullstack Engineer | Portfolio",
            description: "Arquitecto de Soluciones Escalables & Ingeniero de Software. Experto en Node.js, Cloud, Clean Architecture y sistemas de alto rendimiento.",
            imageUrl: "assets/img/branding/logo/Logo (2).png",
            keywords: "software engineer, backend developer, clean architecture, node.js, cloud architect, ezequiel enrico areco, fullstack developer",
            type: "profile",
            schema: {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ezequiel Enrico Areco",
              "jobTitle": "Senior Backend & Fullstack Engineer",
              "url": "https://arecofix.com.ar/portfolio",
              "image": "https://arecofix.com.ar/assets/img/branding/logo/Logo (2).png",
              "sameAs": [
                "https://www.linkedin.com/in/ezequiel-enrico/",
                "https://github.com/arecofix"
              ],
              "knowsAbout": ["Node.js", "Angular", "Cloud Architecture", "System Design", "Supabase", "Docker", "Clean Architecture"],
              "worksFor": {
                "@type": "Organization",
                "name": "Arecofix"
              }
            }
          }
        }
      }, true ? { \u0275entryName: "src/app/public/portfolio/portfolio.ts" } : {}),
      __spreadValues({
        title: "Nosotros",
        path: "nosotros",
        loadComponent: () => import("./chunk-OEXW26AB.mjs").then((m) => m.NosotrosComponent),
        data: {
          seo: {
            title: "Sobre Nosotros | Arecofix - Innovaci\xF3n y Compromiso",
            description: "Conoc\xE9 al equipo detr\xE1s de Arecofix. Somos expertos en tecnolog\xEDa comprometidos con brindar soluciones de calidad en Marcos Paz.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG",
            type: "article"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/nosotros/nosotros.ts" } : {}),
      __spreadValues({
        title: "Contacto",
        path: "contacto",
        loadComponent: () => import("./chunk-2BAQNDDJ.mjs").then((m) => m.ContactoComponent),
        data: {
          seo: {
            title: "Contacto | Arecofix - Estamos para Ayudarte",
            description: "\xBFTen\xE9s alguna consulta o necesit\xE1s soporte t\xE9cnico? Cont\xE1ctanos por WhatsApp, Email o visitanos en nuestro local.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/contacto/contacto.ts" } : {}),
      __spreadValues({
        title: "Servicios",
        path: "servicios",
        loadComponent: () => import("./chunk-PPUZQK5X.mjs").then((m) => m.ServiciosComponent),
        data: {
          seo: {
            title: "Servicios de Tecnolog\xEDa y Reparaci\xF3n | Arecofix",
            description: "Soluciones integrales: Reparaci\xF3n de Celulares, Desarrollo de Software, C\xE1maras de Seguridad y Soporte IT para empresas.",
            imageUrl: "assets/img/branding/og-services.jpg",
            keywords: "servicios informaticos, reparacion celulares, desarrollo software, soporte it, camaras seguridad"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/servicios/servicios.ts" } : {}),
      __spreadValues({
        title: "Detalle de Servicio",
        path: "servicios/:slug",
        loadComponent: () => import("./chunk-VVX2U6DP.mjs").then((m) => m.ServiceDetailComponent)
      }, true ? { \u0275entryName: "src/app/public/servicios/pages/detail/service-detail.component.ts" } : {}),
      __spreadValues({
        title: "Academy",
        path: "academy",
        loadComponent: () => import("./chunk-LMUB2NEU.mjs").then((m) => m.CursosComponent),
        data: {
          seo: {
            title: "Arecofix Academy | Cursos de Tecnolog\xEDa",
            description: "Aprend\xE9 reparaci\xF3n de celulares, programaci\xF3n y m\xE1s con nuestros cursos presenciales y online.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG",
            type: "website"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/cursos/cursos.ts" } : {}),
      __spreadValues({
        title: "Detalle del Curso",
        path: "academy/:slug",
        loadComponent: () => import("./chunk-VMWKRS57.mjs").then((m) => m.CourseDetailComponent)
      }, true ? { \u0275entryName: "src/app/public/cursos/course-detail/course-detail.component.ts" } : {}),
      __spreadValues({
        title: "Checkout",
        path: "checkout",
        loadComponent: () => import("./chunk-6JLQW6M7.mjs").then((m) => m.CheckoutPage)
      }, true ? { \u0275entryName: "src/app/public/checkout/checkout-page.ts" } : {}),
      {
        path: "posts/servicio-tecnico-de-celulares-en-marcos-paz",
        redirectTo: "celular",
        pathMatch: "full"
      },
      __spreadValues({
        title: "Blog Post",
        path: "posts/:slug",
        loadComponent: () => import("./chunk-ICAZPVJM.mjs").then((m) => m.PostPage)
      }, true ? { \u0275entryName: "src/app/public/posts/post-page.ts" } : {}),
      __spreadValues({
        title: "Seguimiento de Reparaci\xF3n",
        path: "tracking/:code",
        loadComponent: () => import("./chunk-IIJKBAIT.mjs").then((m) => m.TrackingPage),
        data: {
          seo: {
            title: "Seguimiento de Reparaci\xF3n | Arecofix",
            description: "Consult\xE1 el estado de tu reparaci\xF3n en tiempo real con tu c\xF3digo de seguimiento.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/tracking/tracking-page.ts" } : {}),
      __spreadValues({
        title: "Pol\xEDtica de Privacidad",
        path: "privacy",
        loadComponent: () => import("./chunk-72VWDOFU.mjs").then((m) => m.PrivacyComponent),
        data: {
          seo: {
            title: "Pol\xEDtica de Privacidad | Arecofix",
            description: "Conoc\xE9 c\xF3mo protegemos tus datos y tu privacidad en Arecofix.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/privacy/privacy.component.ts" } : {}),
      __spreadValues({
        title: "T\xE9rminos y Condiciones",
        path: "terms",
        loadComponent: () => import("./chunk-EF5L5JYR.mjs").then((m) => m.TermsComponent),
        data: {
          seo: {
            title: "T\xE9rminos y Condiciones | Arecofix",
            description: "T\xE9rminos y condiciones de uso de nuestros servicios y sitio web.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/terms/terms.component.ts" } : {}),
      __spreadValues({
        title: "Blog",
        path: "blog",
        loadComponent: () => import("./chunk-3Y43ETWO.mjs").then((m) => m.BlogComponent),
        data: {
          seo: {
            title: "Blog de Tecnolog\xEDa | Arecofix",
            description: "Noticias, gu\xEDas y tutoriales sobre tecnolog\xEDa, reparaciones y desarrollo de software.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG",
            type: "website"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/blog/blog.component.ts" } : {}),
      __spreadValues({
        title: "Mapa del Sitio",
        path: "sitemap",
        loadComponent: () => import("./chunk-NH6KBYB2.mjs").then((m) => m.SitemapComponent)
      }, true ? { \u0275entryName: "src/app/public/sitemap/sitemap.component.ts" } : {}),
      __spreadValues({
        title: "FixT\xE9cnicos",
        path: "fixtecnicos",
        loadComponent: () => import("./chunk-IINYHCK7.mjs").then((m) => m.FixtecnicosComponent),
        data: {
          seo: {
            title: "Comunidad FixT\xE9cnicos | Arecofix",
            description: "Recursos y herramientas exclusivas para t\xE9cnicos reparadores.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/fixtecnicos/fixtecnicos.component.ts" } : {}),
      __spreadValues({
        title: "Centro de Recursos",
        path: "recursos",
        loadComponent: () => import("./chunk-UWWNTPZP.mjs").then((m) => m.RecursosComponent),
        data: {
          seo: {
            title: "Centro de Recursos | Arecofix",
            description: "Descargas, drivers y manuales para reparaciones y software.",
            imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
          }
        }
      }, true ? { \u0275entryName: "src/app/public/recursos/recursos.component.ts" } : {})
    ]
  }
];
var public_routes_default = publicRoutes;
export {
  public_routes_default as default,
  publicRoutes
};
//# sourceMappingURL=chunk-PQTLWDVF.mjs.map
