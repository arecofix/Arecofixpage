import {
  RepairRepository
} from "./chunk-MLWSDCGA.js";
import {
  ThemeService
} from "./chunk-U6UXZZNZ.js";
import {
  AnalyticsRepository
} from "./chunk-EVQVIDWO.js";
import {
  provideCharts,
  withDefaultRegisterables
} from "./chunk-7I3KJFJA.js";
import {
  CategoryRepository
} from "./chunk-MYSAJLFD.js";
import {
  BrandRepository
} from "./chunk-ZJZBKGOC.js";
import {
  NotificationService
} from "./chunk-2PFUEYPY.js";
import {
  SeoService
} from "./chunk-PD7VQIR7.js";
import {
  ApplicationError,
  AuthService,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  NetworkError,
  NotFoundError,
  SUPABASE_CLIENT,
  SupabaseService,
  TenantService,
  ValidationError
} from "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import {
  ToastService
} from "./chunk-CM6ZIEXS.js";
import {
  ProductRepository
} from "./chunk-NOSGPON2.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-ODRBL5CU.js";
import {
  LoggerService
} from "./chunk-RNDQ5ZF4.js";
import {
  AnalyticsService
} from "./chunk-2ARLTMO5.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  HttpErrorResponse,
  RouterOutlet,
  bootstrapApplication,
  provideClientHydration,
  provideHttpClient,
  provideRouter,
  withEventReplay,
  withFetch,
  withInMemoryScrolling
} from "./chunk-CP6GQXNM.js";
import {
  CommonModule,
  NgClass,
  isPlatformBrowser
} from "./chunk-F32QBW3I.js";
import {
  Component,
  DOCUMENT,
  ErrorHandler,
  Injectable,
  Input,
  PLATFORM_ID,
  ViewChild,
  computed,
  enableProdMode,
  from,
  inject,
  map,
  mergeApplicationConfig,
  of,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction3,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-DPJFS6PI.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/app.routes.ts
var routes = [
  __spreadValues({
    title: "Home",
    path: "",
    loadChildren: () => import("./chunk-XZMVHVHV.js")
  }, false ? { \u0275entryName: "src/app/public/public.routes.ts" } : {}),
  __spreadValues({
    title: "Admin",
    path: "admin",
    loadChildren: () => import("./chunk-26L7WYZN.js")
  }, false ? { \u0275entryName: "src/app/admin/admin.routes.ts" } : {}),
  {
    path: "**",
    redirectTo: ""
  }
];

// src/app/core/errors/global-error-handler.ts
var GlobalErrorHandler = class _GlobalErrorHandler {
  logger = inject(LoggerService);
  notification = inject(NotificationService);
  handleError(error) {
    this.logger.error("Unhandled error occurred", error);
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof ApplicationError) {
      this.handleApplicationError(error);
    } else {
      this.handleUnknownError(error);
    }
  }
  /**
   * Handle HTTP errors
   */
  handleHttpError(error) {
    let message;
    switch (error.status) {
      case 0:
        message = "No se pudo conectar al servidor. Verifica tu conexi\xF3n a internet.";
        break;
      case 400:
        message = "Solicitud inv\xE1lida. Por favor verifica los datos ingresados.";
        break;
      case 401:
        message = "Sesi\xF3n expirada. Por favor inicia sesi\xF3n nuevamente.";
        break;
      case 403:
        message = "No tienes permisos para realizar esta acci\xF3n.";
        break;
      case 404:
        message = "El recurso solicitado no fue encontrado.";
        break;
      case 500:
        message = "Error del servidor. Por favor intenta nuevamente m\xE1s tarde.";
        break;
      case 503:
        message = "Servicio no disponible. Por favor intenta m\xE1s tarde.";
        break;
      default:
        message = `Error inesperado (${error.status}). Por favor intenta nuevamente.`;
    }
    this.notification.showError(message);
  }
  /**
   * Handle application-specific errors
   */
  handleApplicationError(error) {
    let message;
    if (error instanceof ValidationError) {
      message = error.message || "Los datos ingresados no son v\xE1lidos.";
    } else if (error instanceof AuthenticationError) {
      message = "Error de autenticaci\xF3n. Por favor inicia sesi\xF3n nuevamente.";
    } else if (error instanceof AuthorizationError) {
      message = "No tienes permisos para realizar esta acci\xF3n.";
    } else if (error instanceof NotFoundError) {
      message = error.message;
    } else if (error instanceof DatabaseError) {
      message = "Error al acceder a la base de datos. Por favor intenta nuevamente.";
    } else if (error instanceof NetworkError) {
      message = "Error de conexi\xF3n. Verifica tu internet e intenta nuevamente.";
    } else {
      message = error.message || "Ocurri\xF3 un error inesperado.";
    }
    this.notification.showError(message);
  }
  /**
   * Handle unknown errors
   */
  handleUnknownError(error) {
    const message = "Ocurri\xF3 un error inesperado. Por favor intenta nuevamente.";
    this.notification.showError(message);
  }
  static \u0275fac = function GlobalErrorHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GlobalErrorHandler)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GlobalErrorHandler, factory: _GlobalErrorHandler.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalErrorHandler, [{
    type: Injectable
  }], null, null);
})();

// src/app/features/products/infrastructure/repositories/supabase-product.repository.ts
var SupabaseProductRepository = class _SupabaseProductRepository extends ProductRepository {
  authService = inject(AuthService);
  logger = inject(LoggerService);
  tenantService = inject(TenantService);
  supabase = this.authService.getSupabaseClient();
  useSoftDeletes = true;
  applyTenantFilter(query) {
    let enhancedQuery = query.eq("tenant_id", this.tenantService.getTenantId());
    if (this.useSoftDeletes) {
      enhancedQuery = enhancedQuery.is("deleted_at", null);
    }
    return enhancedQuery;
  }
  findWithFilters(params = {}) {
    const { _page = 1, _per_page = 10, category_id, brand_id, description, featured, id, name, price, slug, min_price, max_price } = params;
    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;
    let baseQuery = this.supabase.from("products").select(`
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)
      `, { count: "exact" });
    let query = this.applyTenantFilter(baseQuery);
    if (params.is_active !== void 0) {
      query = query.eq("is_active", params.is_active);
    } else if (!params.include_inactive) {
      query = query.eq("is_active", true);
    }
    if (params.category_ids && params.category_ids.length > 0) {
      query = query.in("category_id", params.category_ids);
    } else if (category_id) {
      query = query.eq("category_id", category_id);
    }
    if (brand_id)
      query = query.eq("brand_id", brand_id);
    if (description)
      query = query.ilike("description", `%${description}%`);
    if (featured !== null && featured !== void 0)
      query = query.eq("is_featured", featured);
    if (id)
      query = query.eq("id", id);
    if (params.ids && params.ids.length > 0)
      query = query.in("id", params.ids);
    if (name)
      query = query.ilike("name", `%${name}%`);
    if (price)
      query = query.eq("price", price);
    if (slug)
      query = query.eq("slug", slug);
    if (min_price !== void 0)
      query = query.gte("price", min_price);
    if (max_price !== void 0)
      query = query.lte("price", max_price);
    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }
    if (params._sort) {
      query = query.order(params._sort, { ascending: params._order === "asc" });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    query = query.range(start, end);
    return from(query).pipe(map((res) => {
      const { data, count, error } = res;
      if (error)
        throw error;
      const totalItems = count || 0;
      const pages = Math.max(1, Math.ceil(totalItems / _per_page));
      const products = (data || []).map((p) => this._mapToEntity(p));
      return {
        first: 1,
        prev: _page > 1 ? _page - 1 : void 0,
        next: _page < pages ? _page + 1 : void 0,
        last: pages,
        pages,
        items: totalItems,
        data: products
      };
    }));
  }
  findLowStock(threshold = 5) {
    let query = this.supabase.from("products").select(`
          id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
          is_active, is_featured, sku, barcode, stock, created_at, updated_at,
          branch_stock:product_stock_per_branch(quantity, branch_id)
        `);
    return from(this.applyTenantFilter(query)).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return (data || []).map((p) => this._mapToEntity(p)).filter((p) => p.stock < threshold);
    }));
  }
  findAvailable() {
    const fetchAll = async () => {
      let allData = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1e3;
      const select = `
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id)
      `;
      while (hasMore) {
        const query = this.applyTenantFilter(this.supabase.from("products").select(select)).eq("is_active", true).order("name").range(fromIdx, fromIdx + CHUNK - 1);
        const { data, error } = await query;
        if (error)
          throw error;
        const products = (data || []).map((p) => this._mapToEntity(p));
        allData = [...allData, ...products];
        if (products.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };
    return from(fetchAll());
  }
  getAll(branch_id) {
    const fetchAll = async () => {
      let allData = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1e3;
      const select = `
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id)
      `;
      while (hasMore) {
        let query = this.supabase.from("products").select(select);
        query = this.applyTenantFilter(query);
        const { data, error } = await query.order("created_at", { ascending: false }).range(fromIdx, fromIdx + CHUNK - 1);
        if (error)
          throw error;
        const products = (data || []).map((p) => this._mapToEntity(p, branch_id));
        allData = [...allData, ...products];
        if (products.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };
    return from(fetchAll());
  }
  getById(id) {
    let query = this.supabase.from("products").select(`
          id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
          is_active, is_featured, sku, barcode, stock, created_at, updated_at,
          branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)
        `).eq("id", id);
    let filteredQuery = this.applyTenantFilter(query).single();
    return from(filteredQuery).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return this._mapToEntity(data);
    }));
  }
  /** Lean projection for import deduplication - fetches all products in batches to avoid limits */
  getAllForImport() {
    const fetchAll = async () => {
      let allData = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1e3;
      while (hasMore) {
        const query = this.applyTenantFilter(this.supabase.from("products").select("id, name, slug, sku, price, image_url, gallery_urls, description, category_id, brand_id")).range(fromIdx, fromIdx + CHUNK - 1);
        const { data, error } = await query;
        if (error)
          throw error;
        const products = data || [];
        allData = [...allData, ...products];
        if (products.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };
    return from(fetchAll());
  }
  /**
   * Safe bulk price update - only modifies `price` (and optionally `name` for repuesto items).
   * Processes in batches of 50 to avoid overloading the DB.
   */
  bulkUpdatePrices(updates) {
    const CHUNK_SIZE = 50;
    const chunks = [];
    for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
      chunks.push(updates.slice(i, i + CHUNK_SIZE));
    }
    const processChunks = async () => {
      let updated = 0;
      let errors = 0;
      for (const chunk of chunks) {
        const promises = chunk.map(async (item) => {
          const payload = {
            price: item.price,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          };
          if (item.newName) {
            payload["name"] = item.newName;
          }
          const { error } = await this.supabase.from("products").update(payload).eq("id", item.id).eq("tenant_id", this.tenantService.getTenantId());
          if (error) {
            this.logger.error("bulkUpdatePrices", `Failed for product ${item.id}: ${error.message}`);
            errors++;
          } else {
            updated++;
          }
        });
        await Promise.all(promises);
      }
      return { updated, errors };
    };
    return from(processChunks());
  }
  async uploadImage(file) {
    const filePath = `products/${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage.from("public-assets").upload(filePath, file);
    if (error)
      throw error;
    const { data: publicUrl } = this.supabase.storage.from("public-assets").getPublicUrl(data.path);
    return publicUrl.publicUrl;
  }
  async syncBranchStock(productId, quantity) {
    const user = this.authService.getCurrentUser();
    if (!user)
      return;
    const profile = await this.authService.getUserProfile(user.id);
    if (!profile || !profile.branch_id)
      return;
    await this.supabase.from("product_stock_per_branch").upsert({
      product_id: productId,
      branch_id: profile.branch_id,
      tenant_id: this.tenantService.getTenantId(),
      quantity,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, { onConflict: "product_id,branch_id" });
  }
  create(product) {
    const _a = product, { stock } = _a, productData = __objRest(_a, ["stock"]);
    const payload = __spreadProps(__spreadValues({}, productData), {
      tenant_id: this.tenantService.getTenantId(),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return from(this.supabase.from("products").insert(payload).select("*").single()).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      if (stock !== void 0) {
        this.syncBranchStock(data.id, stock);
      }
      return this._mapToEntity(data);
    }));
  }
  update(id, product) {
    const _a = product, { stock } = _a, productData = __objRest(_a, ["stock"]);
    delete productData.tenant_id;
    delete productData.id;
    const payload = __spreadProps(__spreadValues({}, productData), {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    let query = this.supabase.from("products").update(payload).eq("id", id);
    let filteredQuery = this.applyTenantFilter(query).select("*").single();
    return from(filteredQuery).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      if (stock !== void 0) {
        this.syncBranchStock(id, stock);
      }
      return this._mapToEntity(data);
    }));
  }
  delete(id) {
    let query = this.supabase.from("products").delete().eq("id", id);
    let filteredQuery = this.applyTenantFilter(query);
    return from(filteredQuery).pipe(map((res) => {
      const { error } = res;
      if (error)
        throw error;
      return void 0;
    }));
  }
  upsertMany(products) {
    if (!products.length)
      return of([]);
    const dataToUpsert = products.map((p) => {
      const _a = p, { stock } = _a, rest = __objRest(_a, ["stock"]);
      return __spreadProps(__spreadValues({}, rest), {
        tenant_id: this.tenantService.getTenantId(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    return from(this.supabase.from("products").upsert(dataToUpsert).select()).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return (data || []).map((p) => this._mapToEntity(p));
    }));
  }
  updateMany(products) {
    if (!products.length)
      return of(void 0);
    const DB_COLUMNS = /* @__PURE__ */ new Set([
      "id",
      "name",
      "slug",
      "description",
      "price",
      "sale_price",
      "stock",
      "min_stock_alert",
      "category_id",
      "brand_id",
      "model_id",
      "image_url",
      "gallery_urls",
      "specifications",
      "is_featured",
      "is_active",
      "sku",
      "barcode",
      "currency",
      "is_global",
      "created_at",
      "updated_at",
      "deleted_at",
      "tenant_id"
    ]);
    const updates = products.map((p) => {
      if (!p.id)
        return Promise.resolve({ error: { message: "Missing ID" } });
      const _a = p, { id, tenant_id } = _a, rest = __objRest(_a, ["id", "tenant_id"]);
      const cleanPayload = {};
      for (const key of Object.keys(rest)) {
        if (DB_COLUMNS.has(key))
          cleanPayload[key] = rest[key];
      }
      cleanPayload["updated_at"] = (/* @__PURE__ */ new Date()).toISOString();
      let query = this.supabase.from("products").update(cleanPayload).eq("id", id);
      return this.applyTenantFilter(query);
    });
    return from(Promise.all(updates)).pipe(map((results) => {
      const errors = results.filter((r) => r && r.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} products`);
      }
      return void 0;
    }));
  }
  /** Soft-delete multiple products at once (sets deleted_at timestamp) */
  bulkDelete(ids) {
    if (!ids.length)
      return of(void 0);
    const CHUNK_SIZE = 100;
    const chunks = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      chunks.push(ids.slice(i, i + CHUNK_SIZE));
    }
    const tenantId = this.tenantService.getTenantId();
    const processChunks = async () => {
      for (const chunk of chunks) {
        const { error } = await this.supabase.from("products").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", chunk).eq("tenant_id", tenantId);
        if (error)
          throw error;
      }
    };
    return from(processChunks()).pipe(map(() => void 0));
  }
  _mapToEntity(p, branch_id) {
    const isFeatured = Boolean(p["featured"] ?? p["is_featured"] ?? false);
    let displayedStock = 0;
    const branchStockList = p.branch_stock && Array.isArray(p.branch_stock) ? p.branch_stock : [];
    if (branch_id) {
      const specificBranch = branchStockList.find((b) => b.branch_id === branch_id);
      displayedStock = specificBranch ? Number(specificBranch.quantity) : 0;
    } else if (branchStockList.length > 0) {
      displayedStock = branchStockList.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    } else {
      displayedStock = Number(p["stock"] || 0);
    }
    return {
      id: p["id"],
      name: p["name"],
      slug: p["slug"],
      description: p["description"],
      price: Number(p["price"]),
      image_url: p["image_url"],
      gallery_urls: p["gallery_urls"] || (p["image_url"] ? [p["image_url"]] : []),
      category_id: p["category_id"],
      brand_id: p["brand_id"],
      stock: displayedStock,
      is_active: Boolean(p["is_active"]),
      is_featured: isFeatured,
      sku: p["sku"] || "",
      barcode: p["barcode"] || "",
      currency: p["currency"] || "ARS",
      min_stock_alert: p["min_stock_alert"] ? Number(p["min_stock_alert"]) : void 0,
      created_at: p["created_at"],
      updated_at: p["updated_at"],
      branch_stock: p.branch_stock
    };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SupabaseProductRepository_BaseFactory;
    return function SupabaseProductRepository_Factory(__ngFactoryType__) {
      return (\u0275SupabaseProductRepository_BaseFactory || (\u0275SupabaseProductRepository_BaseFactory = \u0275\u0275getInheritedFactory(_SupabaseProductRepository)))(__ngFactoryType__ || _SupabaseProductRepository);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseProductRepository, factory: _SupabaseProductRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseProductRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/repositories/base.repository.ts
var BaseRepository = class {
  supabase;
  logger;
  // Lista de tablas globales del sistema (Ejemplo). Para estas NO aplicamos Tenant Filter.
  // Configura aquí si alguna tabla (ej. planes de precios base) es global para toda la app.
  isGlobalTable = false;
  // Define si la tabla utiliza la columna "deleted_at" para borrado lógico (Soft Deletes)
  useSoftDeletes = false;
  // Se inyecta al vuelo. Evita tener que pasarlo a mano en constructores hijos 
  tenantService = inject(TenantService);
  constructor(supabase, logger) {
    this.supabase = supabase;
    this.logger = logger;
  }
  /**
   * Aplica el contexto SaaS automáticamente si la tabla no es global.
   * También aplica el filtro de Soft Deletes si la tabla lo soporta.
   */
  applyTenantFilter(query) {
    let enhancedQuery = query;
    if (!this.isGlobalTable) {
      const tenantId = this.tenantService.getTenantId();
      enhancedQuery = enhancedQuery.eq("tenant_id", tenantId);
    }
    if (this.useSoftDeletes) {
      enhancedQuery = enhancedQuery.is("deleted_at", null);
    }
    return enhancedQuery;
  }
  /**
   * Find all records for the current Tenant
   */
  getAll(orderBy) {
    const fetchAll = async () => {
      let allData = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1e3;
      while (hasMore) {
        let query = this.supabase.from(this.tableName).select("*");
        query = this.applyTenantFilter(query);
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }
        const { data, error } = await query.range(fromIdx, fromIdx + CHUNK - 1);
        if (error) {
          this.logger.error(`Error fetching all ${this.tableName}`, error);
          throw new DatabaseError(error.message, error);
        }
        const batch = data || [];
        allData = [...allData, ...batch];
        if (batch.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };
    return from(fetchAll());
  }
  /**
   * Find record by ID (safely isolated within current Tenant)
   */
  getById(id) {
    let query = this.supabase.from(this.tableName).select("*").eq("id", id);
    query = this.applyTenantFilter(query);
    return from(query.single()).pipe(map(({ data, error }) => {
      if (error) {
        if (error.code === "PGRST116")
          throw new Error("Not found");
        this.logger.error(`Error fetching ${this.tableName} by ID`, error);
        throw new DatabaseError(error.message, error);
      }
      return data;
    }));
  }
  /**
   * Create new record (Automáticamente empaca el Tenant ID)
   */
  create(item) {
    const payload = this.isGlobalTable ? item : __spreadProps(__spreadValues({}, item), { tenant_id: this.tenantService.getTenantId() });
    return from(this.supabase.from(this.tableName).insert(payload).select().single()).pipe(map(({ data, error }) => {
      if (error) {
        this.logger.error(`Error creating ${this.tableName}`, error);
        throw new DatabaseError(error.message, error);
      }
      return data;
    }));
  }
  /**
   * Update existing record (Safely within tenant isolation)
   */
  update(id, item) {
    const payload = __spreadValues({}, item);
    delete payload.tenant_id;
    delete payload.id;
    let query = this.supabase.from(this.tableName).update(payload).eq("id", id);
    query = this.applyTenantFilter(query);
    return from(query.select().single()).pipe(map(({ data, error }) => {
      if (error) {
        this.logger.error(`Error updating ${this.tableName}`, error);
        throw new DatabaseError(error.message, error);
      }
      return data;
    }));
  }
  /**
   * Delete record (Aislado fuertemente)
   */
  delete(id) {
    let query = this.supabase.from(this.tableName).delete().eq("id", id);
    query = this.applyTenantFilter(query);
    return from(query).pipe(map(({ error }) => {
      if (error) {
        this.logger.error(`Error deleting ${this.tableName}`, error);
        throw new DatabaseError(error.message, error);
      }
    }));
  }
  /**
   * Find records with custom filter (Aislado)
   */
  getWhere(column, value, orderBy) {
    let query = this.supabase.from(this.tableName).select("*").eq(column, value);
    query = this.applyTenantFilter(query);
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }
    return from(query).pipe(map(({ data, error }) => {
      if (error) {
        this.logger.error(`Error fetching ${this.tableName} with filter`, error);
        throw new DatabaseError(error.message, error);
      }
      return data || [];
    }));
  }
  /**
   * Count records natively at database level
   */
  count() {
    let query = this.supabase.from(this.tableName).select("*", { count: "exact", head: true });
    query = this.applyTenantFilter(query);
    return from(query).pipe(map(({ count, error }) => {
      if (error) {
        this.logger.error(`Error counting ${this.tableName}`, error);
        throw new DatabaseError(error.message, error);
      }
      return count || 0;
    }));
  }
};

// src/app/features/products/infrastructure/repositories/supabase-category.repository.ts
var SupabaseCategoryRepository = class _SupabaseCategoryRepository extends BaseRepository {
  tableName = "categories";
  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }
  static \u0275fac = function SupabaseCategoryRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SupabaseCategoryRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseCategoryRepository, factory: _SupabaseCategoryRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseCategoryRepository, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/features/products/infrastructure/repositories/supabase-brand.repository.ts
var SupabaseBrandRepository = class _SupabaseBrandRepository extends BaseRepository {
  tableName = "brands";
  constructor() {
    const authService = inject(AuthService);
    const logger = inject(LoggerService);
    super(authService.getSupabaseClient(), logger);
  }
  static \u0275fac = function SupabaseBrandRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SupabaseBrandRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseBrandRepository, factory: _SupabaseBrandRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseBrandRepository, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/features/repairs/infrastructure/repositories/supabase-repair.repository.ts
var SupabaseRepairRepository = class _SupabaseRepairRepository extends RepairRepository {
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  supabase = this.auth.getSupabaseClient();
  useSoftDeletes = true;
  applyTenantFilter(query) {
    let enhancedQuery = query.eq("tenant_id", this.tenantService.getTenantId());
    if (this.useSoftDeletes) {
      enhancedQuery = enhancedQuery.is("deleted_at", null);
    }
    return enhancedQuery;
  }
  getById(id) {
    let query = this.supabase.from("repairs").select("*, parts:repair_parts_used(*), images:repair_images(image_url)").eq("id", id);
    return from(this.applyTenantFilter(query).single()).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return this.mapFromDb(data);
    }));
  }
  getAll(limit = 50, offset = 0) {
    let query = this.supabase.from("repairs").select("*").range(offset, offset + limit - 1);
    let filteredQuery = this.applyTenantFilter(query).order("created_at", { ascending: false });
    return from(filteredQuery).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return (data || []).map((item) => this.mapFromDb(item));
    }));
  }
  create(repair) {
    const _a = repair, { parts, images } = _a, baseRepair = __objRest(_a, ["parts", "images"]);
    const payload = this.mapToDb(baseRepair);
    payload.tenant_id = this.tenantService.getTenantId();
    return from(this.supabase.from("repairs").insert(payload).select().single()).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return data;
    }), switchMap(async (data) => {
      if (parts && parts.length > 0) {
        await this.syncParts(data.id, parts);
      }
      if (images && images.length > 0) {
        await this.syncImages(data.id, images);
      }
      const repairWithParts = __spreadProps(__spreadValues({}, data), { parts: parts || [], images: images || [] });
      return this.mapFromDb(repairWithParts);
    }));
  }
  update(id, repair) {
    const _a = repair, { parts, images } = _a, baseRepair = __objRest(_a, ["parts", "images"]);
    const payload = this.mapToDb(baseRepair);
    let query = this.supabase.from("repairs").update(payload).eq("id", id).select();
    return from(this.applyTenantFilter(query)).pipe(map((res) => {
      const { error, data } = res;
      if (error)
        throw error;
      return data;
    }), switchMap(async () => {
      if (parts) {
        await this.syncParts(id, parts);
      }
      if (images) {
        await this.syncImages(id, images);
      }
    }));
  }
  async syncParts(repairId, parts) {
    const tenantId = this.tenantService.getTenantId();
    await this.supabase.from("repair_parts_used").delete().eq("repair_id", repairId).eq("tenant_id", tenantId);
    if (parts.length > 0) {
      const partsToInsert = parts.map((p) => ({
        repair_id: repairId,
        product_id: p.product_id,
        quantity: p.quantity,
        unit_price_at_time: p.unit_price_at_time,
        cost_at_time: p.cost_at_time,
        tenant_id: tenantId
      }));
      await this.supabase.from("repair_parts_used").insert(partsToInsert);
    }
  }
  async syncImages(repairId, images) {
    const tenantId = this.tenantService.getTenantId();
    await this.supabase.from("repair_images").delete().eq("repair_id", repairId).eq("tenant_id", tenantId);
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img) => ({
        repair_id: repairId,
        image_url: typeof img === "string" ? img : img.image_url,
        tenant_id: tenantId
      }));
      await this.supabase.from("repair_images").insert(imagesToInsert);
    }
  }
  delete(id) {
    let query = this.supabase.from("repairs").delete().eq("id", id);
    return from(this.applyTenantFilter(query)).pipe(map((res) => {
      const { error } = res;
      if (error)
        throw error;
    }));
  }
  getByTrackingCode(code) {
    let query = this.supabase.from("repairs").select("*, parts:repair_parts_used(*), images:repair_images(image_url)").eq("tracking_code", code);
    return from(this.applyTenantFilter(query).single()).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return this.mapFromDb(data);
    }));
  }
  async uploadImage(file) {
    const fileExt = file.name.split(".").pop();
    const tenantStr = this.tenantService.getTenantId();
    const fileName = `${tenantStr}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await this.supabase.storage.from("repair-images").upload(filePath, file);
    if (uploadError)
      throw uploadError;
    const { data: publicUrlData } = this.supabase.storage.from("repair-images").getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  }
  getAdminList(params) {
    const { branch_id, limit = 50, offset = 0 } = params;
    let query = this.supabase.from("repairs").select("*").range(offset, offset + limit - 1);
    if (branch_id) {
      query = query.eq("branch_id", branch_id);
    }
    let filteredQuery = this.applyTenantFilter(query).order("received_at", { ascending: false });
    return from(filteredQuery).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return (data || []).map((item) => this.mapFromDb(item));
    }));
  }
  mapFromDb(data) {
    return __spreadProps(__spreadValues({}, data), {
      device_brand: data.device_brand || "generic",
      images: data.images ? data.images.map((img) => typeof img === "string" ? img : img.image_url) : []
    });
  }
  mapToDb(entity) {
    const _a = entity, { device_brand, device_type, images } = _a, rest = __objRest(_a, ["device_brand", "device_type", "images"]);
    const payload = __spreadValues({}, rest);
    if (device_brand || device_type) {
      let model = payload.device_model || "";
      if (device_brand && device_brand.toLowerCase() !== "generic") {
        model = `${device_brand} ${model}`;
      }
      if (device_type && device_type !== "smartphone") {
        model = `${model} (${device_type})`;
      }
      payload.device_model = model.trim();
    }
    return payload;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SupabaseRepairRepository_BaseFactory;
    return function SupabaseRepairRepository_Factory(__ngFactoryType__) {
      return (\u0275SupabaseRepairRepository_BaseFactory || (\u0275SupabaseRepairRepository_BaseFactory = \u0275\u0275getInheritedFactory(_SupabaseRepairRepository)))(__ngFactoryType__ || _SupabaseRepairRepository);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseRepairRepository, factory: _SupabaseRepairRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseRepairRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/features/analytics/infrastructure/repositories/supabase-analytics.repository.ts
var SupabaseAnalyticsRepository = class _SupabaseAnalyticsRepository {
  supabase = inject(SUPABASE_CLIENT);
  getDashboardStats() {
    return from(this.supabase.rpc("get_dashboard_stats")).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return {
        users: data?.users || 0,
        products: data?.products || 0,
        sales: data?.sales || 0,
        revenue: data?.revenue || 0,
        repairs_month: data?.repairs_month || 0,
        repairs_revenue: data?.repairs_revenue || 0,
        devices_fixed: data?.devices_fixed || 0,
        sales_chart: data?.sales_chart || [],
        products_chart: data?.products_chart || [],
        category_chart: data?.category_chart || []
      };
    }));
  }
  static \u0275fac = function SupabaseAnalyticsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SupabaseAnalyticsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseAnalyticsRepository, factory: _SupabaseAnalyticsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseAnalyticsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/core/repositories/user-profile.repository.ts
var UserProfileRepository = class {
};

// src/app/core/infrastructure/repositories/supabase-user-profile.repository.ts
var SupabaseUserProfileRepository = class _SupabaseUserProfileRepository extends BaseRepository {
  tableName = "profiles";
  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }
  getProfile(id) {
    return this.getById(id);
  }
  updateProfile(id, profile) {
    return this.update(id, profile);
  }
  static \u0275fac = function SupabaseUserProfileRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SupabaseUserProfileRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SupabaseUserProfileRepository, factory: _SupabaseUserProfileRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupabaseUserProfileRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/app.config.ts
var appConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // Supabase Client Provider via SupabaseService
    {
      provide: SUPABASE_CLIENT,
      useFactory: (supabaseService) => supabaseService.getClient(),
      deps: [SupabaseService]
    },
    // Core Angular providers
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: "enabled",
      scrollPositionRestoration: "enabled"
    })),
    provideHttpClient(withFetch()),
    // Repositories
    { provide: ProductRepository, useClass: SupabaseProductRepository },
    { provide: CategoryRepository, useClass: SupabaseCategoryRepository },
    { provide: BrandRepository, useClass: SupabaseBrandRepository },
    { provide: RepairRepository, useClass: SupabaseRepairRepository },
    { provide: AnalyticsRepository, useClass: SupabaseAnalyticsRepository },
    { provide: UserProfileRepository, useClass: SupabaseUserProfileRepository }
  ]
};

// src/app/core/services/ai-agent.service.ts
var AiAgentService = class _AiAgentService {
  platformId = inject(PLATFORM_ID);
  engine = null;
  // Type 'any' because strict type is not available without static import
  // Signals for UI State
  isLoadingModel = signal(false, ...ngDevMode ? [{ debugName: "isLoadingModel" }] : []);
  isGenerating = signal(false, ...ngDevMode ? [{ debugName: "isGenerating" }] : []);
  loadingProgress = signal("", ...ngDevMode ? [{ debugName: "loadingProgress" }] : []);
  modelLoaded = signal(false, ...ngDevMode ? [{ debugName: "modelLoaded" }] : []);
  // Full conversation history (for LLM context)
  messages = signal([], ...ngDevMode ? [{ debugName: "messages" }] : []);
  // Visible messages for UI (filters out system prompts and tool outputs)
  visibleMessages = computed(() => this.messages().filter((m) => m.role !== "system"), ...ngDevMode ? [{ debugName: "visibleMessages" }] : []);
  // Default model - Using Phi-3-mini-4k-instruct which is efficient for browser
  selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
  constructor() {
  }
  async initModel() {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn("AI Model cannot be initialized on server");
      return;
    }
    if (this.modelLoaded())
      return;
    this.isLoadingModel.set(true);
    try {
      if (!navigator.gpu) {
        throw new Error("WebGPU not supported in this browser");
      }
      const { CreateMLCEngine } = await import("./chunk-EZP7SFDH.js");
      const initProgressCallback = (report) => {
        this.loadingProgress.set(report.text);
      };
      this.engine = await CreateMLCEngine(this.selectedModel, { initProgressCallback });
      this.modelLoaded.set(true);
      this.isLoadingModel.set(false);
      this.initializeSystemPrompt();
    } catch (error) {
      console.error("Failed to load model", error);
      this.isLoadingModel.set(false);
      if (error instanceof Error && error.message.includes("WebGPU")) {
        this.loadingProgress.set("WebGPU no disponible. Usa Chrome/Edge para acceder a la IA.");
      } else {
        this.loadingProgress.set("Error loading model: " + error);
      }
    }
  }
  initializeSystemPrompt() {
    this.messages.set([
      { role: "system", content: `You are Arecofix AI Assistant. You help users with IT support, phone repairs, and website quotes.
        
        You have access to the following tools (simulated MCP):
        - get_repair_status(trackingId): Check repair status.
        - list_services(): Show available services.
        - book_appointment(serviceType, date): Schedule a repair.
        
        When a user asks something that requires a tool, reply with a JSON object strictly in this format:
        {"tool": "tool_name", "args": { ... }}
        
        Answer normally if no tool is needed. Keep responses concise and helpful.` }
    ]);
  }
  async sendMessage(text) {
    if (!this.engine) {
      await this.initModel();
      if (!this.engine) {
        this.messages.update((msgs) => [...msgs, { role: "assistant", content: "Error cr\xEDtico: El modelo IA no pudo cargarse. Verifica que tu navegador soporte WebGPU." }]);
        return;
      }
    }
    this.isGenerating.set(true);
    const userMsg = { role: "user", content: text };
    this.messages.update((msgs) => this.limitHistory([...msgs, userMsg]));
    try {
      const reply = await this.generateResponse();
      const responseContent = reply.choices[0].message.content || "";
      this.handleResponse(responseContent);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.messages.update((msgs) => [...msgs, { role: "assistant", content: `Lo siento, hubo un error t\xE9cnico: ${errorMsg}. Por favor intenta de nuevo.` }]);
    } finally {
      this.isGenerating.set(false);
    }
  }
  async generateResponse() {
    const history = this.messages().map((m) => ({ role: m.role, content: m.content }));
    return await this.engine.chat.completions.create({
      messages: history
    });
  }
  async handleResponse(content) {
    const toolCall = this.extractJson(content);
    if (toolCall && toolCall.tool) {
      try {
        await this.handleToolCall(toolCall);
      } catch (e) {
        console.error("Tool execution error", e);
        this.messages.update((msgs) => [...msgs, { role: "assistant", content }]);
      }
    } else {
      this.messages.update((msgs) => [...msgs, { role: "assistant", content }]);
    }
  }
  extractJson(content) {
    const cleanContent = content.replace(/```json\s*|```/g, "").trim();
    const startIndex = cleanContent.indexOf("{");
    if (startIndex === -1)
      return null;
    const potentialJson = cleanContent.substring(startIndex);
    try {
      return JSON.parse(potentialJson);
    } catch (e) {
      let balance = 0;
      let endIndex = -1;
      for (let i = 0; i < potentialJson.length; i++) {
        if (potentialJson[i] === "{")
          balance++;
        else if (potentialJson[i] === "}") {
          balance--;
          if (balance === 0) {
            endIndex = i;
            break;
          }
        }
      }
      if (endIndex !== -1) {
        try {
          return JSON.parse(potentialJson.substring(0, endIndex + 1));
        } catch (err) {
        }
      }
    }
    return null;
  }
  async handleToolCall(toolCall) {
    console.log("Executing Tool:", toolCall);
    let result = "";
    switch (toolCall.tool) {
      case "list_services":
        result = "Available Services: iPhone Screen Repair, Android Battery Replacement, PC Optimization, Custom Web Development, SEO Consulting.";
        break;
      case "get_repair_status":
        const id = toolCall.args?.trackingId || "Unknown";
        result = `Repair ${id} is currently In Progress (Phase 2: Component Testing). ETA: 24hrs.`;
        break;
      case "book_appointment":
        result = `Appointment request received for ${toolCall.args?.serviceType} on ${toolCall.args?.date}. Please confirm via WhatsApp.`;
        break;
      default:
        result = "Tool not found or not supported.";
    }
    this.messages.update((msgs) => [
      ...msgs,
      { role: "assistant", content: `Checking... (Tool: ${toolCall.tool})` },
      { role: "user", content: `[Tool Output]: ${result}` }
      // Changed to 'user' to be safer for LLM context
    ]);
    const reply = await this.generateResponse();
    const finalResponse = reply.choices[0].message.content || "";
    this.messages.update((msgs) => [...msgs, { role: "assistant", content: finalResponse }]);
  }
  limitHistory(msgs) {
    const maxHistory = 20;
    if (msgs.length <= maxHistory)
      return msgs;
    const systemPrompt = msgs[0];
    const recentMessages = msgs.slice(msgs.length - (maxHistory - 1));
    return [systemPrompt, ...recentMessages];
  }
  static \u0275fac = function AiAgentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AiAgentService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AiAgentService, factory: _AiAgentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AiAgentService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/features/ai-assistant/ai-assistant.ts
var _c0 = ["scrollContainer"];
var _c1 = (a0) => ({ "flex-row-reverse": a0 });
function AiAssistant_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 2);
  }
}
function AiAssistant_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 3);
  }
}
function AiAssistant_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 4);
  }
}
function AiAssistant_Conditional_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1, "Iniciando Motor...");
    \u0275\u0275elementEnd();
  }
}
function AiAssistant_Conditional_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "p", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 28);
    \u0275\u0275element(4, "div", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 30);
    \u0275\u0275text(6, "Descargando modelo IA (solo la primera vez)...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.aiService.loadingProgress());
  }
}
function AiAssistant_Conditional_4_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 31);
    \u0275\u0275element(2, "i", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const msg_r3 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c1, msg_r3.role === "user"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", msg_r3.role === "user" ? "bg-gray-700" : "bg-linear-to-br from-blue-500 to-purple-600");
    \u0275\u0275advance();
    \u0275\u0275classMap(msg_r3.role === "user" ? "fas fa-user" : "fas fa-robot");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", msg_r3.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white/10 text-gray-200 rounded-tl-sm");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", msg_r3.content, " ");
  }
}
function AiAssistant_Conditional_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17);
    \u0275\u0275element(2, "i", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 34);
    \u0275\u0275element(4, "span", 35)(5, "span", 36)(6, "span", 37);
    \u0275\u0275elementEnd()();
  }
}
function AiAssistant_Conditional_4_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "button", 38);
    \u0275\u0275listener("click", function AiAssistant_Conditional_4_Conditional_23_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.userInput.set("Estado de mi reparaci\xF3n");
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275text(2, " \u{1F527} Estado Reparaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 39);
    \u0275\u0275listener("click", function AiAssistant_Conditional_4_Conditional_23_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.userInput.set("Quiero un presupuesto web");
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275text(4, " \u{1F4BB} Presupuesto Web ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 40);
    \u0275\u0275listener("click", function AiAssistant_Conditional_4_Conditional_23_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.userInput.set("Cambio de pantalla iPhone");
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275text(6, " \u{1F4F1} Reparar Celular ");
    \u0275\u0275elementEnd()();
  }
}
function AiAssistant_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 6)(2, "div", 7);
    \u0275\u0275element(3, "div", 8);
    \u0275\u0275elementStart(4, "h3", 9);
    \u0275\u0275text(5, "Arecofix AI ");
    \u0275\u0275conditionalCreate(6, AiAssistant_Conditional_4_Conditional_6_Template, 2, 0, "span", 10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 7)(8, "div", 11);
    \u0275\u0275text(9, "WebLLM / MCP");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 12);
    \u0275\u0275listener("click", function AiAssistant_Conditional_4_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleChat());
    });
    \u0275\u0275element(11, "i", 13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, AiAssistant_Conditional_4_Conditional_12_Template, 7, 1, "div", 14);
    \u0275\u0275elementStart(13, "div", 15, 0)(15, "div", 16)(16, "div", 17);
    \u0275\u0275element(17, "i", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 19);
    \u0275\u0275text(19, " Hola! Soy tu asistente de Arecofix potenciado con IA local (WebLLM). Puedo ayudarte a consultar reparaciones, servicios o agendar citas. \xBFEn qu\xE9 te ayudo? ");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(20, AiAssistant_Conditional_4_For_21_Template, 5, 8, "div", 20, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275conditionalCreate(22, AiAssistant_Conditional_4_Conditional_22_Template, 7, 0, "div", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, AiAssistant_Conditional_4_Conditional_23_Template, 7, 0, "div", 21);
    \u0275\u0275elementStart(24, "div", 22)(25, "form", 23);
    \u0275\u0275listener("submit", function AiAssistant_Conditional_4_Template_form_submit_25_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275elementStart(26, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function AiAssistant_Conditional_4_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.userInput, $event) || (ctx_r1.userInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 25);
    \u0275\u0275element(28, "i", 26);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r1.aiService.modelLoaded() ? "bg-green-500 animate-pulse" : "bg-yellow-500");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.aiService.isLoadingModel() ? 6 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.aiService.isLoadingModel() ? 12 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r1.aiService.visibleMessages());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.aiService.isGenerating() ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.aiService.messages().length < 2 ? 23 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.aiService.isLoadingModel() || ctx_r1.aiService.isGenerating());
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.userInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.userInput() || ctx_r1.aiService.isLoadingModel());
  }
}
var AiAssistant = class _AiAssistant {
  aiService = inject(AiAgentService);
  isOpen = signal(false, ...ngDevMode ? [{ debugName: "isOpen" }] : []);
  userInput = signal("", ...ngDevMode ? [{ debugName: "userInput" }] : []);
  scrollContainer;
  toggleChat() {
    this.isOpen.update((v) => !v);
    if (this.isOpen() && !this.aiService.modelLoaded()) {
      this.aiService.initModel();
    }
  }
  sendMessage() {
    const text = this.userInput().trim();
    if (!text)
      return;
    this.aiService.sendMessage(text);
    this.userInput.set("");
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    try {
      if (typeof window !== "undefined" && this.scrollContainer && this.scrollContainer.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }
  static \u0275fac = function AiAssistant_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AiAssistant)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AiAssistant, selectors: [["app-ai-assistant"]], viewQuery: function AiAssistant_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.scrollContainer = _t.first);
    }
  }, decls: 5, vars: 5, consts: [["scrollContainer", ""], ["aria-haspopup", "dialog", 1, "fixed", "bottom-6", "left-6", "z-9999", "w-14", "h-14", "md:w-16", "md:h-16", "rounded-full", "bg-linear-to-r", "from-blue-600", "to-purple-600", "text-white", "shadow-lg", "shadow-purple-500/30", "flex", "items-center", "justify-center", "hover:scale-110", "transition-transform", "active:scale-95", "group", 3, "click"], [1, "absolute", "inset-0", "rounded-full", "border", "border-white/20", "animate-ping", "opacity-20"], [1, "fas", "fa-microchip", "text-2xl", "group-hover:rotate-12", "transition-transform"], [1, "fas", "fa-times", "text-xl"], [1, "fixed", "bottom-0", "right-0", "md:bottom-24", "md:right-6", "w-full", "md:w-[400px]", "h-dvh", "md:h-[600px]", "md:max-h-[80vh]", "z-9999", "md:rounded-2xl", "glass-panel", "border-t", "md:border", "border-white/10", "shadow-2xl", "flex", "flex-col", "overflow-hidden", "animate-slide-up", "bg-surface-dark/95", "backdrop-blur-xl"], [1, "p-4", "border-b", "border-white/10", "flex", "items-center", "justify-between", "bg-white/5", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-2", "h-2", "rounded-full", 3, "ngClass"], [1, "font-bold", "text-white", "text-sm"], [1, "text-xs", "font-normal", "text-gray-400", "block"], [1, "text-[10px]", "text-gray-500", "font-mono", "hidden", "sm:block"], [1, "md:hidden", "w-8", "h-8", "flex", "items-center", "justify-center", "bg-white/10", "rounded-full", "text-white", 3, "click"], [1, "fas", "fa-times"], [1, "p-4", "bg-blue-900/20", "text-center", "shrink-0"], [1, "grow", "overflow-y-auto", "p-4", "space-y-4", "scrollbar-thin", "scrollbar-thumb-gray-700", "scrollbar-track-transparent"], [1, "flex", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-linear-to-br", "from-blue-500", "to-purple-600", "flex", "items-center", "justify-center", "shrink-0"], [1, "fas", "fa-robot", "text-xs", "text-white"], [1, "bg-white/10", "p-3", "rounded-2xl", "rounded-tl-sm", "text-sm", "text-gray-200", "shadow-md"], [1, "flex", "gap-3", 3, "ngClass"], [1, "px-4", "py-2", "flex", "gap-2", "overflow-x-auto", "no-scrollbar", "shrink-0"], [1, "p-3", "bg-white/5", "border-t", "border-white/10", "shrink-0", "pb-6", "md:pb-3"], [1, "relative", 3, "submit"], ["type", "text", "name", "userInput", "placeholder", "Escribe tu mensaje...", 1, "w-full", "bg-black/30", "border", "border-white/10", "rounded-xl", "py-3", "pl-4", "pr-12", "text-white", "placeholder-gray-500", "focus:outline-hidden", "focus:border-blue-500/50", "transition-colors", "disabled:opacity-50", "text-sm", 3, "ngModelChange", "disabled", "ngModel"], ["type", "submit", 1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "w-8", "h-8", "bg-blue-600", "hover:bg-blue-500", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "transition-colors", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "fas", "fa-paper-plane", "text-xs"], [1, "text-xs", "text-blue-300", "mb-2"], [1, "w-full", "h-1", "bg-gray-700", "rounded-full", "overflow-hidden"], [1, "h-full", "bg-blue-500", "animate-pulse-width"], [1, "text-[10px]", "text-gray-400", "mt-2"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "shrink-0", 3, "ngClass"], [1, "text-xs", "text-white"], [1, "p-3", "rounded-2xl", "text-sm", "max-w-[80%]", "shadow-md", "whitespace-pre-wrap", 3, "ngClass"], [1, "bg-white/5", "p-3", "rounded-2xl", "rounded-tl-sm", "flex", "gap-1", "items-center", "h-10"], [1, "w-2", "h-2", "bg-gray-400", "rounded-full", "animate-bounce"], [1, "w-2", "h-2", "bg-gray-400", "rounded-full", "animate-bounce", "delay-100"], [1, "w-2", "h-2", "bg-gray-400", "rounded-full", "animate-bounce", "delay-200"], [1, "whitespace-nowrap", "px-3", "py-1", "rounded-full", "bg-white/5", "border", "border-white/10", "text-xs", "text-blue-300", "hover:bg-white/10", "transition-colors", 3, "click"], [1, "whitespace-nowrap", "px-3", "py-1", "rounded-full", "bg-white/5", "border", "border-white/10", "text-xs", "text-purple-300", "hover:bg-white/10", "transition-colors", 3, "click"], [1, "whitespace-nowrap", "px-3", "py-1", "rounded-full", "bg-white/5", "border", "border-white/10", "text-xs", "text-green-300", "hover:bg-white/10", "transition-colors", 3, "click"]], template: function AiAssistant_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "button", 1);
      \u0275\u0275listener("click", function AiAssistant_Template_button_click_0_listener() {
        return ctx.toggleChat();
      });
      \u0275\u0275conditionalCreate(1, AiAssistant_Conditional_1_Template, 1, 0, "div", 2);
      \u0275\u0275conditionalCreate(2, AiAssistant_Conditional_2_Template, 1, 0, "i", 3);
      \u0275\u0275conditionalCreate(3, AiAssistant_Conditional_3_Template, 1, 0, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, AiAssistant_Conditional_4_Template, 29, 8, "div", 5);
    }
    if (rf & 2) {
      \u0275\u0275attribute("aria-label", ctx.isOpen() ? "Cerrar asistente de IA" : "Abrir asistente de IA");
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isOpen() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isOpen() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isOpen() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isOpen() ? 4 : -1);
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm], styles: ["\n\n@keyframes _ngcontent-%COMP%_slide-up {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-slide-up[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slide-up 0.3s ease-out forwards;\n}\n@keyframes _ngcontent-%COMP%_pulse-width {\n  0% {\n    width: 0%;\n  }\n  50% {\n    width: 60%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n.animate-pulse-width[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse-width 2s infinite ease-in-out;\n}\n.glass-panel[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: rgba(156, 163, 175, 0.5);\n  border-radius: 20px;\n}\n/*# sourceMappingURL=ai-assistant.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AiAssistant, [{
    type: Component,
    args: [{ selector: "app-ai-assistant", standalone: true, imports: [CommonModule, FormsModule], template: `\r
<!-- Toggler Button -->\r
<button (click)="toggleChat()"\r
  class="fixed bottom-6 left-6 z-9999 w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"\r
  [attr.aria-label]="isOpen() ? 'Cerrar asistente de IA' : 'Abrir asistente de IA'"\r
  aria-haspopup="dialog">\r
  @if (!isOpen()) {\r
    <div class="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>\r
  }\r
  <!-- AI Icon -->\r
  @if (!isOpen()) {\r
    <i class="fas fa-microchip text-2xl group-hover:rotate-12 transition-transform"></i>\r
  }\r
  @if (isOpen()) {\r
    <i class="fas fa-times text-xl"></i>\r
  }\r
</button>\r
\r
<!-- Chat Window -->\r
@if (isOpen()) {\r
  <div\r
    class="fixed bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] h-dvh md:h-[600px] md:max-h-[80vh] z-9999 md:rounded-2xl glass-panel border-t md:border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up bg-surface-dark/95 backdrop-blur-xl">\r
    <!-- Header -->\r
    <div class="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">\r
      <div class="flex items-center gap-3">\r
        <div class="w-2 h-2 rounded-full" [ngClass]="aiService.modelLoaded() ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'"></div>\r
        <h3 class="font-bold text-white text-sm">Arecofix AI @if (aiService.isLoadingModel()) {\r
          <span class="text-xs font-normal text-gray-400 block">Iniciando Motor...</span>\r
        }</h3>\r
      </div>\r
      <div class="flex items-center gap-3">\r
        <div class="text-[10px] text-gray-500 font-mono hidden sm:block">WebLLM / MCP</div>\r
        <!-- Mobile Close Button -->\r
        <button (click)="toggleChat()" class="md:hidden w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white">\r
          <i class="fas fa-times"></i>\r
        </button>\r
      </div>\r
    </div>\r
    <!-- Progress Bar (Model Loading) -->\r
    @if (aiService.isLoadingModel()) {\r
      <div class="p-4 bg-blue-900/20 text-center shrink-0">\r
        <p class="text-xs text-blue-300 mb-2">{{ aiService.loadingProgress() }}</p>\r
        <div class="w-full h-1 bg-gray-700 rounded-full overflow-hidden">\r
          <div class="h-full bg-blue-500 animate-pulse-width"></div>\r
        </div>\r
        <p class="text-[10px] text-gray-400 mt-2">Descargando modelo IA (solo la primera vez)...</p>\r
      </div>\r
    }\r
    <!-- Messages Area -->\r
    <div class="grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" #scrollContainer>\r
      <!-- Welcome Message -->\r
      <div class="flex gap-3">\r
        <div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">\r
          <i class="fas fa-robot text-xs text-white"></i>\r
        </div>\r
        <div class="bg-white/10 p-3 rounded-2xl rounded-tl-sm text-sm text-gray-200 shadow-md">\r
          Hola! Soy tu asistente de Arecofix potenciado con IA local (WebLLM). Puedo ayudarte a consultar reparaciones, servicios o agendar citas. \xBFEn qu\xE9 te ayudo?\r
        </div>\r
      </div>\r
      @for (msg of aiService.visibleMessages(); track $index) {\r
        <div class="flex gap-3" [ngClass]="{'flex-row-reverse': msg.role === 'user'}">\r
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"\r
            [ngClass]="msg.role === 'user' ? 'bg-gray-700' : 'bg-linear-to-br from-blue-500 to-purple-600'">\r
            <i [class]="msg.role === 'user' ? 'fas fa-user' : 'fas fa-robot'" class="text-xs text-white"></i>\r
          </div>\r
          <div class="p-3 rounded-2xl text-sm max-w-[80%] shadow-md whitespace-pre-wrap"\r
            [ngClass]="msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm'">\r
            {{ msg.content }}\r
          </div>\r
        </div>\r
      }\r
      <!-- Typing Indicator -->\r
      @if (aiService.isGenerating()) {\r
        <div class="flex gap-3">\r
          <div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">\r
            <i class="fas fa-robot text-xs text-white"></i>\r
          </div>\r
          <div class="bg-white/5 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-10">\r
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>\r
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>\r
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>\r
          </div>\r
        </div>\r
      }\r
    </div>\r
    <!-- Suggestions Chips -->\r
    @if (aiService.messages().length < 2) {\r
      <div class="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">\r
        <button (click)="userInput.set('Estado de mi reparaci\xF3n'); sendMessage()" class="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-300 hover:bg-white/10 transition-colors">\r
          \u{1F527} Estado Reparaci\xF3n\r
        </button>\r
        <button (click)="userInput.set('Quiero un presupuesto web'); sendMessage()" class="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 hover:bg-white/10 transition-colors">\r
          \u{1F4BB} Presupuesto Web\r
        </button>\r
        <button (click)="userInput.set('Cambio de pantalla iPhone'); sendMessage()" class="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-green-300 hover:bg-white/10 transition-colors">\r
          \u{1F4F1} Reparar Celular\r
        </button>\r
      </div>\r
    }\r
    <!-- Input Area -->\r
    <div class="p-3 bg-white/5 border-t border-white/10 shrink-0 pb-6 md:pb-3">\r
      <form (submit)="sendMessage()" class="relative">\r
        <input\r
          type="text"\r
          [disabled]="aiService.isLoadingModel() || aiService.isGenerating()"\r
          [(ngModel)]="userInput"\r
          name="userInput"\r
          placeholder="Escribe tu mensaje..."\r
          class="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500/50 transition-colors disabled:opacity-50 text-sm">\r
          <button\r
            type="submit"\r
            [disabled]="!userInput() || aiService.isLoadingModel()"\r
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">\r
            <i class="fas fa-paper-plane text-xs"></i>\r
          </button>\r
        </form>\r
      </div>\r
    </div>\r
  }\r
`, styles: ["/* src/app/features/ai-assistant/ai-assistant.css */\n@keyframes slide-up {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.animate-slide-up {\n  animation: slide-up 0.3s ease-out forwards;\n}\n@keyframes pulse-width {\n  0% {\n    width: 0%;\n  }\n  50% {\n    width: 60%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n.animate-pulse-width {\n  animation: pulse-width 2s infinite ease-in-out;\n}\n.glass-panel {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n}\n.scrollbar-thin::-webkit-scrollbar {\n  width: 6px;\n}\n.scrollbar-thin::-webkit-scrollbar-track {\n  background: transparent;\n}\n.scrollbar-thin::-webkit-scrollbar-thumb {\n  background-color: rgba(156, 163, 175, 0.5);\n  border-radius: 20px;\n}\n/*# sourceMappingURL=ai-assistant.css.map */\n"] }]
  }], null, { scrollContainer: [{
    type: ViewChild,
    args: ["scrollContainer"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AiAssistant, { className: "AiAssistant", filePath: "src/app/features/ai-assistant/ai-assistant.ts", lineNumber: 13 });
})();

// src/app/shared/whatsapp-button/whatsapp-button.ts
var WhatsappButton = class _WhatsappButton {
  phoneNumber = environment.contact.whatsappNumber;
  defaultMessage = "Hola, necesito informaci\xF3n";
  get encodedMessage() {
    return encodeURIComponent(this.defaultMessage);
  }
  static \u0275fac = function WhatsappButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WhatsappButton)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WhatsappButton, selectors: [["app-whatsapp-button"]], inputs: { phoneNumber: "phoneNumber", defaultMessage: "defaultMessage" }, decls: 6, vars: 1, consts: [[1, "whatsapp-btn-container"], ["target", "_blank", "rel", "noopener noreferrer", "aria-label", "Contactar por WhatsApp", 1, "whatsapp-btn", 3, "href"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 24 24"], ["d", "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"], [1, "tooltip"]], template: function WhatsappButton_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "a", 1);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(2, "svg", 2);
      \u0275\u0275domElement(3, "path", 3);
      \u0275\u0275domElementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(4, "span", 4);
      \u0275\u0275text(5, "\xA1Escr\xEDbenos!");
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275domProperty("href", "https://wa.me/" + ctx.phoneNumber + "?text=" + ctx.encodedMessage, \u0275\u0275sanitizeUrl);
    }
  }, styles: ['\n\n.whatsapp-btn-container[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 25px;\n  right: 25px;\n  z-index: 99999;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  font-family: sans-serif;\n}\n.whatsapp-btn[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  background-color: #25d366;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n  position: relative;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);\n  z-index: 2;\n}\n.whatsapp-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 35px;\n  height: 35px;\n  fill: white;\n  position: relative;\n  z-index: 3;\n}\n.whatsapp-btn[_ngcontent-%COMP%]:hover {\n  background-color: #128c7e;\n  transform: scale(1.05);\n  box-shadow: 0 8px 25px rgba(18, 140, 126, 0.5);\n}\n.tooltip[_ngcontent-%COMP%] {\n  visibility: hidden;\n  opacity: 0;\n  width: 160px;\n  background-color: #075e54;\n  color: white;\n  text-align: center;\n  border-radius: 8px;\n  padding: 8px 10px;\n  position: absolute;\n  bottom: 100%;\n  right: 0;\n  margin-bottom: 15px;\n  font-size: 14px;\n  line-height: 1.4;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  transform: translateY(10px);\n  transition: all 0.3s ease;\n  pointer-events: none;\n}\n.tooltip[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 100%;\n  right: 25px;\n  border-width: 8px;\n  border-style: solid;\n  border-color: #075e54 transparent transparent transparent;\n}\n.whatsapp-btn-container[_ngcontent-%COMP%]:hover   .tooltip[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 1;\n  transform: translateY(0);\n}\n/*# sourceMappingURL=whatsapp-button.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WhatsappButton, [{
    type: Component,
    args: [{ selector: "app-whatsapp-button", standalone: true, imports: [], template: `<div class="whatsapp-btn-container">\r
    <a class="whatsapp-btn" [href]="'https://wa.me/' + phoneNumber + '?text=' + encodedMessage" target="_blank"\r
        rel="noopener noreferrer" aria-label="Contactar por WhatsApp">\r
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\r
            <path\r
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />\r
        </svg>\r
    </a>\r
    <span class="tooltip">\xA1Escr\xEDbenos!</span>\r
</div>`, styles: ['/* src/app/shared/whatsapp-button/whatsapp-button.css */\n.whatsapp-btn-container {\n  position: fixed;\n  bottom: 25px;\n  right: 25px;\n  z-index: 99999;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  font-family: sans-serif;\n}\n.whatsapp-btn {\n  width: 60px;\n  height: 60px;\n  background-color: #25d366;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-decoration: none;\n  position: relative;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);\n  z-index: 2;\n}\n.whatsapp-btn svg {\n  width: 35px;\n  height: 35px;\n  fill: white;\n  position: relative;\n  z-index: 3;\n}\n.whatsapp-btn:hover {\n  background-color: #128c7e;\n  transform: scale(1.05);\n  box-shadow: 0 8px 25px rgba(18, 140, 126, 0.5);\n}\n.tooltip {\n  visibility: hidden;\n  opacity: 0;\n  width: 160px;\n  background-color: #075e54;\n  color: white;\n  text-align: center;\n  border-radius: 8px;\n  padding: 8px 10px;\n  position: absolute;\n  bottom: 100%;\n  right: 0;\n  margin-bottom: 15px;\n  font-size: 14px;\n  line-height: 1.4;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  transform: translateY(10px);\n  transition: all 0.3s ease;\n  pointer-events: none;\n}\n.tooltip::after {\n  content: "";\n  position: absolute;\n  top: 100%;\n  right: 25px;\n  border-width: 8px;\n  border-style: solid;\n  border-color: #075e54 transparent transparent transparent;\n}\n.whatsapp-btn-container:hover .tooltip {\n  visibility: visible;\n  opacity: 1;\n  transform: translateY(0);\n}\n/*# sourceMappingURL=whatsapp-button.css.map */\n'] }]
  }], null, { phoneNumber: [{
    type: Input
  }], defaultMessage: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WhatsappButton, { className: "WhatsappButton", filePath: "src/app/shared/whatsapp-button/whatsapp-button.ts", lineNumber: 12 });
})();

// src/app/shared/components/toast/toast.component.ts
var _c02 = (a0, a1, a2) => ({ "border-l-green-500": a0, "border-l-red-500": a1, "border-l-blue-500": a2 });
var _c12 = (a0, a1, a2) => ({ "text-green-700 dark:text-green-400": a0, "text-red-700 dark:text-red-400": a1, "text-blue-700 dark:text-blue-400": a2 });
var _forTrack0 = ($index, $item) => $item.id;
function ToastComponent_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "i", 13);
    \u0275\u0275elementEnd();
  }
}
function ToastComponent_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 14);
    \u0275\u0275elementEnd();
  }
}
function ToastComponent_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 15);
    \u0275\u0275elementEnd();
  }
}
function ToastComponent_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Producto Agregado ");
  }
}
function ToastComponent_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Error ");
  }
}
function ToastComponent_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Aviso ");
  }
}
function ToastComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275listener("click", function ToastComponent_For_2_Template_div_click_0_listener() {
      const toast_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onToastClick(toast_r2));
    });
    \u0275\u0275elementStart(1, "div", 3)(2, "div", 4);
    \u0275\u0275conditionalCreate(3, ToastComponent_For_2_Conditional_3_Template, 2, 0, "div", 5)(4, ToastComponent_For_2_Conditional_4_Template, 2, 0, "div", 6)(5, ToastComponent_For_2_Conditional_5_Template, 2, 0, "div", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 8)(7, "span", 9);
    \u0275\u0275conditionalCreate(8, ToastComponent_For_2_Conditional_8_Template, 1, 0)(9, ToastComponent_For_2_Conditional_9_Template, 1, 0)(10, ToastComponent_For_2_Conditional_10_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 10);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "button", 11);
    \u0275\u0275element(14, "i", 12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(5, _c02, toast_r2.type === "success", toast_r2.type === "error", toast_r2.type === "info"));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(toast_r2.type === "success" ? 3 : toast_r2.type === "error" ? 4 : 5);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(9, _c12, toast_r2.type === "success", toast_r2.type === "error", toast_r2.type === "info"));
    \u0275\u0275advance();
    \u0275\u0275conditional(toast_r2.type === "success" ? 8 : toast_r2.type === "error" ? 9 : 10);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(toast_r2.message);
  }
}
var ToastComponent = class _ToastComponent {
  toastService = inject(ToastService);
  onToastClick(toast) {
    if (toast.action) {
      toast.action();
    }
    this.toastService.remove(toast.id);
  }
  static \u0275fac = function ToastComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToastComponent, selectors: [["app-toast"]], decls: 3, vars: 0, consts: [[1, "fixed", "top-20", "right-2", "z-9999", "flex", "flex-col", "gap-2", "pointer-events-none", "max-w-[85vw]", "sm:max-w-sm", "w-auto", "items-end"], [1, "pointer-events-auto", "transform", "transition-all", "duration-300", "animate-slide-in-down", "cursor-pointer"], [1, "pointer-events-auto", "transform", "transition-all", "duration-300", "animate-slide-in-down", "cursor-pointer", 3, "click"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-lg", "shadow-lg", "border-l-4", "overflow-hidden", "bg-white", "dark:bg-gray-900", "border-gray-200", "dark:border-gray-700", "ring-1", "ring-black/5", 3, "ngClass"], [1, "shrink-0"], [1, "w-8", "h-8", "rounded-full", "bg-green-100", "dark:bg-green-900/30", "flex", "items-center", "justify-center", "text-green-600", "dark:text-green-400"], [1, "w-8", "h-8", "rounded-full", "bg-red-100", "dark:bg-red-900/30", "flex", "items-center", "justify-center", "text-red-600", "dark:text-red-400"], [1, "w-8", "h-8", "rounded-full", "bg-blue-100", "dark:bg-blue-900/30", "flex", "items-center", "justify-center", "text-blue-600", "dark:text-blue-400"], [1, "flex", "flex-col", "flex-1", "min-w-0"], [1, "font-bold", "text-xs", "uppercase", "tracking-wider", 3, "ngClass"], [1, "text-sm", "font-medium", "text-gray-800", "dark:text-gray-100", "leading-tight"], [1, "shrink-0", "text-gray-400", "hover:text-gray-600", "dark:hover:text-gray-200", "transition-colors"], [1, "fas", "fa-times", "text-sm"], [1, "fas", "fa-check", "text-sm"], [1, "fas", "fa-exclamation", "text-sm"], [1, "fas", "fa-info", "text-sm"]], template: function ToastComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275repeaterCreate(1, ToastComponent_For_2_Template, 15, 13, "div", 1, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.toastService.toasts());
    }
  }, dependencies: [CommonModule, NgClass], styles: ["\n\n@keyframes _ngcontent-%COMP%_slideInDown {\n  from {\n    transform: translateY(-20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in-down[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideInDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\n}\n/*# sourceMappingURL=toast.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastComponent, [{
    type: Component,
    args: [{ selector: "app-toast", standalone: true, imports: [CommonModule], template: `
    <div class="fixed top-20 right-2 z-9999 flex flex-col gap-2 pointer-events-none max-w-[85vw] sm:max-w-sm w-auto items-end">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto transform transition-all duration-300 animate-slide-in-down cursor-pointer"
             (click)="onToastClick(toast)">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border-l-4 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ring-1 ring-black/5"
               [ngClass]="{
                 'border-l-green-500': toast.type === 'success',
                 'border-l-red-500': toast.type === 'error',
                 'border-l-blue-500': toast.type === 'info'
               }">
             
             <!-- Icon -->
             <div class="shrink-0">
               @if(toast.type === 'success') {
                 <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <i class="fas fa-check text-sm"></i>
                 </div>
               } @else if(toast.type === 'error') {
                 <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <i class="fas fa-exclamation text-sm"></i>
                 </div>
               } @else {
                 <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <i class="fas fa-info text-sm"></i>
                 </div>
               }
             </div>

             <!-- Message -->
             <div class="flex flex-col flex-1 min-w-0">
               <span class="font-bold text-xs uppercase tracking-wider" 
                 [ngClass]="{
                   'text-green-700 dark:text-green-400': toast.type === 'success',
                   'text-red-700 dark:text-red-400': toast.type === 'error',
                   'text-blue-700 dark:text-blue-400': toast.type === 'info'
                 }">
                 @if(toast.type === 'success') { Producto Agregado }
                 @else if(toast.type === 'error') { Error }
                 @else { Aviso }
               </span>
               <span class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{{ toast.message }}</span>
             </div>

             <!-- Close Button -->
             <button class="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               <i class="fas fa-times text-sm"></i>
             </button>
          </div>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;33d7cd8b67af687c369c5015803c0bd5bb455f08c486cb2ef7f3447a1361c58f;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/Arecofixpage/src/app/shared/components/toast/toast.component.ts */\n@keyframes slideInDown {\n  from {\n    transform: translateY(-20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.animate-slide-in-down {\n  animation: slideInDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\n}\n/*# sourceMappingURL=toast.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToastComponent, { className: "ToastComponent", filePath: "src/app/shared/components/toast/toast.component.ts", lineNumber: 72 });
})();

// src/app/app.ts
var App = class _App {
  analytics = inject(AnalyticsService);
  logger = inject(LoggerService);
  seoService = inject(SeoService);
  themeService = inject(ThemeService);
  // Ensures theme is applied before first paint
  tenantService = inject(TenantService);
  // Guardián del ecosistema SaaS
  platformId = inject(PLATFORM_ID);
  document = inject(DOCUMENT);
  ngOnInit() {
    this.seoService.initialize();
    if (isPlatformBrowser(this.platformId)) {
      const currentHost = this.document.location.hostname;
      this.tenantService.resolveTenantByHostname(currentHost).then((tenant) => {
        if (!tenant) {
          this.logger.warn("No SaaS Tenant context found for this domain!");
        }
      });
      if (currentHost === "celulares.arecofix.com.ar") {
        this.document.location.href = "https://arecofix.com.ar/celular";
        return;
      }
    }
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 4, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet")(1, "app-whatsapp-button")(2, "app-toast")(3, "app-ai-assistant");
    }
  }, dependencies: [
    RouterOutlet,
    WhatsappButton,
    ToastComponent,
    AiAssistant
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [
      RouterOutlet,
      WhatsappButton,
      ToastComponent,
      AiAssistant
    ], template: "\r\n<router-outlet />\r\n\r\n<app-whatsapp-button></app-whatsapp-button>\r\n<app-toast></app-toast>\r\n<app-ai-assistant></app-ai-assistant>\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 25 });
})();

// src/main.ts
if (environment.production) {
  enableProdMode();
}
var browserConfig = {
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
};
bootstrapApplication(App, mergeApplicationConfig(appConfig, browserConfig)).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
