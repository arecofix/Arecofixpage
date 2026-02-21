import {
  NotificationService
} from "./chunk-BL5IQYYM.js";
import {
  BrandRepository
} from "./chunk-ZJZBKGOC.js";
import {
  LoggerService
} from "./chunk-2IPP5M5M.js";
import "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  RouterLink
} from "./chunk-B7SLUDL7.js";
import {
  Component,
  firstValueFrom,
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
  ɵɵinterpolate,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-4O7IFJFV.js";
import "./chunk-GOMI4DH3.js";

// src/app/admin/brands/admin-brands-page.ts
var _c0 = (a0) => ["/admin/brands", a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminBrandsPage_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "Cargando...");
    \u0275\u0275elementEnd()();
  }
}
function AdminBrandsPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 8);
    \u0275\u0275text(2, "No hay marcas registradas.");
    \u0275\u0275elementEnd()();
  }
}
function AdminBrandsPage_Conditional_22_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 10);
  }
  if (rf & 2) {
    const brand_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("alt", \u0275\u0275interpolate(brand_r2.name))("src", brand_r2.logo_url, \u0275\u0275sanitizeUrl);
  }
}
function AdminBrandsPage_Conditional_22_For_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "i", 17);
    \u0275\u0275elementEnd();
  }
}
function AdminBrandsPage_Conditional_22_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 9)(1, "td");
    \u0275\u0275conditionalCreate(2, AdminBrandsPage_Conditional_22_For_1_Conditional_2_Template, 1, 3, "img", 10)(3, AdminBrandsPage_Conditional_22_For_1_Conditional_3_Template, 2, 0, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td")(5, "div", 12);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td")(10, "button", 14);
    \u0275\u0275listener("click", function AdminBrandsPage_Conditional_22_For_1_Template_button_click_10_listener() {
      const brand_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleStatus(brand_r2));
    });
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "a", 15);
    \u0275\u0275element(14, "i", 16);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const brand_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(brand_r2.logo_url ? 2 : 3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(brand_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(brand_r2.slug);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-success", brand_r2.is_active)("badge-error", !brand_r2.is_active);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", brand_r2.is_active ? "Activo" : "Inactivo", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c0, brand_r2.id));
  }
}
function AdminBrandsPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminBrandsPage_Conditional_22_For_1_Template, 15, 11, "tr", 9, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.brands());
  }
}
var AdminBrandsPage = class _AdminBrandsPage {
  brandRepo = inject(BrandRepository);
  logger = inject(LoggerService);
  notification = inject(NotificationService);
  brands = signal([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadBrands();
  }
  async loadBrands() {
    this.loading.set(true);
    try {
      const brands = await firstValueFrom(this.brandRepo.getAll({ column: "name", ascending: true }));
      this.brands.set(brands);
    } catch (error) {
      this.logger.error("Failed to load brands", error);
      this.notification.showError("Error al cargar las marcas");
    } finally {
      this.loading.set(false);
    }
  }
  async toggleStatus(brand) {
    try {
      await firstValueFrom(this.brandRepo.update(brand.id, { is_active: !brand.is_active }));
      await this.loadBrands();
      this.notification.showSuccess("Estado actualizado correctamente");
    } catch (error) {
      this.logger.error("Failed to toggle brand status", error);
      this.notification.showError("Error al actualizar el estado");
    }
  }
  static \u0275fac = function AdminBrandsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminBrandsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminBrandsPage, selectors: [["app-admin-brands-page"]], decls: 23, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], ["routerLink", "/admin/brands/new", 1, "btn", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-base-100", "rounded-lg", "shadow", "overflow-hidden", "text-base-content"], [1, "overflow-x-auto"], [1, "table", "w-full"], [1, "text-base-content", "font-bold"], ["colspan", "4", 1, "text-center", "py-4", "text-base-content/70"], [1, "hover:bg-base-200/50"], [1, "w-10", "h-10", "object-contain", 3, "src", "alt"], [1, "w-10", "h-10", "bg-base-200", "rounded", "flex", "items-center", "justify-center", "text-base-content/50"], [1, "font-bold"], [1, "text-sm", "opacity-50"], [1, "badge", 3, "click"], [1, "btn", "btn-sm", "btn-ghost", "hover:bg-base-300", 3, "routerLink"], [1, "fas", "fa-edit"], [1, "fas", "fa-image"]], template: function AdminBrandsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Marcas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 2);
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275text(5, " Nueva Marca ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "table", 6)(9, "thead")(10, "tr", 7)(11, "th");
      \u0275\u0275text(12, "Logo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "th");
      \u0275\u0275text(14, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "th");
      \u0275\u0275text(16, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "th");
      \u0275\u0275text(18, "Acciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "tbody");
      \u0275\u0275conditionalCreate(20, AdminBrandsPage_Conditional_20_Template, 3, 0, "tr")(21, AdminBrandsPage_Conditional_21_Template, 3, 0, "tr")(22, AdminBrandsPage_Conditional_22_Template, 2, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(20);
      \u0275\u0275conditional(ctx.loading() ? 20 : ctx.brands().length === 0 ? 21 : 22);
    }
  }, dependencies: [CommonModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminBrandsPage, [{
    type: Component,
    args: [{ selector: "app-admin-brands-page", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Marcas</h1>\r
    <a routerLink="/admin/brands/new" class="btn btn-primary">\r
        <i class="fas fa-plus mr-2"></i> Nueva Marca\r
    </a>\r
</div>\r
\r
<div class="bg-base-100 rounded-lg shadow overflow-hidden text-base-content">\r
    <div class="overflow-x-auto">\r
        <table class="table w-full">\r
            <thead>\r
                <tr class="text-base-content font-bold">\r
                    <th>Logo</th>\r
                    <th>Nombre</th>\r
                    <th>Estado</th>\r
                    <th>Acciones</th>\r
                </tr>\r
            </thead>\r
            <tbody>\r
                @if (loading()) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4 text-base-content/70">Cargando...</td>\r
                </tr>\r
                } @else if (brands().length === 0) {\r
                <tr>\r
                    <td colspan="4" class="text-center py-4 text-base-content/70">No hay marcas registradas.</td>\r
                </tr>\r
                } @else {\r
                @for (brand of brands(); track brand.id) {\r
                <tr class="hover:bg-base-200/50">\r
                    <td>\r
                        @if (brand.logo_url) {\r
                        <img [src]="brand.logo_url" alt="{{brand.name}}" class="w-10 h-10 object-contain">\r
                        } @else {\r
                        <div class="w-10 h-10 bg-base-200 rounded flex items-center justify-center text-base-content/50">\r
                            <i class="fas fa-image"></i>\r
                        </div>\r
                        }\r
                    </td>\r
                    <td>\r
                        <div class="font-bold">{{ brand.name }}</div>\r
                        <div class="text-sm opacity-50">{{ brand.slug }}</div>\r
                    </td>\r
                    <td>\r
                        <button (click)="toggleStatus(brand)" class="badge" [class.badge-success]="brand.is_active"\r
                            [class.badge-error]="!brand.is_active">\r
                            {{ brand.is_active ? 'Activo' : 'Inactivo' }}\r
                        </button>\r
                    </td>\r
                    <td>\r
                        <a [routerLink]="['/admin/brands', brand.id]" class="btn btn-sm btn-ghost hover:bg-base-300">\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminBrandsPage, { className: "AdminBrandsPage", filePath: "src/app/admin/brands/admin-brands-page.ts", lineNumber: 16 });
})();
export {
  AdminBrandsPage
};
//# sourceMappingURL=chunk-LQTEUPFA.js.map
