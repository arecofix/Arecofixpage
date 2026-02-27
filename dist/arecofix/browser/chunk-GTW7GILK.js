import {
  AdminProductService
} from "./chunk-EJD3GE5R.js";
import "./chunk-MYSAJLFD.js";
import "./chunk-ZJZBKGOC.js";
import {
  Pagination
} from "./chunk-W43WNFKI.js";
import {
  takeUntilDestroyed
} from "./chunk-OXRRQGKG.js";
import "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import "./chunk-NOSGPON2.js";
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
  RouterLink
} from "./chunk-CP6GQXNM.js";
import {
  CommonModule,
  CurrencyPipe,
  SlicePipe
} from "./chunk-F32QBW3I.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Subject,
  computed,
  debounceTime,
  distinctUntilChanged,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
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
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DPJFS6PI.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/products/components/bulk-edit-modal/bulk-edit-modal.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "i", 41);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26)(1, "input", 42);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_14_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.priceValue.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 43);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.priceValue())("placeholder", ctx_r1.priceMode() === "fixed" ? "Monto en $" : "Ej: 10 (aumento) o -5 (descuento)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.priceMode() === "fixed" ? "$" : "%", " ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 44);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_29_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.stockValue.set($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngModel", ctx_r1.stockValue());
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r6 = ctx.$implicit;
    \u0275\u0275property("value", cat_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r6.name);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r7 = ctx.$implicit;
    \u0275\u0275property("value", b_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r7.name);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275conditionalCreate(1, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_1_Template, 4, 1, "div", 17);
    \u0275\u0275elementStart(2, "div", 18)(3, "div", 19)(4, "p", 20);
    \u0275\u0275text(5, "Precio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21)(7, "select", 22);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_select_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.priceMode.set($event));
    });
    \u0275\u0275elementStart(8, "option", 23);
    \u0275\u0275text(9, "\u2014 Sin cambios \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 24);
    \u0275\u0275text(11, "Fijar precio exacto...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 25);
    \u0275\u0275text(13, "Ajuste porcentual (+/- %)");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_14_Template, 4, 3, "div", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 18)(16, "div", 19)(17, "p", 20);
    \u0275\u0275text(18, "Stock");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 21)(20, "select", 22);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_select_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.stockMode.set($event));
    });
    \u0275\u0275elementStart(21, "option", 23);
    \u0275\u0275text(22, "\u2014 Sin cambios \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "option", 24);
    \u0275\u0275text(24, "Fijar en...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "option", 27);
    \u0275\u0275text(26, "Aumentar en...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "option", 28);
    \u0275\u0275text(28, "Disminuir en...");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(29, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Conditional_29_Template, 1, 1, "input", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 30)(31, "p", 20);
    \u0275\u0275text(32, "Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 31)(34, "select", 22);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_select_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.targetCategoryId.set($event));
    });
    \u0275\u0275elementStart(35, "option", 32);
    \u0275\u0275text(36, "\u2014 Sin cambios \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(37, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_For_38_Template, 2, 2, "option", 33, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "div", 30)(40, "p", 20);
    \u0275\u0275text(41, "Marca");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 31)(43, "select", 22);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_select_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.targetBrandId.set($event));
    });
    \u0275\u0275elementStart(44, "option", 32);
    \u0275\u0275text(45, "\u2014 Sin cambios \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(46, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_For_47_Template, 2, 2, "option", 33, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "div", 34)(49, "p", 20);
    \u0275\u0275text(50, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 31)(52, "select", 22);
    \u0275\u0275listener("ngModelChange", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_select_ngModelChange_52_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.targetStatus.set($event));
    });
    \u0275\u0275elementStart(53, "option", 23);
    \u0275\u0275text(54, "\u2014 Sin cambios \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "option", 35);
    \u0275\u0275text(56, "\u2705 Publicado (Activo)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "option", 36);
    \u0275\u0275text(58, "\u2B1C Borrador (Inactivo)");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(59, "div", 37)(60, "button", 38);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_button_click_60_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(61, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "button", 39);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template_button_click_62_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.prepareExecute());
    });
    \u0275\u0275element(63, "i", 40);
    \u0275\u0275text(64, " Vista previa ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 1 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.priceMode());
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.priceMode() !== "none" ? 14 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.stockMode());
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r1.stockMode() !== "none" ? 29 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r1.targetCategoryId());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.categories());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.targetBrandId());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.brands());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.targetStatus());
    \u0275\u0275advance(10);
    \u0275\u0275property("disabled", !ctx_r1.hasEditChanges());
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275element(1, "i", 41);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45)(1, "div", 46);
    \u0275\u0275element(2, "i", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4", 48);
    \u0275\u0275text(4, "Eliminar productos seleccionados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 49);
    \u0275\u0275text(6, " Se eliminar\xE1n ");
    \u0275\u0275elementStart(7, "span", 50);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " de forma permanente del inventario. Los productos eliminados no aparecer\xE1n en el cat\xE1logo ni en b\xFAsquedas. ");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Conditional_10_Template, 4, 1, "div", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 52)(12, "button", 38);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(13, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 53);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.prepareExecute());
    });
    \u0275\u0275element(15, "i", 54);
    \u0275\u0275text(16, " Confirmar eliminaci\xF3n ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate2("", ctx_r1.selectedIds().length, " producto", ctx_r1.selectedIds().length !== 1 ? "s" : "");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error() ? 10 : -1);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_0_Template, 65, 9);
    \u0275\u0275conditionalCreate(1, BulkEditModalComponent_Conditional_0_Conditional_20_Conditional_1_Template, 17, 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.activeTab() === "edit" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.activeTab() === "delete" ? 1 : -1);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 62);
    \u0275\u0275text(1, " Eliminando... ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 54);
    \u0275\u0275text(1, " S\xED, eliminar ahora ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275element(1, "i", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div")(3, "h4", 56);
    \u0275\u0275text(4, "\xBFConfirmar eliminaci\xF3n?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 57);
    \u0275\u0275text(6, " Se eliminar\xE1n ");
    \u0275\u0275elementStart(7, "span", 50);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, ". ");
    \u0275\u0275element(10, "br");
    \u0275\u0275elementStart(11, "span", 58);
    \u0275\u0275text(12, "Esta acci\xF3n no se puede deshacer.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 59)(14, "button", 60);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.showConfirmation.set(false));
    });
    \u0275\u0275text(15, " Regresar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 61);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.execute());
    });
    \u0275\u0275conditionalCreate(17, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Conditional_17_Template, 2, 0)(18, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Conditional_18_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx_r1.selectedIds().length, " productos");
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isProcessing() ? 17 : 18);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 68);
    \u0275\u0275element(1, "i", 71);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const line_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(line_r11);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 62);
    \u0275\u0275text(1, " Actualizando... ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 72);
    \u0275\u0275text(1, " \xA1S\xED, actualizar ahora! ");
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275element(1, "i", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div")(3, "h4", 56);
    \u0275\u0275text(4, "\xBFAplicar cambios?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 65);
    \u0275\u0275text(6, " A ");
    \u0275\u0275elementStart(7, "span", 66);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, ": ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ul", 67);
    \u0275\u0275repeaterCreate(11, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_For_12_Template, 4, 1, "li", 68, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 69)(14, "button", 60);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.showConfirmation.set(false));
    });
    \u0275\u0275text(15, " Regresar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 70);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.execute());
    });
    \u0275\u0275conditionalCreate(17, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Conditional_17_Template, 2, 0)(18, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Conditional_18_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx_r1.selectedIds().length, " productos");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.confirmSummary());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isProcessing() ? 17 : 18);
  }
}
function BulkEditModalComponent_Conditional_0_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275conditionalCreate(1, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_1_Template, 19, 4)(2, BulkEditModalComponent_Conditional_0_Conditional_21_Conditional_2_Template, 19, 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.activeTab() === "delete" ? 1 : 2);
  }
}
function BulkEditModalComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div")(5, "h3", 4);
    \u0275\u0275text(6, "Operaci\xF3n Masiva");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 5)(8, "span", 6);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " productos seleccionados ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 7);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(12, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 8)(14, "button", 9);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setTab("edit"));
    });
    \u0275\u0275element(15, "i", 10);
    \u0275\u0275text(16, " Editar campos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 11);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setTab("delete"));
    });
    \u0275\u0275element(18, "i", 12);
    \u0275\u0275text(19, " Eliminar ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(20, BulkEditModalComponent_Conditional_0_Conditional_20_Template, 2, 2)(21, BulkEditModalComponent_Conditional_0_Conditional_21_Template, 3, 1, "div", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "form", 14)(23, "button", 15);
    \u0275\u0275listener("click", function BulkEditModalComponent_Conditional_0_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275text(24, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.selectedIds().length);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.isProcessing());
    \u0275\u0275advance(3);
    \u0275\u0275classProp("tab-active", ctx_r1.activeTab() === "edit");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("tab-active", ctx_r1.activeTab() === "delete")("text-error", ctx_r1.activeTab() === "delete");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r1.showConfirmation() ? 20 : 21);
  }
}
var BulkEditModalComponent = class _BulkEditModalComponent {
  productService = inject(AdminProductService);
  isOpen = model(false, ...ngDevMode ? [{ debugName: "isOpen" }] : []);
  selectedIds = model([], ...ngDevMode ? [{ debugName: "selectedIds" }] : []);
  brands = model([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  categories = model([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  initialTab = input("edit", ...ngDevMode ? [{ debugName: "initialTab" }] : []);
  onSuccess = output();
  ngOnChanges(changes) {
    if (changes["isOpen"] && this.isOpen()) {
      this.activeTab.set(this.initialTab());
      this.showConfirmation.set(false);
      this.error.set(null);
    }
  }
  isProcessing = signal(false, ...ngDevMode ? [{ debugName: "isProcessing" }] : []);
  showConfirmation = signal(false, ...ngDevMode ? [{ debugName: "showConfirmation" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  activeTab = signal("edit", ...ngDevMode ? [{ debugName: "activeTab" }] : []);
  // ── Edit Form State ─────────────────────────────────────────────────────
  stockMode = signal("none", ...ngDevMode ? [{ debugName: "stockMode" }] : []);
  stockValue = signal(null, ...ngDevMode ? [{ debugName: "stockValue" }] : []);
  priceMode = signal("none", ...ngDevMode ? [{ debugName: "priceMode" }] : []);
  priceValue = signal(null, ...ngDevMode ? [{ debugName: "priceValue" }] : []);
  targetCategoryId = signal("", ...ngDevMode ? [{ debugName: "targetCategoryId" }] : []);
  targetBrandId = signal("", ...ngDevMode ? [{ debugName: "targetBrandId" }] : []);
  targetStatus = signal("none", ...ngDevMode ? [{ debugName: "targetStatus" }] : []);
  hasEditChanges = computed(() => this.stockMode() !== "none" || this.priceMode() !== "none" || this.targetCategoryId() !== "" || this.targetBrandId() !== "" || this.targetStatus() !== "none", ...ngDevMode ? [{ debugName: "hasEditChanges" }] : []);
  // ── Summary for confirmation screen ────────────────────────────────────
  confirmSummary = computed(() => {
    const lines = [];
    if (this.priceMode() === "fixed")
      lines.push(`Precio \u2192 $${this.priceValue()}`);
    if (this.priceMode() === "percentage")
      lines.push(`Precio ${this.priceValue() > 0 ? "+" : ""}${this.priceValue()}%`);
    if (this.stockMode() === "fixed")
      lines.push(`Existencias \u2192 ${this.stockValue()}`);
    if (this.stockMode() === "increase")
      lines.push(`Existencias +${this.stockValue()}`);
    if (this.stockMode() === "decrease")
      lines.push(`Existencias -${this.stockValue()}`);
    if (this.targetCategoryId())
      lines.push(`Categor\xEDa cambiada`);
    if (this.targetBrandId())
      lines.push(`Marca cambiada`);
    if (this.targetStatus() === "active")
      lines.push(`Estado \u2192 Activo`);
    if (this.targetStatus() === "inactive")
      lines.push(`Estado \u2192 Inactivo`);
    return lines;
  }, ...ngDevMode ? [{ debugName: "confirmSummary" }] : []);
  // ── Validation & Execution ───────────────────────────────────────────────
  prepareExecute() {
    this.error.set(null);
    if (this.activeTab() === "delete") {
      this.showConfirmation.set(true);
      return;
    }
    if (this.stockMode() !== "none" && (this.stockValue() === null || this.stockValue() < 0)) {
      this.error.set("El valor de stock debe ser un n\xFAmero positivo.");
      return;
    }
    if (this.priceMode() === "fixed" && (this.priceValue() === null || this.priceValue() < 0)) {
      this.error.set("El precio debe ser un n\xFAmero positivo.");
      return;
    }
    if (!this.hasEditChanges()) {
      this.error.set("No has seleccionado ning\xFAn cambio para aplicar.");
      return;
    }
    this.showConfirmation.set(true);
  }
  async execute() {
    this.isProcessing.set(true);
    this.showConfirmation.set(false);
    try {
      if (this.activeTab() === "delete") {
        await this.productService.bulkDelete(this.selectedIds());
      } else {
        await this._executeEdit();
      }
      this.onSuccess.emit();
      this.close();
    } catch (err) {
      this.error.set(err.message || "Error al procesar la operaci\xF3n masiva");
    } finally {
      this.isProcessing.set(false);
    }
  }
  async _executeEdit() {
    const ids = this.selectedIds();
    const needsFetch = this.priceMode() === "percentage" || this.stockMode() === "increase" || this.stockMode() === "decrease";
    let stockByIdMap = /* @__PURE__ */ new Map();
    let priceByIdMap = /* @__PURE__ */ new Map();
    if (needsFetch) {
      const products = await this.productService.getProducts();
      const relevant = products.filter((p) => ids.includes(p.id));
      relevant.forEach((p) => {
        stockByIdMap.set(p.id, p.stock ?? 0);
        priceByIdMap.set(p.id, p.price ?? 0);
      });
    }
    const updates = ids.map((id) => {
      const payload = {};
      if (this.priceMode() === "fixed") {
        payload["price"] = this.priceValue();
      } else if (this.priceMode() === "percentage") {
        const current = priceByIdMap.get(id) ?? 0;
        payload["price"] = Math.round(current * (1 + (this.priceValue() ?? 0) / 100));
      }
      if (this.stockMode() === "fixed") {
        payload["stock"] = this.stockValue();
      } else if (this.stockMode() === "increase") {
        payload["stock"] = (stockByIdMap.get(id) ?? 0) + (this.stockValue() ?? 0);
      } else if (this.stockMode() === "decrease") {
        payload["stock"] = Math.max(0, (stockByIdMap.get(id) ?? 0) - (this.stockValue() ?? 0));
      }
      if (this.targetCategoryId())
        payload["category_id"] = this.targetCategoryId();
      if (this.targetBrandId())
        payload["brand_id"] = this.targetBrandId();
      if (this.targetStatus() === "active")
        payload["is_active"] = true;
      if (this.targetStatus() === "inactive")
        payload["is_active"] = false;
      return { id, payload };
    });
    await this.productService.bulkCustomUpdate(updates);
  }
  setTab(tab) {
    this.activeTab.set(tab);
    this.error.set(null);
    this.showConfirmation.set(false);
  }
  close() {
    if (this.isProcessing())
      return;
    this.isOpen.set(false);
    this.resetForm();
  }
  resetForm() {
    this.stockMode.set("none");
    this.stockValue.set(null);
    this.priceMode.set("none");
    this.priceValue.set(null);
    this.targetCategoryId.set("");
    this.targetBrandId.set("");
    this.targetStatus.set("none");
    this.showConfirmation.set(false);
    this.error.set(null);
    this.activeTab.set("edit");
  }
  static \u0275fac = function BulkEditModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BulkEditModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BulkEditModalComponent, selectors: [["app-bulk-edit-modal"]], inputs: { isOpen: [1, "isOpen"], selectedIds: [1, "selectedIds"], brands: [1, "brands"], categories: [1, "categories"], initialTab: [1, "initialTab"] }, outputs: { isOpen: "isOpenChange", selectedIds: "selectedIdsChange", brands: "brandsChange", categories: "categoriesChange", onSuccess: "onSuccess" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [[1, "modal", "modal-open", "z-50"], [1, "modal-box", "w-11/12", "max-w-2xl", "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "relative", "p-0", "overflow-hidden", "border", "border-gray-200", "dark:border-gray-700"], [1, "px-6", "pt-5", "pb-0"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "font-bold", "text-xl", "text-gray-800", "dark:text-white"], [1, "text-xs", "text-gray-500", "mt-0.5"], [1, "font-bold", "text-primary"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", 3, "click", "disabled"], [1, "tabs", "tabs-bordered", "w-full"], [1, "tab", "tab-lg", "flex-1", "font-semibold", "gap-2", 3, "click"], [1, "fas", "fa-pen-to-square", "text-sm"], [1, "tab", "tab-lg", "flex-1", "font-semibold", "gap-2", "hover:text-error", 3, "click"], [1, "fas", "fa-trash-alt", "text-sm"], [1, "p-10", "text-center", "space-y-5"], ["method", "dialog", 1, "modal-backdrop", "bg-black/60", "backdrop-blur-sm"], [3, "click"], [1, "p-6", "space-y-5", "max-h-[60vh]", "overflow-y-auto"], [1, "alert", "alert-error", "text-sm", "py-2"], [1, "grid", "grid-cols-3", "gap-3", "items-start", "border-b", "border-gray-100", "dark:border-gray-700", "pb-5"], [1, "pt-2"], [1, "font-bold", "text-xs", "uppercase", "tracking-wider", "text-gray-400"], [1, "col-span-2", "space-y-2"], [1, "select", "select-bordered", "w-full", "select-sm", 3, "ngModelChange", "ngModel"], ["value", "none"], ["value", "fixed"], ["value", "percentage"], [1, "relative"], ["value", "increase"], ["value", "decrease"], ["type", "number", "min", "0", "placeholder", "Cantidad", 1, "input", "input-bordered", "w-full", "input-sm", 3, "ngModel"], [1, "grid", "grid-cols-3", "gap-3", "items-center", "border-b", "border-gray-100", "dark:border-gray-700", "pb-5"], [1, "col-span-2"], ["value", ""], [3, "value"], [1, "grid", "grid-cols-3", "gap-3", "items-center"], ["value", "active"], ["value", "inactive"], [1, "bg-gray-50", "dark:bg-gray-700/50", "p-4", "flex", "justify-end", "gap-3", "border-t", "border-gray-200", "dark:border-gray-700"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "btn", "btn-primary", "btn-sm", "px-8", "shadow-lg", "shadow-primary/20", 3, "click", "disabled"], [1, "fas", "fa-eye", "mr-2"], [1, "fas", "fa-exclamation-circle"], ["type", "number", 1, "input", "input-bordered", "w-full", "input-sm", "pr-8", 3, "ngModelChange", "ngModel", "placeholder"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-gray-400", "text-xs", "font-bold"], ["type", "number", "min", "0", "placeholder", "Cantidad", 1, "input", "input-bordered", "w-full", "input-sm", 3, "ngModelChange", "ngModel"], [1, "p-8", "text-center"], [1, "w-20", "h-20", "bg-error/10", "text-error", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-5"], [1, "fas", "fa-trash-alt", "text-4xl"], [1, "text-xl", "font-bold", "text-gray-800", "dark:text-white", "mb-2"], [1, "text-gray-500", "text-sm", "max-w-sm", "mx-auto", "mb-6"], [1, "font-bold", "text-error"], [1, "alert", "alert-error", "text-sm", "py-2", "mb-4"], [1, "bg-error/5", "p-4", "flex", "justify-end", "gap-3", "border-t", "border-error/20"], [1, "btn", "btn-error", "btn-sm", "px-8", 3, "click"], [1, "fas", "fa-trash-alt", "mr-2"], [1, "w-20", "h-20", "bg-error/10", "text-error", "rounded-full", "flex", "items-center", "justify-center", "mx-auto"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-white"], [1, "text-gray-500", "mt-2"], [1, "text-xs", "text-gray-400"], [1, "flex", "justify-center", "gap-4"], [1, "btn", "btn-outline", "btn-sm", "px-8", 3, "click", "disabled"], [1, "btn", "btn-error", "btn-sm", "px-10", 3, "click", "disabled"], [1, "loading", "loading-spinner", "loading-xs"], [1, "w-20", "h-20", "bg-warning/10", "text-warning", "rounded-full", "flex", "items-center", "justify-center", "mx-auto"], [1, "fas", "fa-check-circle", "text-4xl"], [1, "text-gray-500", "mt-1", "text-sm"], [1, "font-bold", "text-gray-800", "dark:text-white"], [1, "mt-3", "space-y-1", "text-sm", "text-left", "inline-block"], [1, "flex", "items-center", "gap-2"], [1, "flex", "justify-center", "gap-4", "mt-4"], [1, "btn", "btn-primary", "btn-sm", "px-10", 3, "click", "disabled"], [1, "fas", "fa-check", "text-success", "text-xs", "w-4"], [1, "fas", "fa-check", "mr-2"]], template: function BulkEditModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, BulkEditModalComponent_Conditional_0_Template, 25, 9, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, NgModel, NgForm], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BulkEditModalComponent, [{
    type: Component,
    args: [{ selector: "app-bulk-edit-modal", standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (isOpen()) {\r
<div class="modal modal-open z-50">\r
  <div class="modal-box w-11/12 max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative p-0 overflow-hidden border border-gray-200 dark:border-gray-700">\r
\r
    <!-- Header -->\r
    <div class="px-6 pt-5 pb-0">\r
      <div class="flex justify-between items-start mb-4">\r
        <div>\r
          <h3 class="font-bold text-xl text-gray-800 dark:text-white">Operaci\xF3n Masiva</h3>\r
          <p class="text-xs text-gray-500 mt-0.5">\r
            <span class="font-bold text-primary">{{ selectedIds().length }}</span> productos seleccionados\r
          </p>\r
        </div>\r
        <button class="btn btn-sm btn-circle btn-ghost" (click)="close()" [disabled]="isProcessing()">\u2715</button>\r
      </div>\r
\r
      <!-- Tabs -->\r
      <div class="tabs tabs-bordered w-full">\r
        <button class="tab tab-lg flex-1 font-semibold gap-2"\r
          [class.tab-active]="activeTab() === 'edit'"\r
          (click)="setTab('edit')">\r
          <i class="fas fa-pen-to-square text-sm"></i> Editar campos\r
        </button>\r
        <button class="tab tab-lg flex-1 font-semibold gap-2 hover:text-error"\r
          [class.tab-active]="activeTab() === 'delete'"\r
          [class.text-error]="activeTab() === 'delete'"\r
          (click)="setTab('delete')">\r
          <i class="fas fa-trash-alt text-sm"></i> Eliminar\r
        </button>\r
      </div>\r
    </div>\r
\r
    @if (!showConfirmation()) {\r
\r
      <!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550 EDIT TAB \u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
      @if (activeTab() === 'edit') {\r
        <div class="p-6 space-y-5 max-h-[60vh] overflow-y-auto">\r
\r
          @if (error()) {\r
            <div class="alert alert-error text-sm py-2">\r
              <i class="fas fa-exclamation-circle"></i>\r
              <span>{{ error() }}</span>\r
            </div>\r
          }\r
\r
          <!-- PRICE -->\r
          <div class="grid grid-cols-3 gap-3 items-start border-b border-gray-100 dark:border-gray-700 pb-5">\r
            <div class="pt-2">\r
              <p class="font-bold text-xs uppercase tracking-wider text-gray-400">Precio</p>\r
            </div>\r
            <div class="col-span-2 space-y-2">\r
              <select [ngModel]="priceMode()" (ngModelChange)="priceMode.set($event)"\r
                class="select select-bordered w-full select-sm">\r
                <option value="none">\u2014 Sin cambios \u2014</option>\r
                <option value="fixed">Fijar precio exacto...</option>\r
                <option value="percentage">Ajuste porcentual (+/- %)</option>\r
              </select>\r
              @if (priceMode() !== 'none') {\r
                <div class="relative">\r
                  <input type="number" [ngModel]="priceValue()" (ngModelChange)="priceValue.set($event)"\r
                    [placeholder]="priceMode() === 'fixed' ? 'Monto en $' : 'Ej: 10 (aumento) o -5 (descuento)'"\r
                    class="input input-bordered w-full input-sm pr-8" />\r
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">\r
                    {{ priceMode() === 'fixed' ? '$' : '%' }}\r
                  </span>\r
                </div>\r
              }\r
            </div>\r
          </div>\r
\r
          <!-- STOCK -->\r
          <div class="grid grid-cols-3 gap-3 items-start border-b border-gray-100 dark:border-gray-700 pb-5">\r
            <div class="pt-2">\r
              <p class="font-bold text-xs uppercase tracking-wider text-gray-400">Stock</p>\r
            </div>\r
            <div class="col-span-2 space-y-2">\r
              <select [ngModel]="stockMode()" (ngModelChange)="stockMode.set($event)"\r
                class="select select-bordered w-full select-sm">\r
                <option value="none">\u2014 Sin cambios \u2014</option>\r
                <option value="fixed">Fijar en...</option>\r
                <option value="increase">Aumentar en...</option>\r
                <option value="decrease">Disminuir en...</option>\r
              </select>\r
              @if (stockMode() !== 'none') {\r
                <input type="number" min="0" [ngModel]="stockValue()" (ngModelChange)="stockValue.set($event)"\r
                  placeholder="Cantidad"\r
                  class="input input-bordered w-full input-sm" />\r
              }\r
            </div>\r
          </div>\r
\r
          <!-- CATEGORY -->\r
          <div class="grid grid-cols-3 gap-3 items-center border-b border-gray-100 dark:border-gray-700 pb-5">\r
            <p class="font-bold text-xs uppercase tracking-wider text-gray-400">Categor\xEDa</p>\r
            <div class="col-span-2">\r
              <select [ngModel]="targetCategoryId()" (ngModelChange)="targetCategoryId.set($event)"\r
                class="select select-bordered w-full select-sm">\r
                <option value="">\u2014 Sin cambios \u2014</option>\r
                @for(cat of categories(); track cat.id) {\r
                  <option [value]="cat.id">{{ cat.name }}</option>\r
                }\r
              </select>\r
            </div>\r
          </div>\r
\r
          <!-- BRAND -->\r
          <div class="grid grid-cols-3 gap-3 items-center border-b border-gray-100 dark:border-gray-700 pb-5">\r
            <p class="font-bold text-xs uppercase tracking-wider text-gray-400">Marca</p>\r
            <div class="col-span-2">\r
              <select [ngModel]="targetBrandId()" (ngModelChange)="targetBrandId.set($event)"\r
                class="select select-bordered w-full select-sm">\r
                <option value="">\u2014 Sin cambios \u2014</option>\r
                @for(b of brands(); track b.id) {\r
                  <option [value]="b.id">{{ b.name }}</option>\r
                }\r
              </select>\r
            </div>\r
          </div>\r
\r
          <!-- STATUS -->\r
          <div class="grid grid-cols-3 gap-3 items-center">\r
            <p class="font-bold text-xs uppercase tracking-wider text-gray-400">Estado</p>\r
            <div class="col-span-2">\r
              <select [ngModel]="targetStatus()" (ngModelChange)="targetStatus.set($event)"\r
                class="select select-bordered w-full select-sm">\r
                <option value="none">\u2014 Sin cambios \u2014</option>\r
                <option value="active">\u2705 Publicado (Activo)</option>\r
                <option value="inactive">\u2B1C Borrador (Inactivo)</option>\r
              </select>\r
            </div>\r
          </div>\r
\r
        </div>\r
\r
        <!-- Footer Edit -->\r
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">\r
          <button class="btn btn-ghost btn-sm" (click)="close()">Cancelar</button>\r
          <button class="btn btn-primary btn-sm px-8 shadow-lg shadow-primary/20"\r
            (click)="prepareExecute()"\r
            [disabled]="!hasEditChanges()">\r
            <i class="fas fa-eye mr-2"></i> Vista previa\r
          </button>\r
        </div>\r
      }\r
\r
      <!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550 DELETE TAB \u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
      @if (activeTab() === 'delete') {\r
        <div class="p-8 text-center">\r
          <div class="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-5">\r
            <i class="fas fa-trash-alt text-4xl"></i>\r
          </div>\r
          <h4 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Eliminar productos seleccionados</h4>\r
          <p class="text-gray-500 text-sm max-w-sm mx-auto mb-6">\r
            Se eliminar\xE1n <span class="font-bold text-error">{{ selectedIds().length }} producto{{ selectedIds().length !== 1 ? 's' : '' }}</span> de forma permanente del inventario. Los productos eliminados no aparecer\xE1n en el cat\xE1logo ni en b\xFAsquedas.\r
          </p>\r
          @if (error()) {\r
            <div class="alert alert-error text-sm py-2 mb-4">\r
              <i class="fas fa-exclamation-circle"></i>\r
              <span>{{ error() }}</span>\r
            </div>\r
          }\r
        </div>\r
        <!-- Footer Delete -->\r
        <div class="bg-error/5 p-4 flex justify-end gap-3 border-t border-error/20">\r
          <button class="btn btn-ghost btn-sm" (click)="close()">Cancelar</button>\r
          <button class="btn btn-error btn-sm px-8"\r
            (click)="prepareExecute()">\r
            <i class="fas fa-trash-alt mr-2"></i> Confirmar eliminaci\xF3n\r
          </button>\r
        </div>\r
      }\r
\r
    } @else {\r
      <!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550 CONFIRMATION SCREEN \u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\r
      <div class="p-10 text-center space-y-5">\r
\r
        @if (activeTab() === 'delete') {\r
          <div class="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">\r
            <i class="fas fa-trash-alt text-4xl"></i>\r
          </div>\r
          <div>\r
            <h4 class="text-2xl font-bold text-gray-800 dark:text-white">\xBFConfirmar eliminaci\xF3n?</h4>\r
            <p class="text-gray-500 mt-2">\r
              Se eliminar\xE1n <span class="font-bold text-error">{{ selectedIds().length }} productos</span>.\r
              <br><span class="text-xs text-gray-400">Esta acci\xF3n no se puede deshacer.</span>\r
            </p>\r
          </div>\r
          <div class="flex justify-center gap-4">\r
            <button class="btn btn-outline btn-sm px-8" (click)="showConfirmation.set(false)" [disabled]="isProcessing()">\r
              Regresar\r
            </button>\r
            <button class="btn btn-error btn-sm px-10" (click)="execute()" [disabled]="isProcessing()">\r
              @if (isProcessing()) {\r
                <span class="loading loading-spinner loading-xs"></span> Eliminando...\r
              } @else {\r
                <i class="fas fa-trash-alt mr-2"></i> S\xED, eliminar ahora\r
              }\r
            </button>\r
          </div>\r
        } @else {\r
          <div class="w-20 h-20 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto">\r
            <i class="fas fa-check-circle text-4xl"></i>\r
          </div>\r
          <div>\r
            <h4 class="text-2xl font-bold text-gray-800 dark:text-white">\xBFAplicar cambios?</h4>\r
            <p class="text-gray-500 mt-1 text-sm">\r
              A <span class="font-bold text-gray-800 dark:text-white">{{ selectedIds().length }} productos</span>:\r
            </p>\r
            <ul class="mt-3 space-y-1 text-sm text-left inline-block">\r
              @for (line of confirmSummary(); track $index) {\r
                <li class="flex items-center gap-2">\r
                  <i class="fas fa-check text-success text-xs w-4"></i>\r
                  <span>{{ line }}</span>\r
                </li>\r
              }\r
            </ul>\r
          </div>\r
          <div class="flex justify-center gap-4 mt-4">\r
            <button class="btn btn-outline btn-sm px-8" (click)="showConfirmation.set(false)" [disabled]="isProcessing()">\r
              Regresar\r
            </button>\r
            <button class="btn btn-primary btn-sm px-10" (click)="execute()" [disabled]="isProcessing()">\r
              @if (isProcessing()) {\r
                <span class="loading loading-spinner loading-xs"></span> Actualizando...\r
              } @else {\r
                <i class="fas fa-check mr-2"></i> \xA1S\xED, actualizar ahora!\r
              }\r
            </button>\r
          </div>\r
        }\r
\r
      </div>\r
    }\r
\r
  </div>\r
  <form method="dialog" class="modal-backdrop bg-black/60 backdrop-blur-sm">\r
    <button (click)="close()">close</button>\r
  </form>\r
</div>\r
}\r
` }]
  }], null, { isOpen: [{ type: Input, args: [{ isSignal: true, alias: "isOpen", required: false }] }, { type: Output, args: ["isOpenChange"] }], selectedIds: [{ type: Input, args: [{ isSignal: true, alias: "selectedIds", required: false }] }, { type: Output, args: ["selectedIdsChange"] }], brands: [{ type: Input, args: [{ isSignal: true, alias: "brands", required: false }] }, { type: Output, args: ["brandsChange"] }], categories: [{ type: Input, args: [{ isSignal: true, alias: "categories", required: false }] }, { type: Output, args: ["categoriesChange"] }], initialTab: [{ type: Input, args: [{ isSignal: true, alias: "initialTab", required: false }] }], onSuccess: [{ type: Output, args: ["onSuccess"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BulkEditModalComponent, { className: "BulkEditModalComponent", filePath: "src/app/admin/products/components/bulk-edit-modal/bulk-edit-modal.component.ts", lineNumber: 17 });
})();

// src/app/admin/products/components/import-result-modal/import-result-modal.component.ts
function ImportResultModalComponent_Conditional_32_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 26);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const line_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(line_r1);
  }
}
function ImportResultModalComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 21);
    \u0275\u0275repeaterCreate(1, ImportResultModalComponent_Conditional_32_For_2_Template, 2, 1, "p", 26, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.report.details);
  }
}
var ImportResultModalComponent = class _ImportResultModalComponent {
  report;
  close = new EventEmitter();
  get hasErrors() {
    return this.report.skipped > 0;
  }
  static \u0275fac = function ImportResultModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImportResultModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImportResultModalComponent, selectors: [["app-import-result-modal"]], inputs: { report: "report" }, outputs: { close: "close" }, decls: 38, vars: 49, consts: [[1, "modal", "modal-open"], [1, "modal-box", "max-w-lg", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "right-0", "h-1", "bg-gradient-to-r", "from-green-400", "via-teal-400", "to-blue-500"], [1, "flex", "items-center", "gap-3", "mb-6", "pt-2"], [1, "w-12", "h-12", "rounded-2xl", "flex", "items-center", "justify-center"], [1, "fas", "text-2xl"], [1, "font-bold", "text-xl"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "grid", "grid-cols-2", "gap-3", "mb-6"], [1, "stat", "bg-green-50", "dark:bg-green-900/20", "rounded-xl", "px-4", "py-3", "border", "border-green-100", "dark:border-green-800/30"], [1, "stat-title", "text-xs", "text-green-700", "dark:text-green-400"], [1, "stat-value", "text-2xl", "text-green-600", "dark:text-green-400"], [1, "stat", "bg-blue-50", "dark:bg-blue-900/20", "rounded-xl", "px-4", "py-3", "border", "border-blue-100", "dark:border-blue-800/30"], [1, "stat-title", "text-xs", "text-blue-700", "dark:text-blue-400"], [1, "stat-value", "text-2xl", "text-blue-600", "dark:text-blue-400"], [1, "stat", "bg-purple-50", "dark:bg-purple-900/20", "rounded-xl", "px-4", "py-3", "border", "border-purple-100", "dark:border-purple-800/30"], [1, "stat-title", "text-xs", "text-purple-700", "dark:text-purple-400"], [1, "stat-value", "text-2xl", "text-purple-600", "dark:text-purple-400"], [1, "stat", "rounded-xl", "px-4", "py-3", "border"], [1, "stat-title", "text-xs"], [1, "stat-value", "text-2xl"], [1, "bg-gray-50", "dark:bg-gray-800/50", "rounded-xl", "p-4", "mb-6", "space-y-1.5"], [1, "modal-action", "mt-4"], [1, "btn", "btn-primary", "btn-block", 3, "click"], [1, "fas", "fa-check", "mr-2"], [1, "modal-backdrop", 3, "click"], [1, "text-sm", "text-gray-700", "dark:text-gray-300"]], template: function ImportResultModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275domElement(2, "div", 2);
      \u0275\u0275domElementStart(3, "div", 3)(4, "div", 4);
      \u0275\u0275domElement(5, "i", 5);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "div")(7, "h3", 6);
      \u0275\u0275text(8, "Importaci\xF3n completada");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "p", 7);
      \u0275\u0275text(10, "Resumen del procesamiento del CSV");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(11, "div", 8)(12, "div", 9)(13, "div", 10);
      \u0275\u0275text(14, "Nuevos productos");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(15, "div", 11);
      \u0275\u0275text(16);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(17, "div", 12)(18, "div", 13);
      \u0275\u0275text(19, "Precios actualizados");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(20, "div", 14);
      \u0275\u0275text(21);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(22, "div", 15)(23, "div", 16);
      \u0275\u0275text(24, "Repuestos renombrados");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(25, "div", 17);
      \u0275\u0275text(26);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(27, "div", 18)(28, "div", 19);
      \u0275\u0275text(29, "Omitidas");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(30, "div", 20);
      \u0275\u0275text(31);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275conditionalCreate(32, ImportResultModalComponent_Conditional_32_Template, 3, 0, "div", 21);
      \u0275\u0275domElementStart(33, "div", 22)(34, "button", 23);
      \u0275\u0275domListener("click", function ImportResultModalComponent_Template_button_click_34_listener() {
        return ctx.close.emit();
      });
      \u0275\u0275domElement(35, "i", 24);
      \u0275\u0275text(36, " Listo, actualizar inventario ");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(37, "label", 25);
      \u0275\u0275domListener("click", function ImportResultModalComponent_Template_label_click_37_listener() {
        return ctx.close.emit();
      });
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275classProp("bg-green-100", !ctx.hasErrors)("dark:bg-green-900", !ctx.hasErrors)("bg-amber-100", ctx.hasErrors)("dark:bg-amber-900", ctx.hasErrors);
      \u0275\u0275advance();
      \u0275\u0275classProp("fa-check-circle", !ctx.hasErrors)("text-green-600", !ctx.hasErrors)("fa-exclamation-triangle", ctx.hasErrors)("text-amber-500", ctx.hasErrors);
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate(ctx.report.inserted);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.report.priceUpdated);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.report.renamed);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-red-50", ctx.report.skipped > 0)("dark:bg-red-900/20", ctx.report.skipped > 0)("border-red-100", ctx.report.skipped > 0)("dark:border-red-800/30", ctx.report.skipped > 0)("bg-gray-50", ctx.report.skipped === 0)("dark:bg-gray-800/50", ctx.report.skipped === 0)("border-gray-100", ctx.report.skipped === 0)("dark:border-gray-700", ctx.report.skipped === 0);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-red-700", ctx.report.skipped > 0)("dark:text-red-400", ctx.report.skipped > 0)("text-gray-500", ctx.report.skipped === 0);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-red-600", ctx.report.skipped > 0)("dark:text-red-400", ctx.report.skipped > 0)("text-gray-400", ctx.report.skipped === 0);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.report.skipped);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.report.details.length > 0 ? 32 : -1);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImportResultModalComponent, [{
    type: Component,
    args: [{
      selector: "app-import-result-modal",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="modal modal-open">
      <div class="modal-box max-w-lg relative overflow-hidden">
        <!-- Gradient accent line -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-500"></div>

        <!-- Header -->
        <div class="flex items-center gap-3 mb-6 pt-2">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
               [class.bg-green-100]="!hasErrors"
               [class.dark:bg-green-900]="!hasErrors"
               [class.bg-amber-100]="hasErrors"
               [class.dark:bg-amber-900]="hasErrors">
            <i class="fas text-2xl"
               [class.fa-check-circle]="!hasErrors"
               [class.text-green-600]="!hasErrors"
               [class.fa-exclamation-triangle]="hasErrors"
               [class.text-amber-500]="hasErrors"></i>
          </div>
          <div>
            <h3 class="font-bold text-xl">Importaci\xF3n completada</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Resumen del procesamiento del CSV</p>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="stat bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 border border-green-100 dark:border-green-800/30">
            <div class="stat-title text-xs text-green-700 dark:text-green-400">Nuevos productos</div>
            <div class="stat-value text-2xl text-green-600 dark:text-green-400">{{ report.inserted }}</div>
          </div>
          <div class="stat bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800/30">
            <div class="stat-title text-xs text-blue-700 dark:text-blue-400">Precios actualizados</div>
            <div class="stat-value text-2xl text-blue-600 dark:text-blue-400">{{ report.priceUpdated }}</div>
          </div>
          <div class="stat bg-purple-50 dark:bg-purple-900/20 rounded-xl px-4 py-3 border border-purple-100 dark:border-purple-800/30">
            <div class="stat-title text-xs text-purple-700 dark:text-purple-400">Repuestos renombrados</div>
            <div class="stat-value text-2xl text-purple-600 dark:text-purple-400">{{ report.renamed }}</div>
          </div>
          <div class="stat rounded-xl px-4 py-3 border"
               [class.bg-red-50]="report.skipped > 0"
               [class.dark:bg-red-900/20]="report.skipped > 0"
               [class.border-red-100]="report.skipped > 0"
               [class.dark:border-red-800/30]="report.skipped > 0"
               [class.bg-gray-50]="report.skipped === 0"
               [class.dark:bg-gray-800/50]="report.skipped === 0"
               [class.border-gray-100]="report.skipped === 0"
               [class.dark:border-gray-700]="report.skipped === 0">
            <div class="stat-title text-xs"
                 [class.text-red-700]="report.skipped > 0"
                 [class.dark:text-red-400]="report.skipped > 0"
                 [class.text-gray-500]="report.skipped === 0">Omitidas</div>
            <div class="stat-value text-2xl"
                 [class.text-red-600]="report.skipped > 0"
                 [class.dark:text-red-400]="report.skipped > 0"
                 [class.text-gray-400]="report.skipped === 0">{{ report.skipped }}</div>
          </div>
        </div>

        <!-- Detail lines -->
        @if (report.details.length > 0) {
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-1.5">
            @for (line of report.details; track $index) {
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ line }}</p>
            }
          </div>
        }

        <!-- Actions -->
        <div class="modal-action mt-4">
          <button class="btn btn-primary btn-block" (click)="close.emit()">
            <i class="fas fa-check mr-2"></i>
            Listo, actualizar inventario
          </button>
        </div>
      </div>
      <label class="modal-backdrop" (click)="close.emit()"></label>
    </div>
    `
    }]
  }], null, { report: [{
    type: Input,
    args: [{ required: true }]
  }], close: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImportResultModalComponent, { className: "ImportResultModalComponent", filePath: "src/app/admin/products/components/import-result-modal/import-result-modal.component.ts", lineNumber: 90 });
})();

// src/app/admin/products/admin-products-page.ts
var _c0 = () => [1, 2, 3, 4, 5, 6, 7, 8];
var _c1 = (a0) => ["/admin/products", a0];
var _forTrack02 = ($index, $item) => $item.id;
function AdminProductsPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 35);
    \u0275\u0275text(1, " Importando\u2026 ");
  }
}
function AdminProductsPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 36);
    \u0275\u0275text(1, " Importar ");
  }
}
function AdminProductsPage_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r3 = ctx.$implicit;
    \u0275\u0275property("value", cat_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r3.name);
  }
}
function AdminProductsPage_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 37)(2, "div", 38)(3, "span", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " seleccionados ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 40)(7, "button", 41);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_49_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.openBulkEdit());
    });
    \u0275\u0275element(8, "i", 42);
    \u0275\u0275text(9, " Editar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 43);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_49_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.openBulkDelete());
    });
    \u0275\u0275element(11, "i", 44);
    \u0275\u0275text(12, " Eliminar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 45);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_49_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.clearSelection());
    });
    \u0275\u0275element(14, "i", 46);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.selectedIds().size);
  }
}
function AdminProductsPage_Conditional_50_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 47);
  }
}
function AdminProductsPage_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275repeaterCreate(1, AdminProductsPage_Conditional_50_For_2_Template, 1, 0, "div", 47, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function AdminProductsPage_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 48);
    \u0275\u0275element(2, "i", 49);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.error());
  }
}
function AdminProductsPage_Conditional_52_For_21_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "slice");
  }
  if (rf & 2) {
    const product_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" Marca ID: ", \u0275\u0275pipeBind3(1, 1, product_r8.brand_id, 0, 5), "... ");
  }
}
function AdminProductsPage_Conditional_52_For_21_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Generic ");
  }
}
function AdminProductsPage_Conditional_52_For_21_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 78);
    \u0275\u0275text(1, "Agotado");
    \u0275\u0275elementEnd();
  }
}
function AdminProductsPage_Conditional_52_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 65);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_52_For_21_Template_tr_click_0_listener() {
      const product_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleSelection(product_r8.id));
    });
    \u0275\u0275elementStart(1, "td", 66);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_52_For_21_Template_td_click_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "label")(3, "input", 55);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_52_For_21_Template_input_change_3_listener() {
      const product_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleSelection(product_r8.id));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(4, "td")(5, "div", 67)(6, "div", 68)(7, "div", 69);
    \u0275\u0275element(8, "img", 70);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "div", 71);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 72);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "td")(15, "div", 73)(16, "span", 74);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 75);
    \u0275\u0275conditionalCreate(19, AdminProductsPage_Conditional_52_For_21_Conditional_19_Template, 2, 5)(20, AdminProductsPage_Conditional_52_For_21_Conditional_20_Template, 1, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "td", 76);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td")(25, "div", 40)(26, "div", 77);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(28, AdminProductsPage_Conditional_52_For_21_Conditional_28_Template, 2, 0, "span", 78);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td")(30, "div", 79);
    \u0275\u0275element(31, "div", 80);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "td", 81);
    \u0275\u0275listener("click", function AdminProductsPage_Conditional_52_For_21_Template_td_click_33_listener($event) {
      \u0275\u0275restoreView(_r7);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(34, "a", 82);
    \u0275\u0275element(35, "i", 83);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r8 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r4.selectedIds().has(product_r8.id));
    \u0275\u0275advance(5);
    \u0275\u0275property("src", product_r8.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", product_r8.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r8.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r8.slug);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(product_r8.sku || "---");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(product_r8.brand_id ? 19 : 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(23, 28, product_r8.price, product_r8.currency || "ARS"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("--value", product_r8.stock ? product_r8.stock > 100 ? 100 : product_r8.stock : 0);
    \u0275\u0275classProp("text-success", !product_r8.stock || product_r8.stock > 10)("text-warning", product_r8.stock && product_r8.stock <= 10 && product_r8.stock > 0)("text-error", product_r8.stock === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r8.stock || 0, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(product_r8.stock === 0 ? 28 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", product_r8.is_active)("badge-ghost", !product_r8.is_active);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-white", product_r8.is_active)("bg-gray-500", !product_r8.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r8.is_active ? "Activo" : "Borrador", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(31, _c1, product_r8.id));
  }
}
function AdminProductsPage_Conditional_52_For_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84)(1, "div", 85)(2, "input", 86);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_52_For_29_Template_input_change_2_listener() {
      const product_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.toggleSelection(product_r10.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 87);
    \u0275\u0275element(4, "img", 88);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 89)(6, "div", 90)(7, "h3", 91);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 92);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "p", 93);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 94)(14, "div")(15, "span", 95);
    \u0275\u0275text(16, "Precio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 96);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 56)(21, "span", 95);
    \u0275\u0275text(22, "Stock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 97);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(25, "div", 98)(26, "a", 99);
    \u0275\u0275text(27, " Editar Detalle ");
    \u0275\u0275element(28, "i", 100);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r10 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ring-2", ctx_r4.selectedIds().has(product_r10.id))("ring-indigo-500", ctx_r4.selectedIds().has(product_r10.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("checked", ctx_r4.selectedIds().has(product_r10.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("src", product_r10.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(product_r10.name);
    \u0275\u0275advance();
    \u0275\u0275classProp("badge-success", product_r10.is_active)("badge-ghost", !product_r10.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", product_r10.is_active ? "ON" : "OFF", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r10.sku);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 18, product_r10.price, product_r10.currency || "ARS"));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("text-error", product_r10.stock === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(product_r10.stock || 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(21, _c1, product_r10.id));
  }
}
function AdminProductsPage_Conditional_52_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275element(1, "i", 101);
    \u0275\u0275elementStart(2, "p", 102);
    \u0275\u0275text(3, "No se encontraron productos.");
    \u0275\u0275elementEnd()();
  }
}
function AdminProductsPage_Conditional_52_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275element(1, "pagination", 103);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r4.totalPages())("currentPage", ctx_r4.currentPage());
  }
}
function AdminProductsPage_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "table", 51)(2, "thead", 52)(3, "tr", 53)(4, "th", 54)(5, "label")(6, "input", 55);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_52_Template_input_change_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleSelectAll());
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
    \u0275\u0275elementStart(17, "th", 56);
    \u0275\u0275text(18, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, AdminProductsPage_Conditional_52_For_21_Template, 36, 33, "tr", 57, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 58)(23, "div", 59)(24, "label", 60)(25, "input", 55);
    \u0275\u0275listener("change", function AdminProductsPage_Conditional_52_Template_input_change_25_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.toggleSelectAll());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 61);
    \u0275\u0275text(27, "Seleccionar Todo en p\xE1gina");
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(28, AdminProductsPage_Conditional_52_For_29_Template, 29, 23, "div", 62, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(30, AdminProductsPage_Conditional_52_Conditional_30_Template, 4, 0, "div", 63);
    \u0275\u0275conditionalCreate(31, AdminProductsPage_Conditional_52_Conditional_31_Template, 2, 2, "div", 64);
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("checked", ctx_r4.isAllSelected());
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r4.paginatedProducts());
    \u0275\u0275advance(5);
    \u0275\u0275property("checked", ctx_r4.isAllSelected());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.paginatedProducts());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r4.paginatedProducts().length === 0 ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.paginatedProducts().length > 0 ? 31 : -1);
  }
}
function AdminProductsPage_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 104);
    \u0275\u0275element(2, "span", 105);
    \u0275\u0275elementStart(3, "p", 106);
    \u0275\u0275text(4, "Procesando importaci\xF3n\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 107);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 108);
    \u0275\u0275text(8, "No cierres esta ventana.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r4.importProgress());
  }
}
function AdminProductsPage_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-import-result-modal", 109);
    \u0275\u0275listener("close", function AdminProductsPage_Conditional_55_Template_app_import_result_modal_close_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.onImportResultClose());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("report", ctx_r4.importReport());
  }
}
var AdminProductsPage = class _AdminProductsPage {
  productService = inject(AdminProductService);
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  // Signals
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  brands = signal([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  categories = signal([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  selectedCategoryId = signal("all", ...ngDevMode ? [{ debugName: "selectedCategoryId" }] : []);
  sortOrder = signal("name_asc", ...ngDevMode ? [{ debugName: "sortOrder" }] : []);
  // Selection
  selectedIds = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "selectedIds" }] : []);
  isBulkModalOpen = signal(false, ...ngDevMode ? [{ debugName: "isBulkModalOpen" }] : []);
  bulkInitialTab = signal("edit", ...ngDevMode ? [{ debugName: "bulkInitialTab" }] : []);
  // Pagination
  currentPage = signal(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  itemsPerPage = signal(20, ...ngDevMode ? [{ debugName: "itemsPerPage" }] : []);
  // Merged client per_page, let's use 20 for admin
  totalItems = signal(0, ...ngDevMode ? [{ debugName: "totalItems" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  importing = signal(false, ...ngDevMode ? [{ debugName: "importing" }] : []);
  importProgress = signal("", ...ngDevMode ? [{ debugName: "importProgress" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Import result modal
  importReport = signal(null, ...ngDevMode ? [{ debugName: "importReport" }] : []);
  showImportResult = signal(false, ...ngDevMode ? [{ debugName: "showImportResult" }] : []);
  searchSubject = new Subject();
  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const page = params["_page"] ? Number(params["_page"]) : 1;
      const q = params["q"] || "";
      this.currentPage.set(page || 1);
      if (q && q !== this.searchQuery()) {
        this.searchQuery.set(q);
      }
      this.loadData();
    });
    this.searchSubject.pipe(takeUntilDestroyed(), debounceTime(400), distinctUntilChanged()).subscribe((query) => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: query || null, _page: 1 },
        queryParamsHandling: "merge"
      });
    });
  }
  // Computed properties
  paginatedProducts = computed(() => {
    return this.products();
  }, ...ngDevMode ? [{ debugName: "paginatedProducts" }] : []);
  totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }, ...ngDevMode ? [{ debugName: "totalPages" }] : []);
  isAllSelected = computed(() => {
    const pageItems = this.paginatedProducts();
    if (pageItems.length === 0)
      return false;
    const selected = this.selectedIds();
    return pageItems.every((p) => selected.has(p.id));
  }, ...ngDevMode ? [{ debugName: "isAllSelected" }] : []);
  selectedIdsList = computed(() => Array.from(this.selectedIds()), ...ngDevMode ? [{ debugName: "selectedIdsList" }] : []);
  router = inject(Router);
  async ngOnInit() {
  }
  onSearchChange(query) {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }
  async loadData() {
    this.loading.set(true);
    try {
      if (this.brands().length === 0 || this.categories().length === 0) {
        const [brands, categories] = await Promise.all([
          this.productService.getBrands(),
          this.productService.getCategories()
        ]);
        this.brands.set(brands);
        this.categories.set(categories);
      }
      const sortMap = {
        "name_asc": { column: "name", order: "asc" },
        "price_asc": { column: "price", order: "asc" },
        "price_desc": { column: "price", order: "desc" },
        "stock_asc": { column: "stock", order: "asc" },
        "stock_desc": { column: "stock", order: "desc" }
      };
      const currentSort = sortMap[this.sortOrder()] || sortMap["name_asc"];
      const response = await this.productService.getProductsPaginated({
        _page: this.currentPage(),
        _per_page: this.itemsPerPage(),
        q: this.searchQuery(),
        category_id: this.selectedCategoryId() !== "all" ? this.selectedCategoryId() : void 0,
        _sort: currentSort.column,
        _order: currentSort.order,
        include_inactive: true
      });
      this.products.set(response.data || []);
      this.totalItems.set(response.items || 0);
    } catch (e) {
      this.error.set(e.message || "Error al cargar datos");
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }
  updateSort(event) {
    this.sortOrder.set(event.target.value);
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { _page: 1 },
      queryParamsHandling: "merge"
    });
    this.loadData();
  }
  onCategoryChange(event) {
    this.selectedCategoryId.set(event.target.value);
    this.currentPage.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { _page: 1 },
      queryParamsHandling: "merge"
    });
    this.loadData();
  }
  toggleSelectAll() {
    const pageItems = this.paginatedProducts();
    const currentSelected = new Set(this.selectedIds());
    const allOnPageSelected = this.isAllSelected();
    if (allOnPageSelected) {
      pageItems.forEach((p) => currentSelected.delete(p.id));
    } else {
      pageItems.forEach((p) => currentSelected.add(p.id));
    }
    this.selectedIds.set(currentSelected);
  }
  toggleSelection(id) {
    const currentSelected = new Set(this.selectedIds());
    if (currentSelected.has(id)) {
      currentSelected.delete(id);
    } else {
      currentSelected.add(id);
    }
    this.selectedIds.set(currentSelected);
  }
  clearSelection() {
    this.selectedIds.set(/* @__PURE__ */ new Set());
  }
  openBulkEdit() {
    this.bulkInitialTab.set("edit");
    this.isBulkModalOpen.set(true);
  }
  openBulkDelete() {
    this.bulkInitialTab.set("delete");
    this.isBulkModalOpen.set(true);
  }
  async onBulkEditSuccess() {
    this.clearSelection();
    await this.loadData();
  }
  async exportProducts() {
    try {
      await this.productService.exportProductsToCSV();
    } catch (e) {
      this.error.set("Error al exportar: " + e.message);
    }
  }
  async importProducts(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file)
      return;
    try {
      this.importing.set(true);
      this.importProgress.set("Leyendo CSV y cargando inventario actual\u2026");
      this.error.set(null);
      this.cdr.detectChanges();
      const report = await this.productService.importProductsFromCSV(file);
      this.importProgress.set("");
      this.importReport.set(report);
      this.showImportResult.set(true);
      this.cdr.detectChanges();
    } catch (e) {
      this.error.set("Error al importar: " + e.message);
      this.importProgress.set("");
    } finally {
      this.importing.set(false);
      this.cdr.detectChanges();
    }
  }
  async onImportResultClose() {
    this.showImportResult.set(false);
    this.importReport.set(null);
    await this.loadData();
  }
  static \u0275fac = function AdminProductsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminProductsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminProductsPage, selectors: [["app-admin-products-page"]], decls: 56, vars: 15, consts: [["fileInput", ""], [1, "max-w-7xl", "mx-auto", "pb-20", "relative", "min-h-screen"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "md:items-center", "py-6", "gap-4", "sticky", "top-0", "z-30", "bg-gray-50/95", "dark:bg-[#0f172a]/95", "backdrop-blur-sm", "border-b", "border-gray-200", "dark:border-gray-800", "px-4"], [1, "text-3xl", "font-bold", "bg-clip-text", "text-transparent", "bg-linear-to-r", "from-green-500", "to-teal-400"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "hidden", "md:block"], [1, "flex", "gap-2", "w-full", "md:w-auto", "overflow-x-auto", "pb-2", "md:pb-0", "no-scrollbar"], [1, "btn", "btn-outline", "btn-sm", "md:btn-md", 3, "click", "disabled"], [1, "fas", "fa-file-export", "mr-2"], ["type", "file", "accept", ".csv", 1, "hidden", 3, "change"], ["routerLink", "/admin/products/new", 1, "btn", "btn-primary", "btn-sm", "md:btn-md", "shadow-lg", "shadow-green-500/20", "whitespace-nowrap"], [1, "fas", "fa-plus", "mr-2"], [1, "p-4", "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "mb-4"], [1, "form-control", "w-full", "lg:col-span-2"], [1, "relative", "group"], [1, "absolute", "-inset-0.5", "bg-linear-to-r", "from-green-400", "to-blue-500", "rounded-lg", "blur", "opacity-25", "group-hover:opacity-50", "transition", "duration-1000"], [1, "relative", "flex", "items-center", "bg-white", "dark:bg-gray-800", "rounded-lg", "shadow-sm"], [1, "fas", "fa-search", "px-4", "text-gray-400"], ["type", "text", "placeholder", "Buscar por nombre, SKU, marca...", 1, "input", "input-ghost", "w-full", "focus:bg-transparent", "text-lg", "h-12", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "md:flex-row", "items-center", "gap-3", "w-full", "lg:w-auto"], [1, "flex", "items-center", "gap-2", "w-full", "lg:w-48"], [1, "text-xs", "font-bold", "text-gray-500", "hidden", "xl:block"], [1, "select", "select-bordered", "select-sm", "md:select-md", "w-full", "bg-white", "dark:bg-gray-800", 3, "change", "ngModel"], ["value", "all"], [3, "value"], ["value", "name_asc"], ["value", "price_asc"], ["value", "price_desc"], ["value", "stock_asc"], ["value", "stock_desc"], [1, "fixed", "bottom-4", "left-4", "right-4", "md:left-1/2", "md:-translate-x-1/2", "md:w-auto", "z-40", "animate-fade-in-up"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6", "p-4"], [1, "p-4"], [3, "isOpenChange", "onSuccess", "isOpen", "selectedIds", "brands", "categories", "initialTab"], [1, "fixed", "inset-0", "z-50", "flex", "flex-col", "items-center", "justify-center", "bg-black/60", "backdrop-blur-sm"], [3, "report"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-file-import", "mr-2"], [1, "bg-gray-900", "text-white", "dark:bg-white", "dark:text-gray-900", "rounded-full", "shadow-2xl", "px-6", "py-3", "flex", "items-center", "justify-between", "gap-4", "border", "border-gray-700", "dark:border-gray-200"], [1, "font-bold", "whitespace-nowrap"], [1, "badge", "badge-primary", "mr-2"], [1, "flex", "items-center", "gap-2"], [1, "btn", "btn-sm", "btn-ghost", "hover:bg-white/20", "dark:hover:bg-black/10", "text-white", "dark:text-gray-900", "whitespace-nowrap", 3, "click"], [1, "fas", "fa-pen", "mr-1.5"], [1, "btn", "btn-sm", "btn-ghost", "hover:bg-error/30", "text-error", "whitespace-nowrap", 3, "click"], [1, "fas", "fa-trash-alt", "mr-1.5"], [1, "btn", "btn-circle", "btn-xs", "btn-ghost", "text-white", "dark:text-gray-900", "opacity-70", "hover:opacity-100", 3, "click"], [1, "fas", "fa-times"], [1, "skeleton", "h-64", "rounded-xl"], [1, "alert", "alert-error"], [1, "fas", "fa-exclamation-triangle"], [1, "hidden", "lg:block", "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-lg", "border", "border-gray-100", "dark:border-gray-700", "overflow-hidden", "mx-4"], [1, "table", "w-full"], [1, "bg-gray-50", "dark:bg-gray-700/50"], [1, "text-gray-600", "dark:text-gray-300", "font-bold", "uppercase", "text-xs", "tracking-wider"], [1, "w-12"], ["type", "checkbox", 1, "checkbox", "checkbox-sm", "checkbox-primary", 3, "change", "checked"], [1, "text-right"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors", "group", "cursor-pointer"], [1, "lg:hidden", "grid", "grid-cols-1", "gap-4", "px-4"], [1, "flex", "items-center", "justify-between", "bg-white", "dark:bg-gray-800", "p-3", "rounded-lg", "shadow-sm"], [1, "label", "cursor-pointer", "gap-3"], [1, "label-text", "font-bold"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", 3, "ring-2", "ring-indigo-500"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "text-center", "opacity-50"], [1, "mt-8", "flex", "justify-center", "pb-8"], [1, "hover:bg-gray-50", "dark:hover:bg-gray-700/30", "transition-colors", "group", "cursor-pointer", 3, "click"], [3, "click"], [1, "flex", "items-center", "gap-4"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12", "bg-gray-100", "dark:bg-gray-700"], [1, "object-cover", 3, "src", "alt"], [1, "font-bold", "text-gray-900", "dark:text-white", "line-clamp-1"], [1, "text-xs", "text-gray-400", "font-mono"], [1, "flex", "flex-col"], [1, "font-mono", "text-xs", "font-bold"], [1, "text-xs", "text-gray-500"], [1, "font-mono", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "radial-progress", "text-xs", 2, "--size", "2rem"], [1, "badge", "badge-error", "badge-xs"], [1, "badge", "badge-sm", "gap-2"], [1, "w-2", "h-2", "rounded-full"], [1, "text-right", 3, "click"], ["data-tip", "Editar", 1, "btn", "btn-ghost", "btn-sm", "btn-circle", "tooltip", "tooltip-left", 3, "routerLink"], [1, "fas", "fa-pen", "text-gray-500", "hover:text-indigo-500"], [1, "card", "bg-white", "dark:bg-gray-800", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700"], [1, "card-body", "p-4", "flex-row", "items-start", "gap-4"], ["type", "checkbox", 1, "checkbox", "checkbox-primary", "mt-1", 3, "change", "checked"], [1, "avatar", "rounded-xl", "w-20", "h-20", "bg-gray-100", "shrink-0"], [1, "object-cover", "rounded-xl", 3, "src"], [1, "flex-1", "min-w-0"], [1, "flex", "justify-between", "items-start"], [1, "font-bold", "text-gray-900", "dark:text-white", "truncate", "pr-2"], [1, "badge", "badge-xs"], [1, "text-xs", "text-gray-500", "font-mono", "mb-2"], [1, "flex", "justify-between", "items-end", "mt-2"], [1, "block", "text-xs", "text-gray-400"], [1, "text-lg", "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "font-mono", "font-bold"], [1, "card-actions", "border-t", "border-gray-100", "dark:border-gray-700", "p-2", "flex", "justify-end", "bg-gray-50", "dark:bg-gray-800/50", "rounded-b-2xl"], [1, "btn", "btn-sm", "btn-ghost", "w-full", 3, "routerLink"], [1, "fas", "fa-arrow-right", "ml-2", "opacity-50"], [1, "fas", "fa-box-open", "text-6xl", "mb-4", "text-gray-300"], [1, "text-xl"], [3, "pages", "currentPage"], [1, "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "p-8", "flex", "flex-col", "items-center", "gap-4", "max-w-sm", "text-center"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "font-bold", "text-lg"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "text-xs", "text-gray-400"], [3, "close", "report"]], template: function AdminProductsPage_Template(rf, ctx) {
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
      \u0275\u0275conditionalCreate(12, AdminProductsPage_Conditional_12_Template, 2, 0)(13, AdminProductsPage_Conditional_13_Template, 2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "input", 8, 0);
      \u0275\u0275listener("change", function AdminProductsPage_Template_input_change_14_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.importProducts($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "a", 9);
      \u0275\u0275element(17, "i", 10);
      \u0275\u0275text(18, " Nuevo ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 11)(20, "div", 12)(21, "div", 13);
      \u0275\u0275element(22, "div", 14);
      \u0275\u0275elementStart(23, "div", 15);
      \u0275\u0275element(24, "i", 16);
      \u0275\u0275elementStart(25, "input", 17);
      \u0275\u0275listener("ngModelChange", function AdminProductsPage_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSearchChange($event));
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(26, "div", 18)(27, "div", 19)(28, "span", 20);
      \u0275\u0275text(29, "Categor\xEDa:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "select", 21);
      \u0275\u0275listener("change", function AdminProductsPage_Template_select_change_30_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onCategoryChange($event));
      });
      \u0275\u0275elementStart(31, "option", 22);
      \u0275\u0275text(32, "Todas las Categor\xEDas");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(33, AdminProductsPage_For_34_Template, 2, 2, "option", 23, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 19)(36, "span", 20);
      \u0275\u0275text(37, "Ordenar:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "select", 21);
      \u0275\u0275listener("change", function AdminProductsPage_Template_select_change_38_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.updateSort($event));
      });
      \u0275\u0275elementStart(39, "option", 24);
      \u0275\u0275text(40, "A-Z Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "option", 25);
      \u0275\u0275text(42, "Precio: Bajo a Alto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "option", 26);
      \u0275\u0275text(44, "Precio: Alto a Bajo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "option", 27);
      \u0275\u0275text(46, "Stock: Bajo a Alto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "option", 28);
      \u0275\u0275text(48, "Stock: Alto a Bajo");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(49, AdminProductsPage_Conditional_49_Template, 15, 1, "div", 29);
      \u0275\u0275conditionalCreate(50, AdminProductsPage_Conditional_50_Template, 3, 1, "div", 30)(51, AdminProductsPage_Conditional_51_Template, 5, 1, "div", 31)(52, AdminProductsPage_Conditional_52_Template, 32, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "app-bulk-edit-modal", 32);
      \u0275\u0275twoWayListener("isOpenChange", function AdminProductsPage_Template_app_bulk_edit_modal_isOpenChange_53_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.isBulkModalOpen, $event) || (ctx.isBulkModalOpen = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onSuccess", function AdminProductsPage_Template_app_bulk_edit_modal_onSuccess_53_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onBulkEditSuccess());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(54, AdminProductsPage_Conditional_54_Template, 9, 1, "div", 33);
      \u0275\u0275conditionalCreate(55, AdminProductsPage_Conditional_55_Template, 1, 1, "app-import-result-modal", 34);
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", ctx.loading() || ctx.importing());
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.loading() || ctx.importing());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.importing() ? 12 : 13);
      \u0275\u0275advance(13);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.selectedCategoryId());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.categories());
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.sortOrder());
      \u0275\u0275advance(11);
      \u0275\u0275conditional(ctx.selectedIds().size > 0 ? 49 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 50 : ctx.error() ? 51 : 52);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("isOpen", ctx.isBulkModalOpen);
      \u0275\u0275property("selectedIds", ctx.selectedIdsList())("brands", ctx.brands())("categories", ctx.categories())("initialTab", ctx.bulkInitialTab());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.importing() ? 54 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showImportResult() && ctx.importReport() ? 55 : -1);
    }
  }, dependencies: [CommonModule, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Pagination, BulkEditModalComponent, ImportResultModalComponent, SlicePipe, CurrencyPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminProductsPage, [{
    type: Component,
    args: [{ selector: "app-admin-products-page", standalone: true, imports: [CommonModule, RouterLink, FormsModule, Pagination, BulkEditModalComponent, ImportResultModalComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="max-w-7xl mx-auto pb-20 relative min-h-screen">\r
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
      <button (click)="exportProducts()" class="btn btn-outline btn-sm md:btn-md" [disabled]="loading() || importing()">\r
        <i class="fas fa-file-export mr-2"></i> CSV\r
      </button>\r
      <button (click)="fileInput.click()" class="btn btn-outline btn-sm md:btn-md" [disabled]="loading() || importing()">\r
        @if (importing()) {\r
          <span class="loading loading-spinner loading-xs mr-2"></span> Importando\u2026\r
        } @else {\r
          <i class="fas fa-file-import mr-2"></i> Importar\r
        }\r
      </button>\r
      <input #fileInput type="file" accept=".csv" class="hidden" (change)="importProducts($event)" />\r
\r
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
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="onSearchChange($event)"\r
            placeholder="Buscar por nombre, SKU, marca..."\r
            class="input input-ghost w-full focus:bg-transparent text-lg h-12" />\r
          </div>\r
        </div>\r
      </div>\r
\r
      <div class="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">\r
        <div class="flex items-center gap-2 w-full lg:w-48">\r
          <span class="text-xs font-bold text-gray-500 hidden xl:block">Categor\xEDa:</span>\r
          <select [ngModel]="selectedCategoryId()" (change)="onCategoryChange($event)" class="select select-bordered select-sm md:select-md w-full bg-white dark:bg-gray-800">\r
            <option value="all">Todas las Categor\xEDas</option>\r
            @for (cat of categories(); track cat.id) {\r
              <option [value]="cat.id">{{ cat.name }}</option>\r
            }\r
          </select>\r
        </div>\r
\r
        <div class="flex items-center gap-2 w-full lg:w-48">\r
          <span class="text-xs font-bold text-gray-500 hidden xl:block">Ordenar:</span>\r
          <select [ngModel]="sortOrder()" (change)="updateSort($event)" class="select select-bordered select-sm md:select-md w-full bg-white dark:bg-gray-800">\r
            <option value="name_asc">A-Z Nombre</option>\r
            <option value="price_asc">Precio: Bajo a Alto</option>\r
            <option value="price_desc">Precio: Alto a Bajo</option>\r
            <option value="stock_asc">Stock: Bajo a Alto</option>\r
            <option value="stock_desc">Stock: Alto a Bajo</option>\r
          </select>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Selection Bar (Floating) -->\r
    @if (selectedIds().size > 0) {\r
      <div class="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-40 animate-fade-in-up">\r
        <div class="bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between gap-4 border border-gray-700 dark:border-gray-200">\r
          <div class="font-bold whitespace-nowrap">\r
            <span class="badge badge-primary mr-2">{{ selectedIds().size }}</span> seleccionados\r
          </div>\r
          <div class="flex items-center gap-2">\r
            <button (click)="openBulkEdit()" class="btn btn-sm btn-ghost hover:bg-white/20 dark:hover:bg-black/10 text-white dark:text-gray-900 whitespace-nowrap">\r
              <i class="fas fa-pen mr-1.5"></i> Editar\r
            </button>\r
            <button (click)="openBulkDelete()" class="btn btn-sm btn-ghost hover:bg-error/30 text-error whitespace-nowrap">\r
              <i class="fas fa-trash-alt mr-1.5"></i> Eliminar\r
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
                  <input type="checkbox" class="checkbox checkbox-sm checkbox-primary"\r
                    [checked]="isAllSelected()"\r
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
                      <input type="checkbox" class="checkbox checkbox-sm checkbox-primary"\r
                        [checked]="selectedIds().has(product.id)"\r
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
                          @if(product.brand_id) {\r
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
                          <div class="radial-progress text-xs"\r
                            [class.text-success]="!product.stock || product.stock > 10"\r
                            [class.text-warning]="product.stock && product.stock <= 10 && product.stock > 0"\r
                            [class.text-error]="product.stock === 0"\r
                            [style.--value]="product.stock ? (product.stock > 100 ? 100 : product.stock) : 0"\r
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
                  <input type="checkbox" class="checkbox checkbox-sm checkbox-primary"\r
                    [checked]="isAllSelected()"\r
                    (change)="toggleSelectAll()" />\r
                    <span class="label-text font-bold">Seleccionar Todo en p\xE1gina</span>\r
                  </label>\r
                </div>\r
\r
                @for (product of paginatedProducts(); track product.id) {\r
                  <div class="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"\r
                    [class.ring-2]="selectedIds().has(product.id)"\r
                    [class.ring-indigo-500]="selectedIds().has(product.id)">\r
                    <div class="card-body p-4 flex-row items-start gap-4">\r
                      <!-- Checkbox -->\r
                      <input type="checkbox" class="checkbox checkbox-primary mt-1"\r
                        [checked]="selectedIds().has(product.id)"\r
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
                @if (paginatedProducts().length > 0) {\r
                  <div class="mt-8 flex justify-center pb-8">\r
                    <pagination [pages]="totalPages()" [currentPage]="currentPage()" />\r
                  </div>\r
                }\r
\r
              }\r
            </div>\r
\r
            <app-bulk-edit-modal\r
              [(isOpen)]="isBulkModalOpen"\r
              [selectedIds]="selectedIdsList()"\r
              [brands]="brands()"\r
              [categories]="categories()"\r
              [initialTab]="bulkInitialTab()"\r
              (onSuccess)="onBulkEditSuccess()">\r
            </app-bulk-edit-modal>\r
\r
            <!-- IMPORT PROGRESS OVERLAY -->\r
            @if (importing()) {\r
              <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">\r
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm text-center">\r
                  <span class="loading loading-spinner loading-lg text-primary"></span>\r
                  <p class="font-bold text-lg">Procesando importaci\xF3n\u2026</p>\r
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ importProgress() }}</p>\r
                  <p class="text-xs text-gray-400">No cierres esta ventana.</p>\r
                </div>\r
              </div>\r
            }\r
\r
            <!-- IMPORT RESULT MODAL -->\r
            @if (showImportResult() && importReport()) {\r
              <app-import-result-modal\r
                [report]="importReport()!"\r
                (close)="onImportResultClose()">\r
              </app-import-result-modal>\r
            }\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminProductsPage, { className: "AdminProductsPage", filePath: "src/app/admin/products/admin-products-page.ts", lineNumber: 21 });
})();
export {
  AdminProductsPage
};
//# sourceMappingURL=chunk-GTW7GILK.js.map
