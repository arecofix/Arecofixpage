import './polyfills.server.mjs';
import {
  environment
} from "./chunk-PTNHDWI2.mjs";
import {
  ActivatedRoute,
  Meta,
  NavigationEnd,
  Router,
  Title,
  isPlatformServer
} from "./chunk-OW3O3C6K.mjs";
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
} from "./chunk-TFR7QWGS.mjs";

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
  }
  /**
   * Initializes the SEO service.
   * Subscribes to router events to automatically update tags.
   * Must be called once from AppComponent.
   */
  initialize() {
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), map(() => this.getContentRoute(this.activatedRoute)), filter((route) => route.outlet === "primary"), mergeMap((route) => route.data)).subscribe((data) => {
      if (data["seo"]) {
        const seoData = data["seo"];
        this.setPageData(seoData);
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(SEO_DATA_KEY, seoData);
        }
      }
    });
  }
  /**
   * Recursively traverses the route tree to find the last child (the actual page component).
   */
  getContentRoute(route) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  /**
   * Sets all SEO metadata for the current page.
   */
  setPageData(data) {
    const { title, description, imageUrl, type = "website", keywords, schema, url, author, twitterCard = "summary_large_image" } = data;
    const finalTitle = title.includes("|") || title.includes("Arecofix") ? title : `${title} | Arecofix`;
    this.titleService.setTitle(finalTitle);
    this.metaService.updateTag({ name: "description", content: description });
    if (keywords) {
      this.metaService.updateTag({ name: "keywords", content: keywords });
    }
    if (author) {
      this.metaService.updateTag({ name: "author", content: author });
    }
    const currentPath = url || this.router.url;
    const finalUrl = currentPath.startsWith("http") ? currentPath : `${environment.baseUrl}${currentPath}`;
    let finalImageUrl = "assets/img/branding/og-services.jpg";
    if (imageUrl) {
      finalImageUrl = imageUrl;
    }
    if (!finalImageUrl.startsWith("http")) {
      const cleanPath = finalImageUrl.startsWith("/") ? finalImageUrl.substring(1) : finalImageUrl;
      finalImageUrl = `${environment.baseUrl}/${cleanPath}`;
    }
    this.metaService.updateTag({ property: "og:title", content: finalTitle });
    this.metaService.updateTag({ property: "og:description", content: description });
    this.metaService.updateTag({ property: "og:type", content: type });
    this.metaService.updateTag({ property: "og:url", content: finalUrl });
    this.metaService.updateTag({ property: "og:image", content: finalImageUrl });
    if (finalImageUrl.startsWith("https")) {
      this.metaService.updateTag({ property: "og:image:secure_url", content: finalImageUrl });
    }
    this.metaService.updateTag({ property: "og:site_name", content: "Arecofix" });
    this.metaService.updateTag({ name: "twitter:card", content: twitterCard });
    this.metaService.updateTag({ name: "twitter:title", content: finalTitle });
    this.metaService.updateTag({ name: "twitter:description", content: description });
    this.metaService.updateTag({ name: "twitter:image", content: finalImageUrl });
    this.setCanonicalUrl(finalUrl);
    if (schema) {
      this.injectJsonLd(schema);
    } else {
      this.removeJsonLd();
    }
  }
  setCanonicalUrl(url) {
    let link = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      this.document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }
  injectJsonLd(schema) {
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
  removeJsonLd() {
    const script = this.document.getElementById("json-ld-schema");
    if (script) {
      script.remove();
    }
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
//# sourceMappingURL=chunk-PLK7AW4H.mjs.map
