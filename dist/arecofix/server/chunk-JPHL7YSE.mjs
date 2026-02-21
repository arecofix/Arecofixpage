import './polyfills.server.mjs';
import {
  RepairRepository
} from "./chunk-F566A5UU.mjs";
import {
  AuthService
} from "./chunk-ZWWV2735.mjs";
import {
  CheckboxControlValueAccessor,
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
} from "./chunk-Q3DS2EHQ.mjs";
import "./chunk-7NQOFK7J.mjs";
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  CommonModule,
  DatePipe,
  DecimalPipe,
  Router,
  RouterLink
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
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
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CGATP5QV.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/core/services/company.service.ts
var CompanyService = class _CompanyService {
  auth = inject(AuthService);
  supabase = this.auth.getSupabaseClient();
  async getSettings() {
    const { data, error } = await this.supabase.from("company_settings").select("*").maybeSingle();
    if (error)
      throw error;
    return data;
  }
  static \u0275fac = function CompanyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CompanyService, factory: _CompanyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/repairs/domain/entities/repair.entity.ts
var RepairStatus;
(function(RepairStatus2) {
  RepairStatus2["PENDING"] = "pending";
  RepairStatus2["IN_PROGRESS"] = "in_progress";
  RepairStatus2["WAITING_PARTS"] = "waiting_parts";
  RepairStatus2["COMPLETED"] = "completed";
  RepairStatus2["DELIVERED"] = "delivered";
  RepairStatus2["CANCELLED"] = "cancelled";
})(RepairStatus || (RepairStatus = {}));

// src/app/features/repairs/application/services/admin-repair.service.ts
var AdminRepairService = class _AdminRepairService {
  repository = inject(RepairRepository);
  async getById(id) {
    return firstValueFrom(this.repository.getById(id));
  }
  async create(dto) {
    const payload = __spreadValues({}, dto);
    if (!payload.tracking_code) {
      payload.tracking_code = this.generateTrackingCode();
    }
    if (this.isFinalStatus(payload.status)) {
      payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    return firstValueFrom(this.repository.create(payload));
  }
  async update(id, dto) {
    const payload = __spreadValues({}, dto);
    if (payload.status && this.isFinalStatus(payload.status)) {
      payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    await firstValueFrom(this.repository.update(id, payload));
  }
  async uploadImage(file) {
    return this.repository.uploadImage(file);
  }
  generateTrackingCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  isFinalStatus(status) {
    return status === RepairStatus.COMPLETED || status === RepairStatus.DELIVERED;
  }
  static \u0275fac = function AdminRepairService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminRepairService, factory: _AdminRepairService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/admin/repairs/admin-repair-form-page.ts
function AdminRepairFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "span", 50);
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275element(1, "span", 104);
    \u0275\u0275text(2, " Subiendo im\xE1genes... ");
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 105);
    \u0275\u0275element(1, "img", 106);
    \u0275\u0275elementStart(2, "button", 107);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template_button_click_2_listener() {
      const \u0275$index_100_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeImage(\u0275$index_100_r4));
    });
    \u0275\u0275element(3, "i", 108);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const img_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", img_r5, \u0275\u0275sanitizeUrl);
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68);
    \u0275\u0275repeaterCreate(1, AdminRepairFormPage_Conditional_9_Conditional_38_For_2_Template, 4, 1, "div", 105, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.form().images);
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_130_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 97);
    \u0275\u0275element(1, "i", 109);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_132_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 110);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Conditional_132_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.shareWhatsApp());
    });
    \u0275\u0275element(1, "i", 111);
    \u0275\u0275text(2, " Compartir ");
    \u0275\u0275elementEnd();
  }
}
function AdminRepairFormPage_Conditional_9_Conditional_139_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 104);
  }
}
function AdminRepairFormPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 51);
    \u0275\u0275listener("ngSubmit", function AdminRepairFormPage_Conditional_9_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(1, "div", 52)(2, "div", 53)(3, "label", 54)(4, "span", 55);
    \u0275\u0275text(5, "Nombre del Cliente");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "label", 56);
    \u0275\u0275element(7, "i", 57);
    \u0275\u0275elementStart(8, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().customer_name, $event) || (ctx_r1.form().customer_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 53)(10, "label", 54)(11, "span", 55);
    \u0275\u0275text(12, "Tel\xE9fono");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "label", 56);
    \u0275\u0275element(14, "i", 59);
    \u0275\u0275elementStart(15, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().customer_phone, $event) || (ctx_r1.form().customer_phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 52)(17, "div", 53)(18, "label", 54)(19, "span", 55);
    \u0275\u0275text(20, "Modelo del Dispositivo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "label", 56);
    \u0275\u0275element(22, "i", 61);
    \u0275\u0275elementStart(23, "input", 62);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().device_model, $event) || (ctx_r1.form().device_model = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 53)(25, "label", 54)(26, "span", 55);
    \u0275\u0275text(27, "IMEI / Serie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "label", 56);
    \u0275\u0275element(29, "i", 63);
    \u0275\u0275elementStart(30, "input", 64);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().imei, $event) || (ctx_r1.form().imei = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 53)(32, "label", 54)(33, "span", 55);
    \u0275\u0275text(34, "Im\xE1genes del Equipo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 65)(36, "input", 66);
    \u0275\u0275listener("change", function AdminRepairFormPage_Conditional_9_Template_input_change_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, AdminRepairFormPage_Conditional_9_Conditional_37_Template, 3, 0, "div", 67);
    \u0275\u0275conditionalCreate(38, AdminRepairFormPage_Conditional_9_Conditional_38_Template, 3, 0, "div", 68);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 53)(40, "label", 54)(41, "span", 55);
    \u0275\u0275text(42, "Descripci\xF3n del Problema");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "textarea", 69);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_textarea_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().issue_description, $event) || (ctx_r1.form().issue_description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 70);
    \u0275\u0275text(45, "Detalles del Equipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 53)(47, "label", 54)(48, "span", 55);
    \u0275\u0275text(49, "Accesorios Recibidos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 71)(51, "label", 72)(52, "input", 73);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_52_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.charger, $event) || (ctx_r1.form().checklist.charger = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 74);
    \u0275\u0275text(54, "Cargador");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "label", 72)(56, "input", 75);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_56_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.battery, $event) || (ctx_r1.form().checklist.battery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span", 74);
    \u0275\u0275text(58, "Bater\xEDa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "label", 72)(60, "input", 76);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_60_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.chip, $event) || (ctx_r1.form().checklist.chip = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "span", 74);
    \u0275\u0275text(62, "Chip");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "label", 72)(64, "input", 77);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_64_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.sd, $event) || (ctx_r1.form().checklist.sd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "span", 74);
    \u0275\u0275text(66, "Tarjeta SD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "label", 72)(68, "input", 78);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_68_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().checklist.case, $event) || (ctx_r1.form().checklist.case = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "span", 74);
    \u0275\u0275text(70, "Funda");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(71, "div", 52)(72, "div", 53)(73, "label", 54)(74, "span", 55);
    \u0275\u0275text(75, "PIN / Contrase\xF1a");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "label", 56);
    \u0275\u0275element(77, "i", 79);
    \u0275\u0275elementStart(78, "input", 80);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_78_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().security_pin, $event) || (ctx_r1.form().security_pin = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(79, "div", 53)(80, "label", 54)(81, "span", 55);
    \u0275\u0275text(82, "Patr\xF3n de Desbloqueo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "label", 56);
    \u0275\u0275element(84, "i", 81);
    \u0275\u0275elementStart(85, "input", 82);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_85_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().security_pattern, $event) || (ctx_r1.form().security_pattern = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(86, "div", 70);
    \u0275\u0275text(87, "Estado y Costos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 83)(89, "div", 53)(90, "label", 54)(91, "span", 55);
    \u0275\u0275text(92, "Estado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(93, "select", 84);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_select_ngModelChange_93_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().status, $event) || (ctx_r1.form().status = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(94, "option", 85);
    \u0275\u0275text(95, "Pendiente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "option", 86);
    \u0275\u0275text(97, "En Progreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "option", 87);
    \u0275\u0275text(99, "Completado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "option", 88);
    \u0275\u0275text(101, "Entregado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "option", 89);
    \u0275\u0275text(103, "Cancelado");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(104, "div", 53)(105, "label", 54)(106, "span", 55);
    \u0275\u0275text(107, "Costo Estimado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "label", 56);
    \u0275\u0275element(109, "i", 90);
    \u0275\u0275elementStart(110, "input", 91);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_110_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().estimated_cost, $event) || (ctx_r1.form().estimated_cost = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(111, "div", 53)(112, "label", 54)(113, "span", 55);
    \u0275\u0275text(114, "Se\xF1a / Adelanto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(115, "label", 56);
    \u0275\u0275element(116, "i", 92);
    \u0275\u0275elementStart(117, "input", 93);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_117_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().deposit_amount, $event) || (ctx_r1.form().deposit_amount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(118, "div", 53)(119, "label", 54)(120, "span", 55);
    \u0275\u0275text(121, "Costo Final");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(122, "label", 56);
    \u0275\u0275element(123, "i", 94);
    \u0275\u0275elementStart(124, "input", 95);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_input_ngModelChange_124_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().final_cost, $event) || (ctx_r1.form().final_cost = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(125, "div", 53)(126, "label", 54)(127, "span", 55);
    \u0275\u0275text(128, "Notas del T\xE9cnico (Interno)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(129, "textarea", 96);
    \u0275\u0275twoWayListener("ngModelChange", function AdminRepairFormPage_Conditional_9_Template_textarea_ngModelChange_129_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().technician_notes, $event) || (ctx_r1.form().technician_notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(130, AdminRepairFormPage_Conditional_9_Conditional_130_Template, 4, 1, "div", 97);
    \u0275\u0275elementStart(131, "div", 98);
    \u0275\u0275conditionalCreate(132, AdminRepairFormPage_Conditional_9_Conditional_132_Template, 3, 0, "button", 99);
    \u0275\u0275elementStart(133, "button", 100);
    \u0275\u0275listener("click", function AdminRepairFormPage_Conditional_9_Template_button_click_133_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.printOrder());
    });
    \u0275\u0275element(134, "i", 101);
    \u0275\u0275text(135, " Imprimir Orden ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "a", 102);
    \u0275\u0275text(137, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "button", 103);
    \u0275\u0275conditionalCreate(139, AdminRepairFormPage_Conditional_9_Conditional_139_Template, 1, 0, "span", 104);
    \u0275\u0275text(140, " Guardar Reparaci\xF3n ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().customer_name);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().customer_phone);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().device_model);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().imei);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.uploadingImages());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.uploadingImages() ? 37 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.form().images.length > 0 ? 38 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().issue_description);
    \u0275\u0275advance(8);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.charger)("border-primary", ctx_r1.form().checklist.charger)("text-primary", ctx_r1.form().checklist.charger)("bg-gray-100", !ctx_r1.form().checklist.charger)("border-gray-300", !ctx_r1.form().checklist.charger)("text-gray-700", !ctx_r1.form().checklist.charger);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.charger);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.battery)("border-primary", ctx_r1.form().checklist.battery)("text-primary", ctx_r1.form().checklist.battery)("bg-gray-100", !ctx_r1.form().checklist.battery)("border-gray-300", !ctx_r1.form().checklist.battery)("text-gray-700", !ctx_r1.form().checklist.battery);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.battery);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.chip)("border-primary", ctx_r1.form().checklist.chip)("text-primary", ctx_r1.form().checklist.chip)("bg-gray-100", !ctx_r1.form().checklist.chip)("border-gray-300", !ctx_r1.form().checklist.chip)("text-gray-700", !ctx_r1.form().checklist.chip);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.chip);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.sd)("border-primary", ctx_r1.form().checklist.sd)("text-primary", ctx_r1.form().checklist.sd)("bg-gray-100", !ctx_r1.form().checklist.sd)("border-gray-300", !ctx_r1.form().checklist.sd)("text-gray-700", !ctx_r1.form().checklist.sd);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.sd);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bg-primary-content", ctx_r1.form().checklist.case)("border-primary", ctx_r1.form().checklist.case)("text-primary", ctx_r1.form().checklist.case)("bg-gray-100", !ctx_r1.form().checklist.case)("border-gray-300", !ctx_r1.form().checklist.case)("text-gray-700", !ctx_r1.form().checklist.case);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().checklist.case);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().security_pin);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().security_pattern);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().status);
    \u0275\u0275advance(17);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().estimated_cost);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().deposit_amount);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().final_cost);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().technician_notes);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 130 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.id && ctx_r1.form().tracking_code ? 132 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving());
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.saving() || !ctx_r1.form().customer_name || !ctx_r1.form().device_model);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.saving() ? 139 : -1);
  }
}
function AdminRepairFormPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.company().logo_url, \u0275\u0275sanitizeUrl);
  }
}
var AdminRepairFormPage = class _AdminRepairFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  companyService = inject(CompanyService);
  repairService = inject(AdminRepairService);
  id = null;
  date = /* @__PURE__ */ new Date();
  // Initial form state matching entity structure
  initialFormState = {
    customer_name: "",
    customer_phone: "",
    device_model: "",
    device_type: "smartphone",
    // Default
    device_brand: "generic",
    // Default
    imei: "",
    issue_description: "",
    status: RepairStatus.PENDING,
    estimated_cost: 0,
    final_cost: 0,
    technician_notes: "",
    checklist: {
      charger: false,
      battery: false,
      chip: false,
      sd: false,
      case: false
    },
    security_pin: "",
    security_pattern: "",
    deposit_amount: 0,
    tracking_code: "",
    repair_number: 0,
    images: []
  };
  form = signal(__spreadValues({}, this.initialFormState), ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  company = signal(null, ...ngDevMode ? [{ debugName: "company" }] : []);
  uploadingImages = signal(false, ...ngDevMode ? [{ debugName: "uploadingImages" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    await this.loadCompanySettings();
    if (this.id) {
      await this.loadRepair();
    }
    this.loading.set(false);
  }
  async onFileSelected(event) {
    const input = event.target;
    const files = input.files;
    if (!files || files.length === 0)
      return;
    this.uploadingImages.set(true);
    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const url = await this.repairService.uploadImage(file);
          uploadedUrls.push(url);
        }
      }
      this.form.update((f) => __spreadProps(__spreadValues({}, f), {
        images: [...f.images, ...uploadedUrls]
      }));
    } catch (e) {
      console.error("Error uploading images:", e);
      const message = e instanceof Error ? e.message : "Unknown error";
      this.error.set("Error al subir im\xE1genes: " + message);
    } finally {
      this.uploadingImages.set(false);
      input.value = "";
    }
  }
  removeImage(index) {
    this.form.update((f) => {
      const newImages = [...f.images];
      newImages.splice(index, 1);
      return __spreadProps(__spreadValues({}, f), { images: newImages });
    });
  }
  async loadCompanySettings() {
    try {
      const data = await this.companyService.getSettings();
      if (data) {
        this.company.set(data);
      }
    } catch (error) {
      console.error("Error loading company settings", error);
    }
  }
  async loadRepair() {
    if (!this.id)
      return;
    try {
      const data = await this.repairService.getById(this.id);
      if (data) {
        this.form.set({
          customer_name: data.customer_name || "",
          customer_phone: data.customer_phone || "",
          device_model: data.device_model || "",
          device_type: data.device_type || "smartphone",
          device_brand: data.device_brand || "generic",
          imei: data.imei || "",
          issue_description: data.issue_description || "",
          status: data.status,
          estimated_cost: data.estimated_cost || 0,
          final_cost: data.final_cost || 0,
          technician_notes: data.technician_notes || "",
          checklist: data.checklist || this.initialFormState.checklist,
          security_pin: data.security_pin || "",
          security_pattern: data.security_pattern || "",
          deposit_amount: data.deposit_amount || 0,
          tracking_code: data.tracking_code,
          repair_number: data.repair_number || 0,
          images: data.images || []
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      this.error.set("Error cargando reparaci\xF3n: " + message);
    }
  }
  async save() {
    this.saving.set(true);
    this.error.set(null);
    try {
      const formData = this.form();
      const baseDto = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        device_model: formData.device_model,
        device_type: formData.device_type,
        device_brand: formData.device_brand,
        imei: formData.imei,
        issue_description: formData.issue_description,
        estimated_cost: formData.estimated_cost,
        notes: "",
        // Optional notes field
        images: formData.images,
        checklist: formData.checklist,
        security_pin: formData.security_pin,
        security_pattern: formData.security_pattern
      };
      const extendedDto = __spreadProps(__spreadValues({}, baseDto), {
        status: formData.status,
        final_cost: formData.final_cost,
        technician_notes: formData.technician_notes,
        deposit_amount: formData.deposit_amount,
        tracking_code: formData.tracking_code
      });
      if (this.id) {
        await this.repairService.update(this.id, extendedDto);
      } else {
        await this.repairService.create(extendedDto);
      }
      this.router.navigate(["/admin/repairs"]);
    } catch (e) {
      console.error("Error saving repair:", e);
      const message = e.message || e.error_description || (e instanceof Error ? e.message : "Unknown error");
      this.error.set(message);
    } finally {
      this.saving.set(false);
    }
  }
  printOrder() {
    document.body.classList.add("printing-repair-order");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-repair-order");
    }, 100);
  }
  shareWhatsApp() {
    if (!this.form().tracking_code)
      return;
    const customerName = this.form().customer_name;
    const device = this.form().device_model;
    const url = `${window.location.origin}/#/tracking/${this.form().tracking_code}`;
    let message = `Hola ${customerName}, tu ${device} est\xE1 en reparaci\xF3n. Pod\xE9s seguir el estado en tiempo real aqu\xED: ${url}`;
    if (this.form().status === RepairStatus.COMPLETED) {
      const reviewLink = environment.contact.socialMedia.googleMaps;
      message = `Hola ${customerName}, su reparaci\xF3n del ${device} ya est\xE1 lista. Agradecemos su rese\xF1a en el siguiente enlace: ${reviewLink}`;
    }
    const whatsappUrl = `https://wa.me/${this.form().customer_phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
  static \u0275fac = function AdminRepairFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminRepairFormPage, selectors: [["app-admin-repair-form-page"]], decls: 163, vars: 42, consts: [[1, "container", "mx-auto", "p-4", "max-w-5xl", "no-print"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/repairs", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "card", "bg-base-100", "shadow-lg"], [1, "card-body", "p-6"], [1, "flex", "justify-center", "py-12"], [1, "space-y-6"], [1, "print-container", "font-sans", "text-xs", "leading-tight", "hidden"], [1, "flex", "flex-col", "h-full"], [1, "w-full", "pb-4", "border-b-2", "border-dashed", "border-gray-400", "mb-4", "flex", "flex-col"], [1, "flex", "justify-between", "items-start", "mb-2", "border-b", "border-gray-300", "pb-2"], [1, "flex", "items-center"], ["alt", "Logo", 1, "h-10", "w-auto", "mr-3", "object-contain", 3, "src"], [1, "text-lg", "font-bold", "uppercase", "mb-0"], [1, "text-[9px]", "text-gray-600"], [1, "text-right"], [1, "font-bold", "text-base", "text-green-700", "uppercase"], [1, "text-[9px]", "text-gray-600", "leading-tight"], [1, "grid", "grid-cols-2", "gap-3", "mb-2", "grow"], [1, "flex", "flex-col", "gap-2"], [1, "border", "border-gray-300", "rounded", "p-1"], [1, "font-bold", "bg-gray-100", "px-1", "text-[9px]", "mb-0.5"], [1, "px-1", "text-[9px]"], [1, "flex", "justify-between"], [1, "font-bold"], [1, "truncate", "ml-1"], [1, "border-t", "border-gray-200", "my-0.5"], [1, "mt-1", "pt-1", "border-t", "border-gray-200"], [1, "grid", "grid-cols-3", "gap-0.5", "text-[8px]"], [1, "flex", "justify-between", "border-t", "border-gray-300", "pt-0.5", "mt-0.5", "font-bold"], [1, "border", "border-gray-300", "rounded", "p-1", "grow"], [1, "px-1", "text-[9px]", "h-full", "overflow-hidden", "leading-tight"], [1, "mt-auto"], [1, "flex", "justify-between", "items-end", "text-[9px]"], [1, "w-5/12", "text-center", "border-t", "border-black", "pt-1"], [1, "w-full", "pt-2", "flex", "flex-col", "justify-between"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-center", "mb-3"], [1, "font-bold", "text-xs", "uppercase", "border-b", "border-black", "pb-1", "mb-1"], [1, "text-[10px]", "font-bold", "truncate"], [1, "mb-3"], [1, "text-sm", "font-bold", "mb-0.5", "text-center", "border", "border-gray-300", "rounded", "bg-gray-50"], [1, "text-[9px]", "text-center", "text-gray-600"], [1, "space-y-2"], [1, "text-[9px]"], [1, "mt-2", "pt-2", "border-t", "border-gray-300"], [1, "text-[8px]", "text-gray-500", "text-justify", "leading-tight", "mb-2"], [1, "text-center", "font-bold", "text-[10px]"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "space-y-6", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium"], [1, "input", "input-bordered", "flex", "items-center", "gap-2"], [1, "fas", "fa-user", "text-gray-400"], ["type", "text", "name", "customer_name", "required", "", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-phone", "text-gray-400"], ["type", "tel", "name", "customer_phone", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-mobile-alt", "text-gray-400"], ["type", "text", "name", "device_model", "required", "", "placeholder", "Ej: iPhone 11, Samsung A52...", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-barcode", "text-gray-400"], ["type", "text", "name", "imei", "placeholder", "Opcional", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "gap-4"], ["type", "file", "multiple", "", "accept", "image/*", 1, "file-input", "file-input-bordered", "w-full", 3, "change", "disabled"], [1, "flex", "items-center", "gap-2", "text-sm", "text-gray-500"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], ["name", "issue_description", "placeholder", "Describe la falla reportada por el cliente...", 1, "textarea", "textarea-bordered", "h-24", "leading-relaxed", 3, "ngModelChange", "ngModel"], [1, "divider", "text-sm", "font-medium", "text-gray-500"], [1, "flex", "flex-wrap", "gap-3"], [1, "cursor-pointer", "select-none", "transition-all", "duration-200", "border", "rounded-lg", "px-4", "py-2", "flex", "items-center", "gap-3", "hover:bg-gray-200"], ["type", "checkbox", "name", "check_charger", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], [1, "font-medium"], ["type", "checkbox", "name", "check_battery", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_chip", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_sd", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], ["type", "checkbox", "name", "check_case", 1, "checkbox", "checkbox-primary", "checkbox-sm", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-lock", "text-gray-400"], ["type", "text", "name", "security_pin", "placeholder", "1234", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-draw-polygon", "text-gray-400"], ["type", "text", "name", "security_pattern", "placeholder", "Descripci\xF3n del patr\xF3n (ej: Z, L, etc)", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-6"], ["name", "status", 1, "select", "select-bordered", "w-full", 3, "ngModelChange", "ngModel"], ["value", "pending"], ["value", "in_progress"], ["value", "completed"], ["value", "delivered"], ["value", "cancelled"], [1, "fas", "fa-dollar-sign", "text-gray-400"], ["type", "number", "name", "estimated_cost", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-hand-holding-usd", "text-gray-400"], ["type", "number", "name", "deposit_amount", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-cash-register", "text-gray-400"], ["type", "number", "name", "final_cost", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], ["name", "technician_notes", "placeholder", "Detalles de la reparaci\xF3n realizada...", 1, "textarea", "textarea-bordered", "h-24", "leading-relaxed", 3, "ngModelChange", "ngModel"], [1, "alert", "alert-error", "mb-6", "shadow-sm"], [1, "flex", "flex-col", "sm:flex-row", "justify-end", "gap-4", "pt-6", "border-t", "border-base-200"], ["type", "button", 1, "btn", "bg-green-600", "hover:bg-green-700", "text-white", "border-none", "w-full", "sm:w-auto"], ["type", "button", 1, "btn", "btn-outline", "w-full", "sm:w-auto", 3, "click", "disabled"], [1, "fas", "fa-print", "mr-2"], ["routerLink", "/admin/repairs", 1, "btn", "btn-error", "text-white", "w-full", "sm:w-auto"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "sm:w-auto", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs"], [1, "relative", "group", "aspect-square", "bg-base-200", "rounded-lg", "overflow-hidden", "border", "border-base-300"], ["alt", "Repair image", 1, "w-full", "h-full", "object-cover", 3, "src"], ["type", "button", 1, "absolute", "top-1", "right-1", "btn", "btn-circle", "btn-xs", "btn-error", "opacity-0", "group-hover:opacity-100", "transition-opacity", 3, "click"], [1, "fas", "fa-times"], [1, "fas", "fa-exclamation-circle"], ["type", "button", 1, "btn", "bg-green-600", "hover:bg-green-700", "text-white", "border-none", "w-full", "sm:w-auto", 3, "click"], [1, "fab", "fa-whatsapp", "mr-2"]], template: function AdminRepairFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "a", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5)(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminRepairFormPage_Conditional_8_Template, 2, 0, "div", 7)(9, AdminRepairFormPage_Conditional_9_Template, 141, 85, "form", 8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 9)(11, "div", 10)(12, "div", 11)(13, "div", 12)(14, "div", 13);
      \u0275\u0275conditionalCreate(15, AdminRepairFormPage_Conditional_15_Template, 1, 1, "img", 14);
      \u0275\u0275elementStart(16, "div")(17, "h1", 15);
      \u0275\u0275text(18);
      \u0275\u0275pipe(19, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 16)(21, "span");
      \u0275\u0275text(22);
      \u0275\u0275pipe(23, "date");
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " | ");
      \u0275\u0275elementStart(25, "span");
      \u0275\u0275text(26);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(27, "div", 17)(28, "h2", 18);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 19)(31, "p");
      \u0275\u0275text(32);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "p");
      \u0275\u0275text(34);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(35, "div", 20)(36, "div", 21)(37, "div", 22)(38, "h3", 23);
      \u0275\u0275text(39, "CLIENTE & EQUIPO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 24)(41, "div", 25)(42, "span", 26);
      \u0275\u0275text(43, "Nombre:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "span", 27);
      \u0275\u0275text(45);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "div", 25)(47, "span", 26);
      \u0275\u0275text(48, "Tel:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 27);
      \u0275\u0275text(50);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(51, "div", 28);
      \u0275\u0275elementStart(52, "div", 25)(53, "span", 26);
      \u0275\u0275text(54, "Modelo:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "span", 27);
      \u0275\u0275text(56);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "div", 25)(58, "span", 26);
      \u0275\u0275text(59, "IMEI:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "span", 27);
      \u0275\u0275text(61);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(62, "div", 22)(63, "h3", 23);
      \u0275\u0275text(64, "SEGURIDAD");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "div", 24)(66, "div", 25)(67, "span", 26);
      \u0275\u0275text(68, "PIN:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "span");
      \u0275\u0275text(70);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(71, "div", 25)(72, "span", 26);
      \u0275\u0275text(73, "Patr\xF3n:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "span");
      \u0275\u0275text(75);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(76, "div", 29)(77, "div", 30)(78, "span");
      \u0275\u0275text(79);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "span");
      \u0275\u0275text(81);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "span");
      \u0275\u0275text(83);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "span");
      \u0275\u0275text(85);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "span");
      \u0275\u0275text(87);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(88, "div", 21)(89, "div", 22)(90, "h3", 23);
      \u0275\u0275text(91, "PRECIOS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "div", 24)(93, "div", 25)(94, "span", 26);
      \u0275\u0275text(95, "Presupuesto:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "span");
      \u0275\u0275text(97);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(98, "div", 25)(99, "span", 26);
      \u0275\u0275text(100, "Se\xF1a:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(101, "span");
      \u0275\u0275text(102);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(103, "div", 31)(104, "span");
      \u0275\u0275text(105, "Total:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(106, "span");
      \u0275\u0275text(107);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(108, "div", 32)(109, "h3", 23);
      \u0275\u0275text(110, "FALLA / NOTAS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(111, "div", 33);
      \u0275\u0275text(112);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(113, "hr")(114, "br");
      \u0275\u0275elementStart(115, "div", 34)(116, "div", 35)(117, "div", 36);
      \u0275\u0275text(118, "FIRMA CLIENTE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(119, "div", 36);
      \u0275\u0275text(120, "FIRMA T\xC9CNICO");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(121, "div", 37)(122, "div", 38)(123, "div")(124, "div", 39)(125, "h2", 40);
      \u0275\u0275text(126, "TAL\xD3N DE RETIRO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(127, "div", 41);
      \u0275\u0275text(128);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(129, "div", 42)(130, "div", 43);
      \u0275\u0275text(131);
      \u0275\u0275pipe(132, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(133, "div", 44);
      \u0275\u0275text(134);
      \u0275\u0275pipe(135, "date");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(136, "div", 45)(137, "div", 22)(138, "div", 46)(139, "div", 25)(140, "span", 26);
      \u0275\u0275text(141, "Cliente:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(142, "span", 27);
      \u0275\u0275text(143);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(144, "div", 25)(145, "span", 26);
      \u0275\u0275text(146, "Equipo:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(147, "span", 27);
      \u0275\u0275text(148);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(149, "div", 22)(150, "div", 46)(151, "div", 25)(152, "span", 26);
      \u0275\u0275text(153, "Presupuesto:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(154, "span");
      \u0275\u0275text(155);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(156, "div", 25);
      \u0275\u0275element(157, "span", 26);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(158, "div", 47)(159, "div", 48);
      \u0275\u0275text(160, " CONDICIONES: La empresa no se responsabiliza por la p\xE9rdida de informaci\xF3n. Pasados los 90 d\xEDas el equipo se considerar\xE1 abandonado. La garant\xEDa cubre \xFAnicamente la reparaci\xF3n realizada y por un plazo de 30 d\xEDas. No cubre da\xF1os por mal uso, golpes o humedad. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(161, "div", 49);
      \u0275\u0275text(162, " Este tal\xF3n deber\xE1 ser presentado indefectiblemente para retirar el equipo. ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_24_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.id ? "Editar Reparaci\xF3n" : "Nueva Reparaci\xF3n");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.loading() ? 8 : 9);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(((tmp_2_0 = ctx.company()) == null ? null : tmp_2_0.logo_url) ? 15 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("Orden #", \u0275\u0275pipeBind2(19, 30, ctx.form().repair_number, "3.0-0") || "---");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(23, 33, ctx.date, "dd/MM/yyyy"));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("ID: ", ctx.form().tracking_code);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(((tmp_6_0 = ctx.company()) == null ? null : tmp_6_0.name) || "ARECOFIX");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((tmp_7_0 = ctx.company()) == null ? null : tmp_7_0.address);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate((tmp_8_0 = ctx.company()) == null ? null : tmp_8_0.phone);
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate(ctx.form().customer_name);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().customer_phone);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.form().device_model);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().imei);
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.form().security_pin);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().security_pattern);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.charger ? "X" : " ", "] Carg");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.battery ? "X" : " ", "] Bat");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.chip ? "X" : " ", "] Chip");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.sd ? "X" : " ", "] SD");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("[", ctx.form().checklist.case ? "X" : " ", "] Funda");
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate1("$ ", ctx.form().estimated_cost);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$ ", ctx.form().deposit_amount);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$ ", ctx.form().final_cost || ctx.form().estimated_cost);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.form().issue_description, " ");
      \u0275\u0275advance(16);
      \u0275\u0275textInterpolate(((tmp_24_0 = ctx.company()) == null ? null : tmp_24_0.name) || "ARECOFIX");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("#", \u0275\u0275pipeBind2(132, 36, ctx.form().repair_number, "3.0-0") || "---");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(135, 39, ctx.date, "dd/MM/yyyy"));
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.form().customer_name);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.form().device_model);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("$ ", ctx.form().estimated_cost);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink, DecimalPipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-repair-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="container mx-auto p-4 max-w-5xl no-print">\r
    <div class="flex justify-between items-center mb-6">\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar Reparaci\xF3n' : 'Nueva Reparaci\xF3n' }}</h1>\r
        <a routerLink="/admin/repairs" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
    </div>\r
\r
    <div class="card bg-base-100 shadow-lg">\r
        <div class="card-body p-6">\r
            @if (loading()) {\r
            <div class="flex justify-center py-12">\r
                <span class="loading loading-spinner loading-lg text-primary"></span>\r
            </div>\r
            } @else {\r
            <form (ngSubmit)="save()" class="space-y-6">\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <!-- Customer Info -->\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Nombre del Cliente</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-user text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().customer_name" name="customer_name" class="grow" required />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Tel\xE9fono</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-phone text-gray-400"></i>\r
                            <input type="tel" [(ngModel)]="form().customer_phone" name="customer_phone" class="grow" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Device Info -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Modelo del Dispositivo</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-mobile-alt text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().device_model" name="device_model" class="grow" required\r
                                placeholder="Ej: iPhone 11, Samsung A52..." />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">IMEI / Serie</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-barcode text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().imei" name="imei" class="grow" placeholder="Opcional" />\r
                        </label>\r
                    </div>\r
                </div>\r
                \r
                <!-- Images -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Im\xE1genes del Equipo</span>\r
                    </label>\r
                    <div class="flex flex-col gap-4">\r
                        <input type="file" (change)="onFileSelected($event)" multiple accept="image/*" \r
                            class="file-input file-input-bordered w-full" \r
                            [disabled]="uploadingImages()" />\r
                        \r
                        @if (uploadingImages()) {\r
                            <div class="flex items-center gap-2 text-sm text-gray-500">\r
                                <span class="loading loading-spinner loading-xs"></span>\r
                                Subiendo im\xE1genes...\r
                            </div>\r
                        }\r
\r
                        @if (form().images.length > 0) {\r
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
                                @for (img of form().images; track img; let i = $index) {\r
                                    <div class="relative group aspect-square bg-base-200 rounded-lg overflow-hidden border border-base-300">\r
                                        <img [src]="img" class="w-full h-full object-cover" alt="Repair image" />\r
                                        <button type="button" (click)="removeImage(i)" \r
                                            class="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity">\r
                                            <i class="fas fa-times"></i>\r
                                        </button>\r
                                    </div>\r
                                }\r
                            </div>\r
                        }\r
                    </div>\r
                </div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Descripci\xF3n del Problema</span>\r
                    </label>\r
                    <textarea [(ngModel)]="form().issue_description" name="issue_description"\r
                        class="textarea textarea-bordered h-24 leading-relaxed"\r
                        placeholder="Describe la falla reportada por el cliente..."></textarea>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Detalles del Equipo</div>\r
\r
                <!-- Checklist -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Accesorios Recibidos</span>\r
                    </label>\r
                    <div class="flex flex-wrap gap-3">\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.charger"\r
                            [class.border-primary]="form().checklist.charger"\r
                            [class.text-primary]="form().checklist.charger"\r
                            [class.bg-gray-100]="!form().checklist.charger"\r
                            [class.border-gray-300]="!form().checklist.charger"\r
                            [class.text-gray-700]="!form().checklist.charger">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.charger" name="check_charger" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Cargador</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.battery"\r
                            [class.border-primary]="form().checklist.battery"\r
                            [class.text-primary]="form().checklist.battery"\r
                            [class.bg-gray-100]="!form().checklist.battery"\r
                            [class.border-gray-300]="!form().checklist.battery"\r
                            [class.text-gray-700]="!form().checklist.battery">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.battery" name="check_battery" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Bater\xEDa</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.chip"\r
                            [class.border-primary]="form().checklist.chip"\r
                            [class.text-primary]="form().checklist.chip"\r
                            [class.bg-gray-100]="!form().checklist.chip"\r
                            [class.border-gray-300]="!form().checklist.chip"\r
                            [class.text-gray-700]="!form().checklist.chip">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.chip" name="check_chip" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Chip</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.sd"\r
                            [class.border-primary]="form().checklist.sd"\r
                            [class.text-primary]="form().checklist.sd"\r
                            [class.bg-gray-100]="!form().checklist.sd"\r
                            [class.border-gray-300]="!form().checklist.sd"\r
                            [class.text-gray-700]="!form().checklist.sd">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.sd" name="check_sd" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Tarjeta SD</span>\r
                        </label>\r
\r
                        <label class="cursor-pointer select-none transition-all duration-200 border rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-gray-200"\r
                            [class.bg-primary-content]="form().checklist.case"\r
                            [class.border-primary]="form().checklist.case"\r
                            [class.text-primary]="form().checklist.case"\r
                            [class.bg-gray-100]="!form().checklist.case"\r
                            [class.border-gray-300]="!form().checklist.case"\r
                            [class.text-gray-700]="!form().checklist.case">\r
                            <input type="checkbox" [(ngModel)]="form().checklist.case" name="check_case" \r
                                class="checkbox checkbox-primary checkbox-sm" />\r
                            <span class="font-medium">Funda</span>\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Security -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">PIN / Contrase\xF1a</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-lock text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().security_pin" name="security_pin" class="grow" placeholder="1234" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Patr\xF3n de Desbloqueo</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-draw-polygon text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().security_pattern" name="security_pattern" class="grow"\r
                                placeholder="Descripci\xF3n del patr\xF3n (ej: Z, L, etc)" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Estado y Costos</div>\r
\r
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Estado</span>\r
                        </label>\r
                        <select [(ngModel)]="form().status" name="status" class="select select-bordered w-full">\r
                            <option value="pending">Pendiente</option>\r
                            <option value="in_progress">En Progreso</option>\r
                            <option value="completed">Completado</option>\r
                            <option value="delivered">Entregado</option>\r
                            <option value="cancelled">Cancelado</option>\r
                        </select>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Costo Estimado</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-dollar-sign text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().estimated_cost" name="estimated_cost" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Se\xF1a / Adelanto</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-hand-holding-usd text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().deposit_amount" name="deposit_amount" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Costo Final</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-cash-register text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().final_cost" name="final_cost" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Notas del T\xE9cnico (Interno)</span>\r
                    </label>\r
                    <textarea [(ngModel)]="form().technician_notes" name="technician_notes"\r
                        class="textarea textarea-bordered h-24 leading-relaxed"\r
                        placeholder="Detalles de la reparaci\xF3n realizada..."></textarea>\r
                </div>\r
\r
                <!-- Error Message -->\r
                @if (error()) {\r
                <div class="alert alert-error mb-6 shadow-sm">\r
                    <i class="fas fa-exclamation-circle"></i>\r
                    <span>{{ error() }}</span>\r
                </div>\r
                }\r
\r
                <!-- Actions -->\r
                <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-base-200">\r
                    @if (id && form().tracking_code) {\r
                    <button type="button" (click)="shareWhatsApp()"\r
                        class="btn bg-green-600 hover:bg-green-700 text-white border-none w-full sm:w-auto">\r
                        <i class="fab fa-whatsapp mr-2"></i> Compartir\r
                    </button>\r
                    }\r
\r
                    <button type="button" (click)="printOrder()" class="btn btn-outline w-full sm:w-auto"\r
                        [disabled]="saving()">\r
                        <i class="fas fa-print mr-2"></i> Imprimir Orden\r
                    </button>\r
                    <a routerLink="/admin/repairs" class="btn btn-error text-white w-full sm:w-auto">Cancelar</a>\r
                    <button type="submit" class="btn btn-primary w-full sm:w-auto"\r
                        [disabled]="saving() || !form().customer_name || !form().device_model">\r
                        @if (saving()) {\r
                        <span class="loading loading-spinner loading-xs"></span>\r
                        }\r
                        Guardar Reparaci\xF3n\r
                    </button>\r
                </div>\r
            </form>\r
            }\r
        </div>\r
    </div>\r
</div>\r
\r
<!-- Print Layout (Hidden on screen via CSS, visible on print via CSS) -->\r
<div class="print-container font-sans text-xs leading-tight hidden">\r
    <div class="flex flex-col h-full">\r
        <!-- Main Ticket (Top) -->\r
        <div class="w-full pb-4 border-b-2 border-dashed border-gray-400 mb-4 flex flex-col">\r
            <!-- Header -->\r
            <div class="flex justify-between items-start mb-2 border-b border-gray-300 pb-2">\r
                <div class="flex items-center">\r
                    @if (company()?.logo_url) {\r
                        <img [src]="company().logo_url" alt="Logo" class="h-10 w-auto mr-3 object-contain">\r
                    }\r
                    <div>\r
                        <h1 class="text-lg font-bold uppercase mb-0">Orden #{{ (form().repair_number | number:'3.0-0') || '---' }}</h1>\r
                        <div class="text-[9px] text-gray-600">\r
                            <span>{{ date | date:'dd/MM/yyyy' }}</span> |\r
                            <span>ID: {{ form().tracking_code }}</span>\r
                        </div>\r
                    </div>\r
                </div>\r
                <div class="text-right">\r
                    <h2 class="font-bold text-base text-green-700 uppercase">{{ company()?.name || 'ARECOFIX' }}</h2>\r
                    <div class="text-[9px] text-gray-600 leading-tight">\r
                        <p>{{ company()?.address }}</p>\r
                        <p>{{ company()?.phone }}</p>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- Content Grid (2 Columns) -->\r
            <div class="grid grid-cols-2 gap-3 mb-2 grow">\r
                <!-- Col 1: Customer, Device, Security -->\r
                <div class="flex flex-col gap-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">CLIENTE & EQUIPO</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Nombre:</span> <span class="truncate ml-1">{{ form().customer_name }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Tel:</span> <span class="truncate ml-1">{{ form().customer_phone }}</span></div>\r
                            <div class="border-t border-gray-200 my-0.5"></div>\r
                            <div class="flex justify-between"><span class="font-bold">Modelo:</span> <span class="truncate ml-1">{{ form().device_model }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">IMEI:</span> <span class="truncate ml-1">{{ form().imei }}</span></div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">SEGURIDAD</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">PIN:</span> <span>{{ form().security_pin }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Patr\xF3n:</span> <span>{{ form().security_pattern }}</span></div>\r
                            <div class="mt-1 pt-1 border-t border-gray-200">\r
                                <div class="grid grid-cols-3 gap-0.5 text-[8px]">\r
                                    <span>[{{ form().checklist.charger ? 'X' : ' ' }}] Carg</span>\r
                                    <span>[{{ form().checklist.battery ? 'X' : ' ' }}] Bat</span>\r
                                    <span>[{{ form().checklist.chip ? 'X' : ' ' }}] Chip</span>\r
                                    <span>[{{ form().checklist.sd ? 'X' : ' ' }}] SD</span>\r
                                    <span>[{{ form().checklist.case ? 'X' : ' ' }}] Funda</span>\r
                                </div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
\r
                <!-- Col 2: Costs, Fault -->\r
                <div class="flex flex-col gap-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">PRECIOS</h3>\r
                        <div class="px-1 text-[9px]">\r
                            <div class="flex justify-between">\r
                                <span class="font-bold">Presupuesto:</span>\r
                                <span>$ {{ form().estimated_cost }}</span>\r
                            </div>\r
                            <div class="flex justify-between">\r
                                <span class="font-bold">Se\xF1a:</span>\r
                                <span>$ {{ form().deposit_amount }}</span>\r
                            </div>\r
                            <div class="flex justify-between border-t border-gray-300 pt-0.5 mt-0.5 font-bold">\r
                                <span>Total:</span>\r
                                <span>$ {{ form().final_cost || form().estimated_cost }}</span>\r
                            </div>\r
                        </div>\r
                    </div>\r
                    <div class="border border-gray-300 rounded p-1 grow">\r
                        <h3 class="font-bold bg-gray-100 px-1 text-[9px] mb-0.5">FALLA / NOTAS</h3>\r
                        <div class="px-1 text-[9px] h-full overflow-hidden leading-tight">\r
                            {{ form().issue_description }}\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
            \r
            <hr>\r
            <br>\r
\r
            <div class="mt-auto">\r
                <div class="flex justify-between items-end text-[9px]">\r
                    <div class="w-5/12 text-center border-t border-black pt-1">FIRMA CLIENTE</div>\r
                    <div class="w-5/12 text-center border-t border-black pt-1">FIRMA T\xC9CNICO</div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Stub (Bottom) -->\r
        <div class="w-full pt-2 flex flex-col justify-between">\r
            <div class="grid grid-cols-2 gap-4">\r
                <div>\r
                    <div class="text-center mb-3">\r
                        <h2 class="font-bold text-xs uppercase border-b border-black pb-1 mb-1">TAL\xD3N DE RETIRO</h2>\r
                        <div class="text-[10px] font-bold truncate">{{ company()?.name || 'ARECOFIX' }}</div>\r
                    </div>\r
                    \r
                    <div class="mb-3">\r
                        <div class="text-sm font-bold mb-0.5 text-center border border-gray-300 rounded bg-gray-50">#{{ (form().repair_number | number:'3.0-0') || '---' }}</div>\r
                        <div class="text-[9px] text-center text-gray-600">{{ date | date:'dd/MM/yyyy' }}</div>\r
                    </div>\r
                </div>\r
\r
                <div class="space-y-2">\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <div class="text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Cliente:</span> <span class="truncate ml-1">{{ form().customer_name }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold">Equipo:</span> <span class="truncate ml-1">{{ form().device_model }}</span></div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="border border-gray-300 rounded p-1">\r
                        <div class="text-[9px]">\r
                            <div class="flex justify-between"><span class="font-bold">Presupuesto:</span> <span>$ {{ form().estimated_cost }}</span></div>\r
                            <div class="flex justify-between"><span class="font-bold"></span></div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- Conditions & Footer -->\r
            <div class="mt-2 pt-2 border-t border-gray-300">\r
                <div class="text-[8px] text-gray-500 text-justify leading-tight mb-2">\r
                    CONDICIONES: La empresa no se responsabiliza por la p\xE9rdida de informaci\xF3n. Pasados los 90 d\xEDas el equipo se considerar\xE1 abandonado. La garant\xEDa cubre \xFAnicamente la reparaci\xF3n realizada y por un plazo de 30 d\xEDas. No cubre da\xF1os por mal uso, golpes o humedad.\r
                </div>\r
                <div class="text-center font-bold text-[10px]">\r
                    Este tal\xF3n deber\xE1 ser presentado indefectiblemente para retirar el equipo.\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminRepairFormPage, { className: "AdminRepairFormPage", filePath: "src/app/admin/repairs/admin-repair-form-page.ts", lineNumber: 17 });
})();
export {
  AdminRepairFormPage
};
//# sourceMappingURL=chunk-JPHL7YSE.mjs.map
