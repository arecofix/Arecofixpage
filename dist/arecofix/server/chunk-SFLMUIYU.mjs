import './polyfills.server.mjs';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";

// src/app/shared/components/resource-status/is-empty/is-empty.component.ts
var IsEmptyComponent = class _IsEmptyComponent {
  static \u0275fac = function IsEmptyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IsEmptyComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IsEmptyComponent, selectors: [["is-empty"]], decls: 3, vars: 0, consts: [["role", "alert", 1, "alert", "alert-warning", "alert-outline", "text-center", "p-10", "m-10"]], template: function IsEmptyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "span");
      \u0275\u0275text(2, " No Hay Datos Para Mostrar ");
      \u0275\u0275domElementEnd()();
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsEmptyComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "is-empty",
      standalone: true,
      imports: [],
      template: `
    <div
      role="alert"
      class="alert alert-warning alert-outline text-center p-10 m-10"
    >
      <span> No Hay Datos Para Mostrar </span>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IsEmptyComponent, { className: "IsEmptyComponent", filePath: "src/app/shared/components/resource-status/is-empty/is-empty.component.ts", lineNumber: 18 });
})();

// src/app/shared/components/resource-status/is-error/is-error.component.ts
var IsErrorComponent = class _IsErrorComponent {
  message = "Ups! Ocurrio Un Error Al Cargar Los Datos";
  static \u0275fac = function IsErrorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IsErrorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IsErrorComponent, selectors: [["is-error"]], inputs: { message: "message" }, decls: 3, vars: 1, consts: [["role", "alert", 1, "alert", "alert-error", "alert-outline", "text-center", "p-10", "m-10"]], template: function IsErrorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "span");
      \u0275\u0275text(2);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.message, " ");
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsErrorComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "is-error",
      standalone: true,
      imports: [],
      template: `
    <div
      role="alert"
      class="alert alert-error alert-outline text-center p-10 m-10"
    >
      <span> {{ message }} </span>
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, { message: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IsErrorComponent, { className: "IsErrorComponent", filePath: "src/app/shared/components/resource-status/is-error/is-error.component.ts", lineNumber: 19 });
})();

// src/app/shared/components/resource-status/is-loading/is-loading.component.ts
var IsLoadingComponent = class _IsLoadingComponent {
  static \u0275fac = function IsLoadingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IsLoadingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IsLoadingComponent, selectors: [["is-loading"]], decls: 3, vars: 0, consts: [[1, "alert", "alert-info", "alert-soft", "text-center", "p-10", "m-10"], [1, "loading", "loading-ring", "loading-xl"]], template: function IsLoadingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275domElement(1, "span", 1);
      \u0275\u0275text(2, "Cargando Datos ... ");
      \u0275\u0275domElementEnd();
    }
  }, encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IsLoadingComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "is-loading",
      standalone: true,
      imports: [],
      template: `
    <div class="alert alert-info alert-soft text-center p-10 m-10">
      <span class="loading loading-ring loading-xl"></span>Cargando Datos ...
    </div>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IsLoadingComponent, { className: "IsLoadingComponent", filePath: "src/app/shared/components/resource-status/is-loading/is-loading.component.ts", lineNumber: 15 });
})();

export {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent
};
//# sourceMappingURL=chunk-SFLMUIYU.mjs.map
