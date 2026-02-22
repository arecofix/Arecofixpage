import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  CommonModule,
  DatePipe,
  RouterLink
} from "./chunk-JEV3MPEL.mjs";
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DXH6IVIR.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/admin/sales/admin-invoice-detail-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminInvoiceDetailPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Cargando...");
    \u0275\u0275elementEnd();
  }
}
function AdminInvoiceDetailPage_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r1.company().logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminInvoiceDetailPage_Conditional_2_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("CUIT: ", (tmp_2_0 = ctx_r1.company()) == null ? null : tmp_2_0.ruc);
  }
}
function AdminInvoiceDetailPage_Conditional_2_For_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 17)(1, "td", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 16);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((item_r3.products == null ? null : item_r3.products.name) || "Producto eliminado");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.quantity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", item_r3.unit_price);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", item_r3.subtotal);
  }
}
function AdminInvoiceDetailPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div")(3, "h1", 4);
    \u0275\u0275text(4, "Factura");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 5);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 6);
    \u0275\u0275conditionalCreate(8, AdminInvoiceDetailPage_Conditional_2_Conditional_8_Template, 1, 1, "img", 7);
    \u0275\u0275elementStart(9, "div", 8);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 9);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 9);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 9);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 9);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(19, AdminInvoiceDetailPage_Conditional_2_Conditional_19_Template, 2, 1, "p", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 10)(21, "div")(22, "h3", 11);
    \u0275\u0275text(23, "Facturar a:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p", 9);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "p", 9);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 6)(31, "h3", 11);
    \u0275\u0275text(32, "Detalles:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "p");
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p");
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "table", 12)(39, "thead")(40, "tr", 13)(41, "th", 14);
    \u0275\u0275text(42, "Descripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th", 15);
    \u0275\u0275text(44, "Cant.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "th", 16);
    \u0275\u0275text(46, "Precio Unit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "th", 16);
    \u0275\u0275text(48, "Subtotal");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "tbody");
    \u0275\u0275repeaterCreate(50, AdminInvoiceDetailPage_Conditional_2_For_51_Template, 9, 4, "tr", 17, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "tfoot")(53, "tr")(54, "td", 18);
    \u0275\u0275text(55, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "td", 19);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(58, "div", 20)(59, "a", 21);
    \u0275\u0275text(60, "Volver");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "button", 22);
    \u0275\u0275listener("click", function AdminInvoiceDetailPage_Conditional_2_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.print());
    });
    \u0275\u0275element(62, "i", 23);
    \u0275\u0275text(63, " Imprimir ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("#", ctx_r1.invoice().invoice_number || "Borrador");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_2_0 = ctx_r1.company()) == null ? null : tmp_2_0.logo_url) ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_3_0 = ctx_r1.company()) == null ? null : tmp_3_0.name) || "Arecofix");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_4_0 = ctx_r1.company()) == null ? null : tmp_4_0.location) || "Servicios Integrales");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_5_0 = ctx_r1.company()) == null ? null : tmp_5_0.address);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_6_0 = ctx_r1.company()) == null ? null : tmp_6_0.phone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_7_0 = ctx_r1.company()) == null ? null : tmp_7_0.email);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_8_0 = ctx_r1.company()) == null ? null : tmp_8_0.ruc) ? 19 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.invoice().customer_name || "Consumidor Final");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.invoice().customer_address);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.invoice().customer_dni_cuit);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Fecha: ", \u0275\u0275pipeBind2(35, 14, ctx_r1.invoice().issued_at, "shortDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Tipo: ", ctx_r1.invoice().type);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.items());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("$", ctx_r1.invoice().total_amount);
  }
}
function AdminInvoiceDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Factura no encontrada");
    \u0275\u0275elementEnd();
  }
}
var AdminInvoiceDetailPage = class _AdminInvoiceDetailPage {
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  invoice = signal(null, ...ngDevMode ? [{ debugName: "invoice" }] : []);
  items = signal([], ...ngDevMode ? [{ debugName: "items" }] : []);
  company = signal(null, ...ngDevMode ? [{ debugName: "company" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal("", ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    const supabase = this.auth.getSupabaseClient();
    try {
      const { data: companyData } = await supabase.from("company_settings").select("*").maybeSingle();
      if (companyData) {
        this.company.set(companyData);
      }
      if (id) {
        const { data: invoice, error: invoiceError } = await supabase.from("invoices").select("*, sales(*)").eq("id", id).single();
        if (invoiceError)
          throw invoiceError;
        if (invoice) {
          this.invoice.set(invoice);
          if (invoice.sales?.id) {
            const { data: items, error: itemsError } = await supabase.from("sale_items").select("*, products(name)").eq("sale_id", invoice.sales.id);
            if (itemsError) {
              console.error("Error fetching items:", itemsError);
            } else if (items) {
              this.items.set(items);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading invoice:", e);
      this.error.set(e.message || "Error al cargar la factura");
    } finally {
      this.loading.set(false);
    }
  }
  print() {
    window.print();
  }
  static \u0275fac = function AdminInvoiceDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminInvoiceDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminInvoiceDetailPage, selectors: [["app-admin-invoice-detail-page"]], decls: 4, vars: 1, consts: [[1, "print-container", "max-w-3xl", "mx-auto", "bg-white", "shadow-lg", "rounded-lg", "overflow-hidden", "my-8", "print:shadow-none", "print:max-w-none", "print:w-full", "print:m-0", "print:rounded-none", "text-gray-800"], [1, "p-8", "text-center"], [1, "p-8"], [1, "flex", "justify-between", "items-start", "mb-8"], [1, "text-3xl", "font-bold", "text-gray-800"], [1, "text-gray-500", "mt-1"], [1, "text-right"], ["alt", "Logo", 1, "h-16", "mb-2", "ml-auto", "object-contain", 3, "src"], [1, "font-bold", "text-xl", "text-indigo-600"], [1, "text-sm", "text-gray-500"], [1, "grid", "grid-cols-2", "gap-8", "mb-8"], [1, "font-bold", "text-gray-700", "mb-2"], [1, "w-full", "mb-8"], [1, "border-b-2", "border-gray-200", "text-gray-800"], [1, "text-left", "py-3"], [1, "text-center", "py-3"], [1, "text-right", "py-3"], [1, "border-b", "border-gray-100"], ["colspan", "3", 1, "text-right", "py-4", "font-bold"], [1, "text-right", "py-4", "font-bold", "text-xl"], [1, "flex", "justify-end", "gap-4", "print:hidden"], ["routerLink", "/admin/invoices", 1, "btn", "btn-ghost"], [1, "btn", "btn-primary", 3, "click"], [1, "fas", "fa-print", "mr-2"], [1, "py-3"]], template: function AdminInvoiceDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, AdminInvoiceDetailPage_Conditional_1_Template, 2, 0, "div", 1)(2, AdminInvoiceDetailPage_Conditional_2_Template, 64, 17, "div", 2)(3, AdminInvoiceDetailPage_Conditional_3_Template, 2, 0, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : ctx.invoice() ? 2 : 3);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminInvoiceDetailPage, [{
    type: Component,
    args: [{ selector: "app-admin-invoice-detail-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="print-container max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8 print:shadow-none print:max-w-none print:w-full print:m-0 print:rounded-none text-gray-800">\r
    @if (loading()) {\r
    <div class="p-8 text-center">Cargando...</div>\r
    } @else if (invoice()) {\r
    <div class="p-8">\r
        <!-- Header -->\r
        <div class="flex justify-between items-start mb-8">\r
            <div>\r
                <h1 class="text-3xl font-bold text-gray-800">Factura</h1>\r
                <p class="text-gray-500 mt-1">#{{ invoice().invoice_number || 'Borrador' }}</p>\r
            </div>\r
            <div class="text-right">\r
                @if (company()?.logo_url) {\r
                <img [src]="company().logo_url" alt="Logo" class="h-16 mb-2 ml-auto object-contain">\r
                }\r
                <div class="font-bold text-xl text-indigo-600">{{ company()?.name || 'Arecofix' }}</div>\r
                <p class="text-sm text-gray-500">{{ company()?.location || 'Servicios Integrales' }}</p>\r
                <p class="text-sm text-gray-500">{{ company()?.address }}</p>\r
                <p class="text-sm text-gray-500">{{ company()?.phone }}</p>\r
                <p class="text-sm text-gray-500">{{ company()?.email }}</p>\r
                @if (company()?.ruc) {\r
                <p class="text-sm text-gray-500">CUIT: {{ company()?.ruc }}</p>\r
                }\r
            </div>\r
        </div>\r
\r
        <!-- Info -->\r
        <div class="grid grid-cols-2 gap-8 mb-8">\r
            <div>\r
                <h3 class="font-bold text-gray-700 mb-2">Facturar a:</h3>\r
                <p>{{ invoice().customer_name || 'Consumidor Final' }}</p>\r
                <p class="text-sm text-gray-500">{{ invoice().customer_address }}</p>\r
                <p class="text-sm text-gray-500">{{ invoice().customer_dni_cuit }}</p>\r
            </div>\r
            <div class="text-right">\r
                <h3 class="font-bold text-gray-700 mb-2">Detalles:</h3>\r
                <p>Fecha: {{ invoice().issued_at | date:'shortDate' }}</p>\r
                <p>Tipo: {{ invoice().type }}</p>\r
            </div>\r
        </div>\r
\r
        <!-- Items -->\r
        <table class="w-full mb-8">\r
            <thead>\r
                <tr class="border-b-2 border-gray-200 text-gray-800">\r
                    <th class="text-left py-3">Descripci\xF3n</th>\r
                    <th class="text-center py-3">Cant.</th>\r
                    <th class="text-right py-3">Precio Unit.</th>\r
                    <th class="text-right py-3">Subtotal</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @for (item of items(); track item.id) {\r
                <tr class="border-b border-gray-100">\r
                    <td class="py-3">{{ item.products?.name || 'Producto eliminado' }}</td>\r
                    <td class="text-center py-3">{{ item.quantity }}</td>\r
                    <td class="text-right py-3">\${{ item.unit_price }}</td>\r
                    <td class="text-right py-3">\${{ item.subtotal }}</td>\r
                </tr>\r
                }\r
            </tbody>\r
            <tfoot>\r
                <tr>\r
                    <td colspan="3" class="text-right py-4 font-bold">Total</td>\r
                    <td class="text-right py-4 font-bold text-xl">\${{ invoice().total_amount }}</td>\r
                </tr>\r
            </tfoot>\r
        </table>\r
\r
        <!-- Actions -->\r
        <div class="flex justify-end gap-4 print:hidden">\r
            <a routerLink="/admin/invoices" class="btn btn-ghost">Volver</a>\r
            <button (click)="print()" class="btn btn-primary">\r
                <i class="fas fa-print mr-2"></i> Imprimir\r
            </button>\r
        </div>\r
    </div>\r
    } @else {\r
    <div class="p-8 text-center">Factura no encontrada</div>\r
    }\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminInvoiceDetailPage, { className: "AdminInvoiceDetailPage", filePath: "src/app/admin/sales/admin-invoice-detail-page.ts", lineNumber: 12 });
})();
export {
  AdminInvoiceDetailPage
};
//# sourceMappingURL=chunk-36JIRGHX.mjs.map
