import {
  AdminPostService
} from "./chunk-SLBUHKP7.js";
import "./chunk-MZTEREIC.js";
import "./chunk-4WZKXYCH.js";
import "./chunk-TCBIYFRD.js";
import {
  DatePipe,
  RouterLink
} from "./chunk-3EP36GV6.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TQTEFGZE.js";
import "./chunk-46DXP6YY.js";

// src/app/admin/posts/admin-posts-page.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.id;
function AdminPostsPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementStart(2, "p", 12);
    \u0275\u0275text(3, "Cargando entradas...");
    \u0275\u0275elementEnd()();
  }
}
function AdminPostsPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 13);
    \u0275\u0275element(2, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 15);
    \u0275\u0275text(4, "Error al cargar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 17);
    \u0275\u0275listener("click", function AdminPostsPage_Conditional_12_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadPosts());
    });
    \u0275\u0275text(8, " Intentar nuevamente ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function AdminPostsPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 18);
    \u0275\u0275element(2, "i", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 15);
    \u0275\u0275text(4, "No hay entradas a\xFAn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 20);
    \u0275\u0275text(6, "Comienza a escribir en tu blog para compartir novedades y tutoriales con tus clientes.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 21);
    \u0275\u0275text(8, " Crear primera entrada ");
    \u0275\u0275elementEnd()();
  }
}
function AdminPostsPage_Conditional_14_For_15_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 32);
  }
  if (rf & 2) {
    const post_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", post_r4.image, \u0275\u0275sanitizeUrl)("alt", post_r4.title);
  }
}
function AdminPostsPage_Conditional_14_For_15_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275elementEnd();
  }
}
function AdminPostsPage_Conditional_14_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 28)(1, "td", 29)(2, "div", 30)(3, "div", 31);
    \u0275\u0275conditionalCreate(4, AdminPostsPage_Conditional_14_For_15_Conditional_4_Template, 1, 2, "img", 32)(5, AdminPostsPage_Conditional_14_For_15_Conditional_5_Template, 2, 0, "div", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 34)(7, "div", 35);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 36);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "td", 29)(12, "span", 37);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 38);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 39)(18, "div", 40)(19, "a", 41);
    \u0275\u0275element(20, "i", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 43);
    \u0275\u0275listener("click", function AdminPostsPage_Conditional_14_For_15_Template_button_click_21_listener() {
      const post_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deletePost(post_r4.id));
    });
    \u0275\u0275element(22, "i", 44);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const post_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275conditional(post_r4.image ? 4 : 5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(post_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(post_r4.slug);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-green-100", post_r4.published)("text-green-800", post_r4.published)("bg-yellow-100", !post_r4.published)("text-yellow-800", !post_r4.published);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", post_r4.published ? "Publicado" : "Borrador", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(16, 14, post_r4.created_at, "mediumDate"), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(17, _c0, post_r4.id));
  }
}
function AdminPostsPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "table", 22)(2, "thead", 23)(3, "tr")(4, "th", 24);
    \u0275\u0275text(5, " Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 24);
    \u0275\u0275text(7, " Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 24);
    \u0275\u0275text(9, "Fecha ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 25)(11, "span", 26);
    \u0275\u0275text(12, "Acciones");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(13, "tbody", 27);
    \u0275\u0275repeaterCreate(14, AdminPostsPage_Conditional_14_For_15_Template, 23, 19, "tr", 28, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r1.posts);
  }
}
var AdminPostsPage = class _AdminPostsPage {
  postService = inject(AdminPostService);
  cdr = inject(ChangeDetectorRef);
  posts = [];
  loading = true;
  error = null;
  async ngOnInit() {
    this.loadPosts();
  }
  async loadPosts() {
    try {
      this.loading = true;
      this.posts = await this.postService.getPosts();
    } catch (e) {
      this.error = e.message || "Error al cargar entradas";
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
  async deletePost(id) {
    if (!confirm("\xBFEst\xE1s seguro de eliminar esta entrada?"))
      return;
    try {
      await this.postService.deletePost(id);
      await this.loadPosts();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }
  static \u0275fac = function AdminPostsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminPostsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminPostsPage, selectors: [["app-admin-posts-page"]], decls: 15, vars: 1, consts: [[1, "space-y-6"], [1, "flex", "flex-col", "sm:flex-row", "justify-between", "items-start", "sm:items-center", "gap-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-green-400"], [1, "text-gray-500", "mt-1"], ["routerLink", "new", 1, "inline-flex", "items-center", "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "shadow-sm"], [1, "fas", "fa-plus", "mr-2"], [1, "bg-white", "rounded-xl", "shadow-sm", "border", "border-gray-200", "overflow-hidden"], [1, "flex", "flex-col", "items-center", "justify-center", "p-12"], [1, "flex", "flex-col", "items-center", "justify-center", "p-12", "text-center"], [1, "flex", "flex-col", "items-center", "justify-center", "p-16", "text-center"], [1, "overflow-x-auto"], [1, "animate-spin", "rounded-full", "h-10", "w-10", "border-b-2", "border-indigo-600", "mb-4"], [1, "text-gray-500"], [1, "bg-red-50", "p-4", "rounded-full", "mb-4"], [1, "fas", "fa-exclamation-circle", "text-red-500", "text-xl"], [1, "text-lg", "font-medium", "text-gray-900", "mb-2"], [1, "text-gray-500", "mb-4"], [1, "text-indigo-600", "hover:text-indigo-700", "font-medium", 3, "click"], [1, "bg-gray-50", "p-6", "rounded-full", "mb-6"], [1, "fas", "fa-newspaper", "text-gray-400", "text-3xl"], [1, "text-gray-500", "max-w-sm", "mb-6"], ["routerLink", "new", 1, "inline-flex", "items-center", "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors"], [1, "min-w-full", "divide-y", "divide-gray-200"], [1, "bg-gray-50"], ["scope", "col", 1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], ["scope", "col", 1, "relative", "px-6", "py-3"], [1, "sr-only"], [1, "bg-white", "divide-y", "divide-gray-200"], [1, "hover:bg-gray-50", "transition-colors"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center"], [1, "h-10", "w-10", "shrink-0"], [1, "h-10", "w-10", "rounded-lg", "object-cover", 3, "src", "alt"], [1, "h-10", "w-10", "rounded-lg", "bg-gray-100", "flex", "items-center", "justify-center"], [1, "ml-4"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-sm", "text-gray-500", "truncate", "max-w-xs"], [1, "px-2", "inline-flex", "text-xs", "leading-5", "font-semibold", "rounded-full"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-500"], [1, "px-6", "py-4", "whitespace-nowrap", "text-right", "text-sm", "font-medium"], [1, "flex", "justify-end", "gap-3"], ["title", "Editar", 1, "text-indigo-600", "hover:text-indigo-900", "transition-colors", 3, "routerLink"], [1, "fas", "fa-edit"], ["title", "Eliminar", 1, "text-red-600", "hover:text-red-900", "transition-colors", 3, "click"], [1, "fas", "fa-trash"], [1, "fas", "fa-image", "text-gray-400"]], template: function AdminPostsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4, "Entradas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Gestiona las publicaciones de tu blog");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "a", 4);
      \u0275\u0275element(8, "i", 5);
      \u0275\u0275text(9, " Nueva Entrada ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 6);
      \u0275\u0275conditionalCreate(11, AdminPostsPage_Conditional_11_Template, 4, 0, "div", 7)(12, AdminPostsPage_Conditional_12_Template, 9, 1, "div", 8)(13, AdminPostsPage_Conditional_13_Template, 9, 0, "div", 9)(14, AdminPostsPage_Conditional_14_Template, 16, 0, "div", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(11);
      \u0275\u0275conditional(ctx.loading ? 11 : ctx.error ? 12 : ctx.posts.length === 0 ? 13 : 14);
    }
  }, dependencies: [RouterLink, DatePipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminPostsPage, [{
    type: Component,
    args: [{ selector: "app-admin-posts-page", standalone: true, imports: [RouterLink, DatePipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="space-y-6">\r
    <!-- Header -->\r
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">\r
        <div>\r
            <h1 class="text-2xl font-bold text-gray-900 dark:text-green-400">Entradas</h1>\r
            <p class="text-gray-500 mt-1">Gestiona las publicaciones de tu blog</p>\r
        </div>\r
        <a routerLink="new"\r
            class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">\r
            <i class="fas fa-plus mr-2"></i>\r
            Nueva Entrada\r
        </a>\r
    </div>\r
\r
    <!-- Content -->\r
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">\r
        @if (loading) {\r
        <div class="flex flex-col items-center justify-center p-12">\r
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>\r
            <p class="text-gray-500">Cargando entradas...</p>\r
        </div>\r
        } @else if (error) {\r
        <div class="flex flex-col items-center justify-center p-12 text-center">\r
            <div class="bg-red-50 p-4 rounded-full mb-4">\r
                <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>\r
            </div>\r
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>\r
            <p class="text-gray-500 mb-4">{{ error }}</p>\r
            <button (click)="loadPosts()" class="text-indigo-600 hover:text-indigo-700 font-medium">\r
                Intentar nuevamente\r
            </button>\r
        </div>\r
        } @else if (posts.length === 0) {\r
        <div class="flex flex-col items-center justify-center p-16 text-center">\r
            <div class="bg-gray-50 p-6 rounded-full mb-6">\r
                <i class="fas fa-newspaper text-gray-400 text-3xl"></i>\r
            </div>\r
            <h3 class="text-lg font-medium text-gray-900 mb-2">No hay entradas a\xFAn</h3>\r
            <p class="text-gray-500 max-w-sm mb-6">Comienza a escribir en tu blog para compartir novedades y tutoriales\r
                con tus clientes.</p>\r
            <a routerLink="new"\r
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">\r
                Crear primera entrada\r
            </a>\r
        </div>\r
        } @else {\r
        <div class="overflow-x-auto">\r
            <table class="min-w-full divide-y divide-gray-200">\r
                <thead class="bg-gray-50">\r
                    <tr>\r
                        <th scope="col"\r
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">\r
                            Entrada</th>\r
                        <th scope="col"\r
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">\r
                            Estado</th>\r
                        <th scope="col"\r
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha\r
                        </th>\r
                        <th scope="col" class="relative px-6 py-3">\r
                            <span class="sr-only">Acciones</span>\r
                        </th>\r
                    </tr>\r
                </thead>\r
                <tbody class="bg-white divide-y divide-gray-200">\r
                    @for (post of posts; track post.id) {\r
                    <tr class="hover:bg-gray-50 transition-colors">\r
                        <td class="px-6 py-4 whitespace-nowrap">\r
                            <div class="flex items-center">\r
                                <div class="h-10 w-10 shrink-0">\r
                                    @if (post.image) {\r
                                    <img class="h-10 w-10 rounded-lg object-cover" [src]="post.image"\r
                                        [alt]="post.title">\r
                                    } @else {\r
                                    <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">\r
                                        <i class="fas fa-image text-gray-400"></i>\r
                                    </div>\r
                                    }\r
                                </div>\r
                                <div class="ml-4">\r
                                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>\r
                                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ post.slug }}</div>\r
                                </div>\r
                            </div>\r
                        </td>\r
                        <td class="px-6 py-4 whitespace-nowrap">\r
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"\r
                                [class.bg-green-100]="post.published" [class.text-green-800]="post.published"\r
                                [class.bg-yellow-100]="!post.published" [class.text-yellow-800]="!post.published">\r
                                {{ post.published ? 'Publicado' : 'Borrador' }}\r
                            </span>\r
                        </td>\r
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\r
                            {{ post.created_at | date:'mediumDate' }}\r
                        </td>\r
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">\r
                            <div class="flex justify-end gap-3">\r
                                <a [routerLink]="[post.id]"\r
                                    class="text-indigo-600 hover:text-indigo-900 transition-colors" title="Editar">\r
                                    <i class="fas fa-edit"></i>\r
                                </a>\r
                                <button (click)="deletePost(post.id)"\r
                                    class="text-red-600 hover:text-red-900 transition-colors" title="Eliminar">\r
                                    <i class="fas fa-trash"></i>\r
                                </button>\r
                            </div>\r
                        </td>\r
                    </tr>\r
                    }\r
                </tbody>\r
            </table>\r
        </div>\r
        }\r
    </div>\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminPostsPage, { className: "AdminPostsPage", filePath: "src/app/admin/posts/admin-posts-page.ts", lineNumber: 14 });
})();
export {
  AdminPostsPage
};
//# sourceMappingURL=chunk-TPP6NATR.js.map
