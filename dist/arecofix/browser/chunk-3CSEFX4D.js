import {
  AdminProductService
} from "./chunk-F7UXBCDW.js";
import "./chunk-XUAOU2YN.js";
import "./chunk-ZJZBKGOC.js";
import {
  Pagination
} from "./chunk-IZUXSIIJ.js";
import "./chunk-NJJ5IL4Q.js";
import "./chunk-GR2FBAX3.js";
import {
  CheckboxControlValueAccessor,
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
} from "./chunk-TOKXMODF.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  CurrencyPipe,
  NgIf,
  RouterLink,
  SlicePipe
} from "./chunk-WHLM5VZW.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  computed,
  inject,
  model,
  output,
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
  ɵɵpipeBind2,
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XQFVERLD.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/products/components/bulk-edit-modal/bulk-edit-modal.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function BulkEditModalComponent_Conditional_0_Case_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "label", 19)(2, "span", 20);
    \u0275\u0275text(3, "Porcentaje de Aumento");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 21)(5, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function BulkEditModalComponent_Conditional_0_Case_25_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.inflationPercentage, $event) || (ctx_r1.inflationPercentage = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 23);
    \u0275\u0275text(7, "%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "label", 19)(9, "span", 24);
    \u0275\u0275text(10, "Ejemplo: 10% convertir\xE1 $100 -> $110");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.inflationPercentage);
  }
}
function BulkEditModalComponent_Conditional_0_Case_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "label", 19)(2, "span", 25);
    \u0275\u0275text(3, "Nueva Moneda");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "select", 26);
    \u0275\u0275twoWayListener("ngModelChange", function BulkEditModalComponent_Conditional_0_Case_26_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.targetCurrency, $event) || (ctx_r1.targetCurrency = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 27);
    \u0275\u0275text(6, "\u{1F1E6}\u{1F1F7} Peso Argentino (ARS)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 28);
    \u0275\u0275text(8, "\u{1F1FA}\u{1F1F8} D\xF3lar (USD)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 29);
    \u0275\u0275element(10, "i", 30);
    \u0275\u0275text(11, " Solo cambia la etiqueta, no convierte valores. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.targetCurrency);
  }
}
function BulkEditModalComponent_Conditional_0_Case_27_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r6 = ctx.$implicit;
    \u0275\u0275property("value", b_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r6.name);
  }
}
function BulkEditModalComponent_Conditional_0_Case_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "label", 19)(2, "span", 25);
    \u0275\u0275text(3, "Nueva Marca");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "select", 31);
    \u0275\u0275twoWayListener("ngModelChange", function BulkEditModalComponent_Conditional_0_Case_27_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.targetBrandId, $event) || (ctx_r1.targetBrandId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 32);
    \u0275\u0275text(6, "Seleccionar...");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, BulkEditModalComponent_Conditional_0_Case_27_For_8_Template, 2, 2, "option", 33, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.targetBrandId);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.brands());
  }
}
function BulkEditModalComponent_Conditional_0_Case_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "label", 34)(2, "span", 20);
    \u0275\u0275text(3, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function BulkEditModalComponent_Conditional_0_Case_28_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.targetStatus, $event) || (ctx_r1.targetStatus = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.targetStatus);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-success", ctx_r1.targetStatus())("text-gray-400", !ctx_r1.targetStatus());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.targetStatus() ? "ACTIVO" : "INACTIVO", " ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 37);
    \u0275\u0275text(1, " Procesando... ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Aplicar Cambios ");
  }
}
function BulkEditModalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "button", 2);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 3);
    \u0275\u0275text(5, "Edici\xF3n Masiva");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 4);
    \u0275\u0275text(7, "Aplicando cambios a ");
    \u0275\u0275elementStart(8, "span", 5);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " productos seleccionados.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 6)(12, "button", 7);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode.set("price_inflation"));
    });
    \u0275\u0275element(13, "i", 8);
    \u0275\u0275text(14, " Inflaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 7);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode.set("currency_change"));
    });
    \u0275\u0275element(16, "i", 9);
    \u0275\u0275text(17, " Moneda ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 7);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode.set("brand_change"));
    });
    \u0275\u0275element(19, "i", 10);
    \u0275\u0275text(20, " Marca ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 7);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode.set("status_change"));
    });
    \u0275\u0275element(22, "i", 11);
    \u0275\u0275text(23, " Estado ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 12);
    \u0275\u0275conditionalCreate(25, BulkEditModalComponent_Conditional_0_Case_25_Template, 11, 1, "div", 13)(26, BulkEditModalComponent_Conditional_0_Case_26_Template, 12, 1, "div", 13)(27, BulkEditModalComponent_Conditional_0_Case_27_Template, 9, 1, "div", 13)(28, BulkEditModalComponent_Conditional_0_Case_28_Template, 7, 6, "div", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 14)(30, "button", 15);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(31, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 16);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.execute());
    });
    \u0275\u0275conditionalCreate(33, BulkEditModalComponent_Conditional_0_Conditional_33_Template, 2, 0)(34, BulkEditModalComponent_Conditional_0_Conditional_34_Template, 1, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "form", 17)(36, "button", 18);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(37, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.selectedIds().length);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("btn-active", ctx_r1.mode() === "price_inflation");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("btn-active", ctx_r1.mode() === "currency_change");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("btn-active", ctx_r1.mode() === "brand_change");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("btn-active", ctx_r1.mode() === "status_change");
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.mode()) === "price_inflation" ? 25 : tmp_6_0 === "currency_change" ? 26 : tmp_6_0 === "brand_change" ? 27 : tmp_6_0 === "status_change" ? 28 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isProcessing() ? 33 : 34);
  }
}
var BulkEditModalComponent = class _BulkEditModalComponent {
  productService = inject(AdminProductService);
  isOpen = model(false, ...ngDevMode ? [{ debugName: "isOpen" }] : []);
  selectedIds = model([], ...ngDevMode ? [{ debugName: "selectedIds" }] : []);
  brands = model([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  // Pass brands from parent
  onSuccess = output();
  mode = signal("price_inflation", ...ngDevMode ? [{ debugName: "mode" }] : []);
  isProcessing = signal(false, ...ngDevMode ? [{ debugName: "isProcessing" }] : []);
  // Form Values
  inflationPercentage = signal(0, ...ngDevMode ? [{ debugName: "inflationPercentage" }] : []);
  targetCurrency = signal("ARS", ...ngDevMode ? [{ debugName: "targetCurrency" }] : []);
  targetBrandId = signal("", ...ngDevMode ? [{ debugName: "targetBrandId" }] : []);
  targetStatus = signal(true, ...ngDevMode ? [{ debugName: "targetStatus" }] : []);
  async execute() {
    if (this.selectedIds().length === 0)
      return;
    this.isProcessing.set(true);
    try {
      const ids = this.selectedIds();
      switch (this.mode()) {
        case "price_inflation":
          await this.productService.bulkIncreasePrice(ids, this.inflationPercentage());
          break;
        case "currency_change":
          await this.productService.bulkUpdate(ids, { currency: this.targetCurrency() });
          break;
        case "brand_change":
          await this.productService.bulkUpdate(ids, { brand_id: this.targetBrandId() });
          break;
        case "status_change":
          await this.productService.bulkUpdate(ids, { is_active: this.targetStatus() });
          break;
      }
      this.onSuccess.emit();
      this.close();
    } catch (err) {
      console.error(err);
      alert("Error al procesar edici\xF3n masiva");
    } finally {
      this.isProcessing.set(false);
    }
  }
  close() {
    this.isOpen.set(false);
    this.inflationPercentage.set(0);
  }
  static \u0275fac = function BulkEditModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BulkEditModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BulkEditModalComponent, selectors: [["app-bulk-edit-modal"]], inputs: { isOpen: [1, "isOpen"], selectedIds: [1, "selectedIds"], brands: [1, "brands"] }, outputs: { isOpen: "isOpenChange", selectedIds: "selectedIdsChange", brands: "brandsChange", onSuccess: "onSuccess" }, decls: 1, vars: 1, consts: [[1, "modal", "modal-open", "z-50"], [1, "modal-box", "w-11/12", "max-w-2xl", "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "relative", "overflow-hidden"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-2", "top-2", 3, "click"], [1, "font-bold", "text-2xl", "text-gray-800", "dark:text-white", "mb-2"], [1, "text-sm", "text-gray-500", "mb-6"], [1, "badge", "badge-primary", "font-bold"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-2", "mb-8"], ["type", "button", 1, "btn", "btn-sm", "md:btn-md", "btn-outline", "normal-case", "transition-all", 3, "click"], [1, "fas", "fa-percentage"], [1, "fas", "fa-dollar-sign"], [1, "fas", "fa-tag"], [1, "fas", "fa-power-off"], [1, "bg-gray-50", "dark:bg-gray-700/30", "rounded-xl", "p-6", "mb-8", "min-h-[150px]", "flex", "flex-col", "justify-center", "animate-fade-in", "border", "border-dashed", "border-gray-300", "dark:border-gray-600"], [1, "form-control", "w-full", "max-w-xs", "mx-auto"], [1, "modal-action"], [1, "btn", "btn-ghost", 3, "click", "disabled"], [1, "btn", "btn-primary", "px-8", 3, "click", "disabled"], ["method", "dialog", 1, "modal-backdrop", "bg-black/50", "backdrop-blur-sm"], [3, "click"], [1, "label"], [1, "label-text", "font-bold", "text-lg"], [1, "relative"], ["type", "number", "placeholder", "ej: 10", 1, "input", "input-bordered", "input-lg", "w-full", "pr-12", "text-center", "font-bold", "text-2xl", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "text-gray-400", "font-bold", "text-xl"], [1, "label-text-alt", "text-gray-500"], [1, "label-text", "font-bold"], [1, "select", "select-bordered", "select-lg", "w-full", "text-center", "text-xl", 3, "ngModelChange", "ngModel"], ["value", "ARS"], ["value", "USD"], [1, "text-xs", "text-center", "mt-2", "text-warning"], [1, "fas", "fa-exclamation-triangle"], [1, "select", "select-bordered", "select-lg", "w-full", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "label", "cursor-pointer", "justify-center", "gap-4"], ["type", "checkbox", 1, "toggle", "toggle-success", "toggle-lg", 3, "ngModelChange", "ngModel"], [1, "font-bold"], [1, "loading", "loading-spinner"]], template: function BulkEditModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, BulkEditModalComponent_Conditional_0_Template, 38, 13, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BulkEditModalComponent, [{
    type: Component,
    args: [{ selector: "app-bulk-edit-modal", standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (isOpen()) {\r
<div class="modal modal-open z-50">\r
  <div class="modal-box w-11/12 max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">\r
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" (click)="close()">\u2715</button>\r
    \r
    <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-2">Edici\xF3n Masiva</h3>\r
    <p class="text-sm text-gray-500 mb-6">Aplicando cambios a <span class="badge badge-primary font-bold">{{ selectedIds().length }}</span> productos seleccionados.</p>\r
\r
    <!-- Mode Selector -->\r
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">\r
      <button \r
        type="button"\r
        (click)="mode.set('price_inflation')" \r
        [class.btn-active]="mode() === 'price_inflation'"\r
        class="btn btn-sm md:btn-md btn-outline normal-case transition-all">\r
        <i class="fas fa-percentage"></i> Inflaci\xF3n\r
      </button>\r
      <button \r
        type="button"\r
        (click)="mode.set('currency_change')" \r
        [class.btn-active]="mode() === 'currency_change'"\r
        class="btn btn-sm md:btn-md btn-outline normal-case transition-all">\r
        <i class="fas fa-dollar-sign"></i> Moneda\r
      </button>\r
      <button \r
        type="button"\r
        (click)="mode.set('brand_change')" \r
        [class.btn-active]="mode() === 'brand_change'" \r
        class="btn btn-sm md:btn-md btn-outline normal-case transition-all">\r
        <i class="fas fa-tag"></i> Marca\r
      </button>\r
      <button \r
        type="button"\r
        (click)="mode.set('status_change')" \r
        [class.btn-active]="mode() === 'status_change'" \r
        class="btn btn-sm md:btn-md btn-outline normal-case transition-all">\r
        <i class="fas fa-power-off"></i> Estado\r
      </button>\r
    </div>\r
\r
    <!-- Active Form -->\r
    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-8 min-h-[150px] flex flex-col justify-center animate-fade-in border border-dashed border-gray-300 dark:border-gray-600">\r
      \r
      @switch (mode()) {\r
        @case ('price_inflation') {\r
          <div class="form-control w-full max-w-xs mx-auto">\r
            <label class="label">\r
              <span class="label-text font-bold text-lg">Porcentaje de Aumento</span>\r
            </label>\r
            <div class="relative">\r
              <input type="number" [(ngModel)]="inflationPercentage" placeholder="ej: 10" class="input input-bordered input-lg w-full pr-12 text-center font-bold text-2xl" />\r
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">%</span>\r
            </div>\r
            <label class="label">\r
              <span class="label-text-alt text-gray-500">Ejemplo: 10% convertir\xE1 $100 -> $110</span>\r
            </label>\r
          </div>\r
        }\r
        @case ('currency_change') {\r
            <div class="form-control w-full max-w-xs mx-auto">\r
                <label class="label"><span class="label-text font-bold">Nueva Moneda</span></label>\r
                <select [(ngModel)]="targetCurrency" class="select select-bordered select-lg w-full text-center text-xl">\r
                    <option value="ARS">\u{1F1E6}\u{1F1F7} Peso Argentino (ARS)</option>\r
                    <option value="USD">\u{1F1FA}\u{1F1F8} D\xF3lar (USD)</option>\r
                </select>\r
                <p class="text-xs text-center mt-2 text-warning">\r
                    <i class="fas fa-exclamation-triangle"></i> Solo cambia la etiqueta, no convierte valores.\r
                </p>\r
            </div>\r
        }\r
        @case ('brand_change') {\r
            <div class="form-control w-full max-w-xs mx-auto">\r
                <label class="label"><span class="label-text font-bold">Nueva Marca</span></label>\r
                <select [(ngModel)]="targetBrandId" class="select select-bordered select-lg w-full">\r
                    <option value="">Seleccionar...</option>\r
                    @for(b of brands(); track b.id) {\r
                        <option [value]="b.id">{{ b.name }}</option>\r
                    }\r
                </select>\r
            </div>\r
        }\r
        @case ('status_change') {\r
            <div class="form-control w-full max-w-xs mx-auto">\r
                <label class="label cursor-pointer justify-center gap-4">\r
                    <span class="label-text font-bold text-lg">Estado</span> \r
                    <input type="checkbox" [(ngModel)]="targetStatus" class="toggle toggle-success toggle-lg" />\r
                    <span class="font-bold" [class.text-success]="targetStatus()" [class.text-gray-400]="!targetStatus()">\r
                        {{ targetStatus() ? 'ACTIVO' : 'INACTIVO' }}\r
                    </span>\r
                </label>\r
            </div>\r
        }\r
      }\r
    </div>\r
\r
    <!-- Actions -->\r
    <div class="modal-action">\r
      <button class="btn btn-ghost" (click)="close()" [disabled]="isProcessing()">Cancelar</button>\r
      <button class="btn btn-primary px-8" (click)="execute()" [disabled]="isProcessing()">\r
        @if(isProcessing()) {\r
            <span class="loading loading-spinner"></span> Procesando...\r
        } @else {\r
            Aplicar Cambios\r
        }\r
      </button>\r
    </div>\r
  </div>\r
  <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">\r
    <button (click)="close()">close</button>\r
  </form>\r
</div>\r
}\r
` }]
  }], null, { isOpen: [{ type: Input, args: [{ isSignal: true, alias: "isOpen", required: false }] }, { type: Output, args: ["isOpenChange"] }], selectedIds: [{ type: Input, args: [{ isSignal: true, alias: "selectedIds", required: false }] }, { type: Output, args: ["selectedIdsChange"] }], brands: [{ type: Input, args: [{ isSignal: true, alias: "brands", required: false }] }, { type: Output, args: ["brandsChange"] }], onSuccess: [{ type: Output, args: ["onSuccess"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BulkEditModalComponent, { className: "BulkEditModalComponent", filePath: "src/app/admin/products/components/bulk-edit-modal/bulk-edit-modal.component.ts", lineNumber: 13 });
})();

// src/app/admin/products/admin-products-page.ts
var _c0 = () => [1, 2, 3, 4, 5, 6, 7, 8];
var _c1 = (a0) => ["/admin/products", a0];
var _forTrack02 = ($index, $item) => $item.id;
function AdminProductsPage_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 31)(2, "div", 32)(3, "span", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " seleccionados ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 19)(7, "button", 34);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_40_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.openBulkEdit());
    });
    \u0275\u0275element(8, "i", 35);
    \u0275\u0275text(9, " Editar Masivo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 36);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_40_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.clearSelection());
    });
    \u0275\u0275element(11, "i", 37);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.selectedIds().size);
  }
}
function AdminProductsPage_Conditional_41_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 38);
  }
}
function AdminProductsPage_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275repeaterCreate(1, AdminProductsPage_Conditional_41_For_2_Template, 1, 0, "div", 38, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function AdminProductsPage_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 39);
    \u0275\u0275element(2, "i", 40);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.error());
  }
}
function AdminProductsPage_Conditional_43_For_21_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "slice");
  }
  if (rf & 2) {
    const product_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" Marca ID: ", \u0275\u0275pipeBind3(1, 1, product_r7.brand_id, 0, 5), "... ");
  }
}
function AdminProductsPage_Conditional_43_For_21_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Generic ");
  }
}
function AdminProductsPage_Conditional_43_For_21_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 69);
    \u0275\u0275text(1, "Agotado");
    \u0275\u0275elementEnd();
  }
}
function AdminProductsPage_Conditional_43_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 56);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_43_For_21_Template_tr_click_0_listener() {
      const product_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleSelection(product_r7.id));
    });
    \u0275\u0275elementStart(1, "td", 57);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_43_For_21_Template_td_click_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "label")(3, "input", 46);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_43_For_21_Template_input_change_3_listener() {
      const product_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleSelection(product_r7.id));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(4, "td")(5, "div", 58)(6, "div", 59)(7, "div", 60);
    \u0275\u0275element(8, "img", 61);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "div", 62);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 63);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "td")(15, "div", 64)(16, "span", 65);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 66);
    \u0275\u0275conditionalCreate(19, AdminProductsPage_Conditional_43_For_21_Conditional_19_Template, 2, 5)(20, AdminProductsPage_Conditional_43_For_21_Conditional_20_Template, 1, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "td", 67);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td")(25, "div", 19)(26, "div", 68);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(28, AdminProductsPage_Conditional_43_For_21_Conditional_28_Template, 2, 0, "span", 69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td")(30, "div", 70);
    \u0275\u0275element(31, "div", 71);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "td", 72);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_43_For_21_Template_td_click_33_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(34, "a", 73);
    \u0275\u0275element(35, "i", 74);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r3.selectedIds().has(product_r7.id));
    \u0275\u0275advance(5);
    \u0275\u0275property("src", product_r7.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", product_r7.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r7.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r7.slug);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(product_r7.sku || "---");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(product_r7.brand_id ? 19 : 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(23, 28, product_r7.price, product_r7.currency || "ARS"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("--value", product_r7.stock ? product_r7.stock > 100 ? 100 : product_r7.stock : 0);
    \u0275\u0275classProp("text-success", !product_r7.stock || product_r7.stock > 10)("text-warning", product_r7.stock && product_r7.stock <= 10 && product_r7.stock > 0)("text-error", product_r7.stock === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r7.stock || 0, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(product_r7.stock === 0 ? 28 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", product_r7.is_active)("badge-ghost", !product_r7.is_active);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-white", product_r7.is_active)("bg-gray-500", !product_r7.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r7.is_active ? "Activo" : "Borrador", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(31, _c1, product_r7.id));
  }
}
function AdminProductsPage_Conditional_43_For_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75)(1, "div", 76)(2, "input", 77);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_43_For_29_Template_input_change_2_listener() {
      const product_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleSelection(product_r9.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 78);
    \u0275\u0275element(4, "img", 79);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 80)(6, "div", 81)(7, "h3", 82);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 83);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 84);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 85)(14, "div")(15, "span", 86);
    \u0275\u0275text(16, "Precio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 87);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 47)(21, "span", 86);
    \u0275\u0275text(22, "Stock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 88);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(25, "div", 89)(26, "a", 90);
    \u0275\u0275text(27, " Editar Detalle ");
    \u0275\u0275element(28, "i", 91);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r9 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ring-2", ctx_r3.selectedIds().has(product_r9.id))("ring-indigo-500", ctx_r3.selectedIds().has(product_r9.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r3.selectedIds().has(product_r9.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("src", product_r9.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(product_r9.name);
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-success", product_r9.is_active)("badge-ghost", !product_r9.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r9.is_active ? "ON" : "OFF", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r9.sku);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 18, product_r9.price, product_r9.currency || "ARS"));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("text-error", product_r9.stock === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(product_r9.stock || 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(21, _c1, product_r9.id));
  }
}
function AdminProductsPage_Conditional_43_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275element(1, "i", 92);
    \u0275\u0275elementStart(2, "p", 93);
    \u0275\u0275text(3, "No se encontraron productos.");
    \u0275\u0275elementEnd()();
  }
}
function AdminProductsPage_Conditional_43_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94);
    \u0275\u0275element(1, "pagination", 95);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r3.totalPages())("currentPage", ctx_r3.currentPage());
  }
}
function AdminProductsPage_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "table", 42)(2, "thead", 43)(3, "tr", 44)(4, "th", 45)(5, "label")(6, "input", 46);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_43_Template_input_change_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleSelectAll());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Producto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "SKU / Marca");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Precio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Stock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 47);
    \u0275\u0275text(18, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, AdminProductsPage_Conditional_43_For_21_Template, 36, 33, "tr", 48, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 49)(23, "div", 50)(24, "label", 51)(25, "input", 46);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_43_Template_input_change_25_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleSelectAll());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 52);
    \u0275\u0275text(27, "Seleccionar Todo en p\xE1gina");
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(28, AdminProductsPage_Conditional_43_For_29_Template, 29, 23, "div", 53, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(30, AdminProductsPage_Conditional_43_Conditional_30_Template, 4, 0, "div", 54);
    \u0275\u0275template(31, AdminProductsPage_Conditional_43_div_31_Template, 2, 2, "div", 55);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("checked", ctx_r3.isAllSelected());
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r3.paginatedProducts());
    \u0275\u0275advance(5);
    \u0275\u0275property("checked", ctx_r3.isAllSelected());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.paginatedProducts());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.paginatedProducts().length === 0 ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.paginatedProducts().length > 0);
  }
}
var AdminProductsPage = class _AdminProductsPage {
  productService = inject(AdminProductService);
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  // Signals
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  brands = signal([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  // For bulk edit
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  sortOrder = signal("name_asc", ...ngDevMode ? [{ debugName: "sortOrder" }] : []);
  // Selection Helper
  selectedIds = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "selectedIds" }] : []);
  // Bulk Edit Modal State
  isBulkModalOpen = signal(false, ...ngDevMode ? [{ debugName: "isBulkModalOpen" }] : []);
  // Pagination Signals
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  itemsPerPage = signal(10, ...ngDevMode ? [{ debugName: "itemsPerPage" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Computed: Filtered & Sorted (Full List)
  allFilteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let result = this.products();
    if (query) {
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.slug?.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query));
    }
    const sort = this.sortOrder();
    return result.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "stock_asc":
          return a.stock - b.stock;
        case "stock_desc":
          return b.stock - a.stock;
        case "name_asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, ...ngDevMode ? [{ debugName: "allFilteredProducts" }] : []);
  // Computed: Paginated Slice
  paginatedProducts = computed(() => {
    const all = this.allFilteredProducts();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  }, ...ngDevMode ? [{ debugName: "paginatedProducts" }] : []);
  // Computed: Total Pages
  totalPages = computed(() => {
    return Math.ceil(this.allFilteredProducts().length / this.itemsPerPage());
  }, ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  isAllSelected = computed(() => {
    const pageItems = this.paginatedProducts();
    if (pageItems.length === 0)
      return false;
    const selected = this.selectedIds();
    return pageItems.every((p) => selected.has(p.id));
  }, ...ngDevMode ? [{ debugName: "isAllSelected" }] : []);
  selectedIdsList = computed(() => Array.from(this.selectedIds()), ...ngDevMode ? [{ debugName: "selectedIdsList" }] : []);
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const page = params["_page"] ? Number(params["_page"]) : 1;
      this.currentPage.set(page || 1);
    });
    try {
      const [products, brands] = await Promise.all([
        this.productService.getProducts(),
        this.productService.getBrands()
      ]);
      this.products.set(products);
      this.brands.set(brands);
    } catch (e) {
      this.error.set(e.message || "Error al cargar productos");
    } finally {
      this.loading.set(false);
    }
  }
  // Selection Logic
  toggleSelection(id) {
    this.selectedIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(id))
        newSet.delete(id);
      else
        newSet.add(id);
      return newSet;
    });
  }
  toggleSelectAll() {
    const pageItems = this.paginatedProducts();
    const allSelected = this.isAllSelected();
    this.selectedIds.update((set) => {
      const newSet = new Set(set);
      if (allSelected) {
        pageItems.forEach((p) => newSet.delete(p.id));
      } else {
        pageItems.forEach((p) => newSet.add(p.id));
      }
      return newSet;
    });
  }
  openBulkEdit() {
    if (this.selectedIds().size === 0)
      return;
    this.isBulkModalOpen.set(true);
  }
  onBulkEditSuccess() {
    this.selectedIds.set(/* @__PURE__ */ new Set());
    this.ngOnInit();
  }
  clearSelection() {
    this.selectedIds.set(/* @__PURE__ */ new Set());
  }
  async exportProducts() {
    try {
      this.loading.set(true);
      await this.productService.exportProductsToCSV();
    } catch (e) {
      this.error.set(e.message || "Error al exportar productos");
    } finally {
      this.loading.set(false);
    }
  }
  async importProducts(event) {
    const input = event.target;
    if (!input.files?.length)
      return;
    const file = input.files[0];
    try {
      this.loading.set(true);
      const result = await this.productService.importProductsFromCSV(file);
      alert(`Importaci\xF3n completada: ${result.success} productos importados/actualizados. ${result.errors} errores.`);
      const data = await this.productService.getProducts();
      this.products.set(data);
    } catch (e) {
      this.error.set(e.message || "Error al importar productos");
    } finally {
      this.loading.set(false);
      input.value = "";
    }
  }
  // Helpers for Template
  updateSort(event) {
    const value = event.target.value;
    this.sortOrder.set(value);
  }
  static \u0275fac = function AdminProductsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminProductsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminProductsPage, selectors: [["app-admin-products-page"]], decls: 45, vars: 7, consts: [["fileInput", ""], [1, "max-w-7xl", "mx-auto", "pb-20", "relative", "min-h-screen"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "md:items-center", "py-6", "gap-4", "sticky", "top-0", "z-30", "bg-gray-50/95", "dark:bg-[#0f172a]/95", "backdrop-blur-sm", "border-b", "border-gray-200", "dark:border-gray-800", "px-4"], [1, "text-3xl", "font-bold", "bg-clip-text", "text-transparent", "bg-linear-to-r", "from-green-500", "to-teal-400"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "hidden", "md:block"], [1, "flex", "gap-2", "w-full", "md:w-auto", "overflow-x-auto", "pb-2", "md:pb-0", "no-scrollbar"], [1, "btn", "btn-outline", "btn-sm", "md:btn-md", 3, "click"], [1, "fas", "fa-file-export", "mr-2"], [1, "fas", "fa-file-import", "mr-2"], ["type", "file", "accept", ".csv", 1, "hidden", 3, "change"], ["routerLink", "/admin/products/new", 1, "btn", "btn-primary", "btn-sm", "md:btn-md", "shadow-lg", "shadow-green-500/20", "whitespace-nowrap"], [1, "fas", "fa-plus", "mr-2"], [1, "p-4", "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "mb-4"], [1, "form-control", "w-full", "lg:col-span-2"], [1, "relative", "group"], [1, "absolute", "-inset-0.5", "bg-linear-to-r", "from-green-400", "to-blue-500", "rounded-lg", "blur", "opacity-25", "group-hover:opacity-50", "transition", "duration-1000"], [1, "relative", "flex", "items-center", "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-sm"], [1, "fas", "fa-search", "px-4", "text-gray-400"], ["type", "text", "placeholder", "Buscar por nombre, SKU, marca...", 1, "input", "input-ghost", "w-full", "focus:bg-transparent", "text-lg", "h-12", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-2"], [1, "text-sm", "font-bold", "text-gray-500", "hidden", "md:block"], [1, "select", "select-bordered", "w-full", "bg-white", "dark:bg-gray-800", 3, "change", "ngModel"], ["value", "name_asc"], ["value", "price_asc"], ["value", "price_desc"], ["value", "stock_asc"], ["value", "stock_desc"], [1, "fixed", "bottom-4", "left-4", "right-4", "md:left-1/2", "md:-translate-x-1/2", "md:w-auto", "z-40", "animate-fade-in-up"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6", "p-4"], [1, "p-4"], [3, "isOpenChange", "onSuccess", "isOpen", "selectedIds", "brands"], [1, "bg-gray-900", "text-white", "dark:bg-white", "dark:text-gray-900", "rounded-full", "shadow-2xl", "px-6", "py-3", "flex", "items-center", "justify-between", "gap-6", "border", "border-gray-700", "dark:border-gray-200"], [1, "font-bold", "whitespace-nowrap"], [1, "badge", "badge-primary", "mr-2"], [1, "btn", "btn-sm", "btn-ghost", "hover:bg-white/20", "dark:hover:bg-black/10", "text-white", "dark:text-gray-900", 3, "click"], [1, "fas", "fa-edit", "mr-2"], [1, "btn", "btn-circle", "btn-xs", "btn-ghost", "text-white", "dark:text-gray-900", "opacity-70", "hover:opacity-100", 3, "click"], [1, "fas", "fa-times"], [1, "skeleton", "h-64", "rounded-xl"], [1, "alert", "alert-error"], [1, "fas", "fa-exclamation-triangle"], [1, "hidden", "lg:block", "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-lg", "border", "border-gray-100", "dark:border-gray-700", "overflow-hidden", "mx-4"], [1, "table", "w-full"], [1, "bg-gray-50", "dark:bg-gray-700/50"], [1, "text-gray-600", "dark:text-gray-300", "font-bold", "uppercase", "text-xs", "tracking-wider"], [1, "w-12"], ["type", "checkbox", 1, "checkbox", "checkbox-sm", "checkbox-primary", 3, "change", "checked"], [1, "text-right"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors", "group", "cursor-pointer"], [1, "lg:hidden", "grid", "grid-cols-1", "gap-4", "px-4"], [1, "flex", "items-center", "justify-between", "bg-white", "dark:bg-gray-800", "p-3", "rounded-lg", "shadow-sm"], [1, "label", "cursor-pointer", "gap-3"], [1, "label-text", "font-bold"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", 3, "ring-2", "ring-indigo-500"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "text-center", "opacity-50"], ["class", "mt-8 flex justify-center pb-8", 4, "ngIf"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors", "group", "cursor-pointer", 3, "click"], [3, "click"], [1, "flex", "items-center", "gap-4"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12", "bg-gray-100", "dark:bg-gray-700"], [1, "object-cover", 3, "src", "alt"], [1, "font-bold", "text-gray-900", "dark:text-white", "line-clamp-1"], [1, "text-xs", "text-gray-400", "font-mono"], [1, "flex", "flex-col"], [1, "font-mono", "text-xs", "font-bold"], [1, "text-xs", "text-gray-500"], [1, "font-mono", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "radial-progress", "text-xs", 2, "--size", "2rem"], [1, "badge", "badge-error", "badge-xs"], [1, "badge", "badge-sm", "gap-2"], [1, "w-2", "h-2", "rounded-full"], [1, "text-right", 3, "click"], ["data-tip", "Editar", 1, "btn", "btn-ghost", "btn-sm", "btn-circle", "tooltip", "tooltip-left", 3, "routerLink"], [1, "fas", "fa-pen", "text-gray-500", "hover:text-indigo-500"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "card-body", "p-4", "flex-row", "items-start", "gap-4"], ["type", "checkbox", 1, "checkbox", "checkbox-primary", "mt-1", 3, "change", "checked"], [1, "avatar", "rounded-xl", "w-20", "h-20", "bg-gray-100", "shrink-0"], [1, "object-cover", "rounded-xl", 3, "src"], [1, "flex-1", "min-w-0"], [1, "flex", "justify-between", "items-start"], [1, "font-bold", "text-gray-900", "dark:text-white", "truncate", "pr-2"], [1, "badge", "badge-xs"], [1, "text-xs", "text-gray-500", "font-mono", "mb-2"], [1, "flex", "justify-between", "items-end", "mt-2"], [1, "block", "text-xs", "text-gray-400"], [1, "text-lg", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "font-mono", "font-bold"], [1, "card-actions", "border-t", "border-gray-100", "dark:border-gray-700", "p-2", "flex", "justify-end", "bg-gray-50", "dark:bg-gray-800/50", "rounded-b-2xl"], [1, "btn", "btn-sm", "btn-ghost", "w-full", 3, "routerLink"], [1, "fas", "fa-arrow-right", "ml-2", "opacity-50"], [1, "fas", "fa-box-open", "text-6xl", "mb-4", "text-gray-300"], [1, "text-xl"], [1, "mt-8", "flex", "justify-center", "pb-8"], [3, "pages", "currentPage"]], template: function AdminProductsPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div")(3, "h1", 3);
      \u0275\u0275text(4, " Inventario ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Gestiona tu cat\xE1logo completo desde aqu\xED.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5)(8, "button", 6);
      \u0275\u0275listener("click", function AdminProductsPage_Template_button_click_8_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.exportProducts());
      });
      \u0275\u0275element(9, "i", 7);
      \u0275\u0275text(10, " CSV ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 6);
      \u0275\u0275listener("click", function AdminProductsPage_Template_button_click_11_listener() {
        \u0275\u0275restoreView(_r1);
        const fileInput_r2 = \u0275\u0275reference(15);
        return \u0275\u0275resetView(fileInput_r2.click());
      });
      \u0275\u0275element(12, "i", 8);
      \u0275\u0275text(13, " Importar ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "input", 9, 0);
      \u0275\u0275listener("change", function AdminProductsPage_Template_input_change_14_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.importProducts($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "a", 10);
      \u0275\u0275element(17, "i", 11);
      \u0275\u0275text(18, " Nuevo ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 12)(20, "div", 13)(21, "div", 14);
      \u0275\u0275element(22, "div", 15);
      \u0275\u0275elementStart(23, "div", 16);
      \u0275\u0275element(24, "i", 17);
      \u0275\u0275elementStart(25, "input", 18);
      \u0275\u0275listener("ngModelChange", function AdminProductsPage_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.searchQuery.set($event));
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(26, "div", 19)(27, "span", 20);
      \u0275\u0275text(28, "Ordenar:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "select", 21);
      \u0275\u0275listener("change", function AdminProductsPage_Template_select_change_29_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.updateSort($event));
      });
      \u0275\u0275elementStart(30, "option", 22);
      \u0275\u0275text(31, "A-Z Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "option", 23);
      \u0275\u0275text(33, "Precio: Bajo a Alto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "option", 24);
      \u0275\u0275text(35, "Precio: Alto a Bajo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "option", 25);
      \u0275\u0275text(37, "Stock: Bajo a Alto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "option", 26);
      \u0275\u0275text(39, "Stock: Alto a Bajo");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(40, AdminProductsPage_Conditional_40_Template, 12, 1, "div", 27);
      \u0275\u0275conditionalCreate(41, AdminProductsPage_Conditional_41_Template, 3, 1, "div", 28)(42, AdminProductsPage_Conditional_42_Template, 5, 1, "div", 29)(43, AdminProductsPage_Conditional_43_Template, 32, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "app-bulk-edit-modal", 30);
      \u0275\u0275twoWayListener("isOpenChange", function AdminProductsPage_Template_app_bulk_edit_modal_isOpenChange_44_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.isBulkModalOpen, $event) || (ctx.isBulkModalOpen = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onSuccess", function AdminProductsPage_Template_app_bulk_edit_modal_onSuccess_44_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onBulkEditSuccess());
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(25);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.sortOrder());
      \u0275\u0275advance(11);
      \u0275\u0275conditional(ctx.selectedIds().size > 0 ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 41 : ctx.error() ? 42 : 43);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("isOpen", ctx.isBulkModalOpen);
      \u0275\u0275property("selectedIds", ctx.selectedIdsList())("brands", ctx.brands());
    }
  }, dependencies: [CommonModule, NgIf, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Pagination, BulkEditModalComponent, SlicePipe, CurrencyPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminProductsPage, [{
    type: Component,
    args: [{ selector: "app-admin-products-page", standalone: true, imports: [CommonModule, RouterLink, FormsModule, Pagination, BulkEditModalComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="max-w-7xl mx-auto pb-20 relative min-h-screen">\r
  \r
  <!-- Header & Actions -->\r
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4 sticky top-0 z-30 bg-gray-50/95 dark:bg-[#0f172a]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4">\r
    <div>\r
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-500 to-teal-400">\r
        Inventario\r
      </h1>\r
      <p class="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Gestiona tu cat\xE1logo completo desde aqu\xED.</p>\r
    </div>\r
\r
    <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">\r
      <button (click)="exportProducts()" class="btn btn-outline btn-sm md:btn-md">\r
        <i class="fas fa-file-export mr-2"></i> CSV\r
      </button>\r
      <button (click)="fileInput.click()" class="btn btn-outline btn-sm md:btn-md">\r
        <i class="fas fa-file-import mr-2"></i> Importar\r
      </button>\r
      <input #fileInput type="file" accept=".csv" class="hidden" (change)="importProducts($event)" />\r
      \r
      <a routerLink="/admin/products/new" class="btn btn-primary btn-sm md:btn-md shadow-lg shadow-green-500/20 whitespace-nowrap">\r
        <i class="fas fa-plus mr-2"></i> Nuevo\r
      </a>\r
    </div>\r
  </div>\r
\r
  <!-- Filters & Search -->\r
  <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">\r
      <div class="form-control w-full lg:col-span-2">\r
        <div class="relative group">\r
           <div class="absolute -inset-0.5 bg-linear-to-r from-green-400 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>\r
           <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">\r
              <i class="fas fa-search px-4 text-gray-400"></i>\r
              <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"\r
                 placeholder="Buscar por nombre, SKU, marca..." \r
                 class="input input-ghost w-full focus:bg-transparent text-lg h-12" />\r
           </div>\r
        </div>\r
      </div>\r
      \r
      <div class="flex items-center gap-2">\r
         <span class="text-sm font-bold text-gray-500 hidden md:block">Ordenar:</span>\r
         <select [ngModel]="sortOrder()" (change)="updateSort($event)" class="select select-bordered w-full bg-white dark:bg-gray-800">\r
             <option value="name_asc">A-Z Nombre</option>\r
             <option value="price_asc">Precio: Bajo a Alto</option>\r
             <option value="price_desc">Precio: Alto a Bajo</option>\r
             <option value="stock_asc">Stock: Bajo a Alto</option>\r
             <option value="stock_desc">Stock: Alto a Bajo</option>\r
         </select>\r
      </div>\r
  </div>\r
\r
  <!-- Selection Bar (Floating) -->\r
  @if (selectedIds().size > 0) {\r
    <div class="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-40 animate-fade-in-up">\r
      <div class="bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between gap-6 border border-gray-700 dark:border-gray-200">\r
        <div class="font-bold whitespace-nowrap">\r
          <span class="badge badge-primary mr-2">{{ selectedIds().size }}</span> seleccionados\r
        </div>\r
        <div class="flex items-center gap-2">\r
           <button (click)="openBulkEdit()" class="btn btn-sm btn-ghost hover:bg-white/20 dark:hover:bg-black/10 text-white dark:text-gray-900">\r
             <i class="fas fa-edit mr-2"></i> Editar Masivo\r
           </button>\r
           <button (click)="clearSelection()" class="btn btn-circle btn-xs btn-ghost text-white dark:text-gray-900 opacity-70 hover:opacity-100">\r
             <i class="fas fa-times"></i>\r
           </button>\r
        </div>\r
      </div>\r
    </div>\r
  }\r
\r
  <!-- PRODUCTS LIST -->\r
  @if (loading()) {\r
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">\r
      @for(i of [1,2,3,4,5,6,7,8]; track i) {\r
         <div class="skeleton h-64 rounded-xl"></div>\r
      }\r
    </div>\r
  } @else if (error()) {\r
    <div class="p-4">\r
      <div class="alert alert-error">\r
        <i class="fas fa-exclamation-triangle"></i>\r
        <span>{{ error() }}</span>\r
      </div>\r
    </div>\r
  } @else {\r
    \r
    <!-- DESKTOP TABLE -->\r
    <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mx-4">\r
      <table class="table w-full">\r
        <thead class="bg-gray-50 dark:bg-gray-700/50">\r
          <tr class="text-gray-600 dark:text-gray-300 font-bold uppercase text-xs tracking-wider">\r
            <th class="w-12">\r
               <label>\r
                 <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" \r
                   [checked]="isAllSelected()" \r
                   (change)="toggleSelectAll()" />\r
               </label>\r
            </th>\r
            <th>Producto</th>\r
            <th>SKU / Marca</th>\r
            <th>Precio</th>\r
            <th>Stock</th>\r
            <th>Estado</th>\r
            <th class="text-right">Acciones</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          @for (product of paginatedProducts(); track product.id) {\r
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer" (click)="toggleSelection(product.id)">\r
            <td (click)="$event.stopPropagation()">\r
               <label>\r
                 <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" \r
                   [checked]="selectedIds().has(product.id)" \r
                   (change)="toggleSelection(product.id)" />\r
               </label>\r
            </td>\r
            <td>\r
              <div class="flex items-center gap-4">\r
                <div class="avatar">\r
                  <div class="mask mask-squircle w-12 h-12 bg-gray-100 dark:bg-gray-700">\r
                    <img [src]="product.image_url || 'assets/img/no-image.png'" [alt]="product.name" class="object-cover" />\r
                  </div>\r
                </div>\r
                <div>\r
                  <div class="font-bold text-gray-900 dark:text-white line-clamp-1">{{ product.name }}</div>\r
                  <div class="text-xs text-gray-400 font-mono">{{ product.slug }}</div>\r
                </div>\r
              </div>\r
            </td>\r
            <td>\r
               <div class="flex flex-col">\r
                 <span class="font-mono text-xs font-bold">{{ product.sku || '---' }}</span>\r
                 <span class="text-xs text-gray-500">\r
                    @if(product.brand_id) { \r
                      <!-- Ideally fetch brand name map, keeping simple for now -->\r
                      Marca ID: {{ product.brand_id | slice:0:5 }}...\r
                    } @else { Generic }\r
                 </span>\r
               </div>\r
            </td>\r
            <td class="font-mono font-bold text-indigo-600 dark:text-indigo-400">\r
               {{ product.price | currency: product.currency || 'ARS' }}\r
            </td>\r
            <td>\r
              <div class="flex items-center gap-2">\r
                 <div class="radial-progress text-xs" \r
                    [class.text-success]="!product.stock || product.stock > 10"\r
                    [class.text-warning]="product.stock && product.stock <= 10 && product.stock > 0"\r
                    [class.text-error]="product.stock === 0"\r
                    [style.--value]="product.stock ? (product.stock > 100 ? 100 : product.stock) : 0" \r
                    style="--size:2rem;">\r
                    {{ product.stock || 0 }}\r
                 </div>\r
                 @if(product.stock === 0) { <span class="badge badge-error badge-xs">Agotado</span> }\r
              </div>\r
            </td>\r
            <td>\r
              <div class="badge badge-sm gap-2" [class.badge-success]="product.is_active" [class.badge-ghost]="!product.is_active">\r
                 <div class="w-2 h-2 rounded-full" [class.bg-white]="product.is_active" [class.bg-gray-500]="!product.is_active"></div>\r
                 {{ product.is_active ? 'Activo' : 'Borrador' }}\r
              </div>\r
            </td>\r
            <td class="text-right" (click)="$event.stopPropagation()">\r
               <a [routerLink]="['/admin/products', product.id]" class="btn btn-ghost btn-sm btn-circle tooltip tooltip-left" data-tip="Editar">\r
                 <i class="fas fa-pen text-gray-500 hover:text-indigo-500"></i>\r
               </a>\r
            </td>\r
          </tr>\r
          }\r
        </tbody>\r
      </table>\r
    </div>\r
\r
    <!-- MOBILE CARDS -->\r
    <div class="lg:hidden grid grid-cols-1 gap-4 px-4">\r
       <!-- Select All Mobile Control -->\r
       <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">\r
           <label class="label cursor-pointer gap-3">\r
             <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" \r
               [checked]="isAllSelected()" \r
               (change)="toggleSelectAll()" />\r
             <span class="label-text font-bold">Seleccionar Todo en p\xE1gina</span>\r
           </label>\r
       </div>\r
\r
       @for (product of paginatedProducts(); track product.id) {\r
        <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700" \r
             [class.ring-2]="selectedIds().has(product.id)" \r
             [class.ring-indigo-500]="selectedIds().has(product.id)">\r
           <div class="card-body p-4 flex-row items-start gap-4">\r
              <!-- Checkbox -->\r
              <input type="checkbox" class="checkbox checkbox-primary mt-1" \r
                  [checked]="selectedIds().has(product.id)" \r
                  (change)="toggleSelection(product.id)" />\r
              \r
              <!-- Image -->\r
              <div class="avatar rounded-xl w-20 h-20 bg-gray-100 shrink-0">\r
                  <img [src]="product.image_url || 'assets/img/no-image.png'" class="object-cover rounded-xl" />\r
              </div>\r
\r
              <!-- Content -->\r
              <div class="flex-1 min-w-0">\r
                 <div class="flex justify-between items-start">\r
                    <h3 class="font-bold text-gray-900 dark:text-white truncate pr-2">{{ product.name }}</h3>\r
                    <div class="badge badge-xs" [class.badge-success]="product.is_active" [class.badge-ghost]="!product.is_active">\r
                        {{ product.is_active ? 'ON' : 'OFF' }}\r
                    </div>\r
                 </div>\r
                 \r
                 <p class="text-xs text-gray-500 font-mono mb-2">{{ product.sku }}</p>\r
                 \r
                 <div class="flex justify-between items-end mt-2">\r
                    <div>\r
                       <span class="block text-xs text-gray-400">Precio</span>\r
                       <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ product.price | currency: product.currency || 'ARS' }}</span>\r
                    </div>\r
                    <div class="text-right">\r
                       <span class="block text-xs text-gray-400">Stock</span>\r
                       <span class="font-mono font-bold" [class.text-error]="product.stock === 0">{{ product.stock || 0 }}</span>\r
                    </div>\r
                 </div>\r
              </div>\r
           </div>\r
           <!-- Card Actions -->\r
           <div class="card-actions border-t border-gray-100 dark:border-gray-700 p-2 flex justify-end bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">\r
              <a [routerLink]="['/admin/products', product.id]" class="btn btn-sm btn-ghost w-full">\r
                 Editar Detalle <i class="fas fa-arrow-right ml-2 opacity-50"></i>\r
              </a>\r
           </div>\r
        </div>\r
       }\r
    </div>\r
\r
    <!-- Empty State -->\r
    @if (paginatedProducts().length === 0) {\r
       <div class="flex flex-col items-center justify-center py-20 text-center opacity-50">\r
          <i class="fas fa-box-open text-6xl mb-4 text-gray-300"></i>\r
          <p class="text-xl">No se encontraron productos.</p>\r
       </div>\r
    }\r
\r
    <!-- Pagination -->\r
    <div class="mt-8 flex justify-center pb-8" *ngIf="paginatedProducts().length > 0">\r
       <pagination [pages]="totalPages()" [currentPage]="currentPage()" />\r
    </div>\r
\r
  }\r
</div>\r
\r
<!-- MODAL INTEGRATION -->\r
<app-bulk-edit-modal \r
   [(isOpen)]="isBulkModalOpen" \r
   [selectedIds]="selectedIdsList()"\r
   [brands]="brands()"\r
   (onSuccess)="onBulkEditSuccess()">\r
</app-bulk-edit-modal>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminProductsPage, { className: "AdminProductsPage", filePath: "src/app/admin/products/admin-products-page.ts", lineNumber: 18 });
})();
export {
  AdminProductsPage
};
//# sourceMappingURL=chunk-3CSEFX4D.js.map
