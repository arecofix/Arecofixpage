import {
  CommonModule,
  NgForOf
} from "./chunk-OCHCYWDE.js";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-K7T46PVE.js";

// src/app/shared/components/certificate-gallery/certificate-gallery.component.ts
function CertificateGalleryComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "img", 8);
    \u0275\u0275elementStart(2, "div", 9)(3, "span", 10);
    \u0275\u0275text(4, "Ver Certificado");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const image_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", image_r1.src, \u0275\u0275sanitizeUrl)("alt", "Certificate " + image_r1.id);
  }
}
var CertificateGalleryComponent = class _CertificateGalleryComponent {
  title = "Nuestros Certificados";
  images = [
    { id: 1, src: "assets/img/cursos/certiicate/1.jpg" },
    { id: 2, src: "assets/img/cursos/certiicate/2.jpg" },
    { id: 3, src: "assets/img/cursos/certiicate/3.jpg" },
    { id: 4, src: "assets/img/cursos/certiicate/4.jpg" },
    { id: 5, src: "assets/img/cursos/certiicate/python.jpg" }
  ];
  static \u0275fac = function CertificateGalleryComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CertificateGalleryComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CertificateGalleryComponent, selectors: [["app-certificate-gallery"]], inputs: { title: "title" }, decls: 8, vars: 2, consts: [[1, "py-12", "bg-white", "dark:bg-white/5", "backdrop-blur-sm", "rounded-xl"], [1, "container", "mx-auto", "px-4"], [1, "text-center", "mb-10"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white", "mb-4"], [1, "w-24", "h-1", "bg-blue-600", "mx-auto", "rounded-full"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-3", "md:gap-6"], ["class", "group relative aspect-4/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300", 4, "ngFor", "ngForOf"], [1, "group", "relative", "aspect-4/3", "rounded-xl", "overflow-hidden", "shadow-lg", "hover:shadow-2xl", "transition-all", "duration-300"], [1, "w-full", "h-full", "object-cover", "transform", "group-hover:scale-110", "transition-transform", "duration-500", 3, "src", "alt"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-black/60", "to-transparent", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300", "flex", "items-end", "justify-center", "pb-4"], [1, "text-white", "font-medium", "px-4", "py-2", "bg-white/20", "backdrop-blur-md", "rounded-lg"]], template: function CertificateGalleryComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275template(7, CertificateGalleryComponent_div_7_Template, 5, 2, "div", 6);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.title);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.images);
    }
  }, dependencies: [CommonModule, NgForOf], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CertificateGalleryComponent, [{
    type: Component,
    args: [{ selector: "app-certificate-gallery", standalone: true, imports: [CommonModule], template: `
    <section class="py-12 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div *ngFor="let image of images" class="group relative aspect-4/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <img [src]="image.src" 
                 [alt]="'Certificate ' + image.id" 
                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span class="text-white font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">Ver Certificado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  ` }]
  }], null, { title: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CertificateGalleryComponent, { className: "CertificateGalleryComponent", filePath: "src/app/shared/components/certificate-gallery/certificate-gallery.component.ts", lineNumber: 31 });
})();

export {
  CertificateGalleryComponent
};
//# sourceMappingURL=chunk-K5QCFEEA.js.map
