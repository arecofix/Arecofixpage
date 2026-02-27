import {
  ToastService
} from "./chunk-CM6ZIEXS.js";
import {
  LoggerService
} from "./chunk-RNDQ5ZF4.js";
import {
  isPlatformBrowser
} from "./chunk-F32QBW3I.js";
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-DPJFS6PI.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-46DXP6YY.js";

// src/app/shared/services/cart.service.ts
var CartService = class _CartService {
  logger = inject(LoggerService);
  toastService = inject(ToastService);
  platformId = inject(PLATFORM_ID);
  cartItems = signal([], ...ngDevMode ? [{ debugName: "cartItems" }] : []);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            this.cartItems.set(parsed.filter((item) => item && item.product && item.product.id));
          } else {
            this.cartItems.set([]);
          }
        } catch (e) {
          this.cartItems.set([]);
        }
      }
    }
    effect(() => {
      const currentCart = this.cartItems();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem("cart", JSON.stringify(currentCart));
      }
    });
  }
  addToCart(product) {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return items.map((item) => item.product.id === product.id ? __spreadProps(__spreadValues({}, item), { quantity: item.quantity + 1 }) : item);
      }
      return [...items, { product, quantity: 1 }];
    });
    this.logger.debug("Product added to cart", { productName: product.name });
    this.toastService.show("Agregaste un producto al carrito", "success", () => this.openCart());
  }
  removeFromCart(productId) {
    this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));
  }
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update((items) => items.map((item) => item.product.id === productId ? __spreadProps(__spreadValues({}, item), { quantity }) : item));
  }
  clearCart() {
    this.cartItems.set([]);
  }
  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + (item.quantity || 0), 0), ...ngDevMode ? [{ debugName: "totalItems" }] : []);
  totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0), 0), ...ngDevMode ? [{ debugName: "totalPrice" }] : []);
  // Cart Visibility State
  isCartOpen = signal(false, ...ngDevMode ? [{ debugName: "isCartOpen" }] : []);
  openCart() {
    this.isCartOpen.set(true);
  }
  closeCart() {
    this.isCartOpen.set(false);
  }
  toggleCart() {
    this.isCartOpen.update((v) => !v);
  }
  static \u0275fac = function CartService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CartService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CartService, factory: _CartService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CartService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  CartService
};
//# sourceMappingURL=chunk-E27AYZUW.js.map
