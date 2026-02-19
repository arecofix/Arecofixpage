import './polyfills.server.mjs';
import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-TFR7QWGS.mjs";

// src/app/shared/services/toast.service.ts
var ToastService = class _ToastService {
  toasts = signal([], ...ngDevMode ? [{ debugName: "toasts" }] : []);
  show(message, type = "success", action) {
    const id = Date.now();
    this.toasts.update((current) => [...current, { id, message, type, action }]);
    setTimeout(() => {
      this.remove(id);
    }, 4e3);
  }
  remove(id) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ToastService
};
//# sourceMappingURL=chunk-G6NEPWSD.mjs.map
