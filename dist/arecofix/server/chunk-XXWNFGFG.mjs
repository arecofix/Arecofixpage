import './polyfills.server.mjs';
import {
  ProductRepository
} from "./chunk-XSIYETXB.mjs";
import {
  LoggerService
} from "./chunk-KAY2H7H4.mjs";
import {
  Injectable,
  catchError,
  inject,
  of,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";

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
//# sourceMappingURL=chunk-XXWNFGFG.mjs.map
