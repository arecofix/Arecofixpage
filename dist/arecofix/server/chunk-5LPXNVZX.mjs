import './polyfills.server.mjs';
import {
  AuthService,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import {
  LoggerService
} from "./chunk-KAY2H7H4.mjs";
import {
  Injectable,
  catchError,
  from,
  inject,
  map,
  of,
  setClassMetadata,
  switchMap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-RN3QJLYL.mjs";

// src/app/public/categories/services/category.service.ts
var CategoryService = class _CategoryService {
  authService;
  supabase;
  logger = inject(LoggerService);
  tenantService = inject(TenantService);
  constructor(authService) {
    this.authService = authService;
    this.supabase = this.authService.getSupabaseClient();
  }
  processResponse(data, count, params) {
    const totalItems = count || data.length;
    const perPage = params._per_page > 0 ? params._per_page : totalItems;
    const pages = Math.max(1, Math.ceil(totalItems / (perPage || 1)));
    return {
      first: 1,
      prev: params._page > 1 ? params._page - 1 : null,
      next: params._page < pages ? params._page + 1 : null,
      last: pages,
      pages,
      items: totalItems,
      data
    };
  }
  getData(params) {
    const { _page = 1, _per_page = 10 } = params;
    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;
    return from(this.supabase.from("categories").select("*", { count: "exact" }).eq("tenant_id", this.tenantService.getTenantId()).eq("is_active", true).range(start, end)).pipe(map(({ data, count, error }) => {
      if (error)
        throw error;
      return this.processResponse(data || [], count, { _page, _per_page });
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
    }));
  }
  getFeaturedData() {
    const _page = 1;
    const _per_page = 100;
    return from(this.supabase.from("categories").select("*", { count: "exact" }).eq("tenant_id", this.tenantService.getTenantId()).eq("is_active", true).order("name").limit(_per_page)).pipe(map(({ data, count, error }) => {
      if (error)
        throw error;
      return this.processResponse(data || [], count, { _page, _per_page });
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
    }));
  }
  /**
   * Finds a category by its URL slug.
   * Uses exact match first; falls back to case-insensitive partial match.
   * Does NOT filter by type so that the category is always found regardless
   * of whether type was set properly in the admin panel.
   */
  getDataBySlug(slug) {
    const normalizedSlug = (slug || "").trim().toLowerCase();
    const tenantId = this.tenantService.getTenantId();
    return from(this.supabase.from("categories").select("*").eq("tenant_id", tenantId).eq("slug", normalizedSlug).limit(1)).pipe(switchMap(({ data, error }) => {
      if (error) {
        this.logger.error("Supabase Error (exact slug):", error);
        return of({ data: [], error });
      }
      if (data && data.length > 0) {
        return of({ data, error: null });
      }
      return from(this.supabase.from("categories").select("*").eq("tenant_id", tenantId).ilike("slug", `%${normalizedSlug}%`).order("slug").limit(10)).pipe(map(({ data: d2, error: e2 }) => {
        if (e2)
          return { data: [], error: e2 };
        const rows = d2 || [];
        const best = rows.find((r) => r.slug.toLowerCase() === normalizedSlug) ?? rows.find((r) => r.slug.toLowerCase().startsWith(normalizedSlug)) ?? rows[0];
        return { data: best ? [best] : [], error: null };
      }));
    }), map(({ data, error }) => {
      if (error)
        throw error;
      return this.processResponse(data || [], data?.length ?? 0, { _page: 1, _per_page: 1 });
    }), catchError((err) => {
      this.logger.error("Supabase Error (slug lookup):", err);
      return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
    }));
  }
  getById(id) {
    if (!id || id === "null" || id === "0")
      return of(null);
    return from(this.supabase.from("categories").select("*").eq("tenant_id", this.tenantService.getTenantId()).eq("id", id).single()).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return data;
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of(null);
    }));
  }
  /** Returns all product-type categories for the current tenant */
  getAll() {
    return from(this.supabase.from("categories").select("*").eq("tenant_id", this.tenantService.getTenantId()).eq("is_active", true).order("name")).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return data || [];
    }), catchError((err) => {
      this.logger.error("Supabase Error getAll:", err);
      return of([]);
    }));
  }
  static \u0275fac = function CategoryService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CategoryService)(\u0275\u0275inject(AuthService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CategoryService, factory: _CategoryService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CategoryService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: AuthService }], null);
})();

export {
  CategoryService
};
//# sourceMappingURL=chunk-5LPXNVZX.mjs.map
