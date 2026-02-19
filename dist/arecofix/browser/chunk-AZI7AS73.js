import {
  BreadcrumbsComponent
} from "./chunk-HYWNRL7J.js";
import {
  IsErrorComponent
} from "./chunk-K2XCQALM.js";
import {
  PaginationService
} from "./chunk-FCYX4HRK.js";
import {
  Pagination
} from "./chunk-IZUXSIIJ.js";
import {
  rxResource
} from "./chunk-UPERU5DK.js";
import {
  CategoryService
} from "./chunk-2U27SUM4.js";
import "./chunk-NJJ5IL4Q.js";
import {
  ProductCard
} from "./chunk-S2WEKAOG.js";
import "./chunk-UD52RVVX.js";
import {
  ProductService
} from "./chunk-6G7ZH75Y.js";
import {
  CartService
} from "./chunk-FEAFVB6V.js";
import "./chunk-GR2FBAX3.js";
import "./chunk-BP46OLLS.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-TOKXMODF.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  CurrencyPipe,
  Router,
  RouterLink,
  RouterModule
} from "./chunk-WHLM5VZW.js";
import {
  ChangeDetectionStrategy,
  Component,
  Subject,
  catchError,
  combineLatest,
  computed,
  debounceTime,
  distinctUntilChanged,
  inject,
  map,
  of,
  setClassMetadata,
  signal,
  switchMap,
  tap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XQFVERLD.js";
import {
  __objRest
} from "./chunk-GOMI4DH3.js";

// src/app/public/products/pages/by-category/products-by-category-page.ts
var _c0 = () => [1, 2, 3, 4, 5, 6];
var _c1 = (a0) => ["/productos/categoria", a0];
var _forTrack0 = ($index, $item) => $item.id;
function ProductsByCategoryPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Mostrando ");
    \u0275\u0275elementStart(1, "span", 52);
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
function ProductsByCategoryPage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando cat\xE1logo... ");
  }
}
function ProductsByCategoryPage_Conditional_39_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 53);
  }
}
function ProductsByCategoryPage_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275repeaterCreate(1, ProductsByCategoryPage_Conditional_39_For_2_Template, 1, 0, "div", 53, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function ProductsByCategoryPage_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error", 31);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ((tmp_1_0 = ctx_r0.productsRs.error()) == null ? null : tmp_1_0.message) || "Error al cargar categor\xEDa");
  }
}
function ProductsByCategoryPage_Conditional_41_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275element(1, "i", 55);
    \u0275\u0275elementStart(2, "h3", 56);
    \u0275\u0275text(3, "Sin resultados en esta categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 57);
    \u0275\u0275listener("click", function ProductsByCategoryPage_Conditional_41_Conditional_0_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.onSearch("");
      ctx_r0.minPriceInput.set(null);
      ctx_r0.maxPriceInput.set(null);
      return \u0275\u0275resetView(ctx_r0.applyPriceFilter());
    });
    \u0275\u0275text(5, " Ver todos los productos ");
    \u0275\u0275elementEnd()();
  }
}
function ProductsByCategoryPage_Conditional_41_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "product-card", 61);
    \u0275\u0275listener("quickView", function ProductsByCategoryPage_Conditional_41_Conditional_1_For_2_Template_product_card_quickView_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openQuickView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    const \u0275$index_101_r5 = ctx.$index;
    \u0275\u0275property("product", product_r4)("isPriority", \u0275$index_101_r5 < 2);
  }
}
function ProductsByCategoryPage_Conditional_41_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "pagination", 62);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r0.paginationData().pages)("currentPage", ctx_r0.paginationService.currentPage());
  }
}
function ProductsByCategoryPage_Conditional_41_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58);
    \u0275\u0275repeaterCreate(1, ProductsByCategoryPage_Conditional_41_Conditional_1_For_2_Template, 1, 2, "product-card", 59, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, ProductsByCategoryPage_Conditional_41_Conditional_1_Conditional_3_Template, 2, 2, "div", 60);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.productsRs.value().data);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.paginationData() ? 3 : -1);
  }
}
function ProductsByCategoryPage_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProductsByCategoryPage_Conditional_41_Conditional_0_Template, 6, 0, "div", 54)(1, ProductsByCategoryPage_Conditional_41_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items) === 0 ? 0 : 1);
  }
}
function ProductsByCategoryPage_Conditional_78_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const cat_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ((tmp_11_0 = ctx_r0.currentCategory()) == null ? null : tmp_11_0.id) === cat_r6.id);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c1, cat_r6.slug));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", cat_r6.name, " ");
  }
}
function ProductsByCategoryPage_Conditional_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ProductsByCategoryPage_Conditional_78_For_1_Template, 3, 6, "li", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r0.categoriesListRs.value().data);
  }
}
function ProductsByCategoryPage_Conditional_79_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275text(1, "Sin Stock");
    \u0275\u0275elementEnd();
  }
}
function ProductsByCategoryPage_Conditional_79_Conditional_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 77);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, p_r9.regular_price));
  }
}
function ProductsByCategoryPage_Conditional_79_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 66)(1, "div", 69);
    \u0275\u0275element(2, "img", 70);
    \u0275\u0275conditionalCreate(3, ProductsByCategoryPage_Conditional_79_Conditional_4_Conditional_3_Template, 2, 0, "span", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 72)(5, "div", 73)(6, "h3", 74);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 75)(9, "span", 76);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, ProductsByCategoryPage_Conditional_79_Conditional_4_Conditional_12_Template, 3, 3, "span", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 78);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 79);
    \u0275\u0275listener("click", function ProductsByCategoryPage_Conditional_79_Conditional_4_Template_button_click_15_listener() {
      const p_r9 = \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.addToCart(p_r9));
    });
    \u0275\u0275element(16, "i", 80);
    \u0275\u0275text(17, " Agregar al Carrito ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r9 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", p_r9.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", p_r9.name);
    \u0275\u0275advance();
    \u0275\u0275conditional((p_r9.stock ?? 0) <= 0 ? 3 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r9.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 7, p_r9.price));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r9.regular_price && p_r9.regular_price > p_r9.price ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9.description || "Sin descripci\xF3n disponible.");
  }
}
function ProductsByCategoryPage_Conditional_79_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 64)(2, "button", 65);
    \u0275\u0275listener("click", function ProductsByCategoryPage_Conditional_79_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProductsByCategoryPage_Conditional_79_Conditional_4_Template, 18, 9, "div", 66);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 67)(6, "button", 68);
    \u0275\u0275listener("click", function ProductsByCategoryPage_Conditional_79_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r7);
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
var ProductsByCategoryPage = class _ProductsByCategoryPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  cartService = inject(CartService);
  currentCategory = signal(null, ...ngDevMode ? [{ debugName: "currentCategory" }] : []);
  // Filter signals to bind to UI inputs
  minPriceInput = signal(null, ...ngDevMode ? [{ debugName: "minPriceInput" }] : []);
  maxPriceInput = signal(null, ...ngDevMode ? [{ debugName: "maxPriceInput" }] : []);
  categoriesListRs = rxResource({
    stream: () => this.categoryService.getFeaturedData()
  });
  breadcrumbItems = computed(() => {
    const category = this.currentCategory();
    const items = [
      { label: "Inicio", url: "/" },
      { label: "Productos", url: "/productos" }
    ];
    if (category) {
      items.push({ label: category.name });
    } else {
      items.push({ label: "Categor\xEDa" });
    }
    return items;
  }, ...ngDevMode ? [{ debugName: "breadcrumbItems" }] : []);
  // Search Signal and Subject
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  searchSubject = new Subject();
  constructor() {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((q) => {
      this.updateQueryParams({ q: q || null, _page: 1 });
    });
  }
  // Helper for updating query params (DRY)
  updateQueryParams(newParams) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: "merge"
    });
  }
  // Method called from template
  onSearch(value) {
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }
  // Helper function to get all descendant category IDs recursively
  getAllDescendantIds(parentId, allCategories) {
    let ids = [parentId];
    const children = allCategories.filter((c) => c.parent_id === parentId);
    for (const child of children) {
      ids = [...ids, ...this.getAllDescendantIds(child.id, allCategories)];
    }
    return [...new Set(ids)];
  }
  productsRs = rxResource({
    stream: () => combineLatest([
      this.route.params.pipe(map(({ categorySlug }) => categorySlug)),
      this.route.queryParams
    ]).pipe(switchMap(([slug, params]) => combineLatest({
      categoryResponse: this.categoryService.getDataBySlug(slug),
      allCategories: this.categoryService.getAll().pipe(catchError(() => of([])))
    }).pipe(tap(({ categoryResponse }) => {
      this.currentCategory.set(categoryResponse.data?.[0] || null);
    }), switchMap(({ categoryResponse, allCategories }) => {
      const currentCat = categoryResponse.data?.[0];
      const categoryId = currentCat?.id;
      if (!categoryId) {
        console.warn("Category not found for slug:", slug);
        return of({
          first: 1,
          prev: null,
          next: null,
          last: 1,
          pages: 1,
          items: 0,
          data: []
        });
      }
      const targetCategoryIds = this.getAllDescendantIds(categoryId, allCategories);
      console.log("Fetching products for category:", currentCat.name, "IDs:", targetCategoryIds);
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
        category_ids: targetCategoryIds,
        // Use category_ids instead of category_id
        _page: currentPage,
        _sort,
        _order,
        min_price,
        max_price,
        q
        // Pass 'q'
      });
    }))))
  });
  // Computed para extraer datos de paginación de forma reactiva
  paginationData = computed(() => {
    const data = this.productsRs.value();
    if (!data)
      return null;
    const _a = data, { data: products } = _a, pagination = __objRest(_a, ["data"]);
    return pagination;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  // UI States
  isMobileFiltersOpen = signal(false, ...ngDevMode ? [{ debugName: "isMobileFiltersOpen" }] : []);
  isQuickViewOpen = signal(false, ...ngDevMode ? [{ debugName: "isQuickViewOpen" }] : []);
  quickViewProduct = signal(null, ...ngDevMode ? [{ debugName: "quickViewProduct" }] : []);
  // Methods
  toggleMobileFilters() {
    this.isMobileFiltersOpen.update((v) => !v);
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        min_price: this.minPriceInput(),
        max_price: this.maxPriceInput(),
        _page: 1
      },
      queryParamsHandling: "merge"
    });
    this.isMobileFiltersOpen.set(false);
  }
  setSort(sort, order = "asc") {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        _sort: sort,
        _order: order,
        _page: 1
      },
      queryParamsHandling: "merge"
    });
  }
  static \u0275fac = function ProductsByCategoryPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductsByCategoryPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsByCategoryPage, selectors: [["products-by-category-page"]], decls: 80, vars: 12, consts: [[1, "drawer", "lg:drawer-open"], ["id", "cat-filters-drawer", "type", "checkbox", 1, "drawer-toggle"], [1, "drawer-content", "flex", "flex-col", "min-h-screen", "bg-gray-50", "dark:bg-gray-900", "transition-colors", "duration-300"], [1, "relative", "bg-gray-900", "text-white", "overflow-hidden", "isolate"], [1, "absolute", "inset-0", "bg-linear-to-br", "from-indigo-900", "via-blue-950", "to-slate-900", "opacity-90", "pointer-events-none"], [1, "absolute", "-bottom-32", "-left-32", "w-96", "h-96", "bg-indigo-600", "rounded-full", "mix-blend-overlay", "filter", "blur-3xl", "opacity-20", "pointer-events-none"], [1, "absolute", "top-0", "right-0", "w-64", "h-64", "bg-teal-500", "rounded-full", "mix-blend-overlay", "filter", "blur-3xl", "opacity-10", "pointer-events-none"], [1, "relative", "container", "mx-auto", "px-4", "py-8", "lg:py-12", "text-center"], [1, "flex", "justify-center", "mb-6"], ["classes", "justify-center !text-indigo-200", "activeClasses", "!text-white", 3, "items"], [1, "text-4xl", "md:text-5xl", "font-black", "mb-6", "tracking-tight", "animate-fade-in-up"], [1, "text-lg", "md:text-xl", "text-gray-300", "max-w-2xl", "mx-auto", "mb-8", "font-light"], [1, "flex-1", "container", "mx-auto", "px-4", "py-12"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-center", "mb-8", "pb-4", "border-b", "border-gray-200", "dark:border-gray-800", "gap-4"], [1, "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "gap-4"], [1, "text-gray-600", "dark:text-gray-400", "font-medium", "text-sm"], ["for", "cat-filters-drawer", 1, "btn", "btn-sm", "btn-outline", "rounded-full", "w-full", "sm:w-auto", "lg:hidden"], [1, "fas", "fa-sliders-h", "mr-2"], [1, "flex", "items-center", "gap-3"], [1, "relative", "hidden", "md:block"], [1, "fas", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-gray-400"], ["type", "text", 1, "input", "input-bordered", "input-sm", "rounded-full", "pl-9", "w-64", "focus:ring-2", "focus:ring-indigo-500", "bg-white", "dark:bg-gray-800", 3, "input", "defaultValue", "placeholder"], [1, "select", "select-bordered", "select-sm", "rounded-full", "bg-white", "dark:bg-gray-800", "border-gray-300", "dark:border-gray-700", "min-w-[150px]", 3, "change"], ["value", "created_at|desc"], ["value", "price|asc"], ["value", "price|desc"], [1, "md:hidden", "mb-6"], [1, "relative"], ["type", "text", "placeholder", "Buscar en esta categor\xEDa...", 1, "input", "input-bordered", "w-full", "rounded-2xl", "pl-10", 3, "input", "defaultValue"], [1, "min-h-[400px]"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-3", "gap-6"], [3, "message"], [1, "drawer-side", "z-40"], ["for", "cat-filters-drawer", "aria-label", "close sidebar", 1, "drawer-overlay", "backdrop-blur-sm"], [1, "menu", "p-6", "w-80", "min-h-full", "bg-white", "dark:bg-gray-800", "text-base-content", "border-r", "border-gray-200", "dark:border-gray-700"], [1, "flex", "justify-between", "items-center", "mb-8"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white"], ["for", "cat-filters-drawer", 1, "btn", "btn-sm", "btn-circle", "btn-ghost", "cursor-pointer"], [1, "space-y-8"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-4", "flex", "items-center", "gap-2"], [1, "fas", "fa-tag", "text-indigo-500"], [1, "flex", "flex-col", "gap-3"], [1, "form-control", "w-full"], [1, "label", "text-xs", "text-gray-500"], [1, "absolute", "left-3", "top-3", "text-gray-400"], ["type", "number", "placeholder", "0", 1, "input", "input-bordered", "w-full", "pl-8", "rounded-xl", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "Max", 1, "input", "input-bordered", "w-full", "pl-8", "rounded-xl", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary", "w-full", "mt-2", "rounded-xl", 3, "click"], [1, "fas", "fa-layer-group", "text-indigo-500"], [1, "max-h-60", "overflow-y-auto", "custom-scrollbar"], [1, "space-y-1"], [1, "modal", "modal-open", "z-50", "animate-fade-in"], [1, "text-gray-900", "dark:text-white", "font-bold"], [1, "animate-pulse", "bg-gray-200", "dark:bg-gray-800", "rounded-3xl", "h-[400px]", "w-full"], [1, "text-center", "py-20", "bg-white", "dark:bg-gray-800", "rounded-3xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "fas", "fa-search", "text-4xl", "text-gray-300", "mb-4"], [1, "font-bold", "text-lg", "text-gray-900", "dark:text-white"], [1, "btn", "btn-link", "text-indigo-600", 3, "click"], [1, "grid", "grid-cols-2", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-3", "gap-2", "sm:gap-6"], [3, "product", "isPriority"], [1, "mt-12", "flex", "justify-center"], [3, "quickView", "product", "isPriority"], [3, "pages", "currentPage"], [1, "block", "py-2", "px-3", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-700", "transition", "text-sm", 3, "routerLink"], [1, "modal-box", "relative", "max-w-4xl", "bg-white", "dark:bg-gray-800", "rounded-3xl", "p-0", "overflow-hidden", "shadow-2xl"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-4", "top-4", "z-10", "bg-white/50", "backdrop-blur-md", 3, "click"], [1, "flex", "flex-col", "md:flex-row", "h-full"], ["method", "dialog", 1, "modal-backdrop", "bg-black/50", "backdrop-blur-sm"], [3, "click"], [1, "w-full", "md:w-1/2", "bg-gray-50", "dark:bg-gray-700/30", "p-8", "flex", "items-center", "justify-center", "relative"], [1, "max-h-[300px]", "object-contain", "drop-shadow-xl", 3, "src", "alt"], [1, "absolute", "top-8", "left-8", "badge", "badge-error", "text-white", "font-bold", "p-3"], [1, "w-full", "md:w-1/2", "p-8", "flex", "flex-col"], [1, "mb-auto"], [1, "font-black", "text-2xl", "md:text-3xl", "mb-2", "text-gray-900", "dark:text-white", "leading-tight"], [1, "flex", "items-baseline", "gap-3", "mb-6"], [1, "text-4xl", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "text-lg", "text-gray-400", "line-through"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "leading-relaxed"], [1, "btn", "btn-primary", "btn-lg", "w-full", "rounded-2xl", "shadow-xl", "shadow-indigo-600/30", "gap-3", 3, "click"], [1, "fas", "fa-shopping-cart"]], template: function ProductsByCategoryPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "input", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "header", 3);
      \u0275\u0275element(4, "div", 4)(5, "div", 5)(6, "div", 6);
      \u0275\u0275elementStart(7, "div", 7)(8, "div", 8);
      \u0275\u0275element(9, "app-breadcrumbs", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "h1", 10);
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p", 11);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 12)(15, "div", 13)(16, "div", 14)(17, "div", 15);
      \u0275\u0275conditionalCreate(18, ProductsByCategoryPage_Conditional_18_Template, 4, 1)(19, ProductsByCategoryPage_Conditional_19_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "label", 16);
      \u0275\u0275element(21, "i", 17);
      \u0275\u0275text(22, " Filtros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 18)(24, "div", 19);
      \u0275\u0275element(25, "i", 20);
      \u0275\u0275elementStart(26, "input", 21);
      \u0275\u0275listener("input", function ProductsByCategoryPage_Template_input_input_26_listener($event) {
        return ctx.onSearch($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "select", 22);
      \u0275\u0275listener("change", function ProductsByCategoryPage_Template_select_change_27_listener($event) {
        return ctx.setSort($event.target.value.split("|")[0], $event.target.value.split("|")[1]);
      });
      \u0275\u0275elementStart(28, "option", 23);
      \u0275\u0275text(29, "M\xE1s Recientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "option", 24);
      \u0275\u0275text(31, "Precio: Menor a Mayor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "option", 25);
      \u0275\u0275text(33, "Precio: Mayor a Menor");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(34, "div", 26)(35, "div", 27);
      \u0275\u0275element(36, "i", 20);
      \u0275\u0275elementStart(37, "input", 28);
      \u0275\u0275listener("input", function ProductsByCategoryPage_Template_input_input_37_listener($event) {
        return ctx.onSearch($event.target.value);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "main", 29);
      \u0275\u0275conditionalCreate(39, ProductsByCategoryPage_Conditional_39_Template, 3, 1, "div", 30)(40, ProductsByCategoryPage_Conditional_40_Template, 1, 1, "is-error", 31)(41, ProductsByCategoryPage_Conditional_41_Template, 2, 1);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(42, "div", 32);
      \u0275\u0275element(43, "label", 33);
      \u0275\u0275elementStart(44, "aside", 34)(45, "div", 35)(46, "h3", 36);
      \u0275\u0275text(47, "Filtros");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "label", 37);
      \u0275\u0275text(49, "\u2715");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "div", 38)(51, "div")(52, "h4", 39);
      \u0275\u0275element(53, "i", 40);
      \u0275\u0275text(54, " Precio ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div", 41)(56, "div", 42)(57, "label", 43);
      \u0275\u0275text(58, "M\xEDnimo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "div", 27)(60, "span", 44);
      \u0275\u0275text(61, "$");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "input", 45);
      \u0275\u0275listener("ngModelChange", function ProductsByCategoryPage_Template_input_ngModelChange_62_listener($event) {
        return ctx.minPriceInput.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(63, "div", 42)(64, "label", 43);
      \u0275\u0275text(65, "M\xE1ximo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "div", 27)(67, "span", 44);
      \u0275\u0275text(68, "$");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "input", 46);
      \u0275\u0275listener("ngModelChange", function ProductsByCategoryPage_Template_input_ngModelChange_69_listener($event) {
        return ctx.maxPriceInput.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(70, "button", 47);
      \u0275\u0275listener("click", function ProductsByCategoryPage_Template_button_click_70_listener() {
        return ctx.applyPriceFilter();
      });
      \u0275\u0275text(71, " Aplicar ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(72, "div")(73, "h4", 39);
      \u0275\u0275element(74, "i", 48);
      \u0275\u0275text(75, " Otras Secciones ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "div", 49)(77, "ul", 50);
      \u0275\u0275conditionalCreate(78, ProductsByCategoryPage_Conditional_78_Template, 2, 0);
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275conditionalCreate(79, ProductsByCategoryPage_Conditional_79_Template, 8, 1, "div", 51);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_5_0;
      \u0275\u0275advance(9);
      \u0275\u0275property("items", ctx.breadcrumbItems());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ((tmp_1_0 = ctx.currentCategory()) == null ? null : tmp_1_0.name) || "Explorando Categor\xEDa", " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx.currentCategory()) == null ? null : tmp_2_0.description) || "Encontr\xE1 los mejores productos de esta secci\xF3n con calidad garantizada.", " ");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.productsRs.value() ? 18 : 19);
      \u0275\u0275advance(8);
      \u0275\u0275property("defaultValue", ctx.searchQuery())("placeholder", "Buscar en " + (((tmp_5_0 = ctx.currentCategory()) == null ? null : tmp_5_0.name) || "esta secci\xF3n") + "...");
      \u0275\u0275advance(11);
      \u0275\u0275property("defaultValue", ctx.searchQuery());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.productsRs.isLoading() ? 39 : ctx.productsRs.error() ? 40 : ctx.productsRs.value() ? 41 : -1);
      \u0275\u0275advance(23);
      \u0275\u0275property("ngModel", ctx.minPriceInput());
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.maxPriceInput());
      \u0275\u0275advance(9);
      \u0275\u0275conditional(ctx.categoriesListRs.value() ? 78 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isQuickViewOpen() ? 79 : -1);
    }
  }, dependencies: [
    CommonModule,
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
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    BreadcrumbsComponent,
    CurrencyPipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsByCategoryPage, [{
    type: Component,
    args: [{ selector: "products-by-category-page", imports: [
      CommonModule,
      IsErrorComponent,
      ProductCard,
      Pagination,
      RouterModule,
      FormsModule,
      BreadcrumbsComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Mobile Filter Drawer Wrapper -->\r
<div class="drawer lg:drawer-open">\r
  <input id="cat-filters-drawer" type="checkbox" class="drawer-toggle" />\r
  \r
  <div class="drawer-content flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">\r
    <!-- DYNAMIC HERO -->\r
    <header class="relative bg-gray-900 text-white overflow-hidden isolate">\r
       <div class="absolute inset-0 bg-linear-to-br from-indigo-900 via-blue-950 to-slate-900 opacity-90 pointer-events-none"></div>\r
       <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>\r
       <div class="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 pointer-events-none"></div>\r
\r
       <div class="relative container mx-auto px-4 py-8 lg:py-12 text-center">\r
           <div class="flex justify-center mb-6">\r
                <app-breadcrumbs [items]="breadcrumbItems()" classes="justify-center !text-indigo-200" activeClasses="!text-white"></app-breadcrumbs>\r
            </div>\r
\r
            <h1 class="text-4xl md:text-5xl font-black mb-6 tracking-tight animate-fade-in-up">\r
                {{ currentCategory()?.name || 'Explorando Categor\xEDa' }}\r
            </h1>\r
            \r
            <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">\r
                 {{ currentCategory()?.description || 'Encontr\xE1 los mejores productos de esta secci\xF3n con calidad garantizada.' }}\r
            </p>\r
       </div>\r
    </header>\r
\r
    <!-- MAIN CONTENT -->\r
    <div class="flex-1 container mx-auto px-4 py-12">\r
         <!-- Toolbar -->\r
         <div class="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4">\r
            <div class="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">\r
                <div class="text-gray-600 dark:text-gray-400 font-medium text-sm">\r
                     @if (productsRs.value()) {\r
                        Mostrando <span class="text-gray-900 dark:text-white font-bold">{{ productsRs.value()?.items }}</span> resultados\r
                      } @else {\r
                        Cargando cat\xE1logo...\r
                      }\r
                </div>\r
                \r
                <label for="cat-filters-drawer" class="btn btn-sm btn-outline rounded-full w-full sm:w-auto lg:hidden">\r
                    <i class="fas fa-sliders-h mr-2"></i> Filtros\r
                </label>\r
            </div>\r
            \r
             <div class="flex items-center gap-3">\r
                 <!-- Search in Category -->\r
                 <div class="relative hidden md:block">\r
                     <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>\r
                     <input \r
                         [defaultValue]="searchQuery()" \r
                         (input)="onSearch($any($event.target).value)"\r
                         type="text" \r
                         [placeholder]="'Buscar en ' + (currentCategory()?.name || 'esta secci\xF3n') + '...'" \r
                         class="input input-bordered input-sm rounded-full pl-9 w-64 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"\r
                     />\r
                 </div>\r
\r
                <select (change)="setSort($any($event.target).value.split('|')[0], $any($event.target).value.split('|')[1])"\r
                    class="select select-bordered select-sm rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 min-w-[150px]">\r
                    <option value="created_at|desc">M\xE1s Recientes</option>\r
                    <option value="price|asc">Precio: Menor a Mayor</option>\r
                    <option value="price|desc">Precio: Mayor a Menor</option>\r
                </select>\r
            </div>\r
         </div>\r
         \r
         <!-- Mobile Search Block (Visible only on mobile) -->\r
         <div class="md:hidden mb-6">\r
             <div class="relative">\r
                 <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>\r
                 <input \r
                     [defaultValue]="searchQuery()" \r
                     (input)="onSearch($any($event.target).value)"\r
                     type="text" \r
                     placeholder="Buscar en esta categor\xEDa..." \r
                     class="input input-bordered w-full rounded-2xl pl-10"\r
                 />\r
             </div>\r
         </div>\r
\r
         <!-- GRID -->\r
         <main class="min-h-[400px]">\r
            @if (productsRs.isLoading()) {\r
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">\r
                    @for(i of [1,2,3,4,5,6]; track i) {\r
                        <div class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-3xl h-[400px] w-full"></div>\r
                    }\r
                 </div>\r
            } @else if (productsRs.error()) {\r
                 <is-error [message]="productsRs.error()?.message || 'Error al cargar categor\xEDa'" />\r
            } @else if (productsRs.value()) {\r
                 @if (productsRs.value()?.items === 0) {\r
                     <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">\r
                         <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>\r
                         <h3 class="font-bold text-lg text-gray-900 dark:text-white">Sin resultados en esta categor\xEDa</h3>\r
                         <button (click)="onSearch(''); minPriceInput.set(null); maxPriceInput.set(null); applyPriceFilter()" class="btn btn-link text-indigo-600">\r
                             Ver todos los productos\r
                         </button>\r
                     </div>\r
                 } @else {\r
                     <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-6">\r
                        @for (product of productsRs.value()!.data; track product.id; let i = $index) {\r
                            <product-card [product]="product" [isPriority]="i < 2" (quickView)="openQuickView($event)"></product-card>\r
                        }\r
                     </div>\r
\r
                     @if (paginationData()) {\r
                        <div class="mt-12 flex justify-center">\r
                            <pagination [pages]="paginationData()!.pages" [currentPage]="paginationService.currentPage()"></pagination>\r
                        </div>\r
                     }\r
                 }\r
            }\r
         </main>\r
    </div>\r
  </div>\r
\r
  <!-- SIDEBAR (Filters) -->\r
  <div class="drawer-side z-40">\r
    <label for="cat-filters-drawer" aria-label="close sidebar" class="drawer-overlay backdrop-blur-sm"></label>\r
    <aside class="menu p-6 w-80 min-h-full bg-white dark:bg-gray-800 text-base-content border-r border-gray-200 dark:border-gray-700">\r
        <div class="flex justify-between items-center mb-8">\r
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Filtros</h3>\r
            <label for="cat-filters-drawer" class="btn btn-sm btn-circle btn-ghost cursor-pointer">\u2715</label>\r
        </div>\r
\r
        <div class="space-y-8">\r
            <!-- Price -->\r
            <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">\r
                    <i class="fas fa-tag text-indigo-500"></i> Precio\r
                </h4>\r
                <div class="flex flex-col gap-3">\r
                    <div class="form-control w-full">\r
                        <label class="label text-xs text-gray-500">M\xEDnimo</label>\r
                        <div class="relative">\r
                            <span class="absolute left-3 top-3 text-gray-400">$</span>\r
                            <input type="number" [ngModel]="minPriceInput()" (ngModelChange)="minPriceInput.set($event)" placeholder="0" class="input input-bordered w-full pl-8 rounded-xl" />\r
                        </div>\r
                    </div>\r
                    <div class="form-control w-full">\r
                        <label class="label text-xs text-gray-500">M\xE1ximo</label>\r
                        <div class="relative">\r
                             <span class="absolute left-3 top-3 text-gray-400">$</span>\r
                            <input type="number" [ngModel]="maxPriceInput()" (ngModelChange)="maxPriceInput.set($event)" placeholder="Max" class="input input-bordered w-full pl-8 rounded-xl" />\r
                        </div>\r
                    </div>\r
                   <button (click)="applyPriceFilter()" class="btn btn-primary w-full mt-2 rounded-xl">\r
                        Aplicar\r
                    </button>\r
                </div>\r
            </div>\r
\r
            <!-- Other Categories -->\r
             <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">\r
                    <i class="fas fa-layer-group text-indigo-500"></i> Otras Secciones\r
                </h4>\r
                <div class="max-h-60 overflow-y-auto custom-scrollbar">\r
                    <ul class="space-y-1">\r
                        @if (categoriesListRs.value()) {\r
                            @for (cat of categoriesListRs.value()!.data; track cat.id) {\r
                                <li>\r
                                    <a [routerLink]="['/productos/categoria', cat.slug]" \r
                                       [class.active]="currentCategory()?.id === cat.id"\r
                                       class="block py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm">\r
                                        {{ cat.name }}\r
                                    </a>\r
                                </li>\r
                            }\r
                        }\r
                    </ul>\r
                </div>\r
             </div>\r
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
            <div class="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700/30 p-8 flex items-center justify-center relative">\r
                <img [src]="p.image_url || 'assets/img/no-image.png'" class="max-h-[300px] object-contain drop-shadow-xl" [alt]="p.name"/>\r
                @if((p.stock ?? 0) <= 0) {\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsByCategoryPage, { className: "ProductsByCategoryPage", filePath: "src/app/public/products/pages/by-category/products-by-category-page.ts", lineNumber: 49 });
})();
var products_by_category_page_default = ProductsByCategoryPage;
export {
  ProductsByCategoryPage,
  products_by_category_page_default as default
};
//# sourceMappingURL=chunk-AZI7AS73.js.map
