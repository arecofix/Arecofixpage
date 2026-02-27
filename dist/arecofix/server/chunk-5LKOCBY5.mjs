import './polyfills.server.mjs';
import {
  ProductCard
} from "./chunk-JZP2RKNE.mjs";
import "./chunk-PBT4ODLM.mjs";
import {
  ProductService
} from "./chunk-XXWNFGFG.mjs";
import {
  CartService
} from "./chunk-YF4HGWJS.mjs";
import {
  BrandRepository
} from "./chunk-XL3PKKWP.mjs";
import "./chunk-GHI7DVCX.mjs";
import "./chunk-XSIYETXB.mjs";
import {
  SeoService
} from "./chunk-3LSO3424.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-EBVHUSN7.mjs";
import {
  CategoryService
} from "./chunk-5LPXNVZX.mjs";
import {
  PaginationService
} from "./chunk-Z77ZKNJ4.mjs";
import {
  Pagination
} from "./chunk-SHK6HTUA.mjs";
import {
  rxResource
} from "./chunk-ZN3EUKNX.mjs";
import "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  CurrencyPipe
} from "./chunk-NQCCIK3J.mjs";
import {
  Component,
  Subject,
  computed,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  inject,
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
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import {
  __objRest
} from "./chunk-TB3YAHZW.mjs";

// src/app/public/repuestos/repuestos.ts
var _c0 = () => [1, 2, 3, 4, 5, 6, 7, 8];
var _forTrack0 = ($index, $item) => $item.id;
function RepuestosComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Mostrando ");
    \u0275\u0275elementStart(1, "span", 71);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " repuestos ");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.items);
  }
}
function RepuestosComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cargando cat\xE1logo... ");
  }
}
function RepuestosComponent_Conditional_57_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 72);
  }
}
function RepuestosComponent_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275repeaterCreate(1, RepuestosComponent_Conditional_57_For_2_Template, 1, 0, "div", 72, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function RepuestosComponent_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "i", 73);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.initError() || "Hubo un problema al cargar los repuestos.");
  }
}
function RepuestosComponent_Conditional_59_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 74)(1, "div", 75);
    \u0275\u0275element(2, "i", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 56);
    \u0275\u0275text(4, "Sin resultados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 77);
    \u0275\u0275text(6, "No encontramos repuestos con esos criterios.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 78);
    \u0275\u0275listener("click", function RepuestosComponent_Conditional_59_Conditional_0_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.applyFilter("category", "all");
      return \u0275\u0275resetView(ctx_r0.onSearch(""));
    });
    \u0275\u0275text(8, "Ver todo");
    \u0275\u0275elementEnd()();
  }
}
function RepuestosComponent_Conditional_59_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "product-card", 82);
    \u0275\u0275listener("quickView", function RepuestosComponent_Conditional_59_Conditional_1_For_2_Template_product_card_quickView_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openQuickView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const product_r4 = ctx.$implicit;
    const \u0275$index_139_r5 = ctx.$index;
    \u0275\u0275property("product", product_r4)("isPriority", \u0275$index_139_r5 < 4);
  }
}
function RepuestosComponent_Conditional_59_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81);
    \u0275\u0275element(1, "pagination", 83);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("pages", ((tmp_3_0 = ctx_r0.productsRs.value()) == null ? null : tmp_3_0.pages) || 0)("currentPage", ctx_r0.paginationService.currentPage() || 1);
  }
}
function RepuestosComponent_Conditional_59_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79);
    \u0275\u0275repeaterCreate(1, RepuestosComponent_Conditional_59_Conditional_1_For_2_Template, 1, 2, "product-card", 80, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, RepuestosComponent_Conditional_59_Conditional_1_Conditional_3_Template, 2, 2, "div", 81);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater((tmp_2_0 = ctx_r0.productsRs.value()) == null ? null : tmp_2_0.data);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.paginationData() ? 3 : -1);
  }
}
function RepuestosComponent_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, RepuestosComponent_Conditional_59_Conditional_0_Template, 9, 0, "div", 74)(1, RepuestosComponent_Conditional_59_Conditional_1_Template, 4, 1);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.productsRs.value()) == null ? null : tmp_1_0.data == null ? null : tmp_1_0.data.length) === 0 ? 0 : 1);
  }
}
function RepuestosComponent_For_129_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "button", 61);
    \u0275\u0275listener("click", function RepuestosComponent_For_129_Template_button_click_1_listener() {
      const c_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.applyFilter("category", c_r7.id));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r0.currentCategory() === c_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r7.name, " ");
  }
}
function RepuestosComponent_For_137_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 64);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r8 = ctx.$implicit;
    \u0275\u0275property("value", b_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r8.name);
  }
}
function RepuestosComponent_Conditional_148_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 91);
    \u0275\u0275text(1, "Sin Stock");
    \u0275\u0275elementEnd();
  }
}
function RepuestosComponent_Conditional_148_Conditional_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 97);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, p_r11.regular_price));
  }
}
function RepuestosComponent_Conditional_148_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 86)(1, "div", 89);
    \u0275\u0275element(2, "img", 90);
    \u0275\u0275conditionalCreate(3, RepuestosComponent_Conditional_148_Conditional_4_Conditional_3_Template, 2, 0, "span", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 92)(5, "div", 93)(6, "h3", 94);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 95)(9, "span", 96);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, RepuestosComponent_Conditional_148_Conditional_4_Conditional_12_Template, 3, 3, "span", 97);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 98);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 99)(16, "span", 100);
    \u0275\u0275element(17, "i", 101);
    \u0275\u0275text(18, " Garant\xEDa 30 d\xEDas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 100);
    \u0275\u0275element(20, "i", 102);
    \u0275\u0275text(21, " Env\xEDo Full");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "button", 103);
    \u0275\u0275listener("click", function RepuestosComponent_Conditional_148_Conditional_4_Template_button_click_22_listener() {
      const p_r11 = \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.addToCart(p_r11));
    });
    \u0275\u0275element(23, "i", 104);
    \u0275\u0275text(24, " Agregar al Carrito ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r11 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", p_r11.image_url || "assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", p_r11.name);
    \u0275\u0275advance();
    \u0275\u0275conditional((p_r11.stock ?? 0) <= 0 ? 3 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r11.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 7, p_r11.price));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r11.regular_price && p_r11.regular_price > p_r11.price ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r11.description || "Repuesto original garantizado.");
  }
}
function RepuestosComponent_Conditional_148_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 70)(1, "div", 84)(2, "button", 85);
    \u0275\u0275listener("click", function RepuestosComponent_Conditional_148_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, RepuestosComponent_Conditional_148_Conditional_4_Template, 25, 9, "div", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "form", 87)(6, "button", 88);
    \u0275\u0275listener("click", function RepuestosComponent_Conditional_148_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeQuickView());
    });
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.quickViewProduct()) ? 4 : -1, tmp_1_0);
  }
}
var RepuestosComponent = class _RepuestosComponent {
  whatsappNumber = environment.contact.whatsappNumber;
  router = inject(Router);
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  brandRepo = inject(BrandRepository);
  cartService = inject(CartService);
  seoService = inject(SeoService);
  paginationService = inject(PaginationService);
  // Initial Data State
  categories = signal([], ...ngDevMode ? [{ debugName: "categories" }] : []);
  brands = signal([], ...ngDevMode ? [{ debugName: "brands" }] : []);
  repuestosCategoryIds = signal([], ...ngDevMode ? [{ debugName: "repuestosCategoryIds" }] : []);
  // The core "Repuestos" definition
  repuestosRootId = signal(null, ...ngDevMode ? [{ debugName: "repuestosRootId" }] : []);
  isInitialized = signal(false, ...ngDevMode ? [{ debugName: "isInitialized" }] : []);
  initError = signal(null, ...ngDevMode ? [{ debugName: "initError" }] : []);
  // Search Logic (Debounced navigation)
  searchSubject = new Subject();
  // UI Signals
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  routeParams = signal({}, ...ngDevMode ? [{ debugName: "routeParams" }] : []);
  currentCategory = computed(() => this.routeParams()["category"] || "all", ...ngDevMode ? [{ debugName: "currentCategory" }] : []);
  currentBrand = computed(() => this.routeParams()["brand"] || "all", ...ngDevMode ? [{ debugName: "currentBrand" }] : []);
  currentMaxPrice = computed(() => this.routeParams()["price"] || null, ...ngDevMode ? [{ debugName: "currentMaxPrice" }] : []);
  currentSort = computed(() => this.routeParams()["sort"] || "relevance", ...ngDevMode ? [{ debugName: "currentSort" }] : []);
  // Quick View Logic
  isQuickViewOpen = signal(false, ...ngDevMode ? [{ debugName: "isQuickViewOpen" }] : []);
  quickViewProduct = signal(null, ...ngDevMode ? [{ debugName: "quickViewProduct" }] : []);
  // Visible Categories for Sidebar
  visibleCategories = computed(() => {
    const rootId = this.repuestosRootId();
    if (!rootId)
      return [];
    return this.categories().filter((c) => c.parent_id === rootId);
  }, ...ngDevMode ? [{ debugName: "visibleCategories" }] : []);
  constructor() {
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((term) => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: term || null, _page: 1 },
        queryParamsHandling: "merge"
      });
    });
    this.route.queryParams.subscribe((params) => {
      this.routeParams.set(params);
      if (params["search"] !== this.searchQuery()) {
        this.searchQuery.set(params["search"] || "");
      }
    });
  }
  // Resource Stream: Depends on Signals (CategoryIDs) and Route Params
  productsRs = rxResource({
    stream: () => {
      return this.route.queryParams.pipe(
        // 2. Dependency: Ensure Categories are loaded
        switchMap((params) => {
          if (!this.isInitialized())
            return of(null);
          const page = params["_page"] || 1;
          const search = params["search"];
          const categoryId = params["category"];
          const brandId = params["brand"];
          const maxPrice = params["price"];
          const sort = params["sort"];
          const serviceParams = {
            _page: page,
            _per_page: 12,
            _sort: sort === "relevance" ? void 0 : sort?.split("-")[0] || "created_at",
            _order: sort?.split("-")[1] || "desc"
          };
          if (search)
            serviceParams.q = search;
          if (brandId && brandId !== "all")
            serviceParams.brand_id = brandId;
          if (maxPrice)
            serviceParams.max_price = maxPrice;
          if (categoryId && categoryId !== "all") {
            serviceParams.category_ids = this.getAllChildIds(categoryId, this.categories());
          } else {
            serviceParams.category_ids = this.repuestosCategoryIds();
          }
          if (!serviceParams.category_ids || serviceParams.category_ids.length === 0) {
            return of({ data: [], items: 0, pages: 0, first: 1, last: 1 });
          }
          return this.productService.getData(serviceParams);
        })
      );
    }
  });
  paginationData = computed(() => {
    const data = this.productsRs.value();
    if (!data)
      return null;
    if (!("data" in data))
      return null;
    const _a = data, { data: products } = _a, pagination = __objRest(_a, ["data"]);
    return pagination;
  }, ...ngDevMode ? [{ debugName: "paginationData" }] : []);
  async ngOnInit() {
    this.seoService.setPageData({
      title: "Repuestos para Celulares - Mayorista y Minorista",
      description: "Encontr\xE1 todos los repuestos para tu celular: M\xF3dulos, Pantallas, Bater\xEDas, Pines de Carga y Herramientas. Env\xEDos a todo el pa\xEDs.",
      imageUrl: "assets/img/hero-illustration.svg"
    });
    await this.loadCategories();
    await this.loadBrands();
  }
  onSearch(term) {
    this.searchQuery.set(term);
    this.searchSubject.next(term);
  }
  applyFilter(type, value) {
    const queryParams = { _page: 1 };
    queryParams[type] = value === "all" ? null : value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge"
    });
  }
  openQuickView(product) {
    this.quickViewProduct.set(product);
    this.isQuickViewOpen.set(true);
  }
  closeQuickView() {
    this.isQuickViewOpen.set(false);
    this.quickViewProduct.set(null);
  }
  addToCart(product) {
    this.cartService.addToCart(product);
    this.closeQuickView();
  }
  async loadCategories() {
    this.categoryService.getData({ _page: 1, _per_page: 500 }).subscribe((res) => {
      const allCategories = res.data;
      this.categories.set(allCategories);
      const keywords = [
        "repuesto",
        "modulo",
        "m\xF3dulo",
        "bateria",
        "bater\xEDa",
        "display",
        "screen",
        "pantalla",
        "glass",
        "tapa",
        "flex",
        "pin",
        "carga",
        "auricular",
        "microfono",
        "micr\xF3fono",
        "camara",
        "c\xE1mara",
        "lente",
        "touch",
        "vidrio",
        "bandeja",
        "sim",
        "buzzer",
        "speaker",
        "altavoz",
        "parlante",
        "vibrador",
        "sensor",
        "boton",
        "tecla",
        "home",
        "volumen",
        "power"
      ];
      const relevantCategories = allCategories.filter((c) => keywords.some((k) => c.name.toLowerCase().includes(k) || c.slug.toLowerCase().includes(k)));
      let repuestosCat = allCategories.find((c) => c.slug.toLowerCase() === "repuestos");
      if (!repuestosCat && relevantCategories.length > 0)
        repuestosCat = relevantCategories[0];
      if (relevantCategories.length > 0) {
        let allIds = /* @__PURE__ */ new Set();
        relevantCategories.forEach((cat) => {
          allIds.add(cat.id);
          const treeIds = this.getAllChildIds(cat.id, allCategories);
          treeIds.forEach((id) => allIds.add(id));
        });
        this.repuestosRootId.set(repuestosCat?.id || null);
        this.repuestosCategoryIds.set(Array.from(allIds));
        this.isInitialized.set(true);
        this.productsRs.reload();
      } else {
        this.initError.set("No se encontraron categor\xEDas de repuestos.");
        this.isInitialized.set(true);
      }
    });
  }
  async loadBrands() {
    const brands = await firstValueFrom(this.brandRepo.getAll({ column: "name", ascending: true }));
    this.brands.set(brands);
  }
  getAllChildIds(parentId, allCategories) {
    let ids = [parentId];
    const children = allCategories.filter((c) => c.parent_id === parentId);
    children.forEach((child) => {
      ids = [...ids, ...this.getAllChildIds(child.id, allCategories)];
    });
    return ids;
  }
  static \u0275fac = function RepuestosComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RepuestosComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RepuestosComponent, selectors: [["app-repuestos"]], decls: 149, vars: 13, consts: [[1, "drawer", "lg:drawer-open"], ["id", "repuestos-filter-drawer", "type", "checkbox", 1, "drawer-toggle"], [1, "drawer-content", "flex", "flex-col", "min-h-screen", "bg-gray-50", "dark:bg-gray-900", "transition-colors", "duration-300"], [1, "relative", "bg-gray-900", "text-white", "overflow-hidden", "isolate"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-blue-900", "to-indigo-900", "opacity-80"], [1, "absolute", "-top-24", "-left-24", "w-96", "h-96", "bg-blue-500", "rounded-full", "mix-blend-multiply", "filter", "blur-3xl", "opacity-20", "animate-blob"], [1, "absolute", "top-0", "-right-4", "w-72", "h-72", "bg-purple-500", "rounded-full", "mix-blend-multiply", "filter", "blur-3xl", "opacity-20", "animate-blob", "animation-delay-2000"], [1, "relative", "container", "mx-auto", "px-4", "py-16", "text-center"], [1, "text-sm", "breadcrumbs", "text-blue-200", "justify-center", "mb-6", "flex"], ["routerLink", "/"], ["routerLink", "/productos"], [1, "font-semibold", "text-white"], [1, "text-4xl", "md:text-5xl", "font-black", "mb-6", "tracking-tight"], [1, "text-blue-400"], [1, "text-lg", "md:text-xl", "text-gray-300", "max-w-3xl", "mx-auto", "mb-10", "leading-relaxed", "font-light"], [1, "hidden", "md:block"], [1, "max-w-2xl", "mx-auto", "relative", "group", "z-20"], [1, "absolute", "-inset-1", "bg-linear-to-r", "from-blue-500", "to-purple-600", "rounded-full", "blur", "opacity-25", "group-hover:opacity-75", "transition", "duration-1000", "group-hover:duration-200"], [1, "relative", "flex", "items-center", "bg-white", "dark:bg-gray-800", "rounded-full", "shadow-2xl", "overflow-hidden"], [1, "pl-6", "text-gray-400"], [1, "fas", "fa-search", "text-lg"], ["type", "text", "placeholder", "Buscar repuesto (ej: M\xF3dulo iPhone 11)...", 1, "w-full", "bg-transparent", "border-none", "text-gray-900", "dark:text-white", "placeholder-gray-500", "px-4", "py-5", "focus:ring-0", "text-lg", "mobile-search-input", 3, "ngModelChange", "ngModel"], [1, "hidden", "sm:block", "mr-2", "px-6", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-full", "font-bold", "transition-colors"], [1, "flex-1", "container", "mx-auto", "px-4", "py-12"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-center", "mb-8", "pb-4", "border-b", "border-gray-200", "dark:border-gray-800", "gap-4"], [1, "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "gap-4"], [1, "text-gray-600", "dark:text-gray-400", "font-medium", "text-sm"], ["for", "repuestos-filter-drawer", 1, "btn", "btn-sm", "btn-outline", "rounded-full", "w-full", "sm:w-auto", "lg:hidden"], [1, "fas", "fa-sliders-h", "mr-2"], [1, "flex", "items-center", "gap-3", "w-full", "sm:w-auto", "overflow-x-auto", "pb-1", "sm:pb-0"], [1, "flex", "gap-2", "mr-4"], [1, "btn", "btn-sm", "rounded-full", 3, "click"], [1, "select", "select-bordered", "select-sm", "rounded-full", "bg-white", "dark:bg-gray-800", "border-gray-300", "dark:border-gray-700", "focus:border-blue-500", "focus:ring-blue-500", "min-w-[180px]", 3, "ngModelChange", "ngModel"], ["value", "relevance"], ["value", "price-asc"], ["value", "price-desc"], ["value", "created_at-desc"], [1, "min-h-[400px]"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-6"], [1, "alert", "alert-error"], [1, "bg-gray-100", "dark:bg-gray-900/50", "py-16", "border-t", "border-gray-200", "dark:border-gray-800"], [1, "container", "mx-auto", "px-4"], [1, "grid", "md:grid-cols-3", "gap-8", "text-center", "md:text-left", "mb-16"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "fas", "fa-tools", "text-blue-500", "mr-2"], [1, "text-sm", "text-gray-500"], [1, "fas", "fa-globe-americas", "text-blue-500", "mr-2"], [1, "fas", "fa-medal", "text-blue-500", "mr-2"], [1, "prose", "prose-sm", "dark:prose-invert", "max-w-none", "text-gray-500", "dark:text-gray-400", "border-t", "border-gray-200", "dark:border-gray-800", "pt-10"], [1, "text-2xl", "font-bold", "text-gray-800", "dark:text-gray-200", "mb-4"], [1, "grid", "md:grid-cols-2", "gap-8", "mt-6"], [1, "text-lg", "font-semibold", "text-gray-800", "dark:text-gray-200", "mb-2"], [1, "drawer-side", "z-40"], ["for", "repuestos-filter-drawer", "aria-label", "close sidebar", 1, "drawer-overlay", "backdrop-blur-sm"], [1, "menu", "p-6", "w-80", "min-h-full", "bg-white", "dark:bg-gray-800", "text-base-content", "border-r", "border-gray-200", "dark:border-gray-700"], [1, "flex", "justify-between", "items-center", "mb-8"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white"], ["for", "repuestos-filter-drawer", 1, "btn", "btn-sm", "btn-circle", "btn-ghost"], [1, "space-y-6"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-3", "text-sm", "uppercase", "tracking-wider"], [1, "menu", "bg-base-100", "w-full", "p-0", "gap-1"], [1, "rounded-lg", 3, "click"], [1, "select", "select-bordered", "w-full", "bg-white", "dark:bg-gray-700", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], [1, "relative"], [1, "absolute", "left-3", "top-3", "text-gray-400"], ["type", "number", "min", "0", "placeholder", "Ej: 50.000", 1, "input", "input-bordered", "w-full", "pl-8", "bg-white", "dark:bg-gray-700", 3, "ngModelChange", "ngModel"], [1, "pt-4"], [1, "btn", "btn-outline", "w-full", "rounded-full", 3, "click"], [1, "modal", "modal-open", "z-50", "animate-fade-in"], [1, "text-gray-900", "dark:text-white", "font-bold"], [1, "animate-pulse", "bg-gray-200", "dark:bg-gray-800", "rounded-3xl", "h-[350px]", "w-full"], [1, "fas", "fa-exclamation-triangle"], [1, "text-center", "py-20"], [1, "w-20", "h-20", "bg-gray-100", "dark:bg-gray-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4"], [1, "fas", "fa-box-open", "text-3xl", "text-gray-400"], [1, "text-gray-500"], [1, "btn", "btn-link", "text-blue-600", 3, "click"], [1, "grid", "grid-cols-2", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-2", "sm:gap-6"], [3, "product", "isPriority"], [1, "mt-12", "flex", "justify-center"], [3, "quickView", "product", "isPriority"], [3, "pages", "currentPage"], [1, "modal-box", "relative", "max-w-4xl", "bg-white", "dark:bg-gray-800", "rounded-3xl", "p-0", "overflow-hidden", "shadow-2xl"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-4", "top-4", "z-10", "bg-white/50", "backdrop-blur-md", 3, "click"], [1, "flex", "flex-col", "md:flex-row", "h-full"], ["method", "dialog", 1, "modal-backdrop", "bg-black/50", "backdrop-blur-sm"], [3, "click"], [1, "w-full", "md:w-1/2", "bg-gray-50", "dark:bg-gray-700/30", "p-8", "flex", "items-center", "justify-center", "relative"], [1, "max-h-[300px]", "object-contain", "drop-shadow-xl", 3, "src", "alt"], [1, "absolute", "top-8", "left-8", "badge", "badge-error", "text-white", "font-bold", "p-3"], [1, "w-full", "md:w-1/2", "p-8", "flex", "flex-col"], [1, "mb-auto"], [1, "font-black", "text-2xl", "md:text-3xl", "mb-2", "text-gray-900", "dark:text-white", "leading-tight"], [1, "flex", "items-baseline", "gap-3", "mb-6"], [1, "text-4xl", "font-bold", "text-blue-600"], [1, "text-lg", "text-gray-400", "line-through"], [1, "text-gray-600", "dark:text-gray-300", "mb-6", "leading-relaxed"], [1, "flex", "flex-wrap", "gap-2", "mb-8"], [1, "badge", "badge-lg", "badge-outline"], [1, "fas", "fa-shield-check", "mr-2", "text-green-500"], [1, "fas", "fa-truck", "mr-2", "text-blue-500"], [1, "btn", "btn-primary", "btn-lg", "w-full", "rounded-2xl", "shadow-xl", "shadow-blue-600/30", "gap-3", 3, "click"], [1, "fas", "fa-shopping-cart"]], template: function RepuestosComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "input", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "header", 3);
      \u0275\u0275element(4, "div", 4)(5, "div", 5)(6, "div", 6);
      \u0275\u0275elementStart(7, "div", 7)(8, "div", 8)(9, "ul")(10, "li")(11, "a", 9);
      \u0275\u0275text(12, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "li")(14, "a", 10);
      \u0275\u0275text(15, "Productos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "li", 11);
      \u0275\u0275text(17, "Repuestos");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "h1", 12);
      \u0275\u0275text(19, " Repuestos ");
      \u0275\u0275elementStart(20, "span", 13);
      \u0275\u0275text(21, "Profesionales");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "p", 14);
      \u0275\u0275text(23, " La mayor variedad de m\xF3dulos, bater\xEDas y repuestos t\xE9cnicos en Argentina. ");
      \u0275\u0275element(24, "br", 15);
      \u0275\u0275text(25, " Precios especiales para gremio y env\xEDos a todo el pa\xEDs. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 16);
      \u0275\u0275element(27, "div", 17);
      \u0275\u0275elementStart(28, "div", 18)(29, "div", 19);
      \u0275\u0275element(30, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "input", 21);
      \u0275\u0275listener("ngModelChange", function RepuestosComponent_Template_input_ngModelChange_31_listener($event) {
        return ctx.onSearch($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "button", 22);
      \u0275\u0275text(33, " Buscar ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(34, "div", 23)(35, "div", 24)(36, "div", 25)(37, "div", 26);
      \u0275\u0275conditionalCreate(38, RepuestosComponent_Conditional_38_Template, 4, 1)(39, RepuestosComponent_Conditional_39_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "label", 27);
      \u0275\u0275element(41, "i", 28);
      \u0275\u0275text(42, " Filtros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "div", 29)(44, "div", 30)(45, "button", 31);
      \u0275\u0275listener("click", function RepuestosComponent_Template_button_click_45_listener() {
        return ctx.applyFilter("category", "all");
      });
      \u0275\u0275text(46, "Todo");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "select", 32);
      \u0275\u0275listener("ngModelChange", function RepuestosComponent_Template_select_ngModelChange_47_listener($event) {
        return ctx.applyFilter("sort", $event);
      });
      \u0275\u0275elementStart(48, "option", 33);
      \u0275\u0275text(49, "Relevancia");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "option", 34);
      \u0275\u0275text(51, "Precio: Menor a Mayor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "option", 35);
      \u0275\u0275text(53, "Precio: Mayor a Menor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "option", 36);
      \u0275\u0275text(55, "M\xE1s Nuevos");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(56, "main", 37);
      \u0275\u0275conditionalCreate(57, RepuestosComponent_Conditional_57_Template, 3, 1, "div", 38)(58, RepuestosComponent_Conditional_58_Template, 4, 1, "div", 39)(59, RepuestosComponent_Conditional_59_Template, 2, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 40)(61, "div", 41)(62, "div", 42)(63, "div")(64, "h3", 43);
      \u0275\u0275element(65, "i", 44);
      \u0275\u0275text(66, " Para T\xE9cnicos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "p", 45);
      \u0275\u0275text(68, "Accede a precios de gremio exclusivos y soporte t\xE9cnico especializado.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(69, "div")(70, "h3", 43);
      \u0275\u0275element(71, "i", 46);
      \u0275\u0275text(72, " Todo El Pa\xEDs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "p", 45);
      \u0275\u0275text(74, "Env\xEDos asegurados a cualquier punto de Argentina a trav\xE9s de Andreani.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div")(76, "h3", 43);
      \u0275\u0275element(77, "i", 47);
      \u0275\u0275text(78, " Calidad AAA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "p", 45);
      \u0275\u0275text(80, "Seleccionamos los mejores proveedores para garantizar bajas tasas de RMA.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(81, "div", 48)(82, "h2", 49);
      \u0275\u0275text(83, "Repuestos de Celulares en Argentina: Tu Proveedor de Confianza");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "p");
      \u0275\u0275text(85, " Si est\xE1s buscando ");
      \u0275\u0275elementStart(86, "strong");
      \u0275\u0275text(87, "d\xF3nde comprar repuestos de celulares en Buenos Aires");
      \u0275\u0275elementEnd();
      \u0275\u0275text(88, " o necesit\xE1s un proveedor confiable que realice env\xEDos a todo el pa\xEDs, has llegado al lugar indicado. Somos la ");
      \u0275\u0275elementStart(89, "strong");
      \u0275\u0275text(90, "impotadora de repuestos n\xFAmero 1 en Merlo");
      \u0275\u0275elementEnd();
      \u0275\u0275text(91, " y zona oeste, expandi\xE9ndonos como el principal ");
      \u0275\u0275elementStart(92, "strong");
      \u0275\u0275text(93, "mayorista de repuestos oficial para celulares en Marcos Paz");
      \u0275\u0275elementEnd();
      \u0275\u0275text(94, " y alrededores. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(95, "div", 50)(96, "div")(97, "h3", 51);
      \u0275\u0275text(98, "\xBFPor qu\xE9 elegir nuestros repuestos?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "p");
      \u0275\u0275text(100, " Contamos con el stock m\xE1s amplio de ");
      \u0275\u0275elementStart(101, "strong");
      \u0275\u0275text(102, "repuestos para celulares en Argentina");
      \u0275\u0275elementEnd();
      \u0275\u0275text(103, ". Desde m\xF3dulos de pantalla (display + t\xE1ctil), bater\xEDas originales, flex de carga, c\xE1maras, hasta herramientas de precisi\xF3n para t\xE9cnicos. Todos nuestros productos pasan por un riguroso control de calidad para asegurar que tus reparaciones sean duraderas y profesionales. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(104, "div")(105, "h3", 51);
      \u0275\u0275text(106, "Env\xEDos y Distribuci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(107, "p");
      \u0275\u0275text(108, " No importa si est\xE1s en CABA, C\xF3rdoba, Rosario o Tierra del Fuego. Realizamos env\xEDos r\xE1pidos y seguros a todo el territorio nacional. Si busc\xE1s ");
      \u0275\u0275elementStart(109, "strong");
      \u0275\u0275text(110, "repuestos de celulares en Buenos Aires");
      \u0275\u0275elementEnd();
      \u0275\u0275text(111, " con entrega inmediata o env\xEDo en el d\xEDa, consultanos. ");
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(112, "div", 52);
      \u0275\u0275element(113, "label", 53);
      \u0275\u0275elementStart(114, "aside", 54)(115, "div", 55)(116, "h3", 56);
      \u0275\u0275text(117, "Filtrar Repuestos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "label", 57);
      \u0275\u0275text(119, "\u2715");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(120, "div", 58)(121, "div")(122, "h4", 59);
      \u0275\u0275text(123, "Categor\xEDa");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(124, "ul", 60)(125, "li")(126, "button", 61);
      \u0275\u0275listener("click", function RepuestosComponent_Template_button_click_126_listener() {
        return ctx.applyFilter("category", "all");
      });
      \u0275\u0275text(127, " Todas ");
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(128, RepuestosComponent_For_129_Template, 3, 3, "li", null, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(130, "div")(131, "h4", 59);
      \u0275\u0275text(132, "Marca");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(133, "select", 62);
      \u0275\u0275listener("ngModelChange", function RepuestosComponent_Template_select_ngModelChange_133_listener($event) {
        return ctx.applyFilter("brand", $event);
      });
      \u0275\u0275elementStart(134, "option", 63);
      \u0275\u0275text(135, "Todas las Marcas");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(136, RepuestosComponent_For_137_Template, 2, 2, "option", 64, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(138, "div")(139, "h4", 59);
      \u0275\u0275text(140, "Precio M\xE1ximo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(141, "div", 65)(142, "span", 66);
      \u0275\u0275text(143, "$");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(144, "input", 67);
      \u0275\u0275listener("ngModelChange", function RepuestosComponent_Template_input_ngModelChange_144_listener($event) {
        return ctx.applyFilter("price", $event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(145, "div", 68)(146, "button", 69);
      \u0275\u0275listener("click", function RepuestosComponent_Template_button_click_146_listener() {
        ctx.applyFilter("category", "all");
        ctx.applyFilter("brand", "all");
        ctx.applyFilter("price", null);
        return ctx.onSearch("");
      });
      \u0275\u0275text(147, " Limpiar Filtros ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275conditionalCreate(148, RepuestosComponent_Conditional_148_Template, 8, 1, "div", 70);
    }
    if (rf & 2) {
      \u0275\u0275advance(31);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.productsRs.value() ? 38 : 39);
      \u0275\u0275advance(7);
      \u0275\u0275classProp("btn-primary", ctx.currentCategory() === "all")("btn-ghost", ctx.currentCategory() !== "all");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.currentSort());
      \u0275\u0275advance(10);
      \u0275\u0275conditional(!ctx.isInitialized() || ctx.productsRs.isLoading() ? 57 : ctx.productsRs.error() || ctx.initError() ? 58 : ctx.productsRs.value() ? 59 : -1);
      \u0275\u0275advance(69);
      \u0275\u0275classProp("active", ctx.currentCategory() === "all");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.visibleCategories());
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.currentBrand());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.brands());
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.currentMaxPrice());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.isQuickViewOpen() ? 148 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, NgModel, NgForm, ProductCard, Pagination, RouterLink, CurrencyPipe], styles: ["\n\n/*# sourceMappingURL=repuestos.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RepuestosComponent, [{
    type: Component,
    args: [{ selector: "app-repuestos", standalone: true, imports: [CommonModule, FormsModule, ProductCard, Pagination, RouterLink], template: `<!-- Mobile Filter Drawer Wrapper -->\r
<div class="drawer lg:drawer-open">\r
  <input id="repuestos-filter-drawer" type="checkbox" class="drawer-toggle" />\r
  \r
  <div class="drawer-content flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">\r
    <!-- HERO SECTION -->\r
    <header class="relative bg-gray-900 text-white overflow-hidden isolate">\r
       <div class="absolute inset-0 bg-linear-to-r from-blue-900 to-indigo-900 opacity-80"></div>\r
       <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>\r
       <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>\r
\r
       <div class="relative container mx-auto px-4 py-16 text-center">\r
            <!-- Breadcrumbs -->\r
           <div class="text-sm breadcrumbs text-blue-200 justify-center mb-6 flex">\r
                <ul>\r
                <li><a routerLink="/">Inicio</a></li>\r
                <li><a routerLink="/productos">Productos</a></li>\r
                <li class="font-semibold text-white">Repuestos</li>\r
                </ul>\r
            </div>\r
\r
            <h1 class="text-4xl md:text-5xl font-black mb-6 tracking-tight">\r
                Repuestos <span class="text-blue-400">Profesionales</span>\r
            </h1>\r
            <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">\r
                La mayor variedad de m\xF3dulos, bater\xEDas y repuestos t\xE9cnicos en Argentina. <br class="hidden md:block"/> Precios especiales para gremio y env\xEDos a todo el pa\xEDs.\r
            </p>\r
\r
            <!-- Search Bar (Floating) -->\r
            <div class="max-w-2xl mx-auto relative group z-20">\r
                 <div class="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>\r
                 <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl overflow-hidden">\r
                     <div class="pl-6 text-gray-400">\r
                         <i class="fas fa-search text-lg"></i>\r
                     </div>\r
                     <input \r
                         [ngModel]="searchQuery()" \r
                         (ngModelChange)="onSearch($event)" \r
                         type="text" \r
                         placeholder="Buscar repuesto (ej: M\xF3dulo iPhone 11)..." \r
                         class="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 px-4 py-5 focus:ring-0 text-lg mobile-search-input" \r
                     />\r
                     <button class="hidden sm:block mr-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors">\r
                         Buscar\r
                     </button>\r
                 </div>\r
             </div>\r
       </div>\r
    </header>\r
\r
    <!-- Main Content -->\r
     <div class="flex-1 container mx-auto px-4 py-12">\r
         \r
         <!-- Toolbar -->\r
          <div class="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4">\r
             <div class="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">\r
                 <div class="text-gray-600 dark:text-gray-400 font-medium text-sm">\r
                      @if (productsRs.value()) {\r
                         Mostrando <span class="text-gray-900 dark:text-white font-bold">{{ productsRs.value()?.items }}</span> repuestos\r
                       } @else {\r
                         Cargando cat\xE1logo...\r
                       }\r
                 </div>\r
                 \r
                 <label for="repuestos-filter-drawer" class="btn btn-sm btn-outline rounded-full w-full sm:w-auto lg:hidden">\r
                    <i class="fas fa-sliders-h mr-2"></i> Filtros\r
                 </label>\r
             </div>\r
            \r
             <div class="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">\r
                <!-- Badges Filter Quick Access (Optional) -->\r
                <div class="flex gap-2 mr-4">\r
                     <button (click)="applyFilter('category', 'all')" \r
                        [class.btn-primary]="currentCategory() === 'all'"\r
                        [class.btn-ghost]="currentCategory() !== 'all'"\r
                        class="btn btn-sm rounded-full">Todo</button>\r
                </div>\r
\r
                <select [ngModel]="currentSort()" (ngModelChange)="applyFilter('sort', $event)"\r
                    class="select select-bordered select-sm rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 min-w-[180px]">\r
                    <option value="relevance">Relevancia</option>\r
                    <option value="price-asc">Precio: Menor a Mayor</option>\r
                    <option value="price-desc">Precio: Mayor a Menor</option>\r
                    <option value="created_at-desc">M\xE1s Nuevos</option>\r
                </select>\r
            </div>\r
         </div>\r
\r
         <!-- Products Grid -->\r
         <main class="min-h-[400px]">\r
            @if (!isInitialized() || productsRs.isLoading()) {\r
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\r
                    @for(i of [1,2,3,4,5,6,7,8]; track i) {\r
                        <div class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-3xl h-[350px] w-full"></div>\r
                    }\r
                 </div>\r
            } @else if (productsRs.error() || initError()) {\r
                 <div class="alert alert-error">\r
                    <i class="fas fa-exclamation-triangle"></i>\r
                    <span>{{ initError() || 'Hubo un problema al cargar los repuestos.' }}</span>\r
                 </div>\r
            } @else if (productsRs.value()) {\r
                 @if (productsRs.value()?.data?.length === 0) {\r
                     <div class="text-center py-20">\r
                         <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">\r
                             <i class="fas fa-box-open text-3xl text-gray-400"></i>\r
                         </div>\r
                         <h3 class="text-xl font-bold text-gray-900 dark:text-white">Sin resultados</h3>\r
                         <p class="text-gray-500">No encontramos repuestos con esos criterios.</p>\r
                         <button (click)="applyFilter('category', 'all'); onSearch('')" class="btn btn-link text-blue-600">Ver todo</button>\r
                     </div>\r
                 } @else {\r
                     <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">\r
                        @for (product of productsRs.value()?.data; track product.id; let i = $index) {\r
                            <product-card [product]="product" [isPriority]="i < 4" (quickView)="openQuickView($event)"/>\r
                        }\r
                     </div>\r
\r
                     <!-- Pagination -->\r
                      @if (paginationData()) {\r
                        <div class="mt-12 flex justify-center">\r
                          <pagination\r
                            [pages]="productsRs.value()?.pages || 0"\r
                            [currentPage]="paginationService.currentPage() || 1"\r
                          />\r
                        </div>\r
                      }\r
                 }\r
            }\r
         </main>\r
    </div>\r
\r
     <!-- SEO & Info Footer -->\r
    <div class="bg-gray-100 dark:bg-gray-900/50 py-16 border-t border-gray-200 dark:border-gray-800">\r
        <div class="container mx-auto px-4">\r
             <!-- Features Grid -->\r
             <div class="grid md:grid-cols-3 gap-8 text-center md:text-left mb-16">\r
                 <div>\r
                     <h3 class="font-bold text-gray-900 dark:text-white mb-2"><i class="fas fa-tools text-blue-500 mr-2"></i> Para T\xE9cnicos</h3>\r
                     <p class="text-sm text-gray-500">Accede a precios de gremio exclusivos y soporte t\xE9cnico especializado.</p>\r
                 </div>\r
                 <div>\r
                     <h3 class="font-bold text-gray-900 dark:text-white mb-2"><i class="fas fa-globe-americas text-blue-500 mr-2"></i> Todo El Pa\xEDs</h3>\r
                     <p class="text-sm text-gray-500">Env\xEDos asegurados a cualquier punto de Argentina a trav\xE9s de Andreani.</p>\r
                 </div>\r
                 <div>\r
                     <h3 class="font-bold text-gray-900 dark:text-white mb-2"><i class="fas fa-medal text-blue-500 mr-2"></i> Calidad AAA</h3>\r
                     <p class="text-sm text-gray-500">Seleccionamos los mejores proveedores para garantizar bajas tasas de RMA.</p>\r
                 </div>\r
             </div>\r
             \r
             <!-- SEO Content Block -->\r
             <div class="prose prose-sm dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-10">\r
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Repuestos de Celulares en Argentina: Tu Proveedor de Confianza</h2>\r
                <p>\r
                    Si est\xE1s buscando <strong>d\xF3nde comprar repuestos de celulares en Buenos Aires</strong> o necesit\xE1s un proveedor confiable que realice env\xEDos a todo el pa\xEDs, has llegado al lugar indicado. \r
                    Somos la <strong>impotadora de repuestos n\xFAmero 1 en Merlo</strong> y zona oeste, expandi\xE9ndonos como el principal <strong>mayorista de repuestos oficial para celulares en Marcos Paz</strong> y alrededores.\r
                </p>\r
                <div class="grid md:grid-cols-2 gap-8 mt-6">\r
                    <div>\r
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">\xBFPor qu\xE9 elegir nuestros repuestos?</h3>\r
                        <p>\r
                            Contamos con el stock m\xE1s amplio de <strong>repuestos para celulares en Argentina</strong>. Desde m\xF3dulos de pantalla (display + t\xE1ctil), bater\xEDas originales, flex de carga, c\xE1maras, hasta herramientas de precisi\xF3n para t\xE9cnicos. \r
                            Todos nuestros productos pasan por un riguroso control de calidad para asegurar que tus reparaciones sean duraderas y profesionales.\r
                        </p>\r
                    </div>\r
                    <div>\r
                         <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Env\xEDos y Distribuci\xF3n</h3>\r
                         <p>\r
                             No importa si est\xE1s en CABA, C\xF3rdoba, Rosario o Tierra del Fuego. Realizamos env\xEDos r\xE1pidos y seguros a todo el territorio nacional. \r
                             Si busc\xE1s <strong>repuestos de celulares en Buenos Aires</strong> con entrega inmediata o env\xEDo en el d\xEDa, consultanos.\r
                         </p>\r
                    </div>\r
                </div>\r
             </div>\r
        </div>\r
    </div>\r
  </div>\r
\r
  <!-- SIDEBAR DRAWER (Filters) -->\r
  <div class="drawer-side z-40">\r
    <label for="repuestos-filter-drawer" aria-label="close sidebar" class="drawer-overlay backdrop-blur-sm"></label>\r
    <aside class="menu p-6 w-80 min-h-full bg-white dark:bg-gray-800 text-base-content border-r border-gray-200 dark:border-gray-700">\r
        <div class="flex justify-between items-center mb-8">\r
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Filtrar Repuestos</h3>\r
            <label for="repuestos-filter-drawer" class="btn btn-sm btn-circle btn-ghost">\u2715</label>\r
        </div>\r
\r
        <div class="space-y-6">\r
            <!-- Categories -->\r
             <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Categor\xEDa</h4>\r
                <ul class="menu bg-base-100 w-full p-0 gap-1">\r
                    <li>\r
                        <button (click)="applyFilter('category', 'all')" \r
                        [class.active]="currentCategory() === 'all'"\r
                        class="rounded-lg">\r
                        Todas\r
                        </button>\r
                    </li>\r
                    @for (c of visibleCategories(); track c.id) {\r
                    <li>\r
                        <button (click)="applyFilter('category', c.id)"\r
                        [class.active]="currentCategory() === c.id"\r
                        class="rounded-lg">\r
                        {{c.name}}\r
                        </button>\r
                    </li>\r
                    }\r
                </ul>\r
             </div>\r
\r
             <!-- Brands -->\r
             <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Marca</h4>\r
                <select [ngModel]="currentBrand()" (ngModelChange)="applyFilter('brand', $event)"\r
                    class="select select-bordered w-full bg-white dark:bg-gray-700">\r
                    <option value="all">Todas las Marcas</option>\r
                    @for (b of brands(); track b.id) { <option [value]="b.id">{{b.name}}</option> }\r
                </select>\r
             </div>\r
\r
             <!-- Price -->\r
              <div>\r
                <h4 class="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Precio M\xE1ximo</h4>\r
                <div class="relative">\r
                    <span class="absolute left-3 top-3 text-gray-400">$</span>\r
                    <input [ngModel]="currentMaxPrice()" (ngModelChange)="applyFilter('price', $event)" type="number" min="0" placeholder="Ej: 50.000"\r
                    class="input input-bordered w-full pl-8 bg-white dark:bg-gray-700" />\r
                </div>\r
              </div>\r
\r
              <div class="pt-4">\r
                  <button (click)="applyFilter('category', 'all'); applyFilter('brand', 'all'); applyFilter('price', null); onSearch('')" \r
                          class="btn btn-outline w-full rounded-full">\r
                      Limpiar Filtros\r
                  </button>\r
              </div>\r
        </div>\r
    </aside>\r
  </div>\r
</div>\r
\r
<!-- Quick View Modal (Identical to other pages) -->\r
@if (isQuickViewOpen()) {\r
<div class="modal modal-open z-50 animate-fade-in">\r
  <div class="modal-box relative max-w-4xl bg-white dark:bg-gray-800 rounded-3xl p-0 overflow-hidden shadow-2xl">\r
    <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white/50 backdrop-blur-md" (click)="closeQuickView()">\u2715</button>\r
    \r
    @if (quickViewProduct(); as p) {\r
        <div class="flex flex-col md:flex-row h-full">\r
            <div class="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700/30 p-8 flex items-center justify-center relative">\r
                <img [src]="p.image_url || 'assets/img/no-image.png'" class="max-h-[300px] object-contain drop-shadow-xl" [alt]="p.name"/>\r
                @if((p.stock ?? 0) <= 0) {\r
                     <span class="absolute top-8 left-8 badge badge-error text-white font-bold p-3">Sin Stock</span>\r
                }\r
            </div>\r
            \r
            <div class="w-full md:w-1/2 p-8 flex flex-col">\r
                <div class="mb-auto">\r
                    <h3 class="font-black text-2xl md:text-3xl mb-2 text-gray-900 dark:text-white leading-tight">{{ p.name }}</h3>\r
                    <div class="flex items-baseline gap-3 mb-6">\r
                        <span class="text-4xl font-bold text-blue-600">{{ p.price | currency }}</span>\r
                        @if(p.regular_price && p.regular_price > p.price) {\r
                            <span class="text-lg text-gray-400 line-through">{{ p.regular_price | currency }}</span>\r
                        }\r
                    </div>\r
                    <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ p.description || 'Repuesto original garantizado.' }}</p>\r
                    \r
                    <div class="flex flex-wrap gap-2 mb-8">\r
                        <span class="badge badge-lg badge-outline"><i class="fas fa-shield-check mr-2 text-green-500"></i> Garant\xEDa 30 d\xEDas</span>\r
                        <span class="badge badge-lg badge-outline"><i class="fas fa-truck mr-2 text-blue-500"></i> Env\xEDo Full</span>\r
                    </div>\r
                </div>\r
                \r
                <button class="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-blue-600/30 gap-3" (click)="addToCart(p)">\r
                   <i class="fas fa-shopping-cart"></i> Agregar al Carrito\r
                </button>\r
            </div>\r
        </div>\r
    }\r
  </div>\r
  <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">\r
    <button (click)="closeQuickView()">close</button>\r
  </form>\r
</div>\r
}`, styles: ["/* src/app/public/repuestos/repuestos.scss */\n/*# sourceMappingURL=repuestos.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RepuestosComponent, { className: "RepuestosComponent", filePath: "src/app/public/repuestos/repuestos.ts", lineNumber: 28 });
})();
export {
  RepuestosComponent
};
//# sourceMappingURL=chunk-5LKOCBY5.mjs.map
