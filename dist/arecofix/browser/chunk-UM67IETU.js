import {
  AuthService
} from "./chunk-MZTEREIC.js";
import "./chunk-4WZKXYCH.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  DatePipe,
  RouterLink,
  UpperCasePipe
} from "./chunk-3EP36GV6.js";
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TQTEFGZE.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/purchases/admin-purchases-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminPurchasesPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminPurchasesPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay compras registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminPurchasesPage_Conditional_24_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 9)(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "span", 10);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "uppercase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 11);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "td");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const purchase_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 10, purchase_r1.created_at, "short"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((purchase_r1.suppliers == null ? null : purchase_r1.suppliers.name) || "Desconocido");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", purchase_r1.status === "received")("badge-warning", purchase_r1.status === "ordered")("badge-error", purchase_r1.status === "cancelled");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 13, purchase_r1.status), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("$", purchase_r1.total_amount);
  }
}
function AdminPurchasesPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminPurchasesPage_Conditional_24_For_1_Template, 13, 15, "tr", 9, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.purchases());
  }
}
var AdminPurchasesPage = class _AdminPurchasesPage {
  auth = inject(AuthService);
  purchases = signal([], ...ngDevMode ? [{ debugName: "purchases" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadPurchases();
  }
  async loadPurchases() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("purchases").select("*, suppliers(name)").order("created_at", { ascending: false });
    if (data) {
      this.purchases.set(data);
    }
    this.loading.set(false);
  }
  static \u0275fac = function AdminPurchasesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPurchasesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPurchasesPage, selectors: [["app-admin-purchases-page"]], decls: 25, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/purchases/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content", "font-bold"], ["colspan", "5", 1, "text-center", "py-4", "text-base-content/70"], [1, "hover:bg-base-200/50"], [1, "badge"], [1, "font-bold"]], template: function AdminPurchasesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Compras");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nueva Compra ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Proveedor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "th");
      \u0275\u0275text(20, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "tbody");
      \u0275\u0275conditionalCreate(22, AdminPurchasesPage_Conditional_22_Template, 3, 0, "tr")(23, AdminPurchasesPage_Conditional_23_Template, 3, 0, "tr")(24, AdminPurchasesPage_Conditional_24_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(22);
      \u0275\u0275conditional(ctx.loading() ? 22 : ctx.purchases().length === 0 ? 23 : 24);
    }
  }, dependencies: [CommonModule, RouterLink, UpperCasePipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPurchasesPage, [{
    type: Component,
    args: [{ selector: "app-admin-purchases-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Compras</h1>\r
    <a routerLink="/admin/purchases/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nueva Compra\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content font-bold">\r
                    <th>Fecha</th>\r
                    <th>Proveedor</th>\r
                    <th>Estado</th>\r
                    <th>Total</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4 text-base-content/70">Cargando...</td>\r
                </tr>\r
                } @else if (purchases().length === 0) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4 text-base-content/70">No hay compras registradas.</td>\r
                </tr>\r
                } @else {\r
                @for (purchase of purchases(); track purchase.id) {\r
                <tr class="hover:bg-base-200/50">\r
                    <td>{{ purchase.created_at | date:'short' }}</td>\r
                    <td>{{ purchase.suppliers?.name || 'Desconocido' }}</td>\r
                    <td>\r
                        <span class="badge" [class.badge-success]="purchase.status === 'received'"\r
                            [class.badge-warning]="purchase.status === 'ordered'"\r
                            [class.badge-error]="purchase.status === 'cancelled'">\r
                            {{ purchase.status | uppercase }}\r
                        </span>\r
                    </td>\r
                    <td class="font-bold">\${{ purchase.total_amount }}</td>\r
                    <td>\r
                        <!-- <a [routerLink]="['/admin/purchases', purchase.id]" class="btn btn-sm btn-ghost hover:bg-base-300">\r
                  <i class="fas fa-eye"></i>\r
                </a> -->\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPurchasesPage, { className: "AdminPurchasesPage", filePath: "src/app/admin/purchases/admin-purchases-page.ts", lineNumber: 13 });
})();
export {
  AdminPurchasesPage
};
//# sourceMappingURL=chunk-UM67IETU.js.map
