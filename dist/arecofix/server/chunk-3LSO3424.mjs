import './polyfills.server.mjs';
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  Meta,
  NavigationEnd,
  Router,
  Title
} from "./chunk-GLYZDHZB.mjs";
import {
  isPlatformServer
} from "./chunk-NQCCIK3J.mjs";
import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  TransferState,
  filter,
  inject,
  makeStateKey,
  map,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RN3QJLYL.mjs";

// src/app/core/services/seo.service.ts
var SEO_DATA_KEY = makeStateKey("SEO_DATA");
var STATIC_SEO_CONFIG = {
  "/": {
    title: "Soluciones de Software & Consultor\xEDa IT",
    description: "Expertos en desarrollo de software a medida, aplicaciones m\xF3viles y transformaci\xF3n digital. Consultor\xEDa IT y servicio t\xE9cnico especializado en Marcos Paz.",
    imageUrl: "assets/img/branding/og-services.jpg"
  },
  "/celular": {
    title: "Reparaci\xF3n de Celulares en Marcos Paz | Servicio T\xE9cnico Arecofix",
    description: "Arreglo de pantallas, bater\xEDas y pines de carga en el acto. Calidad garantizada en Marcos Paz.",
    imageUrl: "assets/img/branding/og-celulares.jpg",
    keywords: "reparacion de celulares marcos paz, servicio tecnico celulares, arreglo de pantallas, cambio de bateria, arecofix"
  },
  "/contacto": {
    title: "Contacto | Arecofix - Estamos para Ayudarte",
    description: "\xBFTen\xE9s alguna consulta o necesit\xE1s soporte t\xE9cnico? Cont\xE1ctanos por WhatsApp, Email o visitanos en nuestro local.",
    imageUrl: "assets/img/branding/og-contact.jpg"
  },
  "/servicios": {
    title: "Servicios de Tecnolog\xEDa y Reparaci\xF3n | Arecofix",
    description: "Soluciones integrales: Reparaci\xF3n de Celulares, Desarrollo de Software, C\xE1maras de Seguridad y Soporte IT para empresas.",
    imageUrl: "assets/img/branding/og-services.jpg",
    keywords: "servicios informaticos, reparacion celulares, desarrollo software, soporte it, camaras seguridad"
  },
  "/nosotros": {
    title: "Sobre Nosotros | Arecofix - Innovaci\xF3n y Compromiso",
    description: "Conoc\xE9 al equipo detr\xE1s de Arecofix. Somos expertos en tecnolog\xEDa comprometidos con brindar soluciones de calidad en Marcos Paz.",
    imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
  },
  "/academy": {
    title: "Arecofix Academy | Cursos de Tecnolog\xEDa",
    description: "Aprend\xE9 reparaci\xF3n de celulares, programaci\xF3n y m\xE1s con nuestros cursos presenciales y online.",
    imageUrl: "assets/img/branding/logo/logo-normal1.PNG"
  }
};
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
   */
  initialize() {
    if (!isPlatformServer(this.platformId)) {
      const serverSeoData = this.transferState.get(SEO_DATA_KEY, null);
      if (serverSeoData) {
        this.setPageData(serverSeoData);
      }
    } else {
      const initialUrl = this.router.url.split("?")[0];
      if (STATIC_SEO_CONFIG[initialUrl]) {
        this.setPageData(STATIC_SEO_CONFIG[initialUrl]);
      }
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), map((event) => event.urlAfterRedirects.split("?")[0])).subscribe((currentPath) => {
      let seoData = STATIC_SEO_CONFIG[currentPath];
      if (!seoData) {
        const routeData = this.getContentRoute(this.activatedRoute).snapshot.data;
        if (routeData && routeData["seo"]) {
          seoData = routeData["seo"];
        }
      }
      if (!seoData) {
        seoData = {
          title: "Arecofix - Servicio T\xE9cnico de Celulares y Soluciones IT",
          description: "Experto en reparaci\xF3n de celulares en el acto, desarrollo web y transformaci\xF3n digital en Marcos Paz.",
          imageUrl: "assets/img/branding/og-services.jpg"
        };
      }
      if (seoData) {
        if (!isPlatformServer(this.platformId) && this.transferState.hasKey(SEO_DATA_KEY)) {
          this.transferState.remove(SEO_DATA_KEY);
          return;
        }
        this.setPageData(seoData);
      } else {
        if (!isPlatformServer(this.platformId) && this.transferState.hasKey(SEO_DATA_KEY)) {
          this.transferState.remove(SEO_DATA_KEY);
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
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(SEO_DATA_KEY, data);
    }
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
    const currentPath = url || this.router.url.split("?")[0];
    const finalUrl = currentPath.startsWith("http") ? currentPath : `${environment.baseUrl}${currentPath}`;
    let finalImageUrl = `${environment.baseUrl}/assets/img/branding/og-services.jpg`;
    if (imageUrl) {
      if (imageUrl.startsWith("http")) {
        finalImageUrl = imageUrl;
      } else {
        const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
        finalImageUrl = `${environment.baseUrl}/${cleanPath}`;
      }
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
//# sourceMappingURL=chunk-3LSO3424.mjs.map
