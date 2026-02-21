import './polyfills.server.mjs';
import {
  PostService
} from "./chunk-RU5NTK7S.mjs";
import {
  SeoService
} from "./chunk-66CEOCL3.mjs";
import "./chunk-ZWWV2735.mjs";
import "./chunk-7NQOFK7J.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  DatePipe,
  RouterLink
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵinterpolate,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/public/blog/blog.component.ts
var _c0 = (a0) => ["/posts", a0];
var _forTrack0 = ($index, $item) => $item.id;
function BlogComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "span", 8);
    \u0275\u0275elementEnd();
  }
}
function BlogComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.error(), " ");
  }
}
function BlogComponent_Conditional_10_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 9)(1, "div", 10);
    \u0275\u0275element(2, "img", 11)(3, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 13)(5, "div", 14)(6, "time", 15);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 16)(10, "h3", 17)(11, "a", 18);
    \u0275\u0275element(12, "span", 19);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "p", 20);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const post_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", \u0275\u0275interpolate(post_r2.image || "assets/img/no-image.png"), \u0275\u0275sanitizeUrl)("alt", \u0275\u0275interpolate(post_r2.title));
    \u0275\u0275advance(4);
    \u0275\u0275attribute("datetime", post_r2.created_at);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 9, post_r2.created_at, "mediumDate"));
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(12, _c0, post_r2.slug));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", post_r2.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(post_r2.content);
  }
}
function BlogComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, BlogComponent_Conditional_10_For_1_Template, 16, 14, "article", 9, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r0.posts());
  }
}
var BlogComponent = class _BlogComponent {
  postService = inject(PostService);
  seoService = inject(SeoService);
  posts = signal([], ...ngDevMode ? [{ debugName: "posts" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  async ngOnInit() {
    this.seoService.setPageData({
      title: "Blog de Tecnolog\xEDa y Reparaci\xF3n",
      description: "Novedades, gu\xEDas de reparaci\xF3n y noticias del mundo tecnol\xF3gico de Marcos Paz. Mantente actualizado con Arecofix.",
      imageUrl: "assets/img/branding/og-blog.jpg"
    });
    try {
      const posts = await this.postService.getRecentPosts(100);
      this.posts.set(posts);
    } catch (err) {
      this.error.set("Error al cargar los art\xEDculos.");
    } finally {
      this.loading.set(false);
    }
  }
  static \u0275fac = function BlogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BlogComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlogComponent, selectors: [["app-blog"]], decls: 11, vars: 1, consts: [[1, "bg-white", "py-24", "sm:py-32"], [1, "mx-auto", "max-w-7xl", "px-6", "lg:px-8"], [1, "mx-auto", "max-w-2xl", "text-center"], [1, "text-3xl", "font-bold", "tracking-tight", "text-gray-900", "sm:text-4xl"], [1, "mt-2", "text-lg", "leading-8", "text-gray-600"], [1, "mx-auto", "mt-16", "grid", "max-w-2xl", "grid-cols-1", "gap-x-8", "gap-y-20", "lg:mx-0", "lg:max-w-none", "lg:grid-cols-3"], [1, "col-span-full", "text-center", "py-12"], [1, "col-span-full", "text-center", "py-12", "text-red-500"], [1, "loading", "loading-spinner", "loading-lg", "text-primary"], [1, "flex", "flex-col", "items-start", "justify-between"], [1, "relative", "w-full"], [1, "aspect-video", "w-full", "rounded-2xl", "bg-gray-100", "object-cover", "sm:aspect-2/1", "lg:aspect-3/2", 3, "src", "alt"], [1, "absolute", "inset-0", "rounded-2xl", "ring-1", "ring-inset", "ring-gray-900/10"], [1, "max-w-xl"], [1, "mt-8", "flex", "items-center", "gap-x-4", "text-xs"], [1, "text-gray-500"], [1, "group", "relative"], [1, "mt-3", "text-lg", "font-semibold", "leading-6", "text-gray-900", "group-hover:text-gray-600"], [3, "routerLink"], [1, "absolute", "inset-0"], [1, "mt-5", "line-clamp-3", "text-sm", "leading-6", "text-gray-600"]], template: function BlogComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
      \u0275\u0275text(4, "Nuestro Blog");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Noticias, consejos y novedades sobre tecnolog\xEDa.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275conditionalCreate(8, BlogComponent_Conditional_8_Template, 2, 0, "div", 6)(9, BlogComponent_Conditional_9_Template, 2, 1, "div", 7)(10, BlogComponent_Conditional_10_Template, 2, 0);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.loading() ? 8 : ctx.error() ? 9 : 10);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlogComponent, [{
    type: Component,
    args: [{ selector: "app-blog", standalone: true, imports: [CommonModule, RouterLink], template: `<div class="bg-white py-24 sm:py-32">\r
  <div class="mx-auto max-w-7xl px-6 lg:px-8">\r
    <div class="mx-auto max-w-2xl text-center">\r
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestro Blog</h2>\r
      <p class="mt-2 text-lg leading-8 text-gray-600">Noticias, consejos y novedades sobre tecnolog\xEDa.</p>\r
    </div>\r
    <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">\r
      @if (loading()) {\r
        <div class="col-span-full text-center py-12">\r
          <span class="loading loading-spinner loading-lg text-primary"></span>\r
        </div>\r
      } @else if (error()) {\r
        <div class="col-span-full text-center py-12 text-red-500">\r
          {{ error() }}\r
        </div>\r
      } @else {\r
        @for (post of posts(); track post.id) {\r
          <article class="flex flex-col items-start justify-between">\r
            <div class="relative w-full">\r
              <img src="{{ post.image || 'assets/img/no-image.png' }}" alt="{{ post.title }}" class="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2">\r
              <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>\r
            </div>\r
            <div class="max-w-xl">\r
              <div class="mt-8 flex items-center gap-x-4 text-xs">\r
                <time [attr.datetime]="post.created_at" class="text-gray-500">{{ post.created_at | date:'mediumDate' }}</time>\r
              </div>\r
              <div class="group relative">\r
                <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">\r
                  <a [routerLink]="['/posts', post.slug]">\r
                    <span class="absolute inset-0"></span>\r
                    {{ post.title }}\r
                  </a>\r
                </h3>\r
                <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{{ post.content }}</p>\r
              </div>\r
            </div>\r
          </article>\r
        }\r
      }\r
    </div>\r
  </div>\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlogComponent, { className: "BlogComponent", filePath: "src/app/public/blog/blog.component.ts", lineNumber: 15 });
})();
export {
  BlogComponent
};
//# sourceMappingURL=chunk-MAD7PU6Z.mjs.map
