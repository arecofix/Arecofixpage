import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  DatePipe,
  UpperCasePipe
} from "./chunk-JEV3MPEL.mjs";
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
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DXH6IVIR.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/admin/users/admin-users-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminUsersPage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr")(1, "td", 6);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275domElementEnd()();
  }
}
function AdminUsersPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr")(1, "td", 6);
    \u0275\u0275text(2, "No hay usuarios registrados.");
    \u0275\u0275domElementEnd()();
  }
}
function AdminUsersPage_Conditional_19_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "tr")(1, "td")(2, "div", 7)(3, "div", 8)(4, "div", 9);
    \u0275\u0275domElement(5, "img", 10);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(6, "div")(7, "div", 11);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "div", 12);
    \u0275\u0275text(10);
    \u0275\u0275domElementEnd()()()();
    \u0275\u0275domElementStart(11, "td")(12, "div", 13);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "uppercase");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "date");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElement(18, "td");
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const user_r1 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275domProperty("src", user_r1.avatar_url || "https://ui-avatars.com/api/?name=" + user_r1.first_name + "+" + user_r1.last_name, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", user_r1.first_name, " ", user_r1.last_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r1.email);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-primary", user_r1.role === "admin")("badge-secondary", user_r1.role === "staff")("badge-ghost", user_r1.role === "user");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 12, user_r1.role), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(17, 14, user_r1.created_at, "short"));
  }
}
function AdminUsersPage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminUsersPage_Conditional_19_For_1_Template, 19, 17, "tr", null, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.users());
  }
}
var AdminUsersPage = class _AdminUsersPage {
  auth = inject(AuthService);
  users = signal([], ...ngDevMode ? [{ debugName: "users" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadUsers();
  }
  async loadUsers() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) {
      this.users.set(data);
    }
    this.loading.set(false);
  }
  async toggleRole(user) {
    const newRole = user.role === "admin" ? "user" : "admin";
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    if (!error) {
      await this.loadUsers();
    }
  }
  static \u0275fac = function AdminUsersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminUsersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminUsersPage, selectors: [["app-admin-users-page"]], decls: 20, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content"], ["colspan", "4", 1, "text-center", "py-4"], [1, "flex", "items-center", "gap-3"], [1, "avatar"], [1, "mask", "mask-squircle", "w-12", "h-12"], ["alt", "Avatar", 3, "src"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge"]], template: function AdminUsersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Usuarios");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(3, "div", 2)(4, "div", 3)(5, "table", 4)(6, "thead")(7, "tr", 5)(8, "th");
      \u0275\u0275text(9, "Usuario");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(10, "th");
      \u0275\u0275text(11, "Rol");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(12, "th");
      \u0275\u0275text(13, "Fecha Registro");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(14, "th");
      \u0275\u0275text(15, "Acciones");
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(16, "tbody");
      \u0275\u0275conditionalCreate(17, AdminUsersPage_Conditional_17_Template, 3, 0, "tr")(18, AdminUsersPage_Conditional_18_Template, 3, 0, "tr")(19, AdminUsersPage_Conditional_19_Template, 2, 0);
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275conditional(ctx.loading() ? 17 : ctx.users().length === 0 ? 18 : 19);
    }
  }, dependencies: [CommonModule, UpperCasePipe, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminUsersPage, [{
    type: Component,
    args: [{ selector: "app-admin-users-page", standalone: true, imports: [CommonModule], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Usuarios</h1>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content">\r
                    <th>Usuario</th>\r
                    <th>Rol</th>\r
                    <th>Fecha Registro</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4">Cargando...</td>\r
                </tr>\r
                } @else if (users().length === 0) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4">No hay usuarios registrados.</td>\r
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
                                <div class="text-sm opacity-50">{{ user.email }}</div>\r
                            </div>\r
                        </div>\r
                    </td>\r
                    <td>\r
                        <div class="badge" [class.badge-primary]="user.role === 'admin'"\r
                            [class.badge-secondary]="user.role === 'staff'" [class.badge-ghost]="user.role === 'user'">\r
                            {{ user.role | uppercase }}\r
                        </div>\r
                    </td>\r
                    <td>{{ user.created_at | date:'short' }}</td>\r
                    <td>\r
                        <!-- <button class="btn btn-sm btn-ghost" (click)="toggleRole(user)">\r
                  Cambiar Rol\r
                </button> -->\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminUsersPage, { className: "AdminUsersPage", filePath: "src/app/admin/users/admin-users-page.ts", lineNumber: 12 });
})();
export {
  AdminUsersPage
};
//# sourceMappingURL=chunk-SBQVCIOJ.mjs.map
