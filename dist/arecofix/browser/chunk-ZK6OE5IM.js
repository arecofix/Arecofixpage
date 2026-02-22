import {
  AuthService
} from "./chunk-MZTEREIC.js";
import "./chunk-4WZKXYCH.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass,
  RouterLink
} from "./chunk-3EP36GV6.js";
import {
  Component,
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
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TQTEFGZE.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/repairs/admin-repairs-page.ts
var _c0 = (a0) => ["/admin/repairs", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminRepairsPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminRepairsPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay reparaciones registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminRepairsPage_Conditional_26_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 7)(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td")(5, "div", 9);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 10);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td")(12, "div", 11);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td")(18, "div", 12)(19, "a", 13);
    \u0275\u0275element(20, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 15);
    \u0275\u0275listener("click", function AdminRepairsPage_Conditional_26_For_1_Template_button_click_21_listener() {
      const repair_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteRepair(repair_r2.id));
    });
    \u0275\u0275element(22, "i", 16);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const repair_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 8, repair_r2.received_at, "shortDate"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(repair_r2.customer_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repair_r2.customer_phone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(repair_r2.device_model);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.getStatusColor(repair_r2.current_status_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getStatusLabel(repair_r2.current_status_id), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 11, repair_r2.estimated_cost));
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(13, _c0, repair_r2.id));
  }
}
function AdminRepairsPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminRepairsPage_Conditional_26_For_1_Template, 23, 15, "tr", 7, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.repairs());
  }
}
var AdminRepairsPage = class _AdminRepairsPage {
  auth = inject(AuthService);
  repairs = signal([], ...ngDevMode ? [{ debugName: "repairs" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadRepairs();
  }
  async loadRepairs() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("repairs").select("*").order("received_at", { ascending: false });
    if (data) {
      this.repairs.set(data);
    }
    this.loading.set(false);
  }
  async deleteRepair(id) {
    if (!confirm("\xBFEst\xE1s seguro de eliminar este registro de reparaci\xF3n?"))
      return;
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("repairs").delete().eq("id", id);
    if (!error) {
      await this.loadRepairs();
    } else {
      alert("Error al eliminar la reparaci\xF3n");
    }
  }
  getStatusColor(statusId) {
    switch (statusId) {
      case 1:
        return "badge-warning";
      case 2:
        return "badge-info";
      case 3:
        return "badge-secondary";
      case 4:
        return "badge-success";
      case 5:
        return "badge-success";
      case 6:
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }
  getStatusLabel(statusId) {
    switch (statusId) {
      case 1:
        return "Pendiente";
      case 2:
        return "En Progreso";
      case 3:
        return "Esperando Repuestos";
      case 4:
        return "Completado";
      case 5:
        return "Entregado";
      case 6:
        return "Cancelado";
      default:
        return "Pendiente";
    }
  }
  static \u0275fac = function AdminRepairsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminRepairsPage, selectors: [["app-admin-repairs-page"]], decls: 27, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-green-400"], ["routerLink", "/admin/repairs/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-white", "rounded-lg", "shadow", "overflow-hidden", "text-gray-800"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-gray-800"], ["colspan", "6", 1, "text-center", "py-4"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-2"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit"], [1, "btn", "btn-sm", "btn-ghost", "text-error", 3, "click"], [1, "fas", "fa-trash"]], template: function AdminRepairsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Taller / Reparaciones");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nueva Reparaci\xF3n ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Cliente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Dispositivo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "th");
      \u0275\u0275text(20, "Costo Est.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "th");
      \u0275\u0275text(22, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(23, "tbody");
      \u0275\u0275conditionalCreate(24, AdminRepairsPage_Conditional_24_Template, 3, 0, "tr")(25, AdminRepairsPage_Conditional_25_Template, 3, 0, "tr")(26, AdminRepairsPage_Conditional_26_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(24);
      \u0275\u0275conditional(ctx.loading() ? 24 : ctx.repairs().length === 0 ? 25 : 26);
    }
  }, dependencies: [CommonModule, NgClass, RouterLink, CurrencyPipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairsPage, [{
    type: Component,
    args: [{ selector: "app-admin-repairs-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-gray-800 dark:text-green-400">Taller / Reparaciones</h1>\r
    <a routerLink="/admin/repairs/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nueva Reparaci\xF3n\r
    </a>\r
</div>\r
\r
<div class="bg-white rounded-lg shadow overflow-hidden text-gray-800">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-gray-800">\r
                    <th>Fecha</th>\r
                    <th>Cliente</th>\r
                    <th>Dispositivo</th>\r
                    <th>Estado</th>\r
                    <th>Costo Est.</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (repairs().length === 0) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-4">No hay reparaciones registradas.</td>\r
                </tr>\r
                } @else {\r
                @for (repair of repairs(); track repair.id) {\r
                <tr class="text-gray-800">\r
                    <td>{{ repair.received_at | date:'shortDate' }}</td>\r
                    <td>\r
                        <div class="font-bold">{{ repair.customer_name }}</div>\r
                        <div class="text-sm opacity-50">{{ repair.customer_phone }}</div>\r
                    </td>\r
                    <td>{{ repair.device_model }}</td>\r
                    <td>\r
                        <div class="badge" [ngClass]="getStatusColor(repair.current_status_id)">\r
                            {{ getStatusLabel(repair.current_status_id) }}\r
                        </div>\r
                    </td>\r
                    <td>{{ repair.estimated_cost | currency }}</td>\r
                    <td>\r
                        <div class="flex gap-2">\r
                            <a [routerLink]="['/admin/repairs', repair.id]" class="btn btn-sm btn-ghost">\r
                                <i class="fas fa-edit"></i>\r
                            </a>\r
                            <button class="btn btn-sm btn-ghost text-error" (click)="deleteRepair(repair.id)">\r
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
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminRepairsPage, { className: "AdminRepairsPage", filePath: "src/app/admin/repairs/admin-repairs-page.ts", lineNumber: 13 });
})();
export {
  AdminRepairsPage
};
//# sourceMappingURL=chunk-ZK6OE5IM.js.map
