import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  LoggerService
} from "./chunk-VKFH2DYL.js";
import {
  environment
} from "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  DatePipe,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  Component,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
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
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

// src/app/public/tracking/services/tracking.service.ts
var TrackingService = class _TrackingService {
  auth = inject(AuthService);
  async getRepairByCode(code) {
    const supabase = this.auth.getSupabaseClient();
    return await supabase.rpc("get_repair_by_tracking", { code });
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
function TrackingPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "span", 7);
    \u0275\u0275elementStart(2, "p", 8);
    \u0275\u0275text(3, "Buscando reparaci\xF3n...");
    \u0275\u0275elementEnd()();
  }
}
function TrackingPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "i", 10);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 11)(5, "a", 12);
    \u0275\u0275text(6, "Volver al Inicio");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function TrackingPage_Conditional_10_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 16);
    \u0275\u0275text(2, "Fecha Completado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 18);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 1, r_r2.completed_at, "dd/MM/yyyy"));
  }
}
function TrackingPage_Conditional_10_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "span", 20);
    \u0275\u0275text(2, "Diagn\xF3stico / Soluci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", r_r2.technician_notes, " ");
  }
}
function TrackingPage_Conditional_10_Conditional_37_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36)(1, "img", 37);
    \u0275\u0275listener("click", function TrackingPage_Conditional_10_Conditional_37_For_5_Template_img_click_1_listener() {
      const img_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openImage(img_r4));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const img_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", img_r4, \u0275\u0275sanitizeUrl);
  }
}
function TrackingPage_Conditional_10_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "span", 34);
    \u0275\u0275text(2, "Im\xE1genes del Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 35);
    \u0275\u0275repeaterCreate(4, TrackingPage_Conditional_10_Conditional_37_For_5_Template, 2, 1, "div", 36, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(r_r2.images);
  }
}
function TrackingPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "div", 14)(4, "div", 15)(5, "span", 16);
    \u0275\u0275text(6, "C\xF3digo de Seguimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 15)(10, "span", 16);
    \u0275\u0275text(11, "Dispositivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 18);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 15)(15, "span", 16);
    \u0275\u0275text(16, "IMEI / Serie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 18);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 15)(20, "span", 16);
    \u0275\u0275text(21, "Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 18);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 15)(25, "span", 16);
    \u0275\u0275text(26, "Fecha Ingreso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 18);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(30, TrackingPage_Conditional_10_Conditional_30_Template, 6, 4, "div", 15);
    \u0275\u0275elementStart(31, "div", 19)(32, "span", 20);
    \u0275\u0275text(33, "Problema Reportado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p", 21);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, TrackingPage_Conditional_10_Conditional_36_Template, 5, 1, "div", 19);
    \u0275\u0275conditionalCreate(37, TrackingPage_Conditional_10_Conditional_37_Template, 6, 0, "div", 19);
    \u0275\u0275elementStart(38, "div", 22)(39, "div", 23)(40, "span", 24);
    \u0275\u0275text(41, "Presupuesto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span", 18);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 25)(45, "span", 26);
    \u0275\u0275text(46, "Se\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 27);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(49, "div", 28);
    \u0275\u0275elementStart(50, "div", 29)(51, "span", 18);
    \u0275\u0275text(52, "Total a Pagar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 17);
    \u0275\u0275text(54);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(55, "div", 30)(56, "a", 31);
    \u0275\u0275element(57, "i", 32);
    \u0275\u0275text(58, " Consultar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r2 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("badge ", ctx_r0.getStatusColor(r_r2.status), " badge-lg p-4 font-bold uppercase"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStatusLabel(r_r2.status), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r2.tracking_code);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r2.device_model);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r2.imei || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r2.customer_name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(29, 17, r_r2.received_at || r_r2.created_at, "dd/MM/yyyy"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r2.completed_at ? 30 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r2.issue_description);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.technician_notes && (r_r2.status === "completed" || r_r2.status === "delivered") ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.images && r_r2.images.length > 0 ? 37 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("$", r_r2.estimated_cost);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("-$", r_r2.deposit_amount);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("$", (r_r2.final_cost || r_r2.estimated_cost || 0) - (r_r2.deposit_amount || 0));
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r0.whatsappNumber, \u0275\u0275sanitizeUrl);
  }
}
var TrackingPage = class _TrackingPage {
  route = inject(ActivatedRoute);
  trackingService = inject(TrackingService);
  logger = inject(LoggerService);
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
        this.repair.set(data[0]);
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
  getStatusLabel(status) {
    const statusMap = {
      "pending": "Pendiente",
      "in_progress": "En Progreso",
      "completed": "Completado",
      "delivered": "Entregado",
      "cancelled": "Cancelado"
    };
    return statusMap[status] || status;
  }
  getStatusColor(status) {
    const colorMap = {
      "pending": "badge-warning",
      "in_progress": "badge-info",
      "completed": "badge-success",
      "delivered": "badge-success",
      "cancelled": "badge-error"
    };
    return colorMap[status] || "badge-ghost";
  }
  openImage(url) {
    window.open(url, "_blank");
  }
  static \u0275fac = function TrackingPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrackingPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TrackingPage, selectors: [["app-tracking-page"]], decls: 11, vars: 1, consts: [[1, "py-10", "px-4"], [1, "max-w-md", "mx-auto", "bg-base-100", "rounded-xl", "shadow-xl", "overflow-hidden", "text-base-content"], [1, "bg-primary", "p-6", "text-center"], [1, "text-2xl", "font-bold", "text-white", "mb-2"], [1, "text-primary-content", "opacity-80", "text-sm"], [1, "p-6"], [1, "flex", "flex-col", "items-center", "justify-center", "py-8"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "mt-4", "text-base-content/70"], [1, "alert", "alert-error"], [1, "fas", "fa-exclamation-circle"], [1, "mt-6", "text-center"], ["routerLink", "/", 1, "btn", "btn-outline", "btn-sm"], [1, "flex", "justify-center", "mb-6"], [1, "space-y-4"], [1, "flex", "justify-between", "border-b", "border-base-200", "pb-2"], [1, "font-semibold", "text-base-content/70"], [1, "font-bold", "text-primary"], [1, "font-bold", "text-base-content"], [1, "py-2"], [1, "block", "font-semibold", "text-base-content/70", "mb-1"], [1, "text-sm", "bg-base-200", "p-3", "rounded-lg", "text-base-content"], [1, "bg-base-200", "p-4", "rounded-lg", "mt-4"], [1, "flex", "justify-between", "mb-1"], [1, "text-sm", "text-base-content/70"], [1, "flex", "justify-between", "mb-1", "text-green-600", "dark:text-green-400"], [1, "text-sm"], [1, "font-bold"], [1, "divider", "my-1"], [1, "flex", "justify-between", "text-lg"], [1, "mt-8", "text-center"], ["target", "_blank", 1, "btn", "btn-success", "btn-wide", "text-white", 3, "href"], [1, "fab", "fa-whatsapp", "mr-2"], [1, "text-sm", "bg-green-50", "p-3", "rounded-lg", "border", "border-green-100", "text-green-800"], [1, "block", "font-semibold", "text-base-content/70", "mb-2"], [1, "grid", "grid-cols-2", "gap-2"], [1, "aspect-square", "bg-base-200", "rounded-lg", "overflow-hidden", "border", "border-base-300"], ["alt", "Estado del equipo", 1, "w-full", "h-full", "object-cover", "cursor-pointer", "hover:opacity-90", "transition-opacity", 3, "click", "src"]], template: function TrackingPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "Estado de Reparaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Seguimiento en tiempo real");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275conditionalCreate(8, TrackingPage_Conditional_8_Template, 4, 0, "div", 6)(9, TrackingPage_Conditional_9_Template, 7, 1)(10, TrackingPage_Conditional_10_Template, 59, 20);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.loading() ? 8 : ctx.error() ? 9 : (tmp_0_0 = ctx.repair()) ? 10 : -1, tmp_0_0);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrackingPage, [{
    type: Component,
    args: [{ selector: "app-tracking-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="py-10 px-4">\r
    <div class="max-w-md mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden text-base-content">\r
        <!-- Header -->\r
        <div class="bg-primary p-6 text-center">\r
            <h1 class="text-2xl font-bold text-white mb-2">Estado de Reparaci\xF3n</h1>\r
            <p class="text-primary-content opacity-80 text-sm">Seguimiento en tiempo real</p>\r
        </div>\r
\r
        <div class="p-6">\r
            @if (loading()) {\r
            <div class="flex flex-col items-center justify-center py-8">\r
                <span class="loading loading-spinner loading-lg text-primary"></span>\r
                <p class="mt-4 text-base-content/70">Buscando reparaci\xF3n...</p>\r
            </div>\r
            } @else if (error()) {\r
            <div class="alert alert-error">\r
                <i class="fas fa-exclamation-circle"></i>\r
                <span>{{ error() }}</span>\r
            </div>\r
            <div class="mt-6 text-center">\r
                <a routerLink="/" class="btn btn-outline btn-sm">Volver al Inicio</a>\r
            </div>\r
            } @else if (repair(); as r) {\r
            <!-- Status Badge -->\r
            <div class="flex justify-center mb-6">\r
                <div class="badge {{ getStatusColor(r.status) }} badge-lg p-4 font-bold uppercase">\r
                    {{ getStatusLabel(r.status) }}\r
                </div>\r
            </div>\r
\r
            <!-- Device Info -->\r
            <div class="space-y-4">\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">C\xF3digo de Seguimiento</span>\r
                    <span class="font-bold text-primary">{{ r.tracking_code }}</span>\r
                </div>\r
\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">Dispositivo</span>\r
                    <span class="font-bold text-base-content">{{ r.device_model }}</span>\r
                </div>\r
\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">IMEI / Serie</span>\r
                    <span class="font-bold text-base-content">{{ r.imei || 'N/A' }}</span>\r
                </div>\r
\r
\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">Cliente</span>\r
                    <span class="font-bold text-base-content">{{ r.customer_name }}</span>\r
                </div>\r
\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">Fecha Ingreso</span>\r
                    <span class="font-bold text-base-content">{{ (r.received_at || r.created_at) |\r
                        date:'dd/MM/yyyy'\r
                        }}</span>\r
                </div>\r
\r
                @if (r.completed_at) {\r
                <div class="flex justify-between border-b border-base-200 pb-2">\r
                    <span class="font-semibold text-base-content/70">Fecha Completado</span>\r
                    <span class="font-bold text-base-content">{{ r.completed_at | date:'dd/MM/yyyy' }}</span>\r
                </div>\r
                }\r
\r
                <div class="py-2">\r
                    <span class="block font-semibold text-base-content/70 mb-1">Problema Reportado</span>\r
                    <p class="text-sm bg-base-200 p-3 rounded-lg text-base-content">{{ r.issue_description }}</p>\r
                </div>\r
\r
                @if (r.technician_notes && (r.status === 'completed' || r.status === 'delivered'))\r
                {\r
                <div class="py-2">\r
                    <span class="block font-semibold text-base-content/70 mb-1">Diagn\xF3stico / Soluci\xF3n</span>\r
                    <p class="text-sm bg-green-50 p-3 rounded-lg border border-green-100 text-green-800">\r
                        {{ r.technician_notes }}\r
                    </p>\r
                </div>\r
                }\r
\r
                @if (r.images && r.images.length > 0) {\r
                <div class="py-2">\r
                    <span class="block font-semibold text-base-content/70 mb-2">Im\xE1genes del Estado</span>\r
                    <div class="grid grid-cols-2 gap-2">\r
                        @for (img of r.images; track img) {\r
                        <div class="aspect-square bg-base-200 rounded-lg overflow-hidden border border-base-300">\r
                            <img [src]="img"\r
                                class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"\r
                                alt="Estado del equipo" (click)="openImage(img)">\r
                        </div>\r
                        }\r
                    </div>\r
                </div>\r
                }\r
\r
                <!-- Costs -->\r
                <div class="bg-base-200 p-4 rounded-lg mt-4">\r
                    <div class="flex justify-between mb-1">\r
                        <span class="text-sm text-base-content/70">Presupuesto</span>\r
                        <span class="font-bold text-base-content">\${{ r.estimated_cost }}</span>\r
                    </div>\r
                    <div class="flex justify-between mb-1 text-green-600 dark:text-green-400">\r
                        <span class="text-sm">Se\xF1a</span>\r
                        <span class="font-bold">-\${{ r.deposit_amount }}</span>\r
                    </div>\r
                    <div class="divider my-1"></div>\r
                    <div class="flex justify-between text-lg">\r
                        <span class="font-bold text-base-content">Total a Pagar</span>\r
                        <span class="font-bold text-primary">\${{ (r.final_cost || r.estimated_cost || 0) -\r
                            (r.deposit_amount || 0) }}</span>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="mt-8 text-center">\r
                <a [href]="'https://wa.me/' + whatsappNumber" target="_blank"\r
                    class="btn btn-success btn-wide text-white">\r
                    <i class="fab fa-whatsapp mr-2"></i> Consultar\r
                </a>\r
            </div>\r
            }\r
        </div>\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TrackingPage, { className: "TrackingPage", filePath: "src/app/public/tracking/tracking-page.ts", lineNumber: 15 });
})();
export {
  TrackingPage
};
//# sourceMappingURL=chunk-MEBNUY4N.js.map
