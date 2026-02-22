import {
  AuthService
} from "./chunk-MZTEREIC.js";
import {
  LoggerService
} from "./chunk-4WZKXYCH.js";
import {
  Injectable,
  catchError,
  from,
  inject,
  map,
  of,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TQTEFGZE.js";

// src/app/public/categories/services/category.service.ts
var CategoryService = class _CategoryService {
  authService;
  supabase;
  logger = inject(LoggerService);
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
    return from(this.supabase.from("categories").select("*", { count: "exact" }).eq("is_active", true).range(start, end)).pipe(map(({ data, count, error }) => {
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
    return from(this.supabase.from("categories").select("*", { count: "exact" }).eq("is_active", true).order("name").limit(_per_page)).pipe(map(({ data, count, error }) => {
      if (error)
        throw error;
      return this.processResponse(data || [], count, { _page, _per_page });
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
    }));
  }
  getDataBySlug(slug) {
    return from(this.supabase.from("categories").select("*").ilike("slug", slug).limit(1)).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return this.processResponse(data || [], data?.length || 0, { _page: 1, _per_page: 1 });
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of({ first: 1, prev: null, next: null, last: 1, pages: 1, items: 0, data: [] });
    }));
  }
  getById(id) {
    if (!id || id === "null")
      return of(null);
    return from(this.supabase.from("categories").select("*").eq("id", id).single()).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return data;
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
      return of(null);
    }));
  }
  getAll() {
    return from(this.supabase.from("categories").select("*").eq("is_active", true).order("name")).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return data || [];
    }), catchError((err) => {
      this.logger.error("Supabase Error:", err);
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
//# sourceMappingURL=chunk-PUJEUZQG.js.map
