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
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";

// src/app/core/services/contact.service.ts
var ContactService = class _ContactService {
  authService = inject(AuthService);
  logger = inject(LoggerService);
  tenantService = inject(TenantService);
  supabase;
  constructor() {
    this.supabase = this.authService.getSupabaseClient();
  }
  async createMessage(msg) {
    try {
      const payload = {
        name: msg.name,
        email: msg.email,
        phone: msg.phone || null,
        subject: msg.subject || null,
        message: msg.message,
        is_read: false,
        tenant_id: this.tenantService.getTenantId()
      };
      const { error } = await this.supabase.from("contact_messages").insert(payload);
      if (error) {
        this.logger.error("Supabase ContactService Error:", error);
      }
      return { error };
    } catch (e) {
      this.logger.error("ContactService Exception:", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      const pgError = {
        message: errorMessage,
        details: "",
        hint: "",
        code: "UNKNOWN",
        name: "PostgrestError"
      };
      return { error: pgError };
    }
  }
  static \u0275fac = function ContactService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ContactService, factory: _ContactService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  ContactService
};
//# sourceMappingURL=chunk-J2BN55TP.mjs.map
