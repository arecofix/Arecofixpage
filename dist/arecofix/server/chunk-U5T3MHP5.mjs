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

// src/app/admin/posts/services/admin-post.service.ts
var AdminPostService = class _AdminPostService {
  auth = inject(AuthService);
  tenantService = inject(TenantService);
  supabase = this.auth.getSupabaseClient();
  async getPosts() {
    const { data, error } = await this.supabase.from("blog_posts").select("*").eq("tenant_id", this.tenantService.getTenantId()).order("created_at", { ascending: false });
    if (error)
      throw error;
    return (data || []).map((post) => this.mapToEntity(post));
  }
  async getPost(id) {
    const { data, error } = await this.supabase.from("blog_posts").select("*").eq("id", id).eq("tenant_id", this.tenantService.getTenantId()).single();
    if (error)
      throw error;
    return this.mapToEntity(data);
  }
  mapToEntity(data) {
    return __spreadProps(__spreadValues({}, data), {
      image: data.featured_image || data.image || data.image_url
    });
  }
  async createPost(payload) {
    const dbPayload = __spreadValues({}, payload);
    if (dbPayload.image) {
      dbPayload.featured_image = dbPayload.image;
      delete dbPayload.image;
    }
    delete dbPayload.meta_title;
    delete dbPayload.meta_description;
    delete dbPayload.published;
    dbPayload.tenant_id = this.tenantService.getTenantId();
    const { error } = await this.supabase.from("blog_posts").insert(dbPayload);
    if (error)
      throw error;
  }
  async updatePost(id, payload) {
    const dbPayload = __spreadValues({}, payload);
    if (dbPayload.image) {
      dbPayload.featured_image = dbPayload.image;
      delete dbPayload.image;
    }
    delete dbPayload.meta_title;
    delete dbPayload.meta_description;
    delete dbPayload.published;
    const { error } = await this.supabase.from("blog_posts").update(dbPayload).eq("id", id).eq("tenant_id", this.tenantService.getTenantId());
    if (error)
      throw error;
  }
  async deletePost(id) {
    const { error } = await this.supabase.from("blog_posts").delete().eq("id", id).eq("tenant_id", this.tenantService.getTenantId());
    if (error)
      throw error;
  }
  async uploadImage(file) {
    const filePath = `posts/${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage.from("public-assets").upload(filePath, file);
    if (error)
      throw error;
    const { data: publicUrl } = this.supabase.storage.from("public-assets").getPublicUrl(data.path);
    return publicUrl.publicUrl;
  }
  slugify(text) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "-and-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
  }
  static \u0275fac = function AdminPostService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPostService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminPostService, factory: _AdminPostService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPostService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  AdminPostService
};
//# sourceMappingURL=chunk-U5T3MHP5.mjs.map
