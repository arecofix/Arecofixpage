import './polyfills.server.mjs';
import {
  AuthService,
  SUPABASE_CLIENT,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import {
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/core/services/notification.service.ts
var NotificationService = class _NotificationService {
  // ---- Toast Notifications (Existing) ----
  notifications = signal([], ...ngDevMode ? [{ debugName: "notifications" }] : []);
  notifications$ = this.notifications.asReadonly();
  // ---- DB Bell Notifications (New) ----
  supabase = inject(SUPABASE_CLIENT);
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  _dbNotifications = signal([], ...ngDevMode ? [{ debugName: "_dbNotifications" }] : []);
  dbNotifications = this._dbNotifications.asReadonly();
  _unreadCount = signal(0, ...ngDevMode ? [{ debugName: "_unreadCount" }] : []);
  unreadCount = this._unreadCount.asReadonly();
  realtimeChannel;
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
  // ============================================
  //         DB BELL NOTIFICATIONS METHODS
  // ============================================
  async loadNotifications() {
    const user = this.auth.getCurrentUser();
    if (!user)
      return;
    const { data, error } = await this.supabase.from("notifications").select("*").eq("user_id", user.id).eq("tenant_id", this.tenantService.getTenantId()).order("created_at", { ascending: false }).limit(50);
    if (!error && data) {
      this._dbNotifications.set(data);
      this._unreadCount.set(data.filter((n) => !n.is_read).length);
    }
  }
  async markAsRead(notificationId) {
    const { error } = await this.supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);
    if (!error) {
      this._dbNotifications.update((nots) => nots.map((n) => n.id === notificationId ? __spreadProps(__spreadValues({}, n), { is_read: true }) : n));
      this._unreadCount.update((count) => Math.max(0, count - 1));
    }
  }
  async markAllAsRead() {
    const user = this.auth.getCurrentUser();
    if (!user)
      return;
    const { error } = await this.supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    if (!error) {
      this._dbNotifications.update((nots) => nots.map((n) => __spreadProps(__spreadValues({}, n), { is_read: true })));
      this._unreadCount.set(0);
    }
  }
  subscribeToRealtime() {
    const user = this.auth.getCurrentUser();
    if (!user)
      return;
    this.realtimeChannel = this.supabase.channel("public:notifications").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      const newNotif = payload.new;
      this._dbNotifications.update((nots) => [newNotif, ...nots]);
      this._unreadCount.update((count) => count + 1);
      this.showInfo(newNotif.title + " - " + newNotif.message);
    }).subscribe();
  }
  unsubscribe() {
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
    }
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
//# sourceMappingURL=chunk-NQ4N4CVM.mjs.map
