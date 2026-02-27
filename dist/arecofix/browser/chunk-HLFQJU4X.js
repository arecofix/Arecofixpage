import {
  PaginationService
} from "./chunk-TSFVBXON.js";
import {
  Pagination
} from "./chunk-W43WNFKI.js";
import {
  IsErrorComponent
} from "./chunk-MB7OW326.js";
import {
  rxResource
} from "./chunk-OXRRQGKG.js";
import {
  ProductCard
} from "./chunk-PAHDEXUL.js";
import "./chunk-XYL2VWIS.js";
import {
  ProductService
} from "./chunk-2X54MGFE.js";
import {
  CartService
} from "./chunk-E27AYZUW.js";
import "./chunk-CM6ZIEXS.js";
import "./chunk-NOSGPON2.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-ODRBL5CU.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule
} from "./chunk-CP6GQXNM.js";
import {
  CommonModule,
  CurrencyPipe
} from "./chunk-F32QBW3I.js";
import {
  ChangeDetectionStrategy,
  Component,
  Subject,
  combineLatest,
  computed,
  debounceTime,
  distinctUntilChanged,
  inject,
  map,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DPJFS6PI.js";
import {
  __objRest
} from "./chunk-46DXP6YY.js";

// src/app/public/products/pages/featured/products-featured-page.ts
var _c0 = () => [1, 2, 3, 4, 5, 6, 7, 8];
var _forTrack0 = ($index, $item) => $item.id;
function ProductsFeaturedPage_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1, " Encontramos ");
    \u0275\u0275elementStart(2, "span", 37);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " joyas para vos ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items);
  }
}
function ProductsFeaturedPage_Conditional_34_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 38);
  }
}
function ProductsFeaturedPage_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275repeaterCreate(1, ProductsFeaturedPage_Conditional_34_For_2_Template, 1, 0, "div", 38, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function ProductsFeaturedPage_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error", 25);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ((tmp_1_0 = ctx_r0.productsRs.error()) == null ? null : tmp_1_0.message) || "Error cargando destacados");
  }
}
function ProductsFeaturedPage_Conditional_36_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "h3", 40);
    \u0275\u0275text(2, "No hay destacados por ahora");
    \u0275\u0275elementEnd()();
  }
}
function ProductsFeaturedPage_Conditional_36_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_88_r3 = \u0275\u0275nextContext().$index;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" #", \u0275$index_88_r3 + 1, " ");
  }
}
function ProductsFeaturedPage_Conditional_36_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275conditionalCreate(1, ProductsFeaturedPage_Conditional_36_Conditional_1_For_2_Conditional_1_Template, 2, 1, "div", 43);
    \u0275\u0275elementStart(2, "product-card", 44);
    \u0275\u0275listener("quickView", function ProductsFeaturedPage_Conditional_36_Conditional_1_For_2_Template_product_card_quickView_2_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openQuickView($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    const \u0275$index_88_r3 = ctx.$index;
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_88_r3 < 3 ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("product", product_r4)("isPriority", \u0275$index_88_r3 < 4);
  }
}
function ProductsFeaturedPage_Conditional_36_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "pagination", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx.pages)("currentPage", ctx_r0.paginationService.currentPage());
  }
}
function ProductsFeaturedPage_Conditional_36_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275repeaterCreate(1, ProductsFeaturedPage_Conditional_36_Conditional_1_For_2_Template, 3, 3, "div", 41, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ProductsFeaturedPage_Conditional_36_Conditional_1_Conditional_3_Template, 2, 2, "div", 42);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.productsRs.value().data);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r0.paginationData()) ? 3 : -1, tmp_3_0);
  }
}
function ProductsFeaturedPage_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProductsFeaturedPage_Conditional_36_Conditional_0_Template, 3, 0, "div", 39)(1, ProductsFeaturedPage_Conditional_36_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items) === 0 ? 0 : 1);
  }
}
function ProductsFeaturedPage_Conditional_64_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "Sin Stock");
    \u0275\u0275elementEnd();
  }
}
function ProductsFeaturedPage_Conditional_64_Conditional_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, p_r7.regular_price));
  }
}
function ProductsFeaturedPage_Conditional_64_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48)(1, "div", 51);
    \u0275\u0275element(2, "img", 52);
    \u0275\u0275conditionalCreate(3, ProductsFeaturedPage_Conditional_64_Conditional_4_Conditional_3_Template, 2, 0, "span", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 54)(5, "div", 55)(6, "h3", 56);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 57)(9, "span", 58);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, ProductsFeaturedPage_Conditional_64_Conditional_4_Conditional_12_Template, 3, 3, "span", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 60);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 61);
    \u0275\u0275listener("click", function ProductsFeaturedPage_Conditional_64_Conditional_4_Template_button_click_15_listener() {
      const p_r7 = \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.addToCart(p_r7));
    });
    \u0275\u0275element(16, "i", 62);
    \u0275\u0275text(17, " Agregar al Carrito ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r7 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", p_r7.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", p_r7.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r7.stock !== void 0 && p_r7.stock <= 0 ? 3 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r7.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 7, p_r7.price));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r7.regular_price && p_r7.regular_price > p_r7.price ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r7.description || "Sin descripci\xF3n disponible.");
  }
}
function ProductsFeaturedPage_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 46)(2, "button", 47);
    \u0275\u0275listener("click", function ProductsFeaturedPage_Conditional_64_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProductsFeaturedPage_Conditional_64_Conditional_4_Template, 18, 9, "div", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 49)(6, "button", 50);
    \u0275\u0275listener("click", function ProductsFeaturedPage_Conditional_64_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.quickViewProduct()) ? 4 : -1, tmp_1_0);
  }
}
var ProductsFeaturedPage = class _ProductsFeaturedPage {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  cartService = inject(CartService);
  router = inject(Router);
  // Search Signal and Subject
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  searchSubject = new Subject();
  // Quick View
  isQuickViewOpen = signal(false, ...ngDevMode ? [{ debugName: "isQuickViewOpen" }] : []);
  quickViewProduct = signal(null, ...ngDevMode ? [{ debugName: "quickViewProduct" }] : []);
  constructor() {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((q) => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }
  updateQueryParams(newParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: "merge"
    });
  }
  onSearch(value) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }
  openQuickView(product) {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }
  closeQuickView() {
    this.isQuickViewOpen.set(false);
    this.quickViewProduct.set(null);
  }
  addToCart(product) {
    this.cartService.addToCart(product);
    this.closeQuickView();
  }
  productsRs = rxResource({
    stream: () => combineLatest([
      this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
      this.route.queryParams
    ]).pipe(switchMap(([slug, params]) => {
      const currentPage = +params["_page"] || 1;
      const q = params["q"] || void 0;
      if (this.searchQuery() !== (q || ""))
        this.searchQuery.set(q || "");
      return this.productService.getData({
        featured: true,
        // Filtrar productos destacados
        _page: currentPage,
        q
      });
    }))
  });
  // Computed para extraer datos de paginación de forma reactiva
  paginationData = computed(() => {
    const data = this.productsRs.value();
    if (!data)
      return null;
    const _a = data, { data: products } = _a, pagination = __objRest(_a, ["data"]);
    return pagination;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  static \u0275fac = function ProductsFeaturedPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductsFeaturedPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsFeaturedPage, selectors: [["products-featured-page"]], decls: 65, vars: 4, consts: [[1, "relative", "bg-gray-900", "text-white", "overflow-hidden", "isolate"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-purple-900", "via-indigo-900", "to-blue-900", "opacity-90"], [1, "absolute", "inset-x-0", "bottom-0", "h-48", "bg-linear-to-t", "from-gray-50", "dark:from-gray-900", "to-transparent"], [1, "absolute", "top-0", "left-1/4", "w-96", "h-96", "bg-purple-500", "rounded-full", "mix-blend-screen", "filter", "blur-3xl", "opacity-20", "animate-pulse"], [1, "absolute", "bottom-1/4", "right-1/4", "w-96", "h-96", "bg-pink-500", "rounded-full", "mix-blend-screen", "filter", "blur-3xl", "opacity-20", "animate-pulse", "animation-delay-2000"], [1, "relative", "container", "mx-auto", "px-4", "py-20", "text-center"], [1, "text-sm", "breadcrumbs", "text-purple-200", "justify-center", "mb-6", "flex"], ["routerLink", "/", 1, "hover:text-white", "transition-colors"], ["routerLink", "/products", 1, "hover:text-white", "transition-colors"], [1, "font-semibold", "text-white"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-yellow-500/20", "text-yellow-300", "text-sm", "font-bold", "mb-4", "border", "border-yellow-500/30", "backdrop-blur-sm"], [1, "fas", "fa-star", "mr-2"], [1, "text-4xl", "md:text-6xl", "font-black", "mb-6", "tracking-tight", "text-white", "drop-shadow-lg"], [1, "text-xl", "text-purple-100", "max-w-2xl", "mx-auto", "mb-10", "font-light", "leading-relaxed"], [1, "max-w-xl", "mx-auto", "relative", "group"], [1, "absolute", "-inset-0.5", "bg-linear-to-r", "from-pink-500", "to-purple-600", "rounded-full", "blur", "opacity-50", "group-hover:opacity-100", "transition", "duration-200"], [1, "relative", "flex", "items-center", "bg-white", "dark:bg-gray-800", "rounded-full", "shadow-2xl"], ["type", "text", "placeholder", "Buscar en destacados...", 1, "w-full", "bg-transparent", "border-none", "text-gray-900", "dark:text-white", "placeholder-gray-400", "px-6", "py-4", "focus:ring-0", "text-lg", "rounded-full", 3, "ngModelChange", "ngModel"], [1, "mr-2", "p-3", "bg-purple-600", "hover:bg-purple-700", "text-white", "rounded-full", "transition-colors"], [1, "fas", "fa-arrow-right"], [1, "min-h-screen", "bg-gray-50", "dark:bg-gray-900", "py-12"], [1, "container", "mx-auto", "px-4"], [1, "flex", "justify-between", "items-center", "mb-8", "px-2"], [1, "text-gray-500", "dark:text-gray-400"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-8"], [3, "message"], [1, "py-16", "bg-white", "dark:bg-gray-800", "border-t", "border-gray-100", "dark:border-gray-700"], [1, "max-w-7xl", "mx-auto", "px-4"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-8", "text-center", "text-gray-700", "dark:text-gray-300"], [1, "p-6", "rounded-2xl", "bg-gray-50", "dark:bg-gray-700/50"], [1, "fas", "fa-star", "text-4xl", "mb-4", "text-yellow-500"], [1, "font-bold", "text-lg", "mb-1"], [1, "text-sm", "opacity-70"], [1, "fas", "fa-box-open", "text-4xl", "mb-4", "text-blue-500"], [1, "fas", "fa-dollar-sign", "text-4xl", "mb-4", "text-green-500"], [1, "fas", "fa-lock", "text-4xl", "mb-4", "text-purple-500"], [1, "modal", "modal-open", "z-50", "animate-fade-in"], [1, "font-bold", "text-gray-900", "dark:text-white"], [1, "aspect-square", "bg-gray-200", "dark:bg-gray-800", "rounded-3xl", "animate-pulse"], [1, "text-center", "py-20"], [1, "text-2xl", "font-bold", "text-gray-400"], [1, "relative", "group"], [1, "mt-16", "flex", "justify-center"], [1, "absolute", "-top-4", "-left-4", "z-10", "w-12", "h-12", "bg-yellow-400", "splat", "shadow-lg", "flex", "items-center", "justify-center", "text-yellow-900", "font-black", "text-xl", "rotate-12", "group-hover:rotate-0", "transition-transform"], [3, "quickView", "product", "isPriority"], [3, "pages", "currentPage"], [1, "modal-box", "relative", "max-w-4xl", "bg-white", "dark:bg-gray-800", "rounded-3xl", "p-0", "overflow-hidden", "shadow-2xl"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-4", "top-4", "z-10", "bg-white/50", "backdrop-blur-md", 3, "click"], [1, "flex", "flex-col", "md:flex-row", "h-full"], ["method", "dialog", 1, "modal-backdrop", "bg-black/50", "backdrop-blur-sm"], [3, "click"], [1, "w-full", "md:w-1/2", "bg-gray-50", "dark:bg-gray-700/30", "p-8", "flex", "items-center", "justify-center", "relative"], [1, "max-h-[300px]", "object-contain", "drop-shadow-xl", 3, "src", "alt"], [1, "absolute", "top-8", "left-8", "badge", "badge-error", "text-white", "font-bold", "p-3"], [1, "w-full", "md:w-1/2", "p-8", "flex", "flex-col"], [1, "mb-auto"], [1, "font-black", "text-2xl", "md:text-3xl", "mb-2", "text-gray-900", "dark:text-white", "leading-tight"], [1, "flex", "items-baseline", "gap-3", "mb-6"], [1, "text-4xl", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "text-lg", "text-gray-400", "line-through"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "leading-relaxed"], [1, "btn", "btn-primary", "btn-lg", "w-full", "rounded-2xl", "shadow-xl", "shadow-indigo-600/30", "gap-3", 3, "click"], [1, "fas", "fa-shopping-cart"]], template: function ProductsFeaturedPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275elementStart(5, "div", 5)(6, "div", 6)(7, "ul")(8, "li")(9, "a", 7);
      \u0275\u0275text(10, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "li")(12, "a", 8);
      \u0275\u0275text(13, "Productos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "li", 9);
      \u0275\u0275text(15, "Destacados");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "span", 10);
      \u0275\u0275element(17, "i", 11);
      \u0275\u0275text(18, " Selecci\xF3n Premium ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "h1", 12);
      \u0275\u0275text(20, " Productos Destacados ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p", 13);
      \u0275\u0275text(22, " Las mejores ofertas, los m\xE1s vendidos y las novedades que no te pod\xE9s perder. Calidad certificada por nuestros expertos. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 14);
      \u0275\u0275element(24, "div", 15);
      \u0275\u0275elementStart(25, "div", 16)(26, "input", 17);
      \u0275\u0275listener("ngModelChange", function ProductsFeaturedPage_Template_input_ngModelChange_26_listener($event) {
        return ctx.onSearch($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "button", 18);
      \u0275\u0275element(28, "i", 19);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(29, "div", 20)(30, "div", 21)(31, "div", 22)(32, "div");
      \u0275\u0275conditionalCreate(33, ProductsFeaturedPage_Conditional_33_Template, 5, 1, "p", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(34, ProductsFeaturedPage_Conditional_34_Template, 3, 1, "div", 24)(35, ProductsFeaturedPage_Conditional_35_Template, 1, 1, "is-error", 25)(36, ProductsFeaturedPage_Conditional_36_Template, 2, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "section", 26)(38, "div", 27)(39, "div", 28)(40, "div", 29);
      \u0275\u0275element(41, "i", 30);
      \u0275\u0275elementStart(42, "h4", 31);
      \u0275\u0275text(43, "Calidad Premium");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p", 32);
      \u0275\u0275text(45, "Solo lo mejor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "div", 29);
      \u0275\u0275element(47, "i", 33);
      \u0275\u0275elementStart(48, "h4", 31);
      \u0275\u0275text(49, "Stock Permanente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "p", 32);
      \u0275\u0275text(51, "Entrega inmediata");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(52, "div", 29);
      \u0275\u0275element(53, "i", 34);
      \u0275\u0275elementStart(54, "h4", 31);
      \u0275\u0275text(55, "Mejor Precio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "p", 32);
      \u0275\u0275text(57, "Garantizado");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "div", 29);
      \u0275\u0275element(59, "i", 35);
      \u0275\u0275elementStart(60, "h4", 31);
      \u0275\u0275text(61, "Compra Segura");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "p", 32);
      \u0275\u0275text(63, "Protecci\xF3n total");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(64, ProductsFeaturedPage_Conditional_64_Template, 8, 1, "div", 36);
    }
    if (rf & 2) {
      \u0275\u0275advance(26);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.productsRs.value() ? 33 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.productsRs.isLoading() ? 34 : ctx.productsRs.error() ? 35 : ctx.productsRs.value() ? 36 : -1);
      \u0275\u0275advance(30);
      \u0275\u0275conditional(ctx.isQuickViewOpen() ? 64 : -1);
    }
  }, dependencies: [
    CommonModule,
    IsErrorComponent,
    ProductCard,
    Pagination,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    RouterModule,
    RouterLink,
    CurrencyPipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsFeaturedPage, [{
    type: Component,
    args: [{ selector: "products-featured-page", standalone: true, imports: [
      CommonModule,
      IsErrorComponent,
      ProductCard,
      Pagination,
      FormsModule,
      RouterModule
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Unique Hero for Featured -->\r
<header class="relative bg-gray-900 text-white overflow-hidden isolate">\r
    <div class="absolute inset-0 bg-linear-to-r from-purple-900 via-indigo-900 to-blue-900 opacity-90"></div>\r
    <div class="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>\r
    \r
    <!-- Orbs -->\r
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>\r
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>\r
\r
    <div class="relative container mx-auto px-4 py-20 text-center">\r
        <!-- Breadcrumbs -->\r
        <div class="text-sm breadcrumbs text-purple-200 justify-center mb-6 flex">\r
            <ul>\r
                <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>\r
                <li><a routerLink="/products" class="hover:text-white transition-colors">Productos</a></li>\r
                <li class="font-semibold text-white">Destacados</li>\r
            </ul>\r
        </div>\r
\r
        <span class="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-bold mb-4 border border-yellow-500/30 backdrop-blur-sm">\r
            <i class="fas fa-star mr-2"></i> Selecci\xF3n Premium\r
        </span>\r
        <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-lg">\r
            Productos Destacados\r
        </h1>\r
        <p class="text-xl text-purple-100 max-w-2xl mx-auto mb-10 font-light leading-relaxed">\r
            Las mejores ofertas, los m\xE1s vendidos y las novedades que no te pod\xE9s perder. Calidad certificada por nuestros expertos.\r
        </p>\r
\r
        <!-- Search with unique style -->\r
        <div class="max-w-xl mx-auto relative group">\r
            <div class="absolute -inset-0.5 bg-linear-to-r from-pink-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200"></div>\r
            <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl">\r
                 <input \r
                    type="text" \r
                    placeholder="Buscar en destacados..." \r
                    [ngModel]="searchQuery()"\r
                    (ngModelChange)="onSearch($event)"\r
                    class="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 px-6 py-4 focus:ring-0 text-lg rounded-full"\r
                 />\r
                 <button class="mr-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">\r
                     <i class="fas fa-arrow-right"></i>\r
                 </button>\r
            </div>\r
        </div>\r
    </div>\r
</header>\r
\r
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">\r
    <div class="container mx-auto px-4">\r
        \r
        <!-- Toolbar -->\r
         <div class="flex justify-between items-center mb-8 px-2">\r
            <div>\r
                 @if (productsRs.value()) {\r
                    <p class="text-gray-500 dark:text-gray-400">\r
                        Encontramos <span class="font-bold text-gray-900 dark:text-white">{{ productsRs.value()?.items }}</span> joyas para vos\r
                    </p>\r
                 }\r
            </div>\r
            <!-- Could add sort here if implemented in TS -->\r
         </div>\r
\r
         <!-- Grid -->\r
        @if (productsRs.isLoading()) {\r
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">\r
                @for(i of [1,2,3,4,5,6,7,8]; track i) {\r
                    <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>\r
                }\r
            </div>\r
        } @else if (productsRs.error()) {\r
             <is-error [message]="productsRs.error()?.message || 'Error cargando destacados'" />\r
        } @else if (productsRs.value()) {\r
            @if (productsRs.value()?.items === 0) {\r
                 <div class="text-center py-20">\r
                    <h3 class="text-2xl font-bold text-gray-400">No hay destacados por ahora</h3>\r
                 </div>\r
            } @else {\r
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">\r
                @for (product of productsRs.value()!.data; track product.id; let i = $index) {\r
                    <!-- Featured Card: Add a visual indicator for ranking -->\r
                    <div class="relative group">\r
                        @if (i < 3) {\r
                            <div class="absolute -top-4 -left-4 z-10 w-12 h-12 bg-yellow-400 splat shadow-lg flex items-center justify-center text-yellow-900 font-black text-xl rotate-12 group-hover:rotate-0 transition-transform">\r
                                #{{i+1}}\r
                            </div>\r
                        }\r
                        <product-card [product]="product" [isPriority]="i < 4" (quickView)="openQuickView($event)"></product-card>\r
                    </div>\r
                }\r
                </div>\r
\r
                @if (paginationData(); as pagination) {\r
                    <div class="mt-16 flex justify-center">\r
                        <pagination [pages]="pagination.pages" [currentPage]="paginationService.currentPage()"></pagination>\r
                    </div>\r
                }\r
            }\r
        }\r
    </div>\r
</div>\r
\r
<!-- Benefits Banner -->\r
<section class="py-16 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">\r
  <div class="max-w-7xl mx-auto px-4">\r
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-700 dark:text-gray-300">\r
      <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50">\r
        <i class="fas fa-star text-4xl mb-4 text-yellow-500"></i>\r
        <h4 class="font-bold text-lg mb-1">Calidad Premium</h4>\r
        <p class="text-sm opacity-70">Solo lo mejor</p>\r
      </div>\r
      <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50">\r
        <i class="fas fa-box-open text-4xl mb-4 text-blue-500"></i>\r
        <h4 class="font-bold text-lg mb-1">Stock Permanente</h4>\r
        <p class="text-sm opacity-70">Entrega inmediata</p>\r
      </div>\r
      <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50">\r
        <i class="fas fa-dollar-sign text-4xl mb-4 text-green-500"></i>\r
        <h4 class="font-bold text-lg mb-1">Mejor Precio</h4>\r
        <p class="text-sm opacity-70">Garantizado</p>\r
      </div>\r
      <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50">\r
        <i class="fas fa-lock text-4xl mb-4 text-purple-500"></i>\r
        <h4 class="font-bold text-lg mb-1">Compra Segura</h4>\r
        <p class="text-sm opacity-70">Protecci\xF3n total</p>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
\r
<!-- Quick View Modal -->\r
@if (isQuickViewOpen()) {\r
<div class="modal modal-open z-50 animate-fade-in">\r
  <div class="modal-box relative max-w-4xl bg-white dark:bg-gray-800 rounded-3xl p-0 overflow-hidden shadow-2xl">\r
    <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white/50 backdrop-blur-md" (click)="closeQuickView()">\u2715</button>\r
    \r
    @if (quickViewProduct(); as p) {\r
        <div class="flex flex-col md:flex-row h-full">\r
            <div class="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700/30 p-8 flex items-center justify-center relative">\r
                <img [src]="p.image_url || 'assets/img/no-image.png'" class="max-h-[300px] object-contain drop-shadow-xl" [alt]="p.name"/>\r
                @if(p.stock !== undefined && p.stock <= 0) {\r
                     <span class="absolute top-8 left-8 badge badge-error text-white font-bold p-3">Sin Stock</span>\r
                }\r
            </div>\r
            \r
            <div class="w-full md:w-1/2 p-8 flex flex-col">\r
                <div class="mb-auto">\r
                    <h3 class="font-black text-2xl md:text-3xl mb-2 text-gray-900 dark:text-white leading-tight">{{ p.name }}</h3>\r
                    <div class="flex items-baseline gap-3 mb-6">\r
                        <span class="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{{ p.price | currency }}</span>\r
                        @if(p.regular_price && p.regular_price > p.price) {\r
                            <span class="text-lg text-gray-400 line-through">{{ p.regular_price | currency }}</span>\r
                        }\r
                    </div>\r
                    \r
                    <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ p.description || 'Sin descripci\xF3n disponible.' }}</p>\r
                </div>\r
                \r
                <button class="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-indigo-600/30 gap-3" (click)="addToCart(p)">\r
                   <i class="fas fa-shopping-cart"></i> Agregar al Carrito\r
                </button>\r
            </div>\r
        </div>\r
    }\r
  </div>\r
  <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">\r
    <button (click)="closeQuickView()">close</button>\r
  </form>\r
</div>\r
}\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsFeaturedPage, { className: "ProductsFeaturedPage", filePath: "src/app/public/products/pages/featured/products-featured-page.ts", lineNumber: 45 });
})();
var products_featured_page_default = ProductsFeaturedPage;
export {
  ProductsFeaturedPage,
  products_featured_page_default as default
};
//# sourceMappingURL=chunk-HLFQJU4X.js.map
