import {
  OrderService
} from "./chunk-JFYWCSMR.js";
import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-K7T46PVE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/features/orders/services/repair-status.ts
var RepairStatusService = class _RepairStatusService {
  statusTranslations = {
    pending: "Pendiente",
    processing: "En Reparaci\xF3n",
    completed: "Listo para retirar",
    cancelled: "Cancelado"
  };
  getStatusLabel(status) {
    return this.statusTranslations[status] || status;
  }
  /**
   * Generates a WhatsApp link to notify the customer about the status change.
   */
  generateWhatsAppLink(phone, customerName, status, orderNumber, deviceName = "tu equipo") {
    if (!phone)
      return null;
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "549" + cleanPhone;
    }
    if (cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.substring(1);
      if (cleanPhone.length === 10)
        cleanPhone = "549" + cleanPhone;
    }
    const statusText = this.getStatusLabel(status);
    const message = `Hola ${customerName}, te contactamos de Arecofix. 

El estado de tu reparaci\xF3n (Orden #${orderNumber}) para ${deviceName} ha cambiado a: *${statusText}*. 

Cualquier consulta estamos a tu disposici\xF3n.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  static \u0275fac = function RepairStatusService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RepairStatusService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RepairStatusService, factory: _RepairStatusService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RepairStatusService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/admin/orders/admin-order-form-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminOrderFormPage_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "i", 43);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "No hay productos agregados");
    \u0275\u0275elementEnd()();
  }
}
function AdminOrderFormPage_Conditional_49_For_15_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r5 = ctx.$implicit;
    \u0275\u0275property("value", product_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", product_r5.name, " (", product_r5.sku, ") ");
  }
}
function AdminOrderFormPage_Conditional_49_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 50)(1, "td", 51)(2, "select", 52);
    \u0275\u0275listener("change", function AdminOrderFormPage_Conditional_49_For_15_Template_select_change_2_listener($event) {
      const \u0275$index_114_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onProductSelect(\u0275$index_114_r3, $event.target.value));
    });
    \u0275\u0275elementStart(3, "option", 53);
    \u0275\u0275text(4, "Seleccionar producto...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, AdminOrderFormPage_Conditional_49_For_15_For_6_Template, 2, 3, "option", 54, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Conditional_49_For_15_Template_input_ngModelChange_8_listener($event) {
      const item_r6 = \u0275\u0275restoreView(_r2).$implicit;
      \u0275\u0275twoWayBindingSet(item_r6.quantity, $event) || (item_r6.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function AdminOrderFormPage_Conditional_49_For_15_Template_input_ngModelChange_8_listener() {
      const \u0275$index_114_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onQuantityChange(\u0275$index_114_r3));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 56);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 57);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 58)(14, "button", 59);
    \u0275\u0275listener("click", function AdminOrderFormPage_Conditional_49_For_15_Template_button_click_14_listener() {
      const \u0275$index_114_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.removeItem(\u0275$index_114_r3));
    });
    \u0275\u0275element(15, "i", 60);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const \u0275$index_114_r3 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", item_r6.product_id);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.products);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", item_r6.quantity);
    \u0275\u0275property("name", "quantity_" + \u0275$index_114_r3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", item_r6.unit_price.toFixed(2));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", item_r6.subtotal.toFixed(2), " ");
  }
}
function AdminOrderFormPage_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "table", 44)(2, "thead")(3, "tr", 45)(4, "th", 46);
    \u0275\u0275text(5, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 47);
    \u0275\u0275text(7, "Cantidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 48);
    \u0275\u0275text(9, "Precio Unit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 48);
    \u0275\u0275text(11, "Subtotal");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "th", 49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, AdminOrderFormPage_Conditional_49_For_15_Template, 16, 5, "tr", 50, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r3.items());
  }
}
function AdminOrderFormPage_Conditional_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "i", 61);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r3.error);
  }
}
function AdminOrderFormPage_Conditional_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 42);
  }
}
var AdminOrderFormPage = class _AdminOrderFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  repairStatusService = inject(RepairStatusService);
  // Inject service
  cdr = inject(ChangeDetectorRef);
  id = null;
  loading = true;
  saving = false;
  error = null;
  originalStatus = null;
  // Store original status
  products = [];
  form = signal({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    imei: "",
    // Init IMEI
    status: "pending",
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: ""
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  items = signal([], ...ngDevMode ? [{ debugName: "items" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    await this.loadProducts();
    if (this.id) {
      await this.loadOrder();
    }
    this.loading = false;
    this.cdr.markForCheck();
  }
  async loadProducts() {
    const supabase = this.authService.getSupabaseClient();
    const { data, error } = await supabase.from("products").select("id, name, sku, price, stock").eq("is_active", true).order("name");
    if (!error && data) {
      this.products = data;
    }
  }
  async loadOrder() {
    if (!this.id)
      return;
    this.orderService.getOrderById(this.id).subscribe({
      next: (order) => {
        this.form.set({
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          customer_address: order.customer_address,
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.discount,
          total: order.total,
          notes: order.notes,
          imei: order.imei || ""
          // Load IMEI cast as any if property missing in type or extend type
        });
        this.items.set(order.items);
        this.originalStatus = order.status;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message || "Error desconocido";
        this.cdr.markForCheck();
      }
    });
  }
  addItem() {
    this.items.update((items) => [...items, {
      product_name: "",
      quantity: 1,
      unit_price: 0,
      subtotal: 0
    }]);
    this.cdr.markForCheck();
  }
  removeItem(index) {
    this.items.update((items) => items.filter((_, i) => i !== index));
    this.calculateTotals();
  }
  onProductSelect(index, productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product)
      return;
    this.items.update((items) => {
      const newItems = [...items];
      newItems[index] = __spreadProps(__spreadValues({}, newItems[index]), {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        unit_price: product.price,
        subtotal: product.price * newItems[index].quantity
      });
      return newItems;
    });
    this.calculateTotals();
  }
  onQuantityChange(index) {
    this.items.update((items) => {
      const newItems = [...items];
      newItems[index].subtotal = newItems[index].unit_price * newItems[index].quantity;
      return newItems;
    });
    this.calculateTotals();
  }
  calculateTotals() {
    const subtotal = this.items().reduce((sum, item) => sum + item.subtotal, 0);
    const discount = this.form().discount || 0;
    const taxRate = 0.21;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax;
    this.form.update((f) => __spreadProps(__spreadValues({}, f), {
      subtotal,
      tax,
      total
    }));
    this.cdr.markForCheck();
  }
  async save() {
    if (this.items().length === 0) {
      this.error = "Debes agregar al menos un producto";
      this.cdr.markForCheck();
      return;
    }
    this.saving = true;
    this.error = null;
    try {
      let result;
      if (this.id) {
        result = await this.orderService.updateOrder(this.id, this.form(), this.items());
      } else {
        result = await this.orderService.createOrder(this.form(), this.items());
      }
      const { error } = result;
      if (error)
        throw error;
      if (this.id && this.originalStatus && this.form().status !== this.originalStatus) {
        const orderData = this.form();
        const deviceName = this.items().length > 0 ? this.items()[0].product_name : "tu equipo";
        const link = this.repairStatusService.generateWhatsAppLink(
          orderData.customer_phone || "",
          orderData.customer_name,
          orderData.status,
          this.id.substring(0, 8).toUpperCase(),
          // Use short ID as fallback
          deviceName
        );
        if (link) {
          window.open(link, "_blank");
        }
      }
      this.router.navigate(["/admin/orders"]);
    } catch (e) {
      this.error = e.message || "Error al guardar pedido";
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
  static \u0275fac = function AdminOrderFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminOrderFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminOrderFormPage, selectors: [["app-admin-order-form-page"]], decls: 93, vars: 18, consts: [["f", "ngForm"], [1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "text-2xl", "font-bold", "mb-6", "text-green-600"], [3, "ngSubmit"], [1, "bg-base-100", "p-6", "rounded-xl", "shadow-sm", "border", "border-base-200", "mb-6", "text-base-content"], [1, "text-lg", "font-semibold", "mb-4", "text-base-content", "border-b", "border-base-200", "pb-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "block", "text-sm", "font-medium", "text-base-content", "mb-1.5"], ["type", "text", "name", "customer_name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "customer_email", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "tel", "name", "customer_phone", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "customer_address", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "col-span-1", "md:col-span-2"], ["type", "text", "name", "imei", "placeholder", "Ej: 3520190...", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "md:col-span-2"], ["name", "status", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["value", "pending"], ["value", "processing"], ["value", "completed"], ["value", "cancelled"], [1, "flex", "justify-between", "items-center", "mb-4", "border-b", "border-base-200", "pb-2"], [1, "text-lg", "font-semibold", "text-base-content"], ["type", "button", 1, "btn", "btn-sm", "btn-primary", 3, "click"], [1, "fas", "fa-plus", "mr-2"], [1, "text-center", "py-8", "text-gray-500", "bg-gray-50", "rounded-lg", "border", "border-dashed", "border-gray-300"], [1, "overflow-x-auto"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-8"], [1, "space-y-4"], ["type", "number", "name", "discount", "min", "0", "step", "0.01", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["name", "notes", "rows", "3", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "bg-base-200", "p-6", "rounded-xl", "border", "border-base-300", "h-fit"], [1, "space-y-3"], [1, "flex", "justify-between", "text-base-content/80"], [1, "font-mono", "font-medium"], [1, "font-mono", "font-medium", "text-error"], [1, "divider", "my-2"], [1, "flex", "justify-between", "text-xl", "font-bold", "text-base-content"], [1, "font-mono", "text-primary"], [1, "alert", "alert-error", "mb-6"], [1, "flex", "gap-4", "justify-end", "mb-8"], ["routerLink", "/admin/orders", 1, "btn", "btn-error", "text-white"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-box-open", "text-4xl", "mb-2", "text-gray-400"], [1, "table", "w-full"], [1, "text-base-content", "border-b-2", "border-base-200"], [1, "font-semibold"], [1, "font-semibold", "w-24"], [1, "font-semibold", "text-right"], [1, "w-10"], [1, "border-b", "border-base-200", "hover:bg-base-200/50"], [1, "min-w-[200px]"], ["required", "", 1, "select", "select-bordered", "select-sm", "w-full", "bg-base-100", "text-base-content", "border-base-300", 3, "change", "value"], ["value", ""], [3, "value"], ["type", "number", "min", "1", 1, "input", "input-bordered", "input-sm", "w-full", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel", "name"], [1, "font-mono", "text-right", "text-base-content/80"], [1, "font-mono", "font-semibold", "text-right", "text-base-content"], [1, "text-right"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", "btn-circle", "text-error", "hover:bg-red-50", 3, "click"], [1, "fas", "fa-trash"], [1, "fas", "fa-exclamation-circle"]], template: function AdminOrderFormPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "h2", 2);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "form", 3, 0);
      \u0275\u0275listener("ngSubmit", function AdminOrderFormPage_Template_form_ngSubmit_3_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.save());
      });
      \u0275\u0275elementStart(5, "div", 4)(6, "h3", 5);
      \u0275\u0275text(7, "Informaci\xF3n del Cliente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 6)(9, "div")(10, "label", 7);
      \u0275\u0275text(11, "Nombre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().customer_name, $event) || (ctx.form().customer_name = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div")(14, "label", 7);
      \u0275\u0275text(15, "Email *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().customer_email, $event) || (ctx.form().customer_email = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div")(18, "label", 7);
      \u0275\u0275text(19, "Tel\xE9fono");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_20_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().customer_phone, $event) || (ctx.form().customer_phone = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div")(22, "label", 7);
      \u0275\u0275text(23, "Direcci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_24_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().customer_address, $event) || (ctx.form().customer_address = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 12)(26, "label", 7);
      \u0275\u0275text(27, "IMEI / S/N del Dispositivo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().imei, $event) || (ctx.form().imei = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 14)(30, "label", 7);
      \u0275\u0275text(31, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "select", 15);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_select_ngModelChange_32_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().status, $event) || (ctx.form().status = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(33, "option", 16);
      \u0275\u0275text(34, "Pendiente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "option", 17);
      \u0275\u0275text(36, "Procesando");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "option", 18);
      \u0275\u0275text(38, "Completado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "option", 19);
      \u0275\u0275text(40, "Cancelado");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(41, "div", 4)(42, "div", 20)(43, "h3", 21);
      \u0275\u0275text(44, "Productos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "button", 22);
      \u0275\u0275listener("click", function AdminOrderFormPage_Template_button_click_45_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.addItem());
      });
      \u0275\u0275element(46, "i", 23);
      \u0275\u0275text(47, " Agregar Producto ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(48, AdminOrderFormPage_Conditional_48_Template, 4, 0, "div", 24)(49, AdminOrderFormPage_Conditional_49_Template, 16, 0, "div", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "div", 4)(51, "h3", 5);
      \u0275\u0275text(52, "Totales y Notas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 26)(54, "div", 27)(55, "div")(56, "label", 7);
      \u0275\u0275text(57, "Descuento");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "input", 28);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_58_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().discount, $event) || (ctx.form().discount = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("ngModelChange", function AdminOrderFormPage_Template_input_ngModelChange_58_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.calculateTotals());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(59, "div")(60, "label", 7);
      \u0275\u0275text(61, "Notas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "textarea", 29);
      \u0275\u0275twoWayListener("ngModelChange", function AdminOrderFormPage_Template_textarea_ngModelChange_62_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.form().notes, $event) || (ctx.form().notes = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(63, "div", 30)(64, "div", 31)(65, "div", 32)(66, "span");
      \u0275\u0275text(67, "Subtotal:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "span", 33);
      \u0275\u0275text(69);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(70, "div", 32)(71, "span");
      \u0275\u0275text(72, "Descuento:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "span", 34);
      \u0275\u0275text(74);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div", 32)(76, "span");
      \u0275\u0275text(77, "IVA (21%):");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "span", 33);
      \u0275\u0275text(79);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(80, "div", 35);
      \u0275\u0275elementStart(81, "div", 36)(82, "span");
      \u0275\u0275text(83, "Total:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "span", 37);
      \u0275\u0275text(85);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275conditionalCreate(86, AdminOrderFormPage_Conditional_86_Template, 4, 1, "div", 38);
      \u0275\u0275elementStart(87, "div", 39)(88, "a", 40);
      \u0275\u0275text(89, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(90, "button", 41);
      \u0275\u0275conditionalCreate(91, AdminOrderFormPage_Conditional_91_Template, 1, 0, "span", 42);
      \u0275\u0275text(92);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      const f_r7 = \u0275\u0275reference(4);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nuevo", " Pedido");
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().customer_name);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().customer_email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().customer_phone);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().customer_address);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().imei);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().status);
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.items().length === 0 ? 48 : 49);
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().discount);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().notes);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("$", ctx.form().subtotal.toFixed(2));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("-$", ctx.form().discount.toFixed(2));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$", ctx.form().tax.toFixed(2));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("$", ctx.form().total.toFixed(2));
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error ? 86 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving || f_r7.invalid);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving ? 91 : -1);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.saving ? "Guardando..." : "Guardar Pedido", " ");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink, CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminOrderFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-order-form-page", standalone: true, imports: [FormsModule, RouterLink, CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <h2 class="text-2xl font-bold mb-6 text-green-600">{{ id ? 'Editar' : 'Nuevo' }} Pedido</h2>\r
\r
    <form (ngSubmit)="save()" #f="ngForm">\r
        <!-- Customer Information -->\r
        <div class="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 mb-6 text-base-content">\r
            <h3 class="text-lg font-semibold mb-4 text-base-content border-b border-base-200 pb-2">Informaci\xF3n del Cliente</h3>\r
\r
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Nombre *</label>\r
                    <input type="text" [(ngModel)]="form().customer_name" name="customer_name" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        required />\r
                </div>\r
\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Email *</label>\r
                    <input type="email" [(ngModel)]="form().customer_email" name="customer_email"\r
                        class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" required />\r
                </div>\r
\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Tel\xE9fono</label>\r
                    <input type="tel" [(ngModel)]="form().customer_phone" name="customer_phone"\r
                        class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" />\r
                </div>\r
\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Direcci\xF3n</label>\r
                    <input type="text" [(ngModel)]="form().customer_address" name="customer_address"\r
                        class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" />\r
                </div>\r
\r
                <div class="col-span-1 md:col-span-2">\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">IMEI / S/N del Dispositivo</label>\r
                    <input type="text" [(ngModel)]="form().imei" name="imei" placeholder="Ej: 3520190..."\r
                        class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" />\r
                </div>\r
\r
\r
                <div class="md:col-span-2">\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Estado</label>\r
                    <select [(ngModel)]="form().status" name="status" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
                        <option value="pending">Pendiente</option>\r
                        <option value="processing">Procesando</option>\r
                        <option value="completed">Completado</option>\r
                        <option value="cancelled">Cancelado</option>\r
                    </select>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Order Items -->\r
        <div class="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 mb-6 text-base-content">\r
            <div class="flex justify-between items-center mb-4 border-b border-base-200 pb-2">\r
                <h3 class="text-lg font-semibold text-base-content">Productos</h3>\r
                <button type="button" (click)="addItem()" class="btn btn-sm btn-primary">\r
                    <i class="fas fa-plus mr-2"></i>\r
                    Agregar Producto\r
                </button>\r
            </div>\r
\r
            @if (items().length === 0) {\r
            <div class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">\r
                <i class="fas fa-box-open text-4xl mb-2 text-gray-400"></i>\r
                <p>No hay productos agregados</p>\r
            </div>\r
            } @else {\r
            <div class="overflow-x-auto">\r
                <table class="table w-full">\r
                    <thead>\r
                        <tr class="text-base-content border-b-2 border-base-200">\r
                            <th class="font-semibold">Producto</th>\r
                            <th class="font-semibold w-24">Cantidad</th>\r
                            <th class="font-semibold text-right">Precio Unit.</th>\r
                            <th class="font-semibold text-right">Subtotal</th>\r
                            <th class="w-10"></th>\r
                        </tr>\r
                    </thead>\r
                    <tbody>\r
                        @for (item of items(); track $index; let idx = $index) {\r
                        <tr class="border-b border-base-200 hover:bg-base-200/50">\r
                            <td class="min-w-[200px]">\r
                                <select [value]="item.product_id"\r
                                    (change)="onProductSelect(idx, $any($event.target).value)"\r
                                    class="select select-bordered select-sm w-full bg-base-100 text-base-content border-base-300" required>\r
                                    <option value="">Seleccionar producto...</option>\r
                                    @for (product of products; track product.id) {\r
                                    <option [value]="product.id">\r
                                        {{ product.name }} ({{ product.sku }})\r
                                    </option>\r
                                    }\r
                                </select>\r
                            </td>\r
                            <td>\r
                                <input type="number" [(ngModel)]="item.quantity" (ngModelChange)="onQuantityChange(idx)"\r
                                    [name]="'quantity_' + idx" min="1"\r
                                    class="input input-bordered input-sm w-full bg-base-100 text-base-content border-base-300" />\r
                            </td>\r
                            <td class="font-mono text-right text-base-content/80">\${{ item.unit_price.toFixed(2) }}</td>\r
                            <td class="font-mono font-semibold text-right text-base-content">\${{ item.subtotal.toFixed(2) }}\r
                            </td>\r
                            <td class="text-right">\r
                                <button type="button" (click)="removeItem(idx)"\r
                                    class="btn btn-ghost btn-sm btn-circle text-error hover:bg-red-50">\r
                                    <i class="fas fa-trash"></i>\r
                                </button>\r
                            </td>\r
                        </tr>\r
                        }\r
                    </tbody>\r
                </table>\r
            </div>\r
            }\r
        </div>\r
\r
        <!-- Totals -->\r
        <div class="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 mb-6 text-base-content">\r
            <h3 class="text-lg font-semibold mb-4 text-base-content border-b border-base-200 pb-2">Totales y Notas</h3>\r
\r
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">\r
                <div class="space-y-4">\r
                    <div>\r
                        <label class="block text-sm font-medium text-base-content mb-1.5">Descuento</label>\r
                        <input type="number" [(ngModel)]="form().discount" (ngModelChange)="calculateTotals()"\r
                            name="discount" min="0" step="0.01" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" />\r
                    </div>\r
\r
                    <div>\r
                        <label class="block text-sm font-medium text-base-content mb-1.5">Notas</label>\r
                        <textarea [(ngModel)]="form().notes" name="notes" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                            rows="3"></textarea>\r
                    </div>\r
                </div>\r
\r
                <div class="bg-base-200 p-6 rounded-xl border border-base-300 h-fit">\r
                    <div class="space-y-3">\r
                        <div class="flex justify-between text-base-content/80">\r
                            <span>Subtotal:</span>\r
                            <span class="font-mono font-medium">\${{ form().subtotal.toFixed(2) }}</span>\r
                        </div>\r
                        <div class="flex justify-between text-base-content/80">\r
                            <span>Descuento:</span>\r
                            <span class="font-mono font-medium text-error">-\${{ form().discount.toFixed(2) }}</span>\r
                        </div>\r
                        <div class="flex justify-between text-base-content/80">\r
                            <span>IVA (21%):</span>\r
                            <span class="font-mono font-medium">\${{ form().tax.toFixed(2) }}</span>\r
                        </div>\r
                        <div class="divider my-2"></div>\r
                        <div class="flex justify-between text-xl font-bold text-base-content">\r
                            <span>Total:</span>\r
                            <span class="font-mono text-primary">\${{ form().total.toFixed(2) }}</span>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        @if (error) {\r
        <div class="alert alert-error mb-6">\r
            <i class="fas fa-exclamation-circle"></i>\r
            <span>{{ error }}</span>\r
        </div>\r
        }\r
\r
        <div class="flex gap-4 justify-end mb-8">\r
            <a routerLink="/admin/orders" class="btn btn-error text-white">Cancelar</a>\r
            <button type="submit" class="btn btn-primary px-8" [disabled]="saving || f.invalid">\r
                @if (saving) {\r
                <span class="loading loading-spinner loading-xs mr-2"></span>\r
                }\r
                {{ saving ? 'Guardando...' : 'Guardar Pedido' }}\r
            </button>\r
        </div>\r
    </form>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminOrderFormPage, { className: "AdminOrderFormPage", filePath: "src/app/admin/orders/admin-order-form-page.ts", lineNumber: 26 });
})();
export {
  AdminOrderFormPage
};
//# sourceMappingURL=chunk-7IO4N6V5.js.map
