import {
  PreferencesService
} from "./chunk-EECV4RMG.js";
import {
  AsyncPipe,
  CommonModule,
  NgClass
} from "./chunk-F32QBW3I.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DPJFS6PI.js";

// src/app/shared/components/accessibility-sidebar/accessibility-sidebar.component.ts
function AccessibilitySidebarComponent_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
    \u0275\u0275listener("click", function AccessibilitySidebarComponent_For_35_Template_button_click_0_listener() {
      const bg_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.preferencesService.setTheme(bg_r2.id));
    });
    \u0275\u0275element(3, "div", 27);
    \u0275\u0275elementStart(4, "p", 28);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const bg_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("ring-2", \u0275\u0275pipeBind1(1, 6, ctx_r2.preferencesService.theme$) === bg_r2.id);
    \u0275\u0275attribute("title", bg_r2.name)("aria-pressed", \u0275\u0275pipeBind1(2, 8, ctx_r2.preferencesService.theme$) === bg_r2.id);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", bg_r2.class);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(bg_r2.name);
  }
}
var AccessibilitySidebarComponent = class _AccessibilitySidebarComponent {
  preferencesService;
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  get backgroundOptions() {
    return this.preferencesService.backgroundOptions;
  }
  static \u0275fac = function AccessibilitySidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccessibilitySidebarComponent)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccessibilitySidebarComponent, selectors: [["app-accessibility-sidebar"]], decls: 73, vars: 84, consts: [[1, "fixed", "right-0", "top-24", "h-[calc(100vh-6rem)]", "w-80", "bg-gray-950/95", "backdrop-blur-lg", "border-l-2", "border-brand-blue/30", "transform", "transition-transform", "duration-300", "z-2000", "overflow-y-auto", "rounded-l-xl", "shadow-2xl"], [1, "sticky", "top-0", "bg-gray-900/80", "backdrop-blur", "border-b", "border-brand-blue/20", "p-4"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-bold", "text-white", "flex", "items-center", "gap-2"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "text-brand-blue"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"], [1, "p-2", "hover:bg-white/10", "rounded-lg", "transition-all", 3, "click"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "text-gray-400"], ["d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"], [1, "p-4", "space-y-6"], [1, "space-y-3"], [1, "text-sm", "font-semibold", "text-gray-300", "block"], [1, "space-y-2"], [1, "w-full", "px-3", "py-2", "rounded-lg", "text-white", "text-sm", "font-medium", "transition-all", "hover:bg-brand-blue/80", 3, "click"], [1, "grid", "grid-cols-2", "gap-2"], [1, "p-3", "rounded-lg", "transition-all", "hover:ring-2", "ring-brand-blue", "group", 3, "ring-2"], [1, "flex", "items-center", "justify-between", "gap-2"], [1, "px-3", "py-2", "rounded-lg", "bg-gray-700", "hover:bg-gray-600", "disabled:opacity-50", "disabled:cursor-not-allowed", "text-white", "transition-all", 3, "click", "disabled"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], ["d", "M19 13H5v-2h14v2z"], [1, "text-sm", "font-semibold", "text-blue-300", "px-3", "py-2", "bg-gray-800", "rounded-lg", "min-w-12", "text-center"], ["d", "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"], [1, "w-full", "px-4", "py-2", "rounded-lg", "text-white", "transition-all", "hover:opacity-80", "flex", "items-center", "justify-center", "gap-2", 3, "click"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"], ["title", "Accessibility", 1, "fixed", "right-0", "top-32", "z-2000", "p-3", "bg-brand-blue", "hover:bg-brand-dark-blue", "text-white", "rounded-l-lg", "transition-all", "shadow-lg", "cursor-pointer", 3, "click"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], [1, "p-3", "rounded-lg", "transition-all", "hover:ring-2", "ring-brand-blue", "group", 3, "click"], [1, "w-full", "h-8", "rounded", "group-hover:shadow-lg", "transition-shadow", 3, "ngClass"], [1, "text-xs", "text-gray-400", "mt-1", "text-center", "group-hover:text-gray-300"]], template: function AccessibilitySidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275pipe(1, "async");
      \u0275\u0275elementStart(2, "div", 1)(3, "div", 2)(4, "h3", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(5, "svg", 4);
      \u0275\u0275element(6, "path", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275text(7);
      \u0275\u0275pipe(8, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(9, "button", 6);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_9_listener() {
        return ctx.preferencesService.closeSidebar();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(11, "svg", 7);
      \u0275\u0275element(12, "path", 8);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "div", 9)(14, "div", 10)(15, "label", 11);
      \u0275\u0275text(16);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 12)(19, "button", 13);
      \u0275\u0275pipe(20, "async");
      \u0275\u0275pipe(21, "async");
      \u0275\u0275pipe(22, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_19_listener() {
        return ctx.preferencesService.setLanguage("es");
      });
      \u0275\u0275text(23, " \u{1F1EA}\u{1F1F8} Espa\xF1ol ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "button", 13);
      \u0275\u0275pipe(25, "async");
      \u0275\u0275pipe(26, "async");
      \u0275\u0275pipe(27, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_24_listener() {
        return ctx.preferencesService.setLanguage("en");
      });
      \u0275\u0275text(28, " \u{1F1FA}\u{1F1F8} English ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "div", 10)(30, "label", 11);
      \u0275\u0275text(31);
      \u0275\u0275pipe(32, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 14);
      \u0275\u0275repeaterCreate(34, AccessibilitySidebarComponent_For_35_Template, 6, 10, "button", 15, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "div", 10)(37, "label", 11);
      \u0275\u0275text(38);
      \u0275\u0275pipe(39, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 16)(41, "button", 17);
      \u0275\u0275pipe(42, "async");
      \u0275\u0275pipe(43, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_41_listener() {
        return ctx.preferencesService.decreaseFontSize();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(44, "svg", 18);
      \u0275\u0275element(45, "path", 19);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(46, "span", 20);
      \u0275\u0275text(47);
      \u0275\u0275pipe(48, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "button", 17);
      \u0275\u0275pipe(50, "async");
      \u0275\u0275pipe(51, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_49_listener() {
        return ctx.preferencesService.increaseFontSize();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(52, "svg", 18);
      \u0275\u0275element(53, "path", 21);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(54, "div", 10)(55, "label", 11);
      \u0275\u0275text(56);
      \u0275\u0275pipe(57, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "button", 22);
      \u0275\u0275pipe(59, "async");
      \u0275\u0275pipe(60, "async");
      \u0275\u0275pipe(61, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_58_listener() {
        return ctx.preferencesService.toggleHighContrast();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(62, "svg", 18);
      \u0275\u0275element(63, "path", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275text(64);
      \u0275\u0275pipe(65, "async");
      \u0275\u0275pipe(66, "async");
      \u0275\u0275pipe(67, "async");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(68, "button", 24);
      \u0275\u0275pipe(69, "async");
      \u0275\u0275pipe(70, "async");
      \u0275\u0275listener("click", function AccessibilitySidebarComponent_Template_button_click_68_listener() {
        return ctx.preferencesService.toggleSidebar();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(71, "svg", 25);
      \u0275\u0275element(72, "path", 23);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("translate-x-full", !\u0275\u0275pipeBind1(1, 32, ctx.preferencesService.sidebarOpen$));
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 34, ctx.preferencesService.language$) === "es" ? "Accesibilidad" : "Accessibility", " ");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(10, 36, ctx.preferencesService.language$) === "es" ? "Cerrar" : "Close");
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(17, 38, ctx.preferencesService.language$) === "es" ? "Idioma" : "Language", " ");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-brand-blue", \u0275\u0275pipeBind1(20, 40, ctx.preferencesService.language$) === "es")("bg-gray-700", \u0275\u0275pipeBind1(21, 42, ctx.preferencesService.language$) !== "es");
      \u0275\u0275attribute("aria-pressed", \u0275\u0275pipeBind1(22, 44, ctx.preferencesService.language$) === "es");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("bg-brand-blue", \u0275\u0275pipeBind1(25, 46, ctx.preferencesService.language$) === "en")("bg-gray-700", \u0275\u0275pipeBind1(26, 48, ctx.preferencesService.language$) !== "en");
      \u0275\u0275attribute("aria-pressed", \u0275\u0275pipeBind1(27, 50, ctx.preferencesService.language$) === "en");
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(32, 52, ctx.preferencesService.language$) === "es" ? "Tema" : "Theme", " ");
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.backgroundOptions);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(39, 54, ctx.preferencesService.language$) === "es" ? "Tama\xF1o de Texto" : "Text Size", " ");
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", \u0275\u0275pipeBind1(42, 56, ctx.preferencesService.fontSize$) <= 12);
      \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(43, 58, ctx.preferencesService.language$) === "es" ? "Reducir tama\xF1o" : "Decrease size");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(48, 60, ctx.preferencesService.fontSize$), "px ");
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", \u0275\u0275pipeBind1(50, 62, ctx.preferencesService.fontSize$) >= 24);
      \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(51, 64, ctx.preferencesService.language$) === "es" ? "Aumentar tama\xF1o" : "Increase size");
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(57, 66, ctx.preferencesService.language$) === "es" ? "Alto Contraste" : "High Contrast", " ");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-brand-blue", \u0275\u0275pipeBind1(59, 68, ctx.preferencesService.highContrast$))("bg-gray-700", !\u0275\u0275pipeBind1(60, 70, ctx.preferencesService.highContrast$));
      \u0275\u0275attribute("aria-pressed", \u0275\u0275pipeBind1(61, 72, ctx.preferencesService.highContrast$));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(65, 74, ctx.preferencesService.highContrast$) ? \u0275\u0275pipeBind1(66, 76, ctx.preferencesService.language$) === "es" ? "Activado" : "Enabled" : \u0275\u0275pipeBind1(67, 78, ctx.preferencesService.language$) === "es" ? "Desactivado" : "Disabled", " ");
      \u0275\u0275advance(4);
      \u0275\u0275classProp("hidden", \u0275\u0275pipeBind1(69, 80, ctx.preferencesService.sidebarOpen$));
      \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(70, 82, ctx.preferencesService.language$) === "es" ? "Abrir panel de accesibilidad" : "Open accessibility panel");
    }
  }, dependencies: [CommonModule, NgClass, AsyncPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccessibilitySidebarComponent, [{
    type: Component,
    args: [{ selector: "app-accessibility-sidebar", standalone: true, imports: [CommonModule], template: `<div\r
  class="fixed right-0 top-24 h-[calc(100vh-6rem)] w-80 bg-gray-950/95 backdrop-blur-lg border-l-2 border-brand-blue/30 transform transition-transform duration-300 z-2000 overflow-y-auto rounded-l-xl shadow-2xl"\r
  [class.translate-x-full]="!(preferencesService.sidebarOpen$ | async)"\r
>\r
  <!-- Sidebar Header -->\r
  <div class="sticky top-0 bg-gray-900/80 backdrop-blur border-b border-brand-blue/20 p-4">\r
    <div class="flex items-center justify-between mb-4">\r
      <h3 class="text-lg font-bold text-white flex items-center gap-2">\r
        <svg class="w-5 h-5 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">\r
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>\r
        </svg>\r
        {{ (preferencesService.language$ | async) === 'es' ? 'Accesibilidad' : 'Accessibility' }}\r
      </h3>\r
      <button\r
        (click)="preferencesService.closeSidebar()"\r
        class="p-2 hover:bg-white/10 rounded-lg transition-all"\r
        [attr.aria-label]="(preferencesService.language$ | async) === 'es' ? 'Cerrar' : 'Close'"\r
      >\r
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">\r
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>\r
        </svg>\r
      </button>\r
    </div>\r
  </div>\r
\r
  <!-- Sidebar Content -->\r
  <div class="p-4 space-y-6">\r
    <!-- Language Section -->\r
    <div class="space-y-3">\r
      <label class="text-sm font-semibold text-gray-300 block">\r
        {{ (preferencesService.language$ | async) === 'es' ? 'Idioma' : 'Language' }}\r
      </label>\r
      <div class="space-y-2">\r
        <button\r
          (click)="preferencesService.setLanguage('es')"\r
          [class.bg-brand-blue]="(preferencesService.language$ | async) === 'es'"\r
          class="w-full px-3 py-2 rounded-lg text-white text-sm font-medium transition-all hover:bg-brand-blue/80"\r
          [class.bg-gray-700]="(preferencesService.language$ | async) !== 'es'"\r
          [attr.aria-pressed]="(preferencesService.language$ | async) === 'es'"\r
        >\r
          \u{1F1EA}\u{1F1F8} Espa\xF1ol\r
        </button>\r
        <button\r
          (click)="preferencesService.setLanguage('en')"\r
          [class.bg-brand-blue]="(preferencesService.language$ | async) === 'en'"\r
          class="w-full px-3 py-2 rounded-lg text-white text-sm font-medium transition-all hover:bg-brand-blue/80"\r
          [class.bg-gray-700]="(preferencesService.language$ | async) !== 'en'"\r
          [attr.aria-pressed]="(preferencesService.language$ | async) === 'en'"\r
        >\r
          \u{1F1FA}\u{1F1F8} English\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- Theme Section -->\r
    <div class="space-y-3">\r
      <label class="text-sm font-semibold text-gray-300 block">\r
        {{ (preferencesService.language$ | async) === 'es' ? 'Tema' : 'Theme' }}\r
      </label>\r
      <div class="grid grid-cols-2 gap-2">\r
        @for (bg of backgroundOptions; track bg) {\r
          <button\r
            (click)="preferencesService.setTheme(bg.id)"\r
            [class.ring-2]="(preferencesService.theme$ | async) === bg.id"\r
            class="p-3 rounded-lg transition-all hover:ring-2 ring-brand-blue group"\r
            [attr.title]="bg.name"\r
            [attr.aria-pressed]="(preferencesService.theme$ | async) === bg.id"\r
          >\r
            <div [ngClass]="bg.class" class="w-full h-8 rounded group-hover:shadow-lg transition-shadow"></div>\r
            <p class="text-xs text-gray-400 mt-1 text-center group-hover:text-gray-300">{{ bg.name }}</p>\r
          </button>\r
        }\r
      </div>\r
    </div>\r
\r
    <!-- Font Size Section -->\r
    <div class="space-y-3">\r
      <label class="text-sm font-semibold text-gray-300 block">\r
        {{ (preferencesService.language$ | async) === 'es' ? 'Tama\xF1o de Texto' : 'Text Size' }}\r
      </label>\r
      <div class="flex items-center justify-between gap-2">\r
        <button\r
          (click)="preferencesService.decreaseFontSize()"\r
          [disabled]="(preferencesService.fontSize$ | async)! <= 12"\r
          class="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"\r
          [attr.aria-label]="(preferencesService.language$ | async) === 'es' ? 'Reducir tama\xF1o' : 'Decrease size'"\r
        >\r
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\r
            <path d="M19 13H5v-2h14v2z"/>\r
          </svg>\r
        </button>\r
\r
        <span class="text-sm font-semibold text-blue-300 px-3 py-2 bg-gray-800 rounded-lg min-w-12 text-center">\r
          {{ (preferencesService.fontSize$ | async) }}px\r
        </span>\r
\r
        <button\r
          (click)="preferencesService.increaseFontSize()"\r
          [disabled]="(preferencesService.fontSize$ | async)! >= 24"\r
          class="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"\r
          [attr.aria-label]="(preferencesService.language$ | async) === 'es' ? 'Aumentar tama\xF1o' : 'Increase size'"\r
        >\r
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\r
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>\r
          </svg>\r
        </button>\r
      </div>\r
    </div>\r
\r
    <!-- High Contrast Section -->\r
    <div class="space-y-3">\r
      <label class="text-sm font-semibold text-gray-300 block">\r
        {{ (preferencesService.language$ | async) === 'es' ? 'Alto Contraste' : 'High Contrast' }}\r
      </label>\r
      <button\r
        (click)="preferencesService.toggleHighContrast()"\r
        [class.bg-brand-blue]="(preferencesService.highContrast$ | async)"\r
        [class.bg-gray-700]="!(preferencesService.highContrast$ | async)"\r
        class="w-full px-4 py-2 rounded-lg text-white transition-all hover:opacity-80 flex items-center justify-center gap-2"\r
        [attr.aria-pressed]="(preferencesService.highContrast$ | async)"\r
      >\r
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">\r
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>\r
        </svg>\r
        {{ (preferencesService.highContrast$ | async) ? ((preferencesService.language$ | async) === 'es' ? 'Activado' : 'Enabled') : ((preferencesService.language$ | async) === 'es' ? 'Desactivado' : 'Disabled') }}\r
      </button>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Toggle Sidebar Button -->\r
<button\r
  (click)="preferencesService.toggleSidebar()"\r
  class="fixed right-0 top-32 z-2000 p-3 bg-brand-blue hover:bg-brand-dark-blue text-white rounded-l-lg transition-all shadow-lg cursor-pointer"\r
  [class.hidden]="(preferencesService.sidebarOpen$ | async)"\r
  [attr.aria-label]="(preferencesService.language$ | async) === 'es' ? 'Abrir panel de accesibilidad' : 'Open accessibility panel'"\r
  title="Accessibility"\r
>\r
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">\r
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>\r
  </svg>\r
</button>\r
` }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccessibilitySidebarComponent, { className: "AccessibilitySidebarComponent", filePath: "src/app/shared/components/accessibility-sidebar/accessibility-sidebar.component.ts", lineNumber: 11 });
})();

export {
  AccessibilitySidebarComponent
};
//# sourceMappingURL=chunk-GUMHHYLY.js.map
