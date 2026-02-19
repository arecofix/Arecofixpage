import {
  AuthService
} from "./chunk-NJJ5IL4Q.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
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
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XQFVERLD.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/admin/categories/admin-category-form-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminCategoryFormPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 33);
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
function AdminCategoryFormPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 34);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.form().image_url);
  }
}
function AdminCategoryFormPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "N/A");
    \u0275\u0275elementEnd();
  }
}
function AdminCategoryFormPage_For_48_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", cat_r2.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(cat_r2.name);
  }
}
function AdminCategoryFormPage_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AdminCategoryFormPage_For_48_Conditional_0_Template, 2, 2, "option", 35);
  }
  if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(cat_r2.id !== ctx_r0.id ? 0 : -1);
  }
}
function AdminCategoryFormPage_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 32);
  }
}
var AdminCategoryFormPage = class _AdminCategoryFormPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  id = null;
  categories = signal([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  form = signal({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    type: "product",
    parent_id: "",
    is_active: true
  }, ...ngDevMode ? [{ debugName: "form" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    const supabase = this.auth.getSupabaseClient();
    const { data: categoriesData } = await supabase.from("categories").select("id, name").eq("is_active", true).order("name");
    if (categoriesData) {
      this.categories.set(categoriesData);
    }
    if (this.id) {
      const { data, error } = await supabase.from("categories").select("*").eq("id", this.id).single();
      if (data) {
        this.form.set({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          image_url: data.image_url || data.icon || "",
          type: data.type,
          parent_id: data.parent_id || null,
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
    const payload = __spreadValues({}, this.form());
    if (!payload.slug) {
      payload.slug = this.slugify(payload.name);
    }
    try {
      if (this.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", this.id);
        if (error)
          throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error)
          throw error;
      }
      this.router.navigate(["/admin/categories"]);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  slugify(text) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
  }
  static \u0275fac = function AdminCategoryFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCategoryFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCategoryFormPage, selectors: [["app-admin-category-form-page"]], decls: 62, vars: 13, consts: [[1, "max-w-4xl", "mx-auto", "text-base-content"], [1, "flex", "items-center", "gap-4", "mb-6"], ["routerLink", "/admin/categories", 1, "btn", "btn-circle", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left"], [1, "text-2xl", "font-bold", "text-green-600"], [3, "ngSubmit"], [1, "bg-base-100", "p-6", "rounded-xl", "shadow-sm", "border", "border-base-200", "mb-6", "text-base-content"], [1, "alert", "alert-error", "mb-6"], [1, "mb-4"], [1, "block", "text-sm", "font-medium", "text-base-content", "mb-1.5"], ["type", "text", "name", "name", "required", "", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "slug", "placeholder", "Se genera autom\xE1ticamente si se deja vac\xEDo", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["name", "description", "rows", "4", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-4"], ["type", "text", "name", "image_url", "placeholder", "Ej: fas fa-mobile-alt", 1, "flex-1", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [1, "w-12", "h-10", "flex", "items-center", "justify-center", "bg-base-200", "rounded-lg", "border", "border-base-300"], [1, "text-xl", "text-primary", 3, "class"], [1, "text-xs", "text-base-content/50"], [1, "text-xs", "text-base-content/60", "mt-1"], ["name", "type", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], ["value", "product"], ["value", "course"], ["value", "service"], ["name", "parent_id", 1, "w-full", "bg-base-100", "text-base-content", "border", "border-base-300", "rounded-lg", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "transition-all", "duration-200", "ease-in-out", "shadow-sm", "hover:border-base-content/40", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "mt-6"], [1, "flex", "items-center", "gap-3", "p-3", "bg-base-100", "border", "border-base-300", "rounded-lg", "hover:bg-base-200", "transition-colors", "cursor-pointer", "w-fit"], ["type", "checkbox", "name", "is_active", 1, "checkbox", "checkbox-primary", "h-5", "w-5", "rounded", "border-base-300", 3, "ngModelChange", "ngModel"], [1, "font-medium", "text-base-content"], [1, "flex", "justify-end", "gap-4", "mt-6"], ["routerLink", "/admin/categories", 1, "btn", "btn-error", "text-white"], ["type", "submit", 1, "btn", "btn-primary", "px-8", 3, "disabled"], [1, "loading", "loading-spinner", "loading-xs", "mr-2"], [1, "fas", "fa-exclamation-circle"], [1, "text-xl", "text-primary"], [3, "value"]], template: function AdminCategoryFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "form", 5);
      \u0275\u0275listener("ngSubmit", function AdminCategoryFormPage_Template_form_ngSubmit_6_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275conditionalCreate(8, AdminCategoryFormPage_Conditional_8_Template, 4, 1, "div", 7);
      \u0275\u0275elementStart(9, "div", 8)(10, "label", 9);
      \u0275\u0275text(11, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().name, $event) || (ctx.form().name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 8)(14, "label", 9);
      \u0275\u0275text(15, "Slug (URL)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().slug, $event) || (ctx.form().slug = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 8)(18, "label", 9);
      \u0275\u0275text(19, "Descripci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "textarea", 12);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_textarea_ngModelChange_20_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().description, $event) || (ctx.form().description = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 8)(22, "label", 9);
      \u0275\u0275text(23, "Icono (Font Awesome)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 13)(25, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().image_url, $event) || (ctx.form().image_url = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 15);
      \u0275\u0275conditionalCreate(27, AdminCategoryFormPage_Conditional_27_Template, 1, 2, "i", 16)(28, AdminCategoryFormPage_Conditional_28_Template, 2, 0, "span", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "p", 18);
      \u0275\u0275text(30, "Usa clases de Font Awesome (ej: fas fa-mobile-alt, fas fa-laptop)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 8)(32, "label", 9);
      \u0275\u0275text(33, "Tipo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "select", 19);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_select_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().type, $event) || (ctx.form().type = $event);
        return $event;
      });
      \u0275\u0275elementStart(35, "option", 20);
      \u0275\u0275text(36, "Producto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "option", 21);
      \u0275\u0275text(38, "Curso");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "option", 22);
      \u0275\u0275text(40, "Servicio");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(41, "div", 8)(42, "label", 9);
      \u0275\u0275text(43, "Categor\xEDa Padre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "select", 23);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_select_ngModelChange_44_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().parent_id, $event) || (ctx.form().parent_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(45, "option", 24);
      \u0275\u0275text(46, "Ninguna (Categor\xEDa Principal)");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(47, AdminCategoryFormPage_For_48_Template, 1, 1, null, null, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "p", 18);
      \u0275\u0275text(50, "Selecciona una categor\xEDa padre para anidar esta categor\xEDa dentro de ella.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "div", 25)(52, "label", 26)(53, "input", 27);
      \u0275\u0275twoWayListener("ngModelChange", function AdminCategoryFormPage_Template_input_ngModelChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form().is_active, $event) || (ctx.form().is_active = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "span", 28);
      \u0275\u0275text(55, "Activo");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(56, "div", 29)(57, "a", 30);
      \u0275\u0275text(58, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "button", 31);
      \u0275\u0275conditionalCreate(60, AdminCategoryFormPage_Conditional_60_Template, 1, 0, "span", 32);
      \u0275\u0275text(61, " Guardar ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("", ctx.id ? "Editar" : "Nueva", " Categor\xEDa");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 8 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().name);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().slug);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().description);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().image_url);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.form().image_url ? 27 : 28);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().type);
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().parent_id);
      \u0275\u0275advance();
      \u0275\u0275property("ngValue", null);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.categories());
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.form().is_active);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving() ? 60 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCategoryFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-category-form-page", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="max-w-4xl mx-auto text-base-content">\r
    <div class="flex items-center gap-4 mb-6">\r
        <a routerLink="/admin/categories" class="btn btn-circle btn-ghost text-base-content">\r
            <i class="fas fa-arrow-left"></i>\r
        </a>\r
        <h1 class="text-2xl font-bold text-green-600">{{ id ? 'Editar' : 'Nueva' }} Categor\xEDa</h1>\r
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
                <label class="block text-sm font-medium text-base-content mb-1.5">Descripci\xF3n</label>\r
                <textarea [(ngModel)]="form().description" name="description" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                    rows="4"></textarea>\r
            </div>\r
\r
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Icono (Font Awesome)</label>\r
                <div class="flex gap-4">\r
                    <input type="text" [(ngModel)]="form().image_url" name="image_url" class="flex-1 bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40"\r
                        placeholder="Ej: fas fa-mobile-alt">\r
                    <div class="w-12 h-10 flex items-center justify-center bg-base-200 rounded-lg border border-base-300">\r
                        @if (form().image_url) {\r
                            <i [class]="form().image_url" class="text-xl text-primary"></i>\r
                        } @else {\r
                            <span class="text-xs text-base-content/50">N/A</span>\r
                        }\r
                    </div>\r
                </div>\r
                <p class="text-xs text-base-content/60 mt-1">Usa clases de Font Awesome (ej: fas fa-mobile-alt, fas fa-laptop)</p>\r
            </div>\r
\r
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Tipo</label>\r
                <select [(ngModel)]="form().type" name="type" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
                    <option value="product">Producto</option>\r
                    <option value="course">Curso</option>\r
                    <option value="service">Servicio</option>\r
                </select>\r
            </div>\r
\r
            <div class="mb-4">\r
                <label class="block text-sm font-medium text-base-content mb-1.5">Categor\xEDa Padre</label>\r
                <select [(ngModel)]="form().parent_id" name="parent_id" class="w-full bg-base-100 text-base-content border border-base-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200 ease-in-out shadow-sm hover:border-base-content/40">\r
                    <option [ngValue]="null">Ninguna (Categor\xEDa Principal)</option>\r
                    @for (cat of categories(); track cat.id) {\r
                        @if (cat.id !== id) {\r
                            <option [value]="cat.id">{{ cat.name }}</option>\r
                        }\r
                    }\r
                </select>\r
                <p class="text-xs text-base-content/60 mt-1">Selecciona una categor\xEDa padre para anidar esta categor\xEDa dentro de ella.</p>\r
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
            <a routerLink="/admin/categories" class="btn btn-error text-white">Cancelar</a>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCategoryFormPage, { className: "AdminCategoryFormPage", filePath: "src/app/admin/categories/admin-category-form-page.ts", lineNumber: 13 });
})();
export {
  AdminCategoryFormPage
};
//# sourceMappingURL=chunk-DRMT3R2M.js.map
