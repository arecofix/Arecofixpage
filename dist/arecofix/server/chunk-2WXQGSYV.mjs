import './polyfills.server.mjs';
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-EBVHUSN7.mjs";
import {
  AuthService,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  DatePipe
} from "./chunk-NQCCIK3J.mjs";
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
  ɵɵtextInterpolate2
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/admin/users/admin-users-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminUsersPage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 6);
    \u0275\u0275text(2, "Cargando usuarios...");
    \u0275\u0275elementEnd()();
  }
}
function AdminUsersPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 7);
    \u0275\u0275text(2, "No hay usuarios registrados.");
    \u0275\u0275elementEnd()();
  }
}
function AdminUsersPage_Conditional_19_For_1_For_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const branch_r4 = ctx.$implicit;
    \u0275\u0275property("ngValue", branch_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(branch_r4.name);
  }
}
function AdminUsersPage_Conditional_19_For_1_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1, "Global (Todas las sucursales)");
    \u0275\u0275elementEnd();
  }
}
function AdminUsersPage_Conditional_19_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 8)(3, "div", 9)(4, "div", 10);
    \u0275\u0275element(5, "img", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "div", 12);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 13);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "td")(12, "select", 14);
    \u0275\u0275listener("ngModelChange", function AdminUsersPage_Conditional_19_For_1_Template_select_ngModelChange_12_listener($event) {
      const user_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateUserRole(user_r2, $event));
    });
    \u0275\u0275elementStart(13, "option", 15);
    \u0275\u0275text(14, "Cliente (User)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 16);
    \u0275\u0275text(16, "T\xE9cnico (Staff)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 17);
    \u0275\u0275text(18, "Administrador (Admin)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "td")(20, "select", 18);
    \u0275\u0275listener("ngModelChange", function AdminUsersPage_Conditional_19_For_1_Template_select_ngModelChange_20_listener($event) {
      const user_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.updateUserBranch(user_r2, $event));
    });
    \u0275\u0275elementStart(21, "option", 19);
    \u0275\u0275text(22, "-- Sin Sucursal Asignada --");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(23, AdminUsersPage_Conditional_19_For_1_For_24_Template, 2, 2, "option", 19, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, AdminUsersPage_Conditional_19_For_1_Conditional_25_Template, 2, 0, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "td", 21);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("src", user_r2.avatar_url || "https://ui-avatars.com/api/?name=" + user_r2.first_name + "+" + user_r2.last_name, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", user_r2.first_name, " ", user_r2.last_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r2.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", user_r2.role);
    \u0275\u0275advance(8);
    \u0275\u0275property("ngModel", user_r2.branch_id)("disabled", user_r2.role === "admin" || user_r2.role === "user");
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.branches());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(user_r2.role === "admin" ? 25 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(28, 10, user_r2.created_at, "shortDate"));
  }
}
function AdminUsersPage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminUsersPage_Conditional_19_For_1_Template, 29, 13, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.users());
  }
}
var AdminUsersPage = class _AdminUsersPage {
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  users = signal([], ...ngDevMode ? [{ debugName: "users" }] : []);
  branches = signal([], ...ngDevMode ? [{ debugName: "branches" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadBranches();
    await this.loadUsers();
  }
  async loadBranches() {
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await supabase.from("branches").select("*").eq("tenant_id", tenantId).order("name");
    if (!error && data) {
      this.branches.set(data);
    }
  }
  async loadUsers() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await supabase.from("profiles").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
    if (!error && data) {
      this.users.set(data);
    }
    this.loading.set(false);
  }
  async updateUserRole(user, newRole) {
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    if (!error) {
      user.role = newRole;
    } else {
      alert("Error actualizando el rol: " + error.message);
    }
  }
  async updateUserBranch(user, newBranchId) {
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("profiles").update({ branch_id: newBranchId || null }).eq("id", user.id);
    if (!error) {
      user.branch_id = newBranchId;
    } else {
      alert("Error actualizando la sucursal: " + error.message);
    }
  }
  static \u0275fac = function AdminUsersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminUsersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminUsersPage, selectors: [["app-admin-users-page"]], decls: 20, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "4", 1, "text-center", "py-4"], ["colspan", "4", 1, "text-center", "py-4", "text-gray-400"], [1, "flex", "items-center", "gap-3"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12"], ["alt", "Avatar", 3, "src"], [1, "font-bold"], [1, "text-xs", "opacity-50"], [1, "select", "select-sm", "select-bordered", "w-full", "max-w-xs", 3, "ngModelChange", "ngModel"], ["value", "user"], ["value", "staff"], ["value", "admin"], [1, "select", "select-sm", "select-bordered", "w-full", "max-w-xs", 3, "ngModelChange", "ngModel", "disabled"], [3, "ngValue"], [1, "text-[10px]", "text-gray-400", "mt-1"], [1, "text-sm", "opacity-70"]], template: function AdminUsersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Usuarios");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "table", 4)(6, "thead")(7, "tr", 5)(8, "th");
      \u0275\u0275text(9, "Usuario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "th");
      \u0275\u0275text(11, "Rol en el Negocio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "th");
      \u0275\u0275text(13, "Sucursal Asignada");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "th");
      \u0275\u0275text(15, "Fecha Registro");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "tbody");
      \u0275\u0275conditionalCreate(17, AdminUsersPage_Conditional_17_Template, 3, 0, "tr")(18, AdminUsersPage_Conditional_18_Template, 3, 0, "tr")(19, AdminUsersPage_Conditional_19_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275conditional(ctx.loading() ? 17 : ctx.users().length === 0 ? 18 : 19);
    }
  }, dependencies: [CommonModule, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminUsersPage, [{
    type: Component,
    args: [{ selector: "app-admin-users-page", standalone: true, imports: [CommonModule, FormsModule], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Usuarios</h1>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Usuario</th>\r
                    <th>Rol en el Negocio</th>\r
                    <th>Sucursal Asignada</th>\r
                    <th>Fecha Registro</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4">Cargando usuarios...</td>\r
                </tr>\r
                } @else if (users().length === 0) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4 text-gray-400">No hay usuarios registrados.</td>\r
                </tr>\r
                } @else {\r
                @for (user of users(); track user.id) {\r
                <tr>\r
                    <td>\r
                        <div class="flex items-center gap-3">\r
                            <div class="avatar">\r
                                <div class="mask mask-squircle w-12 h-12">\r
                                    <img [src]="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.first_name + '+' + user.last_name"\r
                                        alt="Avatar" />\r
                                </div>\r
                            </div>\r
                            <div>\r
                                <div class="font-bold">{{ user.first_name }} {{ user.last_name }}</div>\r
                                <div class="text-xs opacity-50">{{ user.email }}</div>\r
                            </div>\r
                        </div>\r
                    </td>\r
                    <td>\r
                        <select class="select select-sm select-bordered w-full max-w-xs"\r
                                [ngModel]="user.role"\r
                                (ngModelChange)="updateUserRole(user, $event)">\r
                            <option value="user">Cliente (User)</option>\r
                            <option value="staff">T\xE9cnico (Staff)</option>\r
                            <option value="admin">Administrador (Admin)</option>\r
                        </select>\r
                    </td>\r
                    <td>\r
                        <select class="select select-sm select-bordered w-full max-w-xs"\r
                                [ngModel]="user.branch_id"\r
                                (ngModelChange)="updateUserBranch(user, $event)"\r
                                [disabled]="user.role === 'admin' || user.role === 'user'">\r
                            <option [ngValue]="null">-- Sin Sucursal Asignada --</option>\r
                            @for (branch of branches(); track branch.id) {\r
                                <option [ngValue]="branch.id">{{ branch.name }}</option>\r
                            }\r
                        </select>\r
                        @if(user.role === 'admin') {\r
                            <div class="text-[10px] text-gray-400 mt-1">Global (Todas las sucursales)</div>\r
                        }\r
                    </td>\r
                    <td class="text-sm opacity-70">{{ user.created_at | date:'shortDate' }}</td>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminUsersPage, { className: "AdminUsersPage", filePath: "src/app/admin/users/admin-users-page.ts", lineNumber: 15 });
})();
export {
  AdminUsersPage
};
//# sourceMappingURL=chunk-2WXQGSYV.mjs.map
