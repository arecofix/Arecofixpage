import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-ZWWV2735.mjs";
import "./chunk-7NQOFK7J.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  DatePipe,
  RouterLink
} from "./chunk-YFUS3N4N.mjs";
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
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/admin/sales/admin-invoices-page.ts
var _c0 = (a0) => ["/admin/sales/invoices", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminInvoicesPage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 6);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminInvoicesPage_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 6);
    \u0275\u0275text(2, "No hay facturas registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminInvoicesPage_Conditional_21_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 8);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "a", 9);
    \u0275\u0275element(12, "i", 10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const invoice_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 5, invoice_r1.issued_at, "short"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(invoice_r1.invoice_number || "Pendiente");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(invoice_r1.customer_name || "Consumidor Final");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", invoice_r1.total_amount);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(8, _c0, invoice_r1.id));
  }
}
function AdminInvoicesPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminInvoicesPage_Conditional_21_For_1_Template, 13, 10, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.invoices());
  }
}
var AdminInvoicesPage = class _AdminInvoicesPage {
  auth = inject(AuthService);
  invoices = signal([], ...ngDevMode ? [{ debugName: "invoices" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadInvoices();
  }
  async loadInvoices() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("invoices").select("*, sales(*)").order("issued_at", { ascending: false });
    if (data) {
      this.invoices.set(data);
    }
    this.loading.set(false);
  }
  static \u0275fac = function AdminInvoicesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminInvoicesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminInvoicesPage, selectors: [["app-admin-invoices-page"]], decls: 22, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "5", 1, "text-center", "py-4"], [1, "font-mono"], [1, "font-bold"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-eye"]], template: function AdminInvoicesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Facturaci\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "table", 4)(6, "thead")(7, "tr", 5)(8, "th");
      \u0275\u0275text(9, "Fecha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "th");
      \u0275\u0275text(11, "N\xFAmero");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "th");
      \u0275\u0275text(13, "Cliente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "th");
      \u0275\u0275text(15, "Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "th");
      \u0275\u0275text(17, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "tbody");
      \u0275\u0275conditionalCreate(19, AdminInvoicesPage_Conditional_19_Template, 3, 0, "tr")(20, AdminInvoicesPage_Conditional_20_Template, 3, 0, "tr")(21, AdminInvoicesPage_Conditional_21_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275conditional(ctx.loading() ? 19 : ctx.invoices().length === 0 ? 20 : 21);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminInvoicesPage, [{
    type: Component,
    args: [{ selector: "app-admin-invoices-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Facturaci\xF3n</h1>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Fecha</th>\r
                    <th>N\xFAmero</th>\r
                    <th>Cliente</th>\r
                    <th>Total</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (invoices().length === 0) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">No hay facturas registradas.</td>\r
                </tr>\r
                } @else {\r
                @for (invoice of invoices(); track invoice.id) {\r
                <tr>\r
                    <td>{{ invoice.issued_at | date:'short' }}</td>\r
                    <td class="font-mono">{{ invoice.invoice_number || 'Pendiente' }}</td>\r
                    <td>{{ invoice.customer_name || 'Consumidor Final' }}</td>\r
                    <td class="font-bold">\${{ invoice.total_amount }}</td>\r
                    <td>\r
                        <a [routerLink]="['/admin/sales/invoices', invoice.id]" class="btn btn-sm btn-ghost">\r
                            <i class="fas fa-eye"></i>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminInvoicesPage, { className: "AdminInvoicesPage", filePath: "src/app/admin/sales/admin-invoices-page.ts", lineNumber: 13 });
})();
export {
  AdminInvoicesPage
};
//# sourceMappingURL=chunk-JANTUZML.mjs.map
