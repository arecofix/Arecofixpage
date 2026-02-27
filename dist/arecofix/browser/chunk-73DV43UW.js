import {
  AuthService,
  TenantService
} from "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
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
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-ODRBL5CU.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import "./chunk-F32QBW3I.js";
import {
  Component,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DPJFS6PI.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/admin/company/admin-company-settings-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminCompanySettingsPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "i", 61);
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
    \u0275\u0275element(1, "i", 62);
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
function AdminCompanySettingsPage_Conditional_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "img", 63);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.form().logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminCompanySettingsPage_Conditional_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 42);
  }
}
function AdminCompanySettingsPage_For_126_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 64);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td")(6, "button", 65);
    \u0275\u0275listener("click", function AdminCompanySettingsPage_For_126_Template_button_click_6_listener() {
      const branch_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleBranchStatus(branch_r3));
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 49)(9, "button", 66);
    \u0275\u0275listener("click", function AdminCompanySettingsPage_For_126_Template_button_click_9_listener() {
      const branch_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.deleteBranch(branch_r3.id));
    });
    \u0275\u0275element(10, "i", 67);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const branch_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(branch_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(branch_r3.address || "--");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", branch_r3.is_active)("badge-ghost", !branch_r3.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", branch_r3.is_active ? "Activa" : "Inactiva", " ");
  }
}
function AdminCompanySettingsPage_Conditional_127_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 68);
    \u0275\u0275text(2, "No hay sucursales registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminCompanySettingsPage_Conditional_149_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 42);
  }
}
var AdminCompanySettingsPage = class _AdminCompanySettingsPage {
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  form = signal({
    id: "",
    name: "",
    owner_name: "",
    tax_id: "",
    ruc: "CUIT/CUIL",
    // This will keep the display name of the tax id (label)
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
  // Branches Setup
  branches = signal([], ...ngDevMode ? [{ debugName: "branches" }] : []);
  newBranch = signal({ name: "", address: "", is_active: true }, ...ngDevMode ? [{ debugName: "newBranch" }] : []);
  savingBranch = signal(false, ...ngDevMode ? [{ debugName: "savingBranch" }] : []);
  async ngOnInit() {
    await this.loadSettings();
  }
  async loadSettings() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await supabase.from("tenants").select("*").eq("id", tenantId).single();
    if (data) {
      this.form.set({
        id: data.id,
        name: data.name,
        owner_name: data.owner_name || "",
        tax_id: data.tax_id || "",
        ruc: data.tax_id_name || "CUIT/CUIL",
        address: data.location || "",
        tax_percentage: data.tax_percentage || 21,
        tax_abbreviation: data.tax_abbreviation || "IVA",
        email: data.contact_email || "",
        phone: data.contact_phone || "",
        location: data.location || "",
        currency: data.currency || "ARS",
        logo_url: data.branding_settings?.logo_url || ""
      });
    } else if (error && error.code !== "PGRST116") {
      this.error.set(error.message);
    }
    const { data: branchData } = await supabase.from("branches").select("*").eq("tenant_id", tenantId).order("name");
    this.branches.set(branchData || []);
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
    const tenantId = this.tenantService.getTenantId();
    const updateData = {
      name: payload.name,
      owner_name: payload.owner_name,
      tax_id: payload.tax_id,
      tax_id_name: payload.ruc,
      location: payload.address || payload.location,
      tax_percentage: payload.tax_percentage,
      tax_abbreviation: payload.tax_abbreviation,
      contact_email: payload.email,
      contact_phone: payload.phone,
      currency: payload.currency,
      branding_settings: {
        logo_url: payload.logo_url,
        primary_color: "#3b82f6"
      },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const { error } = await supabase.from("tenants").update(updateData).eq("id", tenantId);
      if (error)
        throw error;
      const { data: updatedTenant } = await supabase.from("tenants").select("*").eq("id", tenantId).single();
      if (updatedTenant) {
        this.tenantService.setTenant(updatedTenant);
      }
      this.success.set("Configuraci\xF3n de la empresa guardada correctamente");
      await this.loadSettings();
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  // --- BRANCHES MANAGEMENT ---
  async addBranch() {
    const payload = this.newBranch();
    if (!payload.name) {
      this.error.set("El nombre de la sucursal es obligatorio.");
      return;
    }
    this.savingBranch.set(true);
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();
    try {
      const { error } = await supabase.from("branches").insert([{
        name: payload.name,
        address: payload.address,
        is_active: payload.is_active,
        tenant_id: tenantId
      }]);
      if (error)
        throw error;
      this.success.set("Sucursal agregada con \xE9xito");
      this.newBranch.set({ name: "", address: "", is_active: true });
      await this.loadSettings();
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.savingBranch.set(false);
    }
  }
  async deleteBranch(id) {
    if (!confirm("\xBFSeguro que deseas eliminar esta sucursal?"))
      return;
    const supabase = this.auth.getSupabaseClient();
    try {
      const { error } = await supabase.from("branches").delete().eq("id", id);
      if (error)
        throw error;
      this.success.set("Sucursal eliminada");
      await this.loadSettings();
    } catch (e) {
      this.error.set(e.message);
    }
  }
  async toggleBranchStatus(branch) {
    const supabase = this.auth.getSupabaseClient();
    try {
      const { error } = await supabase.from("branches").update({ is_active: !branch.is_active }).eq("id", branch.id);
      if (error)
        throw error;
      await this.loadSettings();
    } catch (e) {
      this.error.set(e.message);
    }
  }
  static \u0275fac = function AdminCompanySettingsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCompanySettingsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCompanySettingsPage, selectors: [["app-admin-company-settings-page"]], decls: 151, vars: 23, consts: [[1, "max-w-4xl", "mx-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold"], [1, "card", "bg-base-100", "shadow-lg"], [1, "card-body", "p-6"], [1, "alert", "alert-error", "mb-4", "shadow-sm"], [1, "alert", "alert-success", "mb-4", "shadow-sm"], [1, "space-y-6", 3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium"], [1, "input", "input-bordered", "flex", "items-center", "gap-2"], [1, "fas", "fa-building", "text-gray-400"], ["type", "text", "name", "name", "required", "", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-user", "text-gray-400"], ["type", "text", "name", "owner_name", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-id-card", "text-gray-400"], ["type", "text", "name", "tax_id", "placeholder", "Ej: 20-12345678-9", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-map-marker-alt", "text-gray-400"], ["type", "text", "name", "address", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-envelope", "text-gray-400"], ["type", "email", "name", "email", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-phone", "text-gray-400"], ["type", "text", "name", "phone", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-globe", "text-gray-400"], ["type", "text", "name", "location", "placeholder", "Ej: Buenos Aires, Argentina", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "divider", "text-sm", "font-medium", "text-gray-500"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "fas", "fa-percent", "text-gray-400"], ["type", "number", "name", "tax_percentage", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-tag", "text-gray-400"], ["type", "text", "name", "tax_abbreviation", "placeholder", "Ej: IVA", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-fingerprint", "text-gray-400"], ["type", "text", "name", "ruc_name", "placeholder", "Ej: CUIT, CUIL, RUC", 1, "grow", 3, "ngModelChange", "ngModel"], ["name", "currency", 1, "select", "select-bordered", "w-full", 3, "ngModelChange", "ngModel"], ["value", "ARS"], ["value", "USD"], ["type", "file", "accept", "image/*", 1, "file-input", "file-input-bordered", "w-full", 3, "change"], [1, "mt-4", "p-4", "border", "rounded-lg", "bg-base-200", "flex", "justify-center"], [1, "flex", "justify-end", "gap-4", "mt-8", "pt-4", "border-t", "border-base-200"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "card", "bg-base-100", "shadow-lg", "mt-8"], [1, "text-xl", "font-bold", "mb-4"], [1, "text-gray-500", "mb-6", "text-sm"], [1, "overflow-x-auto", "border", "rounded-xl", "mb-8"], [1, "table", "table-zebra", "w-full"], [1, "bg-base-200"], [1, "text-right"], [1, "bg-base-200", "p-6", "rounded-xl", "border", "border-base-300"], [1, "font-bold", "text-lg", "mb-4"], [1, "fas", "fa-plus-circle", "text-primary", "mr-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "items-end"], [1, "label-text"], ["type", "text", "placeholder", "Ej: Zona Centro", 1, "input", "input-bordered", "w-full", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Ej: San Martin 123", 1, "input", "input-bordered", "w-full", 3, "ngModelChange", "ngModel"], [1, "mt-4", "flex", "items-center", "justify-between"], [1, "cursor-pointer", "label", "flex", "gap-2"], ["type", "checkbox", 1, "checkbox", "checkbox-primary", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "fas", "fa-exclamation-circle"], [1, "fas", "fa-check-circle"], ["alt", "Logo preview", 1, "h-32", "object-contain", 3, "src"], [1, "font-medium"], [1, "badge", "cursor-pointer", 3, "click"], ["title", "Eliminar", 1, "btn", "btn-ghost", "btn-sm", "text-error", 3, "click"], [1, "fas", "fa-trash"], ["colspan", "4", 1, "text-center", "py-4", "text-gray-500"]], template: function AdminCompanySettingsPage_Template(rf, ctx) {
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
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "label", 12);
      \u0275\u0275element(30, "i", 17);
      \u0275\u0275elementStart(31, "input", 18);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().tax_id, $event) || (ctx.form().tax_id = $event);
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
      \u0275\u0275text(74, "Nombre del Impuesto");
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
      \u0275\u0275text(81, "Nombre de Identificaci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(82, "label", 12);
      \u0275\u0275element(83, "i", 33);
      \u0275\u0275elementStart(84, "input", 34);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_84_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().ruc, $event) || (ctx.form().ruc = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(85, "div", 9)(86, "label", 10)(87, "span", 11);
      \u0275\u0275text(88, "Moneda");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(89, "select", 35);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_select_ngModelChange_89_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().currency, $event) || (ctx.form().currency = $event);
        return $event;
      });
      \u0275\u0275elementStart(90, "option", 36);
      \u0275\u0275text(91, "ARS (Peso Argentino)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "option", 37);
      \u0275\u0275text(93, "USD (D\xF3lar Estadounidense)");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(94, "div", 27);
      \u0275\u0275text(95, "Branding");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "div", 9)(97, "label", 10)(98, "span", 11);
      \u0275\u0275text(99, "Logo de la Empresa");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(100, "input", 38);
      \u0275\u0275listener("change", function AdminCompanySettingsPage_Template_input_change_100_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(101, AdminCompanySettingsPage_Conditional_101_Template, 2, 1, "div", 39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "div", 40)(103, "button", 41);
      \u0275\u0275conditionalCreate(104, AdminCompanySettingsPage_Conditional_104_Template, 1, 0, "span", 42);
      \u0275\u0275text(105, " Guardar Configuraci\xF3n ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(106, "div", 43)(107, "div", 4)(108, "h2", 44);
      \u0275\u0275text(109, "Gesti\xF3n de Sucursales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "p", 45);
      \u0275\u0275text(111, "Administra las ubicaciones f\xEDsicas de tu negocio. Estas podr\xE1n ser asignadas a reparaciones o inventario.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(112, "div", 46)(113, "table", 47)(114, "thead")(115, "tr", 48)(116, "th");
      \u0275\u0275text(117, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "th");
      \u0275\u0275text(119, "Direcci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(120, "th");
      \u0275\u0275text(121, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "th", 49);
      \u0275\u0275text(123, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(124, "tbody");
      \u0275\u0275repeaterCreate(125, AdminCompanySettingsPage_For_126_Template, 11, 7, "tr", null, _forTrack0);
      \u0275\u0275conditionalCreate(127, AdminCompanySettingsPage_Conditional_127_Template, 3, 0, "tr");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(128, "div", 50)(129, "h3", 51);
      \u0275\u0275element(130, "i", 52);
      \u0275\u0275text(131, "Agregar Nueva Sucursal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(132, "div", 53)(133, "div", 9)(134, "label", 10)(135, "span", 54);
      \u0275\u0275text(136, "Nombre de la Sucursal");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(137, "input", 55);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_137_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newBranch().name, $event) || (ctx.newBranch().name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(138, "div", 9)(139, "label", 10)(140, "span", 54);
      \u0275\u0275text(141, "Direcci\xF3n (Opcional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(142, "input", 56);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_142_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newBranch().address, $event) || (ctx.newBranch().address = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(143, "div", 57)(144, "label", 58)(145, "input", 59);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCompanySettingsPage_Template_input_ngModelChange_145_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newBranch().is_active, $event) || (ctx.newBranch().is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(146, "span", 54);
      \u0275\u0275text(147, "Sucursal Activa");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(148, "button", 60);
      \u0275\u0275listener("click", function AdminCompanySettingsPage_Template_button_click_148_listener() {
        return ctx.addBranch();
      });
      \u0275\u0275conditionalCreate(149, AdminCompanySettingsPage_Conditional_149_Template, 1, 0, "span", 42);
      \u0275\u0275text(150, " Agregar Sucursal ");
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
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.form().ruc, " (N\xFAmero)");
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().tax_id);
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
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().ruc);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().currency);
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.form().logo_url ? 101 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 104 : -1);
      \u0275\u0275advance(21);
      \u0275\u0275repeater(ctx.branches());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.branches().length === 0 ? 127 : -1);
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.newBranch().name);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.newBranch().address);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.newBranch().is_active);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.savingBranch() || !ctx.newBranch().name);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.savingBranch() ? 149 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCompanySettingsPage, [{
    type: Component,
    args: [{ selector: "app-admin-company-settings-page", standalone: true, imports: [FormsModule], template: `<div class="max-w-4xl mx-auto">\r
    <div class="flex justify-between items-center mb-6">\r
        <h1 class="text-2xl font-bold">Configuraci\xF3n de Empresa</h1>\r
    </div>\r
\r
    <div class="card bg-base-100 shadow-lg">\r
        <div class="card-body p-6">\r
            @if (error()) {\r
            <div class="alert alert-error mb-4 shadow-sm">\r
                <i class="fas fa-exclamation-circle"></i>\r
                <span>{{ error() }}</span>\r
            </div>\r
            }\r
            @if (success()) {\r
            <div class="alert alert-success mb-4 shadow-sm">\r
                <i class="fas fa-check-circle"></i>\r
                <span>{{ success() }}</span>\r
            </div>\r
            }\r
\r
            <form (ngSubmit)="save()" class="space-y-6">\r
                <!-- Basic Info -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Nombre de la Empresa</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-building text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().name" name="name" class="grow" required />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Propietario</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-user text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().owner_name" name="owner_name" class="grow" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">{{ form().ruc }} (N\xFAmero)</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-id-card text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().tax_id" name="tax_id" class="grow" placeholder="Ej: 20-12345678-9" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Direcci\xF3n</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-map-marker-alt text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().address" name="address" class="grow" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Contact Info -->\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Email</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-envelope text-gray-400"></i>\r
                            <input type="email" [(ngModel)]="form().email" name="email" class="grow" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Tel\xE9fono</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-phone text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().phone" name="phone" class="grow" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Ubicaci\xF3n</span>\r
                    </label>\r
                    <label class="input input-bordered flex items-center gap-2">\r
                        <i class="fas fa-globe text-gray-400"></i>\r
                        <input type="text" [(ngModel)]="form().location" name="location" class="grow" \r
                            placeholder="Ej: Buenos Aires, Argentina" />\r
                    </label>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Configuraci\xF3n Fiscal</div>\r
\r
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Porcentaje Impuesto (%)</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-percent text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().tax_percentage" name="tax_percentage" class="grow" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Nombre del Impuesto</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-tag text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().tax_abbreviation" name="tax_abbreviation" class="grow" \r
                                placeholder="Ej: IVA" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Nombre de Identificaci\xF3n</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-fingerprint text-gray-400"></i>\r
                            <input type="text" [(ngModel)]="form().ruc" name="ruc_name" class="grow" \r
                                placeholder="Ej: CUIT, CUIL, RUC" />\r
                        </label>\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Moneda</span>\r
                        </label>\r
                        <select [(ngModel)]="form().currency" name="currency" class="select select-bordered w-full">\r
                            <option value="ARS">ARS (Peso Argentino)</option>\r
                            <option value="USD">USD (D\xF3lar Estadounidense)</option>\r
                        </select>\r
                    </div>\r
                </div>\r
\r
                <div class="divider text-sm font-medium text-gray-500">Branding</div>\r
\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Logo de la Empresa</span>\r
                    </label>\r
                    <input type="file" (change)="onFileChange($event)" class="file-input file-input-bordered w-full"\r
                        accept="image/*">\r
                    @if (form().logo_url) {\r
                    <div class="mt-4 p-4 border rounded-lg bg-base-200 flex justify-center">\r
                        <img [src]="form().logo_url" alt="Logo preview" class="h-32 object-contain">\r
                    </div>\r
                    }\r
                </div>\r
\r
                <div class="flex justify-end gap-4 mt-8 pt-4 border-t border-base-200">\r
                    <button type="submit" class="btn btn-primary px-8" [disabled]="saving()">\r
                        @if (saving()) {\r
                        <span class="loading loading-spinner"></span>\r
                        }\r
                        Guardar Configuraci\xF3n\r
                    </button>\r
                </div>\r
            </form>\r
        </div>\r
    </div>\r
\r
    <!-- SUCURSALES (Branches) MANAGEMENT -->\r
    <div class="card bg-base-100 shadow-lg mt-8">\r
        <div class="card-body p-6">\r
            <h2 class="text-xl font-bold mb-4">Gesti\xF3n de Sucursales</h2>\r
            <p class="text-gray-500 mb-6 text-sm">Administra las ubicaciones f\xEDsicas de tu negocio. Estas podr\xE1n ser asignadas a reparaciones o inventario.</p>\r
\r
            <!-- Listado de Sucursales -->\r
            <div class="overflow-x-auto border rounded-xl mb-8">\r
                <table class="table table-zebra w-full">\r
                    <thead>\r
                        <tr class="bg-base-200">\r
                            <th>Nombre</th>\r
                            <th>Direcci\xF3n</th>\r
                            <th>Estado</th>\r
                            <th class="text-right">Acciones</th>\r
                        </tr>\r
                    </thead>\r
                    <tbody>\r
                        @for (branch of branches(); track branch.id) {\r
                        <tr>\r
                            <td class="font-medium">{{ branch.name }}</td>\r
                            <td>{{ branch.address || '--' }}</td>\r
                            <td>\r
                                <button class="badge cursor-pointer" \r
                                    [class.badge-success]="branch.is_active" \r
                                    [class.badge-ghost]="!branch.is_active"\r
                                    (click)="toggleBranchStatus(branch)">\r
                                    {{ branch.is_active ? 'Activa' : 'Inactiva' }}\r
                                </button>\r
                            </td>\r
                            <td class="text-right">\r
                                <button class="btn btn-ghost btn-sm text-error" (click)="deleteBranch(branch.id)" title="Eliminar">\r
                                    <i class="fas fa-trash"></i>\r
                                </button>\r
                            </td>\r
                        </tr>\r
                        }\r
                        @if (branches().length === 0) {\r
                        <tr>\r
                            <td colspan="4" class="text-center py-4 text-gray-500">No hay sucursales registradas.</td>\r
                        </tr>\r
                        }\r
                    </tbody>\r
                </table>\r
            </div>\r
\r
            <!-- Formulario para agregar Nueva Sucursal -->\r
            <div class="bg-base-200 p-6 rounded-xl border border-base-300">\r
                <h3 class="font-bold text-lg mb-4"><i class="fas fa-plus-circle text-primary mr-2"></i>Agregar Nueva Sucursal</h3>\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">\r
                    <div class="form-control">\r
                        <label class="label"><span class="label-text">Nombre de la Sucursal</span></label>\r
                        <input type="text" [(ngModel)]="newBranch().name" class="input input-bordered w-full" placeholder="Ej: Zona Centro" />\r
                    </div>\r
                    <div class="form-control">\r
                        <label class="label"><span class="label-text">Direcci\xF3n (Opcional)</span></label>\r
                        <input type="text" [(ngModel)]="newBranch().address" class="input input-bordered w-full" placeholder="Ej: San Martin 123" />\r
                    </div>\r
                </div>\r
                <div class="mt-4 flex items-center justify-between">\r
                    <label class="cursor-pointer label flex gap-2">\r
                        <input type="checkbox" [(ngModel)]="newBranch().is_active" class="checkbox checkbox-primary" />\r
                        <span class="label-text">Sucursal Activa</span>\r
                    </label>\r
                    <button class="btn btn-primary" (click)="addBranch()" [disabled]="savingBranch() || !newBranch().name">\r
                        @if(savingBranch()) { <span class="loading loading-spinner"></span> }\r
                        Agregar Sucursal\r
                    </button>\r
                </div>\r
            </div>\r
\r
        </div>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCompanySettingsPage, { className: "AdminCompanySettingsPage", filePath: "src/app/admin/company/admin-company-settings-page.ts", lineNumber: 13 });
})();
export {
  AdminCompanySettingsPage
};
//# sourceMappingURL=chunk-73DV43UW.js.map
