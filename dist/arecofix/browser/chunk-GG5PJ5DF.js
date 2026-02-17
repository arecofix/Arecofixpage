import {
  FavoritesService
} from "./chunk-D636JDKS.js";
import {
  CartService
} from "./chunk-2WPTPN3R.js";
import {
  DecimalPipe,
  NgOptimizedImage,
  RouterLink,
  RouterModule
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  computed,
  inject,
  input,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-K7T46PVE.js";

// src/app/public/products/components/card/product-card.ts
var _c0 = (a0) => ["/productos/detalle", a0];
function ProductCard_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1, " Destacado ");
    \u0275\u0275elementEnd();
  }
}
var ProductCard = class _ProductCard {
  product = input.required(...ngDevMode ? [{ debugName: "product" }] : []);
  isPriority = input(false, ...ngDevMode ? [{ debugName: "isPriority" }] : []);
  quickView = output();
  cartService = inject(CartService);
  favoritesService = inject(FavoritesService);
  isFavorite = computed(() => this.favoritesService.isFavorite(this.product().id), ...ngDevMode ? [{ debugName: "isFavorite" }] : []);
  toggleFav(event) {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.product());
  }
  addToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product());
  }
  static \u0275fac = function ProductCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductCard)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductCard, selectors: [["product-card"]], inputs: { product: [1, "product"], isPriority: [1, "isPriority"] }, outputs: { quickView: "quickView" }, decls: 38, vars: 29, consts: [[1, "group", "relative", "bg-white", "dark:bg-gray-800", "rounded-2xl", "border", "border-gray-200", "dark:border-gray-700", "shadow-sm", "hover:shadow-xl", "transition-all", "duration-300", "flex", "flex-col", "h-full", "overflow-hidden"], [1, "relative", "aspect-4/3", "overflow-hidden", "bg-gray-50", "dark:bg-gray-700", "p-2", "sm:p-4"], ["fill", "", 1, "object-contain", "mix-blend-multiply", "dark:mix-blend-normal", "group-hover:scale-105", "transition-transform", "duration-500", 3, "ngSrc", "alt", "priority"], [1, "absolute", "top-2", "left-2", "sm:top-3", "sm:left-3", "flex", "flex-col", "gap-2"], [1, "inline-flex", "items-center", "px-2", "py-0.5", "rounded-full", "text-[10px]", "sm:text-xs", "font-medium", "bg-yellow-100", "text-yellow-800", "shadow-sm"], [1, "absolute", "top-2", "right-2", "p-2", "rounded-full", "bg-white/80", "dark:bg-black/50", "hover:bg-white", "dark:hover:bg-gray-700", "transition-colors", "shadow-sm", "z-10", "group/fav", 3, "click"], [1, "fa-heart", "transition-transform", "group-active/fav:scale-90"], [1, "absolute", "bottom-0", "left-0", "right-0", "p-2", "sm:p-4", "translate-y-full", "group-hover:translate-y-0", "transition-transform", "duration-300", "bg-linear-to-t", "from-black/50", "to-transparent"], [1, "flex", "flex-col", "gap-2"], [1, "w-full", "btn", "btn-primary", "btn-xs", "sm:btn-sm", "shadow-lg", "border-none", "bg-indigo-600", "hover:bg-indigo-700", "text-white", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-3", "h-3", "sm:w-4", "sm:h-4", "mr-1", "sm:mr-2"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"], [1, "w-full", "btn", "btn-xs", "sm:btn-sm", "btn-outline", "bg-white/90", "hover:bg-white", "text-gray-900", "border-none", "shadow-lg", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"], [1, "p-3", "sm:p-4", "flex", "flex-col", "flex-1"], [1, "font-medium", "text-sm", "sm:text-base", "text-gray-900", "dark:text-white", "mb-1", "line-clamp-2", "group-hover:text-indigo-600", "dark:group-hover:text-indigo-400", "transition-colors"], [3, "routerLink"], [1, "text-xs", "sm:text-sm", "text-gray-500", "dark:text-gray-400", "line-clamp-2", "mb-2", "sm:mb-4", "flex-1"], [1, "flex", "items-end", "justify-between", "mt-auto", "pt-2", "sm:pt-4", "border-t", "border-gray-100", "dark:border-gray-700"], [1, "flex", "flex-col"], [1, "text-[10px]", "sm:text-xs", "text-gray-400", "dark:text-gray-500"], [1, "text-base", "sm:text-xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "text-indigo-600", "dark:text-indigo-400", "hover:text-indigo-800", "dark:hover:text-indigo-300", "text-xs", "sm:text-sm", "font-medium", "flex", "items-center", 3, "routerLink"], [1, "hidden", "sm:inline"], [1, "sm:hidden"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-3", "h-3", "sm:w-4", "sm:h-4", "ml-1"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 5l7 7-7 7"]], template: function ProductCard_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "img", 2);
      \u0275\u0275elementStart(3, "div", 3);
      \u0275\u0275conditionalCreate(4, ProductCard_Conditional_4_Template, 2, 0, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "button", 5);
      \u0275\u0275listener("click", function ProductCard_Template_button_click_5_listener($event) {
        return ctx.toggleFav($event);
      });
      \u0275\u0275element(6, "i", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7)(8, "div", 8)(9, "button", 9);
      \u0275\u0275listener("click", function ProductCard_Template_button_click_9_listener($event) {
        return ctx.addToCart($event);
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(10, "svg", 10);
      \u0275\u0275element(11, "path", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, " Agregar ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "button", 12);
      \u0275\u0275listener("click", function ProductCard_Template_button_click_13_listener($event) {
        ctx.quickView.emit(ctx.product());
        return $event.stopPropagation();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 10);
      \u0275\u0275element(15, "path", 13)(16, "path", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275text(17, " Vistazo ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(18, "div", 15)(19, "h3", 16)(20, "a", 17);
      \u0275\u0275text(21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "p", 18);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 19)(25, "div", 20)(26, "span", 21);
      \u0275\u0275text(27, "Precio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "span", 22);
      \u0275\u0275text(29);
      \u0275\u0275pipe(30, "number");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "a", 23)(32, "span", 24);
      \u0275\u0275text(33, "Ver m\xE1s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "span", 25);
      \u0275\u0275text(35, "Ver");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(36, "svg", 26);
      \u0275\u0275element(37, "path", 27);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(2);
      \u0275\u0275property("ngSrc", ctx.product().image_url || ((tmp_0_0 = ctx.product().gallery_urls) == null ? null : tmp_0_0[0]) || "assets/img/no-image.png")("alt", ctx.product().name)("priority", ctx.isPriority());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.product().featured ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", ctx.isFavorite() ? "Quitar de favoritos" : "Agregar a favoritos");
      \u0275\u0275advance();
      \u0275\u0275classProp("fas", ctx.isFavorite())("far", !ctx.isFavorite())("text-red-500", ctx.isFavorite())("text-gray-400", !ctx.isFavorite() && !ctx.isFavorite())("dark:text-white", !ctx.isFavorite());
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-label", "Agregar al Carrito " + ctx.product().name);
      \u0275\u0275advance(4);
      \u0275\u0275attribute("aria-label", "Vista R\xE1pida " + ctx.product().name);
      \u0275\u0275advance(7);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(25, _c0, ctx.product().slug));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.product().name, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.product().description, " ");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" $", \u0275\u0275pipeBind2(30, 22, ctx.product().price, "1.0-0"), " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(27, _c0, ctx.product().slug));
    }
  }, dependencies: [RouterModule, RouterLink, NgOptimizedImage, DecimalPipe], styles: ["\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.line-clamp-3[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n/*# sourceMappingURL=product-card.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductCard, [{
    type: Component,
    args: [{ selector: "product-card", standalone: true, imports: [RouterModule, DecimalPipe, NgOptimizedImage], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">\r
  \r
  <!-- Image Container -->\r
  <div class="relative aspect-4/3 overflow-hidden bg-gray-50 dark:bg-gray-700 p-2 sm:p-4">\r
    <img \r
      [ngSrc]="product().image_url || product().gallery_urls?.[0] || 'assets/img/no-image.png'" \r
      [alt]="product().name"\r
      fill\r
      [priority]="isPriority()"\r
      class="object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" \r
    />\r
    \r
    <!-- Badges -->\r
    <div class="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2">\r
      @if (product().featured) {\r
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 shadow-sm">\r
          Destacado\r
        </span>\r
      }\r
    </div>\r
\r
    <!-- Favorite Button -->\r
    <button (click)="toggleFav($event)" class="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm z-10 group/fav" [attr.aria-label]="isFavorite() ? 'Quitar de favoritos' : 'Agregar a favoritos'">\r
        <i class="fa-heart transition-transform group-active/fav:scale-90" \r
           [class.fas]="isFavorite()" \r
           [class.far]="!isFavorite()" \r
           [class.text-red-500]="isFavorite()"\r
           [class.text-gray-400]="!isFavorite() && !isFavorite()"\r
           [class.dark:text-white]="!isFavorite()"></i>\r
    </button>\r
\r
    <!-- Quick Actions (visible on hover) -->\r
    <div class="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/50 to-transparent">\r
       <div class="flex flex-col gap-2">\r
           <button (click)="addToCart($event)" [attr.aria-label]="'Agregar al Carrito ' + product().name" class="w-full btn btn-primary btn-xs sm:btn-sm shadow-lg border-none bg-indigo-600 hover:bg-indigo-700 text-white">\r
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />\r
            </svg>\r
            Agregar\r
          </button>\r
          <button (click)="quickView.emit(product()); $event.stopPropagation()" [attr.aria-label]="'Vista R\xE1pida ' + product().name" class="w-full btn btn-xs sm:btn-sm btn-outline bg-white/90 hover:bg-white text-gray-900 border-none shadow-lg">\r
             <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>\r
             Vistazo\r
          </button>\r
       </div>\r
    </div>\r
  </div>\r
\r
  <!-- Content -->\r
  <div class="p-3 sm:p-4 flex flex-col flex-1">\r
    \r
    <h3 class="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">\r
      <a [routerLink]="['/productos/detalle', product().slug]">\r
        {{ product().name }}\r
      </a>\r
    </h3>\r
    \r
    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 sm:mb-4 flex-1">\r
      {{ product().description }}\r
    </p>\r
\r
    <div class="flex items-end justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-100 dark:border-gray-700">\r
      <div class="flex flex-col">\r
        <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">Precio</span>\r
        <span class="text-base sm:text-xl font-bold text-gray-900 dark:text-white">\r
          \${{ product().price | number:'1.0-0' }}\r
        </span>\r
      </div>\r
      \r
      <a [routerLink]="['/productos/detalle', product().slug]" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs sm:text-sm font-medium flex items-center">\r
        <span class="hidden sm:inline">Ver m\xE1s</span>\r
        <span class="sm:hidden">Ver</span>\r
        <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />\r
        </svg>\r
      </a>\r
    </div>\r
  </div>\r
</div>`, styles: ["/* angular:styles/component:css;17a6d86737bf3a2fba9a13a407d2344bc1c5c114f3d007e2c9a46d1438194cac;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/products/components/card/product-card.ts */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.line-clamp-3 {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n/*# sourceMappingURL=product-card.css.map */\n"] }]
  }], null, { product: [{ type: Input, args: [{ isSignal: true, alias: "product", required: true }] }], isPriority: [{ type: Input, args: [{ isSignal: true, alias: "isPriority", required: false }] }], quickView: [{ type: Output, args: ["quickView"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductCard, { className: "ProductCard", filePath: "src/app/public/products/components/card/product-card.ts", lineNumber: 30 });
})();

export {
  ProductCard
};
//# sourceMappingURL=chunk-GG5PJ5DF.js.map
