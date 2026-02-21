import './polyfills.server.mjs';
import {
  PreferencesService
} from "./chunk-V2PF6MZP.mjs";
import {
  SERVICIOS_CONTENT
} from "./chunk-F4ISDRFP.mjs";
import {
  SeoService
} from "./chunk-66CEOCL3.mjs";
import {
  toSignal
} from "./chunk-OO2GNNZX.mjs";
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  NgOptimizedImage,
  RouterLink,
  RouterModule
} from "./chunk-YFUS3N4N.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/public/servicios/servicios.ts
var _forTrack0 = ($index, $item) => $item.step;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.title;
function ServiciosComponent_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 36);
    \u0275\u0275element(2, "div", 37)(3, "i", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 39);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h3", 40);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 41);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const step_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275classMap(step_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" PASO 0", step_r1.step, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", step_r1.description, " ");
  }
}
function ServiciosComponent_For_35_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 51);
    \u0275\u0275element(1, "i", 56);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const feature_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(feature_r3);
  }
}
function ServiciosComponent_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 42);
    \u0275\u0275element(2, "div", 43)(3, "img", 44);
    \u0275\u0275elementStart(4, "div", 45);
    \u0275\u0275element(5, "i", 46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 47)(7, "h3", 48);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 49);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul", 50);
    \u0275\u0275repeaterCreate(12, ServiciosComponent_For_35_For_13_Template, 4, 1, "li", 51, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 52)(15, "span", 53);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "a", 54);
    \u0275\u0275listener("click", function ServiciosComponent_For_35_Template_a_click_17_listener($event) {
      const service_r4 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.openService(service_r4, $event));
    });
    \u0275\u0275element(18, "i", 55);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const service_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngSrc", service_r4.image)("alt", service_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(service_r4.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", service_r4.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", service_r4.description, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(service_r4.features.slice(0, 3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", service_r4.price, " ");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", service_r4.link);
  }
}
function ServiciosComponent_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 57);
    \u0275\u0275element(2, "i", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h4", 58);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 59);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(item_r6.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.description);
  }
}
function ServiciosComponent_Conditional_54_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "div", 70);
    \u0275\u0275element(2, "i", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h4", 71);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 72);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "p", 73);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(((tmp_2_0 = ctx_r4.selectedService()) == null ? null : tmp_2_0.icon) || "fa-star");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r4.selectedService()) == null ? null : tmp_3_0.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r4.selectedService()) == null ? null : tmp_4_0.price);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", (tmp_5_0 = ctx_r4.selectedService()) == null ? null : tmp_5_0.description, " ");
  }
}
function ServiciosComponent_Conditional_54_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 76);
    \u0275\u0275element(1, "i", 77);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r8);
  }
}
function ServiciosComponent_Conditional_54_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 74);
    \u0275\u0275text(1, "Otros servicios disponibles bajo demanda:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 75);
    \u0275\u0275repeaterCreate(3, ServiciosComponent_Conditional_54_Conditional_9_For_4_Template, 4, 1, "li", 76, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.otherServicesList());
  }
}
function ServiciosComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275listener("click", function ServiciosComponent_Conditional_54_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeModal());
    });
    \u0275\u0275elementStart(1, "div", 61);
    \u0275\u0275listener("click", function ServiciosComponent_Conditional_54_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 62)(3, "h3", 63);
    \u0275\u0275text(4, "Servicios Especializados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 64);
    \u0275\u0275listener("click", function ServiciosComponent_Conditional_54_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeModal());
    });
    \u0275\u0275element(6, "i", 65);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 66);
    \u0275\u0275conditionalCreate(8, ServiciosComponent_Conditional_54_Conditional_8_Template, 10, 5)(9, ServiciosComponent_Conditional_54_Conditional_9_Template, 5, 0);
    \u0275\u0275elementStart(10, "a", 67);
    \u0275\u0275element(11, "i", 68);
    \u0275\u0275text(12, " Consultar Disponibilidad ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r4.selectedService() ? 8 : 9);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r4.whatsappNumber + "?text=Consulta%20sobre%20" + (((tmp_2_0 = ctx_r4.selectedService()) == null ? null : tmp_2_0.title) || "Otros Servicios"), \u0275\u0275sanitizeUrl);
  }
}
var ServiciosComponent = class _ServiciosComponent {
  seoService = inject(SeoService);
  preferencesService = inject(PreferencesService);
  whatsappNumber = environment.contact.whatsappNumber;
  // Signals
  currentLang = toSignal(this.preferencesService.language$, { initialValue: "es" });
  // Computed Content based on Language
  content = computed(() => {
    const lang = this.currentLang();
    return SERVICIOS_CONTENT[lang] || SERVICIOS_CONTENT["es"];
  }, ...ngDevMode ? [{ debugName: "content" }] : []);
  // Modal State
  showModal = signal(false, ...ngDevMode ? [{ debugName: "showModal" }] : []);
  selectedService = signal(null, ...ngDevMode ? [{ debugName: "selectedService" }] : []);
  // Other Services List
  otherServicesList = signal([
    "Reparaci\xF3n de Electr\xF3nica",
    "Diagn\xF3stico El\xE9ctrico y Electr\xF3nico de Ecus AutoMotriz",
    "Electricidad de Motos",
    "Alquiler de Trajes",
    "Desarrollo de Software a Medida"
  ], ...ngDevMode ? [{ debugName: "otherServicesList" }] : []);
  ngOnInit() {
    this.seoService.setPageData({
      title: "Soluciones Tecnol\xF3gicas Integrales | Arecofix Servicios",
      description: "Experiencia y tecnolog\xEDa al servicio de tu empresa. Desarrollo de Software, Soporte IT, Ciberseguridad y Reparaci\xF3n de Hardware Especializada.",
      imageUrl: "assets/img/branding/og-services.jpg"
    });
  }
  openService(service, event) {
    if (service.id === 12 || service.slug === "otros-servicios") {
      event.preventDefault();
      this.selectedService.set(service);
      this.showModal.set(true);
    }
  }
  closeModal() {
    this.showModal.set(false);
    this.selectedService.set(null);
  }
  static \u0275fac = function ServiciosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServiciosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ServiciosComponent, selectors: [["app-servicios"]], decls: 55, vars: 15, consts: [[1, "relative", "bg-gray-900", "text-white", "py-20", "lg:py-32", "overflow-hidden"], [1, "absolute", "inset-0", "bg-linear-to-br", "from-gray-900", "via-[#0f172a]", "to-gray-900", "z-0"], [1, "absolute", "top-0", "right-0", "w-[800px]", "h-[800px]", "bg-blue-600/10", "rounded-full", "blur-[120px]", "-translate-y-1/2", "translate-x-1/2", "z-0", "pointer-events-none"], [1, "absolute", "bottom-0", "left-0", "w-[600px]", "h-[600px]", "bg-indigo-600/10", "rounded-full", "blur-[100px]", "translate-y-1/2", "-translate-x-1/4", "z-0", "pointer-events-none"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "text-center"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-indigo-500/20", "text-indigo-300", "text-sm", "font-bold", "tracking-wide", "uppercase", "mb-6", "border", "border-indigo-500/30"], [1, "text-4xl", "md:text-6xl", "font-black", "mb-6", "tracking-tight", "leading-tight", "max-w-4xl", "mx-auto"], [1, "text-xl", "text-gray-300", "mb-10", "leading-relaxed", "max-w-2xl", "mx-auto"], [1, "flex", "flex-col", "sm:flex-row", "justify-center", "gap-4"], ["routerLink", ".", "fragment", "services-catalog", 1, "btn", "btn-primary", "btn-lg", "rounded-full", "px-8", "shadow-lg", "shadow-indigo-500/30", "hover:-translate-y-1", "transition-all", "border-none", "bg-linear-to-r", "from-blue-600", "to-indigo-600", "text-white"], ["target", "_blank", 1, "btn", "btn-outline", "btn-lg", "text-white", "border-white/20", "hover:bg-white", "hover:text-gray-900", "rounded-full", "px-8", "hover:border-white", 3, "href"], [1, "fa-brands", "fa-whatsapp", "mr-2"], [1, "py-20", "bg-white", "dark:bg-gray-800", "-mt-10", "relative", "z-20", "rounded-t-[3rem]", "border-t", "border-white/10"], [1, "container", "mx-auto", "px-4"], [1, "text-center", "mb-16"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-4", "md:gap-8", "relative"], [1, "hidden", "lg:block", "absolute", "top-10", "left-[10%]", "right-[10%]", "h-0.5", "bg-gray-200", "dark:bg-gray-700", "z-0"], [1, "relative", "z-10", "flex", "flex-col", "items-center", "text-center", "group", "hover-lift"], ["id", "services-catalog", 1, "py-20", "bg-gray-50", "dark:bg-gray-900"], [1, "max-w-3xl", "mx-auto", "text-center", "mb-16"], [1, "text-3xl", "md:text-5xl", "font-bold", "text-gray-900", "dark:text-white", "mb-4"], [1, "text-gray-600", "dark:text-gray-400", "text-lg"], [1, "grid", "grid-cols-2", "lg:grid-cols-3", "gap-4", "md:gap-8"], [1, "group", "bg-white", "dark:bg-gray-800", "rounded-2xl", "md:rounded-3xl", "overflow-hidden", "shadow-sm", "hover:shadow-2xl", "transition-all", "duration-300", "border", "border-gray-100", "dark:border-gray-700", "flex", "flex-col", "h-full", "hover:-translate-y-1"], [1, "py-20", "bg-gray-50", "dark:bg-[#0a0a0a]"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "flex", "gap-5", "items-start", "p-8", "rounded-2xl", "bg-white", "dark:bg-white/5", "border", "border-gray-100", "dark:border-white/5", "hover:border-blue-500/30", "transition-all", "duration-300", "hover:shadow-xl", "group", "hover:-translate-y-1"], [1, "py-20", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-blue-900", "to-indigo-900", "z-0"], [1, "text-3xl", "md:text-5xl", "font-bold", "text-white", "mb-6"], [1, "text-xl", "text-blue-100", "mb-10", "max-w-2xl", "mx-auto"], ["target", "_blank", 1, "btn", "btn-lg", "bg-green-500", "border-none", "hover:bg-green-600", "text-white", "rounded-full", "px-8", "shadow-xl", "shadow-green-900/20", 3, "href"], [1, "fa-brands", "fa-whatsapp", "mr-2", "text-xl"], ["href", "mailto:contacto@arecofix.com", 1, "btn", "btn-lg", "btn-ghost", "text-white", "border-white/20", "hover:bg-white/10", "rounded-full", "px-8"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/60", "backdrop-blur-sm", "animate-fade-in"], [1, "w-16", "h-16", "md:w-24", "md:h-24", "rounded-2xl", "bg-white", "dark:bg-gray-800", "shadow-xl", "border", "border-gray-100", "dark:border-gray-700", "flex", "items-center", "justify-center", "text-2xl", "md:text-3xl", "text-indigo-600", "dark:text-indigo-400", "mb-4", "md:mb-8", "transition-all", "duration-300", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-indigo-500/5", "dark:bg-indigo-500/10", "scale-0", "group-hover:scale-100", "transition-transform", "duration-300", "rounded-2xl"], [1, "fa-solid", "relative", "z-10"], [1, "bg-indigo-50", "dark:bg-indigo-900/30", "px-3", "py-1", "rounded-full", "text-[10px]", "md:text-xs", "font-bold", "text-indigo-600", "dark:text-indigo-300", "mb-3", "border", "border-indigo-100", "dark:border-indigo-500/20"], [1, "text-base", "md:text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "leading-relaxed", "max-w-[220px]"], [1, "h-32", "md:h-52", "overflow-hidden", "relative"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-gray-900/80", "to-transparent", "z-10", "opacity-60", "group-hover:opacity-40", "transition-opacity"], ["fill", "", "sizes", "(max-width: 768px) 50vw, 33vw", 1, "object-cover", "transform", "group-hover:scale-105", "transition-transform", "duration-700", 3, "ngSrc", "alt"], [1, "absolute", "bottom-2", "left-2", "md:bottom-4", "md:left-4", "z-20", "w-8", "h-8", "md:w-12", "md:h-12", "rounded-lg", "md:rounded-xl", "bg-white/10", "backdrop-blur-md", "border", "border-white/20", "flex", "items-center", "justify-center", "text-white", "text-sm", "md:text-xl"], [1, "fa-solid"], [1, "p-4", "md:p-8", "flex", "flex-col", "grow"], [1, "text-sm", "md:text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2", "md:mb-3", "group-hover:text-blue-600", "dark:group-hover:text-blue-400", "transition-colors", "line-clamp-2", "md:line-clamp-none", "leading-tight"], [1, "text-gray-600", "dark:text-gray-400", "text-xs", "md:text-sm", "mb-3", "md:mb-6", "leading-relaxed", "grow", "line-clamp-3"], [1, "space-y-1", "md:space-y-2", "mb-3", "md:mb-6", "hidden", "md:block"], [1, "flex", "items-start", "gap-2", "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "mt-auto", "pt-3", "md:pt-6", "border-t", "border-gray-100", "dark:border-gray-700", "flex", "items-center", "justify-between", "gap-2"], [1, "text-xs", "md:text-sm", "font-semibold", "text-indigo-600", "dark:text-indigo-400", "truncate"], [1, "btn", "btn-xs", "md:btn-sm", "btn-circle", "btn-ghost", "text-gray-400", "hover:text-blue-600", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "dark:hover:text-blue-400", "transition-colors", "shrink-0", 3, "click", "routerLink"], [1, "fas", "fa-arrow-right"], [1, "fas", "fa-check", "text-green-500", "mt-0.5"], [1, "w-14", "h-14", "rounded-full", "bg-blue-50", "dark:bg-blue-900/20", "flex", "items-center", "justify-center", "text-2xl", "text-blue-600", "dark:text-blue-400", "group-hover:scale-110", "transition-transform"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-sm", "text-gray-600", "dark:text-gray-400", "leading-relaxed"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/60", "backdrop-blur-sm", "animate-fade-in", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "w-full", "max-w-lg", "overflow-hidden", "transform", "transition-all", "scale-100", "border", "border-gray-100", "dark:border-gray-700", 3, "click"], [1, "bg-linear-to-r", "from-indigo-600", "to-blue-600", "px-6", "py-4", "flex", "justify-between", "items-center", "text-white"], [1, "text-lg", "font-bold"], [1, "hover:text-white/80", "transition-colors", 3, "click"], [1, "fas", "fa-times", "text-xl"], [1, "p-8"], ["target", "_blank", 1, "btn", "btn-primary", "w-full", "rounded-xl", "gap-2", 3, "href"], [1, "fa-brands", "fa-whatsapp"], [1, "flex", "items-center", "gap-4", "mb-6"], [1, "w-12", "h-12", "rounded-xl", "bg-indigo-100", "text-indigo-600", "flex", "items-center", "justify-center", "text-xl"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "text-sm", "text-gray-500"], [1, "text-gray-600", "dark:text-gray-300", "leading-relaxed", "mb-6"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "font-medium"], [1, "space-y-3", "mb-8"], [1, "flex", "items-center", "gap-3", "text-gray-700", "dark:text-gray-300", "p-3", "bg-gray-50", "dark:bg-gray-700/50", "rounded-lg"], [1, "fas", "fa-circle-check", "text-green-500"]], template: function ServiciosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4)(5, "span", 5);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "h1", 6);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 7);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 8)(12, "a", 9);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "a", 10);
      \u0275\u0275element(15, "i", 11);
      \u0275\u0275text(16);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(17, "section", 12)(18, "div", 13)(19, "div", 14)(20, "h2", 15);
      \u0275\u0275text(21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 16);
      \u0275\u0275element(23, "div", 17);
      \u0275\u0275repeaterCreate(24, ServiciosComponent_For_25_Template, 10, 5, "div", 18, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "section", 19)(27, "div", 13)(28, "div", 20)(29, "h2", 21);
      \u0275\u0275text(30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p", 22);
      \u0275\u0275text(32);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 23);
      \u0275\u0275repeaterCreate(34, ServiciosComponent_For_35_Template, 19, 8, "div", 24, _forTrack1);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "section", 25)(37, "div", 13)(38, "div", 26);
      \u0275\u0275repeaterCreate(39, ServiciosComponent_For_40_Template, 8, 4, "div", 27, _forTrack2);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(41, "section", 28);
      \u0275\u0275element(42, "div", 29);
      \u0275\u0275elementStart(43, "div", 4)(44, "h2", 30);
      \u0275\u0275text(45);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "p", 31);
      \u0275\u0275text(47);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "div", 8)(49, "a", 32);
      \u0275\u0275element(50, "i", 33);
      \u0275\u0275text(51);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "a", 34);
      \u0275\u0275text(53);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(54, ServiciosComponent_Conditional_54_Template, 13, 2, "div", 35);
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" ", ctx.content().heroSubtitle, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().heroTitle, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().heroDescription, " ");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.content().heroCtaAll, " ");
      \u0275\u0275advance();
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber + "?text=Hola,%20quisiera%20asesoramiento%20sobre%20servicios", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().heroCtaWhatsapp, " ");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.content().processTitle);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.content().process);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.content().servicesTitle);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().servicesDescription, " ");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.content().services);
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.content().guarantees);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.content().ctaTitle);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.content().ctaDescription);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().ctaWhatsapp, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.content().ctaForm, " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showModal() ? 54 : -1);
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, NgOptimizedImage], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServiciosComponent, [{
    type: Component,
    args: [{ selector: "app-servicios", standalone: true, imports: [CommonModule, RouterModule, NgOptimizedImage], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Hero Section -->\r
<section class="relative bg-gray-900 text-white py-20 lg:py-32 overflow-hidden">\r
    <!-- Background Gradient & Shapes -->\r
    <div class="absolute inset-0 bg-linear-to-br from-gray-900 via-[#0f172a] to-gray-900 z-0"></div>\r
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>\r
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 z-0 pointer-events-none"></div>\r
\r
    <div class="container mx-auto px-4 relative z-10 text-center">\r
        <span class="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6 border border-indigo-500/30">\r
            {{ content().heroSubtitle }}\r
        </span>\r
        <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight max-w-4xl mx-auto">\r
            {{ content().heroTitle }}\r
        </h1>\r
        <p class="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">\r
            {{ content().heroDescription }}\r
        </p>\r
        \r
        <div class="flex flex-col sm:flex-row justify-center gap-4">\r
            <a routerLink="." fragment="services-catalog" \r
               class="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-indigo-500/30 hover:-translate-y-1 transition-all border-none bg-linear-to-r from-blue-600 to-indigo-600 text-white">\r
                {{ content().heroCtaAll }}\r
            </a>\r
            <a [href]="'https://wa.me/' + whatsappNumber + '?text=Hola,%20quisiera%20asesoramiento%20sobre%20servicios'" \r
               target="_blank"\r
               class="btn btn-outline btn-lg text-white border-white/20 hover:bg-white hover:text-gray-900 rounded-full px-8 hover:border-white">\r
                <i class="fa-brands fa-whatsapp mr-2"></i> {{ content().heroCtaWhatsapp }}\r
            </a>\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Process Section -->\r
<section class="py-20 bg-white dark:bg-gray-800 -mt-10 relative z-20 rounded-t-[3rem] border-t border-white/10">\r
    <div class="container mx-auto px-4">\r
        <div class="text-center mb-16">\r
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ content().processTitle }}</h2>\r
        </div>\r
\r
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 relative">\r
            <!-- Connecting Line (Desktop) -->\r
            <div class="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>\r
\r
            @for (step of content().process; track step.step) {\r
                <div class="relative z-10 flex flex-col items-center text-center group hover-lift">\r
                    <div class="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-2xl md:text-3xl text-indigo-600 dark:text-indigo-400 mb-4 md:mb-8 transition-all duration-300 relative overflow-hidden">\r
                        <div class="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl"></div>\r
                        <i class="fa-solid relative z-10" [class]="step.icon"></i>\r
                    </div>\r
                    <div class="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-3 border border-indigo-100 dark:border-indigo-500/20">\r
                        PASO 0{{ step.step }}\r
                    </div>\r
                    <h3 class="text-base md:text-xl font-bold text-gray-900 dark:text-white mb-2">{{ step.title }}</h3>\r
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">\r
                        {{ step.description }}\r
                    </p>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Services Catalog -->\r
<section id="services-catalog" class="py-20 bg-gray-50 dark:bg-gray-900">\r
    <div class="container mx-auto px-4">\r
        <div class="max-w-3xl mx-auto text-center mb-16">\r
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{{ content().servicesTitle }}</h2>\r
            <p class="text-gray-600 dark:text-gray-400 text-lg">\r
                {{ content().servicesDescription }}\r
            </p>\r
        </div>\r
\r
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">\r
            @for (service of content().services; track service.id) {\r
                <!-- Service Card -->\r
                <div class="group bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:-translate-y-1">\r
                    \r
                    <!-- Image -->\r
                    <div class="h-32 md:h-52 overflow-hidden relative">\r
                        <div class="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>\r
                        <img [ngSrc]="service.image" [alt]="service.title" \r
                             class="object-cover transform group-hover:scale-105 transition-transform duration-700" fill sizes="(max-width: 768px) 50vw, 33vw">\r
                        \r
                        <!-- Icon Badge -->\r
                        <div class="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20 w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-sm md:text-xl">\r
                            <i class="fa-solid" [class]="service.icon"></i>\r
                        </div>\r
                    </div>\r
\r
                    <!-- Content -->\r
                    <div class="p-4 md:p-8 flex flex-col grow">\r
                        <h3 class="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 md:line-clamp-none leading-tight">\r
                            {{ service.title }}\r
                        </h3>\r
                        <p class="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-6 leading-relaxed grow line-clamp-3">\r
                            {{ service.description }}\r
                        </p>\r
\r
                        <!-- Features Preview -->\r
                        <ul class="space-y-1 md:space-y-2 mb-3 md:mb-6 hidden md:block">\r
                            @for (feature of service.features.slice(0, 3); track feature) {\r
                                <li class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">\r
                                    <i class="fas fa-check text-green-500 mt-0.5"></i>\r
                                    <span>{{ feature }}</span>\r
                                </li>\r
                            }\r
                        </ul>\r
\r
                        <div class="mt-auto pt-3 md:pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">\r
                            <span class="text-xs md:text-sm font-semibold text-indigo-600 dark:text-indigo-400 truncate">\r
                                {{ service.price }}\r
                            </span>\r
                            \r
                            <a [routerLink]="service.link" (click)="openService(service, $event)"\r
                               class="btn btn-xs md:btn-sm btn-circle btn-ghost text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors shrink-0">\r
                                <i class="fas fa-arrow-right"></i>\r
                            </a>\r
                        </div>\r
                    </div>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Guarantees Grid -->\r
<section class="py-20 bg-gray-50 dark:bg-[#0a0a0a]">\r
    <div class="container mx-auto px-4">\r
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\r
            @for (item of content().guarantees; track item.title) {\r
                <div class="flex gap-5 items-start p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl group hover:-translate-y-1">\r
                    <div class="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">\r
                        <i class="fa-solid" [class]="item.icon"></i>\r
                    </div>\r
                    <div>\r
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ item.title }}</h4>\r
                        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ item.description }}</p>\r
                    </div>\r
                </div>\r
            }\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- CTA Final -->\r
<section class="py-20 relative overflow-hidden">\r
    <div class="absolute inset-0 bg-linear-to-r from-blue-900 to-indigo-900 z-0"></div>\r
    <!-- Removed pattern svg to avoid build error -->\r
    \r
    <div class="container mx-auto px-4 relative z-10 text-center">\r
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">{{ content().ctaTitle }}</h2>\r
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{{ content().ctaDescription }}</p>\r
        \r
        <div class="flex flex-col sm:flex-row justify-center gap-4">\r
            <a [href]="'https://wa.me/' + whatsappNumber" target="_blank"\r
               class="btn btn-lg bg-green-500 border-none hover:bg-green-600 text-white rounded-full px-8 shadow-xl shadow-green-900/20">\r
                <i class="fa-brands fa-whatsapp mr-2 text-xl"></i> {{ content().ctaWhatsapp }}\r
            </a>\r
            <a href="mailto:contacto@arecofix.com"\r
               class="btn btn-lg btn-ghost text-white border-white/20 hover:bg-white/10 rounded-full px-8">\r
                {{ content().ctaForm }}\r
            </a>\r
        </div>\r
    </div>\r
</section>\r
\r
<!-- Modal -->\r
@if (showModal()) {\r
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"\r
         (click)="closeModal()">\r
        \r
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-gray-100 dark:border-gray-700"\r
             (click)="$event.stopPropagation()">\r
             \r
            <div class="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center text-white">\r
                <h3 class="text-lg font-bold">Servicios Especializados</h3>\r
                <button (click)="closeModal()" class="hover:text-white/80 transition-colors">\r
                    <i class="fas fa-times text-xl"></i>\r
                </button>\r
            </div>\r
            \r
            <div class="p-8">\r
                @if (selectedService()) {\r
                    <div class="flex items-center gap-4 mb-6">\r
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">\r
                            <i class="fa-solid" [class]="selectedService()?.icon || 'fa-star'"></i>\r
                        </div>\r
                        <div>\r
                            <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedService()?.title }}</h4>\r
                            <p class="text-sm text-gray-500">{{ selectedService()?.price }}</p>\r
                        </div>\r
                    </div>\r
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">\r
                        {{ selectedService()?.description }}\r
                    </p>\r
                } @else {\r
                    <p class="text-gray-600 dark:text-gray-300 mb-6 font-medium">Otros servicios disponibles bajo demanda:</p>\r
                    <ul class="space-y-3 mb-8">\r
                        @for (item of otherServicesList(); track item) {\r
                            <li class="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">\r
                                <i class="fas fa-circle-check text-green-500"></i>\r
                                <span>{{ item }}</span>\r
                            </li>\r
                        }\r
                    </ul>\r
                }\r
\r
                <a [href]="'https://wa.me/' + whatsappNumber + '?text=Consulta%20sobre%20' + (selectedService()?.title || 'Otros Servicios')" \r
                   target="_blank"\r
                   class="btn btn-primary w-full rounded-xl gap-2">\r
                    <i class="fa-brands fa-whatsapp"></i> Consultar Disponibilidad\r
                </a>\r
            </div>\r
        </div>\r
    </div>\r
}` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ServiciosComponent, { className: "ServiciosComponent", filePath: "src/app/public/servicios/servicios.ts", lineNumber: 19 });
})();
export {
  ServiciosComponent
};
//# sourceMappingURL=chunk-3YMQ3JI7.mjs.map
