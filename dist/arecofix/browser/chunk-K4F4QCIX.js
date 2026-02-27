import {
  PostService
} from "./chunk-66B2ZSJN.js";
import "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
} from "./chunk-ODRBL5CU.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import {
  RouterLink
} from "./chunk-CP6GQXNM.js";
import {
  CommonModule,
  DatePipe
} from "./chunk-F32QBW3I.js";
import {
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DPJFS6PI.js";
import "./chunk-46DXP6YY.js";

// src/app/public/fixtecnicos/fixtecnicos.component.ts
var _c0 = () => ({ category: "herramientas" });
var _c1 = () => ({ category: "repuestos" });
var _c2 = (a0) => ["/posts", a0];
var _forTrack0 = ($index, $item) => $item.id;
function FixtecnicosComponent_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 63);
    \u0275\u0275text(1, " Verificando... ");
  }
}
function FixtecnicosComponent_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Verificar Estado ");
  }
}
function FixtecnicosComponent_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275element(1, "i", 65);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "p", 66);
    \u0275\u0275text(5, "* Resultado de demostraci\xF3n. Para validaci\xF3n legal consulte ENACOM.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("alert-success", ctx_r0.imeiResult.status === "clean")("alert-error", ctx_r0.imeiResult.status === "stolen");
    \u0275\u0275advance();
    \u0275\u0275classProp("fa-check-circle", ctx_r0.imeiResult.status === "clean")("fa-exclamation-triangle", ctx_r0.imeiResult.status === "stolen");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.imeiResult.message);
  }
}
function FixtecnicosComponent_Conditional_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275element(1, "span", 67);
    \u0275\u0275elementEnd();
  }
}
function FixtecnicosComponent_Conditional_109_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 68)(1, "figure", 69);
    \u0275\u0275element(2, "img", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 71)(4, "div", 72)(5, "span", 73);
    \u0275\u0275text(6, "Aporte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "time");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "h3", 74)(11, "a", 75);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "p", 76);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 77)(16, "button", 78);
    \u0275\u0275element(17, "i", 79);
    \u0275\u0275text(18, " Comentar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 78);
    \u0275\u0275element(20, "i", 80);
    \u0275\u0275text(21, " Me gusta ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const post_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", post_r2.image || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", post_r2.title);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 6, post_r2.created_at, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c2, post_r2.slug));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", post_r2.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(post_r2.content);
  }
}
function FixtecnicosComponent_Conditional_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275repeaterCreate(1, FixtecnicosComponent_Conditional_109_For_2_Template, 22, 11, "article", 68, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.posts());
  }
}
var FixtecnicosComponent = class _FixtecnicosComponent {
  postService = inject(PostService);
  // Community Feed
  posts = signal([], ...ngDevMode ? [{ debugName: "posts" }] : []);
  loadingPosts = signal(true, ...ngDevMode ? [{ debugName: "loadingPosts" }] : []);
  // IMEI Checker
  imeiInput = "";
  imeiResult = null;
  checkingImei = false;
  async ngOnInit() {
    this.loadCommunityPosts();
  }
  async loadCommunityPosts() {
    try {
      const posts = await this.postService.getRecentPosts(5);
      this.posts.set(posts);
    } catch (err) {
      console.error("Error loading posts", err);
    } finally {
      this.loadingPosts.set(false);
    }
  }
  checkImei() {
    if (!this.imeiInput || this.imeiInput.length < 15) {
      alert("Por favor ingrese un IMEI v\xE1lido de 15 d\xEDgitos.");
      return;
    }
    this.checkingImei = true;
    this.imeiResult = null;
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.8) {
        this.imeiResult = { status: "stolen", message: "REPORTADO: Este dispositivo tiene reporte de robo/hurto." };
      } else {
        this.imeiResult = { status: "clean", message: "LIMPIO: El IMEI no presenta reportes negativos." };
      }
      this.checkingImei = false;
    }, 1500);
  }
  downloadPdf() {
    const link = document.createElement("a");
    link.href = "assets/docs/guia-tecnicos.pdf";
    link.download = "guia-tecnicos.pdf";
    link.click();
    alert("Descargando Gu\xEDa para T\xE9cnicos...");
  }
  static \u0275fac = function FixtecnicosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FixtecnicosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FixtecnicosComponent, selectors: [["app-fixtecnicos"]], decls: 110, vars: 13, consts: [[1, "min-h-screen", "bg-gray-50"], [1, "relative", "bg-blue-900", "text-white", "py-20", "overflow-hidden"], [1, "absolute", "inset-0", "opacity-10", "bg-[url('/assets/img/repair/1.jpg')]", "bg-cover", "bg-center"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "text-center"], [1, "text-sm", "breadcrumbs", "text-blue-200", "justify-center", "mb-6", "flex"], ["routerLink", "/", 1, "hover:text-white", "transition-colors"], [1, "font-semibold", "text-white"], [1, "text-4xl", "md:text-6xl", "font-bold", "mb-6"], [1, "text-xl", "md:text-2xl", "text-blue-100", "mb-8", "max-w-3xl", "mx-auto"], [1, "flex", "flex-wrap", "justify-center", "gap-4"], ["href", "https://www.facebook.com/share/g/1HH4Rqrfdr/", "target", "_blank", 1, "btn", "btn-lg", "bg-[#1877F2]", "hover:bg-[#166fe5]", "text-white", "border-none", "gap-2"], [1, "fab", "fa-facebook-f"], [1, "btn", "btn-lg", "btn-outline", "text-white", "hover:bg-white", "hover:text-blue-900", "gap-2", 3, "click"], [1, "fas", "fa-file-pdf"], [1, "py-12", "-mt-8", "relative", "z-20"], [1, "container", "mx-auto", "px-4"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], ["routerLink", "/academy", 1, "card", "bg-white", "shadow-xl", "hover:shadow-2xl", "transition-all", "hover:-translate-y-1", "cursor-pointer", "group"], [1, "card-body", "items-center", "text-center"], [1, "w-16", "h-16", "rounded-full", "bg-blue-100", "text-blue-600", "flex", "items-center", "justify-center", "text-2xl", "mb-2", "group-hover:bg-blue-600", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-graduation-cap"], [1, "card-title"], [1, "text-gray-600"], ["routerLink", "/productos", 1, "card", "bg-white", "shadow-xl", "hover:shadow-2xl", "transition-all", "hover:-translate-y-1", "cursor-pointer", "group", 3, "queryParams"], [1, "w-16", "h-16", "rounded-full", "bg-orange-100", "text-orange-600", "flex", "items-center", "justify-center", "text-2xl", "mb-2", "group-hover:bg-orange-600", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-tools"], [1, "w-16", "h-16", "rounded-full", "bg-green-100", "text-green-600", "flex", "items-center", "justify-center", "text-2xl", "mb-2", "group-hover:bg-green-600", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-microchip"], [1, "py-16"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-12"], [1, "bg-white", "rounded-2xl", "shadow-lg", "p-8", "border", "border-gray-100"], [1, "flex", "items-center", "gap-3", "mb-6"], [1, "p-3", "bg-red-100", "text-red-600", "rounded-lg"], [1, "fas", "fa-mobile-alt", "text-xl"], [1, "text-2xl", "font-bold", "text-gray-800"], [1, "text-gray-600", "mb-6"], [1, "form-control", "mb-4"], [1, "label"], [1, "label-text", "font-medium"], [1, "relative"], ["type", "text", "placeholder", "Ej: 3529...", "maxlength", "15", 1, "input", "input-bordered", "w-full", "pl-10", "font-mono", "text-lg", 3, "ngModelChange", "ngModel"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-gray-400"], [1, "fas", "fa-barcode"], [1, "btn", "btn-primary", "w-full", "mb-4", 3, "click", "disabled"], [1, "bg-gray-900", "rounded-2xl", "shadow-lg", "p-8", "text-white", "relative", "overflow-hidden"], [1, "absolute", "top-0", "right-0", "w-64", "h-64", "bg-blue-500", "rounded-full", "blur-3xl", "opacity-20", "-mr-16", "-mt-16"], [1, "relative", "z-10"], [1, "inline-block", "px-3", "py-1", "bg-blue-500/20", "text-blue-300", "rounded-full", "text-sm", "font-bold", "mb-4"], [1, "text-3xl", "font-bold", "mb-4"], [1, "text-gray-300", "mb-6", "text-lg"], [1, "space-y-3", "mb-8"], [1, "flex", "items-center", "gap-3"], [1, "fas", "fa-check", "text-green-400"], [1, "btn", "btn-primary", "btn-lg", "w-full", "gap-2", "shadow-lg", "shadow-blue-500/30"], [1, "fas", "fa-rocket"], [1, "py-16", "bg-white"], [1, "flex", "justify-between", "items-center", "mb-10"], [1, "text-3xl", "font-bold", "text-gray-800"], [1, "text-gray-600", "mt-2"], [1, "btn", "btn-outline", "btn-primary"], [1, "fas", "fa-plus"], [1, "flex", "justify-center", "py-12"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8"], [1, "loading", "loading-spinner"], [1, "alert"], [1, "fas"], [1, "text-xs", "text-gray-500", "mt-2", "text-center"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "card", "bg-base-100", "shadow-lg", "hover:shadow-xl", "transition-all", "border", "border-gray-100"], [1, "h-48", "overflow-hidden"], [1, "w-full", "h-full", "object-cover", "hover:scale-105", "transition-transform", "duration-500", 3, "src", "alt"], [1, "card-body"], [1, "flex", "items-center", "gap-2", "text-xs", "text-gray-500", "mb-2"], [1, "badge", "badge-ghost", "badge-sm"], [1, "card-title", "text-lg"], [1, "hover:text-blue-600", "transition-colors", 3, "routerLink"], [1, "text-gray-600", "text-sm", "line-clamp-3"], [1, "card-actions", "justify-end", "mt-4", "pt-4", "border-t", "border-gray-100"], [1, "btn", "btn-sm", "btn-ghost", "gap-2"], [1, "far", "fa-comment"], [1, "far", "fa-heart"]], template: function FixtecnicosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "section", 1);
      \u0275\u0275element(2, "div", 2);
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "ul")(6, "li")(7, "a", 5);
      \u0275\u0275text(8, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "li", 6);
      \u0275\u0275text(10, "FixT\xE9cnicos");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "h1", 7);
      \u0275\u0275text(12, "Comunidad FixT\xE9cnicos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p", 8);
      \u0275\u0275text(14, " El espacio definitivo para t\xE9cnicos de celulares e inform\xE1tica. Recursos, comunidad y herramientas profesionales. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 9)(16, "a", 10);
      \u0275\u0275element(17, "i", 11);
      \u0275\u0275text(18, " Unirse al Grupo ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "button", 12);
      \u0275\u0275listener("click", function FixtecnicosComponent_Template_button_click_19_listener() {
        return ctx.downloadPdf();
      });
      \u0275\u0275element(20, "i", 13);
      \u0275\u0275text(21, " Descargar Gu\xEDa PDF ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "section", 14)(23, "div", 15)(24, "div", 16)(25, "a", 17)(26, "div", 18)(27, "div", 19);
      \u0275\u0275element(28, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "h2", 21);
      \u0275\u0275text(30, "Cursos Disponibles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p", 22);
      \u0275\u0275text(32, "Capac\xEDtate con los mejores cursos de reparaci\xF3n y software.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(33, "a", 23)(34, "div", 18)(35, "div", 24);
      \u0275\u0275element(36, "i", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "h2", 21);
      \u0275\u0275text(38, "Herramientas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "p", 22);
      \u0275\u0275text(40, "Equipamiento profesional para tu taller.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(41, "a", 23)(42, "div", 18)(43, "div", 26);
      \u0275\u0275element(44, "i", 27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "h2", 21);
      \u0275\u0275text(46, "Repuestos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "p", 22);
      \u0275\u0275text(48, "Componentes de calidad para todas las marcas.");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(49, "section", 28)(50, "div", 15)(51, "div", 29)(52, "div", 30)(53, "div", 31)(54, "div", 32);
      \u0275\u0275element(55, "i", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "h2", 34);
      \u0275\u0275text(57, "Verificar IMEI");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "p", 35);
      \u0275\u0275text(59, "Consulta el estado de reporte de cualquier dispositivo al instante. Base de datos actualizada.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 36)(61, "label", 37)(62, "span", 38);
      \u0275\u0275text(63, "N\xFAmero de IMEI (15 d\xEDgitos)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "div", 39)(65, "input", 40);
      \u0275\u0275twoWayListener("ngModelChange", function FixtecnicosComponent_Template_input_ngModelChange_65_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.imeiInput, $event) || (ctx.imeiInput = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "div", 41);
      \u0275\u0275element(67, "i", 42);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(68, "button", 43);
      \u0275\u0275listener("click", function FixtecnicosComponent_Template_button_click_68_listener() {
        return ctx.checkImei();
      });
      \u0275\u0275conditionalCreate(69, FixtecnicosComponent_Conditional_69_Template, 2, 0)(70, FixtecnicosComponent_Conditional_70_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(71, FixtecnicosComponent_Conditional_71_Template, 6, 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div", 44);
      \u0275\u0275element(73, "div", 45);
      \u0275\u0275elementStart(74, "div", 46)(75, "div", 47);
      \u0275\u0275text(76, " SOFTWARE PREMIUM ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "h2", 48);
      \u0275\u0275text(78, "Gesti\xF3n de Taller Pro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "p", 49);
      \u0275\u0275text(80, " Optimiza tu negocio con nuestro software especializado. Control de reparaciones, stock, clientes y facturaci\xF3n en un solo lugar. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "ul", 50)(82, "li", 51);
      \u0275\u0275element(83, "i", 52);
      \u0275\u0275text(84, " Seguimiento de \xF3rdenes en tiempo real ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "li", 51);
      \u0275\u0275element(86, "i", 52);
      \u0275\u0275text(87, " Impresi\xF3n de tickets y etiquetas ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "li", 51);
      \u0275\u0275element(89, "i", 52);
      \u0275\u0275text(90, " Control de inventario y caja ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "li", 51);
      \u0275\u0275element(92, "i", 52);
      \u0275\u0275text(93, " Notificaciones autom\xE1ticas por WhatsApp ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(94, "button", 53);
      \u0275\u0275element(95, "i", 54);
      \u0275\u0275text(96, " Obtener Licencia ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(97, "section", 55)(98, "div", 15)(99, "div", 56)(100, "div")(101, "h2", 57);
      \u0275\u0275text(102, "Comunidad T\xE9cnica");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(103, "p", 58);
      \u0275\u0275text(104, "\xDAltimas discusiones, aportes y consultas.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(105, "button", 59);
      \u0275\u0275element(106, "i", 60);
      \u0275\u0275text(107, " Nueva Publicaci\xF3n ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(108, FixtecnicosComponent_Conditional_108_Template, 2, 0, "div", 61)(109, FixtecnicosComponent_Conditional_109_Template, 3, 0, "div", 62);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(33);
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(11, _c0));
      \u0275\u0275advance(8);
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(12, _c1));
      \u0275\u0275advance(24);
      \u0275\u0275classProp("input-error", (ctx.imeiResult == null ? null : ctx.imeiResult.status) === "stolen")("input-success", (ctx.imeiResult == null ? null : ctx.imeiResult.status) === "clean");
      \u0275\u0275twoWayProperty("ngModel", ctx.imeiInput);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.checkingImei);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.checkingImei ? 69 : 70);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.imeiResult ? 71 : -1);
      \u0275\u0275advance(37);
      \u0275\u0275conditional(ctx.loadingPosts() ? 108 : 109);
    }
  }, dependencies: [CommonModule, RouterLink, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FixtecnicosComponent, [{
    type: Component,
    args: [{ selector: "app-fixtecnicos", standalone: true, imports: [CommonModule, RouterLink, FormsModule], template: `<div class="min-h-screen bg-gray-50">\r
  <!-- Hero Section -->\r
  <section class="relative bg-blue-900 text-white py-20 overflow-hidden">\r
    <div class="absolute inset-0 opacity-10 bg-[url('/assets/img/repair/1.jpg')] bg-cover bg-center"></div>\r
    <div class="container mx-auto px-4 relative z-10 text-center">\r
      <!-- Breadcrumbs -->\r
      <div class="text-sm breadcrumbs text-blue-200 justify-center mb-6 flex">\r
          <ul>\r
              <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>\r
              <li class="font-semibold text-white">FixT\xE9cnicos</li>\r
          </ul>\r
      </div>\r
\r
      <h1 class="text-4xl md:text-6xl font-bold mb-6">Comunidad FixT\xE9cnicos</h1>\r
      <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">\r
        El espacio definitivo para t\xE9cnicos de celulares e inform\xE1tica. Recursos, comunidad y herramientas profesionales.\r
      </p>\r
      \r
      <div class="flex flex-wrap justify-center gap-4">\r
        <a href="https://www.facebook.com/share/g/1HH4Rqrfdr/" target="_blank" \r
           class="btn btn-lg bg-[#1877F2] hover:bg-[#166fe5] text-white border-none gap-2">\r
          <i class="fab fa-facebook-f"></i> Unirse al Grupo\r
        </a>\r
        <button (click)="downloadPdf()" class="btn btn-lg btn-outline text-white hover:bg-white hover:text-blue-900 gap-2">\r
          <i class="fas fa-file-pdf"></i> Descargar Gu\xEDa PDF\r
        </button>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- Quick Navigation -->\r
  <section class="py-12 -mt-8 relative z-20">\r
    <div class="container mx-auto px-4">\r
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\r
        <!-- Cursos -->\r
        <a routerLink="/academy" class="card bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">\r
          <div class="card-body items-center text-center">\r
            <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">\r
              <i class="fas fa-graduation-cap"></i>\r
            </div>\r
            <h2 class="card-title">Cursos Disponibles</h2>\r
            <p class="text-gray-600">Capac\xEDtate con los mejores cursos de reparaci\xF3n y software.</p>\r
          </div>\r
        </a>\r
\r
        <!-- Herramientas -->\r
        <a routerLink="/productos" [queryParams]="{category: 'herramientas'}" class="card bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">\r
          <div class="card-body items-center text-center">\r
            <div class="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-2 group-hover:bg-orange-600 group-hover:text-white transition-colors">\r
              <i class="fas fa-tools"></i>\r
            </div>\r
            <h2 class="card-title">Herramientas</h2>\r
            <p class="text-gray-600">Equipamiento profesional para tu taller.</p>\r
          </div>\r
        </a>\r
\r
        <!-- Repuestos -->\r
        <a routerLink="/productos" [queryParams]="{category: 'repuestos'}" class="card bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">\r
          <div class="card-body items-center text-center">\r
            <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-2 group-hover:bg-green-600 group-hover:text-white transition-colors">\r
              <i class="fas fa-microchip"></i>\r
            </div>\r
            <h2 class="card-title">Repuestos</h2>\r
            <p class="text-gray-600">Componentes de calidad para todas las marcas.</p>\r
          </div>\r
        </a>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- IMEI Checker & Software Promo -->\r
  <section class="py-16">\r
    <div class="container mx-auto px-4">\r
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">\r
        \r
        <!-- IMEI Checker -->\r
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">\r
          <div class="flex items-center gap-3 mb-6">\r
            <div class="p-3 bg-red-100 text-red-600 rounded-lg">\r
              <i class="fas fa-mobile-alt text-xl"></i>\r
            </div>\r
            <h2 class="text-2xl font-bold text-gray-800">Verificar IMEI</h2>\r
          </div>\r
          <p class="text-gray-600 mb-6">Consulta el estado de reporte de cualquier dispositivo al instante. Base de datos actualizada.</p>\r
          \r
          <div class="form-control mb-4">\r
            <label class="label">\r
              <span class="label-text font-medium">N\xFAmero de IMEI (15 d\xEDgitos)</span>\r
            </label>\r
            <div class="relative">\r
              <input type="text" [(ngModel)]="imeiInput" placeholder="Ej: 3529..." maxlength="15" \r
                     class="input input-bordered w-full pl-10 font-mono text-lg"\r
                     [class.input-error]="imeiResult?.status === 'stolen'"\r
                     [class.input-success]="imeiResult?.status === 'clean'">\r
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">\r
                <i class="fas fa-barcode"></i>\r
              </div>\r
            </div>\r
          </div>\r
\r
          <button (click)="checkImei()" [disabled]="checkingImei" class="btn btn-primary w-full mb-4">\r
            @if(checkingImei) {\r
              <span class="loading loading-spinner"></span> Verificando...\r
            } @else {\r
              Verificar Estado\r
            }\r
          </button>\r
\r
          @if (imeiResult) {\r
            <div class="alert" [class.alert-success]="imeiResult.status === 'clean'" [class.alert-error]="imeiResult.status === 'stolen'">\r
              <i class="fas" [class.fa-check-circle]="imeiResult.status === 'clean'" [class.fa-exclamation-triangle]="imeiResult.status === 'stolen'"></i>\r
              <span>{{ imeiResult.message }}</span>\r
            </div>\r
            <p class="text-xs text-gray-500 mt-2 text-center">* Resultado de demostraci\xF3n. Para validaci\xF3n legal consulte ENACOM.</p>\r
          }\r
        </div>\r
\r
        <!-- Software Promo -->\r
        <div class="bg-gray-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">\r
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>\r
          \r
          <div class="relative z-10">\r
            <div class="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold mb-4">\r
              SOFTWARE PREMIUM\r
            </div>\r
            <h2 class="text-3xl font-bold mb-4">Gesti\xF3n de Taller Pro</h2>\r
            <p class="text-gray-300 mb-6 text-lg">\r
              Optimiza tu negocio con nuestro software especializado. Control de reparaciones, stock, clientes y facturaci\xF3n en un solo lugar.\r
            </p>\r
            \r
            <ul class="space-y-3 mb-8">\r
              <li class="flex items-center gap-3">\r
                <i class="fas fa-check text-green-400"></i> Seguimiento de \xF3rdenes en tiempo real\r
              </li>\r
              <li class="flex items-center gap-3">\r
                <i class="fas fa-check text-green-400"></i> Impresi\xF3n de tickets y etiquetas\r
              </li>\r
              <li class="flex items-center gap-3">\r
                <i class="fas fa-check text-green-400"></i> Control de inventario y caja\r
              </li>\r
              <li class="flex items-center gap-3">\r
                <i class="fas fa-check text-green-400"></i> Notificaciones autom\xE1ticas por WhatsApp\r
              </li>\r
            </ul>\r
\r
            <button class="btn btn-primary btn-lg w-full gap-2 shadow-lg shadow-blue-500/30">\r
              <i class="fas fa-rocket"></i> Obtener Licencia\r
            </button>\r
          </div>\r
        </div>\r
\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- Community Feed -->\r
  <section class="py-16 bg-white">\r
    <div class="container mx-auto px-4">\r
      <div class="flex justify-between items-center mb-10">\r
        <div>\r
          <h2 class="text-3xl font-bold text-gray-800">Comunidad T\xE9cnica</h2>\r
          <p class="text-gray-600 mt-2">\xDAltimas discusiones, aportes y consultas.</p>\r
        </div>\r
        <button class="btn btn-outline btn-primary">\r
          <i class="fas fa-plus"></i> Nueva Publicaci\xF3n\r
        </button>\r
      </div>\r
\r
      @if (loadingPosts()) {\r
        <div class="flex justify-center py-12">\r
          <span class="loading loading-spinner loading-lg text-primary"></span>\r
        </div>\r
      } @else {\r
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">\r
          @for (post of posts(); track post.id) {\r
            <article class="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-gray-100">\r
              <figure class="h-48 overflow-hidden">\r
                <img [src]="post.image || 'assets/img/no-image.png'" [alt]="post.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />\r
              </figure>\r
              <div class="card-body">\r
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">\r
                  <span class="badge badge-ghost badge-sm">Aporte</span>\r
                  <time>{{ post.created_at | date:'mediumDate' }}</time>\r
                </div>\r
                <h3 class="card-title text-lg">\r
                  <a [routerLink]="['/posts', post.slug]" class="hover:text-blue-600 transition-colors">\r
                    {{ post.title }}\r
                  </a>\r
                </h3>\r
                <p class="text-gray-600 text-sm line-clamp-3">{{ post.content }}</p>\r
                <div class="card-actions justify-end mt-4 pt-4 border-t border-gray-100">\r
                  <button class="btn btn-sm btn-ghost gap-2">\r
                    <i class="far fa-comment"></i> Comentar\r
                  </button>\r
                  <button class="btn btn-sm btn-ghost gap-2">\r
                    <i class="far fa-heart"></i> Me gusta\r
                  </button>\r
                </div>\r
              </div>\r
            </article>\r
          }\r
        </div>\r
      }\r
    </div>\r
  </section>\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FixtecnicosComponent, { className: "FixtecnicosComponent", filePath: "src/app/public/fixtecnicos/fixtecnicos.component.ts", lineNumber: 14 });
})();
export {
  FixtecnicosComponent
};
//# sourceMappingURL=chunk-K4F4QCIX.js.map
