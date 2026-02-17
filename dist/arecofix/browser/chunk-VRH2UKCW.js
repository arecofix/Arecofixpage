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
  CommonModule,
  NgIf,
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  Component,
  computed,
  inject,
  setClassMetadata,
  signal,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
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

// src/app/admin/purchases/admin-purchase-form-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminPurchaseFormPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 29);
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
function AdminPurchaseFormPage_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const supplier_r2 = ctx.$implicit;
    \u0275\u0275property("value", supplier_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(supplier_r2.name);
  }
}
function AdminPurchaseFormPage_For_34_label_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 41);
    \u0275\u0275text(1, "Producto");
    \u0275\u0275elementEnd();
  }
}
function AdminPurchaseFormPage_For_34_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r5 = ctx.$implicit;
    \u0275\u0275property("value", product_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", product_r5.name, " (Stock: ", product_r5.stock, ")");
  }
}
function AdminPurchaseFormPage_For_34_label_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 41);
    \u0275\u0275text(1, "Cantidad");
    \u0275\u0275elementEnd();
  }
}
function AdminPurchaseFormPage_For_34_label_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 41);
    \u0275\u0275text(1, "Costo Unit.");
    \u0275\u0275elementEnd();
  }
}
function AdminPurchaseFormPage_For_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 30);
    \u0275\u0275template(2, AdminPurchaseFormPage_For_34_label_2_Template, 2, 0, "label", 31);
    \u0275\u0275elementStart(3, "select", 32);
    \u0275\u0275listener("ngModelChange", function AdminPurchaseFormPage_For_34_Template_select_ngModelChange_3_listener($event) {
      const $index_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateItem($index_r4, "product_id", $event));
    });
    \u0275\u0275elementStart(4, "option", 33);
    \u0275\u0275text(5, "Seleccionar Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, AdminPurchaseFormPage_For_34_For_7_Template, 2, 3, "option", 13, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 34);
    \u0275\u0275template(9, AdminPurchaseFormPage_For_34_label_9_Template, 2, 0, "label", 31);
    \u0275\u0275elementStart(10, "input", 35);
    \u0275\u0275listener("ngModelChange", function AdminPurchaseFormPage_For_34_Template_input_ngModelChange_10_listener($event) {
      const $index_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateItem($index_r4, "quantity", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 36);
    \u0275\u0275template(12, AdminPurchaseFormPage_For_34_label_12_Template, 2, 0, "label", 31);
    \u0275\u0275elementStart(13, "input", 37);
    \u0275\u0275listener("ngModelChange", function AdminPurchaseFormPage_For_34_Template_input_ngModelChange_13_listener($event) {
      const $index_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateItem($index_r4, "unit_cost", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 38);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 39);
    \u0275\u0275listener("click", function AdminPurchaseFormPage_For_34_Template_button_click_16_listener() {
      const $index_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.removeItem($index_r4));
    });
    \u0275\u0275element(17, "i", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const $index_r4 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", $index_r4 === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", item_r6.product_id)("name", "product_" + $index_r4);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.products());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", $index_r4 === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", item_r6.quantity)("name", "qty_" + $index_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", $index_r4 === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", item_r6.unit_cost)("name", "cost_" + $index_r4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" $", item_r6.quantity * item_r6.unit_cost, " ");
  }
}
function AdminPurchaseFormPage_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 28);
  }
}
var AdminPurchaseFormPage = class _AdminPurchaseFormPage {
  auth = inject(AuthService);
  router = inject(Router);
  suppliers = signal([], ...ngDevMode ? [{ debugName: "suppliers" }] : []);
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  form = signal({
    supplier_id: "",
    purchase_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    status: "received"
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  items = signal([], ...ngDevMode ? [{ debugName: "items" }] : []);
  // { product_id, quantity, unit_cost }
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  total = computed(() => this.items().reduce((acc, item) => acc + item.quantity * item.unit_cost, 0), ...ngDevMode ? [{ debugName: "total" }] : []);
  async ngOnInit() {
    const supabase = this.auth.getSupabaseClient();
    const [suppliersRes, productsRes] = await Promise.all([
      supabase.from("suppliers").select("*").eq("is_active", true),
      supabase.from("products").select("*").eq("is_active", true)
    ]);
    if (suppliersRes.data)
      this.suppliers.set(suppliersRes.data);
    if (productsRes.data)
      this.products.set(productsRes.data);
    this.loading.set(false);
  }
  addItem() {
    this.items.update((i) => [...i, { product_id: "", quantity: 1, unit_cost: 0 }]);
  }
  removeItem(index) {
    this.items.update((i) => i.filter((_, idx) => idx !== index));
  }
  updateItem(index, field, value) {
    this.items.update((items) => {
      const newItems = [...items];
      newItems[index] = __spreadProps(__spreadValues({}, newItems[index]), { [field]: value });
      return newItems;
    });
  }
  async save() {
    if (this.items().length === 0) {
      this.error.set("Debe agregar al menos un producto");
      return;
    }
    if (!this.form().supplier_id) {
      this.error.set("Debe seleccionar un proveedor");
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const supabase = this.auth.getSupabaseClient();
    try {
      const { data: purchase, error: purchaseError } = await supabase.from("purchases").insert({
        supplier_id: this.form().supplier_id,
        purchase_date: this.form().purchase_date,
        status: this.form().status,
        total_amount: this.total()
      }).select().single();
      if (purchaseError)
        throw purchaseError;
      const purchaseItems = this.items().map((item) => ({
        purchase_id: purchase.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost
      }));
      const { error: itemsError } = await supabase.from("purchase_items").insert(purchaseItems);
      if (itemsError)
        throw itemsError;
      if (this.form().status === "received") {
        for (const item of this.items()) {
          const { data: currentProduct } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
          if (currentProduct) {
            await supabase.from("products").update({ stock: currentProduct.stock + item.quantity }).eq("id", item.product_id);
          }
        }
      }
      this.router.navigate(["/admin/purchases"]);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function AdminPurchaseFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPurchaseFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPurchaseFormPage, selectors: [["app-admin-purchase-form-page"]], decls: 47, vars: 7, consts: [[1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "flex", "items-center", "gap-4", "mb-6"], ["routerLink", "/admin/purchases", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "bg-base-100", "rounded-lg", "shadow", "p-6", "text-base-content"], [1, "alert", "alert-error", "mb-4"], [1, "space-y-6", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "form-control"], [1, "label", "text-base-content"], ["name", "supplier_id", "required", "", 1, "select", "select-bordered", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", "", "selected", ""], [1, "text-gray-900", "bg-white", "dark:text-white", "dark:bg-gray-800", 3, "value"], ["type", "date", "name", "purchase_date", "required", "", 1, "input", "input-bordered", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel"], ["name", "status", 1, "select", "select-bordered", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel"], ["value", "received"], ["value", "ordered"], [1, "divider"], [1, "space-y-4"], [1, "flex", "gap-4", "items-end", "bg-base-200", "p-4", "rounded", "text-base-content"], ["type", "button", 1, "btn", "btn-outline", "btn-sm", "w-full", "border-dashed", 3, "click"], [1, "fas", "fa-plus", "mr-2"], [1, "flex", "justify-between", "items-center", "mt-8", "pt-4", "border-t"], [1, "text-2xl", "font-bold"], [1, "flex", "gap-4"], ["routerLink", "/admin/purchases", 1, "btn", "btn-error", "text-white"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "fas", "fa-exclamation-circle"], [1, "form-control", "flex-1"], ["class", "label text-xs text-base-content/70", 4, "ngIf"], [1, "select", "select-bordered", "w-full", "select-sm", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel", "name"], ["value", "", "disabled", "", "selected", "", 1, "text-gray-400"], [1, "form-control", "w-24"], ["type", "number", "min", "1", 1, "input", "input-bordered", "input-sm", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel", "name"], [1, "form-control", "w-32"], ["type", "number", "min", "0", 1, "input", "input-bordered", "input-sm", "bg-base-100", "text-base-content", "border-base-300", 3, "ngModelChange", "ngModel", "name"], [1, "w-24", "text-right", "font-bold", "text-sm", "pb-2", "text-base-content"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", "text-error", "hover:bg-base-300", 3, "click"], [1, "fas", "fa-trash"], [1, "label", "text-xs", "text-base-content/70"]], template: function AdminPurchaseFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 4);
      \u0275\u0275text(5, "Registrar Compra");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275conditionalCreate(7, AdminPurchaseFormPage_Conditional_7_Template, 4, 1, "div", 6);
      \u0275\u0275elementStart(8, "form", 7);
      \u0275\u0275listener("ngSubmit", function AdminPurchaseFormPage_Template_form_ngSubmit_8_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(9, "div", 8)(10, "div", 9)(11, "label", 10);
      \u0275\u0275text(12, "Proveedor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "select", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AdminPurchaseFormPage_Template_select_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().supplier_id, $event) || (ctx.form().supplier_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(14, "option", 12);
      \u0275\u0275text(15, "Seleccionar Proveedor");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(16, AdminPurchaseFormPage_For_17_Template, 2, 2, "option", 13, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 9)(19, "label", 10);
      \u0275\u0275text(20, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function AdminPurchaseFormPage_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().purchase_date, $event) || (ctx.form().purchase_date = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 9)(23, "label", 10);
      \u0275\u0275text(24, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "select", 15);
      \u0275\u0275twoWayListener("ngModelChange", function AdminPurchaseFormPage_Template_select_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().status, $event) || (ctx.form().status = $event);
        return $event;
      });
      \u0275\u0275elementStart(26, "option", 16);
      \u0275\u0275text(27, "Recibido (Aumenta Stock)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "option", 17);
      \u0275\u0275text(29, "Ordenado (Pendiente)");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(30, "div", 18);
      \u0275\u0275text(31, "Productos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 19);
      \u0275\u0275repeaterCreate(33, AdminPurchaseFormPage_For_34_Template, 18, 10, "div", 20, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementStart(35, "button", 21);
      \u0275\u0275listener("click", function AdminPurchaseFormPage_Template_button_click_35_listener() {
        return ctx.addItem();
      });
      \u0275\u0275element(36, "i", 22);
      \u0275\u0275text(37, " Agregar Producto ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 23)(39, "div", 24);
      \u0275\u0275text(40);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 25)(42, "a", 26);
      \u0275\u0275text(43, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "button", 27);
      \u0275\u0275conditionalCreate(45, AdminPurchaseFormPage_Conditional_45_Template, 1, 0, "span", 28);
      \u0275\u0275text(46, " Guardar Compra ");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.error() ? 7 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().supplier_id);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.suppliers());
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().purchase_date);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().status);
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.items());
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("Total: $", ctx.total());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 45 : -1);
    }
  }, dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPurchaseFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-purchase-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <div class="flex items-center gap-4 mb-6">\r
        <a routerLink="/admin/purchases" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
        <h1 class="text-2xl font-bold text-green-600">Registrar Compra</h1>\r
    </div>\r
\r
    <div class="bg-base-100 rounded-lg shadow p-6 text-base-content">\r
        @if (error()) {\r
        <div class="alert alert-error mb-4">\r
            <i class="fas fa-exclamation-circle"></i>\r
            <span>{{ error() }}</span>\r
        </div>\r
        }\r
\r
        <form (ngSubmit)="save()" class="space-y-6">\r
            <!-- Header Info -->\r
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\r
                <div class="form-control">\r
                    <label class="label text-base-content">Proveedor</label>\r
                    <select [(ngModel)]="form().supplier_id" name="supplier_id"\r
                        class="select select-bordered bg-base-100 text-base-content border-base-300" required>\r
                        <option value="" disabled selected>Seleccionar Proveedor</option>\r
                        @for (supplier of suppliers(); track supplier.id) {\r
                        <option [value]="supplier.id" class="text-gray-900 bg-white dark:text-white dark:bg-gray-800">{{ supplier.name }}</option>\r
                        }\r
                    </select>\r
                </div>\r
                <div class="form-control">\r
                    <label class="label text-base-content">Fecha</label>\r
                    <input type="date" [(ngModel)]="form().purchase_date" name="purchase_date"\r
                        class="input input-bordered bg-base-100 text-base-content border-base-300" required>\r
                </div>\r
                <div class="form-control">\r
                    <label class="label text-base-content">Estado</label>\r
                    <select [(ngModel)]="form().status" name="status"\r
                        class="select select-bordered bg-base-100 text-base-content border-base-300">\r
                        <option value="received">Recibido (Aumenta Stock)</option>\r
                        <option value="ordered">Ordenado (Pendiente)</option>\r
                    </select>\r
                </div>\r
            </div>\r
\r
            <div class="divider">Productos</div>\r
\r
            <!-- Items -->\r
            <div class="space-y-4">\r
                @for (item of items(); track $index) {\r
                <div class="flex gap-4 items-end bg-base-200 p-4 rounded text-base-content">\r
                    <div class="form-control flex-1">\r
                        <label class="label text-xs text-base-content/70" *ngIf="$index === 0">Producto</label>\r
                        <select [ngModel]="item.product_id" (ngModelChange)="updateItem($index, 'product_id', $event)"\r
                            [name]="'product_' + $index"\r
                            class="select select-bordered w-full select-sm bg-base-100 text-base-content border-base-300">\r
                            <option value="" disabled selected class="text-gray-400">Seleccionar Producto</option>\r
                            @for (product of products(); track product.id) {\r
                            <option [value]="product.id" class="text-gray-900 bg-white dark:text-white dark:bg-gray-800">{{ product.name }} (Stock: {{ product.stock }})</option>\r
                            }\r
                        </select>\r
                    </div>\r
                    <div class="form-control w-24">\r
                        <label class="label text-xs text-base-content/70" *ngIf="$index === 0">Cantidad</label>\r
                        <input type="number" [ngModel]="item.quantity"\r
                            (ngModelChange)="updateItem($index, 'quantity', $event)" [name]="'qty_' + $index"\r
                            class="input input-bordered input-sm bg-base-100 text-base-content border-base-300" min="1">\r
                    </div>\r
                    <div class="form-control w-32">\r
                        <label class="label text-xs text-base-content/70" *ngIf="$index === 0">Costo Unit.</label>\r
                        <input type="number" [ngModel]="item.unit_cost"\r
                            (ngModelChange)="updateItem($index, 'unit_cost', $event)" [name]="'cost_' + $index"\r
                            class="input input-bordered input-sm bg-base-100 text-base-content border-base-300" min="0">\r
                    </div>\r
                    <div class="w-24 text-right font-bold text-sm pb-2 text-base-content">\r
                        \${{ item.quantity * item.unit_cost }}\r
                    </div>\r
                    <button type="button" (click)="removeItem($index)" class="btn btn-ghost btn-sm text-error hover:bg-base-300">\r
                        <i class="fas fa-trash"></i>\r
                    </button>\r
                </div>\r
                }\r
\r
                <button type="button" (click)="addItem()" class="btn btn-outline btn-sm w-full border-dashed">\r
                    <i class="fas fa-plus mr-2"></i> Agregar Producto\r
                </button>\r
            </div>\r
\r
            <div class="flex justify-between items-center mt-8 pt-4 border-t">\r
                <div class="text-2xl font-bold">Total: \${{ total() }}</div>\r
                <div class="flex gap-4">\r
                    <a routerLink="/admin/purchases" class="btn btn-error text-white">Cancelar</a>\r
                    <button type="submit" class="btn btn-primary" [disabled]="saving()">\r
                        @if (saving()) {\r
                        <span class="loading loading-spinner"></span>\r
                        }\r
                        Guardar Compra\r
                    </button>\r
                </div>\r
            </div>\r
        </form>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPurchaseFormPage, { className: "AdminPurchaseFormPage", filePath: "src/app/admin/purchases/admin-purchase-form-page.ts", lineNumber: 13 });
})();
export {
  AdminPurchaseFormPage
};
//# sourceMappingURL=chunk-VRH2UKCW.js.map
