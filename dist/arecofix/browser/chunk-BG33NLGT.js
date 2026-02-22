import {
  ProductRepository
} from "./chunk-GR2FBAX3.js";
import {
  LoggerService
} from "./chunk-4WZKXYCH.js";
import {
  Injectable,
  catchError,
  inject,
  of,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-TQTEFGZE.js";

// src/app/public/products/services/product.service.ts
var ProductService = class _ProductService {
  logger = inject(LoggerService);
  repository = inject(ProductRepository);
  constructor() {
  }
  getData(params = {}) {
    return this.repository.findWithFilters(params).pipe(catchError((err) => {
      this.logger.error("ProductService query error", err);
      return of({
        first: 1,
        prev: void 0,
        next: void 0,
        last: 1,
        pages: 1,
        items: 0,
        data: []
      });
    }));
  }
  updateProduct(id, data) {
    return this.repository.update(id, data).pipe(catchError((err) => {
      this.logger.error("ProductService update error", err);
      throw err;
    }));
  }
  static \u0275fac = function ProductService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProductService, factory: _ProductService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  ProductService
};
//# sourceMappingURL=chunk-BG33NLGT.js.map
