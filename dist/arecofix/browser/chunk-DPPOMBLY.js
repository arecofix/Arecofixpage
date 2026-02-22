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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
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

// src/app/admin/categories/admin-categories-page.ts
var _c0 = (a0) => ["/admin/categories", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminCategoriesPage_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminCategoriesPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay categor\xEDas registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminCategoriesPage_Conditional_22_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 9)(1, "td")(2, "div", 10);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 11);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "span", 12);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td")(10, "button", 13);
    \u0275\u0275listener("click", function AdminCategoriesPage_Conditional_22_For_1_Template_button_click_10_listener() {
      const category_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleStatus(category_r2));
    });
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "a", 14);
    \u0275\u0275element(14, "i", 15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const category_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(category_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(category_r2.slug);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(category_r2.type);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", category_r2.is_active)("badge-error", !category_r2.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", category_r2.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c0, category_r2.id));
  }
}
function AdminCategoriesPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminCategoriesPage_Conditional_22_For_1_Template, 15, 11, "tr", 9, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.categories());
  }
}
var AdminCategoriesPage = class _AdminCategoriesPage {
  auth = inject(AuthService);
  categories = signal([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadCategories();
  }
  async loadCategories() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    if (data) {
      this.categories.set(data);
    }
    this.loading.set(false);
  }
  async toggleStatus(category) {
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("categories").update({ is_active: !category.is_active }).eq("id", category.id);
    if (!error) {
      await this.loadCategories();
    }
  }
  static \u0275fac = function AdminCategoriesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminCategoriesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminCategoriesPage, selectors: [["app-admin-categories-page"]], decls: 23, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/categories/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content", "font-bold"], ["colspan", "4", 1, "text-center", "py-4", "text-base-content/70"], [1, "hover:bg-base-200/50"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge", "badge-ghost"], [1, "badge", 3, "click"], [1, "btn", "btn-sm", "btn-ghost", "hover:bg-base-300", 3, "routerLink"], [1, "fas", "fa-edit"]], template: function AdminCategoriesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Categor\xEDas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nueva Categor\xEDa ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Tipo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "tbody");
      \u0275\u0275conditionalCreate(20, AdminCategoriesPage_Conditional_20_Template, 3, 0, "tr")(21, AdminCategoriesPage_Conditional_21_Template, 3, 0, "tr")(22, AdminCategoriesPage_Conditional_22_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(20);
      \u0275\u0275conditional(ctx.loading() ? 20 : ctx.categories().length === 0 ? 21 : 22);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminCategoriesPage, [{
    type: Component,
    args: [{ selector: "app-admin-categories-page", standalone: true, imports: [RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Categor\xEDas</h1>\r
    <a routerLink="/admin/categories/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nueva Categor\xEDa\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content font-bold">\r
                    <th>Nombre</th>\r
                    <th>Tipo</th>\r
                    <th>Estado</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4 text-base-content/70">Cargando...</td>\r
                </tr>\r
                } @else if (categories().length === 0) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4 text-base-content/70">No hay categor\xEDas registradas.</td>\r
                </tr>\r
                } @else {\r
                @for (category of categories(); track category.id) {\r
                <tr class="hover:bg-base-200/50">\r
                    <td>\r
                        <div class="font-bold">{{ category.name }}</div>\r
                        <div class="text-sm opacity-50">{{ category.slug }}</div>\r
                    </td>\r
                    <td>\r
                        <span class="badge badge-ghost">{{ category.type }}</span>\r
                    </td>\r
                    <td>\r
                        <button (click)="toggleStatus(category)" class="badge"\r
                            [class.badge-success]="category.is_active" [class.badge-error]="!category.is_active">\r
                            {{ category.is_active ? 'Activo' : 'Inactivo' }}\r
                        </button>\r
                    </td>\r
                    <td>\r
                        <a [routerLink]="['/admin/categories', category.id]" class="btn btn-sm btn-ghost hover:bg-base-300">\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminCategoriesPage, { className: "AdminCategoriesPage", filePath: "src/app/admin/categories/admin-categories-page.ts", lineNumber: 13 });
})();
export {
  AdminCategoriesPage
};
//# sourceMappingURL=chunk-DPPOMBLY.js.map
