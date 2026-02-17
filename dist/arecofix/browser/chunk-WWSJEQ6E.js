import {
  CoursesService
} from "./chunk-BBCBDIYF.js";
import {
  SeoService
} from "./chunk-WS7FSRNX.js";
import {
  IsErrorComponent,
  IsLoadingComponent
} from "./chunk-QH5M5CS5.js";
import {
  PaginationService
} from "./chunk-YKKGU7Z3.js";
import {
  Pagination
} from "./chunk-O2M4FZEU.js";
import {
  rxResource
} from "./chunk-D3DVUTQW.js";
import "./chunk-GT5IWTCB.js";
import {
  CategoryService
} from "./chunk-QTLDSSZK.js";
import "./chunk-QVICQRN7.js";
import {
  ProductCard
} from "./chunk-GG5PJ5DF.js";
import "./chunk-D636JDKS.js";
import {
  ProductService
} from "./chunk-R76FT5FB.js";
import "./chunk-2WPTPN3R.js";
import "./chunk-ZQZGROR7.js";
import "./chunk-Y2OIOFIB.js";
import {
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
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import {
  environment
} from "./chunk-3R5MH5C6.js";
import {
  CommonModule,
  CurrencyPipe,
  RouterLink,
  RouterModule
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  Component,
  catchError,
  computed,
  inject,
  of,
  setClassMetadata,
  signal,
  switchMap,
  timeout,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction1,
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
} from "./chunk-K7T46PVE.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/public/cursos/cursos.ts
var _c0 = (a0) => ["/academy", a0];
var _forTrack0 = ($index, $item) => $item.title;
var _forTrack1 = ($index, $item) => $item.id;
function CursosComponent_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div");
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 35);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const benefit_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mb-3 md:mb-6 transition-transform group-hover:scale-110 " + benefit_r1.color);
    \u0275\u0275advance();
    \u0275\u0275classMap(benefit_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(benefit_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", benefit_r1.description, " ");
  }
}
function CursosComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "span", 37);
    \u0275\u0275elementEnd();
  }
}
function CursosComponent_Conditional_34_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39);
    \u0275\u0275element(2, "div", 40)(3, "img", 41);
    \u0275\u0275elementStart(4, "div", 42)(5, "span", 43);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 44)(8, "h3", 45);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 46);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 47)(13, "div", 48)(14, "div", 49);
    \u0275\u0275element(15, "i", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 48)(19, "div", 51);
    \u0275\u0275element(20, "i", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 53);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 54)(24, "div", 55)(25, "span", 56);
    \u0275\u0275text(26, "Inversi\xF3n Mensual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 57);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "a", 58);
    \u0275\u0275text(31, " Ver Detalle ");
    \u0275\u0275element(32, "i", 59);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const course_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("src", course_r2.image_url, \u0275\u0275sanitizeUrl)("alt", course_r2.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", course_r2.level, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", course_r2.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", course_r2.description, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(course_r2.duration);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(course_r2.schedule);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(29, 9, course_r2.price, "ARS", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(14, _c0, course_r2.slug));
  }
}
function CursosComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275repeaterCreate(1, CursosComponent_Conditional_34_For_2_Template, 33, 16, "div", 38, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.courses());
  }
}
function CursosComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-loading");
  }
}
function CursosComponent_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error");
  }
}
function CursosComponent_Conditional_56_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "product-card", 61);
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    \u0275\u0275property("product", product_r4);
  }
}
function CursosComponent_Conditional_56_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275element(1, "pagination", 63);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx.pages)("currentPage", ctx_r2.paginationService.currentPage());
  }
}
function CursosComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275repeaterCreate(1, CursosComponent_Conditional_56_For_2_Template, 1, 1, "product-card", 61, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CursosComponent_Conditional_56_Conditional_3_Template, 2, 2, "div", 62);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.productsRs.value().data);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.paginationData()) ? 3 : -1, tmp_2_0);
  }
}
function CursosComponent_Conditional_57_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71)(1, "p", 74);
    \u0275\u0275text(2, "Est\xE1s aplicando a:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4", 75);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r2.selectedCourse()) == null ? null : tmp_2_0.title);
  }
}
function CursosComponent_Conditional_57_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 72)(1, "div", 76);
    \u0275\u0275element(2, "i", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 78);
    \u0275\u0275text(4, "\xA1Solicitud Recibida!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 79);
    \u0275\u0275text(6, " Gracias por tu inter\xE9s. Un asesor te contactar\xE1 por WhatsApp para confirmar tu vacante y coordinar el pago. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 80);
    \u0275\u0275listener("click", function CursosComponent_Conditional_57_Conditional_9_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeRegistration());
    });
    \u0275\u0275text(8, " Entendido ");
    \u0275\u0275elementEnd()();
  }
}
function CursosComponent_Conditional_57_Conditional_10_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.registrationError(), " ");
  }
}
function CursosComponent_Conditional_57_Conditional_10_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 90);
    \u0275\u0275text(1, " Enviando... ");
  }
}
function CursosComponent_Conditional_57_Conditional_10_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Enviar Solicitud ");
  }
}
function CursosComponent_Conditional_57_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 81);
    \u0275\u0275listener("ngSubmit", function CursosComponent_Conditional_57_Conditional_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.submitRegistration());
    });
    \u0275\u0275elementStart(1, "div", 82)(2, "label", 83)(3, "span", 84);
    \u0275\u0275text(4, "Nombre Completo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "input", 85);
    \u0275\u0275twoWayListener("ngModelChange", function CursosComponent_Conditional_57_Conditional_10_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.registrationForm.full_name, $event) || (ctx_r2.registrationForm.full_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 82)(7, "label", 83)(8, "span", 84);
    \u0275\u0275text(9, "WhatsApp");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "input", 86);
    \u0275\u0275twoWayListener("ngModelChange", function CursosComponent_Conditional_57_Conditional_10_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.registrationForm.phone, $event) || (ctx_r2.registrationForm.phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 82)(12, "label", 83)(13, "span", 84);
    \u0275\u0275text(14, "Correo Electr\xF3nico");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "input", 87);
    \u0275\u0275twoWayListener("ngModelChange", function CursosComponent_Conditional_57_Conditional_10_Template_input_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.registrationForm.email, $event) || (ctx_r2.registrationForm.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, CursosComponent_Conditional_57_Conditional_10_Conditional_16_Template, 2, 1, "div", 88);
    \u0275\u0275elementStart(17, "button", 89);
    \u0275\u0275conditionalCreate(18, CursosComponent_Conditional_57_Conditional_10_Conditional_18_Template, 2, 0)(19, CursosComponent_Conditional_57_Conditional_10_Conditional_19_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.registrationForm.full_name);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.registrationForm.phone);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.registrationForm.email);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.registrationError() ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.isRegistering());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isRegistering() ? 18 : 19);
  }
}
function CursosComponent_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275listener("click", function CursosComponent_Conditional_57_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeRegistration());
    });
    \u0275\u0275elementStart(1, "div", 65);
    \u0275\u0275listener("click", function CursosComponent_Conditional_57_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 66)(3, "h3", 67);
    \u0275\u0275text(4, "Inscripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 68);
    \u0275\u0275listener("click", function CursosComponent_Conditional_57_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeRegistration());
    });
    \u0275\u0275element(6, "i", 69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 70);
    \u0275\u0275conditionalCreate(8, CursosComponent_Conditional_57_Conditional_8_Template, 5, 1, "div", 71);
    \u0275\u0275conditionalCreate(9, CursosComponent_Conditional_57_Conditional_9_Template, 9, 0, "div", 72)(10, CursosComponent_Conditional_57_Conditional_10_Template, 20, 6, "form", 73);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r2.selectedCourse() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.registrationSuccess() ? 9 : 10);
  }
}
var CursosComponent = class _CursosComponent {
  seoService = inject(SeoService);
  coursesService = inject(CoursesService);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  paginationService = inject(PaginationService);
  whatsappNumber = environment.contact.whatsappNumber;
  // Signals for State
  courses = signal([], ...ngDevMode ? [{ debugName: "courses" }] : []);
  isLoadingCourses = signal(true, ...ngDevMode ? [{ debugName: "isLoadingCourses" }] : []);
  coursesError = signal(null, ...ngDevMode ? [{ debugName: "coursesError" }] : []);
  // Filter Signals
  sort = signal("created_at", ...ngDevMode ? [{ debugName: "sort" }] : []);
  order = signal("desc", ...ngDevMode ? [{ debugName: "order" }] : []);
  // Registration Modal
  isRegistrationOpen = signal(false, ...ngDevMode ? [{ debugName: "isRegistrationOpen" }] : []);
  selectedCourse = signal(null, ...ngDevMode ? [{ debugName: "selectedCourse" }] : []);
  registrationForm = { full_name: "", email: "", phone: "" };
  isRegistering = signal(false, ...ngDevMode ? [{ debugName: "isRegistering" }] : []);
  registrationSuccess = signal(false, ...ngDevMode ? [{ debugName: "registrationSuccess" }] : []);
  registrationError = signal(null, ...ngDevMode ? [{ debugName: "registrationError" }] : []);
  // Static Content
  benefits = signal([
    {
      icon: "fas fa-certificate",
      title: "Certificaci\xF3n Oficial",
      description: "Recib\xED un diploma avalado para validar tus conocimientos.",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: "fas fa-tools",
      title: "100% Pr\xE1ctico",
      description: "Aprende metiendo mano desde la primera clase en nuestros laboratorios.",
      color: "text-green-500 bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: "fas fa-users",
      title: "Grupos Reducidos",
      description: "Atenci\xF3n personalizada con cupos limitados por comisi\xF3n.",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: "fas fa-briefcase",
      title: "Salida Laboral",
      description: "Bolsa de trabajo exclusiva y asesoramiento para emprender.",
      color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20"
    }
  ], ...ngDevMode ? [{ debugName: "benefits" }] : []);
  // Resource for Related Products (Tools/Kits)
  productsRs = rxResource({
    stream: () => this.categoryService.getDataBySlug("cursos").pipe(switchMap((category) => {
      if (!category.data?.[0]?.id)
        return of({ data: [], meta: { total: 0 } });
      return this.productService.getData({
        category_id: category.data[0].id,
        _page: this.paginationService.currentPage() || 1,
        _sort: this.sort(),
        _order: this.order()
      });
    }))
  });
  paginationData = computed(() => {
    const data = this.productsRs.value();
    if (!data || !("data" in data))
      return null;
    const _a = data, { data: items } = _a, meta = __objRest(_a, ["data"]);
    return meta;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  ngOnInit() {
    this.setSEO();
    this.loadCourses();
  }
  setSEO() {
    this.seoService.setPageData({
      title: "Cursos de Reparaci\xF3n de Celulares | Arecofix Academy",
      description: "Convertite en t\xE9cnico profesional. Cursos presenciales de reparaci\xF3n de celulares y tablets en Marcos Paz. Certificaci\xF3n y salida laboral.",
      imageUrl: "https://arecofix.com.ar/assets/img/branding/og-academy.jpg"
    });
  }
  loadCourses() {
    this.isLoadingCourses.set(true);
    this.coursesService.getCourses().pipe(timeout(5e3), catchError((err) => {
      console.error("API Error:", err);
      return of({ error: err, data: null });
    })).subscribe({
      next: (res) => {
        const coursesData = res.data || this.getMockCourses();
        const processedCourses = coursesData.map((c) => __spreadProps(__spreadValues({}, c), {
          rating: c.rating || 4.9,
          students: c.students || 150,
          duration: c.duration || "Consultar",
          schedule: c.schedule || "A confirmar",
          // Fix outdated image paths if any
          image_url: this.fixImageUrl(c.image_url)
        }));
        this.courses.set(processedCourses);
        this.isLoadingCourses.set(false);
      },
      error: () => {
        this.courses.set(this.getMockCourses());
        this.isLoadingCourses.set(false);
      }
    });
  }
  fixImageUrl(url) {
    if (!url)
      return "assets/img/placeholder-course.jpg";
    if (url.includes("curso-reparacion-de-celulares.jpg"))
      return "assets/img/cursos/academy/curso-reparacion-de-celulares.jpg";
    return url;
  }
  getMockCourses() {
    return [
      {
        id: "1",
        title: "T\xE9cnico en Reparaci\xF3n de Celulares",
        slug: "reparacion-celulares-basico",
        description: "Domin\xE1 el hardware y software de smartphones. Diagn\xF3stico, cambio de m\xF3dulos, bater\xEDas, pines de carga y soluci\xF3n de fallas comunes.",
        duration: "4 Meses",
        schedule: "S\xE1bados 10:00 - 13:00hs",
        price: 45e3,
        image_url: "assets/img/cursos/pro.webp",
        level: "Inicial / Intermedio",
        students: 230,
        rating: 4.9
      },
      {
        id: "2",
        title: "Microelectr\xF3nica Aplicada",
        slug: "curso-avanzado-microelectronica",
        description: "Especializaci\xF3n avanzada. Lectura de esquem\xE1ticos, soldadura microsc\xF3pica, reballing y reparaci\xF3n de placas base (iPhone/Android).",
        duration: "3 Meses",
        schedule: "Mi\xE9rcoles 18:00 - 21:00hs",
        price: 65e3,
        image_url: "assets/img/cursos/laboratorio.jpg",
        level: "Avanzado",
        students: 85,
        rating: 5
      },
      {
        id: "3",
        title: "Reparaci\xF3n de Notebooks y PC",
        slug: "reparacion-pc",
        description: "Aprend\xE9 a diagnosticar, reparar y optimizar computadoras. Hardware, instalaci\xF3n de sistemas, mantenimiento t\xE9rmico y upgrades.",
        duration: "4 Meses",
        schedule: "Martes 19:00 - 21:00hs",
        price: 42e3,
        image_url: "assets/img/cursos/pc-repair.jpg",
        // Ensure this asset exists or use a generic one
        level: "Principiante",
        students: 60,
        rating: 4.8
      }
    ];
  }
  // Modal Logic
  openRegistration(course) {
    this.selectedCourse.set(course);
    this.registrationForm = { full_name: "", email: "", phone: "" };
    this.registrationSuccess.set(false);
    this.registrationError.set(null);
    this.isRegistrationOpen.set(true);
  }
  closeRegistration() {
    this.isRegistrationOpen.set(false);
    this.selectedCourse.set(null);
  }
  async submitRegistration() {
    const form = this.registrationForm;
    if (!form.full_name || !form.email || !form.phone) {
      this.registrationError.set("Por favor complet\xE1 todos los campos.");
      return;
    }
    this.isRegistering.set(true);
    this.registrationError.set(null);
    try {
      const response = await this.coursesService.registerStudent(__spreadValues({
        course_id: this.selectedCourse().id
      }, form));
      if (response.error)
        throw new Error(response.error);
      this.registrationSuccess.set(true);
    } catch (err) {
      console.error(err);
      this.registrationError.set("Hubo un error al procesar tu inscripci\xF3n. Intenta nuevamente.");
    } finally {
      this.isRegistering.set(false);
    }
  }
  static \u0275fac = function CursosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CursosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CursosComponent, selectors: [["app-cursos"]], decls: 58, vars: 6, consts: [[1, "relative", "bg-gray-900", "text-white", "py-20", "lg:py-32", "overflow-hidden"], [1, "absolute", "inset-0", "bg-linear-to-br", "from-gray-900", "via-gray-800", "to-gray-900", "z-0"], [1, "absolute", "top-0", "right-0", "w-1/2", "h-full", "bg-linear-to-l", "from-blue-900/20", "to-transparent", "z-0"], [1, "absolute", "-bottom-32", "-left-32", "w-96", "h-96", "bg-green-500/10", "rounded-full", "blur-3xl", "z-0"], [1, "container", "mx-auto", "px-4", "relative", "z-10"], [1, "max-w-3xl", "mx-auto", "text-center"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-blue-500/20", "text-blue-300", "text-sm", "font-bold", "tracking-wide", "uppercase", "mb-6", "border", "border-blue-500/30"], [1, "text-4xl", "md:text-6xl", "font-black", "mb-6", "tracking-tight", "leading-tight"], [1, "text-transparent", "bg-clip-text", "bg-linear-to-r", "from-green-400", "to-blue-500"], [1, "text-xl", "text-gray-300", "mb-10", "leading-relaxed"], [1, "flex", "flex-col", "sm:flex-row", "justify-center", "gap-4"], ["routerLink", ".", "fragment", "cursos-list", 1, "btn", "btn-primary", "btn-lg", "rounded-full", "px-8", "shadow-lg", "shadow-blue-500/30", "hover:-translate-y-1", "transition-all"], ["target", "_blank", 1, "btn", "btn-outline", "btn-lg", "text-white", "border-white/30", "hover:bg-white", "hover:text-gray-900", "rounded-full", "px-8", 3, "href"], [1, "fa-brands", "fa-whatsapp", "mr-2"], [1, "py-16", "bg-white", "dark:bg-gray-800", "-mt-10", "relative", "z-20", "rounded-t-[3rem]"], [1, "container", "mx-auto", "px-4"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-4", "md:gap-6"], [1, "bg-gray-50", "dark:bg-gray-700/50", "p-4", "md:p-8", "rounded-2xl", "border", "border-gray-100", "dark:border-gray-600", "hover:shadow-xl", "transition-all", "duration-300", "hover-lift", "group"], ["id", "cursos-list", 1, "py-20", "bg-gray-50", "dark:bg-gray-900"], [1, "text-center", "mb-16"], [1, "text-3xl", "md:text-5xl", "font-bold", "text-gray-900", "dark:text-white", "mb-4"], [1, "text-gray-600", "dark:text-gray-400", "max-w-2xl", "mx-auto", "text-lg"], [1, "flex", "justify-center", "py-20"], [1, "grid", "grid-cols-2", "lg:grid-cols-3", "gap-8"], [1, "py-20", "bg-white", "dark:bg-gray-800", "border-t", "border-gray-100", "dark:border-gray-700"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "md:items-end", "mb-12", "gap-6", "text-center", "md:text-left"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-gray-600", "dark:text-gray-400"], [1, "flex", "gap-2"], [1, "select", "select-bordered", "select-sm", "w-36", "dark:bg-gray-700", 3, "ngModelChange", "ngModel"], ["value", "created_at"], ["value", "price"], ["value", "asc"], ["value", "desc"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/60", "backdrop-blur-sm", "animate-fade-in"], [1, "text-sm", "md:text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2", "md:mb-3", "leading-tight"], [1, "text-gray-600", "dark:text-gray-300", "leading-relaxed", "text-xs", "md:text-sm"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "bg-white", "dark:bg-gray-800", "rounded-2xl", "overflow-hidden", "shadow-lg", "border", "border-gray-100", "dark:border-gray-700", "hover:shadow-2xl", "transition-all", "duration-300", "flex", "flex-col", "h-full", "group", "card-modern", "hover-lift"], [1, "relative", "h-48", "overflow-hidden"], [1, "absolute", "inset-0", "bg-gray-900/20", "group-hover:bg-transparent", "transition-colors", "z-10"], [1, "w-full", "h-full", "object-cover", "transform", "group-hover:scale-110", "transition-transform", "duration-700", 3, "src", "alt"], [1, "absolute", "top-2", "right-2", "z-20"], [1, "badge", "badge-primary", "font-bold", "py-3", "px-4", "shadow-lg", "text-xs", "tracking-wider", "border-none", "bg-blue-600", "text-white"], [1, "p-6", "flex", "flex-col", "grow"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-3", "group-hover:text-blue-500", "transition-colors", "leading-tight"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "text-sm", "leading-relaxed", "grow", "line-clamp-3"], [1, "flex", "flex-col", "gap-3", "mb-6", "pt-4", "border-t", "border-gray-100", "dark:border-gray-700"], [1, "flex", "items-center", "gap-3", "text-sm", "text-gray-600", "dark:text-gray-400"], [1, "w-8", "h-8", "rounded-full", "bg-blue-50", "dark:bg-blue-900/20", "flex", "items-center", "justify-center", "text-blue-500", "shrink-0"], [1, "fas", "fa-clock", "text-xs"], [1, "w-8", "h-8", "rounded-full", "bg-green-50", "dark:bg-green-900/20", "flex", "items-center", "justify-center", "text-green-500", "shrink-0"], [1, "fas", "fa-calendar-alt", "text-xs"], [1, "whitespace-normal", "wrap-break-word"], [1, "flex", "items-center", "justify-between", "mt-auto", "gap-2"], [1, "flex", "flex-col"], [1, "text-[10px]", "text-gray-500", "uppercase", "font-bold", "tracking-wider"], [1, "text-2xl", "font-black", "text-gray-900", "dark:text-white", "leading-none"], [1, "btn", "btn-primary", "btn-sm", "rounded-xl", "px-6", "py-2", "shadow-lg", "hover:shadow-xl", "transition-all", "h-auto", "text-sm", "font-bold", "bg-blue-600", "border-none", "text-white", "hover:bg-blue-700", 3, "routerLink"], [1, "fas", "fa-arrow-right", "ml-1"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], [3, "product"], [1, "mt-12", "flex", "justify-center"], [3, "pages", "currentPage"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/60", "backdrop-blur-sm", "animate-fade-in", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "w-full", "max-w-lg", "overflow-hidden", "transform", "transition-all", "scale-100", "border", "border-gray-100", "dark:border-gray-700", 3, "click"], [1, "bg-primary", "px-6", "py-4", "flex", "justify-between", "items-center"], [1, "text-xl", "font-bold", "text-white"], [1, "text-white/80", "hover:text-white", "transition-colors", 3, "click"], [1, "fas", "fa-times", "text-xl"], [1, "p-6", "md:p-8"], [1, "mb-6", "bg-blue-50", "dark:bg-blue-900/20", "p-4", "rounded-xl", "border", "border-blue-100", "dark:border-blue-800"], [1, "text-center", "py-8"], [1, "space-y-4"], [1, "text-xs", "text-blue-600", "dark:text-blue-300", "font-bold", "uppercase", "tracking-wider", "mb-1"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white"], [1, "w-16", "h-16", "bg-green-100", "text-green-500", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-3xl"], [1, "fas", "fa-check"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-gray-600", "dark:text-gray-300", "mb-6"], [1, "btn", "btn-outline", "w-full", "rounded-xl", 3, "click"], [1, "space-y-4", 3, "ngSubmit"], [1, "form-control"], [1, "label"], [1, "label-text"], ["type", "text", "name", "full_name", "placeholder", "Ej: Juan P\xE9rez", "required", "", 1, "input", "input-bordered", "w-full", "rounded-xl", "focus:outline-none", "focus:border-primary", 3, "ngModelChange", "ngModel"], ["type", "tel", "name", "phone", "placeholder", "Ej: 11 1234 5678", "required", "", 1, "input", "input-bordered", "w-full", "rounded-xl", "focus:outline-none", "focus:border-primary", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "email", "placeholder", "tu@email.com", "required", "", 1, "input", "input-bordered", "w-full", "rounded-xl", "focus:outline-none", "focus:border-primary", 3, "ngModelChange", "ngModel"], [1, "bg-red-50", "text-red-600", "p-3", "rounded-lg", "text-sm", "border", "border-red-100"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "rounded-xl", "mt-4", "text-lg", 3, "disabled"], [1, "loading", "loading-spinner", "loading-sm"]], template: function CursosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "span", 6);
      \u0275\u0275text(7, " Arecofix Academy ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "h1", 7);
      \u0275\u0275text(9, " Domin\xE1 la Tecnolog\xEDa");
      \u0275\u0275element(10, "br");
      \u0275\u0275elementStart(11, "span", 8);
      \u0275\u0275text(12, " Constru\xED tu Futuro ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "p", 9);
      \u0275\u0275text(14, " Formate como t\xE9cnico profesional en reparaci\xF3n de celulares y tecnolog\xEDa. Cursos pr\xE1cticos, certificaci\xF3n oficial y las mejores herramientas del mercado. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 10)(16, "a", 11);
      \u0275\u0275text(17, " Ver Cursos Disponibles ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "a", 12);
      \u0275\u0275element(19, "i", 13);
      \u0275\u0275text(20, " Consultar Ahora ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(21, "section", 14)(22, "div", 15)(23, "div", 16);
      \u0275\u0275repeaterCreate(24, CursosComponent_For_25_Template, 7, 6, "div", 17, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "section", 18)(27, "div", 15)(28, "div", 19)(29, "h2", 20);
      \u0275\u0275text(30, "Nuestros Cursos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p", 21);
      \u0275\u0275text(32, " Eleg\xED la capacitaci\xF3n que impulsar\xE1 tu carrera profesional. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(33, CursosComponent_Conditional_33_Template, 2, 0, "div", 22)(34, CursosComponent_Conditional_34_Template, 3, 0, "div", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "section", 24)(36, "div", 15)(37, "div", 25)(38, "div")(39, "h2", 26);
      \u0275\u0275text(40, "Kit de Herramientas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "p", 27);
      \u0275\u0275text(42, "Todo lo que necesit\xE1s para empezar tu taller profesional.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "div", 28)(44, "select", 29);
      \u0275\u0275listener("ngModelChange", function CursosComponent_Template_select_ngModelChange_44_listener($event) {
        return ctx.sort.set($event);
      });
      \u0275\u0275elementStart(45, "option", 30);
      \u0275\u0275text(46, "Nuevos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "option", 31);
      \u0275\u0275text(48, "Precio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "select", 29);
      \u0275\u0275listener("ngModelChange", function CursosComponent_Template_select_ngModelChange_49_listener($event) {
        return ctx.order.set($event);
      });
      \u0275\u0275elementStart(50, "option", 32);
      \u0275\u0275text(51, "Menor Precio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "option", 33);
      \u0275\u0275text(53, "Mayor Precio");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(54, CursosComponent_Conditional_54_Template, 1, 0, "is-loading")(55, CursosComponent_Conditional_55_Template, 1, 0, "is-error")(56, CursosComponent_Conditional_56_Template, 4, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(57, CursosComponent_Conditional_57_Template, 11, 2, "div", 34);
    }
    if (rf & 2) {
      \u0275\u0275advance(18);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber + "?text=Hola,%20quiero%20info%20sobre%20cursos", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.benefits());
      \u0275\u0275advance(9);
      \u0275\u0275conditional(ctx.isLoadingCourses() ? 33 : 34);
      \u0275\u0275advance(11);
      \u0275\u0275property("ngModel", ctx.sort());
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.order());
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.productsRs.isLoading() ? 54 : ctx.productsRs.error() ? 55 : ctx.productsRs.hasValue() ? 56 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isRegistrationOpen() ? 57 : -1);
    }
  }, dependencies: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    ProductCard,
    Pagination,
    IsErrorComponent,
    IsLoadingComponent,
    CurrencyPipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CursosComponent, [{
    type: Component,
    args: [{ selector: "app-cursos", standalone: true, imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ProductCard,
      Pagination,
      IsErrorComponent,
      IsLoadingComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Hero Section -->\r
<section class="relative bg-gray-900 text-white py-20 lg:py-32 overflow-hidden">\r
    <!-- Background Gradient & Shapes -->\r
    <div class="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 z-0"></div>\r
    <div class="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-900/20 to-transparent z-0"></div>\r
    <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl z-0"></div>\r
\r
    <div class="container mx-auto px-4 relative z-10">\r
        <div class="max-w-3xl mx-auto text-center">\r
            <span class="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold tracking-wide uppercase mb-6 border border-blue-500/30">\r
                Arecofix Academy\r
            </span>\r
            <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">\r
                Domin\xE1 la Tecnolog\xEDa<br />\r
                <span class="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-500">\r
                    Constru\xED tu Futuro\r
                </span>\r
            </h1>\r
            <p class="text-xl text-gray-300 mb-10 leading-relaxed">\r
                Formate como t\xE9cnico profesional en reparaci\xF3n de celulares y tecnolog\xEDa. \r
                Cursos pr\xE1cticos, certificaci\xF3n oficial y las mejores herramientas del mercado.\r
            </p>\r
            \r
            <div class="flex flex-col sm:flex-row justify-center gap-4">\r
                <a routerLink="." fragment="cursos-list" \r
                   class="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all">\r
                    Ver Cursos Disponibles\r
                </a>\r
                <a [href]="'https://wa.me/' + whatsappNumber + '?text=Hola,%20quiero%20info%20sobre%20cursos'" \r
                   target="_blank"\r
                   class="btn btn-outline btn-lg text-white border-white/30 hover:bg-white hover:text-gray-900 rounded-full px-8">\r
                    <i class="fa-brands fa-whatsapp mr-2"></i> Consultar Ahora\r
                </a>\r
            </div>\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Stats / Benefits Section -->\r
<section class="py-16 bg-white dark:bg-gray-800 -mt-10 relative z-20 rounded-t-[3rem]">\r
    <div class="container mx-auto px-4">\r
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">\r
            @for (benefit of benefits(); track benefit.title) {\r
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover-lift group">\r
                    <div [class]="'w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mb-3 md:mb-6 transition-transform group-hover:scale-110 ' + benefit.color">\r
                        <i [class]="benefit.icon"></i>\r
                    </div>\r
                    <h3 class="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight">{{ benefit.title }}</h3>\r
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-xs md:text-sm">\r
                        {{ benefit.description }}\r
                    </p>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Courses List Section -->\r
<section id="cursos-list" class="py-20 bg-gray-50 dark:bg-gray-900">\r
    <div class="container mx-auto px-4">\r
        <div class="text-center mb-16">\r
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Nuestros Cursos</h2>\r
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">\r
                Eleg\xED la capacitaci\xF3n que impulsar\xE1 tu carrera profesional.\r
            </p>\r
        </div>\r
\r
        @if (isLoadingCourses()) {\r
            <div class="flex justify-center py-20">\r
                <span class="loading loading-spinner loading-lg text-primary"></span>\r
            </div>\r
        } @else {\r
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-8">\r
                @for (course of courses(); track course.id) {\r
                    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group card-modern hover-lift">\r
                        \r
                        <!-- Image -->\r
                        <div class="relative h-48 overflow-hidden">\r
                            <div class="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors z-10"></div>\r
                            <img [src]="course.image_url" [alt]="course.title" \r
                                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">\r
                            \r
                            <div class="absolute top-2 right-2 z-20">\r
                                <span class="badge badge-primary font-bold py-3 px-4 shadow-lg text-xs tracking-wider border-none bg-blue-600 text-white">\r
                                    {{ course.level }}\r
                                </span>\r
                            </div>\r
                        </div>\r
\r
                        <!-- Content -->\r
                        <div class="p-6 flex flex-col grow">\r
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors leading-tight">\r
                                {{ course.title }}\r
                            </h3>\r
                            <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed grow line-clamp-3">\r
                                {{ course.description }}\r
                            </p>\r
\r
                            <!-- Meta Info -->\r
                            <div class="flex flex-col gap-3 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">\r
                                <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">\r
                                    <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">\r
                                        <i class="fas fa-clock text-xs"></i>\r
                                    </div>\r
                                    <span>{{ course.duration }}</span>\r
                                </div>\r
                                <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">\r
                                    <div class="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shrink-0">\r
                                        <i class="fas fa-calendar-alt text-xs"></i>\r
                                    </div>\r
                                    <span class="whitespace-normal wrap-break-word">{{ course.schedule }}</span>\r
                                </div>\r
                            </div>\r
\r
                            <!-- Actions -->\r
                            <div class="flex items-center justify-between mt-auto gap-2">\r
                                <div class="flex flex-col">\r
                                    <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Inversi\xF3n Mensual</span>\r
                                    <span class="text-2xl font-black text-gray-900 dark:text-white leading-none">\r
                                        {{ course.price | currency:'ARS':'symbol':'1.0-0' }}\r
                                    </span>\r
                                </div>\r
                                <a [routerLink]="['/academy', course.slug]" \r
                                        class="btn btn-primary btn-sm rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all h-auto text-sm font-bold bg-blue-600 border-none text-white hover:bg-blue-700">\r
                                    Ver Detalle <i class="fas fa-arrow-right ml-1"></i>\r
                                </a>\r
                            </div>\r
                        </div>\r
                    </div>\r
                }\r
            </div>\r
        }\r
    </div>\r
</section>\r
\r
<!-- Additional Products / Kits Section -->\r
<section class="py-20 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">\r
    <div class="container mx-auto px-4">\r
        <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">\r
            <div>\r
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kit de Herramientas</h2>\r
                <p class="text-gray-600 dark:text-gray-400">Todo lo que necesit\xE1s para empezar tu taller profesional.</p>\r
            </div>\r
            \r
            <div class="flex gap-2">\r
                <select [ngModel]="sort()" (ngModelChange)="sort.set($event)" \r
                        class="select select-bordered select-sm w-36 dark:bg-gray-700">\r
                    <option value="created_at">Nuevos</option>\r
                    <option value="price">Precio</option>\r
                </select>\r
                <select [ngModel]="order()" (ngModelChange)="order.set($event)" \r
                        class="select select-bordered select-sm w-36 dark:bg-gray-700">\r
                    <option value="asc">Menor Precio</option>\r
                    <option value="desc">Mayor Precio</option>\r
                </select>\r
            </div>\r
        </div>\r
\r
        @if (productsRs.isLoading()) {\r
            <is-loading />\r
        } @else if (productsRs.error()) {\r
            <is-error />\r
        } @else if (productsRs.hasValue()) {\r
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\r
                @for (product of productsRs.value().data; track product.id) {\r
                    <product-card [product]="product" />\r
                }\r
            </div>\r
            \r
            @if (paginationData(); as pager) {\r
                <div class="mt-12 flex justify-center">\r
                    <pagination [pages]="pager.pages" \r
                               [currentPage]="paginationService.currentPage()" />\r
                </div>\r
            }\r
        }\r
    </div>\r
</section>\r
\r
\r
<!-- Registration Modal -->\r
@if (isRegistrationOpen()) {\r
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"\r
         (click)="closeRegistration()">\r
        \r
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-gray-100 dark:border-gray-700"\r
             (click)="$event.stopPropagation()">\r
            \r
            <!-- Modal Header -->\r
            <div class="bg-primary px-6 py-4 flex justify-between items-center">\r
                <h3 class="text-xl font-bold text-white">Inscripci\xF3n</h3>\r
                <button (click)="closeRegistration()" class="text-white/80 hover:text-white transition-colors">\r
                    <i class="fas fa-times text-xl"></i>\r
                </button>\r
            </div>\r
\r
            <!-- Modal Body -->\r
            <div class="p-6 md:p-8">\r
                @if (selectedCourse()) {\r
                    <div class="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">\r
                        <p class="text-xs text-blue-600 dark:text-blue-300 font-bold uppercase tracking-wider mb-1">Est\xE1s aplicando a:</p>\r
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedCourse()?.title }}</h4>\r
                    </div>\r
                }\r
\r
                @if (registrationSuccess()) {\r
                    <div class="text-center py-8">\r
                        <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">\r
                            <i class="fas fa-check"></i>\r
                        </div>\r
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">\xA1Solicitud Recibida!</h3>\r
                        <p class="text-gray-600 dark:text-gray-300 mb-6">\r
                            Gracias por tu inter\xE9s. Un asesor te contactar\xE1 por WhatsApp para confirmar tu vacante y coordinar el pago.\r
                        </p>\r
                        <button (click)="closeRegistration()" class="btn btn-outline w-full rounded-xl">\r
                            Entendido\r
                        </button>\r
                    </div>\r
                } @else {\r
                    <form (ngSubmit)="submitRegistration()" class="space-y-4">\r
                        <div class="form-control">\r
                            <label class="label"><span class="label-text">Nombre Completo</span></label>\r
                            <input type="text" [(ngModel)]="registrationForm.full_name" name="full_name" \r
                                   class="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary" \r
                                   placeholder="Ej: Juan P\xE9rez" required />\r
                        </div>\r
\r
                        <div class="form-control">\r
                            <label class="label"><span class="label-text">WhatsApp</span></label>\r
                            <input type="tel" [(ngModel)]="registrationForm.phone" name="phone" \r
                                   class="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary" \r
                                   placeholder="Ej: 11 1234 5678" required />\r
                        </div>\r
\r
                        <div class="form-control">\r
                            <label class="label"><span class="label-text">Correo Electr\xF3nico</span></label>\r
                            <input type="email" [(ngModel)]="registrationForm.email" name="email" \r
                                   class="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary" \r
                                   placeholder="tu@email.com" required />\r
                        </div>\r
                        \r
                        @if (registrationError()) {\r
                            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">\r
                                {{ registrationError() }}\r
                            </div>\r
                        }\r
\r
                        <button type="submit" [disabled]="isRegistering()" \r
                                class="btn btn-primary w-full rounded-xl mt-4 text-lg">\r
                            @if (isRegistering()) {\r
                                <span class="loading loading-spinner loading-sm"></span> Enviando...\r
                            } @else {\r
                                Enviar Solicitud\r
                            }\r
                        </button>\r
                    </form>\r
                }\r
            </div>\r
\r
        </div>\r
    </div>\r
}` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CursosComponent, { className: "CursosComponent", filePath: "src/app/public/cursos/cursos.ts", lineNumber: 36 });
})();
export {
  CursosComponent
};
//# sourceMappingURL=chunk-WWSJEQ6E.js.map
