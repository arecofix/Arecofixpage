import './polyfills.server.mjs';
import {
  AdminRepairService
} from "./chunk-OZKI3SM7.mjs";
import {
  RepairStatus
} from "./chunk-65P2T3U5.mjs";
import "./chunk-6TWNUMFJ.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-EBVHUSN7.mjs";
import "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass
} from "./chunk-NQCCIK3J.mjs";
import {
  Component,
  computed,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/features/repairs/domain/utils/repair-status.utils.ts
var RepairStatusUtils = class {
  static getStatusUI(statusId) {
    const statuses = {
      [RepairStatus.PENDING_DIAGNOSIS]: {
        label: "PENDIENTE DE DIAGN\xD3STICO",
        class: "bg-amber-100 text-amber-800 border-amber-200",
        description: "El equipo ha sido recibido y espera ser revisado por un t\xE9cnico."
      },
      [RepairStatus.SUPPLY_MANAGEMENT]: {
        label: "GESTI\xD3N DE REPUESTOS",
        class: "bg-cyan-100 text-cyan-800 border-cyan-200",
        description: "Estamos localizando o esperando los repuestos necesarios."
      },
      [RepairStatus.IN_PROGRESS]: {
        label: "EN REPARACI\xD3N",
        class: "bg-blue-100 text-blue-800 border-blue-200",
        description: "Un t\xE9cnico est\xE1 trabajando actualmente en su equipo."
      },
      [RepairStatus.QUALITY_CONTROL]: {
        label: "CONTROL DE CALIDAD",
        class: "bg-indigo-100 text-indigo-800 border-indigo-200",
        description: "La reparaci\xF3n ha finalizado y estamos testeando todas las funciones."
      },
      [RepairStatus.READY_FOR_PICKUP]: {
        label: "LISTO PARA RETIRAR",
        class: "bg-green-100 text-green-800 border-green-200",
        description: "\xA1Buenas noticias! Puede pasar a retirar su equipo."
      },
      [RepairStatus.DELIVERED]: {
        label: "ENTREGADO",
        class: "bg-slate-100 text-slate-800 border-slate-200",
        description: "El equipo ha sido entregado al cliente conforme."
      },
      [RepairStatus.CANCELLED]: {
        label: "CANCELADO",
        class: "bg-rose-100 text-rose-800 border-rose-200",
        description: "La reparaci\xF3n ha sido cancelada o fue rechazada."
      }
    };
    return statuses[statusId] || {
      label: "DESCONOCIDO",
      class: "bg-slate-100 text-slate-700",
      description: "Estado no identificado."
    };
  }
  static getAdminBadgeClass(statusId) {
    switch (statusId) {
      case RepairStatus.PENDING_DIAGNOSIS:
        return "badge-warning";
      case RepairStatus.SUPPLY_MANAGEMENT:
        return "badge-info";
      case RepairStatus.IN_PROGRESS:
        return "badge-primary";
      case RepairStatus.QUALITY_CONTROL:
        return "badge-accent";
      case RepairStatus.READY_FOR_PICKUP:
        return "badge-success";
      case RepairStatus.DELIVERED:
        return "badge-ghost opacity-70";
      case RepairStatus.CANCELLED:
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }
};

// src/app/admin/repairs/admin-repairs-page.ts
var _c0 = (a0) => ["/admin/repairs", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminRepairsPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "i", 24);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 25);
    \u0275\u0275listener("click", function AdminRepairsPage_Conditional_24_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadRepairs());
    });
    \u0275\u0275text(5, "Reintentar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function AdminRepairsPage_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 26);
    \u0275\u0275element(2, "span", 27);
    \u0275\u0275elementStart(3, "p", 28);
    \u0275\u0275text(4, "Cargando taller...");
    \u0275\u0275elementEnd()()();
  }
}
function AdminRepairsPage_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 29)(2, "div", 30);
    \u0275\u0275element(3, "i", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 32);
    \u0275\u0275text(5, "No hay reparaciones que coincidan con la b\xFAsqueda.");
    \u0275\u0275elementEnd()()();
  }
}
function AdminRepairsPage_Conditional_45_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 33)(1, "td", 34)(2, "div", 35);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "div", 37);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 38);
    \u0275\u0275element(11, "i", 39);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 40);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "div", 41);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "div", 42);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "td", 43);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 22)(25, "div", 44)(26, "a", 45);
    \u0275\u0275element(27, "i", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 47);
    \u0275\u0275listener("click", function AdminRepairsPage_Conditional_45_For_1_Template_button_click_28_listener() {
      const repair_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteRepair(repair_r4.id));
    });
    \u0275\u0275element(29, "i", 48);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const repair_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 11, repair_r4.received_at || repair_r4.created_at, "dd/MM/yyyy"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getWarrantyStatus(repair_r4.received_at || repair_r4.created_at).class);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getWarrantyStatus(repair_r4.received_at || repair_r4.created_at).label, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repair_r4.customer_name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", repair_r4.customer_phone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repair_r4.tracking_code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(repair_r4.device_model);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getStatusBadgeClass(repair_r4.current_status_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getStatusLabel(repair_r4.current_status_id), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(23, 14, repair_r4.estimated_cost, "ARS", "symbol-narrow", "1.0-0"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(19, _c0, repair_r4.id));
  }
}
function AdminRepairsPage_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminRepairsPage_Conditional_45_For_1_Template, 30, 21, "tr", 33, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.filteredRepairs());
  }
}
var AdminRepairsPage = class _AdminRepairsPage {
  repairService = inject(AdminRepairService);
  repairs = signal([], ...ngDevMode ? [{ debugName: "repairs" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  // Search and Filter signals
  searchTerm = signal("", ...ngDevMode ? [{ debugName: "searchTerm" }] : []);
  filterType = signal("all", ...ngDevMode ? [{ debugName: "filterType" }] : []);
  // Computed signal for filtered list
  filteredRepairs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    return this.repairs().filter((repair) => {
      const matchesSearch = repair.customer_name?.toLowerCase().includes(term) || repair.customer_phone?.toLowerCase().includes(term) || repair.device_model?.toLowerCase().includes(term) || repair.tracking_code?.toLowerCase().includes(term);
      const matchesType = type === "all" || repair.device_model?.toLowerCase().includes(type.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, ...ngDevMode ? [{ debugName: "filteredRepairs" }] : []);
  date = /* @__PURE__ */ new Date();
  async ngOnInit() {
    await this.loadRepairs();
  }
  async loadRepairs() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repairService.getAdminList();
      this.repairs.set(data);
    } catch (e) {
      this.error.set("Error al cargar las reparaciones: " + e.message);
    } finally {
      this.loading.set(false);
    }
  }
  async deleteRepair(id) {
    if (!confirm("\xBFEst\xE1s seguro de eliminar este registro de reparaci\xF3n?"))
      return;
    try {
      this.loading.set(true);
      await this.repairService.delete(id);
      await this.loadRepairs();
    } catch (e) {
      alert("Error al eliminar la reparaci\xF3n: " + e.message);
      this.loading.set(false);
    }
  }
  getWarrantyStatus(dateStr) {
    if (!dateStr)
      return { label: "N/A", class: "badge-ghost opacity-50" };
    const receivedDate = new Date(dateStr);
    const diffTime = Math.abs(this.date.getTime() - receivedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    if (diffDays <= 30) {
      return { label: "EN GARANT\xCDA", class: "badge-success" };
    } else {
      return { label: "VENCIDA", class: "badge-ghost opacity-50" };
    }
  }
  getStatusBadgeClass(statusId) {
    return RepairStatusUtils.getAdminBadgeClass(statusId);
  }
  getStatusLabel(statusId) {
    return RepairStatusUtils.getStatusUI(statusId).label;
  }
  static \u0275fac = function AdminRepairsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminRepairsPage, selectors: [["app-admin-repairs-page"]], decls: 46, vars: 4, consts: [[1, "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "mb-6", "gap-4"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-green-400"], [1, "flex", "gap-4", "w-full", "md:w-auto"], [1, "relative", "grow"], [1, "absolute", "inset-y-0", "left-0", "pl-3", "flex", "items-center", "text-gray-400"], [1, "fas", "fa-search"], ["type", "text", "placeholder", "Buscar cliente, tel o c\xF3digo...", 1, "input", "input-bordered", "pl-10", "w-full", "rounded-xl", 3, "ngModelChange", "ngModel"], [1, "select", "select-bordered", "text-gray-700", "rounded-xl", 3, "ngModelChange", "ngModel"], ["value", "all"], ["value", "smartphone"], ["value", "pc"], ["value", "notebook"], ["value", "console"], ["value", "tablet"], ["routerLink", "/admin/repairs/new", 1, "btn", "btn-primary", "rounded-xl"], [1, "fas", "fa-plus"], [1, "alert", "alert-error", "mb-6", "rounded-2xl", "shadow-lg", "border-none", "text-white", "font-medium"], [1, "bg-white", "rounded-2xl", "shadow-xl", "border", "border-gray-100", "overflow-hidden", "text-gray-800"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-gray-400", "bg-gray-50/50", "uppercase", "text-[10px]", "tracking-widest", "font-black"], [1, "py-5"], [1, "text-right"], [1, "divide-y", "divide-gray-50"], [1, "fas", "fa-exclamation-triangle"], [1, "btn", "btn-sm", "btn-ghost", "border-white/20", "hover:bg-white/10", "uppercase", "text-[10px]", 3, "click"], ["colspan", "6", 1, "text-center", "py-12"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "mt-2", "text-gray-500", "text-sm", "italic"], ["colspan", "6", 1, "text-center", "py-20"], [1, "text-gray-200", "mb-4"], [1, "fas", "fa-toolbox", "text-6xl"], [1, "text-gray-400", "font-medium", "italic"], [1, "hover:bg-primary/2", "transition-colors", "group"], [1, "py-4"], [1, "font-bold", "text-gray-700"], [1, "badge", "badge-xs", "text-[9px]", "font-black", "tracking-tighter", "uppercase", "p-2", "mt-1", 3, "ngClass"], [1, "font-black", "text-primary", "tracking-tight", "leading-tight"], [1, "text-[10px]", "text-gray-500", "font-medium", "mb-1"], [1, "fas", "fa-phone-alt", "mr-1", "text-gray-300"], [1, "badge", "badge-ghost", "badge-sm", "text-[9px]", "font-mono", "opacity-50", "px-1", "pt-0.5", "rounded", "uppercase"], [1, "font-bold", "text-gray-600", "text-sm"], [1, "badge", "border-none", "font-black", "text-[10px]", "py-3.5", "px-4", "tracking-tight", "uppercase", 3, "ngClass"], [1, "font-black", "text-gray-800", "tabular-nums"], [1, "flex", "gap-1", "justify-end", "opacity-0", "group-hover:opacity-100", "transition-opacity"], ["data-tip", "Editar Detalle", 1, "btn", "btn-square", "btn-sm", "btn-ghost", "hover:bg-primary/10", "hover:text-primary", "tooltip", 3, "routerLink"], [1, "fas", "fa-edit"], ["data-tip", "Borrar Registro", 1, "btn", "btn-square", "btn-sm", "btn-ghost", "hover:bg-error/10", "text-error", "tooltip", 3, "click"], [1, "fas", "fa-trash"]], template: function AdminRepairsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Taller / Reparaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "span", 4);
      \u0275\u0275element(6, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "input", 6);
      \u0275\u0275listener("ngModelChange", function AdminRepairsPage_Template_input_ngModelChange_7_listener($event) {
        return ctx.searchTerm.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "select", 7);
      \u0275\u0275listener("ngModelChange", function AdminRepairsPage_Template_select_ngModelChange_8_listener($event) {
        return ctx.filterType.set($event);
      });
      \u0275\u0275elementStart(9, "option", 8);
      \u0275\u0275text(10, "Ver Todos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "option", 9);
      \u0275\u0275text(12, "Celulares");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "option", 10);
      \u0275\u0275text(14, "PC / Desktop");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "option", 11);
      \u0275\u0275text(16, "Notebook / Netbook");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "option", 12);
      \u0275\u0275text(18, "Consolas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "option", 13);
      \u0275\u0275text(20, "Tablets");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "a", 14);
      \u0275\u0275element(22, "i", 15);
      \u0275\u0275text(23, " Nueva ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(24, AdminRepairsPage_Conditional_24_Template, 6, 1, "div", 16);
      \u0275\u0275elementStart(25, "div", 17)(26, "div", 18)(27, "table", 19)(28, "thead")(29, "tr", 20)(30, "th", 21);
      \u0275\u0275text(31, "Ingreso / Garant\xEDa");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "th");
      \u0275\u0275text(33, "Cliente / C\xF3digo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "th");
      \u0275\u0275text(35, "Dispositivo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "th");
      \u0275\u0275text(37, "Estado de Reparaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "th");
      \u0275\u0275text(39, "Costo Est.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "th", 22);
      \u0275\u0275text(41, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(42, "tbody", 23);
      \u0275\u0275conditionalCreate(43, AdminRepairsPage_Conditional_43_Template, 5, 0, "tr")(44, AdminRepairsPage_Conditional_44_Template, 6, 0, "tr")(45, AdminRepairsPage_Conditional_45_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.searchTerm());
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.filterType());
      \u0275\u0275advance(16);
      \u0275\u0275conditional(ctx.error() ? 24 : -1);
      \u0275\u0275advance(19);
      \u0275\u0275conditional(ctx.loading() ? 43 : ctx.filteredRepairs().length === 0 ? 44 : 45);
    }
  }, dependencies: [CommonModule, NgClass, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, CurrencyPipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairsPage, [{
    type: Component,
    args: [{ selector: "app-admin-repairs-page", standalone: true, imports: [CommonModule, RouterLink, FormsModule], template: `<div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">\r
    <h1 class="text-2xl font-bold text-gray-800 dark:text-green-400">Taller / Reparaciones</h1>\r
    <div class="flex gap-4 w-full md:w-auto">\r
        <div class="relative grow">\r
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">\r
                <i class="fas fa-search"></i>\r
            </span>\r
            <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" \r
                placeholder="Buscar cliente, tel o c\xF3digo..." \r
                class="input input-bordered pl-10 w-full rounded-xl" />\r
        </div>\r
        <select [ngModel]="filterType()" (ngModelChange)="filterType.set($event)" class="select select-bordered text-gray-700 rounded-xl">\r
            <option value="all">Ver Todos</option>\r
            <option value="smartphone">Celulares</option>\r
            <option value="pc">PC / Desktop</option>\r
            <option value="notebook">Notebook / Netbook</option>\r
            <option value="console">Consolas</option>\r
            <option value="tablet">Tablets</option>\r
        </select>\r
        <a routerLink="/admin/repairs/new" class="btn btn-primary rounded-xl">\r
            <i class="fas fa-plus"></i> Nueva\r
        </a>\r
    </div>\r
</div>\r
\r
@if (error()) {\r
    <div class="alert alert-error mb-6 rounded-2xl shadow-lg border-none text-white font-medium">\r
        <i class="fas fa-exclamation-triangle"></i>\r
        <span>{{ error() }}</span>\r
        <button (click)="loadRepairs()" class="btn btn-sm btn-ghost border-white/20 hover:bg-white/10 uppercase text-[10px]">Reintentar</button>\r
    </div>\r
}\r
\r
<div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-gray-400 bg-gray-50/50 uppercase text-[10px] tracking-widest font-black">\r
                    <th class="py-5">Ingreso / Garant\xEDa</th>\r
                    <th>Cliente / C\xF3digo</th>\r
                    <th>Dispositivo</th>\r
                    <th>Estado de Reparaci\xF3n</th>\r
                    <th>Costo Est.</th>\r
                    <th class="text-right">Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody class="divide-y divide-gray-50">\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-12">\r
                        <span class="loading loading-spinner loading-lg text-primary"></span>\r
                        <p class="mt-2 text-gray-500 text-sm italic">Cargando taller...</p>\r
                    </td>\r
                </tr>\r
                } @else if (filteredRepairs().length === 0) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-20">\r
                        <div class="text-gray-200 mb-4"><i class="fas fa-toolbox text-6xl"></i></div>\r
                        <p class="text-gray-400 font-medium italic">No hay reparaciones que coincidan con la b\xFAsqueda.</p>\r
                    </td>\r
                </tr>\r
                } @else {\r
                @for (repair of filteredRepairs(); track repair.id) {\r
                <tr class="hover:bg-primary/2 transition-colors group">\r
                    <td class="py-4">\r
                        <div class="font-bold text-gray-700">{{ (repair.received_at || repair.created_at) | date:'dd/MM/yyyy' }}</div>\r
                        <span class="badge badge-xs text-[9px] font-black tracking-tighter uppercase p-2 mt-1" \r
                               [ngClass]="getWarrantyStatus(repair.received_at || repair.created_at).class">\r
                            {{ getWarrantyStatus(repair.received_at || repair.created_at).label }}\r
                        </span>\r
                    </td>\r
                    <td>\r
                        <div class="font-black text-primary tracking-tight leading-tight">{{ repair.customer_name }}</div>\r
                        <div class="text-[10px] text-gray-500 font-medium mb-1"><i class="fas fa-phone-alt mr-1 text-gray-300"></i> {{ repair.customer_phone }}</div>\r
                        <div class="badge badge-ghost badge-sm text-[9px] font-mono opacity-50 px-1 pt-0.5 rounded uppercase">{{ repair.tracking_code }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="font-bold text-gray-600 text-sm">{{ repair.device_model }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="badge border-none font-black text-[10px] py-3.5 px-4 tracking-tight uppercase" \r
                             [ngClass]="getStatusBadgeClass(repair.current_status_id)">\r
                            {{ getStatusLabel(repair.current_status_id) }}\r
                        </div>\r
                    </td>\r
                    <td class="font-black text-gray-800 tabular-nums">\r
                        {{ repair.estimated_cost | currency:'ARS':'symbol-narrow':'1.0-0' }}\r
                    </td>\r
                    <td class="text-right">\r
                        <div class="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">\r
                            <a [routerLink]="['/admin/repairs', repair.id]" class="btn btn-square btn-sm btn-ghost hover:bg-primary/10 hover:text-primary tooltip" data-tip="Editar Detalle">\r
                                <i class="fas fa-edit"></i>\r
                            </a>\r
                            <button class="btn btn-square btn-sm btn-ghost hover:bg-error/10 text-error tooltip" data-tip="Borrar Registro" (click)="deleteRepair(repair.id)">\r
                                <i class="fas fa-trash"></i>\r
                            </button>\r
                        </div>\r
                    </td>\r
                </tr>\r
                }\r
                }\r
            </tbody>\r
        </table>\r
    </div>\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminRepairsPage, { className: "AdminRepairsPage", filePath: "src/app/admin/repairs/admin-repairs-page.ts", lineNumber: 15 });
})();
export {
  AdminRepairsPage
};
//# sourceMappingURL=chunk-ZDKPHTYN.mjs.map
