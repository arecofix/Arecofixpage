import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent
} from "./chunk-QH5M5CS5.js";
import {
  PaginationService
} from "./chunk-YKKGU7Z3.js";
import {
  Pagination
} from "./chunk-O2M4FZEU.js";
import {
  rxResource
} from "./chunk-D3DVUTQW.js";
import "./chunk-GT5IWTCB.js";
import {
  CategoryService
} from "./chunk-QTLDSSZK.js";
import "./chunk-QVICQRN7.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  combineLatest,
  computed,
  inject,
  input,
  map,
  setClassMetadata,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-K7T46PVE.js";
import {
  __objRest
} from "./chunk-GOMI4DH3.js";

// src/app/public/categories/pages/home/components/card/public-category-card.ts
function PublicCategoryCard_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 11);
    \u0275\u0275element(2, "span", 12)(3, "span", 13);
    \u0275\u0275elementEnd()();
  }
}
var PublicCategoryCard = class _PublicCategoryCard {
  category = input.required(...ngDevMode ? [{ debugName: "category" }] : []);
  // Icon mapping
  iconMap = {
    "repuestos": "fas fa-tools",
    "accesorios": "fas fa-headphones",
    "celulares": "fas fa-mobile-alt",
    "tablets": "fas fa-tablet-alt",
    "computacion": "fas fa-laptop",
    "notebooks": "fas fa-laptop",
    "monitores": "fas fa-desktop",
    "gamer": "fas fa-gamepad",
    "redes": "fas fa-wifi",
    "impresion": "fas fa-print",
    "audio": "fas fa-music",
    "cables": "fas fa-plug",
    "fundas": "fas fa-shield-alt",
    "cargadores": "fas fa-charging-station",
    "baterias": "fas fa-battery-full",
    "modulos": "fas fa-mobile",
    "ofertas": "fas fa-tags",
    "nuevos": "fas fa-star",
    "destacados": "fas fa-fire",
    "default": "fas fa-layer-group"
  };
  categoryIcon = computed(() => {
    const slug = this.category().slug.toLowerCase();
    const name = this.category().name.toLowerCase();
    for (const key in this.iconMap) {
      if (slug.includes(key))
        return this.iconMap[key];
    }
    for (const key in this.iconMap) {
      if (name.includes(key))
        return this.iconMap[key];
    }
    return this.category().icon || this.iconMap["default"];
  }, ...ngDevMode ? [{ debugName: "categoryIcon" }] : []);
  categoryLink = computed(() => {
    const slug = this.category().slug.toLowerCase();
    if (slug === "cursos" || slug === "academy" || slug === "capacitaciones") {
      return ["/academy"];
    }
    if (slug === "repuestos") {
      return ["/repuestos"];
    }
    return ["/productos", "categoria", this.category().slug];
  }, ...ngDevMode ? [{ debugName: "categoryLink" }] : []);
  static \u0275fac = function PublicCategoryCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicCategoryCard)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicCategoryCard, selectors: [["public-category-card"]], inputs: { category: [1, "category"] }, decls: 14, vars: 6, consts: [[1, "h-full", "group", "relative", "bg-white", "dark:bg-gray-800", "rounded-3xl", "p-1", "overflow-hidden", "transition-all", "duration-300", "hover:shadow-2xl", "hover:shadow-indigo-500/20", "hover:-translate-y-1"], [1, "absolute", "inset-0", "bg-linear-to-br", "from-indigo-500", "via-purple-500", "to-pink-500", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300"], [1, "relative", "h-full", "bg-white", "dark:bg-gray-800", "rounded-[22px]", "p-6", "flex", "flex-col", "items-center", "text-center", "z-10"], [1, "w-20", "h-20", "mb-6", "bg-gray-50", "dark:bg-gray-700/50", "rounded-2xl", "flex", "items-center", "justify-center", "group-hover:bg-indigo-50", "dark:group-hover:bg-indigo-900/30", "transition-colors", "duration-300", "group-hover:scale-110"], ["aria-hidden", "true", 1, "text-3xl", "text-gray-400", "group-hover:text-indigo-600", "dark:group-hover:text-indigo-400", "transition-colors", "duration-300"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-3", "group-hover:text-indigo-600", "dark:group-hover:text-indigo-400", "transition-colors"], [1, "text-gray-500", "dark:text-gray-400", "text-sm", "leading-relaxed", "mb-6", "line-clamp-3"], [1, "mt-auto", "w-full"], [1, "btn", "btn-outline", "btn-block", "border-gray-200", "dark:border-gray-700", "hover:border-indigo-600", "hover:bg-indigo-600", "hover:text-white", "dark:hover:border-indigo-500", "dark:hover:bg-indigo-500", "rounded-xl", "group-hover:shadow-lg", "transition-all", 3, "routerLink"], ["aria-hidden", "true", 1, "fas", "fa-arrow-right", "ml-2", "opacity-0", "-translate-x-2", "group-hover:opacity-100", "group-hover:translate-x-0", "transition-all"], [1, "absolute", "top-4", "right-4"], [1, "relative", "flex", "h-3", "w-3"], [1, "animate-ping", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "bg-yellow-400", "opacity-75"], [1, "relative", "inline-flex", "rounded-full", "h-3", "w-3", "bg-yellow-500"]], template: function PublicCategoryCard_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h2", 5);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 6);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7)(10, "a", 8);
      \u0275\u0275text(11, " Ver Productos ");
      \u0275\u0275element(12, "i", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(13, PublicCategoryCard_Conditional_13_Template, 4, 0, "div", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275classMap(ctx.categoryIcon());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.category().name, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.category().description || "Explora los mejores productos en esta categor\xEDa.", " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", ctx.categoryLink());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.category().featured ? 13 : -1);
    }
  }, dependencies: [RouterLink, CommonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n/*# sourceMappingURL=public-category-card.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicCategoryCard, [{
    type: Component,
    args: [{ selector: "public-category-card", imports: [RouterLink, CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Category Card with Premium styling -->\r
<div class="h-full group relative bg-white dark:bg-gray-800 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1">\r
  <!-- Gradient Border Effect -->\r
  <div class="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>\r
  \r
  <div class="relative h-full bg-white dark:bg-gray-800 rounded-[22px] p-6 flex flex-col items-center text-center z-10">\r
    \r
    <!-- Icon Container -->\r
    <div class="w-20 h-20 mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors duration-300 group-hover:scale-110">\r
      <i [class]="categoryIcon()" class="text-3xl text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" aria-hidden="true"></i>\r
    </div>\r
\r
    <!-- Content -->\r
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">\r
      {{ category().name }}\r
    </h2>\r
\r
    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">\r
       {{ category().description || 'Explora los mejores productos en esta categor\xEDa.' }}\r
    </p>\r
\r
    <!-- Footer / Button -->\r
    <div class="mt-auto w-full">\r
         <a [routerLink]="categoryLink()" class="btn btn-outline btn-block border-gray-200 dark:border-gray-700 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:hover:border-indigo-500 dark:hover:bg-indigo-500 rounded-xl group-hover:shadow-lg transition-all">\r
            Ver Productos <i class="fas fa-arrow-right ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true"></i>\r
         </a>\r
    </div>\r
\r
    <!-- Featured Badge -->\r
    @if (category().featured) {\r
        <div class="absolute top-4 right-4">\r
            <span class="relative flex h-3 w-3">\r
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>\r
              <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>\r
            </span>\r
        </div>\r
    }\r
  </div>\r
</div>\r
`, styles: ["/* angular:styles/component:css;6e28c36ad508c7db75a06ff6107e28ea89cbdce7ec3d3388495cdc21f039cddc;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/categories/pages/home/components/card/public-category-card.ts */\n:host {\n  display: block;\n  height: 100%;\n}\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n/*# sourceMappingURL=public-category-card.css.map */\n"] }]
  }], null, { category: [{ type: Input, args: [{ isSignal: true, alias: "category", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicCategoryCard, { className: "PublicCategoryCard", filePath: "src/app/public/categories/pages/home/components/card/public-category-card.ts", lineNumber: 21 });
})();

// src/app/public/categories/pages/home/public-categories-home-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function PublicCategoriesHomePage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-loading");
  }
}
function PublicCategoriesHomePage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error");
  }
}
function PublicCategoriesHomePage_Conditional_19_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-empty");
  }
}
function PublicCategoriesHomePage_Conditional_19_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "public-category-card", 12);
  }
  if (rf & 2) {
    const category_r1 = ctx.$implicit;
    \u0275\u0275property("category", category_r1);
  }
}
function PublicCategoriesHomePage_Conditional_19_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "pagination", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ctx_r1.categoriesRs.value().pages)("currentPage", ctx_r1.paginationService.currentPage());
  }
}
function PublicCategoriesHomePage_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275repeaterCreate(1, PublicCategoriesHomePage_Conditional_19_Conditional_1_For_2_Template, 1, 1, "public-category-card", 12, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PublicCategoriesHomePage_Conditional_19_Conditional_1_Conditional_3_Template, 2, 2, "div", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.filteredCategories());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.paginationData() ? 3 : -1);
  }
}
function PublicCategoriesHomePage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PublicCategoriesHomePage_Conditional_19_Conditional_0_Template, 1, 0, "is-empty")(1, PublicCategoriesHomePage_Conditional_19_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.categoriesRs.value().data.length === 0 ? 0 : 1);
  }
}
var PublicCategoriesHomePage = class _PublicCategoriesHomePage {
  route = inject(ActivatedRoute);
  paginationService = inject(PaginationService);
  categoryService = inject(CategoryService);
  categoriesRs = rxResource({
    stream: () => combineLatest([
      this.route.queryParams.pipe(map((params) => +params["_page"] || 1))
    ]).pipe(switchMap(([currentPage]) => this.categoryService.getData({
      _page: currentPage,
      _per_page: 5
    })))
  });
  paginationData = computed(() => {
    const data = this.categoriesRs.value();
    if (!data)
      return null;
    const _a = data, { data: items } = _a, pagination = __objRest(_a, ["data"]);
    return pagination;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  /** ✅ NUEVO: Computed con categorías filtradas */
  filteredCategories = computed(() => {
    const res = this.categoriesRs.value();
    if (!res)
      return [];
    const slugsToExclude = ["sports", "deportes", "music", "m\xFAsica", "clothing", "ropa", "home-garden", "hogar-jard\xEDn", "automotive", "automoviles", "toys", "juguetes", "health-beauty", "salud-belleza", , "food-drinks", "comida-bebidas"];
    return res.data.filter((category) => !slugsToExclude.includes(category.slug.toLowerCase()));
  }, ...ngDevMode ? [{ debugName: "filteredCategories" }] : []);
  static \u0275fac = function PublicCategoriesHomePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicCategoriesHomePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicCategoriesHomePage, selectors: [["app-public-categories-home-page"]], decls: 20, vars: 1, consts: [[1, "relative", "bg-gray-900", "text-white", "py-16", "mb-12", "overflow-hidden", "isolate"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-slate-900", "via-purple-900", "to-slate-900", "opacity-90"], [1, "absolute", "-top-24", "-left-24", "w-96", "h-96", "bg-purple-600", "rounded-full", "mix-blend-screen", "filter", "blur-3xl", "opacity-20"], [1, "absolute", "bottom-0", "right-0", "w-64", "h-64", "bg-teal-500", "rounded-full", "mix-blend-screen", "filter", "blur-3xl", "opacity-20"], [1, "relative", "container", "mx-auto", "px-4", "text-center"], [1, "text-sm", "breadcrumbs", "text-gray-400", "justify-center", "mb-6", "flex"], ["routerLink", "/", 1, "hover:text-white", "transition-colors"], [1, "font-semibold", "text-white"], [1, "text-4xl", "md:text-6xl", "font-black", "mb-6", "tracking-tight", "text-white", "drop-shadow-xl"], [1, "text-xl", "text-gray-300", "max-w-2xl", "mx-auto", "font-light", "leading-relaxed"], [1, "container", "mx-auto", "px-4", "pb-20"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-8"], [1, "h-full", 3, "category"], [1, "mt-16", "flex", "justify-center"], [3, "pages", "currentPage"]], template: function PublicCategoriesHomePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "ul")(7, "li")(8, "a", 6);
      \u0275\u0275text(9, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "li", 7);
      \u0275\u0275text(11, "Categor\xEDas");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "h1", 8);
      \u0275\u0275text(13, " Explor\xE1 Nuestras Categor\xEDas ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "p", 9);
      \u0275\u0275text(15, " Encontr\xE1 exactamente lo que busc\xE1s navegando por nuestras secciones especializadas. Calidad y variedad en un solo lugar. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275conditionalCreate(17, PublicCategoriesHomePage_Conditional_17_Template, 1, 0, "is-loading")(18, PublicCategoriesHomePage_Conditional_18_Template, 1, 0, "is-error")(19, PublicCategoriesHomePage_Conditional_19_Template, 2, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275conditional(ctx.categoriesRs.isLoading() ? 17 : ctx.categoriesRs.error() ? 18 : ctx.categoriesRs.hasValue() ? 19 : -1);
    }
  }, dependencies: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    PublicCategoryCard,
    Pagination
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicCategoriesHomePage, [{
    type: Component,
    args: [{ selector: "app-public-categories-home-page", imports: [
      IsEmptyComponent,
      IsErrorComponent,
      IsLoadingComponent,
      PublicCategoryCard,
      Pagination
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '<!-- Hero Section -->\r\n<div class="relative bg-gray-900 text-white py-16 mb-12 overflow-hidden isolate">\r\n    <div class="absolute inset-0 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 opacity-90"></div>\r\n    <div class="absolute -top-24 -left-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>\r\n    <div class="absolute bottom-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>\r\n\r\n    <div class="relative container mx-auto px-4 text-center">\r\n         <!-- Breadcrumbs -->\r\n        <div class="text-sm breadcrumbs text-gray-400 justify-center mb-6 flex">\r\n            <ul>\r\n                <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>\r\n                <li class="font-semibold text-white">Categor\xEDas</li>\r\n            </ul>\r\n        </div>\r\n\r\n        <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-xl">\r\n            Explor\xE1 Nuestras Categor\xEDas\r\n        </h1>\r\n        <p class="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">\r\n            Encontr\xE1 exactamente lo que busc\xE1s navegando por nuestras secciones especializadas. Calidad y variedad en un solo lugar.\r\n        </p>\r\n    </div>\r\n</div>\r\n\r\n<div class="container mx-auto px-4 pb-20">\r\n  @if (categoriesRs.isLoading()) {\r\n    <is-loading />\r\n  } @else if (categoriesRs.error()) {\r\n    <is-error />\r\n  } @else if (categoriesRs.hasValue()) {\r\n    \r\n    @if (categoriesRs.value().data.length === 0) {\r\n        <is-empty />\r\n    } @else {\r\n        <!-- Responsive category grid -->\r\n        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">\r\n            @for (category of filteredCategories(); track category.id) {\r\n            <public-category-card [category]="category" class="h-full" />\r\n            }\r\n        </div>\r\n\r\n        @if (paginationData()) {\r\n            <div class="mt-16 flex justify-center">\r\n                <pagination\r\n                [pages]="categoriesRs.value().pages"\r\n                [currentPage]="paginationService.currentPage()"\r\n                />\r\n            </div>\r\n        }\r\n    }\r\n  }\r\n</div>\r\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicCategoriesHomePage, { className: "PublicCategoriesHomePage", filePath: "src/app/public/categories/pages/home/public-categories-home-page.ts", lineNumber: 29 });
})();
var public_categories_home_page_default = PublicCategoriesHomePage;
export {
  PublicCategoriesHomePage,
  public_categories_home_page_default as default
};
//# sourceMappingURL=chunk-4F3EYRCF.js.map
