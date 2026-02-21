import {
  AuthService
} from "./chunk-65AYZUFN.js";
import "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  CurrencyPipe,
  RouterLink
} from "./chunk-B7SLUDL7.js";
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-4O7IFJFV.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/services/admin-services-page.ts
var _c0 = (a0) => ["/admin/services", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminServicesPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminServicesPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay servicios registrados.");
    \u0275\u0275elementEnd()();
  }
}
function AdminServicesPage_Conditional_26_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 9);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "div", 11);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td")(14, "div", 12)(15, "a", 13);
    \u0275\u0275element(16, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 15);
    \u0275\u0275listener("click", function AdminServicesPage_Conditional_26_For_1_Template_button_click_17_listener() {
      const service_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteService(service_r2.id));
    });
    \u0275\u0275element(18, "i", 16);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const service_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.description || "Sin descripci\xF3n");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 10, service_r2.price));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(service_r2.duration_minutes ? service_r2.duration_minutes + " min" : "N/A");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", service_r2.is_active)("badge-error", !service_r2.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", service_r2.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(12, _c0, service_r2.id));
  }
}
function AdminServicesPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminServicesPage_Conditional_26_For_1_Template, 19, 14, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.services());
  }
}
var AdminServicesPage = class _AdminServicesPage {
  auth = inject(AuthService);
  services = signal([], ...ngDevMode ? [{ debugName: "services" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadServices();
  }
  async loadServices() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    if (data) {
      this.services.set(data);
    }
    this.loading.set(false);
  }
  async deleteService(id) {
    if (!confirm("\xBFEst\xE1s seguro de eliminar este servicio?"))
      return;
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      await this.loadServices();
    } else {
      alert("Error al eliminar el servicio");
    }
  }
  static \u0275fac = function AdminServicesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminServicesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminServicesPage, selectors: [["app-admin-services-page"]], decls: 27, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/services/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "6", 1, "text-center", "py-4"], [1, "font-bold"], [1, "max-w-xs", "truncate"], [1, "badge"], [1, "flex", "gap-2"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit"], [1, "btn", "btn-sm", "btn-ghost", "text-error", 3, "click"], [1, "fas", "fa-trash"]], template: function AdminServicesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Servicios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nuevo Servicio ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Descripci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Precio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Duraci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "th");
      \u0275\u0275text(20, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "th");
      \u0275\u0275text(22, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(23, "tbody");
      \u0275\u0275conditionalCreate(24, AdminServicesPage_Conditional_24_Template, 3, 0, "tr")(25, AdminServicesPage_Conditional_25_Template, 3, 0, "tr")(26, AdminServicesPage_Conditional_26_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(24);
      \u0275\u0275conditional(ctx.loading() ? 24 : ctx.services().length === 0 ? 25 : 26);
    }
  }, dependencies: [CommonModule, RouterLink, CurrencyPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminServicesPage, [{
    type: Component,
    args: [{ selector: "app-admin-services-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Servicios</h1>\r
    <a routerLink="/admin/services/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nuevo Servicio\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Nombre</th>\r
                    <th>Descripci\xF3n</th>\r
                    <th>Precio</th>\r
                    <th>Duraci\xF3n</th>\r
                    <th>Estado</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (services().length === 0) {\r
                <tr>\r
                    <td colspan="6" class="text-center py-4">No hay servicios registrados.</td>\r
                </tr>\r
                } @else {\r
                @for (service of services(); track service.id) {\r
                <tr>\r
                    <td class="font-bold">{{ service.name }}</td>\r
                    <td class="max-w-xs truncate">{{ service.description || 'Sin descripci\xF3n' }}</td>\r
                    <td>{{ service.price | currency }}</td>\r
                    <td>{{ service.duration_minutes ? service.duration_minutes + ' min' : 'N/A' }}</td>\r
                    <td>\r
                        <div class="badge" [class.badge-success]="service.is_active"\r
                            [class.badge-error]="!service.is_active">\r
                            {{ service.is_active ? 'Activo' : 'Inactivo' }}\r
                        </div>\r
                    </td>\r
                    <td>\r
                        <div class="flex gap-2">\r
                            <a [routerLink]="['/admin/services', service.id]" class="btn btn-sm btn-ghost">\r
                                <i class="fas fa-edit"></i>\r
                            </a>\r
                            <button class="btn btn-sm btn-ghost text-error" (click)="deleteService(service.id)">\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminServicesPage, { className: "AdminServicesPage", filePath: "src/app/admin/services/admin-services-page.ts", lineNumber: 12 });
})();
export {
  AdminServicesPage
};
//# sourceMappingURL=chunk-KQIGNC7R.js.map
