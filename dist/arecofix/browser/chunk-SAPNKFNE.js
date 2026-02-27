import {
  BreadcrumbsComponent
} from "./chunk-LIQI56ZA.js";
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
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
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
  computed,
  debounceTime,
  distinctUntilChanged,
  inject,
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
  ɵɵtextInterpolate
} from "./chunk-DPJFS6PI.js";
import {
  __objRest
} from "./chunk-46DXP6YY.js";

// src/app/public/products/pages/all/products-all-page.ts
var _c0 = () => [1, 2, 3, 4, 5, 6];
var _forTrack0 = ($index, $item) => $item.id;
function ProductsAllPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Mostrando ");
    \u0275\u0275elementStart(1, "span", 74);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " resultados ");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items);
  }
}
function ProductsAllPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando cat\xE1logo... ");
  }
}
function ProductsAllPage_Conditional_44_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 75);
  }
}
function ProductsAllPage_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275repeaterCreate(1, ProductsAllPage_Conditional_44_For_2_Template, 1, 0, "div", 75, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function ProductsAllPage_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error", 34);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ((tmp_1_0 = ctx_r0.productsRs.error()) == null ? null : tmp_1_0.message) || "Error al cargar productos");
  }
}
function ProductsAllPage_Conditional_46_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76)(1, "div", 77);
    \u0275\u0275element(2, "i", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 79);
    \u0275\u0275text(4, "No encontramos lo que buscas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 80);
    \u0275\u0275text(6, " Intenta con otros t\xE9rminos, verifica la ortograf\xEDa o elimina los filtros aplicados. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 81);
    \u0275\u0275listener("click", function ProductsAllPage_Conditional_46_Conditional_0_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.onSearch("");
      ctx_r0.minPriceInput.set(null);
      return \u0275\u0275resetView(ctx_r0.maxPriceInput.set(null));
    });
    \u0275\u0275text(8, " Limpiar b\xFAsqueda ");
    \u0275\u0275elementEnd()();
  }
}
function ProductsAllPage_Conditional_46_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "product-card", 85);
    \u0275\u0275listener("quickView", function ProductsAllPage_Conditional_46_Conditional_1_For_2_Template_product_card_quickView_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openQuickView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    const \u0275$index_113_r5 = ctx.$index;
    \u0275\u0275property("product", product_r4)("isPriority", \u0275$index_113_r5 < 2);
  }
}
function ProductsAllPage_Conditional_46_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 84);
    \u0275\u0275element(1, "pagination", 86);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx.pages)("currentPage", ctx_r0.paginationService.currentPage());
  }
}
function ProductsAllPage_Conditional_46_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275repeaterCreate(1, ProductsAllPage_Conditional_46_Conditional_1_For_2_Template, 1, 2, "product-card", 83, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ProductsAllPage_Conditional_46_Conditional_1_Conditional_3_Template, 2, 2, "div", 84);
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
function ProductsAllPage_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProductsAllPage_Conditional_46_Conditional_0_Template, 9, 0, "div", 76)(1, ProductsAllPage_Conditional_46_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items) === 0 ? 0 : 1);
  }
}
function ProductsAllPage_Conditional_149_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 94);
    \u0275\u0275text(1, "Sin Stock");
    \u0275\u0275elementEnd();
  }
}
function ProductsAllPage_Conditional_149_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 95);
    \u0275\u0275text(1, "Oferta");
    \u0275\u0275elementEnd();
  }
}
function ProductsAllPage_Conditional_149_Conditional_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 106);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, p_r8.regular_price));
  }
}
function ProductsAllPage_Conditional_149_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "div", 92);
    \u0275\u0275element(2, "img", 93);
    \u0275\u0275conditionalCreate(3, ProductsAllPage_Conditional_149_Conditional_4_Conditional_3_Template, 2, 0, "span", 94)(4, ProductsAllPage_Conditional_149_Conditional_4_Conditional_4_Template, 2, 0, "span", 95);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 96)(6, "div", 97)(7, "h3", 98);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 99)(10, "div", 100);
    \u0275\u0275element(11, "input", 101)(12, "input", 101)(13, "input", 101)(14, "input", 101)(15, "input", 102);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 103);
    \u0275\u0275text(17, "(24 reviews)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 104)(19, "span", 105);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(22, ProductsAllPage_Conditional_149_Conditional_4_Conditional_22_Template, 3, 3, "span", 106);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p", 107);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 108)(26, "span", 109);
    \u0275\u0275element(27, "i", 110);
    \u0275\u0275text(28, " Original");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 109);
    \u0275\u0275element(30, "i", 111);
    \u0275\u0275text(31, " Garant\xEDa");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "button", 112);
    \u0275\u0275listener("click", function ProductsAllPage_Conditional_149_Conditional_4_Template_button_click_32_listener() {
      const p_r8 = \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.addToCart(p_r8));
    });
    \u0275\u0275element(33, "i", 113);
    \u0275\u0275text(34, " Agregar al Carrito ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r8 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", p_r8.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", p_r8.name);
    \u0275\u0275advance();
    \u0275\u0275conditional((p_r8.stock ?? 0) <= 0 ? 3 : p_r8.sale_price ? 4 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r8.name);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 7, p_r8.price));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r8.regular_price && p_r8.regular_price > p_r8.price ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r8.description || "Sin descripci\xF3n disponible.");
  }
}
function ProductsAllPage_Conditional_149_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 73)(1, "div", 87)(2, "button", 88);
    \u0275\u0275listener("click", function ProductsAllPage_Conditional_149_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProductsAllPage_Conditional_149_Conditional_4_Template, 35, 9, "div", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 90)(6, "button", 91);
    \u0275\u0275listener("click", function ProductsAllPage_Conditional_149_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
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
var ProductsAllPage = class _ProductsAllPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  cartService = inject(CartService);
  // Search Signal and Subject for debounce
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  searchSubject = new Subject();
  breadcrumbItems = signal([
    { label: "Inicio", url: "/" },
    { label: "Productos" }
  ], ...ngDevMode ? [{ debugName: "breadcrumbItems" }] : []);
  // Filter signals
  minPriceInput = signal(null, ...ngDevMode ? [{ debugName: "minPriceInput" }] : []);
  maxPriceInput = signal(null, ...ngDevMode ? [{ debugName: "maxPriceInput" }] : []);
  currentSort = "created_at|desc";
  constructor() {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((q) => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }
  productsRs = rxResource({
    stream: () => this.route.queryParams.pipe(switchMap((params) => {
      const currentPage = +params["_page"] || 1;
      const _sort = params["_sort"];
      const _order = params["_order"];
      const min_price = params["min_price"] ? +params["min_price"] : void 0;
      const max_price = params["max_price"] ? +params["max_price"] : void 0;
      const q = params["q"] || void 0;
      if (this.searchQuery() !== (q || ""))
        this.searchQuery.set(q || "");
      if (this.minPriceInput() === null && min_price)
        this.minPriceInput.set(min_price);
      if (this.maxPriceInput() === null && max_price)
        this.maxPriceInput.set(max_price);
      return this.productService.getData({
        _page: currentPage,
        _sort,
        _order,
        min_price,
        max_price,
        q
      });
    }))
  });
  paginationData = computed(() => {
    const data = this.productsRs.value();
    if (!data)
      return null;
    const _a = data, { data: products } = _a, pagination = __objRest(_a, ["data"]);
    return pagination;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  // UI States
  isQuickViewOpen = signal(false, ...ngDevMode ? [{ debugName: "isQuickViewOpen" }] : []);
  quickViewProduct = signal(null, ...ngDevMode ? [{ debugName: "quickViewProduct" }] : []);
  // Methods
  onSearch(value) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }
  updateQueryParams(newParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: "merge"
    });
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
  applyPriceFilter() {
    this.updateQueryParams({
      min_price: this.minPriceInput(),
      max_price: this.maxPriceInput(),
      _page: 1
    });
  }
  setSort(sort, order = "asc") {
    this.updateQueryParams({
      _sort: sort,
      _order: order,
      _page: 1
    });
  }
  static \u0275fac = function ProductsAllPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductsAllPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsAllPage, selectors: [["app-products-all-page"]], decls: 150, vars: 10, consts: [[1, "drawer", "lg:drawer-open"], ["id", "shop-filters-drawer", "type", "checkbox", 1, "drawer-toggle"], [1, "drawer-content", "flex", "flex-col", "min-h-screen", "bg-gray-50", "dark:bg-gray-900", "transition-colors", "duration-300"], [1, "relative", "bg-gray-900", "text-white", "overflow-hidden", "isolate"], [1, "absolute", "inset-0", "-z-10", "h-full", "w-full", "bg-white", "dark:bg-gray-900", "bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)]", "dark:bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-900),transparent)]", "opacity-20", "pointer-events-none"], [1, "absolute", "inset-y-0", "right-1/2", "-z-10", "mr-16", "w-[200%]", "origin-bottom-left", "skew-x-[-30deg]", "bg-white", "shadow-xl", "shadow-indigo-600/10", "ring-1", "ring-indigo-50", "sm:mr-28", "lg:mr-0", "xl:mr-16", "xl:origin-center", "opacity-10", "dark:opacity-5", "pointer-events-none"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-gray-900/90", "to-gray-800/90", "backdrop-blur-sm", "z-0", "pointer-events-none"], [1, "relative", "container", "mx-auto", "px-4", "py-16", "sm:py-24", "text-center"], [1, "flex", "justify-center", "mb-6", "relative", "z-10"], ["classes", "justify-center text-gray-400 !text-gray-400", "activeClasses", "!text-white", 3, "items"], [1, "text-4xl", "md:text-6xl", "font-black", "mb-6", "tracking-tight", "bg-clip-text", "text-transparent", "bg-linear-to-r", "from-white", "to-gray-400"], [1, "text-lg", "md:text-xl", "text-gray-300", "max-w-2xl", "mx-auto", "mb-10", "leading-relaxed", "font-light"], [1, "max-w-2xl", "mx-auto", "relative", "group", "z-20"], [1, "absolute", "-inset-1", "bg-linear-to-r", "from-teal-500", "to-indigo-600", "rounded-full", "blur", "opacity-25", "group-hover:opacity-75", "transition", "duration-1000", "group-hover:duration-200"], [1, "relative", "flex", "items-center", "bg-white", "dark:bg-gray-800", "rounded-full", "shadow-2xl", "overflow-hidden"], [1, "pl-6", "text-gray-400"], [1, "fas", "fa-search", "text-lg"], ["type", "text", "placeholder", "Buscar por nombre, SKU o modelo...", "aria-label", "Buscar productos", 1, "w-full", "bg-transparent", "border-none", "text-gray-900", "dark:text-white", "placeholder-gray-500", "px-4", "py-5", "focus:ring-0", "text-lg", "mobile-search-input", 3, "ngModelChange", "ngModel"], [1, "hidden", "sm:block", "mr-2", "px-6", "py-2", "bg-gray-900", "dark:bg-white", "text-white", "dark:text-gray-900", "rounded-full", "font-bold", "hover:bg-indigo-600", "dark:hover:bg-gray-200", "transition-colors"], [1, "flex-1", "container", "mx-auto", "px-4", "py-12"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-center", "mb-8", "pb-4", "border-b", "border-gray-200", "dark:border-gray-800", "gap-4"], [1, "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "gap-4"], [1, "text-gray-600", "dark:text-gray-400", "font-medium"], ["for", "shop-filters-drawer", 1, "btn", "btn-sm", "btn-outline", "rounded-full", "w-full", "sm:w-auto", "lg:hidden"], [1, "fas", "fa-sliders-h", "mr-2"], [1, "flex", "items-center", "gap-3"], [1, "text-sm", "text-gray-500", "hidden", "sm:inline"], [1, "select", "select-bordered", "select-sm", "rounded-full", "bg-white", "dark:bg-gray-800", "border-gray-300", "dark:border-gray-700", "focus:border-indigo-500", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], ["value", "created_at|desc"], ["value", "price|asc"], ["value", "price|desc"], ["value", "name|asc"], [1, "min-h-[400px]"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-3", "gap-8"], [3, "message"], [1, "mt-24", "pt-12", "border-t", "border-gray-200", "dark:border-gray-800"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white", "mb-6"], [1, "grid", "md:grid-cols-2", "gap-8", "text-gray-600", "dark:text-gray-300", "leading-relaxed"], [1, "font-bold", "text-gray-800", "dark:text-gray-200", "mb-2", "text-lg"], [1, "mb-4"], [1, "bg-gray-900", "text-white", "py-12", "px-4", "mt-auto"], [1, "container", "mx-auto"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-8", "text-center"], [1, "p-4", "rounded-xl", "hover:bg-white/5", "transition-colors", "group"], [1, "fas", "fa-truck-fast", "text-4xl", "mb-3", "text-teal-400", "group-hover:scale-110", "transition-transform"], [1, "font-bold"], [1, "text-sm", "text-gray-400"], [1, "fas", "fa-shield-alt", "text-4xl", "mb-3", "text-teal-400", "group-hover:scale-110", "transition-transform"], [1, "far", "fa-credit-card", "text-4xl", "mb-3", "text-teal-400", "group-hover:scale-110", "transition-transform"], [1, "fas", "fa-headset", "text-4xl", "mb-3", "text-teal-400", "group-hover:scale-110", "transition-transform"], [1, "drawer-side", "z-40"], ["for", "shop-filters-drawer", "aria-label", "close sidebar", 1, "drawer-overlay", "backdrop-blur-sm"], [1, "menu", "p-6", "w-80", "min-h-full", "bg-white", "dark:bg-gray-800", "text-base-content", "border-r", "border-gray-200", "dark:border-gray-700"], [1, "flex", "justify-between", "items-center", "mb-8"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white"], ["for", "shop-filters-drawer", 1, "btn", "btn-sm", "btn-circle", "btn-ghost"], [1, "space-y-8"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-4", "flex", "items-center", "gap-2"], [1, "fas", "fa-tag", "text-indigo-500"], [1, "form-control", "w-full"], [1, "label", "text-xs", "text-gray-500"], [1, "relative"], [1, "absolute", "left-3", "top-2.5", "text-gray-400"], ["type", "number", "placeholder", "0", 1, "input", "input-bordered", "w-full", "pl-6", "rounded-xl", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "Max", 1, "input", "input-bordered", "w-full", "pl-6", "rounded-xl", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary", "w-full", "mt-4", "rounded-xl", "shadow-lg", "shadow-indigo-500/20", 3, "click"], [1, "fas", "fa-layer-group", "text-indigo-500"], [1, "space-y-2"], ["routerLink", "/productos/categoria/repuestos", 1, "block", "py-2", "px-3", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-700", "transition"], ["routerLink", "/productos/categoria/herramientas", 1, "block", "py-2", "px-3", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-700", "transition"], ["routerLink", "/productos/categoria/accesorios", 1, "block", "py-2", "px-3", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-700", "transition"], [1, "mt-auto", "pt-8"], [1, "btn", "btn-outline", "btn-block", "rounded-xl", 3, "click"], [1, "modal", "modal-open", "z-50", "animate-fade-in"], [1, "text-gray-900", "dark:text-white", "font-bold"], [1, "animate-pulse", "bg-gray-200", "dark:bg-gray-800", "rounded-3xl", "h-[400px]", "w-full"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "text-center"], [1, "w-24", "h-24", "bg-gray-100", "dark:bg-gray-800", "rounded-full", "flex", "items-center", "justify-center", "mb-6"], [1, "fas", "fa-search", "text-4xl", "text-gray-300", "dark:text-gray-600"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-gray-500", "dark:text-gray-400", "max-w-md"], [1, "btn", "btn-link", "text-indigo-600", "mt-4", 3, "click"], [1, "grid", "grid-cols-2", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-3", "gap-2", "sm:gap-8"], [1, "h-full", 3, "product", "isPriority"], [1, "mt-16", "flex", "justify-center"], [1, "h-full", 3, "quickView", "product", "isPriority"], [3, "pages", "currentPage"], [1, "modal-box", "relative", "max-w-4xl", "bg-white", "dark:bg-gray-800", "rounded-3xl", "p-0", "overflow-hidden", "shadow-2xl"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-4", "top-4", "z-10", "bg-white/50", "backdrop-blur-md", 3, "click"], [1, "flex", "flex-col", "md:flex-row", "h-full"], ["method", "dialog", 1, "modal-backdrop", "bg-black/50", "backdrop-blur-sm"], [3, "click"], [1, "w-full", "md:w-1/2", "bg-gray-50", "dark:bg-gray-700/30", "p-8", "flex", "items-center", "justify-center", "relative"], [1, "max-h-[300px]", "object-contain", "drop-shadow-xl", 3, "src", "alt"], [1, "absolute", "top-8", "left-8", "badge", "badge-error", "text-white", "font-bold", "p-3"], [1, "absolute", "top-8", "left-8", "badge", "badge-secondary", "text-white", "font-bold", "p-3"], [1, "w-full", "md:w-1/2", "p-8", "flex", "flex-col"], [1, "mb-auto"], [1, "font-black", "text-2xl", "md:text-3xl", "mb-2", "text-gray-900", "dark:text-white", "leading-tight"], [1, "flex", "items-center", "gap-2", "mb-4"], [1, "rating", "rating-sm", "rating-disabled"], ["type", "radio", "name", "rating-2", "checked", "", 1, "mask", "mask-star-2", "bg-orange-400"], ["type", "radio", "name", "rating-2", 1, "mask", "mask-star-2", "bg-orange-400"], [1, "text-xs", "text-gray-400"], [1, "flex", "items-baseline", "gap-3", "mb-6"], [1, "text-4xl", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "text-lg", "text-gray-400", "line-through"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "leading-relaxed"], [1, "flex", "flex-wrap", "gap-2", "mb-8"], [1, "badge", "badge-outline"], [1, "fas", "fa-check", "mr-1"], [1, "fas", "fa-shield-alt", "mr-1"], [1, "btn", "btn-primary", "btn-lg", "w-full", "rounded-2xl", "shadow-xl", "shadow-indigo-600/30", "gap-3", 3, "click"], [1, "fas", "fa-shopping-cart"]], template: function ProductsAllPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "input", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "header", 3);
      \u0275\u0275element(4, "div", 4)(5, "div", 5)(6, "div", 6);
      \u0275\u0275elementStart(7, "div", 7)(8, "div", 8);
      \u0275\u0275element(9, "app-breadcrumbs", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "h1", 10);
      \u0275\u0275text(11, " Cat\xE1logo Completo ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p", 11);
      \u0275\u0275text(13, " Encontr\xE1 repuestos originales, herramientas de precisi\xF3n y accesorios premium para llevar tus reparaciones al siguiente nivel. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 12);
      \u0275\u0275element(15, "div", 13);
      \u0275\u0275elementStart(16, "div", 14)(17, "div", 15);
      \u0275\u0275element(18, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 17);
      \u0275\u0275listener("ngModelChange", function ProductsAllPage_Template_input_ngModelChange_19_listener($event) {
        return ctx.onSearch($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "button", 18);
      \u0275\u0275text(21, " Buscar ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(22, "div", 19)(23, "div", 20)(24, "div", 21)(25, "div", 22);
      \u0275\u0275conditionalCreate(26, ProductsAllPage_Conditional_26_Template, 4, 1)(27, ProductsAllPage_Conditional_27_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "label", 23);
      \u0275\u0275element(29, "i", 24);
      \u0275\u0275text(30, " Filtros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 25)(32, "span", 26);
      \u0275\u0275text(33, "Ordenar por:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "select", 27);
      \u0275\u0275listener("ngModelChange", function ProductsAllPage_Template_select_ngModelChange_34_listener($event) {
        return ctx.setSort($event.split("|")[0], $event.split("|")[1]);
      });
      \u0275\u0275elementStart(35, "option", 28);
      \u0275\u0275text(36, "M\xE1s Recientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "option", 29);
      \u0275\u0275text(38, "Precio: Menor a Mayor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "option", 30);
      \u0275\u0275text(40, "Precio: Mayor a Menor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "option", 31);
      \u0275\u0275text(42, "Alfab\xE9tico A-Z");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(43, "main", 32);
      \u0275\u0275conditionalCreate(44, ProductsAllPage_Conditional_44_Template, 3, 1, "div", 33);
      \u0275\u0275conditionalCreate(45, ProductsAllPage_Conditional_45_Template, 1, 1, "is-error", 34);
      \u0275\u0275conditionalCreate(46, ProductsAllPage_Conditional_46_Template, 2, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "section", 35)(48, "h2", 36);
      \u0275\u0275text(49, "\xBFPor qu\xE9 elegir Arecofix para tus repuestos?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "div", 37)(51, "div")(52, "h3", 38);
      \u0275\u0275text(53, "Calidad Comprobada");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "p", 39);
      \u0275\u0275text(55, " Sabemos lo frustrante que es instalar un repuesto y que falle a los d\xEDas. Por eso, testeamos cada lote de pantallas y bater\xEDas. Trabajamos calidades ");
      \u0275\u0275elementStart(56, "strong");
      \u0275\u0275text(57, "Original, OLED y Premium");
      \u0275\u0275elementEnd();
      \u0275\u0275text(58, " para que elijas seg\xFAn tu presupuesto, pero siempre con garant\xEDa. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "h3", 38);
      \u0275\u0275text(60, "Stock Real");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "p");
      \u0275\u0275text(62, " Lo que ves publicado es lo que tenemos. Sin vueltas. Nuestro sistema de stock se actualiza en tiempo real para que no pierdas tiempo. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(63, "div")(64, "h3", 38);
      \u0275\u0275text(65, "Env\xEDos y Retiros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p", 39);
      \u0275\u0275text(67, " Hacemos env\xEDos a todo el pa\xEDs. Si est\xE1s en la zona, pod\xE9s retirar por nuestro local en ");
      \u0275\u0275elementStart(68, "strong");
      \u0275\u0275text(69, "Marcos Paz");
      \u0275\u0275elementEnd();
      \u0275\u0275text(70, ". Despachamos en el d\xEDa las compras realizadas antes de las 14hs. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "h3", 38);
      \u0275\u0275text(72, "Atenci\xF3n al Gremio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "p");
      \u0275\u0275text(74, " \xBFTen\xE9s local? Ped\xED tu lista de precios mayorista. Queremos ser tus socios estrat\xE9gicos, ayud\xE1ndote a crecer con precios competitivos y soporte t\xE9cnico especializado. ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(75, "div", 40)(76, "div", 41)(77, "div", 42)(78, "div", 43);
      \u0275\u0275element(79, "i", 44);
      \u0275\u0275elementStart(80, "h4", 45);
      \u0275\u0275text(81, "Env\xEDos R\xE1pidos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "p", 46);
      \u0275\u0275text(83, "A todo el pa\xEDs");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "div", 43);
      \u0275\u0275element(85, "i", 47);
      \u0275\u0275elementStart(86, "h4", 45);
      \u0275\u0275text(87, "Garant\xEDa Escrita");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "p", 46);
      \u0275\u0275text(89, "Compra protegida");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(90, "div", 43);
      \u0275\u0275element(91, "i", 48);
      \u0275\u0275elementStart(92, "h4", 45);
      \u0275\u0275text(93, "Cuotas Fijas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(94, "p", 46);
      \u0275\u0275text(95, "Tarjetas bancarias");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(96, "div", 43);
      \u0275\u0275element(97, "i", 49);
      \u0275\u0275elementStart(98, "h4", 45);
      \u0275\u0275text(99, "Soporte T\xE9cnico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "p", 46);
      \u0275\u0275text(101, "Post-venta real");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(102, "div", 50);
      \u0275\u0275element(103, "label", 51);
      \u0275\u0275elementStart(104, "aside", 52)(105, "div", 53)(106, "h3", 54);
      \u0275\u0275text(107, "Filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "label", 55);
      \u0275\u0275text(109, "\u2715");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(110, "div", 56)(111, "div")(112, "h4", 57);
      \u0275\u0275element(113, "i", 58);
      \u0275\u0275text(114, " Precio ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(115, "div", 25)(116, "div", 59)(117, "label", 60);
      \u0275\u0275text(118, "M\xEDnimo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(119, "div", 61)(120, "span", 62);
      \u0275\u0275text(121, "$");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "input", 63);
      \u0275\u0275listener("ngModelChange", function ProductsAllPage_Template_input_ngModelChange_122_listener($event) {
        return ctx.minPriceInput.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(123, "div", 59)(124, "label", 60);
      \u0275\u0275text(125, "M\xE1ximo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(126, "div", 61)(127, "span", 62);
      \u0275\u0275text(128, "$");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(129, "input", 64);
      \u0275\u0275listener("ngModelChange", function ProductsAllPage_Template_input_ngModelChange_129_listener($event) {
        return ctx.maxPriceInput.set($event);
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(130, "button", 65);
      \u0275\u0275listener("click", function ProductsAllPage_Template_button_click_130_listener() {
        return ctx.applyPriceFilter();
      });
      \u0275\u0275text(131, " Aplicar Precio ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(132, "div")(133, "h4", 57);
      \u0275\u0275element(134, "i", 66);
      \u0275\u0275text(135, " Categor\xEDas R\xE1pidas ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(136, "ul", 67)(137, "li")(138, "a", 68);
      \u0275\u0275text(139, "Repuestos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(140, "li")(141, "a", 69);
      \u0275\u0275text(142, "Herramientas");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(143, "li")(144, "a", 70);
      \u0275\u0275text(145, "Accesorios");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(146, "div", 71)(147, "button", 72);
      \u0275\u0275listener("click", function ProductsAllPage_Template_button_click_147_listener() {
        ctx.onSearch("");
        ctx.minPriceInput.set(null);
        ctx.maxPriceInput.set(null);
        return ctx.applyPriceFilter();
      });
      \u0275\u0275text(148, " Limpiar Todo ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(149, ProductsAllPage_Conditional_149_Template, 8, 1, "div", 73);
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("items", ctx.breadcrumbItems());
      \u0275\u0275advance(10);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.productsRs.value() ? 26 : 27);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.currentSort);
      \u0275\u0275advance(10);
      \u0275\u0275conditional(ctx.productsRs.isLoading() ? 44 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.productsRs.error() ? 45 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.productsRs.value() ? 46 : -1);
      \u0275\u0275advance(76);
      \u0275\u0275property("ngModel", ctx.minPriceInput());
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.maxPriceInput());
      \u0275\u0275advance(20);
      \u0275\u0275conditional(ctx.isQuickViewOpen() ? 149 : -1);
    }
  }, dependencies: [
    IsErrorComponent,
    ProductCard,
    Pagination,
    RouterModule,
    RouterLink,
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    CommonModule,
    BreadcrumbsComponent,
    CurrencyPipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsAllPage, [{
    type: Component,
    args: [{ selector: "app-products-all-page", standalone: true, imports: [
      IsErrorComponent,
      ProductCard,
      Pagination,
      RouterModule,
      FormsModule,
      CommonModule,
      BreadcrumbsComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Mobile Filter Drawer Wrapper -->\r
<div class="drawer lg:drawer-open">\r
  <input id="shop-filters-drawer" type="checkbox" class="drawer-toggle" />\r
  \r
  <div class="drawer-content flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">\r
    <!-- HERO SECTION -->\r
    <header class="relative bg-gray-900 text-white overflow-hidden isolate">\r
       <!-- Background Effects -->\r
       <!-- Background Effects -->\r
       <div class="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-900),transparent)] opacity-20 pointer-events-none"></div>\r
       <div class="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center opacity-10 dark:opacity-5 pointer-events-none"></div>\r
       \r
       <!-- Gradient Overlay -->\r
       <div class="absolute inset-0 bg-linear-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm z-0 pointer-events-none"></div>\r
\r
       <div class="relative container mx-auto px-4 py-16 sm:py-24 text-center">\r
        <!-- Breadcrumbs -->\r
        <div class="flex justify-center mb-6 relative z-10">\r
            <app-breadcrumbs [items]="breadcrumbItems()" classes="justify-center text-gray-400 !text-gray-400" activeClasses="!text-white"></app-breadcrumbs>\r
        </div>\r
\r
        <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">\r
          Cat\xE1logo Completo\r
        </h1>\r
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">\r
          Encontr\xE1 repuestos originales, herramientas de precisi\xF3n y accesorios premium para llevar tus reparaciones al siguiente nivel.\r
        </p>\r
\r
        <!-- Search Bar (Floating & Glassmorphism) -->\r
        <div class="max-w-2xl mx-auto relative group z-20">\r
            <div class="absolute -inset-1 bg-linear-to-r from-teal-500 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>\r
            <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl overflow-hidden">\r
                <div class="pl-6 text-gray-400">\r
                    <i class="fas fa-search text-lg"></i>\r
                </div>\r
                <input \r
                    type="text" \r
                    placeholder="Buscar por nombre, SKU o modelo..." \r
                    [ngModel]="searchQuery()"\r
                    (ngModelChange)="onSearch($event)"\r
                    class="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 px-4 py-5 focus:ring-0 text-lg mobile-search-input" \r
                    aria-label="Buscar productos"\r
                />\r
                <button class="hidden sm:block mr-2 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:bg-indigo-600 dark:hover:bg-gray-200 transition-colors">\r
                    Buscar\r
                </button>\r
            </div>\r
        </div>\r
      </div>\r
    </header>\r
\r
    <!-- MAIN CONTENT -->\r
    <div class="flex-1 container mx-auto px-4 py-12">\r
        <!-- Results Header & Sort Controls (Desktop) -->\r
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4">\r
            <div class="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">\r
                <div class="text-gray-600 dark:text-gray-400 font-medium">\r
                    @if (productsRs.value()) {\r
                      Mostrando <span class="text-gray-900 dark:text-white font-bold">{{ productsRs.value()?.items }}</span> resultados\r
                    } @else {\r
                      Cargando cat\xE1logo...\r
                    }\r
                </div>\r
                \r
                <label for="shop-filters-drawer" class="btn btn-sm btn-outline rounded-full w-full sm:w-auto lg:hidden">\r
                    <i class="fas fa-sliders-h mr-2"></i> Filtros\r
                </label>\r
            </div>\r
            \r
            <div class="flex items-center gap-3">\r
                <span class="text-sm text-gray-500 hidden sm:inline">Ordenar por:</span>\r
                <select class="select select-bordered select-sm rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"\r
                        [ngModel]="currentSort" \r
                        (ngModelChange)="setSort($event.split('|')[0], $event.split('|')[1])">\r
                    <option value="created_at|desc">M\xE1s Recientes</option>\r
                    <option value="price|asc">Precio: Menor a Mayor</option>\r
                    <option value="price|desc">Precio: Mayor a Menor</option>\r
                    <option value="name|asc">Alfab\xE9tico A-Z</option>\r
                </select>\r
            </div>\r
        </div>\r
\r
        <!-- PRODUCTS GRID -->\r
        <main class="min-h-[400px]">\r
            @if (productsRs.isLoading()) {\r
                 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">\r
                    @for(i of [1,2,3,4,5,6]; track i) {\r
                        <div class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-3xl h-[400px] w-full"></div>\r
                    }\r
                 </div>\r
            }\r
            @if (productsRs.error()) { <is-error [message]="productsRs.error()?.message || 'Error al cargar productos'" /> }\r
\r
            @if (productsRs.value()) {\r
                @if (productsRs.value()?.items === 0) {\r
                    <div class="flex flex-col items-center justify-center py-20 text-center">\r
                        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">\r
                            <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600"></i>\r
                        </div>\r
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No encontramos lo que buscas</h3>\r
                        <p class="text-gray-500 dark:text-gray-400 max-w-md">\r
                            Intenta con otros t\xE9rminos, verifica la ortograf\xEDa o elimina los filtros aplicados.\r
                        </p>\r
                        <button (click)="onSearch(''); minPriceInput.set(null); maxPriceInput.set(null)" class="btn btn-link text-indigo-600 mt-4">\r
                            Limpiar b\xFAsqueda\r
                        </button>\r
                    </div>\r
                } @else {\r
                    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-8">\r
                        @for (product of productsRs.value()!.data; track product.id; let i = $index) {\r
                            <product-card \r
                                [product]="product" \r
                                [isPriority]="i < 2" \r
                                (quickView)="openQuickView($event)"\r
                                class="h-full"\r
                            ></product-card>\r
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
        </main>\r
        \r
        <!-- SEO Content Section -->\r
        <section class="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">\r
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">\xBFPor qu\xE9 elegir Arecofix para tus repuestos?</h2>\r
            <div class="grid md:grid-cols-2 gap-8 text-gray-600 dark:text-gray-300 leading-relaxed">\r
                <div>\r
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg">Calidad Comprobada</h3>\r
                    <p class="mb-4">\r
                        Sabemos lo frustrante que es instalar un repuesto y que falle a los d\xEDas. Por eso, testeamos cada lote de pantallas y bater\xEDas. Trabajamos calidades <strong>Original, OLED y Premium</strong> para que elijas seg\xFAn tu presupuesto, pero siempre con garant\xEDa.\r
                    </p>\r
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg">Stock Real</h3>\r
                    <p>\r
                        Lo que ves publicado es lo que tenemos. Sin vueltas. Nuestro sistema de stock se actualiza en tiempo real para que no pierdas tiempo.\r
                    </p>\r
                </div>\r
                <div>\r
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg">Env\xEDos y Retiros</h3>\r
                    <p class="mb-4">\r
                        Hacemos env\xEDos a todo el pa\xEDs. Si est\xE1s en la zona, pod\xE9s retirar por nuestro local en <strong>Marcos Paz</strong>. Despachamos en el d\xEDa las compras realizadas antes de las 14hs.\r
                    </p>\r
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg">Atenci\xF3n al Gremio</h3>\r
                    <p>\r
                        \xBFTen\xE9s local? Ped\xED tu lista de precios mayorista. Queremos ser tus socios estrat\xE9gicos, ayud\xE1ndote a crecer con precios competitivos y soporte t\xE9cnico especializado.\r
                    </p>\r
                </div>\r
            </div>\r
        </section>\r
    </div>\r
    \r
    <!-- Benefits Strip -->\r
    <div class="bg-gray-900 text-white py-12 px-4 mt-auto">\r
        <div class="container mx-auto">\r
             <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">\r
                <div class="p-4 rounded-xl hover:bg-white/5 transition-colors group">\r
                    <i class="fas fa-truck-fast text-4xl mb-3 text-teal-400 group-hover:scale-110 transition-transform"></i>\r
                    <h4 class="font-bold">Env\xEDos R\xE1pidos</h4>\r
                    <p class="text-sm text-gray-400">A todo el pa\xEDs</p>\r
                </div>\r
                <div class="p-4 rounded-xl hover:bg-white/5 transition-colors group">\r
                    <i class="fas fa-shield-alt text-4xl mb-3 text-teal-400 group-hover:scale-110 transition-transform"></i>\r
                    <h4 class="font-bold">Garant\xEDa Escrita</h4>\r
                    <p class="text-sm text-gray-400">Compra protegida</p>\r
                </div>\r
                <div class="p-4 rounded-xl hover:bg-white/5 transition-colors group">\r
                    <i class="far fa-credit-card text-4xl mb-3 text-teal-400 group-hover:scale-110 transition-transform"></i>\r
                    <h4 class="font-bold">Cuotas Fijas</h4>\r
                    <p class="text-sm text-gray-400">Tarjetas bancarias</p>\r
                </div>\r
                <div class="p-4 rounded-xl hover:bg-white/5 transition-colors group">\r
                    <i class="fas fa-headset text-4xl mb-3 text-teal-400 group-hover:scale-110 transition-transform"></i>\r
                    <h4 class="font-bold">Soporte T\xE9cnico</h4>\r
                    <p class="text-sm text-gray-400">Post-venta real</p>\r
                </div>\r
             </div>\r
        </div>\r
    </div>\r
  </div>\r
\r
  <!-- DRAWER SIDEBAR (Filters) -->\r
  <div class="drawer-side z-40">\r
    <label for="shop-filters-drawer" aria-label="close sidebar" class="drawer-overlay backdrop-blur-sm"></label>\r
    <aside class="menu p-6 w-80 min-h-full bg-white dark:bg-gray-800 text-base-content border-r border-gray-200 dark:border-gray-700">\r
        <div class="flex justify-between items-center mb-8">\r
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Filtros</h3>\r
            <label for="shop-filters-drawer" class="btn btn-sm btn-circle btn-ghost">\u2715</label>\r
        </div>\r
\r
        <!-- Filter Groups -->\r
        <div class="space-y-8">\r
            <!-- Price Range -->\r
            <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">\r
                    <i class="fas fa-tag text-indigo-500"></i> Precio\r
                </h4>\r
                <div class="flex items-center gap-3">\r
                    <div class="form-control w-full">\r
                        <label class="label text-xs text-gray-500">M\xEDnimo</label>\r
                        <div class="relative">\r
                            <span class="absolute left-3 top-2.5 text-gray-400">$</span>\r
                            <input type="number" [ngModel]="minPriceInput()" (ngModelChange)="minPriceInput.set($event)" placeholder="0" class="input input-bordered w-full pl-6 rounded-xl" />\r
                        </div>\r
                    </div>\r
                    <div class="form-control w-full">\r
                        <label class="label text-xs text-gray-500">M\xE1ximo</label>\r
                        <div class="relative">\r
                             <span class="absolute left-3 top-2.5 text-gray-400">$</span>\r
                            <input type="number" [ngModel]="maxPriceInput()" (ngModelChange)="maxPriceInput.set($event)" placeholder="Max" class="input input-bordered w-full pl-6 rounded-xl" />\r
                        </div>\r
                    </div>\r
                </div>\r
                <button (click)="applyPriceFilter()" class="btn btn-primary w-full mt-4 rounded-xl shadow-lg shadow-indigo-500/20">\r
                    Aplicar Precio\r
                </button>\r
            </div>\r
\r
            <!-- Pre-defined Filters (Simulated for this page) -->\r
            <div>\r
                 <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">\r
                    <i class="fas fa-layer-group text-indigo-500"></i> Categor\xEDas R\xE1pidas\r
                </h4>\r
                <ul class="space-y-2">\r
                    <li><a routerLink="/productos/categoria/repuestos" class="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Repuestos</a></li>\r
                    <li><a routerLink="/productos/categoria/herramientas" class="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Herramientas</a></li>\r
                    <li><a routerLink="/productos/categoria/accesorios" class="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Accesorios</a></li>\r
                </ul>\r
            </div>\r
        </div>\r
        \r
        <div class="mt-auto pt-8">\r
            <button (click)="onSearch(''); minPriceInput.set(null); maxPriceInput.set(null); applyPriceFilter()" class="btn btn-outline btn-block rounded-xl">\r
                Limpiar Todo\r
            </button>\r
        </div>\r
    </aside>\r
  </div>\r
</div>\r
\r
<!-- Quick View Modal -->\r
@if (isQuickViewOpen()) {\r
<div class="modal modal-open z-50 animate-fade-in">\r
  <div class="modal-box relative max-w-4xl bg-white dark:bg-gray-800 rounded-3xl p-0 overflow-hidden shadow-2xl">\r
    <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white/50 backdrop-blur-md" (click)="closeQuickView()">\u2715</button>\r
    \r
    @if (quickViewProduct(); as p) {\r
        <div class="flex flex-col md:flex-row h-full">\r
            <!-- Image Side -->\r
            <div class="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700/30 p-8 flex items-center justify-center relative">\r
                <img [src]="p.image_url || 'assets/img/no-image.png'" class="max-h-[300px] object-contain drop-shadow-xl" [alt]="p.name"/>\r
                @if((p.stock ?? 0) <= 0) {\r
                     <span class="absolute top-8 left-8 badge badge-error text-white font-bold p-3">Sin Stock</span>\r
                } @else if (p.sale_price) {\r
                     <span class="absolute top-8 left-8 badge badge-secondary text-white font-bold p-3">Oferta</span>\r
                }\r
            </div>\r
            \r
            <!-- Content Side -->\r
            <div class="w-full md:w-1/2 p-8 flex flex-col">\r
                <div class="mb-auto">\r
                    <h3 class="font-black text-2xl md:text-3xl mb-2 text-gray-900 dark:text-white leading-tight">{{ p.name }}</h3>\r
                    <div class="flex items-center gap-2 mb-4">\r
                         <div class="rating rating-sm rating-disabled">\r
                            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked />\r
                            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked />\r
                            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked />\r
                            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked />\r
                            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />\r
                        </div>\r
                        <span class="text-xs text-gray-400">(24 reviews)</span>\r
                    </div>\r
\r
                    <div class="flex items-baseline gap-3 mb-6">\r
                        <span class="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{{ p.price | currency }}</span>\r
                        @if(p.regular_price && p.regular_price > p.price) {\r
                            <span class="text-lg text-gray-400 line-through">{{ p.regular_price | currency }}</span>\r
                        }\r
                    </div>\r
                    \r
                    <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ p.description || 'Sin descripci\xF3n disponible.' }}</p>\r
                    \r
                    <!-- Features/Badges -->\r
                    <div class="flex flex-wrap gap-2 mb-8">\r
                        <span class="badge badge-outline"><i class="fas fa-check mr-1"></i> Original</span>\r
                        <span class="badge badge-outline"><i class="fas fa-shield-alt mr-1"></i> Garant\xEDa</span>\r
                    </div>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsAllPage, { className: "ProductsAllPage", filePath: "src/app/public/products/pages/all/products-all-page.ts", lineNumber: 39 });
})();
export {
  ProductsAllPage
};
//# sourceMappingURL=chunk-SAPNKFNE.js.map
