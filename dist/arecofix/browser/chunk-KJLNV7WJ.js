import {
  AuthService
} from "./chunk-65AYZUFN.js";
import "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  RouterLink,
  UpperCasePipe
} from "./chunk-B7SLUDL7.js";
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
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-4O7IFJFV.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/employees/admin-employees-page.ts
var _c0 = (a0) => ["/admin/employees", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminEmployeesPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminEmployeesPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay empleados registrados.");
    \u0275\u0275elementEnd()();
  }
}
function AdminEmployeesPage_Conditional_24_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 9)(3, "div", 10)(4, "div", 11);
    \u0275\u0275element(5, "img", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "div", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 14);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "td")(12, "div", 15);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "uppercase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 16);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "div", 17);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td")(21, "span", 18);
    \u0275\u0275text(22, "Activo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "td")(24, "a", 19);
    \u0275\u0275element(25, "i", 20);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const employee_r1 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275property("src", employee_r1.avatar_url || "https://ui-avatars.com/api/?name=" + employee_r1.first_name + "+" + employee_r1.last_name, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", employee_r1.first_name, " ", employee_r1.last_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(employee_r1.email);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 8, employee_r1.role));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(employee_r1.job_title || "Sin cargo definido");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(employee_r1.phone || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(10, _c0, employee_r1.id));
  }
}
function AdminEmployeesPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminEmployeesPage_Conditional_24_For_1_Template, 26, 12, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.employees());
  }
}
var AdminEmployeesPage = class _AdminEmployeesPage {
  auth = inject(AuthService);
  employees = signal([], ...ngDevMode ? [{ debugName: "employees" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadEmployees();
  }
  async loadEmployees() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").in("role", ["admin", "staff"]).order("created_at", { ascending: false });
    if (data) {
      this.employees.set(data);
    }
    this.loading.set(false);
  }
  static \u0275fac = function AdminEmployeesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminEmployeesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminEmployeesPage, selectors: [["app-admin-employees-page"]], decls: 25, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/employees/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "5", 1, "text-center", "py-4"], [1, "flex", "items-center", "gap-3"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12"], ["alt", "Avatar", 3, "src"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge", "badge-primary", "badge-outline"], [1, "text-xs", "mt-1"], [1, "text-sm"], [1, "badge", "badge-success"], [1, "btn", "btn-sm", "btn-ghost", 3, "routerLink"], [1, "fas", "fa-edit"]], template: function AdminEmployeesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Empleados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nuevo Empleado ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Empleado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Cargo / Rol");
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
      \u0275\u0275conditionalCreate(22, AdminEmployeesPage_Conditional_22_Template, 3, 0, "tr")(23, AdminEmployeesPage_Conditional_23_Template, 3, 0, "tr")(24, AdminEmployeesPage_Conditional_24_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(22);
      \u0275\u0275conditional(ctx.loading() ? 22 : ctx.employees().length === 0 ? 23 : 24);
    }
  }, dependencies: [CommonModule, RouterLink, UpperCasePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminEmployeesPage, [{
    type: Component,
    args: [{ selector: "app-admin-employees-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Empleados</h1>\r
    <a routerLink="/admin/employees/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nuevo Empleado\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Empleado</th>\r
                    <th>Cargo / Rol</th>\r
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
                } @else if (employees().length === 0) {\r
                <tr>\r
                    <td colspan="5" class="text-center py-4">No hay empleados registrados.</td>\r
                </tr>\r
                } @else {\r
                @for (employee of employees(); track employee.id) {\r
                <tr>\r
                    <td>\r
                        <div class="flex items-center gap-3">\r
                            <div class="avatar">\r
                                <div class="mask mask-squircle w-12 h-12">\r
                                    <img [src]="employee.avatar_url || 'https://ui-avatars.com/api/?name=' + employee.first_name + '+' + employee.last_name" alt="Avatar" />\r
                                </div>\r
                            </div>\r
                            <div>\r
                                <div class="font-bold">{{ employee.first_name }} {{ employee.last_name }}</div>\r
                                <div class="text-sm opacity-50">{{ employee.email }}</div>\r
                            </div>\r
                        </div>\r
                    </td>\r
                    <td>\r
                        <div class="badge badge-primary badge-outline">{{ employee.role | uppercase }}</div>\r
                        <div class="text-xs mt-1">{{ employee.job_title || 'Sin cargo definido' }}</div>\r
                    </td>\r
                    <td>\r
                        <div class="text-sm">{{ employee.phone || 'N/A' }}</div>\r
                    </td>\r
                    <td>\r
                        <span class="badge badge-success">Activo</span>\r
                    </td>\r
                    <td>\r
                        <a [routerLink]="['/admin/employees', employee.id]" class="btn btn-sm btn-ghost">\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminEmployeesPage, { className: "AdminEmployeesPage", filePath: "src/app/admin/employees/admin-employees-page.ts", lineNumber: 13 });
})();
export {
  AdminEmployeesPage
};
//# sourceMappingURL=chunk-KJLNV7WJ.js.map
