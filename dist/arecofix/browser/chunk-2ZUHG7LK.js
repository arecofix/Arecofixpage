import {
  AuthService
} from "./chunk-NJJ5IL4Q.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-TOKXMODF.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  Router,
  RouterLink
} from "./chunk-WHLM5VZW.js";
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
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XQFVERLD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/employees/admin-employee-form-page.ts
function AdminEmployeeFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 18);
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
function AdminEmployeeFormPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "img", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.form().avatar_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminEmployeeFormPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 17);
  }
}
var AdminEmployeeFormPage = class _AdminEmployeeFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  id = null;
  form = signal({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "staff",
    avatar_url: ""
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      const supabase = this.auth.getSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", this.id).single();
      if (data) {
        this.form.set({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "staff",
          avatar_url: data.avatar_url || ""
        });
      }
    }
    this.loading.set(false);
  }
  async onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file)
      return;
    const supabase = this.auth.getSupabaseClient();
    const filePath = `avatars/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("public-assets").upload(filePath, file);
    if (error) {
      this.error.set(error.message);
      return;
    }
    const { data: publicUrl } = supabase.storage.from("public-assets").getPublicUrl(data.path);
    this.form.update((f) => __spreadProps(__spreadValues({}, f), { avatar_url: publicUrl.publicUrl }));
  }
  async save() {
    this.saving.set(true);
    this.error.set(null);
    const supabase = this.auth.getSupabaseClient();
    const payload = __spreadValues({}, this.form());
    try {
      if (this.id) {
        const { error } = await supabase.from("profiles").update(payload).eq("id", this.id);
        if (error)
          throw error;
      } else {
        throw new Error("Creaci\xF3n de nuevos empleados debe hacerse desde el registro o invitaci\xF3n.");
      }
      this.router.navigate(["/admin/employees"]);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function AdminEmployeeFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminEmployeeFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminEmployeeFormPage, selectors: [["app-admin-employee-form-page"]], decls: 29, vars: 7, consts: [[1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "flex", "items-center", "gap-4", "mb-6"], ["routerLink", "/admin/employees", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "text-2xl", "font-bold", "text-green-600"], [3, "ngSubmit"], [1, "bg-base-100", "p-6", "rounded-xl", "shadow-sm", "border", "border-base-200", "mb-6", "text-base-content"], [1, "alert", "alert-error", "mb-6"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "block", "text-sm", "font-medium", "text-base-content", "mb-1.5"], ["type", "text", "name", "first_name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "last_name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "mt-4"], ["type", "file", "accept", "image/*", 1, "file-input", "file-input-bordered", "file-input-primary", "w-full", "bg-base-100", "text-base-content", 3, "change"], [1, "flex", "justify-end", "gap-4", "mt-6"], ["routerLink", "/admin/employees", 1, "btn", "btn-ghost"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-exclamation-circle"], ["alt", "Avatar preview", 1, "w-24", "h-24", "rounded-full", "object-cover", "border-2", "border-base-200", "shadow-sm", 3, "src"]], template: function AdminEmployeeFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "form", 5);
      \u0275\u0275listener("ngSubmit", function AdminEmployeeFormPage_Template_form_ngSubmit_6_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminEmployeeFormPage_Conditional_8_Template, 4, 1, "div", 7);
      \u0275\u0275elementStart(9, "div", 8)(10, "div")(11, "label", 9);
      \u0275\u0275text(12, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function AdminEmployeeFormPage_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().first_name, $event) || (ctx.form().first_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div")(15, "label", 9);
      \u0275\u0275text(16, "Apellido");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AdminEmployeeFormPage_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().last_name, $event) || (ctx.form().last_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 12)(19, "label", 9);
      \u0275\u0275text(20, "Foto de Perfil");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 13);
      \u0275\u0275listener("change", function AdminEmployeeFormPage_Template_input_change_21_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, AdminEmployeeFormPage_Conditional_22_Template, 2, 1, "div", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 14)(24, "a", 15);
      \u0275\u0275text(25, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "button", 16);
      \u0275\u0275conditionalCreate(27, AdminEmployeeFormPage_Conditional_27_Template, 1, 0, "span", 17);
      \u0275\u0275text(28, " Guardar ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nuevo", " Empleado");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().first_name);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().last_name);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.form().avatar_url ? 22 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 27 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminEmployeeFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-employee-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <div class="flex items-center gap-4 mb-6">\r
        <a routerLink="/admin/employees" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar' : 'Nuevo' }} Empleado</h1>\r
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Nombre</label>\r
                    <input type="text" [(ngModel)]="form().first_name" name="first_name" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        required>\r
                </div>\r
                <div>\r
                    <label class="block text-sm font-medium text-base-content mb-1.5">Apellido</label>\r
                    <input type="text" [(ngModel)]="form().last_name" name="last_name" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        required>\r
                </div>\r
            </div>\r
\r
            <div class="mt-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Foto de Perfil</label>\r
                <input type="file" (change)="onFileChange($event)"\r
                    class="file-input file-input-bordered file-input-primary w-full bg-base-100 text-base-content" accept="image/*">\r
                @if (form().avatar_url) {\r
                <div class="mt-4">\r
                    <img [src]="form().avatar_url" alt="Avatar preview"\r
                        class="w-24 h-24 rounded-full object-cover border-2 border-base-200 shadow-sm">\r
                </div>\r
                }\r
            </div>\r
        </div>\r
\r
        <div class="flex justify-end gap-4 mt-6">\r
            <a routerLink="/admin/employees" class="btn btn-ghost">Cancelar</a>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminEmployeeFormPage, { className: "AdminEmployeeFormPage", filePath: "src/app/admin/employees/admin-employee-form-page.ts", lineNumber: 13 });
})();
export {
  AdminEmployeeFormPage
};
//# sourceMappingURL=chunk-2ZUHG7LK.js.map
