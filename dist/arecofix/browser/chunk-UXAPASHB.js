import {
  OrderService
} from "./chunk-2BWNH3CP.js";
import {
  Pagination
} from "./chunk-IZUXSIIJ.js";
import "./chunk-NJJ5IL4Q.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-TOKXMODF.js";
import {
  LoggerService
} from "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgIf,
  RouterLink
} from "./chunk-WHLM5VZW.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Pipe,
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
  ɵɵdefinePipe,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XQFVERLD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/shared/pipes/order-status.pipe.ts
var OrderStatusPipe = class _OrderStatusPipe {
  transform(value) {
    if (!value)
      return "";
    const texts = {
      pending: "A Pagar",
      processing: "Abonado",
      completed: "Completado",
      cancelled: "Cancelado"
    };
    return texts[value] || value;
  }
  static \u0275fac = function OrderStatusPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderStatusPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "orderStatus", type: _OrderStatusPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrderStatusPipe, [{
    type: Pipe,
    args: [{
      name: "orderStatus",
      standalone: true
    }]
  }], null, null);
})();

// src/app/shared/pipes/status-color.pipe.ts
var StatusColorPipe = class _StatusColorPipe {
  transform(value) {
    if (!value)
      return "badge-ghost";
    const classes = {
      pending: "badge-error",
      // Red for unpaid/pending
      processing: "badge-success",
      // Green for paid/processing
      completed: "badge-success",
      // Green for completed
      cancelled: "badge-error",
      // Red for cancelled
      // Add more status mappings here if needed across the app
      deleted: "badge-ghost"
    };
    return classes[value] || "badge-ghost";
  }
  static \u0275fac = function StatusColorPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatusColorPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "statusColor", type: _StatusColorPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatusColorPipe, [{
    type: Pipe,
    args: [{
      name: "statusColor",
      standalone: true
    }]
  }], null, null);
})();

// src/app/admin/orders/admin-orders-page.ts
var _c0 = (a0) => ["/admin/orders", a0];
var _c1 = (a0) => ["/admin/orders", a0, "edit"];
var _forTrack0 = ($index, $item) => $item.id;
function AdminOrdersPage_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "span", 42);
    \u0275\u0275elementEnd();
  }
}
function AdminOrdersPage_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "i", 43);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function AdminOrdersPage_Conditional_65_For_20_Conditional_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const order_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", order_r2.items.length - 1, " m\xE1s");
  }
}
function AdminOrdersPage_Conditional_65_For_20_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 66);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, AdminOrdersPage_Conditional_65_For_20_Conditional_10_Conditional_3_Template, 2, 1, "span", 67);
  }
  if (rf & 2) {
    const order_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", order_r2.items[0].quantity, "x");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", order_r2.items[0].product_name, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(order_r2.items.length > 1 ? 3 : -1);
  }
}
function AdminOrdersPage_Conditional_65_For_20_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58);
    \u0275\u0275text(1, "Sin items");
    \u0275\u0275elementEnd();
  }
}
function AdminOrdersPage_Conditional_65_For_20_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 68);
    \u0275\u0275listener("click", function AdminOrdersPage_Conditional_65_For_20_Conditional_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const order_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleOrderStatus(order_r2));
    });
    \u0275\u0275element(1, "i", 69);
    \u0275\u0275elementEnd();
  }
}
function AdminOrdersPage_Conditional_65_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 49)(1, "td", 54);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 55);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 56);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td")(9, "div", 57);
    \u0275\u0275conditionalCreate(10, AdminOrdersPage_Conditional_65_For_20_Conditional_10_Template, 4, 3)(11, AdminOrdersPage_Conditional_65_For_20_Conditional_11_Template, 2, 0, "span", 58);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 55);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "span", 59);
    \u0275\u0275pipe(17, "statusColor");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "orderStatus");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 56);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 48)(24, "div", 60);
    \u0275\u0275conditionalCreate(25, AdminOrdersPage_Conditional_65_For_20_Conditional_25_Template, 2, 0, "button", 61);
    \u0275\u0275elementStart(26, "a", 62);
    \u0275\u0275element(27, "i", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "a", 64);
    \u0275\u0275element(29, "i", 65);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const order_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(order_r2.order_number);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(order_r2.customer_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(order_r2.customer_email);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(order_r2.items && order_r2.items.length > 0 ? 10 : 11);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 11, order_r2.total), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pipeBind1(17, 13, order_r2.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(19, 15, order_r2.status), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(22, 17, order_r2.created_at, "dd MMM yyyy, HH:mm"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(order_r2.status === "pending" ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(20, _c0, order_r2.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(22, _c1, order_r2.id));
  }
}
function AdminOrdersPage_Conditional_65_For_23_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 78)(1, "span", 85)(2, "span", 66);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", item_r4.quantity, "x");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r4.product_name);
  }
}
function AdminOrdersPage_Conditional_65_For_23_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const order_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", order_r5.items.length - 2, " productos m\xE1s...");
  }
}
function AdminOrdersPage_Conditional_65_For_23_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 86);
    \u0275\u0275listener("click", function AdminOrdersPage_Conditional_65_For_23_Conditional_27_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const order_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleOrderStatus(order_r5));
    });
    \u0275\u0275element(1, "i", 87);
    \u0275\u0275elementEnd();
  }
}
function AdminOrdersPage_Conditional_65_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 70)(2, "div", 71)(3, "div", 72)(4, "span", 73);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 74);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 75);
    \u0275\u0275pipe(10, "statusColor");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "orderStatus");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "h3", 55);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 76)(16, "ul", 77);
    \u0275\u0275repeaterCreate(17, AdminOrdersPage_Conditional_65_For_23_For_18_Template, 5, 2, "li", 78, _forTrack0);
    \u0275\u0275conditionalCreate(19, AdminOrdersPage_Conditional_65_For_23_Conditional_19_Template, 2, 1, "li", 79);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 80)(21, "span", 81);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 82)(25, "a", 83);
    \u0275\u0275text(26, "Ver");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, AdminOrdersPage_Conditional_65_For_23_Conditional_27_Template, 2, 0, "button", 84);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const order_r5 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(order_r5.order_number);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 9, order_r5.created_at, "short"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pipeBind1(10, 12, order_r5.status));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(12, 14, order_r5.status), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(order_r5.customer_name);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(order_r5.items.slice(0, 2));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(order_r5.items && order_r5.items.length > 2 ? 19 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 16, order_r5.total));
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(18, _c0, order_r5.id));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(order_r5.status === "pending" ? 27 : -1);
  }
}
function AdminOrdersPage_Conditional_65_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88);
    \u0275\u0275element(1, "pagination", 89);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r0.totalPages())("currentPage", ctx_r0.currentPage());
  }
}
function AdminOrdersPage_Conditional_65_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275element(1, "i", 90);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No se encontraron pedidos.");
    \u0275\u0275elementEnd()();
  }
}
function AdminOrdersPage_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "table", 45)(2, "thead", 46)(3, "tr", 47)(4, "th");
    \u0275\u0275text(5, "Pedido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Productos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Fecha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 48);
    \u0275\u0275text(17, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, AdminOrdersPage_Conditional_65_For_20_Template, 30, 24, "tr", 49, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 50);
    \u0275\u0275repeaterCreate(22, AdminOrdersPage_Conditional_65_For_23_Template, 28, 20, "div", 51, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, AdminOrdersPage_Conditional_65_div_24_Template, 2, 2, "div", 52);
    \u0275\u0275conditionalCreate(25, AdminOrdersPage_Conditional_65_Conditional_25_Template, 4, 0, "div", 53);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r0.paginatedOrders());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.paginatedOrders());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.filteredOrders().length > 0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.filteredOrders().length === 0 ? 25 : -1);
  }
}
var AdminOrdersPage = class _AdminOrdersPage {
  orderService = inject(OrderService);
  logger = inject(LoggerService);
  cdr = inject(ChangeDetectorRef);
  // Signals
  orders = signal([], ...ngDevMode ? [{ debugName: "orders" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Filters & Sort
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  filterStatus = signal("all", ...ngDevMode ? [{ debugName: "filterStatus" }] : []);
  sortOrder = signal("date_desc", ...ngDevMode ? [{ debugName: "sortOrder" }] : []);
  // Pagination
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  itemsPerPage = signal(10, ...ngDevMode ? [{ debugName: "itemsPerPage" }] : []);
  // Computed: Filtered
  filteredOrders = computed(() => {
    let result = this.orders();
    const query = this.searchQuery().toLowerCase();
    const status = this.filterStatus();
    if (status !== "all") {
      result = result.filter((o) => o.status === status);
    }
    if (query) {
      result = result.filter((o) => o.order_number?.toLowerCase().includes(query) || o.customer_name?.toLowerCase().includes(query) || o.customer_email?.toLowerCase().includes(query));
    }
    const sort = this.sortOrder();
    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      switch (sort) {
        case "date_asc":
          return dateA - dateB;
        case "date_desc":
          return dateB - dateA;
        case "total_desc":
          return (b.total || 0) - (a.total || 0);
        default:
          return 0;
      }
    });
  }, ...ngDevMode ? [{ debugName: "filteredOrders" }] : []);
  // Computed: Paginated
  paginatedOrders = computed(() => {
    const all = this.filteredOrders();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return all.slice(start, start + this.itemsPerPage());
  }, ...ngDevMode ? [{ debugName: "paginatedOrders" }] : []);
  // Computed: Total Pages
  totalPages = computed(() => Math.ceil(this.filteredOrders().length / this.itemsPerPage()), ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  // Computed: Stats
  stats = computed(() => {
    const all = this.orders();
    return {
      total: all.length,
      pending: all.filter((o) => o.status === "pending").length,
      completed: all.filter((o) => o.status === "completed").length,
      revenue: all.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }, ...ngDevMode ? [{ debugName: "stats" }] : []);
  async ngOnInit() {
    this.loadOrders();
  }
  loadOrders() {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || "Error al cargar pedidos");
        this.loading.set(false);
      }
    });
  }
  async toggleOrderStatus(order) {
    if (order.status !== "pending" && order.status !== "processing")
      return;
    const newStatus = order.status === "pending" ? "processing" : "pending";
    try {
      const { error } = await this.orderService.updateOrderStatus(order.id, newStatus);
      if (error)
        throw error;
      this.orders.update((current) => current.map((o) => o.id === order.id ? __spreadProps(__spreadValues({}, o), { status: newStatus }) : o));
    } catch (error) {
      this.logger.error("Error updating status:", error);
      alert("Error al actualizar el estado del pedido");
    }
  }
  updateSort(event) {
    const value = event.target.value;
    this.sortOrder.set(value);
  }
  static \u0275fac = function AdminOrdersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminOrdersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminOrdersPage, selectors: [["app-admin-orders-page"]], decls: 66, vars: 18, consts: [[1, "max-w-7xl", "mx-auto", "pb-20", "p-4"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "md:items-center", "py-6", "gap-4", "border-b", "border-gray-200", "dark:border-gray-800", "mb-6"], [1, "text-3xl", "font-bold", "text-gray-800", "dark:text-white", "flex", "items-center", "gap-3"], [1, "fas", "fa-shopping-bag", "text-green-500"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], ["routerLink", "/admin/orders/new", 1, "btn", "btn-primary", "shadow-lg", "shadow-green-500/20"], [1, "fas", "fa-plus", "mr-2"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-4", "mb-8"], [1, "stats", "shadow", "bg-white", "dark:bg-gray-800", "border", "border-gray-100", "dark:border-gray-700"], [1, "stat"], [1, "stat-figure", "text-primary"], [1, "fas", "fa-list-alt", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider"], [1, "stat-value", "text-primary"], [1, "stat-figure", "text-warning"], [1, "fas", "fa-clock", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider", "text-warning"], [1, "stat-value", "text-warning"], [1, "stat-figure", "text-success"], [1, "fas", "fa-check-circle", "text-3xl", "opacity-50"], [1, "stat-title", "text-xs", "uppercase", "tracking-wider", "text-success"], [1, "stat-value", "text-success"], [1, "stat-figure", "text-info"], [1, "fas", "fa-dollar-sign", "text-3xl", "opacity-50"], [1, "stat-value", "text-info", "text-2xl", "overflow-hidden", "text-ellipsis"], [1, "flex", "flex-col", "lg:flex-row", "gap-4", "mb-6", "bg-white", "dark:bg-gray-800", "p-4", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "flex-1"], [1, "relative"], [1, "fas", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-gray-400"], ["type", "text", "placeholder", "Buscar cliente, n\xFAmero de pedido...", 1, "input", "input-bordered", "w-full", "pl-10", 3, "ngModelChange", "ngModel"], [1, "overflow-x-auto", "pb-2", "lg:pb-0"], [1, "join"], ["type", "radio", "name", "status", "aria-label", "Todos", 1, "join-item", "btn", 3, "click", "checked"], ["type", "radio", "name", "status", "aria-label", "Pendientes", 1, "join-item", "btn", 3, "click", "checked"], ["type", "radio", "name", "status", "aria-label", "Procesando", 1, "join-item", "btn", 3, "click", "checked"], ["type", "radio", "name", "status", "aria-label", "Completados", 1, "join-item", "btn", 3, "click", "checked"], [1, "select", "select-bordered", "w-full", "lg:w-auto", 3, "change", "ngModel"], ["value", "date_desc"], ["value", "date_asc"], ["value", "total_desc"], [1, "flex", "justify-center", "p-12"], [1, "alert", "alert-error"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "fas", "fa-exclamation-triangle"], [1, "hidden", "md:block", "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-lg", "overflow-hidden", "border", "border-gray-100", "dark:border-gray-700"], [1, "table", "w-full"], [1, "bg-gray-50", "dark:bg-gray-700/50"], [1, "text-gray-600", "dark:text-gray-300", "font-bold", "uppercase", "text-xs", "tracking-wider"], [1, "text-right"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors"], [1, "md:hidden", "grid", "grid-cols-1", "gap-4"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], ["class", "mt-8 flex justify-center pb-8", 4, "ngIf"], [1, "text-center", "py-20", "opacity-50"], [1, "font-mono", "font-bold", "text-primary"], [1, "font-bold", "text-gray-900", "dark:text-white"], [1, "text-xs", "text-gray-500"], [1, "text-sm", "max-w-xs", "truncate"], [1, "italic", "text-gray-400"], [1, "badge", "badge-sm", "font-semibold", "border-0", 3, "ngClass"], [1, "flex", "justify-end", "gap-2"], ["data-tip", "Marcar Pagado", 1, "btn", "btn-sm", "btn-ghost", "text-green-500", "tooltip"], ["data-tip", "Ver Detalle", 1, "btn", "btn-sm", "btn-ghost", "text-gray-500", "tooltip", 3, "routerLink"], [1, "fas", "fa-eye"], ["data-tip", "Editar", 1, "btn", "btn-sm", "btn-ghost", "text-indigo-500", "tooltip", 3, "routerLink"], [1, "fas", "fa-pen"], [1, "font-bold"], [1, "badge", "badge-xs", "badge-ghost"], ["data-tip", "Marcar Pagado", 1, "btn", "btn-sm", "btn-ghost", "text-green-500", "tooltip", 3, "click"], [1, "fas", "fa-check-dollar"], [1, "card-body", "p-4"], [1, "flex", "justify-between", "items-start", "mb-2"], [1, "flex", "flex-col"], [1, "font-mono", "text-xs", "font-bold", "text-primary"], [1, "text-xs", "text-gray-400"], [1, "badge", "badge-sm", "border-0", "font-bold", 3, "ngClass"], [1, "py-2", "border-y", "border-dashed", "border-gray-200", "dark:border-gray-700", "my-2"], [1, "text-sm", "space-y-1"], [1, "flex", "justify-between"], [1, "text-xs", "text-gray-400", "italic"], [1, "flex", "justify-between", "items-center", "mt-2"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "flex", "gap-2"], [1, "btn", "btn-sm", "btn-outline", "btn-ghost", 3, "routerLink"], [1, "btn", "btn-sm", "btn-success", "text-white", "px-4"], [1, "truncate", "pr-2"], [1, "btn", "btn-sm", "btn-success", "text-white", "px-4", 3, "click"], [1, "fas", "fa-check"], [1, "mt-8", "flex", "justify-center", "pb-8"], [3, "pages", "currentPage"], [1, "fas", "fa-shopping-bag", "text-4xl", "mb-3"]], template: function AdminOrdersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Pedidos ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, "Gestiona las \xF3rdenes de compra de tus clientes.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "a", 5);
      \u0275\u0275element(9, "i", 6);
      \u0275\u0275text(10, " Nuevo Pedido ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div", 9)(14, "div", 10);
      \u0275\u0275element(15, "i", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 12);
      \u0275\u0275text(17, "Total Pedidos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 13);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(20, "div", 8)(21, "div", 9)(22, "div", 14);
      \u0275\u0275element(23, "i", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 16);
      \u0275\u0275text(25, "Pendientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 17);
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "div", 8)(29, "div", 9)(30, "div", 18);
      \u0275\u0275element(31, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 20);
      \u0275\u0275text(33, "Completados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 21);
      \u0275\u0275text(35);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 8)(37, "div", 9)(38, "div", 22);
      \u0275\u0275element(39, "i", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 12);
      \u0275\u0275text(41, "Ingresos Totales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "div", 24);
      \u0275\u0275text(43);
      \u0275\u0275pipe(44, "currency");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(45, "div", 25)(46, "div", 26)(47, "div", 27);
      \u0275\u0275element(48, "i", 28);
      \u0275\u0275elementStart(49, "input", 29);
      \u0275\u0275listener("ngModelChange", function AdminOrdersPage_Template_input_ngModelChange_49_listener($event) {
        return ctx.searchQuery.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "div", 30)(51, "div", 31)(52, "input", 32);
      \u0275\u0275listener("click", function AdminOrdersPage_Template_input_click_52_listener() {
        return ctx.filterStatus.set("all");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "input", 33);
      \u0275\u0275listener("click", function AdminOrdersPage_Template_input_click_53_listener() {
        return ctx.filterStatus.set("pending");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "input", 34);
      \u0275\u0275listener("click", function AdminOrdersPage_Template_input_click_54_listener() {
        return ctx.filterStatus.set("processing");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "input", 35);
      \u0275\u0275listener("click", function AdminOrdersPage_Template_input_click_55_listener() {
        return ctx.filterStatus.set("completed");
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(56, "select", 36);
      \u0275\u0275listener("change", function AdminOrdersPage_Template_select_change_56_listener($event) {
        return ctx.updateSort($event);
      });
      \u0275\u0275elementStart(57, "option", 37);
      \u0275\u0275text(58, "M\xE1s Recientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "option", 38);
      \u0275\u0275text(60, "M\xE1s Antiguos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "option", 39);
      \u0275\u0275text(62, "Mayor Monto");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(63, AdminOrdersPage_Conditional_63_Template, 2, 0, "div", 40)(64, AdminOrdersPage_Conditional_64_Template, 4, 1, "div", 41)(65, AdminOrdersPage_Conditional_65_Template, 26, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate(ctx.stats().total);
      \u0275\u0275advance();
      \u0275\u0275classProp("border-warning", ctx.stats().pending > 0);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.stats().pending);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.stats().completed);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(44, 13, ctx.stats().revenue, "ARS", "symbol", "1.0-0"));
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(3);
      \u0275\u0275property("checked", ctx.filterStatus() === "all");
      \u0275\u0275advance();
      \u0275\u0275property("checked", ctx.filterStatus() === "pending");
      \u0275\u0275advance();
      \u0275\u0275property("checked", ctx.filterStatus() === "processing");
      \u0275\u0275advance();
      \u0275\u0275property("checked", ctx.filterStatus() === "completed");
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.sortOrder());
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.loading() ? 63 : ctx.error() ? 64 : 65);
    }
  }, dependencies: [RouterLink, CommonModule, NgClass, NgIf, Pagination, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, CurrencyPipe, DatePipe, OrderStatusPipe, StatusColorPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminOrdersPage, [{
    type: Component,
    args: [{ selector: "app-admin-orders-page", standalone: true, imports: [RouterLink, CommonModule, OrderStatusPipe, StatusColorPipe, Pagination, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="max-w-7xl mx-auto pb-20 p-4">\r
    \r
    <!-- Header -->\r
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">\r
        <div>\r
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">\r
                <i class="fas fa-shopping-bag text-green-500"></i> Pedidos\r
            </h1>\r
            <p class="text-sm text-gray-500 dark:text-gray-400">Gestiona las \xF3rdenes de compra de tus clientes.</p>\r
        </div>\r
        \r
        <a routerLink="/admin/orders/new" class="btn btn-primary shadow-lg shadow-green-500/20">\r
            <i class="fas fa-plus mr-2"></i> Nuevo Pedido\r
        </a>\r
    </div>\r
\r
    <!-- Stats Dashboard -->\r
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">\r
        <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">\r
            <div class="stat">\r
              <div class="stat-figure text-primary">\r
                <i class="fas fa-list-alt text-3xl opacity-50"></i>\r
              </div>\r
              <div class="stat-title text-xs uppercase tracking-wider">Total Pedidos</div>\r
              <div class="stat-value text-primary">{{ stats().total }}</div>\r
            </div>\r
        </div>\r
\r
        <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700" \r
             [class.border-warning]="stats().pending > 0">\r
            <div class="stat">\r
              <div class="stat-figure text-warning">\r
                <i class="fas fa-clock text-3xl opacity-50"></i>\r
              </div>\r
              <div class="stat-title text-xs uppercase tracking-wider text-warning">Pendientes</div>\r
              <div class="stat-value text-warning">{{ stats().pending }}</div>\r
            </div>\r
        </div>\r
\r
        <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">\r
            <div class="stat">\r
              <div class="stat-figure text-success">\r
                <i class="fas fa-check-circle text-3xl opacity-50"></i>\r
              </div>\r
              <div class="stat-title text-xs uppercase tracking-wider text-success">Completados</div>\r
              <div class="stat-value text-success">{{ stats().completed }}</div>\r
            </div>\r
        </div>\r
\r
        <div class="stats shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">\r
            <div class="stat">\r
              <div class="stat-figure text-info">\r
                <i class="fas fa-dollar-sign text-3xl opacity-50"></i>\r
              </div>\r
              <div class="stat-title text-xs uppercase tracking-wider">Ingresos Totales</div>\r
              <div class="stat-value text-info text-2xl overflow-hidden text-ellipsis">{{ stats().revenue | currency:'ARS':'symbol':'1.0-0' }}</div>\r
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
                   placeholder="Buscar cliente, n\xFAmero de pedido..." \r
                   class="input input-bordered w-full pl-10" />\r
            </div>\r
        </div>\r
\r
        <!-- Filter Tabs -->\r
        <div class="overflow-x-auto pb-2 lg:pb-0">\r
             <div class="join">\r
                <input class="join-item btn" type="radio" name="status" aria-label="Todos" \r
                  [checked]="filterStatus() === 'all'" (click)="filterStatus.set('all')" />\r
                <input class="join-item btn" type="radio" name="status" aria-label="Pendientes" \r
                  [checked]="filterStatus() === 'pending'" (click)="filterStatus.set('pending')" />\r
                <input class="join-item btn" type="radio" name="status" aria-label="Procesando" \r
                  [checked]="filterStatus() === 'processing'" (click)="filterStatus.set('processing')" />\r
                <input class="join-item btn" type="radio" name="status" aria-label="Completados" \r
                  [checked]="filterStatus() === 'completed'" (click)="filterStatus.set('completed')" />\r
            </div>\r
        </div>\r
\r
        <!-- Sort -->\r
        <select [ngModel]="sortOrder()" (change)="updateSort($event)" class="select select-bordered w-full lg:w-auto">\r
            <option value="date_desc">M\xE1s Recientes</option>\r
            <option value="date_asc">M\xE1s Antiguos</option>\r
            <option value="total_desc">Mayor Monto</option>\r
        </select>\r
    </div>\r
\r
    <!-- Content -->\r
    @if (loading()) {\r
        <div class="flex justify-center p-12">\r
            <span class="loading loading-spinner loading-lg text-primary"></span>\r
        </div>\r
    } @else if (error()) {\r
        <div class="alert alert-error">\r
            <i class="fas fa-exclamation-triangle"></i>\r
            <span>{{ error() }}</span>\r
        </div>\r
    } @else {\r
        \r
        <!-- Desktop Table -->\r
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">\r
            <table class="table w-full">\r
                <thead class="bg-gray-50 dark:bg-gray-700/50">\r
                    <tr class="text-gray-600 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">\r
                        <th>Pedido</th>\r
                        <th>Cliente</th>\r
                        <th>Productos</th>\r
                        <th>Total</th>\r
                        <th>Estado</th>\r
                        <th>Fecha</th>\r
                        <th class="text-right">Acciones</th>\r
                    </tr>\r
                </thead>\r
                <tbody>\r
                    @for (order of paginatedOrders(); track order.id) {\r
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">\r
                        <td class="font-mono font-bold text-primary">{{ order.order_number }}</td>\r
                        <td>\r
                            <div class="font-bold text-gray-900 dark:text-white">{{ order.customer_name }}</div>\r
                            <div class="text-xs text-gray-500">{{ order.customer_email }}</div>\r
                        </td>\r
                        <td>\r
                            <div class="text-sm max-w-xs truncate">\r
                                @if (order.items && order.items.length > 0) {\r
                                    <span class="font-bold">{{ order.items[0].quantity }}x</span> {{ order.items[0].product_name }}\r
                                    @if(order.items.length > 1) { <span class="badge badge-xs badge-ghost">+{{ order.items.length - 1 }} m\xE1s</span> }\r
                                } @else {\r
                                    <span class="italic text-gray-400">Sin items</span>\r
                                }\r
                            </div>\r
                        </td>\r
                        <td class="font-bold text-gray-900 dark:text-white">\r
                            {{ order.total | currency }}\r
                        </td>\r
                        <td>\r
                            <span class="badge badge-sm font-semibold border-0" \r
                                  [ngClass]="order.status | statusColor">\r
                                {{ order.status | orderStatus }}\r
                            </span>\r
                        </td>\r
                        <td class="text-xs text-gray-500">\r
                            {{ order.created_at | date:'dd MMM yyyy, HH:mm' }}\r
                        </td>\r
                        <td class="text-right">\r
                            <div class="flex justify-end gap-2">\r
                                @if (order.status === 'pending') {\r
                                    <button (click)="toggleOrderStatus(order)" class="btn btn-sm btn-ghost text-green-500 tooltip" data-tip="Marcar Pagado">\r
                                        <i class="fas fa-check-dollar"></i>\r
                                    </button>\r
                                }\r
                                <a [routerLink]="['/admin/orders', order.id]" class="btn btn-sm btn-ghost text-gray-500 tooltip" data-tip="Ver Detalle">\r
                                    <i class="fas fa-eye"></i>\r
                                </a>\r
                                <a [routerLink]="['/admin/orders', order.id, 'edit']" class="btn btn-sm btn-ghost text-indigo-500 tooltip" data-tip="Editar">\r
                                    <i class="fas fa-pen"></i>\r
                                </a>\r
                            </div>\r
                        </td>\r
                    </tr>\r
                    }\r
                </tbody>\r
            </table>\r
        </div>\r
\r
        <!-- Mobile Cards -->\r
        <div class="md:hidden grid grid-cols-1 gap-4">\r
            @for (order of paginatedOrders(); track order.id) {\r
            <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">\r
                <div class="card-body p-4">\r
                    <div class="flex justify-between items-start mb-2">\r
                         <div class="flex flex-col">\r
                             <span class="font-mono text-xs font-bold text-primary">{{ order.order_number }}</span>\r
                             <span class="text-xs text-gray-400">{{ order.created_at | date:'short' }}</span>\r
                         </div>\r
                         <div class="badge badge-sm border-0 font-bold" [ngClass]="order.status | statusColor">\r
                            {{ order.status | orderStatus }}\r
                         </div>\r
                    </div>\r
                    \r
                    <h3 class="font-bold text-gray-900 dark:text-white">{{ order.customer_name }}</h3>\r
                    \r
                    <div class="py-2 border-y border-dashed border-gray-200 dark:border-gray-700 my-2">\r
                        <ul class="text-sm space-y-1">\r
                             @for(item of order.items.slice(0, 2); track item.id) {\r
                                 <li class="flex justify-between">\r
                                     <span class="truncate pr-2"><span class="font-bold">{{ item.quantity }}x</span> {{ item.product_name }}</span>\r
                                 </li>\r
                             }\r
                             @if(order.items && order.items.length > 2) {\r
                                 <li class="text-xs text-gray-400 italic">+{{ order.items.length - 2 }} productos m\xE1s...</li>\r
                             }\r
                        </ul>\r
                    </div>\r
\r
                    <div class="flex justify-between items-center mt-2">\r
                        <span class="text-xl font-bold text-gray-900 dark:text-white">{{ order.total | currency }}</span>\r
                        \r
                        <div class="flex gap-2">\r
                             <a [routerLink]="['/admin/orders', order.id]" class="btn btn-sm btn-outline btn-ghost">Ver</a>\r
                             @if(order.status === 'pending') {\r
                                 <button (click)="toggleOrderStatus(order)" class="btn btn-sm btn-success text-white px-4">\r
                                     <i class="fas fa-check"></i>\r
                                 </button>\r
                             }\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
            }\r
        </div>\r
\r
        <!-- Pagination -->\r
        <div class="mt-8 flex justify-center pb-8" *ngIf="filteredOrders().length > 0">\r
            <pagination [pages]="totalPages()" [currentPage]="currentPage()" />\r
        </div>\r
        \r
        <!-- Empty State -->\r
        @if (filteredOrders().length === 0) {\r
            <div class="text-center py-20 opacity-50">\r
                <i class="fas fa-shopping-bag text-4xl mb-3"></i>\r
                <p>No se encontraron pedidos.</p>\r
            </div>\r
        }\r
    }\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminOrdersPage, { className: "AdminOrdersPage", filePath: "src/app/admin/orders/admin-orders-page.ts", lineNumber: 19 });
})();
export {
  AdminOrdersPage
};
//# sourceMappingURL=chunk-UXAPASHB.js.map
