import './polyfills.server.mjs';
import {
  AuthService,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/core/services/company.service.ts
var CompanyService = class _CompanyService {
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  supabase = this.auth.getSupabaseClient();
  async getSettings() {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase.from("tenants").select("*").eq("id", tenantId).maybeSingle();
    if (error)
      throw error;
    if (data) {
      return __spreadProps(__spreadValues({}, data), {
        address: data.location || "",
        email: data.contact_email || "",
        phone: data.contact_phone || "",
        logo_url: data.branding_settings?.logo_url || ""
      });
    }
    return data;
  }
  static \u0275fac = function CompanyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CompanyService, factory: _CompanyService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  CompanyService
};
//# sourceMappingURL=chunk-BBYC5QHM.mjs.map
