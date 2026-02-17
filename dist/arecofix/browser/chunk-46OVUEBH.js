import {
  AdminPostService
} from "./chunk-FAV4RSLT.js";
import "./chunk-QVICQRN7.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  setClassMetadata,
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
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/posts/admin-post-form-page.ts
function AdminPostFormPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 9);
    \u0275\u0275text(1, " Guardando... ");
  }
}
function AdminPostFormPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 10);
    \u0275\u0275text(1, " Guardar ");
  }
}
function AdminPostFormPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementEnd();
  }
}
function AdminPostFormPage_Conditional_14_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275element(1, "img", 31);
    \u0275\u0275elementStart(2, "div", 32)(3, "button", 33);
    \u0275\u0275listener("click", function AdminPostFormPage_Conditional_14_Conditional_42_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.imagePreview = null;
      return \u0275\u0275resetView(ctx_r1.form.patchValue({ image: "" }));
    });
    \u0275\u0275element(4, "i", 34);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r1.imagePreview, \u0275\u0275sanitizeUrl);
  }
}
function AdminPostFormPage_Conditional_14_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 35);
    \u0275\u0275element(2, "i", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 37)(4, "label", 38)(5, "span");
    \u0275\u0275text(6, "Subir un archivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 39);
    \u0275\u0275listener("change", function AdminPostFormPage_Conditional_14_Conditional_43_Template_input_change_7_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFileSelected($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 40);
    \u0275\u0275text(9, "o arrastrar y soltar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 41);
    \u0275\u0275text(11, "PNG, JPG, GIF hasta 5MB");
    \u0275\u0275elementEnd()();
  }
}
function AdminPostFormPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 8)(1, "div", 12)(2, "div", 13)(3, "h3", 14);
    \u0275\u0275text(4, "Contenido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 15)(6, "div")(7, "label", 16);
    \u0275\u0275text(8, "T\xEDtulo");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div")(11, "label", 18);
    \u0275\u0275text(12, "Slug (URL)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 19)(14, "span", 20);
    \u0275\u0275text(15, " /posts/ ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "input", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div")(18, "label", 22);
    \u0275\u0275text(19, "Cuerpo");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "textarea", 23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 13)(22, "h3", 14);
    \u0275\u0275text(23, "SEO (Optimizaci\xF3n para buscadores)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 15)(25, "div")(26, "label", 24);
    \u0275\u0275text(27, "Meta T\xEDtulo");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 25);
    \u0275\u0275elementStart(29, "p", 26);
    \u0275\u0275text(30, "T\xEDtulo que aparecer\xE1 en Google.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div")(32, "label", 27);
    \u0275\u0275text(33, "Meta Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "textarea", 28);
    \u0275\u0275elementStart(35, "p", 26);
    \u0275\u0275text(36, "Breve descripci\xF3n para los resultados de b\xFAsqueda.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(37, "div", 0)(38, "div", 13)(39, "h3", 14);
    \u0275\u0275text(40, "Imagen Destacada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 15);
    \u0275\u0275conditionalCreate(42, AdminPostFormPage_Conditional_14_Conditional_42_Template, 5, 1, "div", 29)(43, AdminPostFormPage_Conditional_14_Conditional_43_Template, 12, 0, "div", 30);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(42);
    \u0275\u0275conditional(ctx_r1.imagePreview ? 42 : 43);
  }
}
var AdminPostFormPage = class _AdminPostFormPage {
  fb = inject(FormBuilder);
  postService = inject(AdminPostService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  form;
  loading = false;
  submitting = false;
  isEdit = false;
  postId = null;
  imagePreview = null;
  constructor() {
    this.form = this.fb.group({
      title: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      content: [""],
      published: [false],
      meta_title: [""],
      meta_description: [""],
      image: [""]
    });
  }
  async ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get("id");
    if (this.postId) {
      this.isEdit = true;
      await this.loadPost(this.postId);
    }
    this.form.get("title")?.valueChanges.subscribe((value) => {
      if (!this.isEdit && value && !this.form.get("slug")?.dirty) {
        this.form.patchValue({ slug: this.postService.slugify(value) });
      }
    });
  }
  async loadPost(id) {
    try {
      this.loading = true;
      const post = await this.postService.getPost(id);
      this.form.patchValue(post);
      this.imagePreview = post.image || null;
    } catch (error) {
      console.error("Error loading post", error);
      alert("Error al cargar la entrada");
      this.router.navigate(["/admin/posts"]);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
  async onFileSelected(event) {
    const file = event.target.files?.[0];
    if (file) {
      try {
        this.loading = true;
        const url = await this.postService.uploadImage(file);
        this.form.patchValue({ image: url });
        this.imagePreview = url;
      } catch (error) {
        console.error("Error uploading image", error);
        alert("Error al subir imagen");
      } finally {
        this.loading = false;
        this.cdr.markForCheck();
      }
    }
  }
  async onSubmit() {
    if (this.form.invalid)
      return;
    try {
      this.submitting = true;
      const payload = this.form.value;
      if (this.isEdit && this.postId) {
        await this.postService.updatePost(this.postId, payload);
      } else {
        await this.postService.createPost(payload);
      }
      this.router.navigate(["/admin/posts"]);
    } catch (error) {
      console.error("Error saving post", error);
      alert("Error al guardar: " + (error.message || error));
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
  static \u0275fac = function AdminPostFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPostFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPostFormPage, selectors: [["app-admin-post-form-page"]], decls: 15, vars: 5, consts: [[1, "space-y-6"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-start", "sm:items-center", "gap-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-green-400"], [1, "text-gray-500", "mt-1"], [1, "flex", "gap-3"], ["routerLink", "/admin/posts", 1, "px-4", "py-2", "border", "border-gray-300", "text-gray-700", "bg-white", "hover:bg-gray-50", "font-medium", "rounded-lg", "transition-colors"], [1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "font-medium", "rounded-lg", "transition-colors", "shadow-sm", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", 3, "click", "disabled"], [1, "flex", "justify-center", "p-12"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-6", 3, "formGroup"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white", "mr-2"], [1, "fas", "fa-save", "mr-2"], [1, "animate-spin", "rounded-full", "h-10", "w-10", "border-b-2", "border-indigo-600"], [1, "lg:col-span-2", "space-y-6"], [1, "bg-white", "rounded-xl", "shadow-sm", "border", "border-gray-200", "p-6"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4"], [1, "space-y-4"], ["for", "title", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "text", "id", "title", "formControlName", "title", "placeholder", "Ej: Servicio t\xE9cnico de celulares", 1, "w-full", "rounded-lg", "border-gray-300", "bg-white", "text-gray-900", "focus:border-indigo-500", "focus:ring-indigo-500", "shadow-sm", "transition-colors"], ["for", "slug", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], [1, "flex", "rounded-md", "shadow-sm"], [1, "inline-flex", "items-center", "px-3", "rounded-l-md", "border", "border-r-0", "border-gray-300", "bg-gray-50", "text-gray-500", "text-sm"], ["type", "text", "id", "slug", "formControlName", "slug", "placeholder", "servicio-tecnico", 1, "flex-1", "block", "w-full", "rounded-none", "rounded-r-md", "border-gray-300", "bg-white", "text-gray-900", "focus:border-indigo-500", "focus:ring-indigo-500", "sm:text-sm"], ["for", "content", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "content", "formControlName", "content", "rows", "15", "placeholder", "Escribe el contenido de tu entrada aqu\xED...", 1, "w-full", "rounded-lg", "border-gray-300", "bg-white", "text-gray-900", "focus:border-indigo-500", "focus:ring-indigo-500", "shadow-sm", "font-mono", "text-sm"], ["for", "meta_title", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "text", "id", "meta_title", "formControlName", "meta_title", 1, "w-full", "rounded-lg", "border-gray-300", "bg-white", "text-gray-900", "focus:border-indigo-500", "focus:ring-indigo-500", "shadow-sm"], [1, "mt-1", "text-xs", "text-gray-500"], ["for", "meta_description", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "meta_description", "formControlName", "meta_description", "rows", "3", 1, "w-full", "rounded-lg", "border-gray-300", "bg-white", "text-gray-900", "focus:border-indigo-500", "focus:ring-indigo-500", "shadow-sm"], [1, "relative", "group", "rounded-lg", "overflow-hidden", "border", "border-gray-200", "aspect-video", "bg-gray-100"], [1, "border-2", "border-dashed", "border-gray-300", "rounded-lg", "p-6", "text-center", "hover:border-indigo-500", "transition-colors", "bg-gray-50"], ["alt", "Preview", 1, "w-full", "h-full", "object-cover", 3, "src"], [1, "absolute", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100", "transition-opacity"], ["type", "button", 1, "p-2", "bg-red-600", "text-white", "rounded-full", "hover:bg-red-700", "transition-colors", 3, "click"], [1, "fas", "fa-trash"], [1, "mx-auto", "h-12", "w-12", "text-gray-400", "mb-3"], [1, "fas", "fa-image", "text-3xl"], [1, "text-sm", "text-gray-600"], ["for", "file-upload", 1, "relative", "cursor-pointer", "bg-white", "rounded-md", "font-medium", "text-indigo-600", "hover:text-indigo-500", "focus-within:outline-none", "focus-within:ring-2", "focus-within:ring-offset-2", "focus-within:ring-indigo-500"], ["id", "file-upload", "name", "file-upload", "type", "file", "accept", "image/*", 1, "sr-only", 3, "change"], [1, "pl-1"], [1, "text-xs", "text-gray-500", "mt-2"]], template: function AdminPostFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 4)(8, "a", 5);
      \u0275\u0275text(9, " Cancelar ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 6);
      \u0275\u0275listener("click", function AdminPostFormPage_Template_button_click_10_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275conditionalCreate(11, AdminPostFormPage_Conditional_11_Template, 2, 0)(12, AdminPostFormPage_Conditional_12_Template, 2, 0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(13, AdminPostFormPage_Conditional_13_Template, 2, 0, "div", 7)(14, AdminPostFormPage_Conditional_14_Template, 44, 2, "form", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.isEdit ? "Editar Entrada" : "Nueva Entrada");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.isEdit ? "Modifica los detalles de la entrada" : "Crea una nueva entrada para el blog");
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.form.invalid || ctx.submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.submitting ? 11 : 12);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading ? 13 : 14);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPostFormPage, [{
    type: Component,
    args: [{ selector: "app-admin-post-form-page", standalone: true, imports: [ReactiveFormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="space-y-6">\r
    <!-- Header -->\r
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">\r
        <div>\r
            <h1 class="text-2xl font-bold text-gray-900 dark:text-green-400">{{ isEdit ? 'Editar Entrada' : 'Nueva Entrada' }}</h1>\r
            <p class="text-gray-500 mt-1">{{ isEdit ? 'Modifica los detalles de la entrada' : 'Crea una nueva entrada\r
                para el blog' }}</p>\r
        </div>\r
        <div class="flex gap-3">\r
            <a routerLink="/admin/posts"\r
                class="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors">\r
                Cancelar\r
            </a>\r
            <button (click)="onSubmit()" [disabled]="form.invalid || submitting"\r
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center">\r
                @if (submitting) {\r
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>\r
                Guardando...\r
                } @else {\r
                <i class="fas fa-save mr-2"></i>\r
                Guardar\r
                }\r
            </button>\r
        </div>\r
    </div>\r
\r
    @if (loading) {\r
    <div class="flex justify-center p-12">\r
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>\r
    </div>\r
    } @else {\r
    <form [formGroup]="form" class="grid grid-cols-1 lg:grid-cols-3 gap-6">\r
        <!-- Main Content (Left Column) -->\r
        <div class="lg:col-span-2 space-y-6">\r
            <!-- General Info Card -->\r
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">\r
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Contenido</h3>\r
\r
                <div class="space-y-4">\r
                    <div>\r
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">T\xEDtulo</label>\r
                        <input type="text" id="title" formControlName="title"\r
                            class="w-full rounded-lg border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-colors"\r
                            placeholder="Ej: Servicio t\xE9cnico de celulares">\r
                    </div>\r
\r
                    <div>\r
                        <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>\r
                        <div class="flex rounded-md shadow-sm">\r
                            <span\r
                                class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">\r
                                /posts/\r
                            </span>\r
                            <input type="text" id="slug" formControlName="slug"\r
                                class="flex-1 block w-full rounded-none rounded-r-md border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"\r
                                placeholder="servicio-tecnico">\r
                        </div>\r
                    </div>\r
\r
                    <div>\r
                        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Cuerpo</label>\r
                        <textarea id="content" formControlName="content" rows="15"\r
                            class="w-full rounded-lg border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono text-sm"\r
                            placeholder="Escribe el contenido de tu entrada aqu\xED..."></textarea>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- SEO Card -->\r
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">\r
                <h3 class="text-lg font-semibold text-gray-900 mb-4">SEO (Optimizaci\xF3n para buscadores)</h3>\r
\r
                <div class="space-y-4">\r
                    <div>\r
                        <label for="meta_title" class="block text-sm font-medium text-gray-700 mb-1">Meta T\xEDtulo</label>\r
                        <input type="text" id="meta_title" formControlName="meta_title"\r
                            class="w-full rounded-lg border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm">\r
                        <p class="mt-1 text-xs text-gray-500">T\xEDtulo que aparecer\xE1 en Google.</p>\r
                    </div>\r
\r
                    <div>\r
                        <label for="meta_description" class="block text-sm font-medium text-gray-700 mb-1">Meta\r
                            Descripci\xF3n</label>\r
                        <textarea id="meta_description" formControlName="meta_description" rows="3"\r
                            class="w-full rounded-lg border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"></textarea>\r
                        <p class="mt-1 text-xs text-gray-500">Breve descripci\xF3n para los resultados de b\xFAsqueda.</p>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Sidebar (Right Column) -->\r
        <div class="space-y-6">\r
            <!-- Image Card -->\r
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">\r
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Imagen Destacada</h3>\r
\r
                <div class="space-y-4">\r
                    @if (imagePreview) {\r
                    <div\r
                        class="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">\r
                        <img [src]="imagePreview" alt="Preview" class="w-full h-full object-cover">\r
                        <div\r
                            class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">\r
                            <button type="button" (click)="imagePreview = null; form.patchValue({image: ''})"\r
                                class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">\r
                                <i class="fas fa-trash"></i>\r
                            </button>\r
                        </div>\r
                    </div>\r
                    } @else {\r
                    <div\r
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors bg-gray-50">\r
                        <div class="mx-auto h-12 w-12 text-gray-400 mb-3">\r
                            <i class="fas fa-image text-3xl"></i>\r
                        </div>\r
                        <div class="text-sm text-gray-600">\r
                            <label for="file-upload"\r
                                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">\r
                                <span>Subir un archivo</span>\r
                                <input id="file-upload" name="file-upload" type="file" class="sr-only"\r
                                    (change)="onFileSelected($event)" accept="image/*">\r
                            </label>\r
                            <p class="pl-1">o arrastrar y soltar</p>\r
                        </div>\r
                        <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 5MB</p>\r
                    </div>\r
                    }\r
                </div>\r
            </div>\r
        </div>\r
    </form>\r
    }\r
</div>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPostFormPage, { className: "AdminPostFormPage", filePath: "src/app/admin/posts/admin-post-form-page.ts", lineNumber: 13 });
})();
export {
  AdminPostFormPage
};
//# sourceMappingURL=chunk-46OVUEBH.js.map
