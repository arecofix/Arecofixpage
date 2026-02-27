// src/app/features/repairs/domain/entities/repair.entity.ts
var RepairStatus;
(function(RepairStatus2) {
  RepairStatus2[RepairStatus2["PENDING_DIAGNOSIS"] = 1] = "PENDING_DIAGNOSIS";
  RepairStatus2[RepairStatus2["SUPPLY_MANAGEMENT"] = 2] = "SUPPLY_MANAGEMENT";
  RepairStatus2[RepairStatus2["IN_PROGRESS"] = 3] = "IN_PROGRESS";
  RepairStatus2[RepairStatus2["QUALITY_CONTROL"] = 4] = "QUALITY_CONTROL";
  RepairStatus2[RepairStatus2["READY_FOR_PICKUP"] = 5] = "READY_FOR_PICKUP";
  RepairStatus2[RepairStatus2["DELIVERED"] = 6] = "DELIVERED";
  RepairStatus2[RepairStatus2["CANCELLED"] = 7] = "CANCELLED";
})(RepairStatus || (RepairStatus = {}));

export {
  RepairStatus
};
//# sourceMappingURL=chunk-U4PZDU6F.js.map
