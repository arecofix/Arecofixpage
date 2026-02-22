import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
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
} from "./chunk-VVLZNBXY.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-JEV3MPEL.mjs";
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
} from "./chunk-DXH6IVIR.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/brands/admin-brand-form-page.ts
function AdminBrandFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 22);
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
function AdminBrandFormPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "img", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.form().logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminBrandFormPage_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 21);
  }
}
var AdminBrandFormPage = class _AdminBrandFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  id = null;
  form = signal({
    name: "",
    slug: "",
    logo_url: "",
    is_active: true
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      const supabase = this.auth.getSupabaseClient();
      const { data, error } = await supabase.from("brands").select("*").eq("id", this.id).single();
      if (data) {
        this.form.set({
          name: data.name,
          slug: data.slug,
          logo_url: data.logo_url || "",
          is_active: data.is_active
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
    const filePath = `brands/${Date.now()}-${file.name}`;
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
    const supabase = this.auth.getSupabaseClient();
    const payload = __spreadValues({}, this.form());
    if (!payload.slug) {
      payload.slug = this.slugify(payload.name);
    }
    try {
      if (this.id) {
        const { error } = await supabase.from("brands").update(payload).eq("id", this.id);
        if (error)
          throw error;
      } else {
        const { error } = await supabase.from("brands").insert(payload);
        if (error)
          throw error;
      }
      this.router.navigate(["/admin/brands"]);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  slugify(text) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
  }
  static \u0275fac = function AdminBrandFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminBrandFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminBrandFormPage, selectors: [["app-admin-brand-form-page"]], decls: 33, vars: 8, consts: [[1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "flex", "items-center", "gap-4", "mb-6"], ["routerLink", "/admin/brands", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "text-2xl", "font-bold", "text-green-600"], [3, "ngSubmit"], [1, "bg-base-100", "p-6", "rounded-xl", "shadow-sm", "border", "border-base-200", "mb-6", "text-base-content"], [1, "alert", "alert-error", "mb-6"], [1, "mb-4"], [1, "block", "text-sm", "font-medium", "text-base-content", "mb-1.5"], ["type", "text", "name", "name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "slug", "placeholder", "Se genera autom\xE1ticamente si se deja vac\xEDo", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "file", "accept", "image/*", 1, "file-input", "file-input-bordered", "file-input-primary", "w-full", "bg-base-100", "text-base-content", 3, "change"], [1, "mt-4"], [1, "mt-6"], [1, "flex", "items-center", "gap-3", "p-3", "bg-base-100", "border", "border-base-300", "rounded-lg", "hover:bg-base-200", "transition-colors", "cursor-pointer", "w-fit"], ["type", "checkbox", "name", "is_active", 1, "checkbox", "checkbox-primary", "h-5", "w-5", "rounded", "border-base-300", 3, "ngModelChange", "ngModel"], [1, "font-medium", "text-base-content"], [1, "flex", "justify-end", "gap-4", "mt-6"], ["routerLink", "/admin/brands", 1, "btn", "btn-error", "text-white"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-exclamation-circle"], ["alt", "Logo preview", 1, "h-24", "object-contain", "border", "border-base-300", "rounded-lg", "p-2", "bg-base-100", "shadow-sm", 3, "src"]], template: function AdminBrandFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "form", 5);
      \u0275\u0275listener("ngSubmit", function AdminBrandFormPage_Template_form_ngSubmit_6_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminBrandFormPage_Conditional_8_Template, 4, 1, "div", 7);
      \u0275\u0275elementStart(9, "div", 8)(10, "label", 9);
      \u0275\u0275text(11, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function AdminBrandFormPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().name, $event) || (ctx.form().name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 8)(14, "label", 9);
      \u0275\u0275text(15, "Slug (URL)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AdminBrandFormPage_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().slug, $event) || (ctx.form().slug = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 8)(18, "label", 9);
      \u0275\u0275text(19, "Logo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "input", 12);
      \u0275\u0275listener("change", function AdminBrandFormPage_Template_input_change_20_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(21, AdminBrandFormPage_Conditional_21_Template, 2, 1, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 14)(23, "label", 15)(24, "input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function AdminBrandFormPage_Template_input_ngModelChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().is_active, $event) || (ctx.form().is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "span", 17);
      \u0275\u0275text(26, "Activo");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(27, "div", 18)(28, "a", 19);
      \u0275\u0275text(29, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "button", 20);
      \u0275\u0275conditionalCreate(31, AdminBrandFormPage_Conditional_31_Template, 1, 0, "span", 21);
      \u0275\u0275text(32, " Guardar ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nueva", " Marca");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().name);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().slug);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.form().logo_url ? 21 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().is_active);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 31 : -1);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminBrandFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-brand-form-page", standalone: true, imports: [FormsModule, RouterLink], template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <div class="flex items-center gap-4 mb-6">\r
        <a routerLink="/admin/brands" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar' : 'Nueva' }} Marca</h1>\r
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
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Slug (URL)</label>\r
                <input type="text" [(ngModel)]="form().slug" name="slug" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                    placeholder="Se genera autom\xE1ticamente si se deja vac\xEDo">\r
            </div>\r
\r
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Logo</label>\r
                <input type="file" (change)="onFileChange($event)"\r
                    class="file-input file-input-bordered file-input-primary w-full bg-base-100 text-base-content" accept="image/*">\r
                @if (form().logo_url) {\r
                <div class="mt-4">\r
                    <img [src]="form().logo_url" alt="Logo preview"\r
                        class="h-24 object-contain border border-base-300 rounded-lg p-2 bg-base-100 shadow-sm">\r
                </div>\r
                }\r
            </div>\r
\r
            <div class="mt-6">\r
                <label class="flex items-center gap-3 p-3 bg-base-100 border border-base-300 rounded-lg hover:bg-base-200 transition-colors cursor-pointer w-fit">\r
                    <input type="checkbox" [(ngModel)]="form().is_active" name="is_active"\r
                        class="checkbox checkbox-primary h-5 w-5 rounded border-base-300">\r
                    <span class="font-medium text-base-content">Activo</span>\r
                </label>\r
            </div>\r
        </div>\r
\r
        <div class="flex justify-end gap-4 mt-6">\r
            <a routerLink="/admin/brands" class="btn btn-error text-white">Cancelar</a>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminBrandFormPage, { className: "AdminBrandFormPage", filePath: "src/app/admin/brands/admin-brand-form-page.ts", lineNumber: 13 });
})();
export {
  AdminBrandFormPage
};
//# sourceMappingURL=chunk-PEPMDOHN.mjs.map
