import {
  SeoService
} from "./chunk-EO3I4DDE.js";
import {
  BreadcrumbsComponent
} from "./chunk-HYWNRL7J.js";
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent
} from "./chunk-K2XCQALM.js";
import {
  rxResource,
  toObservable
} from "./chunk-UPERU5DK.js";
import {
  CategoryService
} from "./chunk-2U27SUM4.js";
import "./chunk-NJJ5IL4Q.js";
import {
  FavoritesService
} from "./chunk-UD52RVVX.js";
import {
  ProductService
} from "./chunk-6G7ZH75Y.js";
import {
  CartService
} from "./chunk-FEAFVB6V.js";
import "./chunk-GR2FBAX3.js";
import "./chunk-BP46OLLS.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-TOKXMODF.js";
import "./chunk-O2ZTZE6T.js";
import "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  CommonModule,
  DecimalPipe,
  Location,
  NgOptimizedImage,
  Router,
  RouterModule
} from "./chunk-WHLM5VZW.js";
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Injectable,
  Injector,
  combineLatest,
  computed,
  effect,
  inject,
  map,
  of,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-XQFVERLD.js";
import "./chunk-GOMI4DH3.js";

// src/app/core/services/fallback.service.ts
var FallbackService = class _FallbackService {
  fallbackProducts = [
    {
      id: "1001",
      category_id: "0",
      slug: "joystick-play-station-4",
      name: "Joystick Play Station 4",
      description: "En venta Joystick nuevo de play station 4 DUALSHOCK",
      price: 29800,
      featured: true,
      image_url: "assets/img/products/joystick-ps4-v2.webp"
    },
    {
      id: "1002",
      category_id: "0",
      slug: "iphone-8-plus",
      name: "iPhone 8 Plus",
      description: "En venta iPhone 8 Plus vidrio astillado no afecta su uso",
      price: 96e3,
      featured: true,
      image_url: "assets/img/products/iph8plus.webp"
    },
    {
      id: "1003",
      category_id: "0",
      slug: "iphone-x",
      name: "iPhone X",
      description: "En venta celular iphone x a wifi",
      price: 149e3,
      featured: true,
      image_url: "assets/img/products/iphx.webp"
    }
  ];
  getFallbackProduct(slug) {
    return this.fallbackProducts.find((p) => p.slug === slug);
  }
  getAllFallbackProducts() {
    return [...this.fallbackProducts];
  }
  isFallbackProduct(slug) {
    return this.fallbackProducts.some((p) => p.slug === slug);
  }
  static \u0275fac = function FallbackService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FallbackService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FallbackService, factory: _FallbackService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FallbackService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/public/products/pages/details/products-details-page.ts
var _c0 = () => [1, 2, 3, 4, 5];
function ProductsDetailsPage_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-loading");
  }
}
function ProductsDetailsPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-empty");
  }
}
function ProductsDetailsPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-error");
  }
}
function ProductsDetailsPage_Conditional_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 10);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngSrc", ctx_r1.selectedImage())("alt", ctx_r1.product().name)("priority", true);
  }
}
function ProductsDetailsPage_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 11);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("alt", ctx_r1.product().name);
  }
}
function ProductsDetailsPage_Conditional_3_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function ProductsDetailsPage_Conditional_3_Conditional_12_For_2_Template_button_click_0_listener() {
      const img_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectImage(img_r4));
    });
    \u0275\u0275element(1, "img", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const img_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("ring-2", ctx_r1.selectedImage() === img_r4)("ring-indigo-500", ctx_r1.selectedImage() === img_r4);
    \u0275\u0275advance();
    \u0275\u0275property("ngSrc", img_r4)("alt", ctx_r1.product().name);
  }
}
function ProductsDetailsPage_Conditional_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, ProductsDetailsPage_Conditional_3_Conditional_12_For_2_Template, 2, 6, "button", 41, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.product().gallery_urls);
  }
}
function ProductsDetailsPage_Conditional_3_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 19);
    \u0275\u0275element(1, "path", 44);
    \u0275\u0275elementEnd();
  }
}
function ProductsDetailsPage_Conditional_3_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("SKU: ", ctx_r1.product().sku);
  }
}
function ProductsDetailsPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "input", 3);
    \u0275\u0275twoWayListener("ngModelChange", function ProductsDetailsPage_Conditional_3_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.searchQuery, $event) || (ctx_r1.searchQuery = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keyup.enter", function ProductsDetailsPage_Conditional_3_Template_input_keyup_enter_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 4);
    \u0275\u0275listener("click", function ProductsDetailsPage_Conditional_3_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearch());
    });
    \u0275\u0275element(5, "i", 5);
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(6, "app-breadcrumbs", 6);
    \u0275\u0275elementStart(7, "div", 7)(8, "div", 8)(9, "div", 9);
    \u0275\u0275conditionalCreate(10, ProductsDetailsPage_Conditional_3_Conditional_10_Template, 1, 3, "img", 10)(11, ProductsDetailsPage_Conditional_3_Conditional_11_Template, 1, 1, "img", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, ProductsDetailsPage_Conditional_3_Conditional_12_Template, 3, 0, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 13)(14, "h1", 14);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 15)(17, "h2", 16);
    \u0275\u0275text(18, "Product information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 17);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 15)(23, "h3", 16);
    \u0275\u0275text(24, "Reviews");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 18)(26, "div", 18);
    \u0275\u0275repeaterCreate(27, ProductsDetailsPage_Conditional_3_For_28_Template, 2, 0, ":svg:svg", 19, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "p", 16);
    \u0275\u0275text(30, "5 out of 5 stars");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "a", 20);
    \u0275\u0275text(32, "Ver rese\xF1as");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 21)(34, "h3", 16);
    \u0275\u0275text(35, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p", 22);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 23)(39, "h3", 24);
    \u0275\u0275text(40, "Caracter\xEDsticas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 25)(42, "ul", 26)(43, "li");
    \u0275\u0275text(44, "Garant\xEDa: 3 meses");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(45, ProductsDetailsPage_Conditional_3_Conditional_45_Template, 2, 1, "li");
    \u0275\u0275elementStart(46, "li");
    \u0275\u0275text(47, "Env\xEDo a todo el pa\xEDs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "li");
    \u0275\u0275text(49, "Stock disponible");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(50, "form", 27)(51, "button", 28);
    \u0275\u0275listener("click", function ProductsDetailsPage_Conditional_3_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addToCart());
    });
    \u0275\u0275element(52, "i", 29);
    \u0275\u0275text(53, " Agregar al Carrito ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "button", 30);
    \u0275\u0275listener("click", function ProductsDetailsPage_Conditional_3_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleFavorite());
    });
    \u0275\u0275element(55, "i", 31);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 32)(58, "div", 33)(59, "div", 34);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(60, "svg", 35);
    \u0275\u0275element(61, "path", 36);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(62, "div", 37)(63, "p", 38)(64, "span", 39);
    \u0275\u0275text(65, "Armado y despacho de pedidos 24hs/48hs.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(66, " Avisar antes de pasar por el local. ");
    \u0275\u0275elementStart(67, "a", 40);
    \u0275\u0275text(68, "AGENDA EL Whatsapp: 5491125960900");
    \u0275\u0275elementEnd();
    \u0275\u0275text(69, " Y MANDANOS UN MSJ PARA QUE PUEDAS VER PROMOCIONES DEL DIA, DESCUENTO, SORTEOS Y MAS!!! ");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.searchQuery);
    \u0275\u0275advance(3);
    \u0275\u0275property("items", ctx_r1.breadcrumbItems());
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.selectedImage() ? 10 : 11);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.product().gallery_urls && ctx_r1.product().gallery_urls.length > 0 ? 12 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.product().name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(21, 21, ctx_r1.product().price, "1.0-0"));
    \u0275\u0275advance(7);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(24, _c0));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.product().description || "Sin descripci\xF3n detallada.");
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r1.product().sku ? 45 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275classProp("border-red-500", ctx_r1.isFavorite())("text-red-600", ctx_r1.isFavorite())("bg-red-50", ctx_r1.isFavorite());
    \u0275\u0275advance();
    \u0275\u0275classProp("fas", ctx_r1.isFavorite())("far", !ctx_r1.isFavorite())("text-red-600", ctx_r1.isFavorite());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isFavorite() ? "Quitar de Favoritos" : "Agregar a Favoritos", " ");
  }
}
var ProductsDetailsPage = class _ProductsDetailsPage {
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  location = inject(Location);
  fallbackService = inject(FallbackService);
  seoService = inject(SeoService);
  document = inject(DOCUMENT);
  breadcrumbItems = computed(() => {
    const product = this.product();
    const category = this.categoryRs.value();
    const items = [
      { label: "Inicio", url: "/" },
      { label: "Productos", url: "/productos" }
    ];
    if (category) {
      items.push({ label: category.name, url: `/productos/categoria/${category.slug}` });
    }
    if (product) {
      items.push({ label: product.name });
    }
    return items;
  }, ...ngDevMode ? [{ debugName: "breadcrumbItems" }] : []);
  productRs = rxResource({
    stream: () => combineLatest([
      this.route.params.pipe(map(({ productSlug }) => productSlug)),
      this.route.queryParams.pipe(map((params) => +params["_page"] || 1))
    ]).pipe(switchMap(([slug]) => {
      return this.productService.getData({
        _page: 1,
        slug
      }).pipe(map((response) => {
        const fallbackItem = this.fallbackService.getFallbackProduct(slug);
        if ((!response.data || response.data.length === 0) && fallbackItem) {
          const fallbackResponse = {
            data: [fallbackItem],
            items: 1,
            pages: 1,
            first: 1,
            last: 1,
            prev: void 0,
            next: void 0
          };
          return fallbackResponse;
        }
        return response;
      }));
    }))
  });
  // Computed para obtener el producto individual
  product = computed(() => {
    const data = this.productRs.value();
    if (!data || !data.data || data.data.length === 0)
      return null;
    return data.data[0];
  }, ...ngDevMode ? [{ debugName: "product" }] : []);
  // Signal for the currently selected image to display
  selectedImage = signal(null, ...ngDevMode ? [{ debugName: "selectedImage" }] : []);
  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        if (!this.selectedImage()) {
          this.selectedImage.set(product.image_url || null);
        }
        this.seoService.setPageData({
          title: product.name,
          description: product.description || `Compra ${product.name} en Arecofix`,
          imageUrl: product.image_url,
          type: "product"
        });
        const script = this.document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.image_url ? [`https://arecofix.com.ar${product.image_url}`] : [],
          "description": product.description || `Compra ${product.name} en Arecofix`,
          "brand": {
            "@type": "Brand",
            "name": "Arecofix"
          },
          "sku": product.sku || product.id,
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "ARS",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Arecofix"
            }
          }
        });
        this.document.head.appendChild(script);
      }
    });
  }
  selectImage(image) {
    this.selectedImage.set(image);
  }
  injector = inject(Injector);
  categoryRs = rxResource({
    stream: () => toObservable(this.product, { injector: this.injector }).pipe(switchMap((product) => {
      if (!product)
        return of(null);
      return this.categoryService.getById(product.category_id);
    }))
  });
  // Método para volver atrás
  goBack() {
    this.location.back();
  }
  cartService = inject(CartService);
  favoritesService = inject(FavoritesService);
  isFavorite = computed(() => {
    const product = this.product();
    if (!product)
      return false;
    return this.favoritesService.isFavorite(product.id);
  }, ...ngDevMode ? [{ debugName: "isFavorite" }] : []);
  toggleFavorite() {
    const product = this.product();
    if (product) {
      this.favoritesService.toggleFavorite(product);
    }
  }
  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
  shareProduct() {
    const product = this.product();
    if (!product)
      return;
    const shareData = {
      title: product.name,
      text: `Mira este producto: ${product.name}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert("Enlace copiado al portapapeles!")).catch((err) => console.error("Error copying to clipboard:", err));
    }
  }
  searchQuery = "";
  router = inject(Router);
  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/products/all"], { queryParams: { q: this.searchQuery } });
    }
  }
  static \u0275fac = function ProductsDetailsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductsDetailsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductsDetailsPage, selectors: [["app-products-details-page"]], decls: 4, vars: 1, consts: [[1, "bg-white", "dark:bg-gray-900", "pt-6"], [1, "container", "mx-auto", "px-4", "lg:px-8", "mt-4", "mb-4", "flex", "justify-end"], [1, "relative", "w-full", "max-w-xs"], ["type", "text", "placeholder", "Buscar producto...", 1, "input", "input-bordered", "w-full", "pl-10", "h-10", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "btn", "btn-ghost", "btn-xs", "btn-circle", 3, "click"], [1, "fas", "fa-search", "text-gray-400"], [3, "items"], [1, "mx-auto", "mt-6", "max-w-2xl", "px-4", "sm:px-6", "lg:max-w-7xl", "lg:px-8", "lg:grid", "lg:grid-cols-2", "lg:gap-x-8"], [1, "lg:max-w-lg", "lg:self-end"], [1, "w-full", "aspect-square", "overflow-hidden", "rounded-lg", "bg-gray-100", "dark:bg-gray-800", "flex", "items-center", "justify-center", "relative"], ["fill", "", 1, "object-contain", "object-center", "max-h-full", "max-w-full", 3, "ngSrc", "alt", "priority"], ["src", "assets/img/no-image.png", 1, "object-contain", "object-center", "max-h-full", "max-w-full", 3, "alt"], [1, "mt-4", "grid", "grid-cols-4", "gap-4"], [1, "mt-10", "px-4", "sm:mt-16", "sm:px-0", "lg:mt-0"], [1, "text-3xl", "font-bold", "tracking-tight", "text-gray-900", "dark:text-white"], [1, "mt-3"], [1, "sr-only"], [1, "text-3xl", "tracking-tight", "text-gray-900", "dark:text-white", "font-bold"], [1, "flex", "items-center"], ["viewBox", "0 0 20 20", "fill", "currentColor", "aria-hidden", "true", 1, "size-5", "shrink-0", "text-yellow-500"], ["href", "#", 1, "ml-3", "text-sm", "font-medium", "text-indigo-600", "hover:text-indigo-500", "dark:text-indigo-400"], [1, "mt-6"], [1, "text-base", "text-gray-700", "dark:text-gray-300"], [1, "mt-10", "border-t", "border-gray-200", "dark:border-gray-700", "pt-10"], [1, "text-sm", "font-medium", "text-gray-900", "dark:text-white"], [1, "mt-4", "prose", "prose-sm", "text-gray-500", "dark:text-gray-400"], ["role", "list"], [1, "mt-10"], ["type", "button", 1, "flex", "w-full", "items-center", "justify-center", "rounded-md", "border", "border-transparent", "bg-indigo-600", "px-8", "py-3", "text-base", "font-medium", "text-white", "hover:bg-indigo-700", "focus:ring-2", "focus:ring-indigo-500", "focus:ring-offset-2", "focus:outline-hidden", "cursor-pointer", "hover:shadow-lg", "hover:scale-[1.02]", "transition-all", "duration-200", 3, "click"], [1, "fas", "fa-shopping-cart", "mr-2"], ["type", "button", 1, "mt-4", "flex", "w-full", "items-center", "justify-center", "rounded-md", "border", "border-gray-300", "dark:border-gray-600", "bg-transparent", "px-8", "py-3", "text-base", "font-medium", "text-gray-900", "dark:text-gray-300", "hover:bg-gray-50", "dark:hover:bg-gray-800", "cursor-pointer", "transition-colors", 3, "click"], [1, "mr-2", "fa-heart"], [1, "mt-8", "bg-blue-50", "dark:bg-blue-900/20", "border-l-4", "border-blue-500", "p-4", "rounded-r-lg"], [1, "flex"], [1, "shrink-0"], ["viewBox", "0 0 20 20", "fill", "currentColor", 1, "h-5", "w-5", "text-blue-400"], ["fill-rule", "evenodd", "d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", "clip-rule", "evenodd"], [1, "ml-3"], [1, "text-sm", "text-blue-700", "dark:text-blue-200"], [1, "font-bold"], ["href", "https://wa.me/5491125960900", "target", "_blank", 1, "font-bold", "underline", "hover:text-blue-600"], ["type", "button", 1, "aspect-square", "rounded-lg", "overflow-hidden", "bg-gray-100", "dark:bg-gray-800", "relative", "cursor-pointer", "hover:opacity-75", "transition-opacity", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "w-full", "block", 3, "ring-2", "ring-indigo-500"], ["type", "button", 1, "aspect-square", "rounded-lg", "overflow-hidden", "bg-gray-100", "dark:bg-gray-800", "relative", "cursor-pointer", "hover:opacity-75", "transition-opacity", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "w-full", "block", 3, "click"], ["fill", "", 1, "object-cover", "object-center", "pointer-events-none", 3, "ngSrc", "alt"], ["fill-rule", "evenodd", "d", "M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z", "clip-rule", "evenodd"]], template: function ProductsDetailsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ProductsDetailsPage_Conditional_0_Template, 1, 0, "is-loading")(1, ProductsDetailsPage_Conditional_1_Template, 1, 0, "is-empty")(2, ProductsDetailsPage_Conditional_2_Template, 1, 0, "is-error")(3, ProductsDetailsPage_Conditional_3_Template, 70, 25, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.productRs.isLoading() ? 0 : !ctx.productRs.hasValue() ? 1 : ctx.productRs.error() ? 2 : ctx.productRs.hasValue() ? 3 : -1);
    }
  }, dependencies: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    NgOptimizedImage,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    RouterModule,
    BreadcrumbsComponent,
    CommonModule,
    DecimalPipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductsDetailsPage, [{
    type: Component,
    args: [{ selector: "app-products-details-page", imports: [
      IsEmptyComponent,
      IsErrorComponent,
      IsLoadingComponent,
      NgOptimizedImage,
      FormsModule,
      RouterModule,
      BreadcrumbsComponent,
      CommonModule
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (productRs.isLoading()) {\r
<is-loading />\r
} @else if (!productRs.hasValue()) {\r
<is-empty />\r
} @else if (productRs.error()) {\r
<is-error />\r
} @else if (productRs.hasValue()) {\r
\r
    <!-- Product Details Page (Redesigned) -->\r
    <div class="bg-white dark:bg-gray-900 pt-6">\r
\r
     <div class="container mx-auto px-4 lg:px-8 mt-4 mb-4 flex justify-end">\r
          <div class="relative w-full max-w-xs">\r
              <input \r
                  type="text" \r
                  placeholder="Buscar producto..." \r
                  [(ngModel)]="searchQuery"\r
                  (keyup.enter)="onSearch()"\r
                  class="input input-bordered w-full pl-10 h-10" />\r
              <button (click)="onSearch()" class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle">\r
                  <i class="fas fa-search text-gray-400"></i>\r
              </button>\r
          </div>\r
      </div>\r
\r
      <app-breadcrumbs [items]="breadcrumbItems()"></app-breadcrumbs>\r
\r
      <!-- Main Layout Grid -->\r
      <div class="mx-auto mt-6 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">\r
        \r
        <!-- Image Gallery (Left Column) -->\r
        <div class="lg:max-w-lg lg:self-end">\r
             <div class="w-full aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">\r
                @if(selectedImage()) {\r
                  <img [ngSrc]="selectedImage()!" [alt]="product()!.name" class="object-contain object-center max-h-full max-w-full" fill [priority]="true"/>\r
                } @else {\r
                  <img src="assets/img/no-image.png" [alt]="product()!.name" class="object-contain object-center max-h-full max-w-full" />\r
                }\r
             </div>\r
             \r
             <!-- Thumbnails / Gallery Grid -->\r
             @if (product()!.gallery_urls && product()!.gallery_urls!.length > 0) {\r
              <div class="mt-4 grid grid-cols-4 gap-4">\r
                  @for(img of product()!.gallery_urls; track img) {\r
                   <button \r
                      type="button"\r
                      class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative cursor-pointer hover:opacity-75 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full block"\r
                      [class.ring-2]="selectedImage() === img"\r
                      [class.ring-indigo-500]="selectedImage() === img"\r
                      (click)="selectImage(img)">\r
                      <img [ngSrc]="img" [alt]="product()!.name" class="object-cover object-center pointer-events-none" fill />\r
                   </button>\r
                  }\r
              </div>\r
             }\r
        </div>\r
\r
        <!-- Product Info (Right Column) -->\r
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">\r
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ product()!.name }}</h1>\r
          \r
          <div class="mt-3">\r
             <h2 class="sr-only">Product information</h2>\r
             <p class="text-3xl tracking-tight text-gray-900 dark:text-white font-bold">\${{ product()!.price | number:'1.0-0' }}</p>\r
          </div>\r
\r
          <!-- Reviews -->\r
          <div class="mt-3">\r
             <h3 class="sr-only">Reviews</h3>\r
             <div class="flex items-center">\r
               <div class="flex items-center">\r
                  @for(star of [1,2,3,4,5]; track star) {\r
                   <svg class="size-5 shrink-0 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">\r
                     <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />\r
                   </svg>\r
                  }\r
               </div>\r
               <p class="sr-only">5 out of 5 stars</p>\r
               <a href="#" class="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Ver rese\xF1as</a>\r
             </div>\r
          </div>\r
\r
          <div class="mt-6">\r
            <h3 class="sr-only">Description</h3>\r
            <p class="text-base text-gray-700 dark:text-gray-300">{{ product()!.description || 'Sin descripci\xF3n detallada.' }}</p>\r
          </div>\r
\r
          <!-- Features -->\r
           <div class="mt-10 border-t border-gray-200 dark:border-gray-700 pt-10">\r
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Caracter\xEDsticas</h3>\r
              <div class="mt-4 prose prose-sm text-gray-500 dark:text-gray-400">\r
                <ul role="list">\r
                  <li>Garant\xEDa: 3 meses</li>\r
                  @if(product()!.sku) { <li>SKU: {{ product()!.sku }}</li> }\r
                  <li>Env\xEDo a todo el pa\xEDs</li>\r
                  <li>Stock disponible</li>\r
                </ul>\r
              </div>\r
           </div>\r
\r
           <!-- Actions -->\r
           <form class="mt-10">\r
              <button type="button" (click)="addToCart()" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200">\r
                <i class="fas fa-shopping-cart mr-2"></i> Agregar al Carrito\r
              </button>\r
              <button type="button" (click)="toggleFavorite()" class="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-8 py-3 text-base font-medium text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" [class.border-red-500]="isFavorite()" [class.text-red-600]="isFavorite()" [class.bg-red-50]="isFavorite()">\r
                 <i class="mr-2 fa-heart" [class.fas]="isFavorite()" [class.far]="!isFavorite()" [class.text-red-600]="isFavorite()"></i> \r
                 {{ isFavorite() ? 'Quitar de Favoritos' : 'Agregar a Favoritos' }}\r
              </button>\r
           </form>\r
\r
           <!-- Shipping & Contact Info -->\r
           <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">\r
                <div class="flex">\r
                  <div class="shrink-0">\r
                    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">\r
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />\r
                    </svg>\r
                  </div>\r
                  <div class="ml-3">\r
                    <p class="text-sm text-blue-700 dark:text-blue-200">\r
                      <span class="font-bold">Armado y despacho de pedidos 24hs/48hs.</span> Avisar antes de pasar por el local. \r
                      <a href="https://wa.me/5491125960900" target="_blank" class="font-bold underline hover:text-blue-600">AGENDA EL Whatsapp: 5491125960900</a> Y MANDANOS UN MSJ PARA QUE PUEDAS VER PROMOCIONES DEL DIA, DESCUENTO, SORTEOS Y MAS!!!\r
                    </p>\r
                  </div>\r
                </div>\r
           </div>\r
        </div>\r
\r
      </div>\r
    </div>\r
}` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductsDetailsPage, { className: "ProductsDetailsPage", filePath: "src/app/public/products/pages/details/products-details-page.ts", lineNumber: 48 });
})();
var products_details_page_default = ProductsDetailsPage;
export {
  ProductsDetailsPage,
  products_details_page_default as default
};
//# sourceMappingURL=chunk-AOAQC2SQ.js.map
