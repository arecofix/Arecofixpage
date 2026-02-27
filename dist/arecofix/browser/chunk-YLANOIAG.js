import {
  AuthService
} from "./chunk-2WW63FQH.js";
import "./chunk-43CFO3KR.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-ODRBL5CU.js";
import "./chunk-RNDQ5ZF4.js";
import "./chunk-2ARLTMO5.js";
import "./chunk-TCBIYFRD.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-CP6GQXNM.js";
import "./chunk-F32QBW3I.js";
import {
  Component,
  Subject,
  inject,
  setClassMetadata,
  takeUntil,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-DPJFS6PI.js";
import "./chunk-46DXP6YY.js";

// src/app/public/auth/login/login.component.ts
function LoginComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 11);
    \u0275\u0275element(2, "path", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 13);
    \u0275\u0275text(5, "Error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 14);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function LoginComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 15);
    \u0275\u0275element(2, "path", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.success);
  }
}
function LoginComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "h3", 18);
    \u0275\u0275text(2, "Restablecer Contrase\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 19);
    \u0275\u0275text(4, "Ingresa tu email y te enviaremos un enlace para restablecer tu contrase\xF1a.");
    \u0275\u0275elementEnd()();
  }
}
function LoginComponent_Conditional_11_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El email es obligatorio.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Debe ser un email v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275conditionalCreate(1, LoginComponent_Conditional_11_Conditional_6_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, LoginComponent_Conditional_11_Conditional_6_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.email == null ? null : ctx_r0.email.errors == null ? null : ctx_r0.email.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.email == null ? null : ctx_r0.email.errors == null ? null : ctx_r0.email.errors["email"]) ? 2 : -1);
  }
}
function LoginComponent_Conditional_11_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 28);
    \u0275\u0275element(1, "path", 45)(2, "path", 46);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 28);
    \u0275\u0275element(1, "path", 47);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "La contrase\xF1a es obligatoria.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xEDnimo 6 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275conditionalCreate(1, LoginComponent_Conditional_11_Conditional_15_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, LoginComponent_Conditional_11_Conditional_15_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.errors == null ? null : ctx_r0.password.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.errors == null ? null : ctx_r0.password.errors["minlength"]) ? 2 : -1);
  }
}
function LoginComponent_Conditional_11_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Iniciar Sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 48);
    \u0275\u0275element(2, "circle", 49)(3, "path", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Cargando\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 36);
    \u0275\u0275element(1, "path", 51)(2, "path", 52)(3, "path", 53)(4, "path", 54);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 37);
    \u0275\u0275element(1, "circle", 49)(2, "path", 50);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Google");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 39);
    \u0275\u0275element(1, "path", 55);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 37);
    \u0275\u0275element(1, "circle", 49)(2, "path", 50);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "GitHub");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 39);
    \u0275\u0275element(1, "path", 56);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 37);
    \u0275\u0275element(1, "circle", 49)(2, "path", 50);
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Facebook");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "form", 20);
    \u0275\u0275listener("ngSubmit", function LoginComponent_Conditional_11_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.handleLogin());
    });
    \u0275\u0275elementStart(2, "div")(3, "label", 21);
    \u0275\u0275text(4, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 22);
    \u0275\u0275conditionalCreate(6, LoginComponent_Conditional_11_Conditional_6_Template, 3, 2, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "label", 24);
    \u0275\u0275text(9, "Contrase\xF1a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 25);
    \u0275\u0275element(11, "input", 26);
    \u0275\u0275elementStart(12, "button", 27);
    \u0275\u0275listener("click", function LoginComponent_Conditional_11_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.togglePasswordVisibility());
    });
    \u0275\u0275conditionalCreate(13, LoginComponent_Conditional_11_Conditional_13_Template, 3, 0, ":svg:svg", 28);
    \u0275\u0275conditionalCreate(14, LoginComponent_Conditional_11_Conditional_14_Template, 2, 0, ":svg:svg", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(15, LoginComponent_Conditional_11_Conditional_15_Template, 3, 2, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 29);
    \u0275\u0275conditionalCreate(17, LoginComponent_Conditional_11_Conditional_17_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(18, LoginComponent_Conditional_11_Conditional_18_Template, 5, 0, "span", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 31);
    \u0275\u0275element(20, "div", 32);
    \u0275\u0275elementStart(21, "span", 33);
    \u0275\u0275text(22, "O contin\xFAa con");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 34)(25, "button", 35);
    \u0275\u0275listener("click", function LoginComponent_Conditional_11_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loginWithGoogle());
    });
    \u0275\u0275conditionalCreate(26, LoginComponent_Conditional_11_Conditional_26_Template, 5, 0, ":svg:svg", 36);
    \u0275\u0275conditionalCreate(27, LoginComponent_Conditional_11_Conditional_27_Template, 3, 0, ":svg:svg", 37);
    \u0275\u0275conditionalCreate(28, LoginComponent_Conditional_11_Conditional_28_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 38);
    \u0275\u0275listener("click", function LoginComponent_Conditional_11_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loginWithGithub());
    });
    \u0275\u0275conditionalCreate(30, LoginComponent_Conditional_11_Conditional_30_Template, 2, 0, ":svg:svg", 39);
    \u0275\u0275conditionalCreate(31, LoginComponent_Conditional_11_Conditional_31_Template, 3, 0, ":svg:svg", 37);
    \u0275\u0275conditionalCreate(32, LoginComponent_Conditional_11_Conditional_32_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 40);
    \u0275\u0275listener("click", function LoginComponent_Conditional_11_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loginWithFacebook());
    });
    \u0275\u0275conditionalCreate(34, LoginComponent_Conditional_11_Conditional_34_Template, 2, 0, ":svg:svg", 39);
    \u0275\u0275conditionalCreate(35, LoginComponent_Conditional_11_Conditional_35_Template, 3, 0, ":svg:svg", 37);
    \u0275\u0275conditionalCreate(36, LoginComponent_Conditional_11_Conditional_36_Template, 2, 0, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 41)(38, "button", 42);
    \u0275\u0275listener("click", function LoginComponent_Conditional_11_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleResetPasswordMode());
    });
    \u0275\u0275text(39, " \xBFOlvidaste tu contrase\xF1a? ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p", 43);
    \u0275\u0275text(41, " \xBFNo tienes cuenta? ");
    \u0275\u0275elementStart(42, "a", 44);
    \u0275\u0275text(43, "Reg\xEDstrate aqu\xED");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", (ctx_r0.email == null ? null : ctx_r0.email.invalid) && ((ctx_r0.email == null ? null : ctx_r0.email.touched) || (ctx_r0.email == null ? null : ctx_r0.email.dirty)))("border-gray-300", !((ctx_r0.email == null ? null : ctx_r0.email.invalid) && ((ctx_r0.email == null ? null : ctx_r0.email.touched) || (ctx_r0.email == null ? null : ctx_r0.email.dirty))));
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.email == null ? null : ctx_r0.email.invalid) && ((ctx_r0.email == null ? null : ctx_r0.email.touched) || (ctx_r0.email == null ? null : ctx_r0.email.dirty)) ? 6 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("border-red-500", (ctx_r0.password == null ? null : ctx_r0.password.invalid) && ((ctx_r0.password == null ? null : ctx_r0.password.touched) || (ctx_r0.password == null ? null : ctx_r0.password.dirty)))("border-gray-300", !((ctx_r0.password == null ? null : ctx_r0.password.invalid) && ((ctx_r0.password == null ? null : ctx_r0.password.touched) || (ctx_r0.password == null ? null : ctx_r0.password.dirty))));
    \u0275\u0275property("type", ctx_r0.showPassword ? "text" : "password");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.showPassword ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.showPassword ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.invalid) && ((ctx_r0.password == null ? null : ctx_r0.password.touched) || (ctx_r0.password == null ? null : ctx_r0.password.dirty)) ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.loading || ctx_r0.form.invalid);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.loading ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.loading ? 18 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r0.socialLoading["google"] || ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["google"] ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.socialLoading["google"] ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["google"] ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.socialLoading["github"] || ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["github"] ? 30 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.socialLoading["github"] ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["github"] ? 32 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.socialLoading["facebook"] || ctx_r0.loading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["facebook"] ? 34 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.socialLoading["facebook"] ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.socialLoading["facebook"] ? 36 : -1);
  }
}
function LoginComponent_Conditional_12_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Enviar Enlace de Recuperaci\xF3n");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_12_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 48);
    \u0275\u0275element(2, "circle", 49)(3, "path", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Enviando\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_12_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "\u2713 Correo Enviado");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 57)(2, "div")(3, "label", 58);
    \u0275\u0275text(4, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 60);
    \u0275\u0275listener("click", function LoginComponent_Conditional_12_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.resetPassword());
    });
    \u0275\u0275conditionalCreate(7, LoginComponent_Conditional_12_Conditional_7_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(8, LoginComponent_Conditional_12_Conditional_8_Template, 5, 0, "span", 30);
    \u0275\u0275conditionalCreate(9, LoginComponent_Conditional_12_Conditional_9_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 61);
    \u0275\u0275listener("click", function LoginComponent_Conditional_12_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleResetPasswordMode());
    });
    \u0275\u0275text(11, " \u2190 Volver al Login ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.loading || ctx_r0.resetEmailSent || !(ctx_r0.email == null ? null : ctx_r0.email.value));
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.loading && !ctx_r0.resetEmailSent ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.loading ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.resetEmailSent ? 9 : -1);
  }
}
var LoginComponent = class _LoginComponent {
  form;
  loading = false;
  error = "";
  success = "";
  showPassword = false;
  resetEmailSent = false;
  resetPasswordMode = false;
  returnUrl = "";
  socialLoading = {
    google: false,
    github: false,
    facebook: false
  };
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroy$ = new Subject();
  constructor() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/perfil";
    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.user) {
        const target = this.sanitizeReturnUrl(this.returnUrl);
        const currentUrl = this.router.url.split("?")[0];
        if (target !== currentUrl) {
          this.router.navigate([target]);
        }
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get email() {
    return this.form.get("email");
  }
  get password() {
    return this.form.get("password");
  }
  async handleLogin() {
    this.error = "";
    this.success = "";
    if (this.form.invalid)
      return;
    this.loading = true;
    const { email, password } = this.form.value;
    try {
      const res = await this.authService.signIn(email, password);
      this.loading = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      this.success = "\xA1Bienvenido! Redirigiendo...";
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.loading = false;
      this.error = "Error al iniciar sesi\xF3n. Intenta nuevamente.";
    }
  }
  async loginWithGoogle() {
    this.error = "";
    this.success = "";
    this.socialLoading["google"] = true;
    try {
      const res = await this.authService.signInWithGoogle();
      this.socialLoading["google"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      this.success = "\xA1Bienvenido! Redirigiendo...";
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading["google"] = false;
      this.error = "Error al iniciar sesi\xF3n con Google.";
    }
  }
  async loginWithFacebook() {
    this.error = "";
    this.success = "";
    this.socialLoading["facebook"] = true;
    try {
      const res = await this.authService.signInWithFacebook();
      this.socialLoading["facebook"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      this.success = "\xA1Bienvenido! Redirigiendo...";
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading["facebook"] = false;
      this.error = "Error al iniciar sesi\xF3n con Facebook.";
    }
  }
  async loginWithGithub() {
    this.error = "";
    this.success = "";
    this.socialLoading["github"] = true;
    try {
      const res = await this.authService.signInWithGithub();
      this.socialLoading["github"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      this.success = "\xA1Bienvenido! Redirigiendo...";
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading["github"] = false;
      this.error = "Error al iniciar sesi\xF3n con GitHub.";
    }
  }
  async resetPassword() {
    this.error = "";
    this.success = "";
    const email = this.email?.value;
    if (!email) {
      this.error = "Ingresa tu email para restablecer la contrase\xF1a.";
      return;
    }
    if (!this.validateEmail(email)) {
      this.error = "Por favor ingresa un email v\xE1lido.";
      return;
    }
    this.loading = true;
    try {
      const err = await this.authService.resetPassword(email);
      this.loading = false;
      if (err) {
        this.error = this.parseAuthError(err);
      } else {
        this.success = "Te enviamos un email para restablecer la contrase\xF1a. Revisa tu bandeja de entrada.";
        this.resetEmailSent = true;
        setTimeout(() => {
          this.resetPasswordMode = false;
          this.resetEmailSent = false;
          this.form.patchValue({ password: "" });
        }, 3e3);
      }
    } catch (err) {
      this.loading = false;
      this.error = "Error al enviar el correo de recuperaci\xF3n.";
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleResetPasswordMode() {
    this.resetPasswordMode = !this.resetPasswordMode;
    this.error = "";
    this.success = "";
    this.resetEmailSent = false;
    if (!this.resetPasswordMode) {
      this.form.patchValue({ password: "" });
    }
  }
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  sanitizeReturnUrl(url) {
    const disallowed = ["/login", "/register"];
    if (!url || disallowed.includes(url))
      return "/";
    return url;
  }
  parseAuthError(error) {
    const errorMsg = error?.message || error || "";
    const errorMap = {
      "Invalid login credentials": "Email o contrase\xF1a incorrectos.",
      "Email not confirmed": "Por favor confirma tu email antes de iniciar sesi\xF3n.",
      "User not found": "No existe una cuenta con este email.",
      "User already registered": "Esta cuenta ya est\xE1 registrada.",
      "Weak password": "La contrase\xF1a debe tener al menos 6 caracteres.",
      "Invalid email": "Por favor ingresa un email v\xE1lido."
    };
    for (const [key, value] of Object.entries(errorMap)) {
      if (typeof errorMsg === "string" && errorMsg.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return typeof errorMsg === "string" ? errorMsg : "Error al iniciar sesi\xF3n.";
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 16, vars: 5, consts: [[1, "min-h-screen", "bg-linear-to-br", "from-blue-50", "to-indigo-100", "flex", "items-center", "justify-center", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "w-full", "max-w-md"], [1, "text-center", "mb-8"], [1, "text-4xl", "font-bold", "text-indigo-600", "mb-2"], [1, "text-gray-600"], [1, "bg-white", "rounded-lg", "shadow-xl", "p-8"], [1, "mb-4", "p-4", "bg-red-50", "border", "border-red-200", "rounded-lg", "flex", "items-start", "gap-3"], [1, "mb-4", "p-4", "bg-green-50", "border", "border-green-200", "rounded-lg", "flex", "items-start", "gap-3"], [1, "mb-6"], [3, "formGroup"], [1, "mt-8", "text-center", "text-sm", "text-gray-600"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-5", "h-5", "text-red-600", "shrink-0", "mt-0.5"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", "clip-rule", "evenodd"], [1, "text-red-800", "font-medium"], [1, "text-red-700", "text-sm"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-5", "h-5", "text-green-600", "shrink-0", "mt-0.5"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", "clip-rule", "evenodd"], [1, "text-green-800", "font-medium"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-3"], [1, "text-sm", "text-gray-600", "mb-4"], [1, "space-y-5", 3, "ngSubmit", "formGroup"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "ejemplo@correo.com", 1, "w-full", "px-4", "py-2", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white"], [1, "text-red-600", "text-sm", "mt-1", "space-y-1"], ["for", "password", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "relative"], ["id", "password", "formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "px-4", "py-2", "pr-10", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white", 3, "type"], ["type", "button", 1, "absolute", "right-3", "top-2.5", "text-gray-500", "hover:text-gray-700", "transition", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["type", "submit", 1, "w-full", "bg-indigo-600", "hover:bg-indigo-700", "disabled:bg-indigo-300", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2.5", "px-4", "rounded-lg", "transition", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "disabled"], [1, "inline-flex", "items-center", "gap-2"], [1, "mt-6", "flex", "items-center"], [1, "grow", "border-t", "border-gray-300"], [1, "px-4", "text-gray-500", "text-sm"], [1, "mt-6", "grid", "grid-cols-2", "gap-3"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-center", "gap-2", "bg-white", "hover:bg-gray-50", "disabled:bg-gray-100", "disabled:cursor-not-allowed", "border", "border-gray-300", "text-gray-700", "font-medium", "py-2", "px-4", "rounded-lg", "transition", 3, "click", "disabled"], ["viewBox", "0 0 24 24", "fill", "currentColor", 1, "w-5", "h-5"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-center", "gap-2", "bg-gray-900", "hover:bg-gray-800", "disabled:bg-gray-700", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2", "px-4", "rounded-lg", "transition", 3, "click", "disabled"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-center", "gap-2", "bg-[#1877F2]", "hover:bg-[#166fe5]", "disabled:bg-[#1877F2]/50", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2", "px-4", "rounded-lg", "transition", "col-span-2", "sm:col-span-1", 3, "click", "disabled"], [1, "mt-6", "space-y-3"], ["type", "button", 1, "w-full", "text-indigo-600", "hover:text-indigo-700", "font-medium", "text-sm", "py-2", "px-4", "rounded-lg", "border", "border-indigo-200", "hover:border-indigo-300", "transition", 3, "click"], [1, "text-center", "text-gray-600", "text-sm"], ["routerLink", "/register", 1, "text-indigo-600", "hover:text-indigo-700", "font-semibold"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.596 3.039M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-4", "w-4"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["d", "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"], ["d", "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"], ["d", "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"], ["d", "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"], ["d", "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"], ["d", "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"], [1, "space-y-4"], ["for", "reset-email", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "email", "id", "reset-email", "formControlName", "email", "placeholder", "ejemplo@correo.com", 1, "w-full", "px-4", "py-2", "border", "border-gray-300", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "transition", "text-gray-900", "bg-white"], ["type", "button", 1, "w-full", "bg-indigo-600", "hover:bg-indigo-700", "disabled:bg-indigo-300", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2.5", "px-4", "rounded-lg", "transition", 3, "click", "disabled"], ["type", "button", 1, "w-full", "text-gray-600", "hover:text-gray-700", "font-medium", "text-sm", "py-2", "transition", 3, "click"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "Arecofix");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Inicia sesi\xF3n en tu cuenta");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275conditionalCreate(8, LoginComponent_Conditional_8_Template, 8, 1, "div", 6);
      \u0275\u0275conditionalCreate(9, LoginComponent_Conditional_9_Template, 5, 1, "div", 7);
      \u0275\u0275conditionalCreate(10, LoginComponent_Conditional_10_Template, 5, 0, "div", 8);
      \u0275\u0275conditionalCreate(11, LoginComponent_Conditional_11_Template, 44, 29, "div");
      \u0275\u0275conditionalCreate(12, LoginComponent_Conditional_12_Template, 12, 5, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 10)(14, "p");
      \u0275\u0275text(15, "\xA9 2024 Arecofix. Todos los derechos reservados.");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.error ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.success ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resetPasswordMode ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.resetPasswordMode ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.resetPasswordMode ? 12 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [ReactiveFormsModule, RouterLink], template: `<div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">\r
  <div class="w-full max-w-md">\r
    <!-- Logo/Header -->\r
    <div class="text-center mb-8">\r
      <h1 class="text-4xl font-bold text-indigo-600 mb-2">Arecofix</h1>\r
      <p class="text-gray-600">Inicia sesi\xF3n en tu cuenta</p>\r
    </div>\r
\r
    <!-- Main Card -->\r
    <div class="bg-white rounded-lg shadow-xl p-8">\r
      <!-- Error Alert -->\r
      @if (error) {\r
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">\r
          <svg class="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">\r
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />\r
          </svg>\r
          <div>\r
            <p class="text-red-800 font-medium">Error</p>\r
            <p class="text-red-700 text-sm">{{ error }}</p>\r
          </div>\r
        </div>\r
      }\r
\r
      <!-- Success Alert -->\r
      @if (success) {\r
        <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">\r
          <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">\r
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />\r
          </svg>\r
          <p class="text-green-800 font-medium">{{ success }}</p>\r
        </div>\r
      }\r
\r
      <!-- Reset Password Mode -->\r
      @if (resetPasswordMode) {\r
        <div class="mb-6">\r
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Restablecer Contrase\xF1a</h3>\r
          <p class="text-sm text-gray-600 mb-4">Ingresa tu email y te enviaremos un enlace para restablecer tu contrase\xF1a.</p>\r
        </div>\r
      }\r
\r
      <!-- Login Form -->\r
      @if (!resetPasswordMode) {\r
        <div>\r
          <form [formGroup]="form" (ngSubmit)="handleLogin()" class="space-y-5">\r
            <!-- Email Field -->\r
            <div>\r
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>\r
              <input\r
                type="email"\r
                id="email"\r
                formControlName="email"\r
                placeholder="ejemplo@correo.com"\r
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
                [class.border-red-500]="email?.invalid && (email?.touched || email?.dirty)"\r
                [class.border-gray-300]="!(email?.invalid && (email?.touched || email?.dirty))"\r
                />\r
                @if (email?.invalid && (email?.touched || email?.dirty)) {\r
                  <div class="text-red-600 text-sm mt-1 space-y-1">\r
                    @if (email?.errors?.['required']) {\r
                      <p>El email es obligatorio.</p>\r
                    }\r
                    @if (email?.errors?.['email']) {\r
                      <p>Debe ser un email v\xE1lido.</p>\r
                    }\r
                  </div>\r
                }\r
              </div>\r
              <!-- Password Field -->\r
              <div>\r
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contrase\xF1a</label>\r
                <div class="relative">\r
                  <input\r
                    [type]="showPassword ? 'text' : 'password'"\r
                    id="password"\r
                    formControlName="password"\r
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"\r
                    class="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
                    [class.border-red-500]="password?.invalid && (password?.touched || password?.dirty)"\r
                    [class.border-gray-300]="!(password?.invalid && (password?.touched || password?.dirty))"\r
                    />\r
                    <button\r
                      type="button"\r
                      (click)="togglePasswordVisibility()"\r
                      class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition"\r
                      >\r
                      @if (!showPassword) {\r
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>\r
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>\r
                        </svg>\r
                      }\r
                      @if (showPassword) {\r
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.596 3.039M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>\r
                        </svg>\r
                      }\r
                    </button>\r
                  </div>\r
                  @if (password?.invalid && (password?.touched || password?.dirty)) {\r
                    <div class="text-red-600 text-sm mt-1 space-y-1">\r
                      @if (password?.errors?.['required']) {\r
                        <p>La contrase\xF1a es obligatoria.</p>\r
                      }\r
                      @if (password?.errors?.['minlength']) {\r
                        <p>M\xEDnimo 6 caracteres.</p>\r
                      }\r
                    </div>\r
                  }\r
                </div>\r
                <!-- Submit Button -->\r
                <button\r
                  type="submit"\r
                  [disabled]="loading || form.invalid"\r
                  class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"\r
                  >\r
                  @if (!loading) {\r
                    <span>Iniciar Sesi\xF3n</span>\r
                  }\r
                  @if (loading) {\r
                    <span class="inline-flex items-center gap-2">\r
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                      </svg>\r
                      Cargando\u2026\r
                    </span>\r
                  }\r
                </button>\r
              </form>\r
              <!-- Divider -->\r
              <div class="mt-6 flex items-center">\r
                <div class="grow border-t border-gray-300"></div>\r
                <span class="px-4 text-gray-500 text-sm">O contin\xFAa con</span>\r
                <div class="grow border-t border-gray-300"></div>\r
              </div>\r
              <!-- Social Login Options -->\r
              <div class="mt-6 grid grid-cols-2 gap-3">\r
                <!-- Google Button -->\r
                <button\r
                  type="button"\r
                  (click)="loginWithGoogle()"\r
                  [disabled]="socialLoading['google'] || loading"\r
                  class="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition"\r
                  >\r
                  @if (!socialLoading['google']) {\r
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">\r
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>\r
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>\r
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>\r
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>\r
                    </svg>\r
                  }\r
                  @if (socialLoading['google']) {\r
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                    </svg>\r
                  }\r
                  @if (!socialLoading['google']) {\r
                    <span>Google</span>\r
                  }\r
                </button>\r
                <!-- GitHub Button -->\r
                <button\r
                  type="button"\r
                  (click)="loginWithGithub()"\r
                  [disabled]="socialLoading['github'] || loading"\r
                  class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition"\r
                  >\r
                  @if (!socialLoading['github']) {\r
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">\r
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>\r
                    </svg>\r
                  }\r
                  @if (socialLoading['github']) {\r
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                    </svg>\r
                  }\r
                  @if (!socialLoading['github']) {\r
                    <span>GitHub</span>\r
                  }\r
                </button>\r
                <!-- Facebook Button -->\r
                <button\r
                  type="button"\r
                  (click)="loginWithFacebook()"\r
                  [disabled]="socialLoading['facebook'] || loading"\r
                  class="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] disabled:bg-[#1877F2]/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition col-span-2 sm:col-span-1"\r
                  >\r
                  @if (!socialLoading['facebook']) {\r
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">\r
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>\r
                    </svg>\r
                  }\r
                  @if (socialLoading['facebook']) {\r
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                    </svg>\r
                  }\r
                  @if (!socialLoading['facebook']) {\r
                    <span>Facebook</span>\r
                  }\r
                </button>\r
              </div>\r
              <!-- Forgot Password & Register -->\r
              <div class="mt-6 space-y-3">\r
                <button\r
                  type="button"\r
                  (click)="toggleResetPasswordMode()"\r
                  class="w-full text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 px-4 rounded-lg border border-indigo-200 hover:border-indigo-300 transition"\r
                  >\r
                  \xBFOlvidaste tu contrase\xF1a?\r
                </button>\r
                <p class="text-center text-gray-600 text-sm">\r
                  \xBFNo tienes cuenta?\r
                  <a routerLink="/register" class="text-indigo-600 hover:text-indigo-700 font-semibold">Reg\xEDstrate aqu\xED</a>\r
                </p>\r
              </div>\r
            </div>\r
          }\r
\r
          <!-- Reset Password Form -->\r
          @if (resetPasswordMode) {\r
            <div [formGroup]="form">\r
              <div class="space-y-4">\r
                <div>\r
                  <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>\r
                  <input\r
                    type="email"\r
                    id="reset-email"\r
                    formControlName="email"\r
                    placeholder="ejemplo@correo.com"\r
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900 bg-white"\r
                    />\r
                  </div>\r
                  <button\r
                    type="button"\r
                    (click)="resetPassword()"\r
                    [disabled]="loading || resetEmailSent || !email?.value"\r
                    class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition"\r
                    >\r
                    @if (!loading && !resetEmailSent) {\r
                      <span>Enviar Enlace de Recuperaci\xF3n</span>\r
                    }\r
                    @if (loading) {\r
                      <span class="inline-flex items-center gap-2">\r
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                        </svg>\r
                        Enviando\u2026\r
                      </span>\r
                    }\r
                    @if (resetEmailSent) {\r
                      <span>\u2713 Correo Enviado</span>\r
                    }\r
                  </button>\r
                  <button\r
                    type="button"\r
                    (click)="toggleResetPasswordMode()"\r
                    class="w-full text-gray-600 hover:text-gray-700 font-medium text-sm py-2 transition"\r
                    >\r
                    \u2190 Volver al Login\r
                  </button>\r
                </div>\r
              </div>\r
            }\r
          </div>\r
\r
          <!-- Footer -->\r
          <div class="mt-8 text-center text-sm text-gray-600">\r
            <p>\xA9 2024 Arecofix. Todos los derechos reservados.</p>\r
          </div>\r
        </div>\r
      </div>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/public/auth/login/login.component.ts", lineNumber: 15 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-YLANOIAG.js.map
