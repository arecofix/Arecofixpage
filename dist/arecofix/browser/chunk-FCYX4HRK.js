import {
  toSignal
} from "./chunk-UPERU5DK.js";
import {
  ActivatedRoute
} from "./chunk-WHLM5VZW.js";
import {
  Injectable,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XQFVERLD.js";

// src/app/shared/components/pagination/pagination.service.ts
var PaginationService = class _PaginationService {
  activatedRoute = inject(ActivatedRoute);
  currentPage = toSignal(this.activatedRoute.queryParamMap.pipe(map((params) => params.get("_page") ? +params.get("_page") : 1), map((page) => isNaN(page) ? 1 : page)), {
    initialValue: 1
  });
  static \u0275fac = function PaginationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PaginationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PaginationService, factory: _PaginationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  PaginationService
};
//# sourceMappingURL=chunk-FCYX4HRK.js.map
