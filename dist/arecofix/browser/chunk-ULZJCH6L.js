import {
  AuthService
} from "./chunk-NJJ5IL4Q.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  CommonModule,
  RouterLink
} from "./chunk-WHLM5VZW.js";
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XQFVERLD.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/clients/admin-clients-page.ts
var _c0 = (a0) => ["/admin/clients", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminClientsPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminClientsPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay clientes registrados.");
    \u0275\u0275elementEnd()();
  }
}
function AdminClientsPage_Conditional_24_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 9);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 10);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 11);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td")(9, "div");
    \u0275\u0275element(10, "i", 12);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "div", 13);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "span", 14);
    \u0275\u0275text(17, "Activo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "a", 15);
    \u0275\u0275element(20, "i", 16);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const client_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", client_r1.first_name, " ", client_r1.last_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(client_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("DNI: ", client_r1.dni || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", client_r1.phone || "N/A");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(client_r1.address || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(7, _c0, client_r1.id));
  }
}
function AdminClientsPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminClientsPage_Conditional_24_For_1_Template, 21, 9, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.clients());
  }
}
var AdminClientsPage = class _AdminClientsPage {
  auth = inject(AuthService);
  clients = signal([], ...ngDevMode ? [{ debugName: "clients" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadClients();
  }
  async loadClients() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("role", "user").order("created_at", { ascending: false });
    if (data) {
      this.clients.set(data);
    }
    this.loading.set(false);
  }
  static \u0275fac = function AdminClientsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminClientsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminClientsPage, selectors: [["app-admin-clients-page"]], decls: 25, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/clients/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "5", 1, "text-center", "py-4"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "text-xs", "text-gray-400"], [1, "fas", "fa-phone", "text-xs", "mr-1"], [1, "text-sm"], [1, "badge", "badge-ghost"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit"]], template: function AdminClientsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Clientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nuevo Cliente ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Contacto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Ubicaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "th");
      \u0275\u0275text(20, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "tbody");
      \u0275\u0275conditionalCreate(22, AdminClientsPage_Conditional_22_Template, 3, 0, "tr")(23, AdminClientsPage_Conditional_23_Template, 3, 0, "tr")(24, AdminClientsPage_Conditional_24_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(22);
      \u0275\u0275conditional(ctx.loading() ? 22 : ctx.clients().length === 0 ? 23 : 24);
    }
  }, dependencies: [CommonModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminClientsPage, [{
    type: Component,
    args: [{ selector: "app-admin-clients-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Clientes</h1>\r
    <a routerLink="/admin/clients/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nuevo Cliente\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Nombre</th>\r
                    <th>Contacto</th>\r
                    <th>Ubicaci\xF3n</th>\r
                    <th>Estado</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (clients().length === 0) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">No hay clientes registrados.</td>\r
                </tr>\r
                } @else {\r
                @for (client of clients(); track client.id) {\r
                <tr>\r
                    <td>\r
                        <div class="font-bold">{{ client.first_name }} {{ client.last_name }}</div>\r
                        <div class="text-sm opacity-50">{{ client.email }}</div>\r
                        <div class="text-xs text-gray-400">DNI: {{ client.dni || 'N/A' }}</div>\r
                    </td>\r
                    <td>\r
                        <div><i class="fas fa-phone text-xs mr-1"></i> {{ client.phone || 'N/A' }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="text-sm">{{ client.address || 'N/A' }}</div>\r
                    </td>\r
                    <td>\r
                        <span class="badge badge-ghost">Activo</span>\r
                    </td>\r
                    <td>\r
                        <a [routerLink]="['/admin/clients', client.id]" class="btn btn-sm btn-ghost">\r
                            <i class="fas fa-edit"></i>\r
                        </a>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminClientsPage, { className: "AdminClientsPage", filePath: "src/app/admin/clients/admin-clients-page.ts", lineNumber: 13 });
})();
export {
  AdminClientsPage
};
//# sourceMappingURL=chunk-ULZJCH6L.js.map
