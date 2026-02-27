import './polyfills.server.mjs';
import {
  RepairStatus
} from "./chunk-65P2T3U5.mjs";
import {
  CompanyService
} from "./chunk-BBYC5QHM.mjs";
import {
  SeoService
} from "./chunk-3LSO3424.mjs";
import {
  AuthService
} from "./chunk-EIU5CNMA.mjs";
import {
  LoggerService
} from "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  DatePipe,
  NgClass
} from "./chunk-NQCCIK3J.mjs";
import {
  Component,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/public/tracking/services/tracking.service.ts
var TrackingService = class _TrackingService {
  auth = inject(AuthService);
  async getRepairByCode(code) {
    const supabase = this.auth.getSupabaseClient();
    return await supabase.rpc("get_repair_by_tracking", { t_code: code });
  }
  static \u0275fac = function TrackingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrackingService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TrackingService, factory: _TrackingService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrackingService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/public/tracking/tracking-page.ts
var _c0 = () => [1, 2, 3, 4, 5];
function TrackingPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "span", 12);
    \u0275\u0275elementStart(2, "p", 13);
    \u0275\u0275text(3, "Consultando Sat\xE9lite...");
    \u0275\u0275elementEnd()();
  }
}
function TrackingPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 14);
    \u0275\u0275element(2, "i", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 17);
    \u0275\u0275text(6, "Verific\xE1 tu c\xF3digo o contactanos por WhatsApp.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 18)(8, "a", 19);
    \u0275\u0275element(9, "i", 20);
    \u0275\u0275text(10, " Soporte Directo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 21);
    \u0275\u0275text(12, "Volver al inicio");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
    \u0275\u0275advance(4);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r0.whatsappNumber, \u0275\u0275sanitizeUrl);
  }
}
function TrackingPage_Conditional_12_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const step_r3 = ctx.$implicit;
    const r_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", r_r4.current_status_id >= step_r3 ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-white border-neutral-100 text-neutral-300");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", step_r3, " ");
  }
}
function TrackingPage_Conditional_12_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "h4", 58);
    \u0275\u0275element(2, "span", 59);
    \u0275\u0275text(3, " Reporte T\xE9cnico ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 60);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(' "', r_r4.technical_report || r_r4.technician_notes, '" ');
  }
}
function TrackingPage_Conditional_12_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("SE\xD1A ENTREGADA: $", r_r4.deposit_amount);
  }
}
function TrackingPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "span", 24);
    \u0275\u0275text(3, "Estado de Reparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "h2", 26);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 27);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 28)(11, "div", 29)(12, "div", 30);
    \u0275\u0275repeaterCreate(13, TrackingPage_Conditional_12_For_14_Template, 2, 2, "div", 31, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 32);
    \u0275\u0275element(16, "div", 33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 34)(18, "div", 35)(19, "div", 36)(20, "div", 37);
    \u0275\u0275element(21, "i", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div")(23, "h4", 39);
    \u0275\u0275text(24, "Equipo en Taller");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p", 40);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 41)(28, "div", 42)(29, "span", 43);
    \u0275\u0275text(30, "Fecha de Ingreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 44);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 42)(35, "span", 43);
    \u0275\u0275text(36, "Motivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span", 45);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(39, TrackingPage_Conditional_12_Conditional_39_Template, 6, 1, "div", 46);
    \u0275\u0275elementStart(40, "div", 47)(41, "div", 48)(42, "div")(43, "h4", 49);
    \u0275\u0275text(44, "Presupuesto Final");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p", 50);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 51);
    \u0275\u0275conditionalCreate(48, TrackingPage_Conditional_12_Conditional_48_Template, 2, 1, "span", 52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 53)(50, "button", 54);
    \u0275\u0275listener("click", function TrackingPage_Conditional_12_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.printTicket());
    });
    \u0275\u0275element(51, "i", 55);
    \u0275\u0275text(52, " Tal\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "a", 56);
    \u0275\u0275element(54, "i", 57);
    \u0275\u0275text(55, " Chat ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const r_r4 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.getStatusColor(r_r4.current_status_id));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("#", r_r4.tracking_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStatusLabel(r_r4.current_status_id), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Tu ", r_r4.device_model, " est\xE1 siendo gestionado con la m\xE1xima prioridad t\xE9cnica. ");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(16, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", (r_r4.current_status_id - 1) * 25, "%");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(r_r4.device_model);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(33, 13, r_r4.received_at || r_r4.created_at, "dd MMM yyyy"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1('"', r_r4.issue_description, '"');
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r4.technician_notes || r_r4.technical_report ? 39 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("$", (r_r4.final_cost || r_r4.estimated_cost || 0) - (r_r4.deposit_amount || 0));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r4.deposit_amount && r_r4.deposit_amount > 0 ? 48 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r0.whatsappNumber, \u0275\u0275sanitizeUrl);
  }
}
function TrackingPage_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 61)(2, "h1", 62);
    \u0275\u0275text(3, "ARECOFIX");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 63);
    \u0275\u0275text(5, "Gesti\xF3n T\xE9cnica Profesional");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 64);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 65)(9, "div", 66)(10, "span");
    \u0275\u0275text(11, "TRACKING:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 67);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 66)(15, "span");
    \u0275\u0275text(16, "FECHA:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 68)(21, "span");
    \u0275\u0275text(22, "CLIENTE:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 69);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 66)(26, "span");
    \u0275\u0275text(27, "EQUIPO:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 69);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 70)(31, "p", 71);
    \u0275\u0275text(32, "Saldo a Pagar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p", 72);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 73)(36, "p");
    \u0275\u0275text(37, "* Presentar este tal\xF3n para el retiro.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "p");
    \u0275\u0275text(39, "* No se entregan equipos sin comprobante.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p");
    \u0275\u0275text(41, "* Garant\xEDa: 30 d\xEDas sobre el trabajo realizado.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 74);
    \u0275\u0275element(43, "div", 75);
    \u0275\u0275elementStart(44, "p", 76);
    \u0275\u0275text(45, "FIRMA T\xC9CNICA");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r5 = ctx;
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("OT #: ", r_r5.repair_number || "---");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r5.tracking_code);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 6, r_r5.received_at || r_r5.created_at, "dd/MM/yy HH:mm"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r5.customer_name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r5.device_model);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", (r_r5.final_cost || r_r5.estimated_cost || 0) - (r_r5.deposit_amount || 0));
  }
}
var TrackingPage = class _TrackingPage {
  route = inject(ActivatedRoute);
  trackingService = inject(TrackingService);
  logger = inject(LoggerService);
  seoService = inject(SeoService);
  companyService = inject(CompanyService);
  whatsappNumber = environment.contact.whatsappNumber;
  code = null;
  repair = signal(null, ...ngDevMode ? [{ debugName: "repair" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.code = this.route.snapshot.paramMap.get("code");
    if (this.code) {
      await this.loadRepair();
    } else {
      this.error.set("C\xF3digo de seguimiento no v\xE1lido.");
      this.loading.set(false);
    }
  }
  async loadRepair() {
    const code = this.code;
    if (!code)
      return;
    try {
      const { data, error } = await this.trackingService.getRepairByCode(code);
      if (error) {
        this.logger.error("Error fetching repair:", error);
        this.error.set(`Error al buscar la reparaci\xF3n. Por favor intente nuevamente.`);
      } else if (data && Array.isArray(data) && data.length > 0) {
        const repairData = data[0];
        this.repair.set(repairData);
        await this.updateSeo(repairData);
      } else if (data && !Array.isArray(data)) {
        const repairData = data;
        this.repair.set(repairData);
        await this.updateSeo(repairData);
      } else {
        this.error.set("No se encontr\xF3 ninguna reparaci\xF3n con este c\xF3digo.");
      }
    } catch (e) {
      this.logger.error("TrackingPage: Unexpected error:", e);
      this.error.set("Ocurri\xF3 un error inesperado al procesar su solicitud.");
    } finally {
      this.loading.set(false);
    }
  }
  async updateSeo(r) {
    const statusName = this.getStatusLabel(r.current_status_id);
    let imageUrl = "assets/img/branding/og-services.jpg";
    try {
      const settings = await this.companyService.getSettings();
      if (settings?.logo_url) {
        imageUrl = settings.logo_url;
      }
    } catch (e) {
      this.logger.warn("Could not fetch company settings for SEO image", e);
    }
    this.seoService.setPageData({
      title: `${statusName} - Tu ${r.device_model}`,
      description: `Gracias por confiar en Arecofix. Tu equipo est\xE1 en etapa de ${statusName}.`,
      imageUrl,
      type: "article"
    });
  }
  getStatusLabel(statusId) {
    const statusMap = {
      [RepairStatus.PENDING_DIAGNOSIS]: "PENDIENTE DE DIAGN\xD3STICO",
      [RepairStatus.SUPPLY_MANAGEMENT]: "GESTI\xD3N DE REPUESTOS",
      [RepairStatus.IN_PROGRESS]: "EN REPARACI\xD3N",
      [RepairStatus.QUALITY_CONTROL]: "CONTROL DE CALIDAD",
      [RepairStatus.READY_FOR_PICKUP]: "LISTO PARA RETIRAR",
      [RepairStatus.DELIVERED]: "ENTREGADO",
      [RepairStatus.CANCELLED]: "CANCELADO"
    };
    return statusMap[statusId] || "PENDIENTE";
  }
  getStatusColor(statusId) {
    const colorMap = {
      [RepairStatus.PENDING_DIAGNOSIS]: "bg-amber-100 text-amber-800 border-amber-200",
      [RepairStatus.SUPPLY_MANAGEMENT]: "bg-cyan-100 text-cyan-800 border-cyan-200",
      [RepairStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
      [RepairStatus.QUALITY_CONTROL]: "bg-indigo-100 text-indigo-800 border-indigo-200",
      [RepairStatus.READY_FOR_PICKUP]: "bg-green-100 text-green-800 border-green-200",
      [RepairStatus.DELIVERED]: "bg-slate-100 text-slate-800 border-slate-200",
      [RepairStatus.CANCELLED]: "bg-rose-100 text-rose-800 border-rose-200"
    };
    return colorMap[statusId] || "bg-slate-100 text-slate-700";
  }
  printTicket() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }
  openImage(url) {
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }
  static \u0275fac = function TrackingPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrackingPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TrackingPage, selectors: [["app-tracking-page"]], decls: 17, vars: 2, consts: [[1, "py-10", "px-4", "min-h-screen", "bg-neutral-50", "no-print"], [1, "max-w-xl", "mx-auto"], [1, "mb-8", "text-center"], [1, "text-2xl", "font-black", "text-neutral-800", "tracking-tighter", "uppercase", "mb-1"], [1, "text-primary"], [1, "text-xs", "text-neutral-400", "font-medium", "uppercase", "tracking-widest"], [1, "bg-white", "rounded-3xl", "shadow-2xl", "shadow-neutral-200/50", "overflow-hidden", "border", "border-neutral-100"], [1, "p-12", "flex", "flex-col", "items-center"], [1, "p-12", "text-center"], [1, "mt-10", "text-center"], [1, "text-[10px]", "font-bold", "text-neutral-300", "uppercase", "tracking-[0.3em]"], [1, "print-only", "p-8", "font-mono", "text-xs", "w-[80mm]", "mx-auto"], [1, "loading", "loading-ring", "loading-lg", "text-primary"], [1, "mt-4", "text-xs", "font-bold", "text-neutral-400", "uppercase", "animate-pulse"], [1, "inline-flex", "items-center", "justify-center", "w-16", "h-16", "bg-rose-50", "text-rose-500", "rounded-full", "mb-6"], [1, "fas", "fa-exclamation-triangle", "text-2xl"], [1, "text-xl", "font-black", "text-neutral-800", "mb-2"], [1, "text-sm", "text-neutral-400", "mb-8", "font-medium"], [1, "flex", "flex-col", "gap-3"], ["target", "_blank", 1, "btn", "btn-success", "text-white", "rounded-2xl", 3, "href"], [1, "fab", "fa-whatsapp", "text-lg"], ["routerLink", "/", 1, "btn", "btn-ghost", "btn-sm", "text-neutral-400"], [1, "p-6", "transition-all", "duration-500", 3, "ngClass"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "text-[10px]", "font-black", "uppercase", "tracking-[0.2em]", "opacity-60"], [1, "text-[10px]", "font-mono", "font-bold", "opacity-60"], [1, "text-3xl", "font-black", "leading-tight", "mb-2", "tracking-tight"], [1, "text-sm", "font-medium", "opacity-80", "leading-relaxed"], [1, "p-6", "space-y-8"], [1, "relative", "pt-4"], [1, "flex", "justify-between", "mb-4"], [1, "w-8", "h-8", "rounded-full", "border-2", "flex", "items-center", "justify-center", "text-[10px]", "font-black", "transition-all", "duration-500", 3, "ngClass"], [1, "absolute", "top-[36px]", "left-0", "right-0", "h-0.5", "bg-neutral-100", "-z-10"], [1, "h-full", "bg-primary", "transition-all", "duration-1000"], [1, "grid", "grid-cols-1", "gap-6"], [1, "bg-neutral-50", "rounded-2xl", "p-5", "border", "border-neutral-100"], [1, "flex", "items-center", "gap-4", "mb-4"], [1, "w-10", "h-10", "bg-white", "rounded-xl", "flex", "items-center", "justify-center", "shadow-sm", "text-primary"], [1, "fas", "fa-microchip"], [1, "text-[10px]", "font-black", "text-neutral-400", "uppercase", "tracking-widest", "leading-none", "mb-1"], [1, "text-sm", "font-bold", "text-neutral-800"], [1, "space-y-3"], [1, "flex", "justify-between", "text-xs"], [1, "text-neutral-400", "font-medium"], [1, "text-neutral-800", "font-bold", "uppercase"], [1, "text-neutral-600", "font-medium", "wrap-break-word", "text-right", "max-w-[180px]"], [1, "bg-primary/5", "rounded-2xl", "p-5", "border", "border-primary/10"], [1, "bg-neutral-800", "rounded-3xl", "p-6", "text-white", "shadow-xl", "shadow-neutral-900/20"], [1, "flex", "justify-between", "items-end", "mb-6"], [1, "text-[10px]", "font-black", "opacity-40", "uppercase", "tracking-widest", "mb-1"], [1, "text-3xl", "font-black", "tracking-tighter"], [1, "text-right"], [1, "badge", "badge-success", "text-[8px]", "font-black", "text-white", "p-2"], [1, "flex", "gap-2"], [1, "btn", "btn-sm", "grow", "rounded-xl", "bg-white/10", "border-none", "text-white", "hover:bg-white/20", "text-[10px]", "font-black", "uppercase", 3, "click"], [1, "fas", "fa-print"], ["target", "_blank", 1, "btn", "btn-sm", "grow", "rounded-xl", "bg-green-500", "border-none", "text-white", "hover:bg-green-600", "text-[10px]", "font-black", "uppercase", 3, "href"], [1, "fab", "fa-whatsapp"], [1, "text-[10px]", "font-black", "text-primary", "uppercase", "tracking-widest", "mb-3", "flex", "items-center", "gap-2"], [1, "w-1.5", "h-1.5", "bg-primary", "rounded-full", "animate-ping"], [1, "text-xs", "font-medium", "text-neutral-700", "leading-relaxed", "italic"], [1, "text-center", "mb-6", "border-b", "border-black", "pb-4"], [1, "text-xl", "font-black", "uppercase"], [1, "text-[8px]", "uppercase", "tracking-tighter"], [1, "mt-2"], [1, "space-y-3", "mb-6"], [1, "flex", "justify-between"], [1, "font-bold"], [1, "flex", "justify-between", "border-t", "border-black", "pt-2"], [1, "font-bold", "text-right", "truncate", "max-w-[120px]"], [1, "border-y", "border-black", "py-3", "text-center", "mb-6"], [1, "font-bold", "uppercase", "mb-1"], [1, "text-2xl", "font-black"], [1, "text-[8px]", "leading-tight", "space-y-2", "mb-8"], [1, "text-center"], [1, "w-32", "h-px", "bg-black", "mx-auto", "mb-1"], [1, "text-[8px]"]], template: function TrackingPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "Arecofix ");
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275text(6, "Tracking");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "p", 5);
      \u0275\u0275text(8, "Estado T\xE9cnico en Tiempo Real");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 6);
      \u0275\u0275conditionalCreate(10, TrackingPage_Conditional_10_Template, 4, 0, "div", 7)(11, TrackingPage_Conditional_11_Template, 13, 2, "div", 8)(12, TrackingPage_Conditional_12_Template, 56, 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 9)(14, "p", 10);
      \u0275\u0275text(15, "ArecoFix \xA9 2024");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(16, TrackingPage_Conditional_16_Template, 46, 9, "div", 11);
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      \u0275\u0275advance(10);
      \u0275\u0275conditional(ctx.loading() ? 10 : ctx.error() ? 11 : (tmp_0_0 = ctx.repair()) ? 12 : -1, tmp_0_0);
      \u0275\u0275advance(6);
      \u0275\u0275conditional((tmp_1_0 = ctx.repair()) ? 16 : -1, tmp_1_0);
    }
  }, dependencies: [CommonModule, NgClass, RouterLink, DatePipe], styles: ["\n\n@media print {\n  .no-print[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n  .print-only[_ngcontent-%COMP%] {\n    display: block !important;\n  }\n  body[_ngcontent-%COMP%] {\n    background: white;\n  }\n  .ticket-container[_ngcontent-%COMP%] {\n    border: 1px dashed #000;\n    padding: 20px;\n    width: 100%;\n    margin: 0;\n  }\n}\n.print-only[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=tracking-page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrackingPage, [{
    type: Component,
    args: [{ selector: "app-tracking-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="py-10 px-4 min-h-screen bg-neutral-50 no-print">\r
    <div class="max-w-xl mx-auto">\r
        <!-- Header -->\r
        <div class="mb-8 text-center">\r
            <h1 class="text-2xl font-black text-neutral-800 tracking-tighter uppercase mb-1">Arecofix <span class="text-primary">Tracking</span></h1>\r
            <p class="text-xs text-neutral-400 font-medium uppercase tracking-widest">Estado T\xE9cnico en Tiempo Real</p>\r
        </div>\r
\r
        <div class="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">\r
            @if (loading()) {\r
            <div class="p-12 flex flex-col items-center">\r
                <span class="loading loading-ring loading-lg text-primary"></span>\r
                <p class="mt-4 text-xs font-bold text-neutral-400 uppercase animate-pulse">Consultando Sat\xE9lite...</p>\r
            </div>\r
            } @else if (error()) {\r
            <div class="p-12 text-center">\r
                <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-500 rounded-full mb-6">\r
                    <i class="fas fa-exclamation-triangle text-2xl"></i>\r
                </div>\r
                <h2 class="text-xl font-black text-neutral-800 mb-2">{{ error() }}</h2>\r
                <p class="text-sm text-neutral-400 mb-8 font-medium">Verific\xE1 tu c\xF3digo o contactanos por WhatsApp.</p>\r
                <div class="flex flex-col gap-3">\r
                    <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="btn btn-success text-white rounded-2xl">\r
                        <i class="fab fa-whatsapp text-lg"></i> Soporte Directo\r
                    </a>\r
                    <a routerLink="/" class="btn btn-ghost btn-sm text-neutral-400">Volver al inicio</a>\r
                </div>\r
            </div>\r
            } @else if (repair(); as r) {\r
            <!-- Status Card -->\r
            <div class="p-6 transition-all duration-500" [ngClass]="getStatusColor(r.current_status_id)">\r
                <div class="flex justify-between items-start mb-4">\r
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Estado de Reparaci\xF3n</span>\r
                    <span class="text-[10px] font-mono font-bold opacity-60">#{{ r.tracking_code }}</span>\r
                </div>\r
                <h2 class="text-3xl font-black leading-tight mb-2 tracking-tight">\r
                    {{ getStatusLabel(r.current_status_id) }}\r
                </h2>\r
                <p class="text-sm font-medium opacity-80 leading-relaxed">\r
                    Tu {{ r.device_model }} est\xE1 siendo gestionado con la m\xE1xima prioridad t\xE9cnica.\r
                </p>\r
            </div>\r
\r
            <div class="p-6 space-y-8">\r
                <!-- Progress Line -->\r
                <div class="relative pt-4">\r
                    <div class="flex justify-between mb-4">\r
                        @for (step of [1,2,3,4,5]; track step) {\r
                            <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500"\r
                                [ngClass]="r.current_status_id >= step ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white border-neutral-100 text-neutral-300'">\r
                                {{ step }}\r
                            </div>\r
                        }\r
                    </div>\r
                    <div class="absolute top-[36px] left-0 right-0 h-0.5 bg-neutral-100 -z-10">\r
                        <div class="h-full bg-primary transition-all duration-1000" [style.width.%]="(r.current_status_id - 1) * 25"></div>\r
                    </div>\r
                </div>\r
\r
                <!-- Info Grid -->\r
                <div class="grid grid-cols-1 gap-6">\r
                    <div class="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">\r
                        <div class="flex items-center gap-4 mb-4">\r
                            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">\r
                                <i class="fas fa-microchip"></i>\r
                            </div>\r
                            <div>\r
                                <h4 class="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Equipo en Taller</h4>\r
                                <p class="text-sm font-bold text-neutral-800">{{ r.device_model }}</p>\r
                            </div>\r
                        </div>\r
                        <div class="space-y-3">\r
                            <div class="flex justify-between text-xs">\r
                                <span class="text-neutral-400 font-medium">Fecha de Ingreso</span>\r
                                <span class="text-neutral-800 font-bold uppercase">{{ (r.received_at || r.created_at) | date:'dd MMM yyyy' }}</span>\r
                            </div>\r
                            <div class="flex justify-between text-xs">\r
                                <span class="text-neutral-400 font-medium">Motivo</span>\r
                                <span class="text-neutral-600 font-medium wrap-break-word text-right max-w-[180px]">"{{ r.issue_description }}"</span>\r
                            </div>\r
                        </div>\r
                    </div>\r
\r
                    @if (r.technician_notes || r.technical_report) {\r
                    <div class="bg-primary/5 rounded-2xl p-5 border border-primary/10">\r
                        <h4 class="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">\r
                             <span class="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>\r
                             Reporte T\xE9cnico\r
                        </h4>\r
                        <p class="text-xs font-medium text-neutral-700 leading-relaxed italic">\r
                            "{{ r.technical_report || r.technician_notes }}"\r
                        </p>\r
                    </div>\r
                    }\r
\r
                    <div class="bg-neutral-800 rounded-3xl p-6 text-white shadow-xl shadow-neutral-900/20">\r
                        <div class="flex justify-between items-end mb-6">\r
                            <div>\r
                                <h4 class="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Presupuesto Final</h4>\r
                                <p class="text-3xl font-black tracking-tighter">\${{ (r.final_cost || r.estimated_cost || 0) - (r.deposit_amount || 0) }}</p>\r
                            </div>\r
                            <div class="text-right">\r
                                @if (r.deposit_amount && r.deposit_amount > 0) {\r
                                    <span class="badge badge-success text-[8px] font-black text-white p-2">SE\xD1A ENTREGADA: \${{ r.deposit_amount }}</span>\r
                                }\r
                            </div>\r
                        </div>\r
                        <div class="flex gap-2">\r
                            <button (click)="printTicket()" class="btn btn-sm grow rounded-xl bg-white/10 border-none text-white hover:bg-white/20 text-[10px] font-black uppercase">\r
                                <i class="fas fa-print"></i> Tal\xF3n\r
                            </button>\r
                            <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="btn btn-sm grow rounded-xl bg-green-500 border-none text-white hover:bg-green-600 text-[10px] font-black uppercase">\r
                                <i class="fab fa-whatsapp"></i> Chat\r
                            </a>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
            }\r
        </div>\r
        \r
        <div class="mt-10 text-center">\r
            <p class="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.3em]">ArecoFix &copy; 2024</p>\r
        </div>\r
    </div>\r
</div>\r
\r
<!-- Print Only Ticket -->\r
@if (repair(); as r) {\r
<div class="print-only p-8 font-mono text-xs w-[80mm] mx-auto">\r
    <div class="text-center mb-6 border-b border-black pb-4">\r
        <h1 class="text-xl font-black uppercase">ARECOFIX</h1>\r
        <p class="text-[8px] uppercase tracking-tighter">Gesti\xF3n T\xE9cnica Profesional</p>\r
        <p class="mt-2">OT #: {{ r.repair_number || '---' }}</p>\r
    </div>\r
\r
    <div class="space-y-3 mb-6">\r
        <div class="flex justify-between">\r
            <span>TRACKING:</span>\r
            <span class="font-bold">{{ r.tracking_code }}</span>\r
        </div>\r
        <div class="flex justify-between">\r
            <span>FECHA:</span>\r
            <span>{{ (r.received_at || r.created_at) | date:'dd/MM/yy HH:mm' }}</span>\r
        </div>\r
        <div class="flex justify-between border-t border-black pt-2">\r
            <span>CLIENTE:</span>\r
            <span class="font-bold text-right truncate max-w-[120px]">{{ r.customer_name }}</span>\r
        </div>\r
        <div class="flex justify-between">\r
            <span>EQUIPO:</span>\r
            <span class="font-bold text-right truncate max-w-[120px]">{{ r.device_model }}</span>\r
        </div>\r
    </div>\r
\r
    <div class="border-y border-black py-3 text-center mb-6">\r
        <p class="font-bold uppercase mb-1">Saldo a Pagar</p>\r
        <p class="text-2xl font-black">\${{ (r.final_cost || r.estimated_cost || 0) - (r.deposit_amount || 0) }}</p>\r
    </div>\r
\r
    <div class="text-[8px] leading-tight space-y-2 mb-8">\r
        <p>* Presentar este tal\xF3n para el retiro.</p>\r
        <p>* No se entregan equipos sin comprobante.</p>\r
        <p>* Garant\xEDa: 30 d\xEDas sobre el trabajo realizado.</p>\r
    </div>\r
\r
    <div class="text-center">\r
        <div class="w-32 h-px bg-black mx-auto mb-1"></div>\r
        <p class="text-[8px]">FIRMA T\xC9CNICA</p>\r
    </div>\r
</div>\r
}\r
`, styles: ["/* angular:styles/component:css;621a7f868bc2805182d9f41abb156d4238d609fbecd57ae353f8ce8c3efa2df6;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/Arecofixpage/src/app/public/tracking/tracking-page.ts */\n@media print {\n  .no-print {\n    display: none !important;\n  }\n  .print-only {\n    display: block !important;\n  }\n  body {\n    background: white;\n  }\n  .ticket-container {\n    border: 1px dashed #000;\n    padding: 20px;\n    width: 100%;\n    margin: 0;\n  }\n}\n.print-only {\n  display: none;\n}\n/*# sourceMappingURL=tracking-page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TrackingPage, { className: "TrackingPage", filePath: "src/app/public/tracking/tracking-page.ts", lineNumber: 39 });
})();
export {
  TrackingPage
};
//# sourceMappingURL=chunk-HVIWWCIF.mjs.map
