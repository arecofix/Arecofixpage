import './polyfills.server.mjs';
import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-DXH6IVIR.mjs";

// src/app/core/services/notification.service.ts
var NotificationService = class _NotificationService {
  notifications = signal([], ...ngDevMode ? [{ debugName: "notifications" }] : []);
  notifications$ = this.notifications.asReadonly();
  /**
   * Show success notification
   */
  showSuccess(message, duration = 3e3) {
    this.show("success", message, duration);
  }
  /**
   * Show error notification
   */
  showError(message, duration = 5e3) {
    this.show("error", message, duration);
  }
  /**
   * Show warning notification
   */
  showWarning(message, duration = 4e3) {
    this.show("warning", message, duration);
  }
  /**
   * Show info notification
   */
  showInfo(message, duration = 3e3) {
    this.show("info", message, duration);
  }
  /**
   * Show notification
   */
  show(type, message, duration) {
    const notification = {
      id: this.generateId(),
      type,
      message,
      duration
    };
    this.notifications.update((notifications) => [...notifications, notification]);
    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }
  /**
   * Remove notification by ID
   */
  remove(id) {
    this.notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }
  /**
   * Clear all notifications
   */
  clearAll() {
    this.notifications.set([]);
  }
  /**
   * Generate unique ID
   */
  generateId() {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  static \u0275fac = function NotificationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationService, factory: _NotificationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  NotificationService
};
//# sourceMappingURL=chunk-GBKHDUJJ.mjs.map
