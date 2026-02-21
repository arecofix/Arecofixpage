import './polyfills.server.mjs';
import {
  CommonModule,
  NgForOf,
  NgIf,
  RouterLink,
  RouterModule
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";

// src/app/shared/components/breadcrumbs/breadcrumbs.component.ts
function BreadcrumbsComponent_li_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "a", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "i", 7);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r1.url);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.label, " ");
  }
}
function BreadcrumbsComponent_li_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.label, " ");
  }
}
function BreadcrumbsComponent_li_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 4);
    \u0275\u0275template(1, BreadcrumbsComponent_li_2_ng_container_1_Template, 4, 2, "ng-container", 5)(2, BreadcrumbsComponent_li_2_ng_template_2_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const last_r2 = ctx.last;
    const lastItem_r3 = \u0275\u0275reference(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !last_r2)("ngIfElse", lastItem_r3);
  }
}
var BreadcrumbsComponent = class _BreadcrumbsComponent {
  items = [];
  static \u0275fac = function BreadcrumbsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreadcrumbsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BreadcrumbsComponent, selectors: [["app-breadcrumbs"]], inputs: { items: "items" }, decls: 3, vars: 1, consts: [["lastItem", ""], ["aria-label", "Breadcrumb", 1, "container", "mx-auto", "px-4", "py-4"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-500", "dark:text-gray-400"], ["class", "flex items-center", 4, "ngFor", "ngForOf"], [1, "flex", "items-center"], [4, "ngIf", "ngIfElse"], [1, "hover:text-primary", "transition-colors", "hover:underline", 3, "routerLink"], [1, "fas", "fa-chevron-right", "text-xs", "mx-2", "opacity-50"], ["aria-current", "page", 1, "font-semibold", "text-gray-900", "dark:text-gray-200"]], template: function BreadcrumbsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 1)(1, "ol", 2);
      \u0275\u0275template(2, BreadcrumbsComponent_li_2_Template, 4, 2, "li", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.items);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, RouterModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbsComponent, [{
    type: Component,
    args: [{ selector: "app-breadcrumbs", standalone: true, imports: [CommonModule, RouterModule], template: `
    <nav aria-label="Breadcrumb" class="container mx-auto px-4 py-4">
      <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <li *ngFor="let item of items; let last = last" class="flex items-center">
          <ng-container *ngIf="!last; else lastItem">
            <a [routerLink]="item.url" class="hover:text-primary transition-colors hover:underline">
              {{ item.label }}
            </a>
            <i class="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
          </ng-container>
          <ng-template #lastItem>
            <span class="font-semibold text-gray-900 dark:text-gray-200" aria-current="page">
              {{ item.label }}
            </span>
          </ng-template>
        </li>
      </ol>
    </nav>
  ` }]
  }], null, { items: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BreadcrumbsComponent, { className: "BreadcrumbsComponent", filePath: "src/app/shared/components/breadcrumbs/breadcrumbs.component.ts", lineNumber: 35 });
})();

export {
  BreadcrumbsComponent
};
//# sourceMappingURL=chunk-YWYL5GT7.mjs.map
