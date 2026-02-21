import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule
} from "./chunk-B7SLUDL7.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  input,
  linkedSignal,
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
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-4O7IFJFV.js";

// src/app/shared/components/pagination/pagination.ts
var _c0 = () => [];
var _c1 = (a0) => ({ _page: a0 });
function Pagination_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275text(1, "...");
    \u0275\u0275elementEnd();
  }
}
function Pagination_For_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function Pagination_For_4_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const page_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onPageChange(page_r2));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("btn-primary", page_r2 === ctx_r2.activePage())("btn-ghost", page_r2 !== ctx_r2.activePage());
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(7, _c0))("queryParams", \u0275\u0275pureFunction1(8, _c1, page_r2));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r2, " ");
  }
}
function Pagination_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, Pagination_For_4_Conditional_0_Template, 2, 0, "button", 6)(1, Pagination_For_4_Conditional_1_Template, 2, 10, "button", 7);
  }
  if (rf & 2) {
    const page_r2 = ctx.$implicit;
    \u0275\u0275conditional(page_r2 === "..." ? 0 : 1);
  }
}
function Pagination_ForEmpty_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 3);
    \u0275\u0275text(1, "1");
    \u0275\u0275elementEnd();
  }
}
var Pagination = class _Pagination {
  pages = input(0, ...ngDevMode ? [{ debugName: "pages" }] : []);
  currentPage = input(1, ...ngDevMode ? [{ debugName: "currentPage" }] : []);
  activePage = linkedSignal(this.currentPage, ...ngDevMode ? [{ debugName: "activePage" }] : []);
  getPagesList = computed(() => {
    const total = this.pages();
    const current = this.activePage();
    const range = 3;
    if (total <= 1)
      return [1];
    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);
    const pages = [];
    if (start > 1) {
      pages.push(1);
      if (start > 2)
        pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total) {
      if (end < total - 1)
        pages.push("...");
      pages.push(total);
    }
    return pages;
  }, ...ngDevMode ? [{ debugName: "getPagesList" }] : []);
  onPageChange(page) {
    if (typeof page === "string")
      return;
    if (page < 1 || page > this.pages())
      return;
    this.activePage.set(page);
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  next() {
    const nextP = this.activePage() + 1;
    if (nextP <= this.pages()) {
      this.navigateTo(nextP);
    }
  }
  prev() {
    const prevP = this.activePage() - 1;
    if (prevP >= 1) {
      this.navigateTo(prevP);
    }
  }
  navigateTo(page) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { _page: page },
      queryParamsHandling: "merge"
    });
  }
  static \u0275fac = function Pagination_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Pagination)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Pagination, selectors: [["pagination"]], inputs: { pages: [1, "pages"], currentPage: [1, "currentPage"] }, decls: 8, vars: 5, consts: [[1, "join", "flex", "flex-wrap", "justify-center", "items-center", "gap-1", "shadow-sm", "bg-white", "dark:bg-gray-800", "p-1", "rounded-lg"], ["aria-label", "P\xE1gina anterior", 1, "join-item", "btn", "btn-sm", "md:btn-md", 3, "click"], [1, "fas", "fa-chevron-left"], [1, "join-item", "btn", "btn-sm", "md:btn-md", "btn-primary"], ["aria-label", "P\xE1gina siguiente", 1, "join-item", "btn", "btn-sm", "md:btn-md", 3, "click"], [1, "fas", "fa-chevron-right"], [1, "join-item", "btn", "btn-sm", "md:btn-md", "btn-disabled", "text-gray-400"], ["queryParamsHandling", "merge", 1, "join-item", "btn", "btn-sm", "md:btn-md", "min-w-[32px]", "md:min-w-[40px]", 3, "btn-primary", "btn-ghost", "routerLink", "queryParams"], ["queryParamsHandling", "merge", 1, "join-item", "btn", "btn-sm", "md:btn-md", "min-w-[32px]", "md:min-w-[40px]", 3, "click", "routerLink", "queryParams"]], template: function Pagination_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
      \u0275\u0275listener("click", function Pagination_Template_button_click_1_listener() {
        return ctx.prev();
      });
      \u0275\u0275element(2, "i", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(3, Pagination_For_4_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex, false, Pagination_ForEmpty_5_Template, 2, 0, "button", 3);
      \u0275\u0275elementStart(6, "button", 4);
      \u0275\u0275listener("click", function Pagination_Template_button_click_6_listener() {
        return ctx.next();
      });
      \u0275\u0275element(7, "i", 5);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classProp("btn-disabled", ctx.activePage() === 1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.getPagesList());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("btn-disabled", ctx.activePage() === ctx.pages());
    }
  }, dependencies: [RouterModule, RouterLink], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Pagination, [{
    type: Component,
    args: [{ selector: "pagination", standalone: true, imports: [RouterModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="join flex flex-wrap justify-center items-center gap-1 shadow-sm bg-white dark:bg-gray-800 p-1 rounded-lg">\r
  \r
  <!-- Previous Button -->\r
  <button \r
    class="join-item btn btn-sm md:btn-md" \r
    [class.btn-disabled]="activePage() === 1" \r
    (click)="prev()"\r
    aria-label="P\xE1gina anterior">\r
    <i class="fas fa-chevron-left"></i>\r
  </button>\r
\r
  @for (page of getPagesList(); track $index) {\r
    @if (page === '...') {\r
      <button class="join-item btn btn-sm md:btn-md btn-disabled text-gray-400">...</button>\r
    } @else {\r
      <button\r
        class="join-item btn btn-sm md:btn-md min-w-[32px] md:min-w-[40px]"\r
        [class.btn-primary]="page === activePage()"\r
        [class.btn-ghost]="page !== activePage()"\r
        [routerLink]="[]"\r
        [queryParams]="{ _page: page }"\r
        queryParamsHandling="merge"\r
        (click)="onPageChange(page)"\r
      >\r
        {{ page }}\r
      </button>\r
    }\r
  } @empty {\r
    <!-- Fallback if empty -->\r
    <button class="join-item btn btn-sm md:btn-md btn-primary">1</button>\r
  }\r
\r
  <!-- Next Button -->\r
  <button \r
    class="join-item btn btn-sm md:btn-md" \r
    [class.btn-disabled]="activePage() === pages()" \r
    (click)="next()"\r
    aria-label="P\xE1gina siguiente">\r
    <i class="fas fa-chevron-right"></i>\r
  </button>\r
\r
</div>` }]
  }], null, { pages: [{ type: Input, args: [{ isSignal: true, alias: "pages", required: false }] }], currentPage: [{ type: Input, args: [{ isSignal: true, alias: "currentPage", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Pagination, { className: "Pagination", filePath: "src/app/shared/components/pagination/pagination.ts", lineNumber: 19 });
})();

export {
  Pagination
};
//# sourceMappingURL=chunk-JJNYOOVF.js.map
