import './polyfills.server.mjs';
import {
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import "./chunk-NQCCIK3J.mjs";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/public/sitemap/sitemap.component.ts
var SitemapComponent = class _SitemapComponent {
  static \u0275fac = function SitemapComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SitemapComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SitemapComponent, selectors: [["app-sitemap"]], decls: 109, vars: 0, consts: [[1, "bg-white", "py-24", "sm:py-32"], [1, "mx-auto", "max-w-7xl", "px-6", "lg:px-8"], [1, "mx-auto", "max-w-2xl", "text-center"], [1, "text-3xl", "font-bold", "tracking-tight", "text-gray-900", "sm:text-4xl"], [1, "mt-2", "text-lg", "leading-8", "text-gray-600"], [1, "mx-auto", "mt-16", "max-w-2xl", "lg:max-w-none"], [1, "grid", "grid-cols-1", "gap-x-8", "gap-y-10", "sm:grid-cols-2", "lg:grid-cols-4"], [1, "group", "relative"], [1, "absolute", "-inset-2", "rounded-lg", "bg-indigo-50", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "relative"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4", "pl-2", "border-l-4", "border-indigo-500"], [1, "space-y-3", "text-gray-600", "pl-2"], ["routerLink", "/", 1, "hover:text-indigo-600", "transition", "flex", "items-center"], [1, "fas", "fa-home", "w-5", "text-gray-400"], ["routerLink", "/nosotros", 1, "hover:text-indigo-600", "transition", "flex", "items-center"], [1, "fas", "fa-users", "w-5", "text-gray-400"], ["routerLink", "/contacto", 1, "hover:text-indigo-600", "transition", "flex", "items-center"], [1, "fas", "fa-envelope", "w-5", "text-gray-400"], ["routerLink", "/recursos", 1, "hover:text-indigo-600", "transition", "flex", "items-center"], [1, "fas", "fa-box-open", "w-5", "text-gray-400"], [1, "absolute", "-inset-2", "rounded-lg", "bg-blue-50", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4", "pl-2", "border-l-4", "border-blue-500"], ["routerLink", "/productos", 1, "hover:text-blue-600", "transition", "flex", "items-center"], [1, "fas", "fa-shopping-bag", "w-5", "text-gray-400"], [1, "badge", "badge-xs", "badge-neutral", "ml-2"], ["routerLink", "/productos/destacados", 1, "hover:text-blue-600", "transition", "flex", "items-center"], [1, "fas", "fa-star", "w-5", "text-gray-400"], ["routerLink", "/categories", 1, "hover:text-blue-600", "transition", "flex", "items-center"], [1, "fas", "fa-th", "w-5", "text-gray-400"], ["routerLink", "/servicios", 1, "hover:text-blue-600", "transition", "flex", "items-center"], [1, "fas", "fa-wrench", "w-5", "text-gray-400"], ["routerLink", "/gsm", 1, "hover:text-blue-600", "transition", "flex", "items-center"], [1, "fas", "fa-mobile-alt", "w-5", "text-gray-400"], [1, "absolute", "-inset-2", "rounded-lg", "bg-green-50", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4", "pl-2", "border-l-4", "border-green-500"], ["routerLink", "/academy", 1, "hover:text-green-600", "transition", "flex", "items-center"], [1, "fas", "fa-graduation-cap", "w-5", "text-gray-400"], ["routerLink", "/fixtecnicos", 1, "hover:text-green-600", "transition", "flex", "items-center"], [1, "fas", "fa-network-wired", "w-5", "text-gray-400"], [1, "badge", "badge-xs", "badge-primary", "ml-2"], ["routerLink", "/blog", 1, "hover:text-green-600", "transition", "flex", "items-center"], [1, "fas", "fa-newspaper", "w-5", "text-gray-400"], ["routerLink", "/portfolio", 1, "hover:text-green-600", "transition", "flex", "items-center"], [1, "fas", "fa-images", "w-5", "text-gray-400"], [1, "absolute", "-inset-2", "rounded-lg", "bg-gray-100", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4", "pl-2", "border-l-4", "border-gray-500"], ["routerLink", "/login", 1, "hover:text-gray-900", "transition", "flex", "items-center"], [1, "fas", "fa-sign-in-alt", "w-5", "text-gray-400"], ["routerLink", "/register", 1, "hover:text-gray-900", "transition", "flex", "items-center"], [1, "fas", "fa-user-plus", "w-5", "text-gray-400"], ["routerLink", "/privacy", 1, "hover:text-gray-900", "transition", "flex", "items-center"], [1, "fas", "fa-shield-alt", "w-5", "text-gray-400"], ["routerLink", "/terms", 1, "hover:text-gray-900", "transition", "flex", "items-center"], [1, "fas", "fa-file-contract", "w-5", "text-gray-400"], ["routerLink", "/sitemap", 1, "hover:text-gray-900", "transition", "flex", "items-center", "font-bold", "text-indigo-600"], [1, "fas", "fa-sitemap", "w-5", "text-indigo-600"]], template: function SitemapComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
      \u0275\u0275text(4, "Mapa del Sitio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Navega por toda la estructura de Arecofix para encontrar lo que buscas.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5)(8, "div", 6)(9, "div", 7);
      \u0275\u0275element(10, "div", 8);
      \u0275\u0275elementStart(11, "div", 9)(12, "h3", 10);
      \u0275\u0275text(13, "Principal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "ul", 11)(15, "li")(16, "a", 12);
      \u0275\u0275element(17, "i", 13);
      \u0275\u0275text(18, " Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "li")(20, "a", 14);
      \u0275\u0275element(21, "i", 15);
      \u0275\u0275text(22, " Nosotros");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "li")(24, "a", 16);
      \u0275\u0275element(25, "i", 17);
      \u0275\u0275text(26, " Contacto");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "li")(28, "a", 18);
      \u0275\u0275element(29, "i", 19);
      \u0275\u0275text(30, " Recursos");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(31, "div", 7);
      \u0275\u0275element(32, "div", 20);
      \u0275\u0275elementStart(33, "div", 9)(34, "h3", 21);
      \u0275\u0275text(35, "Tienda & Servicios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "ul", 11)(37, "li")(38, "a", 22);
      \u0275\u0275element(39, "i", 23);
      \u0275\u0275text(40, " Productos ");
      \u0275\u0275elementStart(41, "span", 24);
      \u0275\u0275text(42, "Nuevo");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(43, "li")(44, "a", 25);
      \u0275\u0275element(45, "i", 26);
      \u0275\u0275text(46, " Destacados");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "li")(48, "a", 27);
      \u0275\u0275element(49, "i", 28);
      \u0275\u0275text(50, " Categor\xEDas");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "li")(52, "a", 29);
      \u0275\u0275element(53, "i", 30);
      \u0275\u0275text(54, " Servicios T\xE9cnicos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(55, "li")(56, "a", 31);
      \u0275\u0275element(57, "i", 32);
      \u0275\u0275text(58, " Zona GSM");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(59, "div", 7);
      \u0275\u0275element(60, "div", 33);
      \u0275\u0275elementStart(61, "div", 9)(62, "h3", 34);
      \u0275\u0275text(63, "Comunidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "ul", 11)(65, "li")(66, "a", 35);
      \u0275\u0275element(67, "i", 36);
      \u0275\u0275text(68, " Arecofix Academy");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(69, "li")(70, "a", 37);
      \u0275\u0275element(71, "i", 38);
      \u0275\u0275text(72, " FixT\xE9cnicos ");
      \u0275\u0275elementStart(73, "span", 39);
      \u0275\u0275text(74, "PRO");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(75, "li")(76, "a", 40);
      \u0275\u0275element(77, "i", 41);
      \u0275\u0275text(78, " Blog");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(79, "li")(80, "a", 42);
      \u0275\u0275element(81, "i", 43);
      \u0275\u0275text(82, " Portfolio");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(83, "div", 7);
      \u0275\u0275element(84, "div", 44);
      \u0275\u0275elementStart(85, "div", 9)(86, "h3", 45);
      \u0275\u0275text(87, "Soporte");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "ul", 11)(89, "li")(90, "a", 46);
      \u0275\u0275element(91, "i", 47);
      \u0275\u0275text(92, " Iniciar Sesi\xF3n");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(93, "li")(94, "a", 48);
      \u0275\u0275element(95, "i", 49);
      \u0275\u0275text(96, " Registrarse");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(97, "li")(98, "a", 50);
      \u0275\u0275element(99, "i", 51);
      \u0275\u0275text(100, " Pol\xEDtica de Privacidad");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(101, "li")(102, "a", 52);
      \u0275\u0275element(103, "i", 53);
      \u0275\u0275text(104, " T\xE9rminos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(105, "li")(106, "a", 54);
      \u0275\u0275element(107, "i", 55);
      \u0275\u0275text(108, " Mapa del Sitio");
      \u0275\u0275elementEnd()()()()()()()()();
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SitemapComponent, [{
    type: Component,
    args: [{ selector: "app-sitemap", standalone: true, imports: [RouterLink], template: '<div class="bg-white py-24 sm:py-32">\r\n  <div class="mx-auto max-w-7xl px-6 lg:px-8">\r\n    <div class="mx-auto max-w-2xl text-center">\r\n      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mapa del Sitio</h2>\r\n      <p class="mt-2 text-lg leading-8 text-gray-600">Navega por toda la estructura de Arecofix para encontrar lo que buscas.</p>\r\n    </div>\r\n    \r\n    <div class="mx-auto mt-16 max-w-2xl lg:max-w-none">\r\n      <div class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">\r\n        \r\n        <!-- Secci\xF3n Principal -->\r\n        <div class="group relative">\r\n           <div class="absolute -inset-2 rounded-lg bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>\r\n           <div class="relative">\r\n              <h3 class="text-lg font-semibold text-gray-900 mb-4 pl-2 border-l-4 border-indigo-500">Principal</h3>\r\n              <ul class="space-y-3 text-gray-600 pl-2">\r\n                <li><a routerLink="/" class="hover:text-indigo-600 transition flex items-center"><i class="fas fa-home w-5 text-gray-400"></i> Inicio</a></li>\r\n                <li><a routerLink="/nosotros" class="hover:text-indigo-600 transition flex items-center"><i class="fas fa-users w-5 text-gray-400"></i> Nosotros</a></li>\r\n                <li><a routerLink="/contacto" class="hover:text-indigo-600 transition flex items-center"><i class="fas fa-envelope w-5 text-gray-400"></i> Contacto</a></li>\r\n                <li><a routerLink="/recursos" class="hover:text-indigo-600 transition flex items-center"><i class="fas fa-box-open w-5 text-gray-400"></i> Recursos</a></li>\r\n              </ul>\r\n           </div>\r\n        </div>\r\n\r\n        <!-- Productos y Soluciones -->\r\n        <div class="group relative">\r\n            <div class="absolute -inset-2 rounded-lg bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>\r\n            <div class="relative">\r\n              <h3 class="text-lg font-semibold text-gray-900 mb-4 pl-2 border-l-4 border-blue-500">Tienda & Servicios</h3>\r\n              <ul class="space-y-3 text-gray-600 pl-2">\r\n                <li><a routerLink="/productos" class="hover:text-blue-600 transition flex items-center"><i class="fas fa-shopping-bag w-5 text-gray-400"></i> Productos <span class="badge badge-xs badge-neutral ml-2">Nuevo</span></a></li>\r\n                <li><a routerLink="/productos/destacados" class="hover:text-blue-600 transition flex items-center"><i class="fas fa-star w-5 text-gray-400"></i> Destacados</a></li>\r\n                <li><a routerLink="/categories" class="hover:text-blue-600 transition flex items-center"><i class="fas fa-th w-5 text-gray-400"></i> Categor\xEDas</a></li>\r\n                <li><a routerLink="/servicios" class="hover:text-blue-600 transition flex items-center"><i class="fas fa-wrench w-5 text-gray-400"></i> Servicios T\xE9cnicos</a></li>\r\n                <li><a routerLink="/gsm" class="hover:text-blue-600 transition flex items-center"><i class="fas fa-mobile-alt w-5 text-gray-400"></i> Zona GSM</a></li>\r\n              </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Comunidad & Educaci\xF3n -->\r\n        <div class="group relative">\r\n            <div class="absolute -inset-2 rounded-lg bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>\r\n            <div class="relative">\r\n              <h3 class="text-lg font-semibold text-gray-900 mb-4 pl-2 border-l-4 border-green-500">Comunidad</h3>\r\n              <ul class="space-y-3 text-gray-600 pl-2">\r\n                <li><a routerLink="/academy" class="hover:text-green-600 transition flex items-center"><i class="fas fa-graduation-cap w-5 text-gray-400"></i> Arecofix Academy</a></li>\r\n                <li><a routerLink="/fixtecnicos" class="hover:text-green-600 transition flex items-center"><i class="fas fa-network-wired w-5 text-gray-400"></i> FixT\xE9cnicos <span class="badge badge-xs badge-primary ml-2">PRO</span></a></li>\r\n                <li><a routerLink="/blog" class="hover:text-green-600 transition flex items-center"><i class="fas fa-newspaper w-5 text-gray-400"></i> Blog</a></li>\r\n                <li><a routerLink="/portfolio" class="hover:text-green-600 transition flex items-center"><i class="fas fa-images w-5 text-gray-400"></i> Portfolio</a></li>\r\n              </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Usuario & Legal -->\r\n        <div class="group relative">\r\n            <div class="absolute -inset-2 rounded-lg bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>\r\n            <div class="relative">\r\n              <h3 class="text-lg font-semibold text-gray-900 mb-4 pl-2 border-l-4 border-gray-500">Soporte</h3>\r\n              <ul class="space-y-3 text-gray-600 pl-2">\r\n                <li><a routerLink="/login" class="hover:text-gray-900 transition flex items-center"><i class="fas fa-sign-in-alt w-5 text-gray-400"></i> Iniciar Sesi\xF3n</a></li>\r\n                <li><a routerLink="/register" class="hover:text-gray-900 transition flex items-center"><i class="fas fa-user-plus w-5 text-gray-400"></i> Registrarse</a></li>\r\n                <li><a routerLink="/privacy" class="hover:text-gray-900 transition flex items-center"><i class="fas fa-shield-alt w-5 text-gray-400"></i> Pol\xEDtica de Privacidad</a></li>\r\n                <li><a routerLink="/terms" class="hover:text-gray-900 transition flex items-center"><i class="fas fa-file-contract w-5 text-gray-400"></i> T\xE9rminos</a></li>\r\n                <li><a routerLink="/sitemap" class="hover:text-gray-900 transition flex items-center font-bold text-indigo-600"><i class="fas fa-sitemap w-5 text-indigo-600"></i> Mapa del Sitio</a></li>\r\n              </ul>\r\n            </div>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SitemapComponent, { className: "SitemapComponent", filePath: "src/app/public/sitemap/sitemap.component.ts", lineNumber: 11 });
})();
export {
  SitemapComponent
};
//# sourceMappingURL=chunk-JVSDOMXE.mjs.map
