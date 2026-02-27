import {
  RepairStatus
} from "./chunk-U4PZDU6F.js";
import {
  RepairRepository
} from "./chunk-MLWSDCGA.js";
import {
  AuthService
} from "./chunk-2WW63FQH.js";
import {
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-DPJFS6PI.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/features/repairs/application/services/admin-repair.service.ts
var AdminRepairService = class _AdminRepairService {
  repository = inject(RepairRepository);
  auth = inject(AuthService);
  // Status logic
  STATUS_DELIVERED = RepairStatus.DELIVERED;
  STATUS_CANCELLED = RepairStatus.CANCELLED;
  async getById(id) {
    return firstValueFrom(this.repository.getById(id));
  }
  async getAdminList(limit, offset) {
    const user = this.auth.getCurrentUser();
    if (!user)
      throw new Error("Usuario no autenticado");
    const profile = await this.auth.getUserProfile(user.id);
    const branch_id = profile?.branch_id;
    return firstValueFrom(this.repository.getAdminList({ branch_id, limit, offset }));
  }
  async delete(id) {
    await firstValueFrom(this.repository.delete(id));
  }
  async create(dto) {
    const user = this.auth.getCurrentUser();
    if (!user)
      throw new Error("Usuario no autenticado");
    const profile = await this.auth.getUserProfile(user.id);
    if (!profile)
      throw new Error("Perfil no encontrado");
    const payload = __spreadProps(__spreadValues({}, dto), {
      branch_id: profile.branch_id,
      received_by: user.id,
      assigned_technician_id: dto.assigned_technician_id || user.id,
      tracking_code: this.generateTrackingCode()
    });
    if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
      payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    return firstValueFrom(this.repository.create(payload));
  }
  async update(id, dto) {
    const payload = __spreadValues({}, dto);
    if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
      if (!payload.completed_at) {
        payload.completed_at = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    await firstValueFrom(this.repository.update(id, payload));
  }
  async uploadImage(file) {
    return this.repository.uploadImage(file);
  }
  generateTrackingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
  }
  isFinalStatus(statusId) {
    return statusId === this.STATUS_DELIVERED || statusId === this.STATUS_CANCELLED;
  }
  static \u0275fac = function AdminRepairService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminRepairService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminRepairService, factory: _AdminRepairService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminRepairService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AdminRepairService
};
//# sourceMappingURL=chunk-2DAVW2HS.js.map
