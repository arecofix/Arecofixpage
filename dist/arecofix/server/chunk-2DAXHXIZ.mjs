import './polyfills.server.mjs';
import {
  environment
} from "./chunk-PTNHDWI2.mjs";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-TFR7QWGS.mjs";

// src/app/core/services/logger.service.ts
var LoggerService = class _LoggerService {
  isProduction = environment.production;
  /**
   * Log debug information (only in development)
   */
  debug(message, data) {
    if (!this.isProduction) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  }
  /**
   * Log informational messages
   */
  info(message, data) {
    if (!this.isProduction) {
      console.info(`[INFO] ${message}`, data || "");
    }
  }
  /**
   * Log warnings (shown in all environments)
   */
  warn(message, data) {
    console.warn(`[WARN] ${message}`, data || "");
  }
  /**
   * Log errors (shown in all environments)
   */
  error(message, error) {
    console.error(`[ERROR] ${message}`, error || "");
    if (this.isProduction) {
      this.sendToMonitoring(message, error);
    }
  }
  /**
   * Send errors to monitoring service (PostHog, Sentry, etc.)
   */
  sendToMonitoring(message, error) {
  }
  /**
   * Log performance metrics
   */
  performance(label, duration) {
    if (!this.isProduction) {
      console.log(`[PERF] ${label}: ${duration}ms`);
    }
  }
  /**
   * Create a performance timer
   */
  startTimer(label) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.performance(label, duration);
    };
  }
  static \u0275fac = function LoggerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoggerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoggerService, factory: _LoggerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoggerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  LoggerService
};
//# sourceMappingURL=chunk-2DAXHXIZ.mjs.map
