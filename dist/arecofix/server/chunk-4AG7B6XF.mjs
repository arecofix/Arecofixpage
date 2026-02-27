import './polyfills.server.mjs';
import {
  RouterLink,
  RouterModule
} from "./chunk-GLYZDHZB.mjs";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-RN3QJLYL.mjs";

// src/app/shared/components/breadcrumbs/breadcrumbs.component.ts
function BreadcrumbsComponent_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "i", 5);
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", item_r1.url);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.label, " ");
  }
}
function BreadcrumbsComponent_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.label, " ");
  }
}
function BreadcrumbsComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2);
    \u0275\u0275conditionalCreate(1, BreadcrumbsComponent_For_3_Conditional_1_Template, 3, 2)(2, BreadcrumbsComponent_For_3_Conditional_2_Template, 2, 1, "span", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_5_r2 = ctx.$index;
    const \u0275$count_5_r3 = ctx.$count;
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_5_r2 === \u0275$count_5_r3 - 1) ? 1 : 2);
  }
}
var BreadcrumbsComponent = class _BreadcrumbsComponent {
  items = [];
  trackByBreadcrumb(index, item) {
    return `${item.label}-${item.url || ""}`;
  }
  static \u0275fac = function BreadcrumbsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreadcrumbsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BreadcrumbsComponent, selectors: [["app-breadcrumbs"]], inputs: { items: "items" }, decls: 4, vars: 0, consts: [["aria-label", "Breadcrumb", 1, "container", "mx-auto", "px-4", "py-4"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "flex", "items-center"], ["aria-current", "page", 1, "font-semibold", "text-gray-900", "dark:text-gray-200"], [1, "hover:text-primary", "transition-colors", "hover:underline", 3, "routerLink"], [1, "fas", "fa-chevron-right", "text-xs", "mx-2", "opacity-50"]], template: function BreadcrumbsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "ol", 1);
      \u0275\u0275repeaterCreate(2, BreadcrumbsComponent_For_3_Template, 3, 1, "li", 2, ctx.trackByBreadcrumb, true);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.items);
    }
  }, dependencies: [RouterModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbsComponent, [{
    type: Component,
    args: [{ selector: "app-breadcrumbs", standalone: true, imports: [RouterModule], template: `
    <nav aria-label="Breadcrumb" class="container mx-auto px-4 py-4">
      <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        @for (item of items; track trackByBreadcrumb($index, item); let last = $last) {
          <li class="flex items-center">
            @if (!last) {
              <a [routerLink]="item.url" class="hover:text-primary transition-colors hover:underline">
                {{ item.label }}
              </a>
              <i class="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
            } @else {
              <span class="font-semibold text-gray-900 dark:text-gray-200" aria-current="page">
                {{ item.label }}
              </span>
            }
          </li>
        }
      </ol>
    </nav>
    ` }]
  }], null, { items: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BreadcrumbsComponent, { className: "BreadcrumbsComponent", filePath: "src/app/shared/components/breadcrumbs/breadcrumbs.component.ts", lineNumber: 36 });
})();

export {
  BreadcrumbsComponent
};
//# sourceMappingURL=chunk-4AG7B6XF.mjs.map
