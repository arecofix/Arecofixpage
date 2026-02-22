import './polyfills.server.mjs';
import {
  ToastService
} from "./chunk-EJ6NDVRN.mjs";
import {
  LoggerService
} from "./chunk-ME5JAH3I.mjs";
import {
  isPlatformBrowser
} from "./chunk-JEV3MPEL.mjs";
import {
  Injectable,
  PLATFORM_ID,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-DXH6IVIR.mjs";

// src/app/shared/services/favorites.service.ts
var FavoritesService = class _FavoritesService {
  logger = inject(LoggerService);
  toastService = inject(ToastService);
  platformId = inject(PLATFORM_ID);
  // Store array of products
  favorites = signal([], ...ngDevMode ? [{ debugName: "favorites" }] : []);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        try {
          this.favorites.set(JSON.parse(savedFavorites));
        } catch (e) {
          console.error("Error parsing favorites", e);
          this.favorites.set([]);
        }
      }
    }
    effect(() => {
      const currentFavorites = this.favorites();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
      }
    });
  }
  toggleFavorite(product) {
    const exists = this.isFavorite(product.id);
    if (exists) {
      this.removeFavorite(product.id);
    } else {
      this.addFavorite(product);
    }
  }
  addFavorite(product) {
    this.favorites.update((items) => {
      if (items.some((i) => i.id === product.id))
        return items;
      return [...items, product];
    });
    this.logger.debug("Product added to favorites", { productName: product.name });
    this.toastService.show("Agregado a favoritos", "success");
  }
  removeFavorite(productId) {
    this.favorites.update((items) => items.filter((i) => i.id !== productId));
    this.logger.debug("Product removed from favorites", { productId });
    this.toastService.show("Eliminado de favoritos", "info");
  }
  isFavorite(productId) {
    return this.favorites().some((p) => p.id === productId);
  }
  static \u0275fac = function FavoritesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FavoritesService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FavoritesService, factory: _FavoritesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FavoritesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  FavoritesService
};
//# sourceMappingURL=chunk-5AQPEGWT.mjs.map
