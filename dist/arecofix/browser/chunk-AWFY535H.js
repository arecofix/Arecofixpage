import {
  CoursesService
} from "./chunk-BBCBDIYF.js";
import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/courses/admin-course-form-page.ts
function AdminCourseFormPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "El t\xEDtulo es requerido");
    \u0275\u0275elementEnd();
  }
}
function AdminCourseFormPage_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275element(1, "img", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.getImageSrc((tmp_1_0 = ctx_r0.form.get("image_url")) == null ? null : tmp_1_0.value), \u0275\u0275sanitizeUrl);
  }
}
function AdminCourseFormPage_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 42);
  }
}
var AdminCourseFormPage = class _AdminCourseFormPage {
  fb = inject(FormBuilder);
  coursesService = inject(CoursesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  form;
  isEditing = false;
  courseId = null;
  saving = false;
  constructor() {
    this.form = this.fb.group({
      title: ["", Validators.required],
      slug: ["", Validators.required],
      description: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      sale_price: [null],
      level: ["B\xE1sico", Validators.required],
      duration: ["", Validators.required],
      schedule: ["", Validators.required],
      image_url: ["", Validators.required],
      is_active: [true]
    });
  }
  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("id");
    if (this.courseId) {
      this.isEditing = true;
      this.loadCourse(this.courseId);
    }
  }
  getImageSrc(url) {
    if (!url)
      return "";
    if (url.startsWith("http") || url.startsWith("/")) {
      return url;
    }
    return "/" + url;
  }
  async onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file)
      return;
    this.saving = true;
    this.cdr.markForCheck();
    const supabase = this.auth.getSupabaseClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `courses/${fileName}`;
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Tiempo de espera agotado al subir la imagen")), 15e3));
      const uploadPromise = supabase.storage.from("public-assets").upload(filePath, file);
      const { data, error } = await Promise.race([uploadPromise, timeout]);
      if (error)
        throw error;
      const { data: publicUrl } = supabase.storage.from("public-assets").getPublicUrl(filePath);
      this.form.patchValue({ image_url: publicUrl.publicUrl });
      this.cdr.markForCheck();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen: " + (error.message || error));
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
      if (event.target)
        event.target.value = "";
    }
  }
  loadCourse(id) {
    this.coursesService.getCourseById(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.form.patchValue(response.data);
        }
      },
      error: (err) => console.error("Error loading course", err)
    });
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    this.saving = true;
    const courseData = this.form.value;
    const request = this.isEditing && this.courseId ? this.coursesService.updateCourse(this.courseId, courseData) : this.coursesService.createCourse(courseData);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(["/admin/courses"]);
      },
      error: (err) => {
        console.error("Error saving course", err);
        alert("Error al guardar: " + err.message);
        this.saving = false;
      }
    });
  }
  static \u0275fac = function AdminCourseFormPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCourseFormPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCourseFormPage, selectors: [["app-admin-course-form-page"]], decls: 101, vars: 7, consts: [[1, "max-w-4xl", "mx-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-base-content"], ["routerLink", "/admin/courses", 1, "btn", "btn-ghost", "text-base-content"], [1, "fas", "fa-arrow-left", "mr-2"], [1, "card", "bg-base-100", "shadow-xl", "border", "border-base-200"], [1, "card-body", "p-8"], [1, "space-y-6", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "form-control"], [1, "label"], [1, "label-text", "font-medium", "text-base-content/80"], [1, "input", "input-bordered", "flex", "items-center", "gap-2", "bg-base-100", "text-base-content"], [1, "fas", "fa-heading", "text-base-content/50"], ["type", "text", "formControlName", "title", "placeholder", "Ej: Reparaci\xF3n de iPhone", 1, "grow", "placeholder:text-base-content/30"], [1, "text-error", "text-xs", "mt-1"], [1, "fas", "fa-link", "text-base-content/50"], ["type", "text", "formControlName", "slug", "placeholder", "ej: reparacion-iphone", 1, "grow", "placeholder:text-base-content/30"], [1, "label-text-alt", "text-xs", "text-base-content/50"], ["formControlName", "description", "placeholder", "Breve resumen del curso...", 1, "textarea", "textarea-bordered", "h-24", "leading-relaxed", "bg-base-100", "text-base-content", "placeholder:text-base-content/30"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "fas", "fa-dollar-sign", "text-base-content/50"], ["type", "number", "formControlName", "price", 1, "grow", "placeholder:text-base-content/30"], [1, "fas", "fa-tag", "text-base-content/50"], ["type", "number", "formControlName", "sale_price", 1, "grow", "placeholder:text-base-content/30"], ["formControlName", "level", 1, "select", "select-bordered", "w-full", "bg-base-100", "text-base-content"], ["value", "B\xE1sico"], ["value", "Intermedio"], ["value", "Avanzado"], ["value", "Todos los niveles"], [1, "fas", "fa-clock", "text-base-content/50"], ["type", "text", "formControlName", "duration", "placeholder", "Ej: 3 meses", 1, "grow", "placeholder:text-base-content/30"], [1, "fas", "fa-calendar-alt", "text-base-content/50"], ["type", "text", "formControlName", "schedule", "placeholder", "Ej: Lunes 18hs", 1, "grow", "placeholder:text-base-content/30"], [1, "flex", "flex-col", "gap-4"], ["type", "text", "formControlName", "image_url", "placeholder", "https://...", 1, "grow", "placeholder:text-base-content/30"], ["type", "file", "accept", "image/*", 1, "file-input", "file-input-bordered", "w-full", "bg-base-100", "text-base-content", 3, "change"], [1, "mt-4", "p-4", "border", "rounded-lg", "bg-base-200", "flex", "justify-center", "relative", "group"], [1, "label", "cursor-pointer", "justify-start", "gap-4", "p-0"], ["type", "checkbox", "formControlName", "is_active", 1, "toggle", "toggle-success"], [1, "flex", "justify-end", "gap-4", "pt-6", "border-t", "border-base-200"], ["type", "submit", 1, "btn", "btn-primary", "px-8", "text-white", 3, "disabled"], [1, "loading", "loading-spinner"], ["alt", "Preview", "onerror", "this.style.display='none'", 1, "h-48", "rounded", "object-cover", "shadow-sm", 3, "src"]], template: function AdminCourseFormPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "a", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275text(6, " Volver ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5)(8, "div", 6)(9, "form", 7);
      \u0275\u0275listener("ngSubmit", function AdminCourseFormPage_Template_form_ngSubmit_9_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "label", 10)(13, "span", 11);
      \u0275\u0275text(14, "T\xEDtulo");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "label", 12);
      \u0275\u0275element(16, "i", 13)(17, "input", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(18, AdminCourseFormPage_Conditional_18_Template, 2, 0, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 9)(20, "label", 10)(21, "span", 11);
      \u0275\u0275text(22, "Slug (URL)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "label", 12);
      \u0275\u0275element(24, "i", 16)(25, "input", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "label", 10)(27, "span", 18);
      \u0275\u0275text(28, "Identificador \xFAnico para la URL");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(29, "div", 9)(30, "label", 10)(31, "span", 11);
      \u0275\u0275text(32, "Descripci\xF3n Corta");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(33, "textarea", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 20)(35, "div", 9)(36, "label", 10)(37, "span", 11);
      \u0275\u0275text(38, "Precio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "label", 12);
      \u0275\u0275element(40, "i", 21)(41, "input", 22);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 9)(43, "label", 10)(44, "span", 11);
      \u0275\u0275text(45, "Precio Oferta (Opcional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "label", 12);
      \u0275\u0275element(47, "i", 23)(48, "input", 24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 9)(50, "label", 10)(51, "span", 11);
      \u0275\u0275text(52, "Nivel");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "select", 25)(54, "option", 26);
      \u0275\u0275text(55, "B\xE1sico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "option", 27);
      \u0275\u0275text(57, "Intermedio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "option", 28);
      \u0275\u0275text(59, "Avanzado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "option", 29);
      \u0275\u0275text(61, "Todos los niveles");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(62, "div", 8)(63, "div", 9)(64, "label", 10)(65, "span", 11);
      \u0275\u0275text(66, "Duraci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "label", 12);
      \u0275\u0275element(68, "i", 30)(69, "input", 31);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(70, "div", 9)(71, "label", 10)(72, "span", 11);
      \u0275\u0275text(73, "Horario");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(74, "label", 12);
      \u0275\u0275element(75, "i", 32)(76, "input", 33);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(77, "div", 9)(78, "label", 10)(79, "span", 11);
      \u0275\u0275text(80, "Imagen del Curso");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "div", 34)(82, "label", 12);
      \u0275\u0275element(83, "i", 16)(84, "input", 35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "input", 36);
      \u0275\u0275listener("change", function AdminCourseFormPage_Template_input_change_85_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "label", 10)(87, "span", 18);
      \u0275\u0275text(88, "Sube una imagen o pega una URL");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(89, AdminCourseFormPage_Conditional_89_Template, 2, 1, "div", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(90, "div", 9)(91, "label", 38)(92, "span", 11);
      \u0275\u0275text(93, "Curso Activo");
      \u0275\u0275elementEnd();
      \u0275\u0275element(94, "input", 39);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 40)(96, "a", 3);
      \u0275\u0275text(97, "Cancelar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "button", 41);
      \u0275\u0275conditionalCreate(99, AdminCourseFormPage_Conditional_99_Template, 1, 0, "span", 42);
      \u0275\u0275text(100);
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.isEditing ? "Editar Curso" : "Nuevo Curso", " ");
      \u0275\u0275advance(6);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(9);
      \u0275\u0275conditional(((tmp_2_0 = ctx.form.get("title")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.form.get("title")) == null ? null : tmp_2_0.touched) ? 18 : -1);
      \u0275\u0275advance(71);
      \u0275\u0275conditional(((tmp_3_0 = ctx.form.get("image_url")) == null ? null : tmp_3_0.value) ? 89 : -1);
      \u0275\u0275advance(9);
      \u0275\u0275property("disabled", ctx.saving);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.saving ? 99 : -1);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.isEditing ? "Actualizar" : "Crear Curso", " ");
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCourseFormPage, [{
    type: Component,
    args: [{
      selector: "app-admin-course-form-page",
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule, RouterLink],
      template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-base-content">
          {{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}
        </h2>
        <a routerLink="/admin/courses" class="btn btn-ghost text-base-content">
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </a>
      </div>
    
      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body p-8">
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
        
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">T\xEDtulo</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-heading text-base-content/50"></i>
                  <input type="text" formControlName="title" class="grow placeholder:text-base-content/30" placeholder="Ej: Reparaci\xF3n de iPhone" />
                </label>
                @if (form.get('title')?.invalid && form.get('title')?.touched) {
                  <span class="text-error text-xs mt-1">El t\xEDtulo es requerido</span>
                }
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Slug (URL)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-link text-base-content/50"></i>
                  <input type="text" formControlName="slug" class="grow placeholder:text-base-content/30" placeholder="ej: reparacion-iphone" />
                </label>
                <label class="label">
                  <span class="label-text-alt text-xs text-base-content/50">Identificador \xFAnico para la URL</span>
                </label>
              </div>
            </div>
        
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-base-content/80">Descripci\xF3n Corta</span>
              </label>
              <textarea formControlName="description" class="textarea textarea-bordered h-24 leading-relaxed bg-base-100 text-base-content placeholder:text-base-content/30" placeholder="Breve resumen del curso..."></textarea>
            </div>
        
            <!-- Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Precio</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-dollar-sign text-base-content/50"></i>
                  <input type="number" formControlName="price" class="grow placeholder:text-base-content/30" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Precio Oferta (Opcional)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-tag text-base-content/50"></i>
                  <input type="number" formControlName="sale_price" class="grow placeholder:text-base-content/30" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Nivel</span>
                </label>
                <select formControlName="level" class="select select-bordered w-full bg-base-100 text-base-content">
                  <option value="B\xE1sico">B\xE1sico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Todos los niveles">Todos los niveles</option>
                </select>
              </div>
            </div>
        
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Duraci\xF3n</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-clock text-base-content/50"></i>
                  <input type="text" formControlName="duration" class="grow placeholder:text-base-content/30" placeholder="Ej: 3 meses" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Horario</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-calendar-alt text-base-content/50"></i>
                  <input type="text" formControlName="schedule" class="grow placeholder:text-base-content/30" placeholder="Ej: Lunes 18hs" />
                </label>
              </div>
            </div>
        
            <!-- Media -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-base-content/80">Imagen del Curso</span>
              </label>
              
              <div class="flex flex-col gap-4">
                <!-- URL Input (Optional fallback) -->
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-link text-base-content/50"></i>
                  <input type="text" formControlName="image_url" class="grow placeholder:text-base-content/30" placeholder="https://..." />
                </label>

                <!-- File Upload -->
                <input type="file" 
                       (change)="onFileChange($event)" 
                       accept="image/*"
                       class="file-input file-input-bordered w-full bg-base-100 text-base-content" />
                
                <label class="label">
                  <span class="label-text-alt text-xs text-base-content/50">Sube una imagen o pega una URL</span>
                </label>
              </div>

              @if (form.get('image_url')?.value) {
                <div class="mt-4 p-4 border rounded-lg bg-base-200 flex justify-center relative group">
                  <img [src]="getImageSrc(form.get('image_url')?.value)" 
                       class="h-48 rounded object-cover shadow-sm" 
                       alt="Preview" 
                       onerror="this.style.display='none'" />
                </div>
              }
            </div>
        
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4 p-0">
                <span class="label-text font-medium text-base-content/80">Curso Activo</span>
                <input type="checkbox" formControlName="is_active" class="toggle toggle-success" />
              </label>
            </div>
        
            <!-- Actions -->
            <div class="flex justify-end gap-4 pt-6 border-t border-base-200">
              <a routerLink="/admin/courses" class="btn btn-ghost text-base-content">Cancelar</a>
              <button type="submit" class="btn btn-primary px-8 text-white" [disabled]="saving">
                @if (saving) {
                  <span class="loading loading-spinner"></span>
                }
                {{ isEditing ? 'Actualizar' : 'Crear Curso' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `
    }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCourseFormPage, { className: "AdminCourseFormPage", filePath: "src/app/admin/courses/admin-course-form-page.ts", lineNumber: 178 });
})();
export {
  AdminCourseFormPage
};
//# sourceMappingURL=chunk-AWFY535H.js.map
