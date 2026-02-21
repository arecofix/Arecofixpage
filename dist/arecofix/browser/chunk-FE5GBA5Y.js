import {
  Pagination
} from "./chunk-JJNYOOVF.js";
import {
  AuthService
} from "./chunk-65AYZUFN.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-DEVYQMPB.js";
import {
  LoggerService
} from "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  CurrencyPipe,
  Router
} from "./chunk-B7SLUDL7.js";
import {
  Component,
  computed,
  effect,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-4O7IFJFV.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/sales/admin-sales-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminSalesPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "span", 33);
    \u0275\u0275elementEnd();
  }
}
function AdminSalesPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "i", 34);
    \u0275\u0275elementStart(2, "p", 35);
    \u0275\u0275text(3, "No se encontraron productos.");
    \u0275\u0275elementEnd()();
  }
}
function AdminSalesPage_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275listener("click", function AdminSalesPage_Conditional_13_For_2_Template_div_click_0_listener() {
      const product_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addToCart(product_r2));
    });
    \u0275\u0275elementStart(1, "figure", 38);
    \u0275\u0275element(2, "img", 39);
    \u0275\u0275elementStart(3, "div", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 41)(6, "h3", 42);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 43);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 44);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", product_r2.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-warning", product_r2.stock < 5)("badge-primary", product_r2.stock >= 5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r2.stock, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 9, product_r2.price), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r2.sku);
  }
}
function AdminSalesPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275repeaterCreate(1, AdminSalesPage_Conditional_13_For_2_Template, 13, 11, "div", 36, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.paginatedProducts());
  }
}
function AdminSalesPage_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carrito Vac\xEDo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 46);
    \u0275\u0275text(5, "Selecciona productos para empezar.");
    \u0275\u0275elementEnd()();
  }
}
function AdminSalesPage_Conditional_32_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "img", 48);
    \u0275\u0275elementStart(2, "div", 49)(3, "div", 50);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 51)(6, "div", 52);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 53);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 54)(13, "div", 55)(14, "button", 56);
    \u0275\u0275listener("click", function AdminSalesPage_Conditional_32_For_1_Template_button_click_14_listener() {
      const item_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateQuantity(item_r5.id, 1));
    });
    \u0275\u0275element(15, "i", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 58);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 59);
    \u0275\u0275listener("click", function AdminSalesPage_Conditional_32_For_1_Template_button_click_18_listener() {
      const item_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateQuantity(item_r5.id, -1));
    });
    \u0275\u0275element(19, "i", 60);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "button", 61);
    \u0275\u0275listener("click", function AdminSalesPage_Conditional_32_For_1_Template_button_click_20_listener() {
      const item_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.removeFromCart(item_r5.id));
    });
    \u0275\u0275element(21, "i", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", item_r5.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r5.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 5, item_r5.price));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 7, item_r5.price * item_r5.quantity));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(item_r5.quantity);
  }
}
function AdminSalesPage_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminSalesPage_Conditional_32_For_1_Template, 22, 9, "div", 47, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.cart());
  }
}
function AdminSalesPage_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 63);
    \u0275\u0275text(1, " Procesando... ");
  }
}
function AdminSalesPage_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 64);
    \u0275\u0275text(1, " Confirmar Venta ");
  }
}
var AdminSalesPage = class _AdminSalesPage {
  auth = inject(AuthService);
  router = inject(Router);
  logger = inject(LoggerService);
  // Data Signals
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  cart = signal([], ...ngDevMode ? [{ debugName: "cart" }] : []);
  // UI State Signals
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  processing = signal(false, ...ngDevMode ? [{ debugName: "processing" }] : []);
  isCartOpenMobile = signal(false, ...ngDevMode ? [{ debugName: "isCartOpenMobile" }] : []);
  // For mobile responsiveness
  // Pagination Signals
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  itemsPerPage = signal(12, ...ngDevMode ? [{ debugName: "itemsPerPage" }] : []);
  // Computed: Filtered Products
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query));
  }, ...ngDevMode ? [{ debugName: "filteredProducts" }] : []);
  // Computed: Paginated Products
  paginatedProducts = computed(() => {
    const all = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return all.slice(start, start + this.itemsPerPage());
  }, ...ngDevMode ? [{ debugName: "paginatedProducts" }] : []);
  // Computed: Total Pages
  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()), ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  // Computed: Cart Totals
  cartTotal = computed(() => this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0), ...ngDevMode ? [{ debugName: "cartTotal" }] : []);
  cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0), ...ngDevMode ? [{ debugName: "cartCount" }] : []);
  constructor() {
    effect(() => {
      this.searchQuery();
      this.currentPage.set(1);
    });
  }
  async ngOnInit() {
    await this.loadProducts();
  }
  async loadProducts() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data } = await supabase.from("products").select("*").eq("is_active", true).gt("stock", 0).order("name");
    if (data) {
      this.products.set(data);
    }
    this.loading.set(false);
  }
  addToCart(product) {
    this.cart.update((items) => {
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          return items;
        }
        return items.map((i) => i.id === product.id ? __spreadProps(__spreadValues({}, i), { quantity: i.quantity + 1 }) : i);
      }
      return [...items, __spreadProps(__spreadValues({}, product), { quantity: 1 })];
    });
  }
  removeFromCart(productId) {
    this.cart.update((items) => items.filter((i) => i.id !== productId));
  }
  updateQuantity(productId, change) {
    this.cart.update((items) => {
      return items.map((i) => {
        if (i.id === productId) {
          const product = this.products().find((p) => p.id === productId);
          const stock = product?.stock || 0;
          const newQty = i.quantity + change;
          if (newQty > stock)
            return i;
          return newQty > 0 ? __spreadProps(__spreadValues({}, i), { quantity: newQty }) : i;
        }
        return i;
      });
    });
  }
  async checkout() {
    if (this.cart().length === 0)
      return;
    this.processing.set(true);
    const supabase = this.auth.getSupabaseClient();
    const user = this.auth.getCurrentUser();
    try {
      const { data: sale, error: saleError } = await supabase.from("sales").insert({
        staff_id: user?.id,
        total_amount: this.cartTotal(),
        status: "completed",
        payment_method: "cash"
      }).select().single();
      if (saleError)
        throw saleError;
      const saleItems = this.cart().map((item) => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));
      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
      if (itemsError)
        throw itemsError;
      for (const item of this.cart()) {
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          row_id: item.id,
          amount: item.quantity
        });
        if (stockError) {
          const { data: currentProduct } = await supabase.from("products").select("stock").eq("id", item.id).single();
          if (currentProduct) {
            await supabase.from("products").update({ stock: currentProduct.stock - item.quantity }).eq("id", item.id);
          }
        }
      }
      await supabase.from("invoices").insert({
        sale_id: sale.id,
        total_amount: this.cartTotal(),
        type: "B",
        issued_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.cart.set([]);
      this.router.navigate(["/admin/invoices"]);
    } catch (e) {
      this.logger.error("Checkout error", e);
      alert("Error al procesar la venta: " + e.message);
    } finally {
      this.processing.set(false);
    }
  }
  static \u0275fac = function AdminSalesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminSalesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSalesPage, selectors: [["app-admin-sales-page"]], decls: 50, vars: 19, consts: [[1, "h-[calc(100vh-4rem)]", "flex", "flex-col", "md:flex-row", "bg-gray-50", "dark:bg-[#0f172a]", "overflow-hidden"], [1, "flex-1", "flex", "flex-col", "h-full", "overflow-hidden", "relative"], [1, "bg-white", "dark:bg-[#1e293b]", "p-4", "border-b", "border-gray-200", "dark:border-gray-700", "z-10", "shadow-xs", "flex", "flex-col", "sm:flex-row", "justify-between", "items-center", "gap-4"], [1, "text-2xl", "font-bold", "bg-clip-text", "text-transparent", "bg-linear-to-r", "from-blue-500", "to-indigo-500", "flex", "items-center", "gap-2"], [1, "fas", "fa-cash-register", "text-indigo-500"], [1, "w-full", "sm:max-w-md", "relative", "group"], [1, "fas", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-gray-400"], ["type", "text", "placeholder", "Buscar por nombre, SKU, c\xF3digo...", 1, "input", "input-bordered", "w-full", "pl-10", "bg-gray-50", "dark:bg-gray-800", "transition-all", "focus:ring-2", "focus:ring-primary/20", 3, "ngModelChange", "ngModel"], [1, "flex-1", "overflow-y-auto", "p-4", "md:p-6", "custom-scrollbar"], [1, "flex", "justify-center", "py-20"], [1, "flex", "flex-col", "items-center", "justify-center", "h-64", "text-gray-400"], [1, "grid", "grid-cols-2", "sm:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "gap-4"], [1, "mt-8", "flex", "justify-center", "pb-8"], [3, "pages", "currentPage"], [1, "md:hidden", "fixed", "bottom-6", "right-6", "btn", "btn-circle", "btn-primary", "btn-lg", "shadow-2xl", "z-50", 3, "click"], [1, "indicator"], [1, "indicator-item", "badge", "badge-secondary"], [1, "fas", "fa-shopping-cart", "text-2xl"], [1, "fixed", "inset-y-0", "right-0", "z-40", "w-full", "md:relative", "md:w-96", "bg-white", "dark:bg-[#1e293b]", "shadow-2xl", "md:shadow-none", "border-l", "border-gray-200", "dark:border-gray-700", "transform", "transition-transform", "duration-300", "ease-in-out", "flex", "flex-col", "h-full"], [1, "p-4", "border-b", "border-gray-200", "dark:border-gray-700", "bg-gray-50", "dark:bg-gray-800", "flex", "justify-between", "items-center"], [1, "text-xl", "font-bold", "flex", "items-center", "gap-2", "text-gray-800", "dark:text-white"], [1, "fas", "fa-shopping-cart", "text-primary"], [1, "badge", "badge-neutral"], [1, "btn", "btn-circle", "btn-sm", "btn-ghost", "md:hidden", 3, "click"], [1, "fas", "fa-times"], [1, "flex-1", "overflow-y-auto", "p-4", "space-y-3", "custom-scrollbar"], [1, "p-6", "border-t", "border-gray-200", "dark:border-gray-700", "bg-white", "dark:bg-[#1e293b]", "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]", "z-20"], [1, "space-y-4", "mb-6"], [1, "flex", "justify-between", "text-gray-500", "text-sm"], [1, "flex", "justify-between", "items-end"], [1, "text-lg", "font-bold", "text-gray-800", "dark:text-white"], [1, "text-3xl", "font-bold", "text-primary"], [1, "btn", "btn-primary", "w-full", "btn-lg", "shadow-lg", "shadow-blue-500/30", "text-lg", "hover:scale-[1.02]", "active:scale-[0.98]", "transition-all", 3, "click", "disabled"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "fas", "fa-box-open", "text-6xl", "mb-4", "opacity-50"], [1, "text-lg"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "hover:shadow-xl", "hover:border-primary/50", "transition-all", "duration-200", "cursor-pointer", "group", "active:scale-95"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "hover:shadow-xl", "hover:border-primary/50", "transition-all", "duration-200", "cursor-pointer", "group", "active:scale-95", 3, "click"], [1, "px-4", "pt-4", "relative", "aspect-square"], ["alt", "Product", 1, "rounded-xl", "object-contain", "w-full", "h-full", "group-hover:scale-105", "transition-transform", 3, "src"], [1, "absolute", "top-2", "right-2", "badge", "badge-sm"], [1, "card-body", "p-4", "text-center"], [1, "font-bold", "text-sm", "line-clamp-2", "text-gray-800", "dark:text-gray-200", "h-10", "leading-tight"], [1, "mt-2", "text-primary", "font-bold", "text-lg"], [1, "text-xs", "text-gray-400", "font-mono"], [1, "fas", "fa-cart-arrow-down", "text-6xl", "mb-4", "opacity-30"], [1, "text-sm"], [1, "flex", "items-center", "gap-3", "bg-gray-50", "dark:bg-gray-800/50", "p-3", "rounded-xl", "border", "border-gray-100", "dark:border-gray-700", "animate-fade-in", "group", "hover:bg-white", "dark:hover:bg-gray-800", "transition-colors", "shadow-sm"], [1, "w-16", "h-16", "object-cover", "rounded-lg", "bg-white", 3, "src"], [1, "flex-1", "min-w-0"], [1, "font-bold", "text-sm", "text-gray-900", "dark:text-gray-100", "truncate", "mb-1"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-gray-500"], [1, "font-bold", "text-gray-900", "dark:text-white"], [1, "flex", "flex-col", "items-center", "ml-2", "gap-1"], [1, "join", "join-vertical", "shadow-sm"], [1, "btn", "btn-xs", "join-item", "btn-ghost", "text-success", 3, "click"], [1, "fas", "fa-plus"], [1, "join-item", "bg-base-100", "text-xs", "font-bold", "w-6", "h-5", "flex", "items-center", "justify-center", "border-x", "border-base-200"], [1, "btn", "btn-xs", "join-item", "btn-ghost", "text-warning", 3, "click"], [1, "fas", "fa-minus"], [1, "btn", "btn-circle", "btn-ghost", "btn-xs", "text-gray-400", "hover:text-error", "opacity-0", "group-hover:opacity-100", "transition-opacity", 3, "click"], [1, "fas", "fa-trash"], [1, "loading", "loading-spinner"], [1, "fas", "fa-check-circle", "mr-2"]], template: function AdminSalesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h1", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275text(6, " Punto de Venta ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275element(8, "i", 6);
      \u0275\u0275elementStart(9, "input", 7);
      \u0275\u0275listener("ngModelChange", function AdminSalesPage_Template_input_ngModelChange_9_listener($event) {
        return ctx.searchQuery.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 8);
      \u0275\u0275conditionalCreate(11, AdminSalesPage_Conditional_11_Template, 2, 0, "div", 9)(12, AdminSalesPage_Conditional_12_Template, 4, 0, "div", 10)(13, AdminSalesPage_Conditional_13_Template, 3, 0, "div", 11);
      \u0275\u0275elementStart(14, "div", 12);
      \u0275\u0275element(15, "pagination", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "button", 14);
      \u0275\u0275listener("click", function AdminSalesPage_Template_button_click_16_listener() {
        return ctx.isCartOpenMobile.set(true);
      });
      \u0275\u0275elementStart(17, "div", 15)(18, "span", 16);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275element(20, "i", 17);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 18)(22, "div", 19)(23, "h2", 20);
      \u0275\u0275element(24, "i", 21);
      \u0275\u0275text(25, " Carrito ");
      \u0275\u0275elementStart(26, "span", 22);
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "button", 23);
      \u0275\u0275listener("click", function AdminSalesPage_Template_button_click_28_listener() {
        return ctx.isCartOpenMobile.set(false);
      });
      \u0275\u0275element(29, "i", 24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 25);
      \u0275\u0275conditionalCreate(31, AdminSalesPage_Conditional_31_Template, 6, 0, "div", 10)(32, AdminSalesPage_Conditional_32_Template, 2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 26)(34, "div", 27)(35, "div", 28)(36, "span");
      \u0275\u0275text(37, "Subtotal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span");
      \u0275\u0275text(39);
      \u0275\u0275pipe(40, "currency");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "div", 29)(42, "span", 30);
      \u0275\u0275text(43, "Total a Pagar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "span", 31);
      \u0275\u0275text(45);
      \u0275\u0275pipe(46, "currency");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(47, "button", 32);
      \u0275\u0275listener("click", function AdminSalesPage_Template_button_click_47_listener() {
        return ctx.checkout();
      });
      \u0275\u0275conditionalCreate(48, AdminSalesPage_Conditional_48_Template, 2, 0)(49, AdminSalesPage_Conditional_49_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 11 : ctx.paginatedProducts().length === 0 ? 12 : 13);
      \u0275\u0275advance(4);
      \u0275\u0275property("pages", ctx.totalPages())("currentPage", ctx.currentPage());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.cartCount());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("translate-x-full", !ctx.isCartOpenMobile())("md:translate-x-0", true);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.cartCount());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.cart().length === 0 ? 31 : 32);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(40, 15, ctx.cartTotal()));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(46, 17, ctx.cartTotal()));
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.cart().length === 0 || ctx.processing());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.processing() ? 48 : 49);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, Pagination, CurrencyPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminSalesPage, [{
    type: Component,
    args: [{ selector: "app-admin-sales-page", standalone: true, imports: [CommonModule, FormsModule, Pagination], template: `<div class="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-gray-50 dark:bg-[#0f172a] overflow-hidden">\r
    \r
    <!-- LEFT: Product Grid -->\r
    <div class="flex-1 flex flex-col h-full overflow-hidden relative">\r
        \r
        <!-- Header & Search -->\r
        <div class="bg-white dark:bg-[#1e293b] p-4 border-b border-gray-200 dark:border-gray-700 z-10 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">\r
            <div>\r
                 <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-indigo-500 flex items-center gap-2">\r
                    <i class="fas fa-cash-register text-indigo-500"></i> Punto de Venta\r
                 </h1>\r
            </div>\r
            \r
            <div class="w-full sm:max-w-md relative group">\r
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>\r
                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"\r
                   placeholder="Buscar por nombre, SKU, c\xF3digo..." \r
                   class="input input-bordered w-full pl-10 bg-gray-50 dark:bg-gray-800 transition-all focus:ring-2 focus:ring-primary/20" />\r
            </div>\r
        </div>\r
\r
        <!-- Scrollable Grid -->\r
        <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">\r
            \r
            @if(loading()) {\r
                <div class="flex justify-center py-20">\r
                    <span class="loading loading-spinner loading-lg text-primary"></span>\r
                </div>\r
            } @else if(paginatedProducts().length === 0) {\r
                 <div class="flex flex-col items-center justify-center h-64 text-gray-400">\r
                    <i class="fas fa-box-open text-6xl mb-4 opacity-50"></i>\r
                    <p class="text-lg">No se encontraron productos.</p>\r
                 </div>\r
            } @else {\r
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">\r
                    @for (product of paginatedProducts(); track product.id) {\r
                        <div (click)="addToCart(product)"\r
                             class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary/50 transition-all duration-200 cursor-pointer group active:scale-95">\r
                            <figure class="px-4 pt-4 relative aspect-square">\r
                                <img [src]="product.image_url || 'assets/img/no-image.png'" \r
                                     alt="Product"\r
                                     class="rounded-xl object-contain w-full h-full group-hover:scale-105 transition-transform" />\r
                                <div class="absolute top-2 right-2 badge badge-sm" \r
                                     [class.badge-warning]="product.stock < 5"\r
                                     [class.badge-primary]="product.stock >= 5">\r
                                    {{ product.stock }}\r
                                </div>\r
                            </figure>\r
                            <div class="card-body p-4 text-center">\r
                                <h3 class="font-bold text-sm line-clamp-2 text-gray-800 dark:text-gray-200 h-10 leading-tight">{{ product.name }}</h3>\r
                                <div class="mt-2 text-primary font-bold text-lg">\r
                                    {{ product.price | currency }}\r
                                </div>\r
                                <div class="text-xs text-gray-400 font-mono">{{ product.sku }}</div>\r
                            </div>\r
                        </div>\r
                    }\r
                </div>\r
            }\r
\r
            <div class="mt-8 flex justify-center pb-8">\r
                <pagination [pages]="totalPages()" [currentPage]="currentPage()" />\r
            </div>\r
        </div>\r
\r
        <!-- Mobile Cart Toggle (Floating Button) -->\r
        <button (click)="isCartOpenMobile.set(true)" class="md:hidden fixed bottom-6 right-6 btn btn-circle btn-primary btn-lg shadow-2xl z-50">\r
            <div class="indicator">\r
                <span class="indicator-item badge badge-secondary">{{ cartCount() }}</span> \r
                <i class="fas fa-shopping-cart text-2xl"></i>\r
            </div>\r
        </button>\r
    </div>\r
\r
    <!-- RIGHT/OVERLAY: Shopping Cart -->\r
    <div [class.translate-x-full]="!isCartOpenMobile()" [class.md:translate-x-0]="true"\r
         class="fixed inset-y-0 right-0 z-40 w-full md:relative md:w-96 bg-white dark:bg-[#1e293b] shadow-2xl md:shadow-none border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col h-full">\r
        \r
        <!-- Cart Header -->\r
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">\r
            <h2 class="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">\r
                <i class="fas fa-shopping-cart text-primary"></i> \r
                Carrito <span class="badge badge-neutral">{{ cartCount() }}</span>\r
            </h2>\r
            <button (click)="isCartOpenMobile.set(false)" class="btn btn-circle btn-sm btn-ghost md:hidden">\r
                <i class="fas fa-times"></i>\r
            </button>\r
        </div>\r
\r
        <!-- Cart Items -->\r
        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">\r
            @if(cart().length === 0) {\r
                <div class="flex flex-col items-center justify-center h-64 text-gray-400">\r
                    <i class="fas fa-cart-arrow-down text-6xl mb-4 opacity-30"></i>\r
                    <p>Carrito Vac\xEDo</p>\r
                    <p class="text-sm">Selecciona productos para empezar.</p>\r
                </div>\r
            } @else {\r
                @for(item of cart(); track item.id) {\r
                    <div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 animate-fade-in group hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">\r
                        <img [src]="item.image_url || 'assets/img/no-image.png'" class="w-16 h-16 object-cover rounded-lg bg-white" />\r
                        \r
                        <div class="flex-1 min-w-0">\r
                            <div class="font-bold text-sm text-gray-900 dark:text-gray-100 truncate mb-1">{{ item.name }}</div>\r
                            <div class="flex justify-between items-center">\r
                                <div class="text-xs text-gray-500">{{ item.price | currency }}</div>\r
                                <div class="font-bold text-gray-900 dark:text-white">{{ item.price * item.quantity | currency }}</div>\r
                            </div>\r
                        </div>\r
\r
                        <div class="flex flex-col items-center ml-2 gap-1">\r
                            <div class="join join-vertical shadow-sm">\r
                                <button (click)="updateQuantity(item.id, 1)" class="btn btn-xs join-item btn-ghost text-success"><i class="fas fa-plus"></i></button>\r
                                <span class="join-item bg-base-100 text-xs font-bold w-6 h-5 flex items-center justify-center border-x border-base-200">{{ item.quantity }}</span>\r
                                <button (click)="updateQuantity(item.id, -1)" class="btn btn-xs join-item btn-ghost text-warning"><i class="fas fa-minus"></i></button>\r
                            </div>\r
                        </div>\r
                        \r
                        <button (click)="removeFromCart(item.id)" class="btn btn-circle btn-ghost btn-xs text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">\r
                             <i class="fas fa-trash"></i>\r
                        </button>\r
                    </div>\r
                }\r
            }\r
        </div>\r
\r
        <!-- Cart Footer / Totals -->\r
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">\r
            <div class="space-y-4 mb-6">\r
                <div class="flex justify-between text-gray-500 text-sm">\r
                    <span>Subtotal</span>\r
                    <span>{{ cartTotal() | currency }}</span>\r
                </div>\r
                <div class="flex justify-between items-end">\r
                    <span class="text-lg font-bold text-gray-800 dark:text-white">Total a Pagar</span>\r
                    <span class="text-3xl font-bold text-primary">{{ cartTotal() | currency }}</span>\r
                </div>\r
            </div>\r
\r
            <button (click)="checkout()" [disabled]="cart().length === 0 || processing()" \r
                    class="btn btn-primary w-full btn-lg shadow-lg shadow-blue-500/30 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all">\r
                @if(processing()) {\r
                    <span class="loading loading-spinner"></span> Procesando...\r
                } @else {\r
                    <i class="fas fa-check-circle mr-2"></i> Confirmar Venta\r
                }\r
            </button>\r
        </div>\r
\r
    </div>\r
</div>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSalesPage, { className: "AdminSalesPage", filePath: "src/app/admin/sales/admin-sales-page.ts", lineNumber: 20 });
})();
export {
  AdminSalesPage
};
//# sourceMappingURL=chunk-FE5GBA5Y.js.map
