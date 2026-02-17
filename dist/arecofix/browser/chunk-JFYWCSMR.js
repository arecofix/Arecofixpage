import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  LoggerService
} from "./chunk-VKFH2DYL.js";
import {
  Injectable,
  catchError,
  from,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-K7T46PVE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/core/services/order.service.ts
var OrderService = class _OrderService {
  authService = inject(AuthService);
  logger = inject(LoggerService);
  supabase;
  constructor() {
    this.supabase = this.authService.getSupabaseClient();
  }
  getOrders() {
    return from(this.supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).returns()).pipe(map(({ data, error }) => {
      if (error)
        throw error;
      return (data || []).map(this.mapDbOrderToDomain);
    }), catchError((err) => {
      this.handleError("Error fetching orders", err);
      throw err;
    }));
  }
  getOrderById(id) {
    return from(Promise.all([
      this.supabase.from("orders").select("*").eq("id", id).single(),
      this.supabase.from("order_items").select("*").eq("order_id", id)
    ])).pipe(map(([orderResult, itemsResult]) => {
      if (orderResult.error)
        throw orderResult.error;
      if (itemsResult.error)
        throw itemsResult.error;
      const dbOrder = orderResult.data;
      dbOrder.order_items = itemsResult.data;
      return this.mapDbOrderToDomain(dbOrder);
    }), catchError((err) => {
      this.handleError("Error fetching order", err);
      throw err;
    }));
  }
  async createOrder(order, items) {
    try {
      const orderId = crypto.randomUUID();
      const orderNumber = `ORD-${Date.now()}`;
      const insertPayload = {
        id: orderId,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || null,
        customer_address: order.customer_address || null,
        status: order.status || "pending",
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total_amount: order.total,
        notes: order.notes || null,
        order_number: orderNumber,
        customer_id: order.customer_id || null
      };
      const { error: orderError } = await this.supabase.from("orders").insert(insertPayload);
      if (orderError)
        throw orderError;
      const itemsWithOrderId = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }));
      const { error: itemsError } = await this.supabase.from("order_items").insert(itemsWithOrderId);
      if (itemsError)
        throw itemsError;
      const orderData = __spreadProps(__spreadValues({}, order), {
        id: orderId,
        order_number: orderNumber,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      return { data: orderData, error: null };
    } catch (error) {
      this.handleError("Error creating order", error);
      return { data: null, error };
    }
  }
  async updateOrderStatus(id, status) {
    const { error } = await this.supabase.from("orders").update({ status, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
    if (error)
      this.handleError("Error updating order status", error);
    return { error };
  }
  async deleteOrder(id) {
    const { error } = await this.supabase.from("orders").delete().eq("id", id);
    if (error)
      this.handleError("Error deleting order", error);
    return { error };
  }
  async updateOrder(id, order, items) {
    try {
      const updatePayload = {
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || null,
        customer_address: order.customer_address || null,
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total_amount: order.total,
        notes: order.notes || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { data: orderData, error: orderError } = await this.supabase.from("orders").update(updatePayload).eq("id", id).select().maybeSingle();
      if (orderError)
        throw orderError;
      if (!orderData)
        throw new Error("Order not found or permission denied");
      await this.handleItemsUpdate(id, items);
      const updatedDbOrder = orderData;
      const { data: freshItems } = await this.supabase.from("order_items").select("*").eq("order_id", id);
      updatedDbOrder.order_items = freshItems;
      return { data: this.mapDbOrderToDomain(updatedDbOrder), error: null };
    } catch (error) {
      this.handleError("Error updating order", error);
      return { data: null, error };
    }
  }
  // --- Private Helper Methods ---
  async handleItemsUpdate(orderId, items) {
    const { data: existingItems, error: fetchError } = await this.supabase.from("order_items").select("id").eq("order_id", orderId);
    if (fetchError)
      throw fetchError;
    const existingIds = (existingItems || []).map((i) => i.id);
    const currentIds = items.filter((i) => i.id).map((i) => i.id);
    const idsToDelete = existingIds.filter((eid) => !currentIds.includes(eid));
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await this.supabase.from("order_items").delete().in("id", idsToDelete);
      if (deleteError)
        throw deleteError;
    }
    const itemsToUpsert = items.map((item) => __spreadProps(__spreadValues({}, item.id ? { id: item.id } : {}), {
      order_id: orderId,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      product_id: item.product_id || null
    }));
    const { error: upsertError } = await this.supabase.from("order_items").upsert(itemsToUpsert);
    if (upsertError)
      throw upsertError;
  }
  mapDbOrderToDomain(o) {
    return {
      id: o.id,
      created_at: o.created_at,
      updated_at: o.updated_at || void 0,
      order_number: o.order_number,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      customer_phone: o.customer_phone || void 0,
      customer_address: o.customer_address || void 0,
      customer_id: o.customer_id || void 0,
      status: o.status,
      subtotal: o.subtotal,
      tax: o.tax,
      discount: o.discount,
      total: o.total_amount,
      notes: o.notes || void 0,
      items: (o.order_items || []).map((i) => ({
        id: i.id,
        order_id: i.order_id,
        product_id: i.product_id || void 0,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal,
        created_at: i.created_at
      }))
    };
  }
  handleError(msg, error) {
    this.logger.error(`${msg}:`, error);
  }
  static \u0275fac = function OrderService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OrderService, factory: _OrderService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrderService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  OrderService
};
//# sourceMappingURL=chunk-JFYWCSMR.js.map
