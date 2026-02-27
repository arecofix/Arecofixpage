import './polyfills.server.mjs';
import {
  AdminProductService
} from "./chunk-2STRLRHX.mjs";
import "./chunk-WPRKDIZO.mjs";
import "./chunk-XL3PKKWP.mjs";
import "./chunk-XSIYETXB.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-EBVHUSN7.mjs";
import {
  Pagination
} from "./chunk-SHK6HTUA.mjs";
import "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  CurrencyPipe,
  SlicePipe
} from "./chunk-NQCCIK3J.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind3,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/admin/inventory/admin-inventory-page.ts
var _c0 = (a0) => ["/admin/products", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminInventoryPage_For_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r1 = ctx.$implicit;
    \u0275\u0275property("value", cat_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r1.name);
  }
}
function AdminInventoryPage_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "span", 44);
    \u0275\u0275elementEnd();
  }
}
function AdminInventoryPage_Conditional_70_For_16_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 66);
    \u0275\u0275text(1, "Agotado");
    \u0275\u0275elementEnd();
  }
}
function AdminInventoryPage_Conditional_70_For_16_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1, "Bajo");
    \u0275\u0275elementEnd();
  }
}
function AdminInventoryPage_Conditional_70_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 51)(1, "td")(2, "div", 56)(3, "div", 57)(4, "div", 58);
    \u0275\u0275element(5, "img", 59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "div", 60);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(9, "td")(10, "div", 61);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 62);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "slice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 63);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 49)(18, "div", 64)(19, "span", 65);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, AdminInventoryPage_Conditional_70_For_16_Conditional_21_Template, 2, 0, "span", 66)(22, AdminInventoryPage_Conditional_70_For_16_Conditional_22_Template, 2, 0, "span", 67);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "td")(24, "div", 68);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td", 50)(27, "a", 69);
    \u0275\u0275element(28, "i", 70);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("src", product_r2.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r2.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r2.sku || "---");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Marca: ", product_r2.brand_id ? \u0275\u0275pipeBind3(14, 19, product_r2.brand_id, 0, 5) : "Gen\xE9rica");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.getCategoryName(product_r2.category_id));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-error", product_r2.stock === 0)("text-warning", product_r2.stock > 0 && product_r2.stock <= (product_r2.min_stock_alert || 5))("text-success", product_r2.stock > (product_r2.min_stock_alert || 5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r2.stock, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(product_r2.stock === 0 ? 21 : product_r2.stock <= (product_r2.min_stock_alert || 5) ? 22 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("badge-success", product_r2.is_active)("badge-ghost", !product_r2.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r2.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(23, _c0, product_r2.id));
  }
}
function AdminInventoryPage_Conditional_70_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 71)(2, "div", 57)(3, "div", 72);
    \u0275\u0275element(4, "img", 59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 73)(6, "h3", 74);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 75);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 76)(11, "div")(12, "span", 77);
    \u0275\u0275text(13, "Stock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 78);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "a", 79);
    \u0275\u0275element(17, "i", 80);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("src", product_r4.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r4.sku);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-error", product_r4.stock === 0)("text-warning", product_r4.stock > 0 && product_r4.stock <= 5)("text-success", !product_r4.stock || product_r4.stock > 5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(product_r4.stock);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(11, _c0, product_r4.id));
  }
}
function AdminInventoryPage_Conditional_70_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275element(1, "pagination", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r2.totalPages())("currentPage", ctx_r2.currentPage());
  }
}
function AdminInventoryPage_Conditional_70_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275element(1, "i", 82);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No se encontraron productos con estos filtros.");
    \u0275\u0275elementEnd()();
  }
}
function AdminInventoryPage_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "table", 46)(2, "thead", 47)(3, "tr", 48)(4, "th");
    \u0275\u0275text(5, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "SKU / Marca");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 49);
    \u0275\u0275text(9, "Stock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 50);
    \u0275\u0275text(13, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, AdminInventoryPage_Conditional_70_For_16_Template, 29, 25, "tr", 51, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 52);
    \u0275\u0275repeaterCreate(18, AdminInventoryPage_Conditional_70_For_19_Template, 18, 13, "div", 53, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, AdminInventoryPage_Conditional_70_Conditional_20_Template, 2, 2, "div", 54);
    \u0275\u0275conditionalCreate(21, AdminInventoryPage_Conditional_70_Conditional_21_Template, 4, 0, "div", 55);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r2.paginatedProducts());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.paginatedProducts());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.filteredProducts().length > 0 ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.filteredProducts().length === 0 ? 21 : -1);
  }
}
var AdminInventoryPage = class _AdminInventoryPage {
  productService = inject(AdminProductService);
  route = inject(ActivatedRoute);
  // Signals
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Filter & Sort
  categories = signal([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  sortOrder = signal("stock_asc", ...ngDevMode ? [{ debugName: "sortOrder" }] : []);
  filterStatus = signal("all", ...ngDevMode ? [{ debugName: "filterStatus" }] : []);
  selectedCategoryId = signal("all", ...ngDevMode ? [{ debugName: "selectedCategoryId" }] : []);
  // Pagination
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  itemsPerPage = signal(15, ...ngDevMode ? [{ debugName: "itemsPerPage" }] : []);
  // Computed: Filtered & Sorted
  filteredProducts = computed(() => {
    let result = this.products();
    const query = this.searchQuery().toLowerCase();
    const status = this.filterStatus();
    if (status === "low_stock") {
      result = result.filter((p) => p.stock > 0 && p.stock <= (p.min_stock_alert || 5));
    } else if (status === "out_of_stock") {
      result = result.filter((p) => p.stock === 0);
    }
    if (this.selectedCategoryId() !== "all") {
      result = result.filter((p) => p.category_id === this.selectedCategoryId());
    }
    if (query) {
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query));
    }
    const sort = this.sortOrder();
    return result.sort((a, b) => {
      switch (sort) {
        case "stock_asc":
          return a.stock - b.stock;
        case "stock_desc":
          return b.stock - a.stock;
        case "price_asc":
          return a.price - b.price;
        case "name_asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, ...ngDevMode ? [{ debugName: "filteredProducts" }] : []);
  // Computed: Paginated Slice
  paginatedProducts = computed(() => {
    const all = this.filteredProducts();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  }, ...ngDevMode ? [{ debugName: "paginatedProducts" }] : []);
  // Computed: Total Pages
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage());
  }, ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  // Computed: Stats
  stats = computed(() => {
    const all = this.products();
    return {
      total: all.length,
      lowStock: all.filter((p) => p.stock > 0 && p.stock <= (p.min_stock_alert || 5)).length,
      outOfStock: all.filter((p) => p.stock === 0).length,
      totalValue: all.reduce((sum, p) => sum + p.price * p.stock, 0)
    };
  }, ...ngDevMode ? [{ debugName: "stats" }] : []);
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["_page"])
        this.currentPage.set(Number(params["_page"]));
    });
    await Promise.all([
      this.loadInventory(),
      this.loadCategories()
    ]);
  }
  async loadCategories() {
    try {
      const cats = await this.productService.getCategories();
      this.categories.set(cats);
    } catch (e) {
      console.error("Error loading categories", e);
    }
  }
  async loadInventory() {
    this.loading.set(true);
    try {
      const data = await this.productService.getProducts();
      this.products.set(data);
    } catch (e) {
      this.error.set(e.message || "Error al cargar inventario");
    } finally {
      this.loading.set(false);
    }
  }
  // Helpers
  getCategoryName(id) {
    if (!id)
      return "Sin categor\xEDa";
    const cat = this.categories().find((c) => c.id === id);
    return cat ? cat.name : "ID: " + id.slice(0, 5);
  }
  updateSort(event) {
    this.sortOrder.set(event.target.value);
  }
  static \u0275fac = function AdminInventoryPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminInventoryPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminInventoryPage, selectors: [["app-admin-inventory-page"]], decls: 71, vars: 20, consts: [[1, "max-w-7xl", "mx-auto", "pb-20", "p-4"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "md:items-center", "py-6", "gap-4", "border-b", "border-gray-200", "dark:border-gray-800", "mb-6"], [1, "text-3xl", "font-bold", "text-gray-800", "dark:text-white", "flex", "items-center", "gap-3"], [1, "fas", "fa-boxes", "text-primary"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "flex", "gap-2", "w-full", "md:w-auto"], ["routerLink", "/admin/purchases/new", 1, "btn", "btn-primary", "w-full", "md:w-auto", "shadow-lg", "shadow-primary/20"], [1, "fas", "fa-cart-plus", "mr-2"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-4", "mb-8"], [1, "stats", "shadow", "bg-white", "dark:bg-gray-800", "border", "border-gray-100", "dark:border-gray-700"], [1, "stat"], [1, "stat-figure", "text-primary"], [1, "fas", "fa-cube", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider"], [1, "stat-value", "text-primary"], [1, "stat-figure", "text-error"], [1, "fas", "fa-exclamation-circle", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider", "text-error"], [1, "stat-value", "text-error"], [1, "stat-figure", "text-warning"], [1, "fas", "fa-thermometer-quarter", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider", "text-warning"], [1, "stat-value", "text-warning"], [1, "stat-figure", "text-success"], [1, "fas", "fa-dollar-sign", "text-3xl", "opacity-50"], [1, "stat-value", "text-success", "text-2xl"], [1, "stat-desc"], [1, "flex", "flex-col", "lg:flex-row", "gap-4", "mb-6", "bg-white", "dark:bg-gray-800", "p-4", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "flex-1"], [1, "relative"], [1, "fas", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-gray-400"], ["type", "text", "placeholder", "Buscar producto...", 1, "input", "input-bordered", "w-full", "pl-10", 3, "ngModelChange", "ngModel"], [1, "join", "w-full", "lg:w-auto"], ["type", "radio", "name", "options", "aria-label", "Todos", 1, "join-item", "btn", 3, "click", "checked"], ["type", "radio", "name", "options", "aria-label", "Stock Bajo", 1, "join-item", "btn", 3, "click", "checked"], ["type", "radio", "name", "options", "aria-label", "Agotados", 1, "join-item", "btn", 3, "click", "checked"], [1, "select", "select-bordered", "w-full", "lg:w-48", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], [1, "select", "select-bordered", "w-full", "lg:w-auto", 3, "change", "ngModel"], ["value", "stock_asc"], ["value", "stock_desc"], ["value", "name_asc"], [1, "flex", "justify-center", "p-12"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "hidden", "md:block", "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-lg", "overflow-hidden", "border", "border-gray-100", "dark:border-gray-700"], [1, "table", "w-full"], [1, "bg-gray-50", "dark:bg-gray-700/50"], [1, "text-gray-600", "dark:text-gray-300", "font-bold", "uppercase", "text-xs", "tracking-wider"], [1, "text-center"], [1, "text-right"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors"], [1, "md:hidden", "grid", "grid-cols-1", "gap-4"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "mt-8", "flex", "justify-center", "pb-8"], [1, "text-center", "py-20", "opacity-50"], [1, "flex", "items-center", "gap-4"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12", "bg-gray-100", "dark:bg-gray-700"], [1, "object-cover", 3, "src"], [1, "font-bold", "text-gray-900", "dark:text-white", "line-clamp-1"], [1, "font-mono", "text-xs"], [1, "text-xs", "text-gray-400"], [1, "text-xs", "text-info", "font-semibold"], [1, "flex", "flex-col", "items-center"], [1, "font-bold", "text-lg"], [1, "badge", "badge-error", "badge-xs"], [1, "badge", "badge-warning", "badge-xs"], [1, "badge", "badge-sm"], [1, "btn", "btn-sm", "btn-ghost", "text-indigo-500", 3, "routerLink"], [1, "fas", "fa-edit"], [1, "card-body", "p-4", "flex-row", "gap-4"], [1, "w-16", "h-16", "rounded-xl", "bg-gray-100"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-gray-900", "dark:text-white", "truncate"], [1, "text-xs", "text-gray-500", "font-mono", "mb-2"], [1, "flex", "justify-between", "items-end"], [1, "text-xs", "block", "text-gray-400"], [1, "text-xl", "font-bold"], [1, "btn", "btn-circle", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit", "text-indigo-500"], [3, "pages", "currentPage"], [1, "fas", "fa-search", "text-4xl", "mb-3"]], template: function AdminInventoryPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Control de Stock ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, "Monitorea niveles de stock y valor de inventario.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "a", 6);
      \u0275\u0275element(10, "i", 7);
      \u0275\u0275text(11, " Registrar Compra ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "div", 8)(13, "div", 9)(14, "div", 10)(15, "div", 11);
      \u0275\u0275element(16, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 13);
      \u0275\u0275text(18, "Total Items");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 14);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 9)(22, "div", 10)(23, "div", 15);
      \u0275\u0275element(24, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 17);
      \u0275\u0275text(26, "Agotados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 18);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "div", 9)(30, "div", 10)(31, "div", 19);
      \u0275\u0275element(32, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 21);
      \u0275\u0275text(34, "Stock Bajo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 22);
      \u0275\u0275text(36);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(37, "div", 9)(38, "div", 10)(39, "div", 23);
      \u0275\u0275element(40, "i", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 13);
      \u0275\u0275text(42, "Valor Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 25);
      \u0275\u0275text(44);
      \u0275\u0275pipe(45, "currency");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "div", 26);
      \u0275\u0275text(47, "Estimado en precio venta");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(48, "div", 27)(49, "div", 28)(50, "div", 29);
      \u0275\u0275element(51, "i", 30);
      \u0275\u0275elementStart(52, "input", 31);
      \u0275\u0275listener("ngModelChange", function AdminInventoryPage_Template_input_ngModelChange_52_listener($event) {
        return ctx.searchQuery.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(53, "div", 32)(54, "input", 33);
      \u0275\u0275listener("click", function AdminInventoryPage_Template_input_click_54_listener() {
        return ctx.filterStatus.set("all");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "input", 34);
      \u0275\u0275listener("click", function AdminInventoryPage_Template_input_click_55_listener() {
        return ctx.filterStatus.set("low_stock");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "input", 35);
      \u0275\u0275listener("click", function AdminInventoryPage_Template_input_click_56_listener() {
        return ctx.filterStatus.set("out_of_stock");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "select", 36);
      \u0275\u0275listener("ngModelChange", function AdminInventoryPage_Template_select_ngModelChange_57_listener($event) {
        return ctx.selectedCategoryId.set($event);
      });
      \u0275\u0275elementStart(58, "option", 37);
      \u0275\u0275text(59, "Todas las Categor\xEDas");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(60, AdminInventoryPage_For_61_Template, 2, 2, "option", 38, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "select", 39);
      \u0275\u0275listener("change", function AdminInventoryPage_Template_select_change_62_listener($event) {
        return ctx.updateSort($event);
      });
      \u0275\u0275elementStart(63, "option", 40);
      \u0275\u0275text(64, "Menor Stock Primero");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "option", 41);
      \u0275\u0275text(66, "Mayor Stock Primero");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "option", 42);
      \u0275\u0275text(68, "Nombre (A-Z)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(69, AdminInventoryPage_Conditional_69_Template, 2, 0, "div", 43)(70, AdminInventoryPage_Conditional_70_Template, 22, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(20);
      \u0275\u0275textInterpolate(ctx.stats().total);
      \u0275\u0275advance();
      \u0275\u0275classProp("border-error", ctx.stats().outOfStock > 0);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.stats().outOfStock);
      \u0275\u0275advance();
      \u0275\u0275classProp("border-warning", ctx.stats().lowStock > 0);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.stats().lowStock);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(45, 15, ctx.stats().totalValue, "ARS", "symbol", "1.0-0"));
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(2);
      \u0275\u0275property("checked", ctx.filterStatus() === "all");
      \u0275\u0275advance();
      \u0275\u0275property("checked", ctx.filterStatus() === "low_stock");
      \u0275\u0275advance();
      \u0275\u0275property("checked", ctx.filterStatus() === "out_of_stock");
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.selectedCategoryId());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.categories());
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.sortOrder());
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.loading() ? 69 : 70);
    }
  }, dependencies: [CommonModule, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Pagination, SlicePipe, CurrencyPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminInventoryPage, [{
    type: Component,
    args: [{ selector: "app-admin-inventory-page", standalone: true, imports: [CommonModule, RouterLink, FormsModule, Pagination], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="max-w-7xl mx-auto pb-20 p-4">\r
\r
  <!-- Header -->\r
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">\r
    <div>\r
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">\r
        <i class="fas fa-boxes text-primary"></i> Control de Stock\r
      </h1>\r
      <p class="text-sm text-gray-500 dark:text-gray-400">Monitorea niveles de stock y valor de inventario.</p>\r
    </div>\r
\r
    <div class="flex gap-2 w-full md:w-auto">\r
      <a routerLink="/admin/purchases/new" class="btn btn-primary w-full md:w-auto shadow-lg shadow-primary/20">\r
        <i class="fas fa-cart-plus mr-2"></i> Registrar Compra\r
      </a>\r
    </div>\r
  </div>\r
\r
  <!-- Stats Cards -->\r
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">\r
    <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">\r
      <div class="stat">\r
        <div class="stat-figure text-primary">\r
          <i class="fas fa-cube text-3xl opacity-50"></i>\r
        </div>\r
        <div class="stat-title text-xs uppercase tracking-wider">Total Items</div>\r
        <div class="stat-value text-primary">{{ stats().total }}</div>\r
      </div>\r
    </div>\r
\r
    <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"\r
      [class.border-error]="stats().outOfStock > 0">\r
      <div class="stat">\r
        <div class="stat-figure text-error">\r
          <i class="fas fa-exclamation-circle text-3xl opacity-50"></i>\r
        </div>\r
        <div class="stat-title text-xs uppercase tracking-wider text-error">Agotados</div>\r
        <div class="stat-value text-error">{{ stats().outOfStock }}</div>\r
      </div>\r
    </div>\r
\r
    <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"\r
      [class.border-warning]="stats().lowStock > 0">\r
      <div class="stat">\r
        <div class="stat-figure text-warning">\r
          <i class="fas fa-thermometer-quarter text-3xl opacity-50"></i>\r
        </div>\r
        <div class="stat-title text-xs uppercase tracking-wider text-warning">Stock Bajo</div>\r
        <div class="stat-value text-warning">{{ stats().lowStock }}</div>\r
      </div>\r
    </div>\r
\r
    <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">\r
      <div class="stat">\r
        <div class="stat-figure text-success">\r
          <i class="fas fa-dollar-sign text-3xl opacity-50"></i>\r
        </div>\r
        <div class="stat-title text-xs uppercase tracking-wider">Valor Total</div>\r
        <div class="stat-value text-success text-2xl">{{ stats().totalValue | currency:'ARS':'symbol':'1.0-0' }}</div>\r
        <div class="stat-desc">Estimado en precio venta</div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- Controls Bar -->\r
  <div class="flex flex-col lg:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">\r
    <!-- Search -->\r
    <div class="flex-1">\r
      <div class="relative">\r
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>\r
        <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"\r
          placeholder="Buscar producto..."\r
          class="input input-bordered w-full pl-10" />\r
        </div>\r
      </div>\r
\r
      <!-- Filter Tabs (Segmented Control) -->\r
      <div class="join w-full lg:w-auto">\r
        <input class="join-item btn" type="radio" name="options" aria-label="Todos"\r
          [checked]="filterStatus() === 'all'" (click)="filterStatus.set('all')" />\r
          <input class="join-item btn" type="radio" name="options" aria-label="Stock Bajo"\r
            [checked]="filterStatus() === 'low_stock'" (click)="filterStatus.set('low_stock')" />\r
            <input class="join-item btn" type="radio" name="options" aria-label="Agotados"\r
              [checked]="filterStatus() === 'out_of_stock'" (click)="filterStatus.set('out_of_stock')" />\r
            </div>\r
\r
            <!-- Category Filter -->\r
            <select [ngModel]="selectedCategoryId()" (ngModelChange)="selectedCategoryId.set($event)" \r
              class="select select-bordered w-full lg:w-48">\r
              <option value="all">Todas las Categor\xEDas</option>\r
              @for (cat of categories(); track cat.id) {\r
                <option [value]="cat.id">{{ cat.name }}</option>\r
              }\r
            </select>\r
\r
            <!-- Sort -->\r
            <select [ngModel]="sortOrder()" (change)="updateSort($event)" class="select select-bordered w-full lg:w-auto">\r
              <option value="stock_asc">Menor Stock Primero</option>\r
              <option value="stock_desc">Mayor Stock Primero</option>\r
              <option value="name_asc">Nombre (A-Z)</option>\r
            </select>\r
          </div>\r
\r
          <!-- Content -->\r
          @if (loading()) {\r
            <div class="flex justify-center p-12">\r
              <span class="loading loading-spinner loading-lg text-primary"></span>\r
            </div>\r
          } @else {\r
\r
            <!-- Desktop Table -->\r
            <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">\r
              <table class="table w-full">\r
                <thead class="bg-gray-50 dark:bg-gray-700/50">\r
                  <tr class="text-gray-600 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">\r
                    <th>Producto</th>\r
                    <th>SKU / Marca</th>\r
                    <th class="text-center">Stock</th>\r
                    <th>Estado</th>\r
                    <th class="text-right">Acciones</th>\r
                  </tr>\r
                </thead>\r
                <tbody>\r
                  @for (product of paginatedProducts(); track product.id) {\r
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">\r
                      <td>\r
                        <div class="flex items-center gap-4">\r
                          <div class="avatar">\r
                            <div class="mask mask-squircle w-12 h-12 bg-gray-100 dark:bg-gray-700">\r
                              <img [src]="product.image_url || 'assets/img/no-image.png'" class="object-cover" />\r
                            </div>\r
                          </div>\r
                          <div>\r
                            <div class="font-bold text-gray-900 dark:text-white line-clamp-1">{{ product.name }}</div>\r
                          </div>\r
                        </div>\r
                      </td>\r
                      <td>\r
                        <div class="font-mono text-xs">{{ product.sku || '---' }}</div>\r
                        <div class="text-xs text-gray-400">Marca: {{ product.brand_id ? (product.brand_id | slice:0:5) : 'Gen\xE9rica' }}</div>\r
                        <div class="text-xs text-info font-semibold">{{ getCategoryName(product.category_id) }}</div>\r
                      </td>\r
                      <td class="text-center">\r
                        <div class="flex flex-col items-center">\r
                          <span class="font-bold text-lg"\r
                            [class.text-error]="product.stock === 0"\r
                            [class.text-warning]="product.stock > 0 && product.stock <= (product.min_stock_alert||5)"\r
                            [class.text-success]="product.stock > (product.min_stock_alert||5)">\r
                            {{ product.stock }}\r
                          </span>\r
                          @if(product.stock === 0) {\r
                            <span class="badge badge-error badge-xs">Agotado</span>\r
                          } @else if(product.stock <= (product.min_stock_alert||5)) {\r
                            <span class="badge badge-warning badge-xs">Bajo</span>\r
                          }\r
                        </div>\r
                      </td>\r
                      <td>\r
                        <div class="badge badge-sm" [class.badge-success]="product.is_active" [class.badge-ghost]="!product.is_active">\r
                          {{ product.is_active ? 'Activo' : 'Inactivo' }}\r
                        </div>\r
                      </td>\r
                      <td class="text-right">\r
                        <a [routerLink]="['/admin/products', product.id]" class="btn btn-sm btn-ghost text-indigo-500">\r
                          <i class="fas fa-edit"></i>\r
                        </a>\r
                      </td>\r
                    </tr>\r
                  }\r
                </tbody>\r
              </table>\r
            </div>\r
\r
            <!-- Mobile Cards -->\r
            <div class="md:hidden grid grid-cols-1 gap-4">\r
              @for (product of paginatedProducts(); track product.id) {\r
                <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">\r
                  <div class="card-body p-4 flex-row gap-4">\r
                    <div class="avatar">\r
                      <div class="w-16 h-16 rounded-xl bg-gray-100">\r
                        <img [src]="product.image_url || 'assets/img/no-image.png'" class="object-cover" />\r
                      </div>\r
                    </div>\r
                    <div class="flex-1 min-w-0">\r
                      <h3 class="font-bold text-gray-900 dark:text-white truncate">{{ product.name }}</h3>\r
                      <div class="text-xs text-gray-500 font-mono mb-2">{{ product.sku }}</div>\r
\r
                      <div class="flex justify-between items-end">\r
                        <div [class.text-error]="product.stock === 0"\r
                          [class.text-warning]="product.stock > 0 && product.stock <= 5"\r
                          [class.text-success]="!product.stock || product.stock > 5">\r
                          <span class="text-xs block text-gray-400">Stock</span>\r
                          <span class="text-xl font-bold">{{ product.stock }}</span>\r
                        </div>\r
                        <a [routerLink]="['/admin/products', product.id]" class="btn btn-circle btn-sm btn-ghost">\r
                          <i class="fas fa-edit text-indigo-500"></i>\r
                        </a>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              }\r
            </div>\r
\r
            <!-- Pagination -->\r
            @if (filteredProducts().length > 0) {\r
              <div class="mt-8 flex justify-center pb-8">\r
                <pagination [pages]="totalPages()" [currentPage]="currentPage()" />\r
              </div>\r
            }\r
\r
            <!-- Empty State -->\r
            @if (filteredProducts().length === 0) {\r
              <div class="text-center py-20 opacity-50">\r
                <i class="fas fa-search text-4xl mb-3"></i>\r
                <p>No se encontraron productos con estos filtros.</p>\r
              </div>\r
            }\r
          }\r
        </div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminInventoryPage, { className: "AdminInventoryPage", filePath: "src/app/admin/inventory/admin-inventory-page.ts", lineNumber: 16 });
})();
export {
  AdminInventoryPage
};
//# sourceMappingURL=chunk-Y2VBKQIK.mjs.map
