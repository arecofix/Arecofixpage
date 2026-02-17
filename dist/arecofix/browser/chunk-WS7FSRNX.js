import {
  environment
} from "./chunk-3R5MH5C6.js";
import {
  ActivatedRoute,
  Meta,
  NavigationEnd,
  Router,
  Title,
  isPlatformServer
} from "./chunk-OCHCYWDE.js";
import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  TransferState,
  filter,
  inject,
  makeStateKey,
  map,
  mergeMap,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-K7T46PVE.js";

// src/app/core/services/seo.service.ts
var SEO_DATA_KEY = makeStateKey("SEO_DATA");
var SeoService = class _SeoService {
  titleService = inject(Title);
  metaService = inject(Meta);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  transferState = inject(TransferState);
  constructor() {
    this.init();
  }
  init() {
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), map(() => this.rootRoute(this.activatedRoute)), filter((route) => route.outlet === "primary"), mergeMap((route) => route.data)).subscribe((data) => {
      if (data["seo"]) {
        const seoData = data["seo"];
        this.setPageData(seoData);
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(SEO_DATA_KEY, seoData);
        }
      }
    });
  }
  rootRoute(route) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  resetData() {
    this.metaService.removeTag('property="product:price:amount"');
    this.metaService.removeTag('property="product:price:currency"');
    this.metaService.removeTag('property="article:published_time"');
    this.metaService.removeTag('property="article:author"');
    this.metaService.updateTag({ property: "og:type", content: "website" });
  }
  /**
   * Sets the core page metadata including Title, Description, and Canonical URL.
   * This is the entry point for basic SEO configuration per page.
   */
  setPageData(data) {
    const { title, description, imageUrl, type = "website", keywords } = data;
    this.resetData();
    const finalTitle = title.includes("|") || title.includes("Arecofix") ? title : `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);
    this.metaService.updateTag({ name: "description", content: description });
    if (keywords) {
      this.metaService.updateTag({ name: "keywords", content: keywords });
    }
    this.setSocialMediaTags({
      title: finalTitle,
      description,
      image: imageUrl || `${environment.baseUrl}/assets/img/brands/logo/logo-normal1.PNG`,
      url: this.router.url,
      type
    });
    this.setCanonicalUrl(this.router.url);
  }
  /**
   * Specifically sets Open Graph and Twitter Card metadata.
   * Crucial for WhatsApp, Facebook, and Twitter sharing previews.
   */
  setSocialMediaTags(config) {
    this.metaService.updateTag({ property: "og:title", content: config.title });
    this.metaService.updateTag({ property: "og:description", content: config.description });
    this.metaService.updateTag({ property: "og:type", content: config.type });
    this.metaService.updateTag({ property: "og:url", content: config.url.startsWith("http") ? config.url : `${environment.baseUrl}${config.url}` });
    const fullImageUrl = config.image.startsWith("http") ? config.image : `${environment.baseUrl}${config.image.startsWith("/") ? "" : "/"}${config.image}`;
    this.metaService.updateTag({ property: "og:image", content: fullImageUrl });
    if (fullImageUrl.startsWith("https")) {
      this.metaService.updateTag({ property: "og:image:secure_url", content: fullImageUrl });
    }
    this.metaService.updateTag({ name: "twitter:card", content: "summary_large_image" });
    this.metaService.updateTag({ name: "twitter:title", content: config.title });
    this.metaService.updateTag({ name: "twitter:description", content: config.description });
    this.metaService.updateTag({ name: "twitter:image", content: fullImageUrl });
  }
  setCanonicalUrl(url) {
    let link = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      this.document.head.appendChild(link);
    }
    const finalUrl = url.startsWith("http") ? url : `${environment.baseUrl}${url}`;
    link.setAttribute("href", finalUrl);
  }
  setJsonLd(schema) {
    const scriptId = "json-ld-schema";
    let script = this.document.getElementById(scriptId);
    if (!script) {
      script = this.document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }
  static \u0275fac = function SeoService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeoService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeoService, factory: _SeoService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeoService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  SeoService
};
//# sourceMappingURL=chunk-WS7FSRNX.js.map
