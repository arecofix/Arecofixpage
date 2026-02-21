import {
  AuthService
} from "./chunk-65AYZUFN.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NumberValueAccessor,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-DEVYQMPB.js";
import "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  ActivatedRoute,
  CommonModule,
  Router,
  RouterLink
} from "./chunk-B7SLUDL7.js";
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-4O7IFJFV.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/services/admin-service-form-page.ts
function AdminServiceFormPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "span", 9);
    \u0275\u0275elementEnd();
  }
}
function AdminServiceFormPage_Conditional_10_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "i", 29);
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
function AdminServiceFormPage_Conditional_10_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 28);
  }
}
function AdminServiceFormPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10);
    \u0275\u0275listener("ngSubmit", function AdminServiceFormPage_Conditional_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(1, "div", 11)(2, "label", 12)(3, "span", 13);
    \u0275\u0275text(4, "Nombre del Servicio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "label", 14);
    \u0275\u0275element(6, "i", 15);
    \u0275\u0275elementStart(7, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function AdminServiceFormPage_Conditional_10_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().name, $event) || (ctx_r1.form().name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 11)(9, "label", 12)(10, "span", 13);
    \u0275\u0275text(11, "Descripci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "textarea", 17);
    \u0275\u0275twoWayListener("ngModelChange", function AdminServiceFormPage_Conditional_10_Template_textarea_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().description, $event) || (ctx_r1.form().description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 18)(14, "div", 11)(15, "label", 12)(16, "span", 13);
    \u0275\u0275text(17, "Precio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "label", 14);
    \u0275\u0275element(19, "i", 19);
    \u0275\u0275elementStart(20, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function AdminServiceFormPage_Conditional_10_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().price, $event) || (ctx_r1.form().price = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 11)(22, "label", 12)(23, "span", 13);
    \u0275\u0275text(24, "Duraci\xF3n (minutos)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "label", 14);
    \u0275\u0275element(26, "i", 21);
    \u0275\u0275elementStart(27, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function AdminServiceFormPage_Conditional_10_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().duration_minutes, $event) || (ctx_r1.form().duration_minutes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 11)(29, "label", 23)(30, "span", 13);
    \u0275\u0275text(31, "Activo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function AdminServiceFormPage_Conditional_10_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form().is_active, $event) || (ctx_r1.form().is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(33, AdminServiceFormPage_Conditional_10_Conditional_33_Template, 4, 1, "div", 25);
    \u0275\u0275elementStart(34, "div", 26)(35, "a", 3);
    \u0275\u0275text(36, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 27);
    \u0275\u0275conditionalCreate(38, AdminServiceFormPage_Conditional_10_Conditional_38_Template, 1, 0, "span", 28);
    \u0275\u0275text(39, " Guardar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().name);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().description);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().price);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().duration_minutes);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form().is_active);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 33 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.saving() || !ctx_r1.form().name);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.saving() ? 38 : -1);
  }
}
var AdminServiceFormPage = class _AdminServiceFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  id = null;
  form = signal({
    name: "",
    description: "",
    price: 0,
    duration_minutes: 60,
    is_active: true
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      const supabase = this.auth.getSupabaseClient();
      const { data, error } = await supabase.from("services").select("*").eq("id", this.id).single();
      if (data) {
        this.form.set({
          name: data.name,
          description: data.description || "",
          price: data.price || 0,
          duration_minutes: data.duration_minutes || 60,
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
    const rawForm = this.form();
    const payload = {
      name: rawForm.name,
      description: rawForm.description,
      price: Number(rawForm.price),
      duration_minutes: Number(rawForm.duration_minutes),
      is_active: rawForm.is_active
    };
    try {
      if (this.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", this.id);
        if (error)
          throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error)
          throw error;
      }
      this.router.navigate(["/admin/services"]);
    } catch (e) {
      console.error("Error saving service:", e);
      this.error.set(e.message || "Error al guardar el servicio. Verifica los datos.");
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function AdminServiceFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminServiceFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminServiceFormPage, selectors: [["app-admin-service-form-page"]], decls: 11, vars: 2, consts: [[1, "max-w-2xl", "mx-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/services", 1, "btn", "btn-ghost"], [1, "fas", "fa-arrow-left", "mr-2"], [1, "card", "bg-base-100", "shadow-lg"], [1, "card-body", "p-6"], [1, "flex", "justify-center", "py-12"], [1, "space-y-6"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "space-y-6", 3, "ngSubmit"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium"], [1, "input", "input-bordered", "flex", "items-center", "gap-2"], [1, "fas", "fa-tag", "text-gray-400"], ["type", "text", "name", "name", "required", "", 1, "grow", 3, "ngModelChange", "ngModel"], ["name", "description", "placeholder", "Describe los detalles del servicio...", 1, "textarea", "textarea-bordered", "h-32", "leading-relaxed", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "fas", "fa-dollar-sign", "text-gray-400"], ["type", "number", "name", "price", "min", "0", "step", "0.01", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-clock", "text-gray-400"], ["type", "number", "name", "duration_minutes", "min", "0", 1, "grow", 3, "ngModelChange", "ngModel"], [1, "label", "cursor-pointer", "justify-start", "gap-4", "p-0"], ["type", "checkbox", "name", "is_active", 1, "toggle", "toggle-primary", 3, "ngModelChange", "ngModel"], [1, "alert", "alert-error", "mb-6", "shadow-sm"], [1, "flex", "justify-end", "gap-4", "pt-6", "border-t", "border-base-200"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs"], [1, "fas", "fa-exclamation-circle"]], template: function AdminServiceFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "a", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275text(6, " Volver ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5)(8, "div", 6);
      \u0275\u0275conditionalCreate(9, AdminServiceFormPage_Conditional_9_Template, 2, 0, "div", 7)(10, AdminServiceFormPage_Conditional_10_Template, 40, 8, "form", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nuevo", " Servicio");
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.loading() ? 9 : 10);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminServiceFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-service-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="max-w-2xl mx-auto">\r
    <div class="flex justify-between items-center mb-6">\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar' : 'Nuevo' }} Servicio</h1>\r
        <a routerLink="/admin/services" class="btn btn-ghost">\r
            <i class="fas fa-arrow-left mr-2"></i> Volver\r
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
                <!-- Name -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Nombre del Servicio</span>\r
                    </label>\r
                    <label class="input input-bordered flex items-center gap-2">\r
                        <i class="fas fa-tag text-gray-400"></i>\r
                        <input type="text" [(ngModel)]="form().name" name="name" class="grow" required />\r
                    </label>\r
                </div>\r
\r
                <!-- Description -->\r
                <div class="form-control">\r
                    <label class="label">\r
                        <span class="label-text font-medium">Descripci\xF3n</span>\r
                    </label>\r
                    <textarea [(ngModel)]="form().description" name="description"\r
                        class="textarea textarea-bordered h-32 leading-relaxed" \r
                        placeholder="Describe los detalles del servicio..."></textarea>\r
                </div>\r
\r
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                    <!-- Price -->\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Precio</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-dollar-sign text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().price" name="price" class="grow" min="0" step="0.01" />\r
                        </label>\r
                    </div>\r
\r
                    <!-- Duration -->\r
                    <div class="form-control">\r
                        <label class="label">\r
                            <span class="label-text font-medium">Duraci\xF3n (minutos)</span>\r
                        </label>\r
                        <label class="input input-bordered flex items-center gap-2">\r
                            <i class="fas fa-clock text-gray-400"></i>\r
                            <input type="number" [(ngModel)]="form().duration_minutes" name="duration_minutes" class="grow" min="0" />\r
                        </label>\r
                    </div>\r
                </div>\r
\r
                <!-- Is Active -->\r
                <div class="form-control">\r
                    <label class="label cursor-pointer justify-start gap-4 p-0">\r
                        <span class="label-text font-medium">Activo</span>\r
                        <input type="checkbox" [(ngModel)]="form().is_active" name="is_active"\r
                            class="toggle toggle-primary" />\r
                    </label>\r
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
                <div class="flex justify-end gap-4 pt-6 border-t border-base-200">\r
                    <a routerLink="/admin/services" class="btn btn-ghost">Cancelar</a>\r
                    <button type="submit" class="btn btn-primary px-8" [disabled]="saving() || !form().name">\r
                        @if (saving()) {\r
                        <span class="loading loading-spinner loading-xs"></span>\r
                        }\r
                        Guardar\r
                    </button>\r
                </div>\r
            </form>\r
            }\r
        </div>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminServiceFormPage, { className: "AdminServiceFormPage", filePath: "src/app/admin/services/admin-service-form-page.ts", lineNumber: 13 });
})();
export {
  AdminServiceFormPage
};
//# sourceMappingURL=chunk-A77OMUDE.js.map
