import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-XXRJQVX5.mjs";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-TFR7QWGS.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/features/posts/application/post.service.ts
var PostService = class _PostService {
  auth = inject(AuthService);
  supabase = this.auth.getSupabaseClient();
  async getPostBySlug(slug) {
    const { data, error } = await this.supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
    if (error) {
      console.error("PostService Error:", error);
      throw error;
    }
    if (!data)
      return null;
    return this.mapToEntity(data);
  }
  async getRecentPosts(limit = 5) {
    const { data, error } = await this.supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error)
      throw error;
    return (data || []).map((item) => this.mapToEntity(item));
  }
  mapToEntity(data) {
    const rawImage = data.featured_image || data.image || data.image_url;
    return __spreadProps(__spreadValues({}, data), {
      // Robustly map image from possible DB fields
      image: this.getImageUrl(rawImage)
    });
  }
  getImageUrl(pathOrUrl) {
    if (!pathOrUrl)
      return null;
    if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("assets/"))
      return pathOrUrl;
    if (pathOrUrl.includes("public-assets/")) {
      return this.supabase.storage.from("public-assets").getPublicUrl(pathOrUrl.split("public-assets/")[1]).data.publicUrl;
    }
    return this.supabase.storage.from("public-assets").getPublicUrl(pathOrUrl).data.publicUrl;
  }
  static \u0275fac = function PostService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PostService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PostService, factory: _PostService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PostService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  PostService
};
//# sourceMappingURL=chunk-NMJUXIOM.mjs.map
