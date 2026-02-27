import './polyfills.server.mjs';
import {
  AuthService,
  SUPABASE_CLIENT,
  TenantService
} from "./chunk-EIU5CNMA.mjs";
import {
  LoggerService
} from "./chunk-KAY2H7H4.mjs";
import {
  Injectable,
  catchError,
  from,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-TB3YAHZW.mjs";

// src/app/core/services/order.service.ts
var OrderService = class _OrderService {
  supabase = inject(SUPABASE_CLIENT);
  logger = inject(LoggerService);
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  useSoftDeletes = true;
  applyTenantFilter(query) {
    let enhancedQuery = query.eq("tenant_id", this.tenantService.getTenantId());
    if (this.useSoftDeletes) {
      enhancedQuery = enhancedQuery.is("deleted_at", null);
    }
    return enhancedQuery;
  }
  getOrders() {
    let query = this.supabase.from("orders").select("id, order_number, customer_name, customer_email, customer_phone, shipping_address, status, subtotal, tax, discount, total_amount, notes, user_id, tenant_id, created_at, updated_at, deleted_at, payment_method, order_items(id, order_id, product_id, course_id, product_name, quantity, unit_price, subtotal, tenant_id, created_at)");
    let filteredQuery = this.applyTenantFilter(query).order("created_at", { ascending: false });
    return from(filteredQuery).pipe(map((res) => {
      const { data, error } = res;
      if (error)
        throw error;
      return (data || []).map((o) => this.mapDbOrderToDomain(o));
    }), catchError((err) => {
      this.handleError("Error fetching orders", err);
      throw err;
    }));
  }
  getOrderById(id) {
    return from(Promise.all([
      this.applyTenantFilter(this.supabase.from("orders").select("id, order_number, customer_name, customer_email, customer_phone, shipping_address, status, subtotal, tax, discount, total_amount, notes, user_id, tenant_id, created_at, updated_at, deleted_at, payment_method").eq("id", id)).single(),
      this.supabase.from("order_items").select("id, order_id, product_id, course_id, product_name, quantity, unit_price, subtotal, tenant_id, created_at").eq("order_id", id).eq("tenant_id", this.tenantService.getTenantId())
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
      const user = this.auth.getCurrentUser();
      const orderId = crypto.randomUUID();
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const tenantId = this.tenantService.getTenantId();
      const insertPayload = {
        id: orderId,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || null,
        shipping_address: order.shipping_address || null,
        status: order.status || "pending",
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total || order.total_amount,
        total_amount: order.total || order.total_amount,
        notes: order.notes || null,
        payment_method: order.payment_method || null,
        order_number: orderNumber,
        user_id: order.user_id || null,
        tenant_id: tenantId
      };
      const { error: orderError } = await this.supabase.from("orders").insert(insertPayload);
      if (orderError)
        throw orderError;
      const itemsWithOrderId = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id || null,
        course_id: item.course_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        tenant_id: tenantId
      }));
      const { error: itemsError } = await this.supabase.from("order_items").insert(itemsWithOrderId);
      if (itemsError)
        throw itemsError;
      const orderData = __spreadProps(__spreadValues({}, order), {
        id: orderId,
        order_number: orderNumber,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        tenant_id: tenantId
      });
      return { data: orderData, error: null };
    } catch (error) {
      this.handleError("Critical error creating order", error);
      return { data: null, error };
    }
  }
  async updateOrderStatus(id, status) {
    let query = this.supabase.from("orders").update({ status, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
    const { error, data } = await this.applyTenantFilter(query).select("id, status");
    if (error)
      this.handleError("Error updating order status", error);
    if (!error && (!data || data.length === 0)) {
      return { error: new Error("Supabase RLS Error: Permission denied or Record filtered out.") };
    }
    return { error };
  }
  async deleteOrder(id) {
    let query = this.supabase.from("orders").delete().eq("id", id);
    const { error } = await this.applyTenantFilter(query);
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
        shipping_address: order.shipping_address || null,
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total || order.total_amount,
        total_amount: order.total || order.total_amount,
        notes: order.notes || null,
        payment_method: order.payment_method || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      let query = this.supabase.from("orders").update(updatePayload).eq("id", id);
      const { error: orderError, data: updatedOrdersData } = await this.applyTenantFilter(query).select("id");
      if (orderError)
        throw orderError;
      if (!updatedOrdersData || updatedOrdersData.length === 0) {
        throw new Error("Supabase RLS Error: Permission denied or Record filtered out.");
      }
      await this.handleItemsUpdate(id, items);
      return { data: __spreadProps(__spreadValues({}, order), { id }), error: null };
    } catch (error) {
      this.handleError("Error updating order", error);
      return { data: null, error };
    }
  }
  async handleItemsUpdate(orderId, items) {
    const tenantId = this.tenantService.getTenantId();
    const { error: deleteError } = await this.supabase.from("order_items").delete().eq("order_id", orderId).eq("tenant_id", tenantId);
    if (deleteError)
      throw deleteError;
    const itemsToInsert = items.map((item) => ({
      order_id: orderId,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      product_id: item.product_id || null,
      course_id: item.course_id || null,
      tenant_id: tenantId
    }));
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await this.supabase.from("order_items").insert(itemsToInsert);
      if (insertError)
        throw insertError;
    }
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
      shipping_address: o.shipping_address || o.customer_address || void 0,
      user_id: o.user_id || o.customer_id || void 0,
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
        course_id: i.course_id || void 0,
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
  }], null, null);
})();

export {
  OrderService
};
//# sourceMappingURL=chunk-SNVNB3OR.mjs.map
