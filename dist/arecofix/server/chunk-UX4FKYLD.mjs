import './polyfills.server.mjs';
import {
  ProductCard
} from "./chunk-JZP2RKNE.mjs";
import "./chunk-PBT4ODLM.mjs";
import {
  ProductService
} from "./chunk-XXWNFGFG.mjs";
import "./chunk-YF4HGWJS.mjs";
import "./chunk-GHI7DVCX.mjs";
import "./chunk-XSIYETXB.mjs";
import {
  SeoService
} from "./chunk-3LSO3424.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-EBVHUSN7.mjs";
import {
  CategoryService
} from "./chunk-5LPXNVZX.mjs";
import "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  Router,
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  DecimalPipe
} from "./chunk-NQCCIK3J.mjs";
import {
  Component,
  Injectable,
  catchError,
  firstValueFrom,
  forkJoin,
  inject,
  map,
  of,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/core/usecases/products/get-products-by-category-slug.usecase.ts
var GetProductsByCategorySlugUseCase = class _GetProductsByCategorySlugUseCase {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  execute(slug, limit = 4) {
    return this.categoryService.getDataBySlug(slug).pipe(switchMap((response) => {
      const category = response.data?.[0];
      if (!category?.id) {
        return of([]);
      }
      return this.productService.getData({
        category_id: category.id,
        _per_page: limit
      }).pipe(map((res) => res.data || []));
    }), catchError((error) => {
      console.error(`Error fetching products for category ${slug}`, error);
      return of([]);
    }));
  }
  static \u0275fac = function GetProductsByCategorySlugUseCase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GetProductsByCategorySlugUseCase)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GetProductsByCategorySlugUseCase, factory: _GetProductsByCategorySlugUseCase.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GetProductsByCategorySlugUseCase, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/public/products/pages/index/products-index-page.ts
var _c0 = (a0) => ["/productos/detalle", a0];
var _forTrack0 = ($index, $item) => $item.id;
function ProductsIndexPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "span", 13);
    \u0275\u0275elementEnd();
  }
}
function ProductsIndexPage_Conditional_14_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "product-card", 24);
    \u0275\u0275listener("quickView", function ProductsIndexPage_Conditional_14_Conditional_7_For_2_Template_product_card_quickView_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openQuickView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r3 = ctx.$implicit;
    \u0275\u0275property("product", product_r3);
  }
}
function ProductsIndexPage_Conditional_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275repeaterCreate(1, ProductsIndexPage_Conditional_14_Conditional_7_For_2_Template, 1, 1, "product-card", 23, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.celulares());
  }
}
function ProductsIndexPage_Conditional_14_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 25);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "No hay celulares disponibles por el momento.");
    \u0275\u0275elementEnd()();
  }
}
function ProductsIndexPage_Conditional_14_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "product-card", 24);
    \u0275\u0275listener("quickView", function ProductsIndexPage_Conditional_14_Conditional_16_For_2_Template_product_card_quickView_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openQuickView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r5 = ctx.$implicit;
    \u0275\u0275property("product", product_r5);
  }
}
function ProductsIndexPage_Conditional_14_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275repeaterCreate(1, ProductsIndexPage_Conditional_14_Conditional_16_For_2_Template, 1, 1, "product-card", 23, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.repuestos());
  }
}
function ProductsIndexPage_Conditional_14_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 25);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "No hay repuestos disponibles por el momento.");
    \u0275\u0275elementEnd()();
  }
}
function ProductsIndexPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 14)(1, "div", 15)(2, "h2", 16);
    \u0275\u0275text(3, "Celulares");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "a", 17);
    \u0275\u0275text(5, "Ver todos ");
    \u0275\u0275element(6, "i", 18);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, ProductsIndexPage_Conditional_14_Conditional_7_Template, 3, 0, "div", 19)(8, ProductsIndexPage_Conditional_14_Conditional_8_Template, 4, 0, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "section")(10, "div", 15)(11, "h2", 21);
    \u0275\u0275text(12, "Repuestos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "a", 22);
    \u0275\u0275text(14, "Ver todos ");
    \u0275\u0275element(15, "i", 18);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, ProductsIndexPage_Conditional_14_Conditional_16_Template, 3, 0, "div", 19)(17, ProductsIndexPage_Conditional_14_Conditional_17_Template, 4, 0, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.celulares().length > 0 ? 7 : 8);
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r1.repuestos().length > 0 ? 16 : 17);
  }
}
function ProductsIndexPage_Conditional_15_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275text(2, " En Stock ");
    \u0275\u0275elementEnd();
  }
}
function ProductsIndexPage_Conditional_15_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275element(1, "i", 29);
    \u0275\u0275text(2, " Agotado ");
    \u0275\u0275elementEnd();
  }
}
function ProductsIndexPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275listener("click", function ProductsIndexPage_Conditional_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeQuickView());
    });
    \u0275\u0275elementStart(1, "div", 27);
    \u0275\u0275listener("click", function ProductsIndexPage_Conditional_15_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "button", 28);
    \u0275\u0275listener("click", function ProductsIndexPage_Conditional_15_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeQuickView());
    });
    \u0275\u0275element(3, "i", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 30)(5, "div", 31);
    \u0275\u0275element(6, "img", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 33)(8, "span", 34);
    \u0275\u0275text(9, " Producto ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "h2", 35);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 36)(13, "span", 37);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, ProductsIndexPage_Conditional_15_Conditional_16_Template, 3, 0, "span", 38)(17, ProductsIndexPage_Conditional_15_Conditional_17_Template, 3, 0, "span", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p", 40);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 41)(21, "button", 42);
    \u0275\u0275element(22, "i", 43);
    \u0275\u0275text(23, " Agregar al Carrito ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "a", 44);
    \u0275\u0275listener("click", function ProductsIndexPage_Conditional_15_Template_a_click_24_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeQuickView());
    });
    \u0275\u0275text(25, " Ver Detalles ");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const p_r7 = ctx;
    \u0275\u0275advance(6);
    \u0275\u0275property("src", p_r7.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", p_r7.name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", p_r7.name, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" $", \u0275\u0275pipeBind2(15, 7, p_r7.price, "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((p_r7.stock ?? 0) > 0 ? 16 : 17);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", p_r7.description, " ");
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(10, _c0, p_r7.slug));
  }
}
var ProductsIndexPage = class _ProductsIndexPage {
  getProductsUseCase = inject(GetProductsByCategorySlugUseCase);
  seoService = inject(SeoService);
  router = inject(Router);
  celulares = signal([], ...ngDevMode ? [{ debugName: "celulares" }] : []);
  repuestos = signal([], ...ngDevMode ? [{ debugName: "repuestos" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  searchQuery = "";
  // Quick View State
  quickViewProduct = signal(null, ...ngDevMode ? [{ debugName: "quickViewProduct" }] : []);
  isQuickViewOpen = signal(false, ...ngDevMode ? [{ debugName: "isQuickViewOpen" }] : []);
  ngOnInit() {
    this.setSeoData();
    this.loadData();
  }
  setSeoData() {
    this.seoService.setPageData({
      title: "Productos - Celulares y Repuestos",
      description: "Explora nuestra selecci\xF3n de celulares nuevos y usados, y encuentra los repuestos que necesitas en Arecofix.",
      imageUrl: "assets/img/brands/logo/logo-normal1.PNG"
    });
  }
  async loadData() {
    try {
      const [celularesData, repuestosData] = await firstValueFrom(forkJoin([
        this.getProductsUseCase.execute("celulares"),
        this.getProductsUseCase.execute("repuestos")
      ]));
      this.celulares.set(celularesData);
      this.repuestos.set(repuestosData);
    } catch (error) {
      console.error("Error loading products", error);
    } finally {
      this.loading.set(false);
    }
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/products/all"], { queryParams: { q: this.searchQuery } });
    }
  }
  openQuickView(product) {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }
  closeQuickView() {
    this.isQuickViewOpen.set(false);
    this.quickViewProduct.set(null);
  }
  static \u0275fac = function ProductsIndexPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductsIndexPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsIndexPage, selectors: [["app-products-index-page"]], decls: 16, vars: 3, consts: [[1, "min-h-screen", "bg-base-100", "py-10", "px-4"], [1, "max-w-7xl", "mx-auto"], [1, "flex", "flex-col", "md:flex-row", "justify-center", "items-center", "gap-4", "mb-4"], [1, "text-4xl", "font-bold", "text-center"], ["routerLink", "/productos", 1, "btn", "btn-primary", "btn-outline", "btn-sm"], [1, "fas", "fa-list", "ml-1"], [1, "flex", "justify-center", "mb-12"], [1, "relative", "w-full", "max-w-md"], ["type", "text", "placeholder", "Buscar producto...", 1, "input", "input-bordered", "w-full", "pl-10", "shadow-lg", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "btn", "btn-ghost", "btn-sm", "btn-circle", 3, "click"], [1, "fas", "fa-search", "text-base-content/50"], [1, "flex", "justify-center", "p-10"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/50", "backdrop-blur-sm"], [1, "loading", "loading-spinner", "loading-lg"], [1, "mb-16"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "border-l-4", "border-primary", "pl-4"], ["routerLink", "/productos/categoria/celulares", 1, "btn", "btn-sm", "btn-ghost"], [1, "fas", "fa-arrow-right", "ml-1"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "alert", "alert-info"], [1, "text-2xl", "font-bold", "border-l-4", "border-secondary", "pl-4"], ["routerLink", "/productos/categoria/repuestos", 1, "btn", "btn-sm", "btn-ghost"], [3, "product"], [3, "quickView", "product"], [1, "fas", "fa-info-circle"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-black/50", "backdrop-blur-sm", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-2xl", "max-w-4xl", "w-full", "max-h-[90vh]", "overflow-y-auto", "relative", "animate-fade-in-up", 3, "click"], [1, "absolute", "top-4", "right-4", "btn", "btn-circle", "btn-sm", "btn-ghost", "z-10", 3, "click"], [1, "fas", "fa-times"], [1, "grid", "grid-cols-1", "md:grid-cols-2"], [1, "bg-gray-50", "dark:bg-gray-700", "p-8", "flex", "items-center", "justify-center"], [1, "max-h-96", "object-contain", 3, "src", "alt"], [1, "p-8", "flex", "flex-col", "h-full"], [1, "text-sm", "text-indigo-600", "font-bold", "uppercase", "tracking-wider", "mb-2"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white", "mb-4"], [1, "flex", "items-center", "gap-4", "mb-6"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "badge", "badge-success", "gap-2"], [1, "badge", "badge-error", "gap-2"], [1, "text-gray-600", "dark:text-gray-300", "text-lg", "mb-8", "leading-relaxed"], [1, "mt-auto", "flex", "gap-4"], [1, "btn", "btn-primary", "flex-1"], [1, "fas", "fa-shopping-cart", "mr-2"], [1, "btn", "btn-outline", "flex-1", 3, "click", "routerLink"], [1, "fas", "fa-check"]], template: function ProductsIndexPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "Nuestros Productos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 4);
      \u0275\u0275text(6, " Ver Cat\xE1logo Completo ");
      \u0275\u0275element(7, "i", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function ProductsIndexPage_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("keyup.enter", function ProductsIndexPage_Template_input_keyup_enter_10_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 9);
      \u0275\u0275listener("click", function ProductsIndexPage_Template_button_click_11_listener() {
        return ctx.onSearch();
      });
      \u0275\u0275element(12, "i", 10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(13, ProductsIndexPage_Conditional_13_Template, 2, 0, "div", 11)(14, ProductsIndexPage_Conditional_14_Template, 18, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, ProductsIndexPage_Conditional_15_Template, 26, 12, "div", 12);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() ? 13 : 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_2_0 = ctx.isQuickViewOpen() && ctx.quickViewProduct()) ? 15 : -1, tmp_2_0);
    }
  }, dependencies: [CommonModule, RouterLink, ProductCard, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, DecimalPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsIndexPage, [{
    type: Component,
    args: [{ selector: "app-products-index-page", standalone: true, imports: [CommonModule, RouterLink, ProductCard, FormsModule], template: `<div class="min-h-screen bg-base-100 py-10 px-4">\r
    <div class="max-w-7xl mx-auto">\r
\r
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">\r
             <h1 class="text-4xl font-bold text-center">Nuestros Productos</h1>\r
             <a routerLink="/productos" class="btn btn-primary btn-outline btn-sm">\r
                Ver Cat\xE1logo Completo <i class="fas fa-list ml-1"></i>\r
             </a>\r
        </div>\r
        \r
        <div class="flex justify-center mb-12">\r
            <div class="relative w-full max-w-md">\r
                <input \r
                    type="text" \r
                    placeholder="Buscar producto..." \r
                    [(ngModel)]="searchQuery"\r
                    (keyup.enter)="onSearch()"\r
                    class="input input-bordered w-full pl-10 shadow-lg" />\r
                <button (click)="onSearch()" class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle">\r
                    <i class="fas fa-search text-base-content/50"></i>\r
                </button>\r
            </div>\r
        </div>\r
\r
        @if (loading()) {\r
        <div class="flex justify-center p-10">\r
            <span class="loading loading-spinner loading-lg"></span>\r
        </div>\r
        } @else {\r
\r
        <!-- Section: Celulares -->\r
        <section class="mb-16">\r
            <div class="flex justify-between items-center mb-6">\r
                <h2 class="text-2xl font-bold border-l-4 border-primary pl-4">Celulares</h2>\r
                <a routerLink="/productos/categoria/celulares" class="btn btn-sm btn-ghost">Ver todos <i\r
                        class="fas fa-arrow-right ml-1"></i></a>\r
            </div>\r
\r
            @if (celulares().length > 0) {\r
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\r
                @for (product of celulares(); track product.id) {\r
                <product-card [product]="product" (quickView)="openQuickView($event)"></product-card>\r
                }\r
            </div>\r
            } @else {\r
            <div class="alert alert-info">\r
                <i class="fas fa-info-circle"></i>\r
                <span>No hay celulares disponibles por el momento.</span>\r
            </div>\r
            }\r
        </section>\r
\r
        <!-- Section: Repuestos -->\r
        <section>\r
            <div class="flex justify-between items-center mb-6">\r
                <h2 class="text-2xl font-bold border-l-4 border-secondary pl-4">Repuestos</h2>\r
                <a routerLink="/productos/categoria/repuestos" class="btn btn-sm btn-ghost">Ver todos <i\r
                        class="fas fa-arrow-right ml-1"></i></a>\r
            </div>\r
\r
            @if (repuestos().length > 0) {\r
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\r
                @for (product of repuestos(); track product.id) {\r
                <product-card [product]="product" (quickView)="openQuickView($event)"></product-card>\r
                }\r
            </div>\r
            } @else {\r
            <div class="alert alert-info">\r
                <i class="fas fa-info-circle"></i>\r
                <span>No hay repuestos disponibles por el momento.</span>\r
            </div>\r
            }\r
        </section>\r
\r
        }\r
    </div>\r
\r
    <!-- Quick View Modal -->\r
    @if (isQuickViewOpen() && quickViewProduct(); as p) {\r
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" (click)="closeQuickView()">\r
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in-up" (click)="$event.stopPropagation()">\r
            \r
            <button (click)="closeQuickView()" class="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost z-10">\r
                <i class="fas fa-times"></i>\r
            </button>\r
\r
            <div class="grid grid-cols-1 md:grid-cols-2">\r
                <!-- Image -->\r
                <div class="bg-gray-50 dark:bg-gray-700 p-8 flex items-center justify-center">\r
                    <img [src]="p.image_url || 'assets/img/no-image.png'" [alt]="p.name" class="max-h-96 object-contain">\r
                </div>\r
\r
                <!-- Info -->\r
                <div class="p-8 flex flex-col h-full">\r
                    <span class="text-sm text-indigo-600 font-bold uppercase tracking-wider mb-2">\r
                        Producto\r
                    </span>\r
                    \r
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">\r
                        {{ p.name }}\r
                    </h2>\r
\r
                    <div class="flex items-center gap-4 mb-6">\r
                        <span class="text-3xl font-bold text-gray-900 dark:text-white">\r
                            \${{ p.price | number:'1.0-0' }}\r
                        </span>\r
                        @if ((p.stock ?? 0) > 0) {\r
                            <span class="badge badge-success gap-2">\r
                                <i class="fas fa-check"></i> En Stock\r
                            </span>\r
                        } @else {\r
                            <span class="badge badge-error gap-2">\r
                                <i class="fas fa-times"></i> Agotado\r
                            </span>\r
                        }\r
                    </div>\r
\r
                    <p class="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">\r
                        {{ p.description }}\r
                    </p>\r
\r
                    <div class="mt-auto flex gap-4">\r
                        <button class="btn btn-primary flex-1">\r
                            <i class="fas fa-shopping-cart mr-2"></i> Agregar al Carrito\r
                        </button>\r
                        <a [routerLink]="['/productos/detalle', p.slug]" (click)="closeQuickView()" class="btn btn-outline flex-1">\r
                            Ver Detalles\r
                        </a>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
    }\r
\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsIndexPage, { className: "ProductsIndexPage", filePath: "src/app/public/products/pages/index/products-index-page.ts", lineNumber: 17 });
})();
export {
  ProductsIndexPage
};
//# sourceMappingURL=chunk-UX4FKYLD.mjs.map
