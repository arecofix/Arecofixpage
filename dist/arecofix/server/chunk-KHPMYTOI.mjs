import './polyfills.server.mjs';
import {
  CoursesService
} from "./chunk-7B4D7JPC.mjs";
import "./chunk-PUVRELIK.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  CurrencyPipe,
  RouterLink
} from "./chunk-JEV3MPEL.mjs";
import {
  ChangeDetectorRef,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DXH6IVIR.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/admin/courses/admin-courses-page.ts
var _c0 = (a0) => ["/admin/courses", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminCoursesPage_For_24_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const course_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Oferta: ", \u0275\u0275pipeBind1(2, 1, course_r3.sale_price), " ");
  }
}
function AdminCoursesPage_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 8)(3, "div", 9)(4, "img", 10);
    \u0275\u0275listener("error", function AdminCoursesPage_For_24_Template_img_error_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.handleImageError($event));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(5, "td")(6, "div", 11);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 12);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275element(13, "br");
    \u0275\u0275conditionalCreate(14, AdminCoursesPage_For_24_Conditional_14_Template, 3, 3, "span", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td")(18, "div", 14);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td")(21, "div", 15)(22, "a", 16);
    \u0275\u0275element(23, "i", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 18);
    \u0275\u0275listener("click", function AdminCoursesPage_For_24_Template_button_click_24_listener() {
      const course_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteCourse(course_r3));
    });
    \u0275\u0275element(25, "i", 19);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const course_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r1.getImageSrc(course_r3.image_url), \u0275\u0275sanitizeUrl)("alt", course_r3.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(course_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(course_r3.slug);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(12, 13, course_r3.price), " ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(course_r3.sale_price ? 14 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(course_r3.level);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", course_r3.is_active)("badge-ghost", !course_r3.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", course_r3.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(15, _c0, course_r3.id));
  }
}
function AdminCoursesPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 20);
    \u0275\u0275text(2, " No hay cursos registrados. ");
    \u0275\u0275elementEnd()();
  }
}
function AdminCoursesPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "span", 21);
    \u0275\u0275elementEnd();
  }
}
var AdminCoursesPage = class _AdminCoursesPage {
  coursesService = inject(CoursesService);
  cdr = inject(ChangeDetectorRef);
  courses = signal([], ...ngDevMode ? [{ debugName: "courses" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  ngOnInit() {
    this.loadCourses();
  }
  loadCourses() {
    this.loading.set(true);
    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.courses.set(response.data || []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Error loading courses", err);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }
  async deleteCourse(course) {
    if (!confirm(`\xBFEst\xE1s seguro de eliminar el curso "${course.title}"?`))
      return;
    this.coursesService.deleteCourse(course.id).subscribe({
      next: () => {
        this.courses.update((current) => current.filter((c) => c.id !== course.id));
        this.cdr.markForCheck();
      },
      error: (err) => alert("Error al eliminar el curso: " + err.message)
    });
  }
  handleImageError(event) {
    event.target.src = "/assets/img/cursos/1.jpg";
  }
  getImageSrc(url) {
    if (!url)
      return "assets/placeholder.png";
    if (url.startsWith("http") || url.startsWith("/")) {
      return url;
    }
    return "/" + url;
  }
  static \u0275fac = function AdminCoursesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCoursesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCoursesPage, selectors: [["app-admin-courses-page"]], decls: 27, vars: 2, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/courses/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "overflow-x-auto", "bg-base-100", "rounded-lg", "shadow", "text-base-content"], [1, "table", "w-full"], [1, "text-base-content"], [1, "flex", "justify-center", "py-8"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12"], [3, "error", "src", "alt"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "text-xs", "text-green-600"], [1, "badge"], [1, "flex", "gap-2"], [1, "btn", "btn-sm", "btn-square", "btn-ghost", "text-blue-600", 3, "routerLink"], [1, "fas", "fa-edit"], [1, "btn", "btn-sm", "btn-square", "btn-ghost", "text-red-600", 3, "click"], [1, "fas", "fa-trash"], ["colspan", "6", 1, "text-center", "py-8", "text-gray-500"], [1, "loading", "loading-spinner", "loading-lg"]], template: function AdminCoursesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2", 1);
      \u0275\u0275text(2, "Administrar Cursos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nuevo Curso ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "table", 5)(8, "thead")(9, "tr", 6)(10, "th");
      \u0275\u0275text(11, "Imagen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "th");
      \u0275\u0275text(13, "T\xEDtulo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "th");
      \u0275\u0275text(15, "Precio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "th");
      \u0275\u0275text(17, "Nivel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "th");
      \u0275\u0275text(19, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "th");
      \u0275\u0275text(21, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(22, "tbody");
      \u0275\u0275repeaterCreate(23, AdminCoursesPage_For_24_Template, 26, 17, "tr", null, _forTrack0);
      \u0275\u0275conditionalCreate(25, AdminCoursesPage_Conditional_25_Template, 3, 0, "tr");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(26, AdminCoursesPage_Conditional_26_Template, 2, 0, "div", 7);
    }
    if (rf & 2) {
      \u0275\u0275advance(23);
      \u0275\u0275repeater(ctx.courses());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.courses().length === 0 && !ctx.loading() ? 25 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 26 : -1);
    }
  }, dependencies: [CommonModule, RouterLink, CurrencyPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCoursesPage, [{
    type: Component,
    args: [{
      selector: "app-admin-courses-page",
      standalone: true,
      imports: [CommonModule, RouterLink],
      template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-green-600">Administrar Cursos</h2>
      <a routerLink="/admin/courses/new" class="btn btn-primary">
        <i class="fas fa-plus mr-2"></i> Nuevo Curso
      </a>
    </div>
    
    <div class="overflow-x-auto bg-base-100 rounded-lg shadow text-base-content">
      <table class="table w-full">
        <thead>
          <tr class="text-base-content">
            <th>Imagen</th>
            <th>T\xEDtulo</th>
            <th>Precio</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (course of courses(); track course.id) {
            <tr>
              <td>
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img [src]="getImageSrc(course.image_url)" 
                         [alt]="course.title"
                         (error)="handleImageError($event)" />
                  </div>
                </div>
              </td>
              <td>
                <div class="font-bold">{{course.title}}</div>
                <div class="text-sm opacity-50">{{course.slug}}</div>
              </td>
              <td>
                {{course.price | currency}}
                <br/>
                @if (course.sale_price) {
                  <span class="text-xs text-green-600">
                    Oferta: {{course.sale_price | currency}}
                  </span>
                }
              </td>
              <td>{{course.level}}</td>
              <td>
                <div class="badge" [class.badge-success]="course.is_active" [class.badge-ghost]="!course.is_active">
                  {{course.is_active ? 'Activo' : 'Inactivo'}}
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <a [routerLink]="['/admin/courses', course.id]" class="btn btn-sm btn-square btn-ghost text-blue-600">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button (click)="deleteCourse(course)" class="btn btn-sm btn-square btn-ghost text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          }
          @if (courses().length === 0 && !loading()) {
            <tr>
              <td colspan="6" class="text-center py-8 text-gray-500">
                No hay cursos registrados.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    
    @if (loading()) {
      <div class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    }
    `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCoursesPage, { className: "AdminCoursesPage", filePath: "src/app/admin/courses/admin-courses-page.ts", lineNumber: 91 });
})();
export {
  AdminCoursesPage
};
//# sourceMappingURL=chunk-KHPMYTOI.mjs.map
