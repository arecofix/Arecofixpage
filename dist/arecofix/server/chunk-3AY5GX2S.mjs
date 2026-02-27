import './polyfills.server.mjs';
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-EBVHUSN7.mjs";
import {
  AuthService,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import "./chunk-NQCCIK3J.mjs";
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/admin/suppliers/admin-supplier-form-page.ts
function AdminSupplierFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 28);
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
function AdminSupplierFormPage_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 27);
  }
}
var AdminSupplierFormPage = class _AdminSupplierFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  id = null;
  form = signal({
    name: "",
    type: "",
    rubro: "",
    address: "",
    cuil: "",
    email: "",
    phone: "",
    is_active: true
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      const supabase = this.auth.getSupabaseClient();
      const { data, error } = await supabase.from("suppliers").select("*").eq("tenant_id", this.tenantService.getTenantId()).eq("id", this.id).single();
      if (data) {
        this.form.set({
          name: data.name,
          type: data.type || "",
          rubro: data.rubro || "",
          address: data.address || "",
          cuil: data.tax_id || "",
          // Map tax_id to cuil
          email: data.email || "",
          phone: data.phone || "",
          is_active: data.is_active
        });
      }
    }
    this.loading.set(false);
  }
  async save() {
    this.saving.set(true);
    this.error.set(null);
    const supabase = this.auth.getSupabaseClient();
    const payload = {
      name: this.form().name,
      type: this.form().type,
      rubro: this.form().rubro,
      address: this.form().address,
      tax_id: this.form().cuil,
      // Map cuil to tax_id
      email: this.form().email,
      phone: this.form().phone,
      is_active: this.form().is_active
    };
    try {
      if (this.id) {
        const { error } = await supabase.from("suppliers").update(payload).eq("id", this.id).eq("tenant_id", this.tenantService.getTenantId());
        if (error)
          throw error;
      } else {
        const { error } = await supabase.from("suppliers").insert(__spreadProps(__spreadValues({}, payload), {
          tenant_id: this.tenantService.getTenantId()
        }));
        if (error)
          throw error;
      }
      this.router.navigate(["/admin/suppliers"]);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function AdminSupplierFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminSupplierFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSupplierFormPage, selectors: [["app-admin-supplier-form-page"]], decls: 50, vars: 12, consts: [[1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "flex", "items-center", "gap-4", "mb-6"], ["routerLink", "/admin/suppliers", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "text-2xl", "font-bold", "text-green-600"], [3, "ngSubmit"], [1, "bg-base-100", "p-6", "rounded-xl", "shadow-sm", "border", "border-base-200", "mb-6", "text-base-content"], [1, "alert", "alert-error", "mb-6"], [1, "mb-4"], [1, "block", "text-sm", "font-medium", "text-base-content", "mb-1.5"], ["type", "text", "name", "name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], ["type", "text", "name", "type", "placeholder", "Ej: Mayorista, Fabricante", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "rubro", "placeholder", "Ej: Electr\xF3nica", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mt-4"], ["type", "text", "name", "cuil", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "phone", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "mt-4"], ["type", "email", "name", "email", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "address", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "mt-6"], [1, "flex", "items-center", "gap-3", "p-3", "bg-base-100", "border", "border-base-200", "rounded-lg", "hover:bg-base-200", "transition-colors", "cursor-pointer", "w-fit"], ["type", "checkbox", "name", "is_active", 1, "checkbox", "checkbox-primary", "h-5", "w-5", "rounded", "border-base-300", 3, "ngModelChange", "ngModel"], [1, "font-medium", "text-gray-700"], [1, "flex", "justify-end", "gap-4", "mt-6"], ["routerLink", "/admin/suppliers", 1, "btn", "btn-ghost"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-exclamation-circle"]], template: function AdminSupplierFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "form", 5);
      \u0275\u0275listener("ngSubmit", function AdminSupplierFormPage_Template_form_ngSubmit_6_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminSupplierFormPage_Conditional_8_Template, 4, 1, "div", 7);
      \u0275\u0275elementStart(9, "div", 8)(10, "label", 9);
      \u0275\u0275text(11, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().name, $event) || (ctx.form().name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 11)(14, "div")(15, "label", 9);
      \u0275\u0275text(16, "Tipo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().type, $event) || (ctx.form().type = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div")(19, "label", 9);
      \u0275\u0275text(20, "Rubro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().rubro, $event) || (ctx.form().rubro = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(22, "div", 14)(23, "div")(24, "label", 9);
      \u0275\u0275text(25, "CUIL/CUIT");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_26_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().cuil, $event) || (ctx.form().cuil = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div")(28, "label", 9);
      \u0275\u0275text(29, "Tel\xE9fono");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().phone, $event) || (ctx.form().phone = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(31, "div", 17)(32, "label", 9);
      \u0275\u0275text(33, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "input", 18);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().email, $event) || (ctx.form().email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 17)(36, "label", 9);
      \u0275\u0275text(37, "Direcci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "input", 19);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().address, $event) || (ctx.form().address = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 20)(40, "label", 21)(41, "input", 22);
      \u0275\u0275twoWayListener("ngModelChange", function AdminSupplierFormPage_Template_input_ngModelChange_41_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().is_active, $event) || (ctx.form().is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 23);
      \u0275\u0275text(43, "Activo");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(44, "div", 24)(45, "a", 25);
      \u0275\u0275text(46, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "button", 26);
      \u0275\u0275conditionalCreate(48, AdminSupplierFormPage_Conditional_48_Template, 1, 0, "span", 27);
      \u0275\u0275text(49, " Guardar ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nuevo", " Proveedor");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().name);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().type);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().rubro);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().cuil);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().phone);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().address);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().is_active);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 48 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminSupplierFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-supplier-form-page", standalone: true, imports: [FormsModule, RouterLink], template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <div class="flex items-center gap-4 mb-6">\r
        <a routerLink="/admin/suppliers" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar' : 'Nuevo' }} Proveedor</h1>\r
    </div>\r
\r
    <form (ngSubmit)="save()">\r
        <div class="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 mb-6 text-base-content">\r
            @if (error()) {\r
            <div class="alert alert-error mb-6">\r
                <i class="fas fa-exclamation-circle"></i>\r
                <span>{{ error() }}</span>\r
            </div>\r
            }\r
\r
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Nombre</label>\r
                <input type="text" [(ngModel)]="form().name" name="name" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40" required>\r
            </div>\r
\r
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Tipo</label>\r
                    <input type="text" [(ngModel)]="form().type" name="type" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        placeholder="Ej: Mayorista, Fabricante">\r
                </div>\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Rubro</label>\r
                    <input type="text" [(ngModel)]="form().rubro" name="rubro" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        placeholder="Ej: Electr\xF3nica">\r
                </div>\r
            </div>\r
\r
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">CUIL/CUIT</label>\r
                    <input type="text" [(ngModel)]="form().cuil" name="cuil" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
                </div>\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Tel\xE9fono</label>\r
                    <input type="text" [(ngModel)]="form().phone" name="phone" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
                </div>\r
            </div>\r
\r
            <div class="mt-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Email</label>\r
                <input type="email" [(ngModel)]="form().email" name="email" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
            </div>\r
\r
            <div class="mt-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Direcci\xF3n</label>\r
                <input type="text" [(ngModel)]="form().address" name="address" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
            </div>\r
\r
            <div class="mt-6">\r
                <label class="flex items-center gap-3 p-3 bg-base-100 border border-base-200 rounded-lg hover:bg-base-200 transition-colors cursor-pointer w-fit">\r
                    <input type="checkbox" [(ngModel)]="form().is_active" name="is_active"\r
                        class="checkbox checkbox-primary h-5 w-5 rounded border-base-300">\r
                    <span class="font-medium text-gray-700">Activo</span>\r
                </label>\r
            </div>\r
        </div>\r
\r
        <div class="flex justify-end gap-4 mt-6">\r
            <a routerLink="/admin/suppliers" class="btn btn-ghost">Cancelar</a>\r
            <button type="submit" class="btn btn-primary px-8" [disabled]="saving()">\r
                @if (saving()) {\r
                <span class="loading loading-spinner loading-xs mr-2"></span>\r
                }\r
                Guardar\r
            </button>\r
        </div>\r
    </form>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSupplierFormPage, { className: "AdminSupplierFormPage", filePath: "src/app/admin/suppliers/admin-supplier-form-page.ts", lineNumber: 14 });
})();
export {
  AdminSupplierFormPage
};
//# sourceMappingURL=chunk-3AY5GX2S.mjs.map
