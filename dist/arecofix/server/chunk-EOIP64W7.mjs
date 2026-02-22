import './polyfills.server.mjs';
import {
  toSignal
} from "./chunk-YV37RH2V.mjs";
import {
  ActivatedRoute
} from "./chunk-JEV3MPEL.mjs";
import {
  Injectable,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DXH6IVIR.mjs";

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
//# sourceMappingURL=chunk-EOIP64W7.mjs.map
