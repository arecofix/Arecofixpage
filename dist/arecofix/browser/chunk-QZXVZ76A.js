import {
  AuthService
} from "./chunk-MZTEREIC.js";
import "./chunk-4WZKXYCH.js";
import "./chunk-TCBIYFRD.js";
import {
  RouterLink
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
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TQTEFGZE.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/suppliers/admin-suppliers-page.ts
var _c0 = (a0) => ["/admin/suppliers", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminSuppliersPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminSuppliersPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay proveedores registrados.");
    \u0275\u0275elementEnd()();
  }
}
function AdminSuppliersPage_Conditional_24_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 9);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 10);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "div", 11);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 12);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "div", 13);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 14);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td")(17, "span", 15);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td")(20, "a", 16);
    \u0275\u0275element(21, "i", 17);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const supplier_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(supplier_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(supplier_r1.cuil);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(supplier_r1.rubro);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(supplier_r1.type);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(supplier_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(supplier_r1.phone);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", supplier_r1.is_active)("badge-ghost", !supplier_r1.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", supplier_r1.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(12, _c0, supplier_r1.id));
  }
}
function AdminSuppliersPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminSuppliersPage_Conditional_24_For_1_Template, 22, 14, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.suppliers());
  }
}
var AdminSuppliersPage = class _AdminSuppliersPage {
  auth = inject(AuthService);
  suppliers = signal([], ...ngDevMode ? [{ debugName: "suppliers" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadSuppliers();
  }
  async loadSuppliers() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("suppliers").select("*").order("name");
    if (data) {
      this.suppliers.set(data);
    }
    this.loading.set(false);
  }
  static \u0275fac = function AdminSuppliersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminSuppliersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSuppliersPage, selectors: [["app-admin-suppliers-page"]], decls: 25, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/suppliers/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "5", 1, "text-center", "py-4"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge", "badge-outline"], [1, "text-xs", "mt-1"], [1, "text-sm"], [1, "text-xs"], [1, "badge"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit"]], template: function AdminSuppliersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Proveedores");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nuevo Proveedor ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Rubro / Tipo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Contacto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "th");
      \u0275\u0275text(20, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "tbody");
      \u0275\u0275conditionalCreate(22, AdminSuppliersPage_Conditional_22_Template, 3, 0, "tr")(23, AdminSuppliersPage_Conditional_23_Template, 3, 0, "tr")(24, AdminSuppliersPage_Conditional_24_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(22);
      \u0275\u0275conditional(ctx.loading() ? 22 : ctx.suppliers().length === 0 ? 23 : 24);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminSuppliersPage, [{
    type: Component,
    args: [{ selector: "app-admin-suppliers-page", standalone: true, imports: [RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Proveedores</h1>\r
    <a routerLink="/admin/suppliers/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nuevo Proveedor\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Nombre</th>\r
                    <th>Rubro / Tipo</th>\r
                    <th>Contacto</th>\r
                    <th>Estado</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (suppliers().length === 0) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">No hay proveedores registrados.</td>\r
                </tr>\r
                } @else {\r
                @for (supplier of suppliers(); track supplier.id) {\r
                <tr>\r
                    <td>\r
                        <div class="font-bold">{{ supplier.name }}</div>\r
                        <div class="text-sm opacity-50">{{ supplier.cuil }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="badge badge-outline">{{ supplier.rubro }}</div>\r
                        <div class="text-xs mt-1">{{ supplier.type }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="text-sm">{{ supplier.email }}</div>\r
                        <div class="text-xs">{{ supplier.phone }}</div>\r
                    </td>\r
                    <td>\r
                        <span class="badge" [class.badge-success]="supplier.is_active"\r
                            [class.badge-ghost]="!supplier.is_active">\r
                            {{ supplier.is_active ? 'Activo' : 'Inactivo' }}\r
                        </span>\r
                    </td>\r
                    <td>\r
                        <a [routerLink]="['/admin/suppliers', supplier.id]" class="btn btn-sm btn-ghost">\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSuppliersPage, { className: "AdminSuppliersPage", filePath: "src/app/admin/suppliers/admin-suppliers-page.ts", lineNumber: 13 });
})();
export {
  AdminSuppliersPage
};
//# sourceMappingURL=chunk-QZXVZ76A.js.map
