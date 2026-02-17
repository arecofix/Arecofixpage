import {
  AccessibilitySidebarComponent
} from "./chunk-FWQVVDTE.js";
import {
  PreferencesService
} from "./chunk-3REJ4TOE.js";
import {
  SeoService
} from "./chunk-WS7FSRNX.js";
import {
  rxResource
} from "./chunk-D3DVUTQW.js";
import {
  CategoryService
} from "./chunk-QTLDSSZK.js";
import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  CartService
} from "./chunk-2WPTPN3R.js";
import "./chunk-Y2OIOFIB.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import {
  environment
} from "./chunk-3R5MH5C6.js";
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgIf,
  NgOptimizedImage,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  isPlatformBrowser
} from "./chunk-OCHCYWDE.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  Renderer2,
  Subject,
  computed,
  effect,
  inject,
  map,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-K7T46PVE.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/public/layout/components/header/public-layout-header.ts
var _c0 = () => ({ exact: true });
var _c1 = () => ["/"];
var _c2 = () => ({ exact: false });
var _c3 = (a0) => ["/productos/detalle", a0];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.path;
var _forTrack2 = ($index, $item) => $item.product.id;
function PublicLayoutHeader_Conditional_13_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 62);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_13_For_3_Template_a_click_1_listener() {
      const product_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.selectProduct(product_r3));
    });
    \u0275\u0275element(2, "img", 63);
    \u0275\u0275elementStart(3, "div", 64)(4, "span", 65);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 66);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const product_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("alt", \u0275\u0275interpolate(product_r3.name))("src", product_r3.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", product_r3.price);
  }
}
function PublicLayoutHeader_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "ul", 61);
    \u0275\u0275repeaterCreate(2, PublicLayoutHeader_Conditional_13_For_3_Template, 8, 5, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.filteredProducts());
  }
}
function PublicLayoutHeader_For_15_Conditional_1_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 73);
    \u0275\u0275element(2, "i");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", child_r6.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance();
    \u0275\u0275classMap(child_r6.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", child_r6.title, " ");
  }
}
function PublicLayoutHeader_For_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "details", 67)(1, "summary", 69)(2, "a", 70);
    \u0275\u0275listener("click", function PublicLayoutHeader_For_15_Conditional_1_Template_a_click_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(3, "i");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "i", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ul", 72);
    \u0275\u0275repeaterCreate(7, PublicLayoutHeader_For_15_Conditional_1_For_8_Template, 4, 6, "li", null, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", item_r7.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r7.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r7.title, " ");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(item_r7.children);
  }
}
function PublicLayoutHeader_For_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 68);
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", item_r7.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r7.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r7.title, " ");
  }
}
function PublicLayoutHeader_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275conditionalCreate(1, PublicLayoutHeader_For_15_Conditional_1_Template, 9, 6, "details", 67)(2, PublicLayoutHeader_For_15_Conditional_2_Template, 3, 6, "a", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r7.children && item_r7.children.length > 0 ? 1 : 2);
  }
}
function PublicLayoutHeader_For_45_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 78)(2, "span", 79);
    \u0275\u0275element(3, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", child_r8.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(child_r8.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", child_r8.title, " ");
  }
}
function PublicLayoutHeader_For_45_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "a", 75);
    \u0275\u0275element(2, "i");
    \u0275\u0275text(3);
    \u0275\u0275element(4, "i", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ul", 77);
    \u0275\u0275repeaterCreate(6, PublicLayoutHeader_For_45_Conditional_1_For_7_Template, 5, 6, "li", null, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r9.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c2));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r9.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r9.title, " ");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(item_r9.children);
  }
}
function PublicLayoutHeader_For_45_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 74);
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", item_r9.path)("routerLinkActiveOptions", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r9.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r9.title, " ");
  }
}
function PublicLayoutHeader_For_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 31);
    \u0275\u0275conditionalCreate(1, PublicLayoutHeader_For_45_Conditional_1_Template, 8, 6, "div", 34)(2, PublicLayoutHeader_For_45_Conditional_2_Template, 3, 6, "a", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r9.children && item_r9.children.length > 0 ? 1 : 2);
  }
}
function PublicLayoutHeader_Conditional_78_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 81);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_78_For_3_Template_a_click_1_listener() {
      const product_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.selectProduct(product_r11));
    });
    \u0275\u0275element(2, "img", 82);
    \u0275\u0275elementStart(3, "div", 64)(4, "span", 83);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 84);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const product_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("alt", \u0275\u0275interpolate(product_r11.name))("src", product_r11.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r11.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("$", product_r11.price);
  }
}
function PublicLayoutHeader_Conditional_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "ul", 80);
    \u0275\u0275repeaterCreate(2, PublicLayoutHeader_Conditional_78_For_3_Template, 8, 5, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.filteredProducts());
  }
}
function PublicLayoutHeader_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.cartService.totalItems());
  }
}
function PublicLayoutHeader_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 85);
    \u0275\u0275element(2, "i", 86);
    \u0275\u0275elementStart(3, "span", 87)(4, "span", 88);
    \u0275\u0275text(5, "Mi Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 89);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(8, "li")(9, "button", 90);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_89_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.logout());
    });
    \u0275\u0275element(10, "i", 91);
    \u0275\u0275text(11, " Cerrar Sesi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "li")(13, "a", 92);
    \u0275\u0275element(14, "i", 93);
    \u0275\u0275text(15, " Admin");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const user_r13 = \u0275\u0275readContextLet(87);
    \u0275\u0275advance(6);
    \u0275\u0275property("title", user_r13 == null ? null : user_r13.email);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(user_r13 == null ? null : user_r13.email);
  }
}
function PublicLayoutHeader_Conditional_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 94);
    \u0275\u0275element(2, "i", 95);
    \u0275\u0275text(3, " Iniciar Sesi\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "li")(5, "a", 96);
    \u0275\u0275element(6, "i", 93);
    \u0275\u0275text(7, " Registrarse");
    \u0275\u0275elementEnd()();
  }
}
function PublicLayoutHeader_Conditional_91_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 114)(1, "p", 124);
    \u0275\u0275text(2, "Tu carrito est\xE1 vac\xEDo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 125);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Conditional_20_Template_a_click_3_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(4, " Ver Productos \u2192 ");
    \u0275\u0275elementEnd()();
  }
}
function PublicLayoutHeader_Conditional_91_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 126)(1, "div", 127);
    \u0275\u0275element(2, "img", 128);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 129)(4, "div")(5, "div", 117)(6, "h3")(7, "a", 130);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Conditional_21_For_2_Template_a_click_7_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 131);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "p", 132);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 133);
    \u0275\u0275element(15, "p", 124);
    \u0275\u0275elementStart(16, "div", 134)(17, "button", 122);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Conditional_21_For_2_Template_button_click_17_listener() {
      const item_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.cartService.removeFromCart(item_r17.product.id));
    });
    \u0275\u0275text(18, "Eliminar");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const item_r17 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", item_r17.product.image_url || "/assets/img/no-image.png", \u0275\u0275sanitizeUrl)("alt", item_r17.product.name);
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(8, _c3, item_r17.product.slug));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r17.product.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 6, item_r17.product.price));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Cantidad: ", item_r17.quantity);
  }
}
function PublicLayoutHeader_Conditional_91_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 115);
    \u0275\u0275repeaterCreate(1, PublicLayoutHeader_Conditional_91_Conditional_21_For_2_Template, 19, 10, "li", 126, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.cartService.cartItems());
  }
}
function PublicLayoutHeader_Conditional_91_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 97);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 98)(3, "div", 99)(4, "div", 100)(5, "div", 101)(6, "div", 102)(7, "div", 103)(8, "div", 104)(9, "h2", 105);
    \u0275\u0275text(10, "Carrito de Compras");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 106)(12, "button", 107);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275element(13, "span", 108);
    \u0275\u0275elementStart(14, "span", 109);
    \u0275\u0275text(15, "Cerrar panel");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(16, "svg", 110);
    \u0275\u0275element(17, "path", 111);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(18, "div", 112)(19, "div", 113);
    \u0275\u0275conditionalCreate(20, PublicLayoutHeader_Conditional_91_Conditional_20_Template, 5, 0, "div", 114)(21, PublicLayoutHeader_Conditional_91_Conditional_21_Template, 3, 0, "ul", 115);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 116)(23, "div", 117)(24, "p");
    \u0275\u0275text(25, "Subtotal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p");
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "p", 118);
    \u0275\u0275text(30, "Env\xEDo e impuestos calculados al finalizar compra.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 119)(32, "a", 120);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Template_a_click_32_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(33, "Finalizar Compra");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 121)(35, "p");
    \u0275\u0275text(36, " o ");
    \u0275\u0275elementStart(37, "button", 122);
    \u0275\u0275listener("click", function PublicLayoutHeader_Conditional_91_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleCart());
    });
    \u0275\u0275text(38, " Continuar Comprando ");
    \u0275\u0275elementStart(39, "span", 123);
    \u0275\u0275text(40, " \u2192");
    \u0275\u0275elementEnd()()()()()()()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(20);
    \u0275\u0275conditional(ctx_r3.cartService.cartItems().length === 0 ? 20 : 21);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 2, ctx_r3.cartService.totalPrice()));
  }
}
var PublicLayoutHeader = class _PublicLayoutHeader {
  appName = environment.appName;
  categoryService = inject(CategoryService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  el = inject(ElementRef);
  renderer = inject(Renderer2);
  user$ = this.authService.authState$.pipe(map((state) => state.user));
  // Search Logic
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : []);
  products = signal([], ...ngDevMode ? [{ debugName: "products" }] : []);
  showResults = signal(false, ...ngDevMode ? [{ debugName: "showResults" }] : []);
  // Cart Drawer Logic
  // Delegating to CartService for global state
  isCartOpen = this.cartService.isCartOpen;
  toggleCart() {
    this.cartService.toggleCart();
  }
  // Navbar Visibility Logic
  isVisible = signal(true, ...ngDevMode ? [{ debugName: "isVisible" }] : []);
  destroy$ = new Subject();
  lastScrollTop = 0;
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query)
      return [];
    return this.products().filter((p) => p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query)).slice(0, 10);
  }, ...ngDevMode ? [{ debugName: "filteredProducts" }] : []);
  constructor() {
    this.loadProducts();
    effect(() => {
      const items = this.cartService.cartItems();
      if (items.length > 0) {
        this.showNavbar();
        this.lastScrollTop = isPlatformBrowser(this.platformId) ? window.scrollY || document.documentElement.scrollTop : 0;
      }
    });
  }
  ngAfterViewInit() {
  }
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId))
      return;
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll < 50) {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
      return;
    }
    const scrollDelta = currentScroll - this.lastScrollTop;
    if (scrollDelta > 0) {
      if (Math.abs(scrollDelta) > 10) {
        this.hideNavbar();
        this.lastScrollTop = currentScroll;
      }
    } else {
      this.showNavbar();
      this.lastScrollTop = currentScroll;
    }
  }
  showNavbar() {
    if (!this.isVisible()) {
      this.isVisible.set(true);
      this.renderer.removeClass(this.el.nativeElement, "hidden-navbar");
      this.cdr.markForCheck();
    }
  }
  hideNavbar() {
    if (this.isVisible()) {
      this.isVisible.set(false);
      this.renderer.addClass(this.el.nativeElement, "hidden-navbar");
      this.cdr.markForCheck();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async loadProducts() {
    const supabase = this.authService.getSupabaseClient();
    const { data } = await supabase.from("products").select("*").eq("is_active", true).gt("stock", 0).order("name");
    if (data) {
      this.products.set(data);
    }
  }
  onSearchInput() {
    this.showResults.set(!!this.searchQuery());
  }
  selectProduct(product) {
    this.searchQuery.set("");
    this.showResults.set(false);
    this.router.navigate(["/productos/detalle", product.slug || product.id]);
  }
  categoryRs = rxResource({
    stream: () => this.categoryService.getFeaturedData()
  });
  menuItems = computed(() => {
    const rawItems = this.categoryRs.value()?.data ?? [];
    const filteredItems = rawItems.filter((category) => category.slug !== "sports" && category.name !== "Deportes");
    const allMenuItems = filteredItems.map((category) => {
      let icon = category.icon;
      if (category.name === "Celulares")
        icon = "fas fa-mobile-alt";
      if (category.name === "Repuestos")
        icon = "fas fa-tools";
      if (category.name === "Cursos")
        icon = "fas fa-graduation-cap";
      if (category.name === "Herramientas")
        icon = "fas fa-wrench";
      let slug = category.slug;
      if (slug === "electrnicos")
        slug = "electronicos";
      return {
        id: String(category.id),
        // Keep track of ID for nesting
        title: category.name,
        path: "/productos/categoria/" + slug.toLowerCase(),
        icon: icon || "fas fa-box",
        parentId: category.parent_id ? String(category.parent_id) : void 0,
        children: []
      };
    });
    const repuestosItem = allMenuItems.find((i) => i.title === "Repuestos");
    const herramientasItem = allMenuItems.find((i) => i.title === "Herramientas");
    if (repuestosItem && herramientasItem) {
      herramientasItem.parentId = repuestosItem.id;
    }
    const rootItems = [];
    const itemMap = /* @__PURE__ */ new Map();
    allMenuItems.forEach((item) => {
      if (item.id)
        itemMap.set(item.id, item);
    });
    allMenuItems.forEach((item) => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId);
        parent.children = parent.children || [];
        parent.children.push(item);
      } else {
        rootItems.push(item);
      }
    });
    return rootItems.sort((a, b) => {
      if (a.title === "Celulares")
        return -1;
      if (b.title === "Celulares")
        return 1;
      return 0;
    });
  }, ...ngDevMode ? [{ debugName: "menuItems" }] : []);
  async logout() {
    try {
      await this.authService.signOut();
      this.cdr.markForCheck();
      this.router.navigate(["/login"]);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }
  static \u0275fac = function PublicLayoutHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicLayoutHeader)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicLayoutHeader, selectors: [["public-layout-header"]], hostBindings: function PublicLayoutHeader_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("scroll", function PublicLayoutHeader_scroll_HostBindingHandler() {
        return ctx.onWindowScroll();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 92, vars: 25, consts: [[1, "navbar", "glass-panel", "border-b", "border-gray-200", "dark:border-white/5", "sticky", "top-0", "z-100", "backdrop-blur-md", "text-gray-900", "dark:text-white", "transition-colors", "duration-300", "lg:min-h-16", "lg:h-16"], [1, "navbar-start"], [1, "dropdown"], ["tabindex", "0", "role", "button", "aria-label", "Abrir men\xFA", 1, "btn", "btn-ghost", "lg:hidden", "text-gray-900", "dark:text-white", "opacity-100", "hover:bg-black/5", "dark:hover:bg-white/10"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-5", "w-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4 6h16M4 12h8m-8 6h16"], ["tabindex", "0", 1, "menu", "menu-sm", "dropdown-content", "bg-white", "dark:bg-[#1a1a1a]", "rounded-box", "z-50", "mt-3", "w-60", "p-2", "shadow-xl", "border", "border-gray-200", "dark:border-white/10", "text-gray-900", "dark:text-gray-200", "animate-fade-in-up"], [1, "mb-4"], [1, "relative"], [1, "join", "w-full"], ["type", "text", "placeholder", "Buscar...", "aria-label", "Buscar productos", 1, "input", "input-sm", "input-bordered", "w-full", "bg-gray-100", "dark:bg-[#333]", "border-gray-300", "dark:border-gray-600", "text-gray-900", "dark:text-white", "join-item", "placeholder-gray-500", "dark:placeholder-gray-400", 3, "ngModelChange", "input", "ngModel"], ["aria-label", "Buscar", 1, "btn", "btn-sm", "btn-primary", "join-item", "border-none"], [1, "fas", "fa-search"], [1, "absolute", "top-full", "left-0", "w-full", "mt-1", "bg-[#222]", "border", "border-gray-600", "rounded-lg", "shadow-xl", "z-50", "overflow-hidden", "animate-fade-in-up"], ["routerLink", "productos/destacados", "routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLinkActiveOptions"], [1, "fas", "fa-star", "text-yellow-500"], ["routerLink", "categories", "routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLinkActiveOptions"], [1, "fas", "fa-tag"], ["routerLink", "/contacto", "routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLinkActiveOptions"], [1, "fas", "fa-envelope"], ["routerLink", "/nosotros", "routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLinkActiveOptions"], [1, "fas", "fa-info-circle"], ["routerLink", "/servicios", "routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLinkActiveOptions"], [1, "fas", "fa-concierge-bell"], [1, "flex", "shrink-0", "items-center", "gap-3", "px-3", "py-1", "rounded-xl", "hover:bg-black/5", "dark:hover:bg-white/5", "transition-all", "duration-300", "group", 3, "routerLink"], [1, "relative", "group-hover:scale-105", "transition-transform"], ["src", "/assets/img/brands/logo/Logo (2).png", "alt", "Arecofix Logo", "height", "36", "width", "120", 1, "h-9", "w-auto", "object-contain", "hidden", "dark:block", "drop-shadow-lg"], ["src", "/assets/img/brands/logo/logo-normal1.PNG", "alt", "Arecofix Logo", "height", "36", "width", "120", 1, "h-9", "w-auto", "object-contain", "dark:hidden", "drop-shadow-md"], [1, "font-bold", "text-xl", "text-gray-900", "dark:text-white", "font-heading", "tracking-wide", "group-hover:text-blue-600", "dark:group-hover:text-blue-400", "transition-colors"], [1, "navbar-center", "hidden", "lg:flex"], [1, "menu", "menu-horizontal", "px-1", "gap-2", "items-center"], [1, "h-full", "flex", "items-center"], ["routerLink", "productos/destacados", "routerLinkActive", "text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold", 1, "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "rounded-xl", "font-medium", "px-4", "h-10", "hover-lift", "flex", "items-center", "gap-2", 3, "routerLinkActiveOptions"], [1, "fas", "fa-star", "text-blue-500"], [1, "dropdown", "dropdown-hover", "group/dropdown"], ["tabindex", "0", "role", "button", 1, "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "rounded-xl", "flex", "items-center", "gap-2", "font-medium", "px-4", "h-10", "hover-lift"], [1, "fas", "fa-ellipsis-h"], ["tabindex", "0", 1, "dropdown-content", "z-50", "menu", "p-2", "shadow-2xl", "bg-white", "dark:bg-[#1a1a1a]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "w-52", "mt-2", "text-gray-600", "dark:text-gray-300", "animate-fade-in-up"], ["routerLink", "categories", "routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5", 1, "hover:bg-blue-50", "dark:hover:bg-white/10", "hover:text-blue-600", "dark:hover:text-white", "rounded-lg", "py-2"], [1, "fas", "fa-tag", "w-5", "text-center"], ["routerLink", "/servicios", "routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5", 1, "hover:bg-blue-50", "dark:hover:bg-white/10", "hover:text-blue-600", "dark:hover:text-white", "rounded-lg", "py-2"], [1, "fas", "fa-concierge-bell", "w-5", "text-center"], ["routerLink", "/nosotros", "routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5", 1, "hover:bg-blue-50", "dark:hover:bg-white/10", "hover:text-blue-600", "dark:hover:text-white", "rounded-lg", "py-2"], [1, "fas", "fa-info-circle", "w-5", "text-center"], ["routerLink", "/contacto", "routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5", 1, "hover:bg-blue-50", "dark:hover:bg-white/10", "hover:text-blue-600", "dark:hover:text-white", "rounded-lg", "py-2"], [1, "fas", "fa-envelope", "w-5", "text-center"], [1, "navbar-end", "flex", "items-center", "gap-2", "lg:gap-4"], [1, "hidden", "lg:flex", "items-center", "gap-2", "relative", "group"], [1, "join", "transition-all", "duration-300", "focus-within:ring-2", "focus-within:ring-blue-500/50", "rounded-full"], ["type", "text", "placeholder", "Buscar...", 1, "input", "input-sm", "input-bordered", "rounded-l-full", "bg-gray-100", "dark:bg-white/10", "text-gray-900", "dark:text-white", "border-transparent", "focus:border-transparent", "w-48", "focus:w-64", "transition-all", "duration-300", "placeholder-gray-500", 3, "ngModelChange", "input", "ngModel"], ["aria-label", "Buscar", 1, "btn", "btn-sm", "btn-primary", "rounded-r-full", "border-none", "text-white", "px-4"], [1, "absolute", "top-full", "right-0", "w-80", "mt-2", "bg-white", "dark:bg-[#1a1a1a]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "shadow-2xl", "z-50", "overflow-hidden", "animate-fade-in-up"], ["aria-label", "Carrito", 1, "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-900", "dark:text-white", 3, "click"], [1, "indicator"], [1, "fas", "fa-shopping-cart", "text-lg"], [1, "badge", "badge-sm", "indicator-item", "bg-red-500", "text-white", "border-none"], [1, "dropdown", "dropdown-end"], ["tabindex", "0", "role", "button", "aria-label", "Men\xFA de usuario", 1, "btn", "btn-circle", "btn-sm", "btn-ghost", "hover:bg-black/10", "dark:hover:bg-white/10", "text-gray-900", "dark:text-white"], [1, "fas", "fa-user", "text-lg"], ["tabindex", "0", 1, "menu", "menu-sm", "dropdown-content", "mt-3", "z-50", "p-2", "shadow-xl", "bg-[#1a1a1a]", "border", "border-white/10", "rounded-box", "w-64", "text-gray-200"], ["aria-labelledby", "slide-over-title", "role", "dialog", "aria-modal", "true", 1, "relative", "z-2000"], [1, "menu", "menu-sm", "bg-[#222]", "text-gray-200", "p-0"], [1, "flex", "items-center", "gap-3", "p-2", "hover:bg-white/10", "rounded-none", "text-gray-200", 3, "click"], [1, "w-8", "h-8", "object-contain", "rounded", "bg-white", "border", 3, "src", "alt"], [1, "flex", "flex-col", "flex-1", "min-w-0"], [1, "font-bold", "text-sm", "text-gray-200", "whitespace-normal", "leading-tight", "line-clamp-2"], [1, "text-xs", "text-gray-400"], [1, "group"], ["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-3", "hover:text-blue-500", "transition-colors", "font-medium", 3, "routerLink", "routerLinkActiveOptions"], [1, "flex", "items-center", "justify-between", "py-3", "pr-2", "outline-none", "cursor-pointer", "list-none", "[&::-webkit-details-marker]:hidden", "after:hidden!", "hover:text-blue-500", "transition-colors"], ["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "flex-1", "items-center", "font-medium", 3, "click", "routerLink", "routerLinkActiveOptions"], [1, "fas", "fa-chevron-down", "text-sm", "transition-transform", "group-open:rotate-180"], [1, "pl-4", "border-l", "border-gray-200", "dark:border-white/10", "ml-2", "mt-2", "space-y-1"], ["routerLinkActive", "text-blue-500 font-bold", 1, "flex", "gap-3", "py-2", "hover:text-blue-500", "transition-colors", "text-sm", 3, "routerLink", "routerLinkActiveOptions"], ["routerLinkActive", "text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold", 1, "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "rounded-xl", "font-medium", "px-4", "h-10", "hover-lift", "flex", "items-center", "gap-2", 3, "routerLink", "routerLinkActiveOptions"], ["routerLinkActive", "text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold", 1, "text-gray-600", "dark:text-gray-300", "hover:text-blue-600", "dark:hover:text-white", "hover:bg-black/5", "dark:hover:bg-white/10", "transition-all", "rounded-xl", "flex", "items-center", "gap-2", "font-medium", "px-4", "h-10", "hover-lift", 3, "routerLink", "routerLinkActiveOptions"], [1, "fas", "fa-chevron-down", "text-[10px]", "opacity-50", "group-hover/dropdown:rotate-180", "transition-transform", "duration-300"], ["tabindex", "0", 1, "dropdown-content", "z-50", "menu", "p-2", "shadow-2xl", "bg-white", "dark:bg-[#1a1a1a]", "border", "border-gray-100", "dark:border-white/10", "rounded-2xl", "w-60", "mt-2", "text-gray-600", "dark:text-gray-300", "animate-fade-in-up"], ["routerLinkActive", "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5", 1, "hover:bg-blue-50", "dark:hover:bg-white/10", "hover:text-blue-600", "dark:hover:text-white", "rounded-lg", "py-3", 3, "routerLink", "routerLinkActiveOptions"], [1, "w-6", "text-center"], [1, "menu", "menu-sm", "bg-transparent", "text-gray-900", "dark:text-gray-200", "p-0"], [1, "flex", "items-center", "gap-3", "p-3", "hover:bg-blue-50", "dark:hover:bg-white/10", "rounded-none", "border-b", "border-gray-100", "dark:border-white/5", "last:border-none", "transition-colors", 3, "click"], [1, "w-10", "h-10", "object-contain", "rounded-lg", "bg-white", "border", "border-gray-100", "shadow-sm", 3, "src", "alt"], [1, "font-bold", "text-sm", "text-gray-800", "dark:text-gray-200", "whitespace-normal", "leading-tight", "line-clamp-2"], [1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400", "mt-1"], ["routerLink", "/perfil", 1, "flex", "items-center", "gap-2", "hover:bg-white/10", "hover:text-white"], [1, "fas", "fa-user-circle"], [1, "flex-1", "min-w-0"], [1, "block", "text-sm", "leading-tight"], [1, "block", "text-xs", "text-gray-500", "truncate", 3, "title"], [1, "hover:bg-white/10", "hover:text-white", 3, "click"], [1, "fas", "fa-sign-out-alt"], ["routerLink", "/admin", 1, "hover:bg-white/10", "hover:text-white"], [1, "fas", "fa-user-plus"], ["routerLink", "/login", 1, "hover:bg-white/10", "hover:text-white"], [1, "fas", "fa-sign-in-alt"], ["routerLink", "/register", 1, "hover:bg-white/10", "hover:text-white"], [1, "fixed", "inset-0", "bg-gray-500/75", "transition-opacity", 3, "click"], [1, "fixed", "inset-0", "overflow-hidden"], [1, "absolute", "inset-0", "overflow-hidden"], [1, "pointer-events-none", "fixed", "inset-y-0", "right-0", "flex", "max-w-full", "pl-10"], [1, "pointer-events-auto", "w-screen", "max-w-md", "transform", "transition", "duration-500", "ease-in-out", "sm:duration-700", "bg-white", "shadow-xl", "h-dvh"], [1, "flex", "h-full", "flex-col", "overflow-y-scroll", "bg-white", "shadow-xl"], [1, "flex-1", "overflow-y-auto", "px-4", "py-6", "sm:px-6"], [1, "flex", "items-start", "justify-between"], ["id", "slide-over-title", 1, "text-lg", "font-medium", "text-gray-900"], [1, "ml-3", "flex", "h-7", "items-center"], ["type", "button", 1, "relative", "-m-2", "p-2", "text-gray-400", "hover:text-gray-500", 3, "click"], [1, "absolute", "-inset-0.5"], [1, "sr-only"], ["fill", "none", "viewBox", "0 0 24 24", "stroke-width", "1.5", "stroke", "currentColor", "aria-hidden", "true", 1, "h-6", "w-6"], ["stroke-linecap", "round", "stroke-linejoin", "round", "d", "M6 18L18 6M6 6l12 12"], [1, "mt-8"], [1, "flow-root"], [1, "text-center", "py-10"], ["role", "list", 1, "-my-6", "divide-y", "divide-gray-200"], [1, "border-t", "border-gray-200", "px-4", "py-6", "sm:px-6"], [1, "flex", "justify-between", "text-base", "font-medium", "text-gray-900"], [1, "mt-0.5", "text-sm", "text-gray-500"], [1, "mt-6"], ["routerLink", "/checkout", 1, "flex", "items-center", "justify-center", "rounded-md", "border", "border-transparent", "bg-indigo-600", "px-6", "py-3", "text-base", "font-medium", "text-white", "shadow-xs", "hover:bg-indigo-700", 3, "click"], [1, "mt-6", "flex", "justify-center", "text-center", "text-sm", "text-gray-500"], ["type", "button", 1, "font-medium", "text-indigo-600", "hover:text-indigo-500", 3, "click"], ["aria-hidden", "true"], [1, "text-gray-500"], ["routerLink", "/productos", 1, "text-indigo-600", "font-medium", "hover:text-indigo-500", "mt-4", "inline-block", 3, "click"], [1, "flex", "py-6"], [1, "size-24", "shrink-0", "overflow-hidden", "rounded-md", "border", "border-gray-200"], [1, "size-full", "object-cover", 3, "src", "alt"], [1, "ml-4", "flex", "flex-1", "flex-col"], [3, "click", "routerLink"], [1, "ml-4"], [1, "mt-1", "text-sm", "text-gray-500"], [1, "flex", "flex-1", "items-end", "justify-between", "text-sm"], [1, "flex"]], template: function PublicLayoutHeader_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 4);
      \u0275\u0275element(5, "path", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(6, "ul", 6)(7, "li", 7)(8, "div", 8)(9, "div", 9)(10, "input", 10);
      \u0275\u0275twoWayListener("ngModelChange", function PublicLayoutHeader_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("input", function PublicLayoutHeader_Template_input_input_10_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSearchInput());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 11);
      \u0275\u0275element(12, "i", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(13, PublicLayoutHeader_Conditional_13_Template, 4, 0, "div", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(14, PublicLayoutHeader_For_15_Template, 3, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementStart(16, "li")(17, "a", 14);
      \u0275\u0275element(18, "i", 15);
      \u0275\u0275text(19, " Destacados ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "li")(21, "a", 16);
      \u0275\u0275element(22, "i", 17);
      \u0275\u0275text(23, " Categor\xEDas ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "li")(25, "a", 18);
      \u0275\u0275element(26, "i", 19);
      \u0275\u0275text(27, " Contacto ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "li")(29, "a", 20);
      \u0275\u0275element(30, "i", 21);
      \u0275\u0275text(31, " Nosotros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "li")(33, "a", 22);
      \u0275\u0275element(34, "i", 23);
      \u0275\u0275text(35, " Servicios ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(36, "a", 24)(37, "div", 25);
      \u0275\u0275element(38, "img", 26)(39, "img", 27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 28);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(42, "div", 29)(43, "ul", 30);
      \u0275\u0275repeaterCreate(44, PublicLayoutHeader_For_45_Template, 3, 1, "li", 31, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementStart(46, "li", 31)(47, "a", 32);
      \u0275\u0275element(48, "i", 33);
      \u0275\u0275text(49, " Destacado ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "li", 31)(51, "div", 34)(52, "div", 35);
      \u0275\u0275element(53, "i", 36);
      \u0275\u0275text(54, " M\xE1s ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "ul", 37)(56, "li")(57, "a", 38);
      \u0275\u0275element(58, "i", 39);
      \u0275\u0275text(59, " Categor\xEDas ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "li")(61, "a", 40);
      \u0275\u0275element(62, "i", 41);
      \u0275\u0275text(63, " Servicios ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "li")(65, "a", 42);
      \u0275\u0275element(66, "i", 43);
      \u0275\u0275text(67, " Nosotros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "li")(69, "a", 44);
      \u0275\u0275element(70, "i", 45);
      \u0275\u0275text(71, " Contacto ");
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(72, "div", 46)(73, "div", 47)(74, "div", 48)(75, "input", 49);
      \u0275\u0275twoWayListener("ngModelChange", function PublicLayoutHeader_Template_input_ngModelChange_75_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("input", function PublicLayoutHeader_Template_input_input_75_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSearchInput());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "button", 50);
      \u0275\u0275element(77, "i", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(78, PublicLayoutHeader_Conditional_78_Template, 4, 0, "div", 51);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "button", 52);
      \u0275\u0275listener("click", function PublicLayoutHeader_Template_button_click_79_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleCart());
      });
      \u0275\u0275elementStart(80, "div", 53);
      \u0275\u0275element(81, "i", 54);
      \u0275\u0275conditionalCreate(82, PublicLayoutHeader_Conditional_82_Template, 2, 1, "span", 55);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(83, "div", 56)(84, "div", 57);
      \u0275\u0275element(85, "i", 58);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "ul", 59);
      \u0275\u0275declareLet(87);
      \u0275\u0275pipe(88, "async");
      \u0275\u0275conditionalCreate(89, PublicLayoutHeader_Conditional_89_Template, 16, 2)(90, PublicLayoutHeader_Conditional_90_Template, 8, 0);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(91, PublicLayoutHeader_Conditional_91_Template, 41, 4, "div", 60);
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showResults() && ctx.filteredProducts().length > 0 ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.menuItems());
      \u0275\u0275advance(3);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(18, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(19, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(20, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(21, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(22, _c0));
      \u0275\u0275advance(3);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(23, _c1));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.appName);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.menuItems());
      \u0275\u0275advance(3);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(24, _c0));
      \u0275\u0275advance(28);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showResults() && ctx.filteredProducts().length > 0 ? 78 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.cartService.totalItems() > 0 ? 82 : -1);
      \u0275\u0275advance(5);
      const user_r18 = \u0275\u0275storeLet(\u0275\u0275pipeBind1(88, 15, ctx.user$));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(user_r18 ? 89 : 90);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isCartOpen() ? 91 : -1);
    }
  }, dependencies: [RouterLink, RouterLinkActive, CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, AsyncPipe, CurrencyPipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  transition: transform 0.3s ease-in-out;\n  width: 100%;\n  will-change: transform;\n}\n.hidden-navbar[_nghost-%COMP%] {\n  transform: translateY(-100%) !important;\n}\n/*# sourceMappingURL=public-layout-header.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicLayoutHeader, [{
    type: Component,
    args: [{ selector: "public-layout-header", imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Trigger rebuild -->\r
<div class="navbar glass-panel border-b border-gray-200 dark:border-white/5 sticky top-0 z-100 backdrop-blur-md text-gray-900 dark:text-white transition-colors duration-300 lg:min-h-16 lg:h-16">\r
  <!-- NAVBAR START -->\r
  <div class="navbar-start">\r
    <!-- Men\xFA hamburguesa (Mobile) -->\r
    <div class="dropdown">\r
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden text-gray-900 dark:text-white opacity-100 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Abrir men\xFA">\r
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\r
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />\r
        </svg>\r
      </div>\r
\r
      <ul tabindex="0" class="menu menu-sm dropdown-content bg-white dark:bg-[#1a1a1a] rounded-box z-50 mt-3 w-60 p-2 shadow-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 animate-fade-in-up">\r
        <!-- Buscador m\xF3vil -->\r
        <li class="mb-4">\r
          <div class="relative">\r
            <div class="join w-full">\r
              <input type="text" placeholder="Buscar..." [(ngModel)]="searchQuery" (input)="onSearchInput()"\r
                class="input input-sm input-bordered w-full bg-gray-100 dark:bg-[#333] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white join-item placeholder-gray-500 dark:placeholder-gray-400" aria-label="Buscar productos" />\r
              <button class="btn btn-sm btn-primary join-item border-none" aria-label="Buscar">\r
                <i class="fas fa-search"></i>\r
              </button>\r
            </div>\r
\r
            <!-- Live Search Results Dropdown (Mobile) -->\r
            @if (showResults() && filteredProducts().length > 0) {\r
            <div\r
              class="absolute top-full left-0 w-full mt-1 bg-[#222] border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">\r
              <ul class="menu menu-sm bg-[#222] text-gray-200 p-0">\r
                @for (product of filteredProducts(); track product.id) {\r
                <li>\r
                  <a (click)="selectProduct(product)"\r
                    class="flex items-center gap-3 p-2 hover:bg-white/10 rounded-none text-gray-200">\r
                    <img [src]="product.image_url || '/assets/img/no-image.png'" alt="{{product.name}}"\r
                      class="w-8 h-8 object-contain rounded bg-white border" />\r
                    <div class="flex flex-col flex-1 min-w-0">\r
                      <span class="font-bold text-sm text-gray-200 whitespace-normal leading-tight line-clamp-2">{{ product.name }}</span>\r
                      <span class="text-xs text-gray-400">\${{ product.price }}</span>\r
                    </div>\r
                  </a>\r
                </li>\r
                }\r
              </ul>\r
            </div>\r
            }\r
          </div>\r
        </li>\r
\r
        <!-- Elementos del men\xFA m\xF3vil -->\r
        @for (item of menuItems(); track $index) {\r
        <li>\r
          @if (item.children && item.children.length > 0) {\r
            <details class="group">\r
              <summary class="flex items-center justify-between py-3 pr-2 outline-none cursor-pointer list-none [&::-webkit-details-marker]:hidden after:hidden! hover:text-blue-500 transition-colors">\r
                <!-- Parent Link -->\r
                <a [routerLink]="item.path" (click)="$event.stopPropagation()" class="flex gap-3 flex-1 items-center font-medium" routerLinkActive="text-blue-500 font-bold" [routerLinkActiveOptions]="{exact: true}">\r
                  <i [class]="item.icon"></i> {{item.title}}\r
                </a>\r
                <i class="fas fa-chevron-down text-sm transition-transform group-open:rotate-180"></i>\r
              </summary>\r
              <ul class="pl-4 border-l border-gray-200 dark:border-white/10 ml-2 mt-2 space-y-1">\r
                @for (child of item.children; track child.path) {\r
                  <li>\r
                    <a class="flex gap-3 py-2 hover:text-blue-500 transition-colors text-sm" [routerLink]="child.path" routerLinkActive="text-blue-500 font-bold" [routerLinkActiveOptions]="{exact: true}">\r
                      <i [class]="child.icon"></i> {{child.title}}\r
                    </a>\r
                  </li>\r
                }\r
              </ul>\r
            </details>\r
          } @else {\r
            <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" [routerLink]="item.path" routerLinkActive="text-blue-500 font-bold"\r
              [routerLinkActiveOptions]="{exact: true}">\r
              <i [class]="item.icon"></i> {{item.title}}\r
            </a>\r
          }\r
        </li>\r
        }\r
\r
        <li>\r
          <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" routerLink="productos/destacados" routerLinkActive="text-blue-500 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i class="fas fa-star text-yellow-500"></i> Destacados\r
          </a>\r
        </li>\r
        <li>\r
          <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" routerLink="categories" routerLinkActive="text-blue-500 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i class="fas fa-tag"></i> Categor\xEDas\r
          </a>\r
        </li>\r
        <li>\r
          <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" routerLink="/contacto" routerLinkActive="text-blue-500 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i class="fas fa-envelope"></i> Contacto\r
          </a>\r
        </li>\r
        <li>\r
          <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" routerLink="/nosotros" routerLinkActive="text-blue-500 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i class="fas fa-info-circle"></i> Nosotros\r
          </a>\r
        </li>\r
        <li>\r
          <a class="flex gap-3 py-3 hover:text-blue-500 transition-colors font-medium" routerLink="/servicios" routerLinkActive="text-blue-500 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i class="fas fa-concierge-bell"></i> Servicios\r
          </a>\r
        </li>\r
      </ul>\r
    </div>\r
\r
    <!-- Logo + appName -->\r
    <a class="flex shrink-0 items-center gap-3 px-3 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group" [routerLink]="['/']">\r
      <div class="relative group-hover:scale-105 transition-transform">\r
         <img src="/assets/img/brands/logo/Logo (2).png" alt="Arecofix Logo" class="h-9 w-auto object-contain hidden dark:block drop-shadow-lg" height="36" width="120" />\r
         <img src="/assets/img/brands/logo/logo-normal1.PNG" alt="Arecofix Logo" class="h-9 w-auto object-contain dark:hidden drop-shadow-md" height="36" width="120" />\r
      </div>\r
      <span class="font-bold text-xl text-gray-900 dark:text-white font-heading tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ appName }}</span>\r
    </a>\r
  </div>\r
\r
  <!-- NAVBAR CENTER (desktop) -->\r
  <div class="navbar-center hidden lg:flex">\r
    <ul class="menu menu-horizontal px-1 gap-2 items-center">\r
      @for (item of menuItems(); track $index) {\r
      <li class="h-full flex items-center">\r
        @if (item.children && item.children.length > 0) {\r
          <div class="dropdown dropdown-hover group/dropdown">\r
            <a class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-xl flex items-center gap-2 font-medium px-4 h-10 hover-lift" [routerLink]="item.path" routerLinkActive="text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold" [routerLinkActiveOptions]="{exact: false}">\r
              <i [class]="item.icon"></i> {{item.title}}\r
              <i class="fas fa-chevron-down text-[10px] opacity-50 group-hover/dropdown:rotate-180 transition-transform duration-300"></i>\r
            </a>\r
            <ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl w-60 mt-2 text-gray-600 dark:text-gray-300 animate-fade-in-up">\r
              @for (child of item.children; track child.path) {\r
                <li>\r
                  <a [routerLink]="child.path" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5" [routerLinkActiveOptions]="{exact: true}" class="hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-lg py-3">\r
                    <span class="w-6 text-center"><i [class]="child.icon"></i></span> {{child.title}}\r
                  </a>\r
                </li>\r
              }\r
            </ul>\r
          </div>\r
        } @else {\r
          <a class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-xl font-medium px-4 h-10 hover-lift flex items-center gap-2" [routerLink]="item.path" routerLinkActive="text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold"\r
            [routerLinkActiveOptions]="{exact: true}">\r
            <i [class]="item.icon"></i> {{item.title}}\r
          </a>\r
        }\r
      </li>\r
      }\r
\r
      <li class="h-full flex items-center">\r
        <a class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-xl font-medium px-4 h-10 hover-lift flex items-center gap-2" routerLink="productos/destacados" routerLinkActive="text-blue-600 dark:text-blue-400! bg-blue-50 dark:bg-white/5 font-bold"\r
          [routerLinkActiveOptions]="{exact: true}">\r
          <i class="fas fa-star text-blue-500"></i> Destacado\r
        </a>\r
      </li>\r
\r
      <!-- More Items Dropdown for remaining links to keep navbar clean -->\r
      <li class="h-full flex items-center">\r
        <div class="dropdown dropdown-hover group/dropdown">\r
           <div tabindex="0" role="button" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-xl flex items-center gap-2 font-medium px-4 h-10 hover-lift">\r
              <i class="fas fa-ellipsis-h"></i> M\xE1s\r
           </div>\r
           <ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl w-52 mt-2 text-gray-600 dark:text-gray-300 animate-fade-in-up">\r
              <li>\r
                <a class="hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-lg py-2" routerLink="categories" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5">\r
                  <i class="fas fa-tag w-5 text-center"></i> Categor\xEDas\r
                </a>\r
              </li>\r
              <li>\r
                <a class="hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-lg py-2" routerLink="/servicios" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5">\r
                   <i class="fas fa-concierge-bell w-5 text-center"></i> Servicios\r
                </a>\r
              </li>\r
              <li>\r
                <a class="hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-lg py-2" routerLink="/nosotros" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5">\r
                   <i class="fas fa-info-circle w-5 text-center"></i> Nosotros\r
                </a>\r
              </li>\r
              <li>\r
                <a class="hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white rounded-lg py-2" routerLink="/contacto" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-white/5">\r
                   <i class="fas fa-envelope w-5 text-center"></i> Contacto\r
                </a>\r
              </li>\r
           </ul>\r
        </div>\r
      </li>\r
    </ul>\r
  </div>\r
\r
  <!-- NAVBAR END -->\r
  <div class="navbar-end flex items-center gap-2 lg:gap-4">\r
    <!-- Buscador desktop -->\r
    <div class="hidden lg:flex items-center gap-2 relative group">\r
      <div class="join transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50 rounded-full">\r
        <input type="text" placeholder="Buscar..." [(ngModel)]="searchQuery" (input)="onSearchInput()"\r
          class="input input-sm input-bordered rounded-l-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-transparent focus:border-transparent w-48 focus:w-64 transition-all duration-300 placeholder-gray-500" />\r
        <button class="btn btn-sm btn-primary rounded-r-full border-none text-white px-4" aria-label="Buscar">\r
          <i class="fas fa-search"></i>\r
        </button>\r
      </div>\r
\r
      <!-- Live Search Results Dropdown -->\r
      @if (showResults() && filteredProducts().length > 0) {\r
      <div\r
        class="absolute top-full right-0 w-80 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">\r
        <ul class="menu menu-sm bg-transparent text-gray-900 dark:text-gray-200 p-0">\r
          @for (product of filteredProducts(); track product.id) {\r
          <li>\r
            <a (click)="selectProduct(product)"\r
              class="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-white/10 rounded-none border-b border-gray-100 dark:border-white/5 last:border-none transition-colors">\r
              <img [src]="product.image_url || '/assets/img/no-image.png'" alt="{{product.name}}"\r
                class="w-10 h-10 object-contain rounded-lg bg-white border border-gray-100 shadow-sm" />\r
              <div class="flex flex-col flex-1 min-w-0">\r
                <span class="font-bold text-sm text-gray-800 dark:text-gray-200 whitespace-normal leading-tight line-clamp-2">{{ product.name }}</span>\r
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">\${{ product.price }}</span>\r
              </div>\r
            </a>\r
          </li>\r
          }\r
        </ul>\r
      </div>\r
      }\r
    </div>\r
\r
\r
    <!-- Carrito (Drawer) -->\r
    <button (click)="toggleCart()" class="btn btn-circle btn-sm btn-ghost hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white" aria-label="Carrito">\r
      <div class="indicator">\r
        <i class="fas fa-shopping-cart text-lg"></i>\r
        @if (cartService.totalItems() > 0) {\r
        <span class="badge badge-sm indicator-item bg-red-500 text-white border-none">{{ cartService.totalItems() }}</span>\r
        }\r
      </div>\r
    </button>\r
\r
    <!-- User Menu -->\r
    <div class="dropdown dropdown-end">\r
      <div tabindex="0" role="button" class="btn btn-circle btn-sm btn-ghost hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white"\r
        aria-label="Men\xFA de usuario">\r
        <i class="fas fa-user text-lg"></i>\r
      </div>\r
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-xl bg-[#1a1a1a] border border-white/10 rounded-box w-64 text-gray-200">\r
        @let user = (user$ | async);\r
        @if (user) {\r
        <li>\r
          <a routerLink="/perfil" class="flex items-center gap-2 hover:bg-white/10 hover:text-white">\r
            <i class="fas fa-user-circle"></i>\r
            <span class="flex-1 min-w-0">\r
              <span class="block text-sm leading-tight">Mi Perfil</span>\r
              <span class="block text-xs text-gray-500 truncate" [title]="user?.email">{{ user?.email }}</span>\r
            </span>\r
          </a>\r
        </li>\r
        <li><button (click)="logout()" class="hover:bg-white/10 hover:text-white"><i class="fas fa-sign-out-alt"></i> Cerrar Sesi\xF3n</button></li>\r
        <li><a routerLink="/admin" class="hover:bg-white/10 hover:text-white"><i class="fas fa-user-plus"></i> Admin</a></li>\r
        } @else {\r
        <li><a routerLink="/login" class="hover:bg-white/10 hover:text-white"><i class="fas fa-sign-in-alt"></i> Iniciar Sesi\xF3n</a></li>\r
        <li><a routerLink="/register" class="hover:bg-white/10 hover:text-white"><i class="fas fa-user-plus"></i> Registrarse</a></li>\r
        }\r
      </ul>\r
    </div>\r
  </div>\r
</div>\r
\r
<!-- Cart Sidebar (Moved outside navbar to avoid z-index/transform trapping) -->\r
@if (isCartOpen()) {\r
    <div class="relative z-2000" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">\r
      <!-- Backdrop -->\r
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" (click)="toggleCart()"></div>\r
\r
      <div class="fixed inset-0 overflow-hidden">\r
        <div class="absolute inset-0 overflow-hidden">\r
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">\r
            <!-- Panel -->\r
            <div class="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700 bg-white shadow-xl h-dvh">\r
              <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">\r
                <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">\r
                  <div class="flex items-start justify-between">\r
                    <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Carrito de Compras</h2>\r
                    <div class="ml-3 flex h-7 items-center">\r
                      <button type="button" (click)="toggleCart()" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">\r
                        <span class="absolute -inset-0.5"></span>\r
                        <span class="sr-only">Cerrar panel</span>\r
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">\r
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\r
                        </svg>\r
                      </button>\r
                    </div>\r
                  </div>\r
\r
                  <div class="mt-8">\r
                    <div class="flow-root">\r
                      @if (cartService.cartItems().length === 0) {\r
                        <div class="text-center py-10">\r
                          <p class="text-gray-500">Tu carrito est\xE1 vac\xEDo.</p>\r
                          <a (click)="toggleCart()" routerLink="/productos" class="text-indigo-600 font-medium hover:text-indigo-500 mt-4 inline-block">\r
                            Ver Productos &rarr;\r
                          </a>\r
                        </div>\r
                      } @else {\r
                        <ul role="list" class="-my-6 divide-y divide-gray-200">\r
                          @for (item of cartService.cartItems(); track item.product.id) {\r
                          <li class="flex py-6">\r
                            <div class="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">\r
                              <img [src]="item.product.image_url || '/assets/img/no-image.png'" [alt]="item.product.name" class="size-full object-cover">\r
                            </div>\r
\r
                            <div class="ml-4 flex flex-1 flex-col">\r
                              <div>\r
                                <div class="flex justify-between text-base font-medium text-gray-900">\r
                                  <h3>\r
                                    <a [routerLink]="['/productos/detalle', item.product.slug]" (click)="toggleCart()">{{ item.product.name }}</a>\r
                                  </h3>\r
                                  <p class="ml-4">{{ item.product.price | currency }}</p>\r
                                </div>\r
                                <p class="mt-1 text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>\r
                              </div>\r
                              <div class="flex flex-1 items-end justify-between text-sm">\r
                                <p class="text-gray-500"></p>\r
\r
                                <div class="flex">\r
                                  <button type="button" (click)="cartService.removeFromCart(item.product.id)" class="font-medium text-indigo-600 hover:text-indigo-500">Eliminar</button>\r
                                </div>\r
                              </div>\r
                            </div>\r
                          </li>\r
                          }\r
                        </ul>\r
                      }\r
                    </div>\r
                  </div>\r
                </div>\r
\r
                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">\r
                  <div class="flex justify-between text-base font-medium text-gray-900">\r
                    <p>Subtotal</p>\r
                    <p>{{ cartService.totalPrice() | currency }}</p>\r
                  </div>\r
                  <p class="mt-0.5 text-sm text-gray-500">Env\xEDo e impuestos calculados al finalizar compra.</p>\r
                  <div class="mt-6">\r
                    <a (click)="toggleCart()" routerLink="/checkout" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700">Finalizar Compra</a>\r
                  </div>\r
                  <div class="mt-6 flex justify-center text-center text-sm text-gray-500">\r
                    <p>\r
                      o \r
                      <button type="button" (click)="toggleCart()" class="font-medium text-indigo-600 hover:text-indigo-500">\r
                        Continuar Comprando\r
                        <span aria-hidden="true"> &rarr;</span>\r
                      </button>\r
                    </p>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
}`, styles: ["/* angular:styles/component:css;07f41ced9ab68e0e922c01baac4ced4b4cbd238d5b2edfdb7a5c25bc63ed2f70;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/layout/components/header/public-layout-header.ts */\n:host {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  transition: transform 0.3s ease-in-out;\n  width: 100%;\n  will-change: transform;\n}\n:host.hidden-navbar {\n  transform: translateY(-100%) !important;\n}\n/*# sourceMappingURL=public-layout-header.css.map */\n"] }]
  }], () => [], { onWindowScroll: [{
    type: HostListener,
    args: ["window:scroll"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicLayoutHeader, { className: "PublicLayoutHeader", filePath: "src/app/public/layout/components/header/public-layout-header.ts", lineNumber: 46 });
})();

// src/app/shared/footer/footer.ts
var Footer = class _Footer {
  preferencesService;
  email = "";
  isSubmitting = false;
  successMessage = "";
  errorMessage = "";
  // Exposed configuration
  socialLinks = environment.contact.socialMedia;
  whatsappNumber = environment.contact.whatsappNumber;
  currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  openAccessibilityMenu(event) {
    if (event) {
      event.preventDefault();
    }
    this.preferencesService.toggleSidebar();
  }
  subscribe() {
    if (!this.email) {
      this.errorMessage = "Por favor, ingresa un email v\xE1lido.";
      this.successMessage = "";
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = "";
    this.successMessage = "";
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = "\xA1Gracias por suscribirte!";
      this.email = "";
    }, 1500);
  }
  shareOn(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("\xA1Mira esta p\xE1gina de Arecofix!");
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  }
  static \u0275fac = function Footer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Footer)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Footer, selectors: [["app-footer"]], decls: 101, vars: 9, consts: [[1, "bg-gray-100", "dark:bg-[#050505]", "border-t", "border-gray-200", "dark:border-white/10", "py-10", "lg:py-16", "text-gray-700", "dark:text-gray-300", "transition-colors", "duration-300"], [1, "max-w-7xl", "mx-auto", "px-6", "sm:px-8", "lg:px-12"], [1, "flex", "flex-col", "lg:flex-row", "justify-between", "gap-10", "border-b", "border-gray-200", "dark:border-white/10", "pb-10"], [1, "flex", "flex-col", "items-center", "lg:items-start", "gap-6", "w-full", "lg:w-1/2"], ["ngSrc", "assets/img/brands/logo/log.png", "alt", "Logo Arecofix", "height", "40", "width", "136", 1, "h-10"], ["aria-label", "Footer navigation", 1, "w-full"], [1, "flex", "flex-row", "flex-wrap", "justify-center", "lg:justify-start", "gap-5", "text-sm", "text-gray-700", "dark:text-gray-300"], ["routerLink", "./", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/recursos", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/nosotros", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/productos", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/contacto", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/academy", 1, "hover:text-blue-400", "transition-colors", "font-medium"], ["routerLink", "/servicios", 1, "hover:text-blue-400", "transition-colors", "font-medium"], [1, "flex", "gap-4", "mt-4", "flex-wrap", "justify-center", "lg:justify-start"], ["aria-label", "Facebook", 1, "w-10", "h-10", "rounded-lg", "bg-blue-100", "dark:bg-blue-600/20", "text-blue-600", "dark:text-blue-500", "hover:bg-blue-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-blue-200", "dark:border-blue-600/30", 3, "href"], [1, "fa-brands", "fa-facebook-f", "text-lg"], ["aria-label", "Instagram", 1, "w-10", "h-10", "rounded-lg", "bg-pink-100", "dark:bg-pink-600/20", "text-pink-600", "dark:text-pink-500", "hover:bg-pink-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-pink-200", "dark:border-pink-600/30", 3, "href"], [1, "fa-brands", "fa-instagram", "text-lg"], ["aria-label", "GitHub", 1, "w-10", "h-10", "rounded-lg", "bg-gray-200", "dark:bg-white/10", "text-gray-800", "dark:text-white", "hover:bg-black", "dark:hover:bg-white", "hover:text-white", "dark:hover:text-black", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-gray-300", "dark:border-white/20", 3, "href"], [1, "fa-brands", "fa-github", "text-lg"], ["aria-label", "LinkedIn", 1, "w-10", "h-10", "rounded-lg", "bg-blue-100", "dark:bg-blue-700/20", "text-blue-700", "dark:text-blue-400", "hover:bg-blue-700", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-blue-200", "dark:border-blue-700/30", 3, "href"], [1, "fa-brands", "fa-linkedin-in", "text-lg"], ["aria-label", "YouTube", 1, "w-10", "h-10", "rounded-lg", "bg-red-100", "dark:bg-red-600/20", "text-red-600", "dark:text-red-500", "hover:bg-red-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-red-200", "dark:border-red-600/30", 3, "href"], [1, "fa-brands", "fa-youtube", "text-lg"], ["aria-label", "Google Maps", 1, "w-10", "h-10", "rounded-lg", "bg-green-100", "dark:bg-green-600/20", "text-green-600", "dark:text-green-500", "hover:bg-green-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", "hover-lift", "border", "border-green-200", "dark:border-green-600/30", 3, "href"], [1, "fa-solid", "fa-map-location-dot", "text-lg"], [1, "mt-6", "w-full", "text-center", "lg:text-left"], [1, "text-xs", "font-semibold", "text-gray-600", "dark:text-gray-400", "uppercase", "tracking-widest", "mb-3"], [1, "flex", "gap-3", "flex-wrap", "justify-center", "lg:justify-start"], ["aria-label", "Compartir en Facebook", "title", "Compartir en Facebook", 1, "w-8", "h-8", "rounded-full", "bg-blue-100", "dark:bg-blue-600/20", "text-blue-600", "dark:text-blue-500", "hover:bg-blue-600", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-facebook-f", "text-sm"], ["aria-label", "Compartir en X", "title", "Compartir en X", 1, "w-8", "h-8", "rounded-full", "bg-gray-200", "dark:bg-white/10", "text-gray-800", "dark:text-white", "hover:bg-black", "dark:hover:bg-white", "hover:text-white", "dark:hover:text-black", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-twitter", "text-sm"], ["aria-label", "Compartir en WhatsApp", "title", "Compartir en WhatsApp", 1, "w-8", "h-8", "rounded-full", "bg-green-100", "dark:bg-green-500/20", "text-green-600", "dark:text-green-500", "hover:bg-green-500", "hover:text-white", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-brands", "fa-whatsapp", "text-sm"], [1, "grid", "grid-cols-2", "gap-4", "sm:gap-10", "w-full", "lg:w-1/2", "lg:flex", "lg:flex-nowrap", "lg:justify-between"], [1, "flex", "flex-col", "gap-6"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white", "border-b-2", "border-blue-500", "pb-2", "inline-block", "w-max"], [1, "space-y-3", "text-sm", "text-gray-600", "dark:text-gray-400"], ["routerLink", "/privacy", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-chevron-right", "text-xs", "text-blue-500/50"], ["routerLink", "/terms", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], ["routerLink", "/nosotros", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], ["routerLink", "/blog", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2"], [1, "space-y-4", "text-sm", "text-gray-600", "dark:text-gray-400"], [1, "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-location-dot", "text-blue-500", "mt-1"], [1, "flex", "items-center", "gap-3"], [1, "fa-solid", "fa-phone", "text-blue-500"], ["target", "_blank", 1, "hover:text-blue-400", "transition", 3, "href"], [1, "fa-solid", "fa-envelope", "text-blue-500"], ["href", "mailto:info@arecofix.com.ar", 1, "hover:text-blue-400", "transition"], [1, "pt-8", "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "gap-4", "text-sm", "text-gray-600", "dark:text-gray-400", "border-t", "border-gray-200", "dark:border-white/5", "mt-2"], ["routerLink", "/portfolio", 1, "hover:text-blue-400", "transition", "hover-scale", "inline-block"], [1, "font-bold", "text-gradient-premium"], [1, "flex", "gap-6"], ["aria-label", "Cambiar idioma a Espa\xF1ol", 1, "hover:text-blue-400", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-globe"], ["routerLink", "/sitemap", 1, "hover:text-blue-400", "transition"]], template: function Footer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "img", 4);
      \u0275\u0275elementStart(5, "nav", 5)(6, "ul", 6)(7, "li")(8, "a", 7);
      \u0275\u0275text(9, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "li")(11, "a", 8);
      \u0275\u0275text(12, "Recursos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "li")(14, "a", 9);
      \u0275\u0275text(15, "Nosotros");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "li")(17, "a", 10);
      \u0275\u0275text(18, "Productos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "li")(20, "a", 11);
      \u0275\u0275text(21, "Contacto");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "li")(23, "a", 12);
      \u0275\u0275text(24, "Cursos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "li")(26, "a", 13);
      \u0275\u0275text(27, "Servicios");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(28, "div", 14)(29, "a", 15);
      \u0275\u0275element(30, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "a", 17);
      \u0275\u0275element(32, "i", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "a", 19);
      \u0275\u0275element(34, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "a", 21);
      \u0275\u0275element(36, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "a", 23);
      \u0275\u0275element(38, "i", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "a", 25);
      \u0275\u0275element(40, "i", 26);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "div", 27)(42, "h4", 28);
      \u0275\u0275text(43, "Compartir esta p\xE1gina");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "div", 29)(45, "button", 30);
      \u0275\u0275listener("click", function Footer_Template_button_click_45_listener() {
        return ctx.shareOn("facebook");
      });
      \u0275\u0275element(46, "i", 31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "button", 32);
      \u0275\u0275listener("click", function Footer_Template_button_click_47_listener() {
        return ctx.shareOn("twitter");
      });
      \u0275\u0275element(48, "i", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "button", 34);
      \u0275\u0275listener("click", function Footer_Template_button_click_49_listener() {
        return ctx.shareOn("whatsapp");
      });
      \u0275\u0275element(50, "i", 35);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(51, "div", 36)(52, "div", 37)(53, "h3", 38);
      \u0275\u0275text(54, "Enlaces R\xE1pidos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "ul", 39)(56, "li")(57, "a", 40);
      \u0275\u0275element(58, "i", 41);
      \u0275\u0275text(59, " Privacidad");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "li")(61, "a", 42);
      \u0275\u0275element(62, "i", 41);
      \u0275\u0275text(63, " T\xE9rminos Legales");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "li")(65, "a", 43);
      \u0275\u0275element(66, "i", 41);
      \u0275\u0275text(67, " Preguntas Frecuentes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "li")(69, "a", 44);
      \u0275\u0275element(70, "i", 41);
      \u0275\u0275text(71, " Blog");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(72, "div", 37)(73, "h3", 38);
      \u0275\u0275text(74, "Contacto");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "ul", 45)(76, "li", 46);
      \u0275\u0275element(77, "i", 47);
      \u0275\u0275elementStart(78, "span");
      \u0275\u0275text(79, "Jorge Newbery 69, Marcos Paz");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "li", 48);
      \u0275\u0275element(81, "i", 49);
      \u0275\u0275elementStart(82, "a", 50);
      \u0275\u0275text(83);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "li", 48);
      \u0275\u0275element(85, "i", 51);
      \u0275\u0275elementStart(86, "a", 52);
      \u0275\u0275text(87, "info@arecofix.com.ar");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(88, "div", 53)(89, "p")(90, "a", 54);
      \u0275\u0275text(91);
      \u0275\u0275elementStart(92, "span", 55);
      \u0275\u0275text(93, "Arecofix");
      \u0275\u0275elementEnd();
      \u0275\u0275text(94, ". Todos los derechos reservados. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 56)(96, "button", 57);
      \u0275\u0275listener("click", function Footer_Template_button_click_96_listener() {
        return ctx.openAccessibilityMenu();
      });
      \u0275\u0275element(97, "i", 58);
      \u0275\u0275text(98, " Espa\xF1ol ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "a", 59);
      \u0275\u0275text(100, "Mapa del sitio");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(29);
      \u0275\u0275property("href", ctx.socialLinks.facebook, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.instagram, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.github, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.linkedin, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.youtube, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.socialLinks.googleMaps, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(43);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("+", ctx.whatsappNumber);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1(" \xA9 ", ctx.currentYear, " ");
    }
  }, dependencies: [RouterLink, FormsModule, CommonModule, NgOptimizedImage], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Footer, [{
    type: Component,
    args: [{ selector: "app-footer", standalone: true, imports: [RouterLink, FormsModule, CommonModule, NgOptimizedImage], template: `<footer class="bg-gray-100 dark:bg-[#050505] border-t border-gray-200 dark:border-white/10 py-10 lg:py-16 text-gray-700 dark:text-gray-300 transition-colors duration-300">\r
  <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">\r
    <div class="flex flex-col lg:flex-row justify-between gap-10 border-b border-gray-200 dark:border-white/10 pb-10">\r
\r
      <!-- Logo + Links + Redes -->\r
      <div class="flex flex-col items-center lg:items-start gap-6 w-full lg:w-1/2">\r
        <img ngSrc="assets/img/brands/logo/log.png" alt="Logo Arecofix" class="h-10" height="40"\r
          width="136" />\r
\r
        <nav aria-label="Footer navigation" class="w-full">\r
          <ul class="flex flex-row flex-wrap justify-center lg:justify-start gap-5 text-sm text-gray-700 dark:text-gray-300">\r
            <li><a routerLink="./" class="hover:text-blue-400 transition-colors font-medium">Inicio</a>\r
            </li>\r
            <li><a routerLink="/recursos"\r
                class="hover:text-blue-400 transition-colors font-medium">Recursos</a></li>\r
            <li><a routerLink="/nosotros"\r
                class="hover:text-blue-400 transition-colors font-medium">Nosotros</a></li>\r
            <li><a routerLink="/productos"\r
                class="hover:text-blue-400 transition-colors font-medium">Productos</a></li>\r
            <li><a routerLink="/contacto"\r
                class="hover:text-blue-400 transition-colors font-medium">Contacto</a></li>\r
            <li><a routerLink="/academy"\r
                class="hover:text-blue-400 transition-colors font-medium">Cursos</a></li>\r
            <li><a routerLink="/servicios"\r
                class="hover:text-blue-400 transition-colors font-medium">Servicios</a></li>\r
          </ul>\r
        </nav>\r
\r
        <!-- Social Media Buttons -->\r
        <div class="flex gap-4 mt-4 flex-wrap justify-center lg:justify-start">\r
          <a [href]="socialLinks.facebook" aria-label="Facebook"\r
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-blue-200 dark:border-blue-600/30">\r
            <i class="fa-brands fa-facebook-f text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.instagram" aria-label="Instagram"\r
            class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-600/20 text-pink-600 dark:text-pink-500 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-pink-200 dark:border-pink-600/30">\r
            <i class="fa-brands fa-instagram text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.github" aria-label="GitHub"\r
            class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex items-center justify-center transition-all hover-lift border border-gray-300 dark:border-white/20">\r
            <i class="fa-brands fa-github text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.linkedin" aria-label="LinkedIn"\r
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-700/20 text-blue-700 dark:text-blue-400 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all hover-lift border border-blue-200 dark:border-blue-700/30">\r
            <i class="fa-brands fa-linkedin-in text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.youtube" aria-label="YouTube"\r
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-red-200 dark:border-red-600/30">\r
            <i class="fa-brands fa-youtube text-lg"></i>\r
          </a>\r
          <a [href]="socialLinks.googleMaps" aria-label="Google Maps"\r
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all hover-lift border border-green-200 dark:border-green-600/30">\r
            <i class="fa-solid fa-map-location-dot text-lg"></i>\r
          </a>\r
        </div>\r
\r
        <!-- Share Buttons -->\r
        <div class="mt-6 w-full text-center lg:text-left">\r
          <h4 class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">Compartir esta p\xE1gina</h4>\r
          <div class="flex gap-3 flex-wrap justify-center lg:justify-start">\r
            <button (click)="shareOn('facebook')"\r
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"\r
              aria-label="Compartir en Facebook" title="Compartir en Facebook">\r
              <i class="fa-brands fa-facebook-f text-sm"></i>\r
            </button>\r
            <button (click)="shareOn('twitter')"\r
              class="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex items-center justify-center transition-all"\r
              aria-label="Compartir en X" title="Compartir en X">\r
              <i class="fa-brands fa-twitter text-sm"></i>\r
            </button>\r
            <button (click)="shareOn('whatsapp')"\r
              class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all"\r
              aria-label="Compartir en WhatsApp" title="Compartir en WhatsApp">\r
              <i class="fa-brands fa-whatsapp text-sm"></i>\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Links R\xE1pidos y Contacto (Side-by-side on mobile, columns on desktop) -->\r
      <div class="grid grid-cols-2 gap-4 sm:gap-10 w-full lg:w-1/2 lg:flex lg:flex-nowrap lg:justify-between">\r
\r
        <!-- Links R\xE1pidos -->\r
        <div class="flex flex-col gap-6">\r
          <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block w-max">Enlaces\r
            R\xE1pidos</h3>\r
          <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">\r
            <li><a routerLink="/privacy" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Privacidad</a></li>\r
            <li><a routerLink="/terms" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> T\xE9rminos Legales</a></li>\r
            <li><a routerLink="/nosotros" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Preguntas Frecuentes</a></li>\r
            <li><a routerLink="/blog" class="hover:text-blue-400 transition flex items-center gap-2"><i\r
                  class="fa-solid fa-chevron-right text-xs text-blue-500/50"></i> Blog</a></li>\r
          </ul>\r
        </div>\r
\r
        <!-- Contacto -->\r
        <div class="flex flex-col gap-6">\r
          <h3 class="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block w-max">Contacto</h3>\r
          <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">\r
            <li class="flex items-start gap-3">\r
              <i class="fa-solid fa-location-dot text-blue-500 mt-1"></i>\r
              <span>Jorge Newbery 69, Marcos Paz</span>\r
            </li>\r
            <li class="flex items-center gap-3">\r
              <i class="fa-solid fa-phone text-blue-500"></i>\r
              <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="hover:text-blue-400 transition">+{{ whatsappNumber }}</a>\r
            </li>\r
            <li class="flex items-center gap-3">\r
              <i class="fa-solid fa-envelope text-blue-500"></i>\r
              <a href="mailto:info@arecofix.com.ar"\r
                class="hover:text-blue-400 transition">info@arecofix.com.ar</a>\r
            </li>\r
          </ul>\r
        </div>\r
      </div>\r
\r
    </div>\r
\r
    <!-- Copyright -->\r
    <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-white/5 mt-2">\r
      <p>\r
        <a routerLink="/portfolio" class="hover:text-blue-400 transition hover-scale inline-block">\r
          &copy; {{ currentYear }} <span class="font-bold text-gradient-premium">Arecofix</span>. Todos los derechos reservados.\r
        </a>\r
      </p>\r
      <div class="flex gap-6">\r
        <button (click)="openAccessibilityMenu()" class="hover:text-blue-400 transition flex items-center gap-2" aria-label="Cambiar idioma a Espa\xF1ol">\r
          <i class="fa-solid fa-globe"></i> Espa\xF1ol\r
        </button>\r
        <a routerLink="/sitemap" class="hover:text-blue-400 transition">Mapa del sitio</a>\r
      </div>\r
    </div>\r
  </div>\r
</footer>` }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Footer, { className: "Footer", filePath: "src/app/shared/footer/footer.ts", lineNumber: 15 });
})();

// src/app/public/layout/public-layout.ts
var _c02 = (a0, a1) => [a0, a1];
var PublicLayout = class _PublicLayout {
  preferencesService;
  seoService = inject(SeoService);
  // Injection initializes the service
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  static \u0275fac = function PublicLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicLayout)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicLayout, selectors: [["app-public-layout"]], decls: 8, vars: 12, consts: [[1, "min-h-screen", "transition-all", "duration-300", "relative", "text-gray-900", "dark:text-gray-100", "font-sans", "pt-16", 3, "ngClass"]], template: function PublicLayout_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "public-layout-header");
      \u0275\u0275elementStart(1, "div", 0);
      \u0275\u0275pipe(2, "async");
      \u0275\u0275pipe(3, "async");
      \u0275\u0275pipe(4, "async");
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "app-accessibility-sidebar")(7, "app-footer");
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275styleProp("font-size", \u0275\u0275pipeBind1(2, 3, ctx.preferencesService.fontSize$), "px");
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(9, _c02, ctx.preferencesService.getBackgroundClass(\u0275\u0275pipeBind1(3, 5, ctx.preferencesService.theme$)), \u0275\u0275pipeBind1(4, 7, ctx.preferencesService.highContrast$) ? "high-contrast" : ""));
    }
  }, dependencies: [CommonModule, NgClass, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicLayout, [{
    type: Component,
    args: [{ selector: "app-public-layout", standalone: true, imports: [CommonModule, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer], changeDetection: ChangeDetectionStrategy.OnPush, template: `<public-layout-header></public-layout-header>\r
<div\r
  [ngClass]="[preferencesService.getBackgroundClass((preferencesService.theme$ | async)!), (preferencesService.highContrast$ | async) ? 'high-contrast' : '']"\r
  [style.font-size.px]="(preferencesService.fontSize$ | async)"\r
  class="min-h-screen transition-all duration-300 relative text-gray-900 dark:text-gray-100 font-sans pt-16"\r
>\r
  <router-outlet></router-outlet>\r
</div>\r
\r
<app-accessibility-sidebar></app-accessibility-sidebar>\r
<app-footer></app-footer>\r
\r
` }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicLayout, { className: "PublicLayout", filePath: "src/app/public/layout/public-layout.ts", lineNumber: 18 });
})();

// src/app/public/home/public-home.content.ts
var HOME_CONTENT = {
  en: {
    hero: {
      title: "AI Solutions & Global IT Consultancy",
      subtitle: "We empower businesses in USA, Europe, and LatAm with custom Artificial Intelligence, Scalable Software, and Digital Transformation. Engineering the future.",
      ctaPrimary: "Start AI Project",
      ctaSecondary: "View Portfolio"
    },
    services: {
      title: "High-Tech Services",
      subtitle: "From AI Agents to Corporate Software",
      items: [
        { icon: "fas fa-brain", title: "AI & Machine Learning", description: "Custom LLMs, Predictive Models, and Intelligent Agents for business automation." },
        { icon: "fas fa-laptop-code", title: "Full Stack Development", description: "Enterprise-grade Web & Mobile applications using Angular, React, and Node.js." },
        { icon: "fas fa-server", title: "Cloud Architecture", description: "Scalable infrastructure on AWS/Azure, DevOps automation, and System Integration." },
        { icon: "fas fa-eye", title: "Computer Vision", description: "Image recognition systems for security, quality control, and healthcare." },
        { icon: "fas fa-shield-halved", title: "Cybersecurity & Audits", description: "Protecting your digital assets with advanced security protocols and ethical hacking." }
      ]
    },
    industries: {
      title: "Industries We Audit",
      subtitle: "Deep Tech Expertise",
      items: [
        {
          title: "Fintech & Banking",
          description: "Fraud detection AI & secure ledgers.",
          icon: "fas fa-coins",
          examples: ["Trading Bots", "Risk Analysis"]
        },
        {
          title: "AgroTech",
          description: "Smart farming solutions for LatAm.",
          icon: "fas fa-tractor",
          examples: ["Crop Monitoring", "Yield Prediction"]
        },
        {
          title: "Healthcare",
          description: "AI diagnostics & telemedicine.",
          icon: "fas fa-heart-pulse",
          examples: ["Patient Data", "Imaging AI"]
        },
        {
          title: "E-commerce",
          description: "Recommendation engines & chatbots.",
          icon: "fas fa-cart-shopping",
          examples: ["Personalization", "Auto-Support"]
        }
      ]
    },
    techServices: {
      title: "Tech Stack",
      subtitle: "Cutting-edge Tools",
      items: [
        {
          title: "Artificial Intelligence",
          description: "Python Powerhouse",
          icon: "fas fa-brain",
          image: "",
          features: ["TensorFlow", "PyTorch", "OpenAI API", "LangChain"]
        },
        {
          title: "Modern Frontend",
          description: "Responsive & Fast",
          icon: "fab fa-react",
          image: "",
          features: ["Angular", "React", "Next.js", "Tailwind"]
        },
        {
          title: "Robust Backend",
          description: "High Availability",
          icon: "fas fa-server",
          image: "",
          features: ["Node.js", "Python/Django", "Java Spring Boot", "PostgreSQL"]
        },
        {
          title: "Cloud & DevOps",
          description: "Scalable Infra",
          icon: "fas fa-cloud",
          image: "",
          features: ["AWS", "Docker", "Kubernetes", "CI/CD"]
        }
      ]
    },
    methodology: {
      title: "Our Methodology",
      subtitle: "Excellence in Every Step",
      description: "We combine strategy, design, and technology to deliver exceptional digital products.",
      steps: [
        { number: "01", title: "Discovery & Strategy", description: "We analyze your data and business goals to define the AI strategy.", icon: "fas fa-magnifying-glass-chart" },
        { number: "02", title: "Design & Prototyping", description: "Designing intuitive interfaces and data architectures.", icon: "fas fa-pen-nib" },
        { number: "03", title: "Agile Development", description: "Iterative coding sprints with continuous feedback loops.", icon: "fas fa-code-branch" },
        { number: "04", title: "QA & Testing", description: "Rigorous automated testing for robust performance.", icon: "fas fa-vial" },
        { number: "05", title: "Deploy & Optimize", description: "Cloud deployment and continuous model training.", icon: "fas fa-rocket" }
      ]
    },
    metrics: {
      title: "Global Impact",
      subtitle: "Proven Results",
      items: [
        { value: "+50", label: "Global Clients" },
        { value: "3", label: "Continents Served" },
        { value: "+10", label: "AI Models Deployed" },
        { value: "24/7", label: "Support Coverage" }
      ]
    },
    techStack: {
      title: "Technology Stack",
      subtitle: "Our Engineering Core",
      items: [
        { name: "Python", icon: "fab fa-python", category: "backend" },
        { name: "TensorFlow", icon: "fas fa-brain", category: "backend" },
        { name: "Angular", icon: "fab fa-angular", category: "frontend" },
        { name: "Node.js", icon: "fab fa-node", category: "backend" },
        { name: "AWS", icon: "fab fa-aws", category: "cloud" },
        { name: "Java", icon: "fab fa-java", category: "backend" }
      ]
    },
    projects: {
      title: "Featured Projects",
      subtitle: "Innovation in Action",
      items: [
        { title: "AI Management Dashboard", description: "Smart analytics platform for business intelligence using Python & React.", image: "assets/img/projects/panel.png", tags: ["AI", "React", "Python"], link: "/portfolio" },
        { title: "GovTech Platform", description: "Large scale beneficiary system for local government.", image: "assets/img/projects/data.png", tags: ["Django", "PostgreSQL", "Security"], link: "/portfolio" }
      ]
    },
    reviews: {
      title: "Testimonials",
      subtitle: "What Clients Say",
      items: [
        { image: "assets/img/utils/profile-placeholder.png", name: "Municipality of Marcos Paz", role: "Government", company: "Envi\xF3n Program", text: "Excellent technical team, providing robust support and system management." },
        { image: "assets/img/utils/profile-placeholder.png", name: "International Client", role: "CEO", company: "Tech Startup", text: "Arecofix delivered a world-class AI solution suitable for the US market." }
      ]
    },
    team: {
      title: "Our Team",
      subtitle: "Passionate Experts",
      members: [
        { name: "Ezequiel Enrico Areco", role: "Lead Software Engineer & AI Specialist", image: "assets/img/hero-illustration.svg", bio: "Specialist in AI Development, Full Stack Engineering using Angular/Spring/Python.", socials: { linkedin: "https://www.linkedin.com/in/ezequiel-enrico/", github: "https://github.com/arecofix" } }
      ]
    },
    remoteWork: {
      title: "Global Talent",
      subtitle: "Remote Work Specialists",
      description: "We collaborate with companies worldwide, offering top-tier talent in your time zone. Fluent English and Agile culture.",
      benefits: ["Fluent English", "Agile Process", "Full Commitment", "International Quality"],
      cta: "Hire Us",
      image: "assets/img/services/software-illustration.png"
    },
    github: {
      title: "Open Source",
      subtitle: "Contributing to the Future",
      repoName: "arecofix-ai-core",
      repoDescription: "Libraries for AI integration and clean architecture.",
      stars: "150+",
      forks: "40+",
      link: "https://github.com/arecofix"
    },
    quote: {
      title: "Let's Talk",
      subtitle: "Ready to transform your business?",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        projectType: "Service of Interest",
        budget: "Estimated Budget",
        description: "Tell us about your project",
        cta: "Send Inquiry"
      }
    },
    coursesTeaser: { title: "New Skill?", subtitle: "Train with pros.", cta: "View Courses", link: "/academy" },
    cellServicePromo: { title: "Hardware Lab", subtitle: "Expert device repair.", cta: "Visit Lab", link: "/celular" },
    businessPillars: {
      title: "Arecofix Ecosystem",
      subtitle: "Comprehensive Tech Solutions",
      items: [
        {
          title: "Hardware Lab",
          description: "Specialized Lab for mobile & console repairs (Argentina).",
          icon: "fas fa-microchip",
          image: "assets/img/services/repair-illustration.png",
          cta: "Go to Lab",
          link: "/celular",
          colorClass: "blue"
        },
        {
          title: "IT Academy",
          description: "Training the next generation of developers in LatAm.",
          icon: "fas fa-graduation-cap",
          image: "assets/img/services/academy-illustration.png",
          cta: "View Academy",
          link: "/academy",
          colorClass: "green"
        }
      ]
    },
    valueProposition: {
      title: "Why Choose Us?",
      subtitle: "",
      items: [
        { title: "AI First", description: "Integrating intelligence into every solution.", icon: "fas fa-brain" },
        { title: "Code Quality", description: "Clean Architecture & Scalable Patterns.", icon: "fas fa-code" },
        { title: "Global Standards", description: "World-class service for US/EU clients.", icon: "fas fa-globe" },
        { title: "Agile & Fast", description: "Rapid prototyping and delivery.", icon: "fas fa-bolt" }
      ]
    },
    faq: {
      title: "FAQ",
      items: [
        { question: "Do you work with US clients?", answer: "Yes, we specialize in remote consulting for US and European markets." },
        { question: "What AI services do you offer?", answer: "We build custom Agents, LLM integrations, and predictive models." }
      ]
    },
    novedadesFooter: {
      title: "Quick Links",
      links: [
        { text: "Home", url: "/" },
        { text: "Services", url: "/servicios" },
        { text: "Contact", url: "/contacto" }
      ]
    }
  },
  es: {
    hero: {
      title: "Consultor\xEDa IT Global & Desarrollo de Inteligencia Artificial",
      subtitle: "Transformamos empresas en Argentina, LatAm, USA y Europa con Software a Medida, Agentes de IA y Arquitecturas Cloud Escalables. Tu socio tecnol\xF3gico estrat\xE9gico.",
      ctaPrimary: "Consultar Proyecto IA",
      ctaSecondary: "Ver Portfolio"
    },
    businessPillars: {
      title: "Ecosistema Tecnol\xF3gico",
      subtitle: "Soluciones Integrales 360\xB0",
      items: [
        {
          title: "Laboratorio de Electr\xF3nica",
          description: "Servicio t\xE9cnico especializado en microelectr\xF3nica y recuperaci\xF3n de dispositivos en Marcos Paz (Sede Argentina).",
          icon: "fas fa-microchip",
          image: "assets/img/services/repair-illustration.png",
          cta: "Ir al Laboratorio",
          link: "/celular",
          colorClass: "blue"
        },
        {
          title: "Arecofix Academy",
          description: "Formaci\xF3n de talento IT de exportaci\xF3n. Cursos de programaci\xF3n y t\xE9cnica.",
          icon: "fas fa-graduation-cap",
          image: "assets/img/services/academy-illustration.png",
          cta: "Ver Academia",
          link: "/academy",
          colorClass: "green"
        }
      ]
    },
    valueProposition: {
      title: "Ingenier\xEDa de Software Premium",
      subtitle: "Calidad Internacional para Proyectos Ambiciosos",
      items: [
        {
          title: "Expertos en IA",
          description: "Implementamos LLMs (GPT/Llama), Computer Vision y Agentes Aut\xF3nomos para optimizar tu negocio.",
          icon: "fas fa-brain"
        },
        {
          title: "Clean Architecture",
          description: "C\xF3digo limpio, modular y testearble (Angular/Spring/Django) listo para escalar globalmente.",
          icon: "fas fa-layer-group"
        },
        {
          title: "Alcance Global",
          description: "Experiencia trabajando con clientes de USA, Espa\xF1a y LatAm. Ingl\xE9s fluido y cultura remota.",
          icon: "fas fa-globe-americas"
        },
        {
          title: "Innovaci\xF3n Continua",
          description: "Siempre a la vanguardia con las \xFAltimas tecnolog\xEDas del mercado.",
          icon: "fas fa-rocket"
        }
      ]
    },
    methodology: {
      title: "Metodolog\xEDa de Trabajo",
      subtitle: "De la Idea a la Producci\xF3n",
      description: "Combinamos agilidad con robustez t\xE9cnica para entregar valor desde el d\xEDa uno.",
      steps: [
        { number: "01", title: "Consultor\xEDa & Estrategia", description: "Analizamos tu modelo de negocio para aplicar la soluci\xF3n de IA/IT correcta.", icon: "fas fa-chess" },
        { number: "02", title: "Dise\xF1o UX/UI System", description: "Creaci\xF3n de interfaces modernas y experiencias de usuario fluidas.", icon: "fas fa-palette" },
        { number: "03", title: "Desarrollo \xC1gil", description: "Sprints de desarrollo con entregables constantes y feedback activo.", icon: "fas fa-laptop-code" },
        { number: "04", title: "QA Automatizado", description: "Tests unitarios y de integraci\xF3n para garantizar cero fallos.", icon: "fas fa-check-double" },
        { number: "05", title: "Despliegue Cloud", description: "Infraestructura el\xE1stica en AWS/Google Cloud y soporte continuo.", icon: "fas fa-cloud-arrow-up" }
      ]
    },
    faq: {
      title: "Preguntas Frecuentes",
      items: [
        { question: "\xBFTrabajan para el exterior?", answer: "S\xED, somos una consultora remota con clientes en USA, Espa\xF1a y toda Latinoam\xE9rica." },
        { question: "\xBFHacen desarrollo de IA?", answer: "S\xED, desarrollamos chatbots inteligentes, sistemas de predicci\xF3n y automatizaci\xF3n con IA." },
        { question: "\xBFQu\xE9 garant\xEDa ofrecen?", answer: "Todos nuestros desarrollos cuentan con garant\xEDa de c\xF3digo y soporte post-implementaci\xF3n." },
        { question: "\xBFSiguen reparando hardware?", answer: "S\xED, mantenemos nuestro laboratorio de hardware de alta complejidad en Argentina." }
      ]
    },
    services: {
      title: "Servicios de Alta Tecnolog\xEDa",
      subtitle: "Soluciones Digitales de Punta a Punta",
      items: [
        { icon: "fas fa-brain", title: "Consultor\xEDa en IA", description: "Integraci\xF3n de Inteligencia Artificial Generativa y Machine Learning en tus procesos." },
        { icon: "fas fa-code", title: "Software Factory", description: "Desarrollo a medida de aplicaciones Web y M\xF3viles (Angular, React, Python, Java)." },
        { icon: "fas fa-users-gear", title: "Staff Augmentation", description: "Producimos talento IT de alto nivel para sumarse a tus equipos (Devs, QA, DevOps)." },
        { icon: "fas fa-robot", title: "Automatizaci\xF3n Inteligente", description: "RPA y bots para reducir costos operativos y eliminar tareas manuales." },
        { icon: "fas fa-server", title: "Cloud & Ciberseguridad", description: "Migraciones a la nube y auditor\xEDas de seguridad inform\xE1tica." }
      ]
    },
    industries: {
      title: "Sectores que Potenciamos",
      subtitle: "Experiencia Multisectorial",
      items: [
        {
          title: "Fintech & Cripto",
          description: "Seguridad y transacciones r\xE1pidas.",
          icon: "fab fa-bitcoin",
          examples: ["Wallets", "Bots de Trading"]
        },
        {
          title: "Agro & Industria",
          description: "Tecnolog\xEDa para el campo y f\xE1bricas.",
          icon: "fas fa-tractor",
          examples: ["Monitoreo Satelital", "IoT"]
        },
        {
          title: "Salud (HealthTech)",
          description: "Digitalizaci\xF3n m\xE9dica segura.",
          icon: "fas fa-user-doctor",
          examples: ["Turneros", "Telemedicina"]
        },
        {
          title: "Retail & E-commerce",
          description: "Ventas online inteligentes.",
          icon: "fas fa-store",
          examples: ["Recomendadores", "Stock AI"]
        }
      ]
    },
    techServices: {
      title: "Stack Tecnol\xF3gico",
      subtitle: "Herramientas de Clase Mundial",
      items: [
        {
          title: "Inteligencia Artificial",
          description: "Python & Modelos",
          icon: "fas fa-head-side-virus",
          image: "",
          features: ["TensorFlow", "OpenAI", "LangChain", "Computer Vision"]
        },
        {
          title: "Frontend & UI",
          description: "Velocidad y Dise\xF1o",
          icon: "fas fa-palette",
          image: "",
          features: ["Angular 17+", "React", "Tailwind CSS", "Figma"]
        },
        {
          title: "Backend Enterprise",
          description: "Escalabilidad Pura",
          icon: "fas fa-network-wired",
          image: "",
          features: ["Java Spring Boot", "Node.js", "Python Django", "Go"]
        },
        {
          title: "Infraestructura",
          description: "Cloud Native",
          icon: "fas fa-server",
          image: "",
          features: ["AWS", "Google Cloud", "Docker", "Terraform"]
        }
      ]
    },
    metrics: {
      title: "Nuestro Impacto",
      subtitle: "M\xE9tricas Reales",
      items: [
        { value: "+60", label: "Proyectos Exitosos" },
        { value: "4", label: "Pa\xEDses Alcanzados" },
        { value: "+15", label: "Soluciones de IA" },
        { value: "100%", label: "Compromiso" }
      ]
    },
    techStack: {
      title: "Tecnolog\xEDas Principales",
      subtitle: "Dominamos el ecosistema moderno",
      items: [
        { name: "Python", icon: "fab fa-python", category: "backend" },
        { name: "Java", icon: "fab fa-java", category: "backend" },
        { name: "Angular", icon: "fab fa-angular", category: "frontend" },
        { name: "React", icon: "fab fa-react", category: "frontend" },
        { name: "AWS", icon: "fab fa-aws", category: "cloud" },
        { name: "Postgres", icon: "fas fa-database", category: "backend" }
      ]
    },
    projects: {
      title: "Portfolio Destacado",
      subtitle: "Innovaci\xF3n aplicada al mundo real",
      items: [
        { title: "Dashboard de IA", description: "Plataforma de an\xE1lisis de datos con modelos predictivos personalizados en Python.", image: "assets/img/projects/panel.png", tags: ["AI", "Python", "React"], link: "/portfolio" },
        { title: "Sistema de Gobierno", description: "Plataforma de gesti\xF3n masiva para el sector p\xFAblico (GovTech).", image: "assets/img/projects/data.png", tags: ["Java", "Spring Boot", "Angular"], link: "/portfolio" }
      ]
    },
    reviews: {
      title: "Testimonios",
      subtitle: "Conf\xEDan en Nosotros",
      items: [
        { image: "assets/img/utils/profile-placeholder.png", name: "Municipio de Marcos Paz", role: "Gobierno", company: "Sec. de Modernizaci\xF3n", text: "Arecofix moderniz\xF3 nuestros sistemas legados con una eficiencia incre\xEDble." },
        { image: "assets/img/utils/profile-placeholder.png", name: "Startup USA", role: "CTO", company: "Fintech", text: "Gran equipo de desarrollo, excelente comunicaci\xF3n en ingl\xE9s y calidad de c\xF3digo top." }
      ]
    },
    team: {
      title: "Liderazgo T\xE9cnico",
      subtitle: "Visi\xF3n y Ejecuci\xF3n",
      members: [
        { name: "Ezequiel Enrico Areco", role: "Lead Software Engineer & AI Architect", image: "assets/img/hero-illustration.svg", bio: "Ingeniero de Software especializado en Inteligencia Artificial, Java Spring Boot y Desarrollo Web Fullstack. Instructor IT.", socials: { linkedin: "https://www.linkedin.com/in/ezequiel-enrico/", github: "https://github.com/arecofix" } }
      ]
    },
    remoteWork: {
      title: "Consultora IT Global",
      subtitle: "Servicios para USA, Europa y LatAm",
      description: "Somos tu partner tecnol\xF3gico ideal. Ofrecemos desarrollo de software de calidad internacional, comunicaci\xF3n fluida y alineaci\xF3n horaria. Llevamos la ingenier\xEDa argentina al mundo.",
      benefits: ["Soporte Biling\xFCe", "Zona Horaria GMT-3", "Talento Senior", "Costos Competitivos"],
      cta: "Agendar Reuni\xF3n",
      image: "assets/img/services/software-illustration.png"
    },
    github: {
      title: "C\xF3digo Abierto",
      subtitle: "Creamos comunidad",
      repoName: "arecofix-core",
      repoDescription: "Nuestras librer\xEDas base para acelerar el desarrollo de software seguro.",
      stars: "150+",
      forks: "40+",
      link: "https://github.com/arecofix"
    },
    quote: {
      title: "Inici\xE1 tu Transformaci\xF3n",
      subtitle: "Lleva tu empresa al siguiente nivel con IA",
      form: {
        name: "Nombre y Apellido",
        email: "Email Corporativo",
        phone: "WhatsApp / Tel\xE9fono",
        company: "Empresa / Organizaci\xF3n",
        projectType: "Servicio de Inter\xE9s",
        budget: "Presupuesto Estimado (USD)",
        description: "Detanos tu desaf\xEDo o idea...",
        cta: "Solicitar Consultor\xEDa"
      }
    },
    coursesTeaser: {
      title: "Arecofix Academy",
      subtitle: "Aprende a programar IA y Web con nuestros expertos.",
      cta: "Ver Cursos",
      link: "/academy"
    },
    cellServicePromo: {
      title: "Laboratorio T\xE9cnico",
      subtitle: "Reparaci\xF3n de hardware (Celulares, Notebooks, Consolas) en Argentina.",
      cta: "Ir al Lab",
      link: "/celular"
    },
    novedadesFooter: {
      title: "Explorar",
      links: [
        { text: "Servicios", url: "/servicios" },
        { text: "Portfolio", url: "/portfolio" },
        { text: "Contacto", url: "/contacto" },
        { text: "Sitemap", url: "/sitemap" }
      ]
    }
  }
};

// src/app/public/home/public-home-page.ts
var _forTrack02 = ($index, $item) => $item.title;
var _forTrack12 = ($index, $item) => $item.number;
var _forTrack22 = ($index, $item) => $item.label;
function PublicHomePage_ng_container_0_For_41_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "img", 79)(2, "div", 80);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pillar_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngSrc", pillar_r1.image)("alt", pillar_r1.title);
  }
}
function PublicHomePage_ng_container_0_For_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 72);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, PublicHomePage_ng_container_0_For_41_Conditional_3_Template, 3, 2, "div", 73);
    \u0275\u0275elementStart(4, "div", 74)(5, "div");
    \u0275\u0275element(6, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "h3", 75);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 76);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 77);
    \u0275\u0275text(12);
    \u0275\u0275element(13, "i", 78);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const pillar_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(pillar_r1.icon + " text-9xl");
    \u0275\u0275advance();
    \u0275\u0275conditional(pillar_r1.image ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("w-14 h-14 rounded-xl flex items-center justify-center mb-6 " + (pillar_r1.colorClass === "blue" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"));
    \u0275\u0275advance();
    \u0275\u0275classMap(pillar_r1.icon + " text-2xl");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pillar_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pillar_r1.description);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", pillar_r1.link);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", pillar_r1.cta, " ");
  }
}
function PublicHomePage_ng_container_0_For_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "div", 82);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 83);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 84);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const service_r2 = ctx.$implicit;
    const \u0275$index_121_r3 = ctx.$index;
    const \u0275$count_121_r4 = ctx.$count;
    \u0275\u0275classProp("col-span-2", \u0275$index_121_r3 === \u0275$count_121_r4 - 1)("lg:col-span-1", \u0275$index_121_r3 === \u0275$count_121_r4 - 1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(service_r2.icon + " text-lg md:text-xl");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r2.description);
  }
}
function PublicHomePage_ng_container_0_For_62_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 88);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const feat_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(feat_r5);
  }
}
function PublicHomePage_ng_container_0_For_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "h3", 85);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 86);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 87);
    \u0275\u0275repeaterCreate(7, PublicHomePage_ng_container_0_For_62_For_8_Template, 2, 1, "span", 88, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r6.icon + " text-2xl md:text-4xl mb-2 md:mb-3 text-gradient block mx-auto");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(item_r6.features);
  }
}
function PublicHomePage_ng_container_0_For_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 89)(1, "div", 90)(2, "span", 91);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "div", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "div", 93);
    \u0275\u0275element(7, "i");
    \u0275\u0275elementStart(8, "h3", 94);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 95);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const step_r7 = ctx.$implicit;
    const \u0275$index_184_r8 = ctx.$index;
    const \u0275$count_184_r9 = ctx.$count;
    \u0275\u0275classProp("col-span-2", \u0275$index_184_r8 === \u0275$count_184_r9 - 1)("lg:col-span-1", \u0275$index_184_r8 === \u0275$count_184_r9 - 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(step_r7.number);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(step_r7.icon + " text-blue-400 text-lg md:text-xl lg:hidden");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r7.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r7.description);
  }
}
function PublicHomePage_ng_container_0_For_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "h2", 96);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 97);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const metric_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", metric_r10.value, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r10.label);
  }
}
function PublicHomePage_ng_container_0_For_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "h3", 98);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 99);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const industry_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(industry_r11.icon + " text-4xl mb-4 text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(industry_r11.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(industry_r11.description);
  }
}
function PublicHomePage_ng_container_0_For_102_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275element(1, "i", 100);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const benefit_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", benefit_r12, " ");
  }
}
function PublicHomePage_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 2)(2, "div", 3);
    \u0275\u0275element(3, "div", 4)(4, "div", 5)(5, "div", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 7)(7, "div", 8)(8, "div", 9)(9, "div", 10);
    \u0275\u0275element(10, "span", 11);
    \u0275\u0275elementStart(11, "span", 12);
    \u0275\u0275text(12, "Open to New Projects");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "h1", 13);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 14);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 15)(18, "a", 16);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "a", 17);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 18)(23, "div", 19);
    \u0275\u0275element(24, "img", 20);
    \u0275\u0275elementStart(25, "div", 21)(26, "div", 22);
    \u0275\u0275element(27, "div", 23)(28, "div", 24)(29, "div", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 26);
    \u0275\u0275text(31, " > git push origin production");
    \u0275\u0275element(32, "br");
    \u0275\u0275elementStart(33, "span", 27);
    \u0275\u0275text(34, "Build success... \u{1F680}");
    \u0275\u0275elementEnd()()()()()()()();
    \u0275\u0275elementStart(35, "section", 28)(36, "div", 29)(37, "div", 30)(38, "h2", 31);
    \u0275\u0275text(39, "Nuestros Pilares de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(40, PublicHomePage_ng_container_0_For_41_Template, 14, 11, "div", 32, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "section", 33, 0)(44, "div", 34)(45, "div", 35)(46, "h2", 36);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "p", 37);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 38);
    \u0275\u0275repeaterCreate(51, PublicHomePage_ng_container_0_For_52_Template, 7, 8, "div", 39, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "section", 40)(54, "div", 41)(55, "div", 42)(56, "h2", 43);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "p", 44);
    \u0275\u0275text(59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 45);
    \u0275\u0275repeaterCreate(61, PublicHomePage_ng_container_0_For_62_Template, 9, 4, "div", 46, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "section", 47)(64, "div", 34)(65, "div", 48)(66, "div", 49)(67, "h2", 50);
    \u0275\u0275text(68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "p", 51);
    \u0275\u0275text(70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "a", 52);
    \u0275\u0275text(72, " Start a Project ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(73, "div", 53);
    \u0275\u0275repeaterCreate(74, PublicHomePage_ng_container_0_For_75_Template, 12, 9, "div", 54, _forTrack12);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(76, "section", 55)(77, "div", 34)(78, "div", 56);
    \u0275\u0275repeaterCreate(79, PublicHomePage_ng_container_0_For_80_Template, 5, 2, "div", 57, _forTrack22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(81, "section", 33)(82, "div", 34)(83, "div", 58)(84, "h2", 59);
    \u0275\u0275text(85);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "p", 60);
    \u0275\u0275text(87);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div", 61);
    \u0275\u0275repeaterCreate(89, PublicHomePage_ng_container_0_For_90_Template, 6, 4, "div", 62, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(91, "section", 63);
    \u0275\u0275element(92, "div", 64);
    \u0275\u0275elementStart(93, "div", 65)(94, "span", 66);
    \u0275\u0275text(95, "Global Reach");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "h2", 67);
    \u0275\u0275text(97);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "p", 68);
    \u0275\u0275text(99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "div", 69);
    \u0275\u0275repeaterCreate(101, PublicHomePage_ng_container_0_For_102_Template, 3, 1, "span", 70, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "a", 71);
    \u0275\u0275text(104);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const content_r13 = ctx.ngIf;
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.subtitle, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.ctaPrimary, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", content_r13.hero.ctaSecondary, " ");
    \u0275\u0275advance(19);
    \u0275\u0275repeater(content_r13.businessPillars.items);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r13.services.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.services.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.services.items);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(content_r13.techServices.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.techServices.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.techServices.items);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r13.methodology.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.methodology.description);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(content_r13.methodology.steps);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(content_r13.metrics.items);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(content_r13.industries.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.industries.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.industries.items);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(content_r13.remoteWork.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r13.remoteWork.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(content_r13.remoteWork.benefits);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", content_r13.remoteWork.cta, " ");
  }
}
var PublicHomePage = class _PublicHomePage {
  preferencesService;
  seoService = inject(SeoService);
  auth = inject(AuthService);
  whatsappNumber = environment.contact.whatsappNumber;
  // Quote Form State
  quoteModel = {
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "web",
    budget: "mid",
    description: "",
    cta: ""
  };
  sendingQuote = false;
  homeContent = HOME_CONTENT;
  content$;
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
    this.content$ = this.preferencesService.language$.pipe(map((lang) => {
      const key = lang;
      const content = this.homeContent[key];
      if (lang === "es") {
        content.coursesTeaser = this.homeContent.es.coursesTeaser || this.homeContent["es"]["coursesTeaser"];
      }
      return content;
    }));
  }
  ngOnInit() {
    this.setSEO();
  }
  setSEO() {
  }
  scrollToSection(element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  async sendQuote() {
    if (!this.quoteModel.name || !this.quoteModel.email || !this.quoteModel.description) {
      alert("Por favor completa los campos principales.");
      return;
    }
    this.sendingQuote = true;
    try {
      const supabase = this.auth.getSupabaseClient();
      await supabase.from("contact_messages").insert({
        name: this.quoteModel.name,
        email: this.quoteModel.email,
        phone: this.quoteModel.phone,
        subject: `Presupuesto IT: ${this.quoteModel.projectType} - ${this.quoteModel.company}`,
        message: `Presupuesto: ${this.quoteModel.budget}
Descripci\xF3n: ${this.quoteModel.description}`,
        is_read: false
      });
      alert("Solicitud enviada. Nos pondremos en contacto pronto.");
      this.quoteModel = __spreadProps(__spreadValues({}, this.quoteModel), { name: "", email: "", phone: "", company: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("Error al enviar. Por favor intenta por WhatsApp.");
      const text = `Hola, quiero cotizar un proyecto de ${this.quoteModel.projectType}. Mi presupuesto es ${this.quoteModel.budget}.`;
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    } finally {
      this.sendingQuote = false;
    }
  }
  static \u0275fac = function PublicHomePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicHomePage)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicHomePage, selectors: [["app-public-home-page"]], decls: 2, vars: 3, consts: [["servicesSection", ""], [4, "ngIf"], [1, "relative", "min-h-[90vh]", "flex", "items-center", "pt-24", "overflow-hidden", "bg-gray-50", "dark:bg-[#0a0a0a]", "text-gray-900", "dark:text-white", "transition-colors", "duration-300"], [1, "absolute", "inset-0", "z-0"], [1, "absolute", "top-[-20%]", "right-[-10%]", "w-[800px]", "h-[800px]", "bg-blue-600/10", "rounded-full", "blur-[120px]", "animate-pulse-slow"], [1, "absolute", "bottom-[-20%]", "left-[-10%]", "w-[600px]", "h-[600px]", "bg-purple-600/5", "rounded-full", "blur-[100px]"], [1, "absolute", "inset-0", "bg-[url('assets/img/pattern-grid.svg')]", "opacity-[0.03]"], [1, "container", "mx-auto", "px-4", "relative", "z-10"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-12", "lg:gap-20"], [1, "lg:w-1/2", "text-center", "lg:text-left"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "rounded-full", "glass-panel", "mb-8"], [1, "w-2", "h-2", "rounded-full", "bg-green-400", "animate-pulse"], [1, "text-xs", "font-mono", "text-gray-300", "tracking-wider", "uppercase"], [1, "text-5xl", "lg:text-7xl", "font-bold", "mb-6", "leading-[1.1]", "tracking-tight", "text-gradient"], [1, "text-xl", "text-gray-600", "dark:text-gray-400", "mb-10", "leading-relaxed", "max-w-2xl", "mx-auto", "lg:mx-0", "font-light", "font-body"], [1, "flex", "flex-col", "sm:flex-row", "items-center", "justify-center", "lg:justify-start", "gap-4"], ["routerLink", "/contacto", 1, "px-8", "py-4", "bg-gray-900", "text-white", "dark:bg-white", "dark:text-black", "rounded-lg", "font-bold", "text-lg", "hover:bg-gray-800", "dark:hover:bg-gray-200", "transition-all", "transform", "hover:scale-105", "shadow-xl", "shadow-blue-900/10", "dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]", "flex", "items-center", "justify-center", "cursor-pointer"], ["routerLink", "/portfolio", 1, "px-8", "py-4", "glass-panel", "text-gray-900", "dark:text-white", "rounded-lg", "font-medium", "text-lg", "hover:bg-black/5", "dark:hover:bg-white/5", "transition-all", "text-center", "flex", "items-center", "justify-center", "cursor-pointer"], [1, "lg:w-1/2", "relative", "hidden", "lg:block", "animate-float"], [1, "relative", "z-10", "glass-card", "p-2", "rounded-2xl", "transform", "rotate-1", "hover:rotate-0", "transition-duration-500", "w-full", "aspect-video"], ["ngSrc", "assets/img/services/software-illustration.png", "alt", "Dashboard Preview", "fill", "", "priority", "", 1, "rounded-xl", "object-cover", "shadow-lg", "opacity-90"], [1, "absolute", "-bottom-10", "-left-10", "bg-[#1e1e1e]", "p-4", "rounded-lg", "border", "border-gray-700", "shadow-xl", "hidden", "md:block"], [1, "flex", "gap-2", "mb-2"], [1, "w-3", "h-3", "rounded-full", "bg-red-500"], [1, "w-3", "h-3", "rounded-full", "bg-yellow-500"], [1, "w-3", "h-3", "rounded-full", "bg-green-500"], [1, "font-mono", "text-xs", "text-green-400"], [1, "text-white"], [1, "py-20", "bg-white", "dark:bg-black", "text-gray-900", "dark:text-white", "relative", "z-20", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4", "-mt-20", "lg:-mt-32"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "sr-only"], [1, "group", "relative", "overflow-hidden", "rounded-2xl", "glass-card", "transition-all", "duration-300", "hover:border-blue-500/50", "flex", "flex-col", "h-full"], [1, "py-24", "bg-gray-50", "dark:bg-[#050505]", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4"], [1, "text-center", "max-w-3xl", "mx-auto", "mb-20"], [1, "text-3xl", "lg:text-5xl", "font-bold", "text-gray-900", "dark:text-white", "mb-6", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "text-lg", "font-body"], [1, "grid", "grid-cols-2", "lg:grid-cols-3", "gap-3", "md:gap-6"], [1, "glass-card", "rounded-xl", "p-4", "md:p-8", "hover:bg-[#151515]", "transition-all", "group", "h-full", "flex", "flex-col", "items-center", "text-center", 3, "col-span-2", "lg:col-span-1"], [1, "py-20", "bg-white", "dark:bg-black", "border-y", "border-gray-200", "dark:border-white/5", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4", "text-center"], [1, "text-center", "mb-12"], [1, "text-3xl", "font-bold", "text-gray-900", "dark:text-white", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "mt-2"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-3", "md:gap-6"], [1, "glass-panel", "p-3", "md:p-6", "rounded-xl", "flex", "flex-col", "items-center", "justify-center", "text-center", "hover:bg-white/5", "transition-colors", "h-full"], [1, "py-24", "bg-gray-50", "dark:bg-[#0a0a0a]", "text-gray-900", "dark:text-white", "transition-colors", "duration-300"], [1, "flex", "flex-col", "lg:flex-row", "gap-16", "items-start"], [1, "lg:w-1/3", "sticky", "top-24"], [1, "text-4xl", "lg:text-5xl", "font-bold", "mb-6", "font-heading", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-400", "text-lg", "leading-relaxed", "mb-8", "font-body"], ["routerLink", "/contacto", 1, "px-6", "py-3", "bg-blue-600", "hover:bg-blue-700", "rounded-lg", "text-white", "font-bold", "transition-colors", "inline-block"], [1, "lg:w-2/3", "grid", "grid-cols-2", "lg:grid-cols-1", "gap-3", "md:gap-6"], [1, "flex", "flex-col", "lg:flex-row", "gap-3", "md:gap-6", "items-center", "lg:items-start", "p-4", "md:p-8", "rounded-2xl", "glass-panel", "hover:bg-white/10", "transition-colors", "text-center", "lg:text-left", "h-full", 3, "col-span-2", "lg:col-span-1"], [1, "py-16", "bg-white", "dark:bg-black", "border-y", "border-gray-200", "dark:border-white/5", "text-center", "transition-colors", "duration-300"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-8"], [1, "p-4"], [1, "text-center", "mb-16"], [1, "text-3xl", "lg:text-4xl", "font-bold", "text-gray-900", "dark:text-white", "font-heading"], [1, "text-gray-600", "dark:text-gray-400"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "aspect-square", "rounded-2xl", "glass-card", "flex", "flex-col", "items-center", "justify-center", "p-6", "text-center", "group", "cursor-default", "hover:border-green-500/30"], [1, "py-24", "relative", "overflow-hidden", "bg-linear-to-br", "from-blue-900", "via-blue-950", "to-black"], [1, "absolute", "inset-0", "bg-[url('assets/img/pattern-grid.svg')]", "opacity-10"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "text-center", "text-white"], [1, "inline-block", "py-1", "px-3", "rounded", "glass-panel", "text-blue-200", "text-xs", "font-bold", "uppercase", "tracking-wider", "mb-6"], [1, "text-4xl", "lg:text-5xl", "font-bold", "mb-6", "max-w-3xl", "mx-auto", "font-heading"], [1, "text-xl", "text-blue-100", "mb-10", "max-w-2xl", "mx-auto", "font-body"], [1, "flex", "flex-wrap", "justify-center", "gap-4", "mb-10"], [1, "flex", "items-center", "gap-2", "bg-blue-800/30", "backdrop-blur-sm", "px-4", "py-2", "rounded-full", "border", "border-blue-400/30", "text-sm"], ["routerLink", "/contacto", 1, "inline-block", "bg-white", "text-blue-900", "px-10", "py-4", "rounded-xl", "font-bold", "text-lg", "shadow-xl", "hover:bg-gray-100", "transition-colors", "cursor-pointer"], [1, "absolute", "top-0", "right-0", "p-4", "opacity-5", "group-hover:opacity-10", "transition-opacity"], [1, "relative", "h-48", "overflow-hidden"], [1, "relative", "z-10", "p-8", "pt-4", "flex", "flex-col", "text-left", "grow"], [1, "text-2xl", "font-bold", "mb-3", "font-heading", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-400", "mb-6", "leading-relaxed", "grow", "font-body"], [1, "inline-flex", "items-center", "gap-2", "font-bold", "text-sm", "tracking-wide", "uppercase", "hover:text-blue-600", "dark:hover:text-white", "transition-colors", "text-gray-700", "dark:text-gray-300", "mt-auto", 3, "routerLink"], [1, "fas", "fa-arrow-right"], ["fill", "", "sizes", "(max-width: 768px) 100vw, 50vw", 1, "object-cover", "transform", "group-hover:scale-110", "transition-transform", "duration-700", 3, "ngSrc", "alt"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-white", "dark:from-[#1a1a1a]", "to-transparent", "opacity-80"], [1, "glass-card", "rounded-xl", "p-4", "md:p-8", "hover:bg-[#151515]", "transition-all", "group", "h-full", "flex", "flex-col", "items-center", "text-center"], [1, "mb-3", "md:mb-6", "w-10", "h-10", "md:w-12", "md:h-12", "rounded-lg", "bg-indigo-500/10", "flex", "items-center", "justify-center", "text-indigo-400", "group-hover:scale-110", "transition-transform"], [1, "text-sm", "md:text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-2", "md:mb-3", "font-heading", "leading-tight"], [1, "text-gray-600", "dark:text-gray-400", "leading-relaxed", "text-xs", "md:text-sm", "font-body", "grow"], [1, "text-sm", "md:text-lg", "font-bold", "text-gray-900", "dark:text-white", "mb-1", "md:mb-2", "leading-tight"], [1, "text-xs", "md:text-sm", "text-gray-600", "dark:text-gray-400", "mb-3", "md:mb-4", "leading-relaxed"], [1, "flex", "flex-wrap", "justify-center", "gap-1", "md:gap-2", "mt-auto"], [1, "text-[10px]", "md:text-xs", "bg-gray-200", "dark:bg-white/10", "px-1.5", "py-0.5", "md:px-2", "md:py-1", "rounded", "text-gray-700", "dark:text-gray-300", "font-mono"], [1, "flex", "flex-col", "lg:flex-row", "gap-3", "md:gap-6", "items-center", "lg:items-start", "p-4", "md:p-8", "rounded-2xl", "glass-panel", "hover:bg-white/10", "transition-colors", "text-center", "lg:text-left", "h-full"], [1, "flex", "flex-col", "items-center", "gap-2", "shrink-0"], [1, "text-xl", "md:text-3xl", "font-black", "text-transparent", "bg-clip-text", "bg-linear-to-b", "from-blue-400", "to-blue-600", "font-mono"], [1, "hidden", "lg:block", "h-12", "w-px", "bg-blue-500/30"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-3", "mb-2", "justify-center", "lg:justify-start"], [1, "text-sm", "md:text-xl", "font-bold", "font-heading", "text-gray-900", "dark:text-white", "leading-tight"], [1, "text-gray-600", "dark:text-gray-400", "font-body", "text-xs", "md:text-base", "leading-relaxed", "line-clamp-4", "lg:line-clamp-none"], [1, "text-4xl", "lg:text-5xl", "font-extrabold", "text-gradient-blue", "mb-2", "font-heading"], [1, "text-gray-600", "dark:text-gray-400", "font-mono", "text-xs", "uppercase", "tracking-widest"], [1, "font-bold", "text-gray-900", "dark:text-white", "mb-2"], [1, "text-xs", "text-gray-600", "dark:text-gray-400", "hidden", "lg:block"], [1, "fas", "fa-check", "text-green-300"]], template: function PublicHomePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, PublicHomePage_ng_container_0_Template, 105, 15, "ng-container", 1);
      \u0275\u0275pipe(1, "async");
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(1, 1, ctx.content$));
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    RouterModule,
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    AsyncPipe
  ], styles: ["\n\n.tech-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 2rem;\n}\n/*# sourceMappingURL=public-home-page.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicHomePage, [{
    type: Component,
    args: [{ selector: "app-public-home-page", standalone: true, imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      NgOptimizedImage
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<ng-container *ngIf="content$ | async as content">\r
\r
  <!-- 1. HERO SECTION: Premium Dark Gradient -->\r
  <section class="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">\r
      <!-- Background Effects -->\r
      <div class="absolute inset-0 z-0">\r
          <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>\r
          <div class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px]"></div>\r
          <div class="absolute inset-0 bg-[url('assets/img/pattern-grid.svg')] opacity-[0.03]"></div>\r
      </div>\r
\r
      <div class="container mx-auto px-4 relative z-10">\r
          <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">\r
              <!-- Text Content -->\r
              <div class="lg:w-1/2 text-center lg:text-left">\r
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8">\r
                      <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>\r
                      <span class="text-xs font-mono text-gray-300 tracking-wider uppercase">Open to New Projects</span>\r
                  </div>\r
                  \r
                  <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-gradient">\r
                      {{ content.hero.title }}\r
                  </h1>\r
                  \r
                  <p class="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light font-body">\r
                      {{ content.hero.subtitle }}\r
                  </p>\r
                  \r
                  <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">\r
                      <a routerLink="/contacto" \r
                          class="px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer">\r
                          {{ content.hero.ctaPrimary }}\r
                      </a>\r
                      <a routerLink="/portfolio"\r
                          class="px-8 py-4 glass-panel text-gray-900 dark:text-white rounded-lg font-medium text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center flex items-center justify-center cursor-pointer">\r
                          {{ content.hero.ctaSecondary }}\r
                      </a>\r
                  </div>\r
              </div>\r
\r
              <!-- Visual/Art -->\r
              <div class="lg:w-1/2 relative hidden lg:block animate-float">\r
                  <div class="relative z-10 glass-card p-2 rounded-2xl transform rotate-1 hover:rotate-0 transition-duration-500 w-full aspect-video">\r
                    <img ngSrc="assets/img/services/software-illustration.png" alt="Dashboard Preview" class="rounded-xl object-cover shadow-lg opacity-90" fill priority>\r
                    \r
                     <!-- Code Snippet Decor -->\r
                    <div class="absolute -bottom-10 -left-10 bg-[#1e1e1e] p-4 rounded-lg border border-gray-700 shadow-xl hidden md:block">\r
                        <div class="flex gap-2 mb-2">\r
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>\r
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>\r
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>\r
                        </div>\r
                        <div class="font-mono text-xs text-green-400">\r
                            > git push origin production<br>\r
                            <span class="text-white">Build success... \u{1F680}</span>\r
                        </div>\r
                    </div>\r
                  </div>\r
              </div>\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 2. BUSINESS PILLARS (Cards) -->\r
  <section class="py-20 bg-white dark:bg-black text-gray-900 dark:text-white relative z-20 transition-colors duration-300">\r
      <div class="container mx-auto px-4 -mt-20 lg:-mt-32">\r
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
              <h2 class="sr-only">Nuestros Pilares de Negocio</h2>\r
              @for(pillar of content.businessPillars.items; track pillar.title) {\r
                  <div class="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:border-blue-500/50 flex flex-col h-full">\r
                      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">\r
                          <i [class]="pillar.icon + ' text-9xl'"></i>\r
                      </div>\r
                      \r
                      <!-- Image Section if available -->\r
                      @if (pillar.image) {\r
                        <div class="relative h-48 overflow-hidden">\r
                            <img [ngSrc]="pillar.image" [alt]="pillar.title" class="object-cover transform group-hover:scale-110 transition-transform duration-700" fill sizes="(max-width: 768px) 100vw, 50vw">\r
                            <div class="absolute inset-0 bg-linear-to-t from-white dark:from-[#1a1a1a] to-transparent opacity-80"></div>\r
                        </div>\r
                      }\r
\r
                      <div class="relative z-10 p-8 pt-4 flex flex-col text-left grow">\r
                          <div [class]="'w-14 h-14 rounded-xl flex items-center justify-center mb-6 ' + (pillar.colorClass === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400')">\r
                              <i [class]="pillar.icon + ' text-2xl'"></i>\r
                          </div>\r
                          \r
                          <h3 class="text-2xl font-bold mb-3 font-heading text-gray-900 dark:text-white">{{ pillar.title }}</h3>\r
                          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed grow font-body">{{ pillar.description }}</p>\r
                          \r
                          <a [routerLink]="pillar.link" class="inline-flex items-center gap-2 font-bold text-sm tracking-wide uppercase hover:text-blue-600 dark:hover:text-white transition-colors text-gray-700 dark:text-gray-300 mt-auto">\r
                              {{ pillar.cta }} <i class="fas fa-arrow-right"></i>\r
                          </a>\r
                      </div>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 3. SERVICES GRID -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300" #servicesSection>\r
      <div class="container mx-auto px-4">\r
          <div class="text-center max-w-3xl mx-auto mb-20">\r
              <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-heading">{{ content.services.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400 text-lg font-body">{{ content.services.subtitle }}</p>\r
          </div>\r
\r
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">\r
              @for(service of content.services.items; track service.title; let last = $last) {\r
                  <div class="glass-card rounded-xl p-4 md:p-8 hover:bg-[#151515] transition-all group h-full flex flex-col items-center text-center"\r
                       [class.col-span-2]="last" [class.lg:col-span-1]="last">\r
                      <div class="mb-3 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">\r
                          <i [class]="service.icon + ' text-lg md:text-xl'"></i>\r
                      </div>\r
                      <h3 class="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 font-heading leading-tight">{{ service.title }}</h3>\r
                      <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-xs md:text-sm font-body grow">{{ service.description }}</p>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
  \r
    <!-- 4. TECH STACK -->\r
  <section class="py-20 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 transition-colors duration-300">\r
      <div class="container mx-auto px-4 text-center">\r
           <div class="text-center mb-12">\r
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white font-heading">{{ content.techServices.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ content.techServices.subtitle }}</p>\r
           </div>\r
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">\r
              @for(item of content.techServices.items; track item.title) {\r
                <div class="glass-panel p-3 md:p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors h-full">\r
                    <!-- Icon always at top -->\r
                    <i [class]="item.icon + ' text-2xl md:text-4xl mb-2 md:mb-3 text-gradient block mx-auto'"></i>\r
                    <h3 class="text-sm md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2 leading-tight">{{ item.title }}</h3>\r
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">{{ item.description }}</p>\r
                    <div class="flex flex-wrap justify-center gap-1 md:gap-2 mt-auto">\r
                         @for(feat of item.features; track feat) {\r
                             <span class="text-[10px] md:text-xs bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-gray-700 dark:text-gray-300 font-mono">{{ feat }}</span>\r
                         }\r
                    </div>\r
                </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
\r
  <!-- 5. METHODOLOGY (Timeline) -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
          <div class="flex flex-col lg:flex-row gap-16 items-start">\r
              <div class="lg:w-1/3 sticky top-24">\r
                  <h2 class="text-4xl lg:text-5xl font-bold mb-6 font-heading text-gray-900 dark:text-white">{{ content.methodology.title }}</h2>\r
                  <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 font-body">{{ content.methodology.description }}</p>\r
                  <a routerLink="/contacto" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors inline-block">\r
                    Start a Project\r
                   </a>\r
              </div>\r
              \r
              <div class="lg:w-2/3 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-6">\r
                  @for(step of content.methodology.steps; track step.number; let last = $last) {\r
                      <div class="flex flex-col lg:flex-row gap-3 md:gap-6 items-center lg:items-start p-4 md:p-8 rounded-2xl glass-panel hover:bg-white/10 transition-colors text-center lg:text-left h-full"\r
                           [class.col-span-2]="last" [class.lg:col-span-1]="last">\r
                          <div class="flex flex-col items-center gap-2 shrink-0">\r
                             <span class="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-600 font-mono">{{ step.number }}</span>\r
                             <div class="hidden lg:block h-12 w-px bg-blue-500/30"></div>\r
                          </div>\r
                          <div>\r
                              <div class="flex flex-col lg:flex-row items-center gap-3 mb-2 justify-center lg:justify-start">\r
                                <i [class]="step.icon + ' text-blue-400 text-lg md:text-xl lg:hidden'"></i>\r
                                <h3 class="text-sm md:text-xl font-bold font-heading text-gray-900 dark:text-white leading-tight">{{ step.title }}</h3>\r
                              </div>\r
                              <p class="text-gray-600 dark:text-gray-400 font-body text-xs md:text-base leading-relaxed line-clamp-4 lg:line-clamp-none">{{ step.description }}</p>\r
                          </div>\r
                      </div>\r
                  }\r
              </div>\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 6. METRICS -->\r
  <section class="py-16 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 text-center transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">\r
              @for(metric of content.metrics.items; track metric.label) {\r
                  <div class="p-4">\r
                      <h2 class="text-4xl lg:text-5xl font-extrabold text-gradient-blue mb-2 font-heading">\r
                          {{ metric.value }}\r
                      </h2>\r
                      <p class="text-gray-600 dark:text-gray-400 font-mono text-xs uppercase tracking-widest">{{ metric.label }}</p>\r
                  </div>\r
              }\r
          </div>\r
      </div>\r
  </section>\r
\r
  <!-- 7. INDUSTRIES -->\r
  <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">\r
      <div class="container mx-auto px-4">\r
           <div class="text-center mb-16">\r
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-heading">{{ content.industries.title }}</h2>\r
              <p class="text-gray-600 dark:text-gray-400">{{ content.industries.subtitle }}</p>\r
           </div>\r
           <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
               @for(industry of content.industries.items; track industry.title) {\r
                   <div class="aspect-square rounded-2xl glass-card flex flex-col items-center justify-center p-6 text-center group cursor-default hover:border-green-500/30">\r
                       <i [class]="industry.icon + ' text-4xl mb-4 text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300'"></i>\r
                       <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ industry.title }}</h3>\r
                       <p class="text-xs text-gray-600 dark:text-gray-400 hidden lg:block">{{ industry.description }}</p>\r
                   </div>\r
               }\r
           </div>\r
      </div>\r
  </section>\r
\r
  <!-- 8. REMOTE WORK CTA -->\r
  <section class="py-24 relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-950 to-black">\r
      <div class="absolute inset-0 bg-[url('assets/img/pattern-grid.svg')] opacity-10"></div>\r
      <div class="container mx-auto px-4 relative z-10 text-center text-white">\r
          <span class="inline-block py-1 px-3 rounded glass-panel text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">Global Reach</span>\r
          <h2 class="text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto font-heading">{{ content.remoteWork.title }}</h2>\r
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-body">{{ content.remoteWork.description }}</p>\r
          \r
          <div class="flex flex-wrap justify-center gap-4 mb-10">\r
               @for(benefit of content.remoteWork.benefits; track benefit) {\r
                   <span class="flex items-center gap-2 bg-blue-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30 text-sm">\r
                       <i class="fas fa-check text-green-300"></i> {{ benefit }}\r
                   </span>\r
               }\r
          </div>\r
          \r
          <a routerLink="/contacto" class="inline-block bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors cursor-pointer">\r
              {{ content.remoteWork.cta }}\r
          </a>\r
      </div>\r
  </section>\r
\r
  <!-- 9. CONTACT FORM REDUNDANT REMOVED -->\r
\r
</ng-container>`, styles: ["/* angular:styles/component:css;3167dbd93cee805afea3b23b70cec91ac9e8f04e5e32d620633123319ffe9cbc;C:/Users/Ezequiel/Desktop/Utilidades/Trabajo/app/Proyectos/arecofix/v1/Arecofixpage/src/app/public/home/public-home-page.ts */\n.tech-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 2rem;\n}\n/*# sourceMappingURL=public-home-page.css.map */\n"] }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicHomePage, { className: "PublicHomePage", filePath: "src/app/public/home/public-home-page.ts", lineNumber: 34 });
})();

// src/app/public/public.routes.ts
var publicRoutes = [
  {
    title: "Inicio - IT Consultoria y Soluciones - Arecofix",
    path: "",
    component: PublicLayout,
    children: [
      {
        title: "Inicio - IT Consultoria y Soluciones - Arecofix",
        path: "",
        component: PublicHomePage,
        data: {
          seo: {
            title: "Soluciones de Software & Consultor\xEDa IT",
            description: "Expertos en desarrollo de software a medida, aplicaciones m\xF3viles y transformaci\xF3n digital. Consultor\xEDa IT y servicio t\xE9cnico especializado en Marcos Paz.",
            imageUrl: "assets/img/hero-illustration.svg"
          }
        }
      },
      {
        title: "Servicio T\xE9cnico de Celulares en Marcos Paz",
        path: "celular",
        loadComponent: () => import("./chunk-AC4S6LTC.js").then((m) => m.CelularLandingComponent),
        data: {
          seo: {
            title: "Reparaci\xF3n de Celulares en Marcos Paz | Servicio T\xE9cnico Arecofix",
            description: "Arreglo de pantallas, bater\xEDas y pines de carga en el acto. Calidad garantizada en Marcos Paz.",
            imageUrl: "assets/img/og-celulares.jpg",
            keywords: "reparacion de celulares marcos paz, servicio tecnico celulares, arreglo de pantallas, cambio de bateria, arecofix"
          }
        }
      },
      {
        title: "Categories",
        path: "categories",
        loadChildren: () => import("./chunk-PAFKHOGP.js")
      },
      {
        title: "Productos",
        path: "productos",
        loadChildren: () => import("./chunk-SHNN7GMP.js")
      },
      {
        title: "Repuestos",
        path: "repuestos",
        loadComponent: () => import("./chunk-IQ2GZIML.js").then((m) => m.RepuestosComponent)
      },
      {
        title: "Login",
        path: "login",
        loadComponent: () => import("./chunk-IOSVTVLV.js").then((m) => m.LoginComponent)
      },
      {
        title: "Register",
        path: "register",
        loadComponent: () => import("./chunk-S2BAQI7C.js").then((m) => m.RegisterComponent)
      },
      {
        title: "Perfil",
        path: "perfil",
        loadComponent: () => import("./chunk-3XXBD5FV.js").then((m) => m.ProfileComponent)
      },
      {
        title: "GSM",
        path: "gsm",
        loadChildren: () => import("./chunk-F43NXTFH.js").then((m) => m.gsmRoutes)
      },
      {
        title: "Portfolio",
        path: "portfolio",
        loadComponent: () => import("./chunk-I5WN7HWL.js").then((m) => m.PortfolioComponent)
      },
      {
        title: "Nosotros",
        path: "nosotros",
        loadComponent: () => import("./chunk-XFPX33PO.js").then((m) => m.NosotrosComponent)
      },
      {
        title: "Contacto",
        path: "contacto",
        loadComponent: () => import("./chunk-275D3PO3.js").then((m) => m.ContactoComponent)
      },
      {
        title: "Servicios",
        path: "servicios",
        loadComponent: () => import("./chunk-GHUYBOLB.js").then((m) => m.ServiciosComponent)
      },
      {
        title: "Detalle de Servicio",
        path: "servicios/:slug",
        loadComponent: () => import("./chunk-5ED3OPSS.js").then((m) => m.ServiceDetailComponent)
      },
      {
        title: "Academy",
        path: "academy",
        loadComponent: () => import("./chunk-WWSJEQ6E.js").then((m) => m.CursosComponent)
      },
      {
        title: "Detalle del Curso",
        path: "academy/:slug",
        loadComponent: () => import("./chunk-XMYJXN3A.js").then((m) => m.CourseDetailComponent)
      },
      {
        title: "Checkout",
        path: "checkout",
        loadComponent: () => import("./chunk-UP5UCQRT.js").then((m) => m.CheckoutPage)
      },
      {
        path: "posts/servicio-tecnico-de-celulares-en-marcos-paz",
        redirectTo: "celular",
        pathMatch: "full"
      },
      {
        title: "Blog Post",
        path: "posts/:slug",
        loadComponent: () => import("./chunk-CYIMZ7LC.js").then((m) => m.PostPage)
      },
      {
        title: "Seguimiento de Reparaci\xF3n",
        path: "tracking/:code",
        loadComponent: () => import("./chunk-MEBNUY4N.js").then((m) => m.TrackingPage)
      },
      {
        title: "Pol\xEDtica de Privacidad",
        path: "privacy",
        loadComponent: () => import("./chunk-E3Z4BIX5.js").then((m) => m.PrivacyComponent)
      },
      {
        title: "T\xE9rminos y Condiciones",
        path: "terms",
        loadComponent: () => import("./chunk-AWGJS7ZG.js").then((m) => m.TermsComponent)
      },
      {
        title: "Blog",
        path: "blog",
        loadComponent: () => import("./chunk-OT3COWAJ.js").then((m) => m.BlogComponent)
      },
      {
        title: "Mapa del Sitio",
        path: "sitemap",
        loadComponent: () => import("./chunk-7CXIALAT.js").then((m) => m.SitemapComponent)
      },
      {
        title: "FixT\xE9cnicos",
        path: "fixtecnicos",
        loadComponent: () => import("./chunk-YPK65IZQ.js").then((m) => m.FixtecnicosComponent)
      },
      {
        title: "Centro de Recursos",
        path: "recursos",
        loadComponent: () => import("./chunk-LTTLDRMQ.js").then((m) => m.RecursosComponent)
      }
    ]
  }
];
var public_routes_default = publicRoutes;
export {
  public_routes_default as default,
  publicRoutes
};
//# sourceMappingURL=chunk-N7DHGGWP.js.map
