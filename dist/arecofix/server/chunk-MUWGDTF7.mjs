import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-ZWWV2735.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
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
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CGATP5QV.mjs";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/company/admin-company-settings-page.ts
function AdminCompanySettingsPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "i", 41);
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
function AdminCompanySettingsPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 42);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.success());
  }
}
function AdminCompanySettingsPage_Conditional_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275element(1, "img", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.form().logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminCompanySettingsPage_Conditional_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 40);
  }
}
var AdminCompanySettingsPage = class _AdminCompanySettingsPage {
  auth = inject(AuthService);
  form = signal({
    id: "",
    name: "",
    owner_name: "",
    ruc: "",
    address: "",
    tax_percentage: 21,
    tax_abbreviation: "IVA",
    email: "",
    phone: "",
    location: "",
    currency: "ARS",
    logo_url: ""
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  success = signal(null, ...ngDevMode ? [{ debugName: "success" }] : []);
  async ngOnInit() {
    await this.loadSettings();
  }
  async loadSettings() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("company_settings").select("*").maybeSingle();
    if (data) {
      this.form.set({
        id: data.id,
        name: data.name,
        owner_name: data.owner_name || "",
        ruc: data.ruc || "",
        address: data.address || "",
        tax_percentage: data.tax_percentage || 21,
        tax_abbreviation: data.tax_abbreviation || "IVA",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        currency: data.currency || "ARS",
        logo_url: data.logo_url || ""
      });
    } else if (error && error.code !== "PGRST116") {
      this.error.set(error.message);
    }
    this.loading.set(false);
  }
  async onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file)
      return;
    const supabase = this.auth.getSupabaseClient();
    const filePath = `company/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("public-assets").upload(filePath, file);
    if (error) {
      this.error.set(error.message);
      return;
    }
    const { data: publicUrl } = supabase.storage.from("public-assets").getPublicUrl(data.path);
    this.form.update((f) => __spreadProps(__spreadValues({}, f), { logo_url: publicUrl.publicUrl }));
  }
  async save() {
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);
    const supabase = this.auth.getSupabaseClient();
    const payload = __spreadValues({}, this.form());
    const _a = payload, { id } = _a, updateData = __objRest(_a, ["id"]);
    try {
      if (id) {
        const { error } = await supabase.from("company_settings").update(updateData).eq("id", id);
        if (error)
          throw error;
      } else {
        const { error } = await supabase.from("company_settings").insert(updateData);
        if (error)
          throw error;
      }
      this.success.set("Configuraci\xF3n guardada correctamente");
      await this.loadSettings();
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function AdminCompanySettingsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCompanySettingsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCompanySettingsPage, selectors: [["app-admin-company-settings-page"]], decls: 99, vars: 15, consts: [[1, "max-w-4xl", "mx-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold"], [1, "card", "bg-base-100", "shadow-lg"], [1, "card-body", "p-6"], [1, "alert", "alert-error", "mb-4", "shadow-sm"], [1, "alert", "alert-success", "mb-4", "shadow-sm"], [1, "space-y-6", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium"], [1, "input", "input-bordered", "flex", "items-center", "gap-2"], [1, "fas", "fa-building", "text-gray-400"], ["type", "text", "name", "name", "required", "", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-user", "text-gray-400"], ["type", "text", "name", "owner_name", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-id-card", "text-gray-400"], ["type", "text", "name", "ruc", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-map-marker-alt", "text-gray-400"], ["type", "text", "name", "address", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-envelope", "text-gray-400"], ["type", "email", "name", "email", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-phone", "text-gray-400"], ["type", "text", "name", "phone", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-globe", "text-gray-400"], ["type", "text", "name", "location", "placeholder", "Ej: Buenos Aires, Argentina", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "divider", "text-sm", "font-medium", "text-gray-500"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "fas", "fa-percent", "text-gray-400"], ["type", "number", "name", "tax_percentage", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-tag", "text-gray-400"], ["type", "text", "name", "tax_abbreviation", "placeholder", "Ej: IVA", 1, "grow", 3, "ngModelChange", "ngModel"], ["name", "currency", 1, "select", "select-bordered", "w-full", 3, "ngModelChange", "ngModel"], ["value", "ARS"], ["value", "USD"], ["type", "file", "accept", "image/*", 1, "file-input", "file-input-bordered", "w-full", 3, "change"], [1, "mt-4", "p-4", "border", "rounded-lg", "bg-base-200", "flex", "justify-center"], [1, "flex", "justify-end", "gap-4", "mt-8", "pt-4", "border-t", "border-base-200"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "fas", "fa-exclamation-circle"], [1, "fas", "fa-check-circle"], ["alt", "Logo preview", 1, "h-32", "object-contain", 3, "src"]], template: function AdminCompanySettingsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Configuraci\xF3n de Empresa");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "div", 4);
      \u0275\u0275conditionalCreate(6, AdminCompanySettingsPage_Conditional_6_Template, 4, 1, "div", 5);
      \u0275\u0275conditionalCreate(7, AdminCompanySettingsPage_Conditional_7_Template, 4, 1, "div", 6);
      \u0275\u0275elementStart(8, "form", 7);
      \u0275\u0275listener("ngSubmit", function AdminCompanySettingsPage_Template_form_ngSubmit_8_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(9, "div", 8)(10, "div", 9)(11, "label", 10)(12, "span", 11);
      \u0275\u0275text(13, "Nombre de la Empresa");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "label", 12);
      \u0275\u0275element(15, "i", 13);
      \u0275\u0275elementStart(16, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().name, $event) || (ctx.form().name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 9)(18, "label", 10)(19, "span", 11);
      \u0275\u0275text(20, "Propietario");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "label", 12);
      \u0275\u0275element(22, "i", 15);
      \u0275\u0275elementStart(23, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().owner_name, $event) || (ctx.form().owner_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(24, "div", 8)(25, "div", 9)(26, "label", 10)(27, "span", 11);
      \u0275\u0275text(28, "RUC / CUIT");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "label", 12);
      \u0275\u0275element(30, "i", 17);
      \u0275\u0275elementStart(31, "input", 18);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().ruc, $event) || (ctx.form().ruc = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(32, "div", 9)(33, "label", 10)(34, "span", 11);
      \u0275\u0275text(35, "Direcci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "label", 12);
      \u0275\u0275element(37, "i", 19);
      \u0275\u0275elementStart(38, "input", 20);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().address, $event) || (ctx.form().address = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(39, "div", 8)(40, "div", 9)(41, "label", 10)(42, "span", 11);
      \u0275\u0275text(43, "Email");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "label", 12);
      \u0275\u0275element(45, "i", 21);
      \u0275\u0275elementStart(46, "input", 22);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_46_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().email, $event) || (ctx.form().email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(47, "div", 9)(48, "label", 10)(49, "span", 11);
      \u0275\u0275text(50, "Tel\xE9fono");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "label", 12);
      \u0275\u0275element(52, "i", 23);
      \u0275\u0275elementStart(53, "input", 24);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().phone, $event) || (ctx.form().phone = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(54, "div", 9)(55, "label", 10)(56, "span", 11);
      \u0275\u0275text(57, "Ubicaci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "label", 12);
      \u0275\u0275element(59, "i", 25);
      \u0275\u0275elementStart(60, "input", 26);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_60_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().location, $event) || (ctx.form().location = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(61, "div", 27);
      \u0275\u0275text(62, "Configuraci\xF3n Fiscal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "div", 28)(64, "div", 9)(65, "label", 10)(66, "span", 11);
      \u0275\u0275text(67, "Porcentaje Impuesto (%)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "label", 12);
      \u0275\u0275element(69, "i", 29);
      \u0275\u0275elementStart(70, "input", 30);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_70_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().tax_percentage, $event) || (ctx.form().tax_percentage = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(71, "div", 9)(72, "label", 10)(73, "span", 11);
      \u0275\u0275text(74, "Abreviatura Impuesto");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "label", 12);
      \u0275\u0275element(76, "i", 31);
      \u0275\u0275elementStart(77, "input", 32);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_77_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().tax_abbreviation, $event) || (ctx.form().tax_abbreviation = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(78, "div", 9)(79, "label", 10)(80, "span", 11);
      \u0275\u0275text(81, "Moneda");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(82, "select", 33);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_select_ngModelChange_82_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().currency, $event) || (ctx.form().currency = $event);
        return $event;
      });
      \u0275\u0275elementStart(83, "option", 34);
      \u0275\u0275text(84, "ARS (Peso Argentino)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "option", 35);
      \u0275\u0275text(86, "USD (D\xF3lar Estadounidense)");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(87, "div", 27);
      \u0275\u0275text(88, "Branding");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "div", 9)(90, "label", 10)(91, "span", 11);
      \u0275\u0275text(92, "Logo de la Empresa");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(93, "input", 36);
      \u0275\u0275listener("change", function AdminCompanySettingsPage_Template_input_change_93_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(94, AdminCompanySettingsPage_Conditional_94_Template, 2, 1, "div", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(95, "div", 38)(96, "button", 39);
      \u0275\u0275conditionalCreate(97, AdminCompanySettingsPage_Conditional_97_Template, 1, 0, "span", 40);
      \u0275\u0275text(98, " Guardar Configuraci\xF3n ");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.error() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.success() ? 7 : -1);
      \u0275\u0275advance(9);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().name);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().owner_name);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().ruc);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().address);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().email);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().phone);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().location);
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().tax_percentage);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().tax_abbreviation);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().currency);
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.form().logo_url ? 94 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 97 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCompanySettingsPage, [{
    type: Component,
    args: [{ selector: "app-admin-company-settings-page", standalone: true, imports: [CommonModule, FormsModule], template: '<div class="max-w-4xl mx-auto">\r\n    <div class="flex justify-between items-center mb-6">\r\n        <h1 class="text-2xl font-bold">Configuraci\xF3n de Empresa</h1>\r\n    </div>\r\n\r\n    <div class="card bg-base-100 shadow-lg">\r\n        <div class="card-body p-6">\r\n            @if (error()) {\r\n            <div class="alert alert-error mb-4 shadow-sm">\r\n                <i class="fas fa-exclamation-circle"></i>\r\n                <span>{{ error() }}</span>\r\n            </div>\r\n            }\r\n            @if (success()) {\r\n            <div class="alert alert-success mb-4 shadow-sm">\r\n                <i class="fas fa-check-circle"></i>\r\n                <span>{{ success() }}</span>\r\n            </div>\r\n            }\r\n\r\n            <form (ngSubmit)="save()" class="space-y-6">\r\n                <!-- Basic Info -->\r\n                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Nombre de la Empresa</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-building text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().name" name="name" class="grow" required />\r\n                        </label>\r\n                    </div>\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Propietario</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-user text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().owner_name" name="owner_name" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">RUC / CUIT</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-id-card text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().ruc" name="ruc" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Direcci\xF3n</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-map-marker-alt text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().address" name="address" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Contact Info -->\r\n                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Email</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-envelope text-gray-400"></i>\r\n                            <input type="email" [(ngModel)]="form().email" name="email" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Tel\xE9fono</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-phone text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().phone" name="phone" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="form-control">\r\n                    <label class="label">\r\n                        <span class="label-text font-medium">Ubicaci\xF3n</span>\r\n                    </label>\r\n                    <label class="input input-bordered flex items-center gap-2">\r\n                        <i class="fas fa-globe text-gray-400"></i>\r\n                        <input type="text" [(ngModel)]="form().location" name="location" class="grow" \r\n                            placeholder="Ej: Buenos Aires, Argentina" />\r\n                    </label>\r\n                </div>\r\n\r\n                <div class="divider text-sm font-medium text-gray-500">Configuraci\xF3n Fiscal</div>\r\n\r\n                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Porcentaje Impuesto (%)</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-percent text-gray-400"></i>\r\n                            <input type="number" [(ngModel)]="form().tax_percentage" name="tax_percentage" class="grow" />\r\n                        </label>\r\n                    </div>\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Abreviatura Impuesto</span>\r\n                        </label>\r\n                        <label class="input input-bordered flex items-center gap-2">\r\n                            <i class="fas fa-tag text-gray-400"></i>\r\n                            <input type="text" [(ngModel)]="form().tax_abbreviation" name="tax_abbreviation" class="grow" \r\n                                placeholder="Ej: IVA" />\r\n                        </label>\r\n                    </div>\r\n                    <div class="form-control">\r\n                        <label class="label">\r\n                            <span class="label-text font-medium">Moneda</span>\r\n                        </label>\r\n                        <select [(ngModel)]="form().currency" name="currency" class="select select-bordered w-full">\r\n                            <option value="ARS">ARS (Peso Argentino)</option>\r\n                            <option value="USD">USD (D\xF3lar Estadounidense)</option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="divider text-sm font-medium text-gray-500">Branding</div>\r\n\r\n                <div class="form-control">\r\n                    <label class="label">\r\n                        <span class="label-text font-medium">Logo de la Empresa</span>\r\n                    </label>\r\n                    <input type="file" (change)="onFileChange($event)" class="file-input file-input-bordered w-full"\r\n                        accept="image/*">\r\n                    @if (form().logo_url) {\r\n                    <div class="mt-4 p-4 border rounded-lg bg-base-200 flex justify-center">\r\n                        <img [src]="form().logo_url" alt="Logo preview" class="h-32 object-contain">\r\n                    </div>\r\n                    }\r\n                </div>\r\n\r\n                <div class="flex justify-end gap-4 mt-8 pt-4 border-t border-base-200">\r\n                    <button type="submit" class="btn btn-primary px-8" [disabled]="saving()">\r\n                        @if (saving()) {\r\n                        <span class="loading loading-spinner"></span>\r\n                        }\r\n                        Guardar Configuraci\xF3n\r\n                    </button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCompanySettingsPage, { className: "AdminCompanySettingsPage", filePath: "src/app/admin/company/admin-company-settings-page.ts", lineNumber: 12 });
})();
export {
  AdminCompanySettingsPage
};
//# sourceMappingURL=chunk-MUWGDTF7.mjs.map
