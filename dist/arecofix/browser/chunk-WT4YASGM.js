import {
  AuthService
} from "./chunk-NJJ5IL4Q.js";
import {
  LoggerService
} from "./chunk-O2ZTZE6T.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XQFVERLD.js";

// src/app/core/services/contact.service.ts
var ContactService = class _ContactService {
  authService = inject(AuthService);
  logger = inject(LoggerService);
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
        is_read: false
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
//# sourceMappingURL=chunk-WT4YASGM.js.map
