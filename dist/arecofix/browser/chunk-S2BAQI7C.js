import {
  AuthService
} from "./chunk-QVICQRN7.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  CommonModule,
  NgClass,
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
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
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction4,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

// src/app/public/auth/register/register.component.ts
var _c0 = (a0, a1, a2, a3) => ({ "w-1/4 bg-red-500": a0, "w-2/4 bg-yellow-500": a1, "w-3/4 bg-blue-500": a2, "w-full bg-green-500": a3 });
function RegisterComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 51);
    \u0275\u0275element(2, "path", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div")(4, "p", 53);
    \u0275\u0275text(5, "Error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 54);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function RegisterComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 55);
    \u0275\u0275element(2, "path", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "p", 57);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.success);
  }
}
function RegisterComponent_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El nombre es obligatorio.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_16_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xEDnimo 2 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, RegisterComponent_Conditional_16_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, RegisterComponent_Conditional_16_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.first_name == null ? null : ctx_r0.first_name.errors == null ? null : ctx_r0.first_name.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.first_name == null ? null : ctx_r0.first_name.errors == null ? null : ctx_r0.first_name.errors["minlength"]) ? 2 : -1);
  }
}
function RegisterComponent_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El apellido es obligatorio.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_21_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xEDnimo 2 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, RegisterComponent_Conditional_21_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, RegisterComponent_Conditional_21_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.last_name == null ? null : ctx_r0.last_name.errors == null ? null : ctx_r0.last_name.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.last_name == null ? null : ctx_r0.last_name.errors == null ? null : ctx_r0.last_name.errors["minlength"]) ? 2 : -1);
  }
}
function RegisterComponent_Conditional_26_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El email es obligatorio.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_26_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Debe ser un email v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, RegisterComponent_Conditional_26_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, RegisterComponent_Conditional_26_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.email == null ? null : ctx_r0.email.errors == null ? null : ctx_r0.email.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.email == null ? null : ctx_r0.email.errors == null ? null : ctx_r0.email.errors["email"]) ? 2 : -1);
  }
}
function RegisterComponent_Conditional_31_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "El tel\xE9fono es obligatorio.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_31_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Ingresa un tel\xE9fono v\xE1lido.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, RegisterComponent_Conditional_31_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, RegisterComponent_Conditional_31_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.phone == null ? null : ctx_r0.phone.errors == null ? null : ctx_r0.phone.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.phone == null ? null : ctx_r0.phone.errors == null ? null : ctx_r0.phone.errors["pattern"]) ? 2 : -1);
  }
}
function RegisterComponent_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 23);
    \u0275\u0275element(1, "path", 58)(2, "path", 59);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 23);
    \u0275\u0275element(1, "path", 60);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 61);
    \u0275\u0275element(2, "div", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 63);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(3, _c0, ctx_r0.getPasswordStrengthText() === "D\xE9bil", ctx_r0.getPasswordStrengthText() === "Media", ctx_r0.getPasswordStrengthText() === "Fuerte", ctx_r0.getPasswordStrengthText() === "Muy Fuerte"));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.getPasswordStrengthColor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getPasswordStrengthText(), " ");
  }
}
function RegisterComponent_Conditional_43_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "La contrase\xF1a es obligatoria.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "M\xEDnimo 8 caracteres.");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, "May\xFAsculas (A-Z)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, "Min\xFAsculas (a-z)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, "N\xFAmeros (0-9)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, "Caracteres especiales (!@#$%^&*...)");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_43_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p");
    \u0275\u0275text(2, "La contrase\xF1a debe contener:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 64);
    \u0275\u0275conditionalCreate(4, RegisterComponent_Conditional_43_Conditional_3_Conditional_4_Template, 2, 0, "li");
    \u0275\u0275conditionalCreate(5, RegisterComponent_Conditional_43_Conditional_3_Conditional_5_Template, 2, 0, "li");
    \u0275\u0275conditionalCreate(6, RegisterComponent_Conditional_43_Conditional_3_Conditional_6_Template, 2, 0, "li");
    \u0275\u0275conditionalCreate(7, RegisterComponent_Conditional_43_Conditional_3_Conditional_7_Template, 2, 0, "li");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!ctx_r0.passwordStrengthRequirements.hasUpperCase ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.passwordStrengthRequirements.hasLowerCase ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.passwordStrengthRequirements.hasNumeric ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.passwordStrengthRequirements.hasSpecialChar ? 7 : -1);
  }
}
function RegisterComponent_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275conditionalCreate(1, RegisterComponent_Conditional_43_Conditional_1_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(2, RegisterComponent_Conditional_43_Conditional_2_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(3, RegisterComponent_Conditional_43_Conditional_3_Template, 8, 4, "div");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.errors == null ? null : ctx_r0.password.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.errors == null ? null : ctx_r0.password.errors["minlength"]) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r0.password == null ? null : ctx_r0.password.errors == null ? null : ctx_r0.password.errors["passwordStrength"]) ? 3 : -1);
  }
}
function RegisterComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 23);
    \u0275\u0275element(1, "path", 58)(2, "path", 59);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 23);
    \u0275\u0275element(1, "path", 60);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "p");
    \u0275\u0275text(2, "Las contrase\xF1as no coinciden.");
    \u0275\u0275elementEnd()();
  }
}
function RegisterComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Crear Cuenta");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 65);
    \u0275\u0275element(2, "circle", 66)(3, "path", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Creando\u2026 ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 42);
    \u0275\u0275element(1, "path", 68)(2, "path", 69)(3, "path", 70)(4, "path", 71);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 43);
    \u0275\u0275element(1, "circle", 66)(2, "path", 67);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Google");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 45);
    \u0275\u0275element(1, "path", 72);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 46);
    \u0275\u0275element(1, "circle", 66)(2, "path", 67);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "GitHub");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 45);
    \u0275\u0275element(1, "path", 73);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 46);
    \u0275\u0275element(1, "circle", 66)(2, "path", 67);
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Facebook");
    \u0275\u0275elementEnd();
  }
}
var RegisterComponent = class _RegisterComponent {
  form;
  loading = false;
  error = "";
  success = "";
  showPassword = false;
  showConfirmPassword = false;
  agreedToTerms = false;
  passwordStrengthRequirements = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumeric: false,
    hasSpecialChar: false
  };
  socialLoading = {
    google: false,
    github: false,
    facebook: false
  };
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  destroy$ = new Subject();
  constructor() {
    this.form = this.fb.group({
      first_name: ["", [Validators.required, Validators.minLength(2)]],
      last_name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      password: ["", [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ["", [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }
  ngOnInit() {
    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.user) {
        this.router.navigate(["/"]);
      }
    });
    this.password?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get first_name() {
    return this.form.get("first_name");
  }
  get last_name() {
    return this.form.get("last_name");
  }
  get email() {
    return this.form.get("email");
  }
  get phone() {
    return this.form.get("phone");
  }
  get password() {
    return this.form.get("password");
  }
  get confirmPassword() {
    return this.form.get("confirmPassword");
  }
  get terms() {
    return this.form.get("terms");
  }
  updatePasswordStrength() {
    const value = this.password?.value || "";
    this.passwordStrengthRequirements = {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumeric: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    };
  }
  passwordStrengthValidator(control) {
    const value = control.value;
    if (!value)
      return null;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar
        }
      };
    }
    return null;
  }
  passwordMatchValidator(group) {
    const password = group.get("password");
    const confirmPassword = group.get("confirmPassword");
    if (!password || !confirmPassword)
      return null;
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }
  async handleRegister() {
    this.error = "";
    this.success = "";
    if (this.form.invalid) {
      this.error = "Por favor completa correctamente todos los campos.";
      return;
    }
    this.loading = true;
    const { email, password, first_name, last_name, phone } = this.form.value;
    try {
      const res = await this.authService.signUp(email, password, {
        first_name,
        last_name,
        phone,
        display_name: `${first_name} ${last_name}`
      });
      this.loading = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      if (!res.user) {
        this.success = "Te enviamos un enlace de acceso por correo. Revisa tu bandeja de entrada para confirmar tu cuenta.";
      } else {
        this.success = "\xA1Cuenta creada exitosamente! Redirigiendo...";
      }
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 2e3);
    } catch (err) {
      this.loading = false;
      this.error = "Error al crear la cuenta. Intenta nuevamente.";
      console.error("Registration error:", err);
    }
  }
  async handleGoogleLogin() {
    this.error = "";
    this.socialLoading["google"] = true;
    try {
      const res = await this.authService.signInWithGoogle();
      this.socialLoading["google"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
      }
    } catch (err) {
      this.socialLoading["google"] = false;
      this.error = "Error al iniciar sesi\xF3n con Google.";
      console.error("Google login error:", err);
    }
  }
  async loginWithFacebook() {
    this.error = "";
    this.socialLoading["facebook"] = true;
    try {
      const res = await this.authService.signInWithFacebook();
      this.socialLoading["facebook"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
      }
    } catch (err) {
      this.socialLoading["facebook"] = false;
      this.error = "Error al iniciar sesi\xF3n con Facebook.";
      console.error("Facebook login error:", err);
    }
  }
  async loginWithGithub() {
    this.error = "";
    this.socialLoading["github"] = true;
    try {
      const res = await this.authService.signInWithGithub();
      this.socialLoading["github"] = false;
      if (res.error) {
        this.error = this.parseAuthError(res.error);
      }
    } catch (err) {
      this.socialLoading["github"] = false;
      this.error = "Error al iniciar sesi\xF3n con GitHub.";
      console.error("GitHub login error:", err);
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  toggleTermsCheckbox() {
    this.agreedToTerms = !this.agreedToTerms;
  }
  getPasswordStrengthText() {
    const { hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar } = this.passwordStrengthRequirements;
    const strength = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar].filter(Boolean).length;
    if (strength < 2)
      return "D\xE9bil";
    if (strength < 3)
      return "Media";
    if (strength < 4)
      return "Fuerte";
    return "Muy Fuerte";
  }
  getPasswordStrengthColor() {
    const text = this.getPasswordStrengthText();
    switch (text) {
      case "D\xE9bil":
        return "text-red-600";
      case "Media":
        return "text-yellow-600";
      case "Fuerte":
        return "text-blue-600";
      case "Muy Fuerte":
        return "text-green-600";
      default:
        return "text-gray-400";
    }
  }
  parseAuthError(error) {
    const errorMap = {
      "User already registered": "Este email ya est\xE1 registrado.",
      "Weak password": "La contrase\xF1a debe tener al menos 8 caracteres con may\xFAsculas, min\xFAsculas, n\xFAmeros y caracteres especiales.",
      "Invalid email": "Por favor ingresa un email v\xE1lido.",
      "Email already exists": "Este email ya est\xE1 registrado.",
      "Password should be different": "La contrase\xF1a debe ser diferente a la anterior."
    };
    for (const [key, value] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return error || "Error al crear la cuenta.";
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], decls: 92, vars: 55, consts: [[1, "min-h-screen", "bg-linear-to-br", "from-blue-50", "to-indigo-100", "flex", "items-center", "justify-center", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "w-full", "max-w-2xl"], [1, "text-center", "mb-8"], [1, "text-4xl", "font-bold", "text-indigo-600", "mb-2"], [1, "text-gray-600"], [1, "bg-white", "rounded-lg", "shadow-lg", "p-8"], [1, "mb-4", "p-4", "bg-red-50", "border", "border-red-200", "rounded-lg", "flex", "items-start", "gap-3"], [1, "mb-4", "p-4", "bg-green-50", "border", "border-green-200", "rounded-lg", "flex", "items-start", "gap-3"], [1, "space-y-5", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["for", "first_name", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "text", "id", "first_name", "formControlName", "first_name", "placeholder", "Juan", 1, "w-full", "px-4", "py-2", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white"], [1, "text-red-600", "text-sm", "mt-1"], ["for", "last_name", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "text", "id", "last_name", "formControlName", "last_name", "placeholder", "P\xE9rez", 1, "w-full", "px-4", "py-2", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "ejemplo@correo.com", 1, "w-full", "px-4", "py-2", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white"], ["for", "phone", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "tel", "id", "phone", "formControlName", "phone", "placeholder", "+54 (11) 1234-5678", 1, "w-full", "px-4", "py-2", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white"], ["for", "password", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "relative"], ["id", "password", "formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "px-4", "py-2", "pr-10", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white", 3, "type"], ["type", "button", 1, "absolute", "right-3", "top-2.5", "text-gray-500", "hover:text-gray-700", 3, "click"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], [1, "mt-2", "flex", "items-center", "gap-2"], [1, "text-xs", "text-gray-500", "mt-2"], [1, "text-red-600", "text-sm", "mt-2", "space-y-1"], ["for", "confirmPassword", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["id", "confirmPassword", "formControlName", "confirmPassword", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "px-4", "py-2", "pr-10", "border", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent", "transition", "text-gray-900", "bg-white", 3, "type"], [1, "flex", "items-start", "gap-3"], ["type", "checkbox", "id", "terms", "formControlName", "terms", 1, "w-4", "h-4", "text-indigo-600", "rounded", "focus:ring-2", "focus:ring-indigo-500", "cursor-pointer", "mt-1"], ["for", "terms", 1, "text-sm", "text-gray-700", "cursor-pointer"], ["href", "#", 1, "text-indigo-600", "hover:text-indigo-700", "font-medium"], ["type", "submit", 1, "w-full", "bg-indigo-600", "hover:bg-indigo-700", "disabled:bg-indigo-300", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2.5", "px-4", "rounded-lg", "transition", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "disabled"], [1, "inline-flex", "items-center", "gap-2"], [1, "relative", "my-6"], [1, "absolute", "inset-0", "flex", "items-center"], [1, "w-full", "border-t", "border-gray-300"], [1, "relative", "flex", "justify-center", "text-sm"], [1, "px-2", "bg-white", "text-gray-500"], [1, "mt-6", "grid", "grid-cols-2", "gap-3"], ["type", "button", 1, "w-full", "bg-white", "border", "border-gray-300", "hover:bg-gray-50", "disabled:bg-gray-100", "disabled:cursor-not-allowed", "text-gray-700", "font-medium", "py-2", "px-4", "rounded-lg", "transition", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5", "text-gray-700"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-center", "gap-2", "bg-gray-900", "hover:bg-gray-800", "disabled:bg-gray-700", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2", "px-4", "rounded-lg", "transition", 3, "click", "disabled"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-center", "gap-2", "bg-[#1877F2]", "hover:bg-[#166fe5]", "disabled:bg-[#1877F2]/50", "disabled:cursor-not-allowed", "text-white", "font-medium", "py-2", "px-4", "rounded-lg", "transition", "col-span-2", "sm:col-span-1", 3, "click", "disabled"], [1, "mt-6", "text-center"], ["routerLink", "/login", 1, "text-indigo-600", "hover:text-indigo-700", "font-semibold"], [1, "mt-8", "text-center", "text-sm", "text-gray-600"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-5", "h-5", "text-red-600", "shrink-0", "mt-0.5"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", "clip-rule", "evenodd"], [1, "text-red-800", "font-medium"], [1, "text-red-700", "text-sm"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-5", "h-5", "text-green-600", "shrink-0", "mt-0.5"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", "clip-rule", "evenodd"], [1, "text-green-800", "font-medium"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.596 3.039M21 12a9 9 0 11-18 0 9 9 0 0118 0z"], [1, "grow", "h-2", "bg-gray-200", "rounded-full", "overflow-hidden"], [1, "h-full", "transition-all", 3, "ngClass"], [1, "text-sm", "font-medium", 3, "ngClass"], [1, "ml-4", "list-disc"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-4", "w-4"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["fill", "#4285F4", "d", "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"], ["fill", "#34A853", "d", "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"], ["fill", "#FBBC05", "d", "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"], ["fill", "#EA4335", "d", "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"], ["d", "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"], ["d", "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"]], template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "Arecofix");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 4);
      \u0275\u0275text(6, "Crea tu cuenta y \xFAnete a nosotros");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275conditionalCreate(8, RegisterComponent_Conditional_8_Template, 8, 1, "div", 6);
      \u0275\u0275conditionalCreate(9, RegisterComponent_Conditional_9_Template, 5, 1, "div", 7);
      \u0275\u0275elementStart(10, "form", 8);
      \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_10_listener() {
        return ctx.handleRegister();
      });
      \u0275\u0275elementStart(11, "div", 9)(12, "div")(13, "label", 10);
      \u0275\u0275text(14, "Nombre");
      \u0275\u0275elementEnd();
      \u0275\u0275element(15, "input", 11);
      \u0275\u0275conditionalCreate(16, RegisterComponent_Conditional_16_Template, 3, 2, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div")(18, "label", 13);
      \u0275\u0275text(19, "Apellido");
      \u0275\u0275elementEnd();
      \u0275\u0275element(20, "input", 14);
      \u0275\u0275conditionalCreate(21, RegisterComponent_Conditional_21_Template, 3, 2, "div", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div")(23, "label", 15);
      \u0275\u0275text(24, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "input", 16);
      \u0275\u0275conditionalCreate(26, RegisterComponent_Conditional_26_Template, 3, 2, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div")(28, "label", 17);
      \u0275\u0275text(29, "Tel\xE9fono");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "input", 18);
      \u0275\u0275conditionalCreate(31, RegisterComponent_Conditional_31_Template, 3, 2, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div")(33, "label", 19);
      \u0275\u0275text(34, "Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 20);
      \u0275\u0275element(36, "input", 21);
      \u0275\u0275elementStart(37, "button", 22);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_37_listener() {
        return ctx.togglePasswordVisibility();
      });
      \u0275\u0275conditionalCreate(38, RegisterComponent_Conditional_38_Template, 3, 0, ":svg:svg", 23);
      \u0275\u0275conditionalCreate(39, RegisterComponent_Conditional_39_Template, 2, 0, ":svg:svg", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(40, RegisterComponent_Conditional_40_Template, 5, 8, "div", 24);
      \u0275\u0275elementStart(41, "p", 25);
      \u0275\u0275text(42, "La contrase\xF1a debe incluir may\xFAsculas, min\xFAsculas, n\xFAmeros y caracteres especiales.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(43, RegisterComponent_Conditional_43_Template, 4, 3, "div", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "div")(45, "label", 27);
      \u0275\u0275text(46, "Confirmar Contrase\xF1a");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 20);
      \u0275\u0275element(48, "input", 28);
      \u0275\u0275elementStart(49, "button", 22);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_49_listener() {
        return ctx.toggleConfirmPasswordVisibility();
      });
      \u0275\u0275conditionalCreate(50, RegisterComponent_Conditional_50_Template, 3, 0, ":svg:svg", 23);
      \u0275\u0275conditionalCreate(51, RegisterComponent_Conditional_51_Template, 2, 0, ":svg:svg", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(52, RegisterComponent_Conditional_52_Template, 3, 0, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 29);
      \u0275\u0275element(54, "input", 30);
      \u0275\u0275elementStart(55, "label", 31);
      \u0275\u0275text(56, " Acepto los ");
      \u0275\u0275elementStart(57, "a", 32);
      \u0275\u0275text(58, "t\xE9rminos y condiciones");
      \u0275\u0275elementEnd();
      \u0275\u0275text(59, " y la ");
      \u0275\u0275elementStart(60, "a", 32);
      \u0275\u0275text(61, "pol\xEDtica de privacidad");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(62, "button", 33);
      \u0275\u0275conditionalCreate(63, RegisterComponent_Conditional_63_Template, 2, 0, "span");
      \u0275\u0275conditionalCreate(64, RegisterComponent_Conditional_64_Template, 5, 0, "span", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "div", 35)(66, "div", 36);
      \u0275\u0275element(67, "div", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div", 38)(69, "span", 39);
      \u0275\u0275text(70, "O contin\xFAa con");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(71, "div", 40)(72, "button", 41);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_72_listener() {
        return ctx.handleGoogleLogin();
      });
      \u0275\u0275conditionalCreate(73, RegisterComponent_Conditional_73_Template, 5, 0, ":svg:svg", 42);
      \u0275\u0275conditionalCreate(74, RegisterComponent_Conditional_74_Template, 3, 0, ":svg:svg", 43);
      \u0275\u0275conditionalCreate(75, RegisterComponent_Conditional_75_Template, 2, 0, "span");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "button", 44);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_76_listener() {
        return ctx.loginWithGithub();
      });
      \u0275\u0275conditionalCreate(77, RegisterComponent_Conditional_77_Template, 2, 0, ":svg:svg", 45);
      \u0275\u0275conditionalCreate(78, RegisterComponent_Conditional_78_Template, 3, 0, ":svg:svg", 46);
      \u0275\u0275conditionalCreate(79, RegisterComponent_Conditional_79_Template, 2, 0, "span");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "button", 47);
      \u0275\u0275listener("click", function RegisterComponent_Template_button_click_80_listener() {
        return ctx.loginWithFacebook();
      });
      \u0275\u0275conditionalCreate(81, RegisterComponent_Conditional_81_Template, 2, 0, ":svg:svg", 45);
      \u0275\u0275conditionalCreate(82, RegisterComponent_Conditional_82_Template, 3, 0, ":svg:svg", 46);
      \u0275\u0275conditionalCreate(83, RegisterComponent_Conditional_83_Template, 2, 0, "span");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(84, "div", 48)(85, "p", 4);
      \u0275\u0275text(86, " \xBFYa tienes cuenta? ");
      \u0275\u0275elementStart(87, "a", 49);
      \u0275\u0275text(88, "Inicia sesi\xF3n aqu\xED");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(89, "div", 50)(90, "p");
      \u0275\u0275text(91, "\xA9 2024 Arecofix. Todos los derechos reservados.");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.error ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.success ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("border-red-500", (ctx.first_name == null ? null : ctx.first_name.invalid) && ((ctx.first_name == null ? null : ctx.first_name.touched) || (ctx.first_name == null ? null : ctx.first_name.dirty)))("border-gray-300", !((ctx.first_name == null ? null : ctx.first_name.invalid) && ((ctx.first_name == null ? null : ctx.first_name.touched) || (ctx.first_name == null ? null : ctx.first_name.dirty))));
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.first_name == null ? null : ctx.first_name.invalid) && ((ctx.first_name == null ? null : ctx.first_name.touched) || (ctx.first_name == null ? null : ctx.first_name.dirty)) ? 16 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("border-red-500", (ctx.last_name == null ? null : ctx.last_name.invalid) && ((ctx.last_name == null ? null : ctx.last_name.touched) || (ctx.last_name == null ? null : ctx.last_name.dirty)))("border-gray-300", !((ctx.last_name == null ? null : ctx.last_name.invalid) && ((ctx.last_name == null ? null : ctx.last_name.touched) || (ctx.last_name == null ? null : ctx.last_name.dirty))));
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.last_name == null ? null : ctx.last_name.invalid) && ((ctx.last_name == null ? null : ctx.last_name.touched) || (ctx.last_name == null ? null : ctx.last_name.dirty)) ? 21 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("border-red-500", (ctx.email == null ? null : ctx.email.invalid) && ((ctx.email == null ? null : ctx.email.touched) || (ctx.email == null ? null : ctx.email.dirty)))("border-gray-300", !((ctx.email == null ? null : ctx.email.invalid) && ((ctx.email == null ? null : ctx.email.touched) || (ctx.email == null ? null : ctx.email.dirty))));
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.email == null ? null : ctx.email.invalid) && ((ctx.email == null ? null : ctx.email.touched) || (ctx.email == null ? null : ctx.email.dirty)) ? 26 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("border-red-500", (ctx.phone == null ? null : ctx.phone.invalid) && ((ctx.phone == null ? null : ctx.phone.touched) || (ctx.phone == null ? null : ctx.phone.dirty)))("border-gray-300", !((ctx.phone == null ? null : ctx.phone.invalid) && ((ctx.phone == null ? null : ctx.phone.touched) || (ctx.phone == null ? null : ctx.phone.dirty))));
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.phone == null ? null : ctx.phone.invalid) && ((ctx.phone == null ? null : ctx.phone.touched) || (ctx.phone == null ? null : ctx.phone.dirty)) ? 31 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("border-red-500", (ctx.password == null ? null : ctx.password.invalid) && ((ctx.password == null ? null : ctx.password.touched) || (ctx.password == null ? null : ctx.password.dirty)))("border-gray-300", !((ctx.password == null ? null : ctx.password.invalid) && ((ctx.password == null ? null : ctx.password.touched) || (ctx.password == null ? null : ctx.password.dirty))));
      \u0275\u0275property("type", ctx.showPassword ? "text" : "password");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.showPassword ? 38 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showPassword ? 39 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.password == null ? null : ctx.password.value) ? 40 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((ctx.password == null ? null : ctx.password.invalid) && ((ctx.password == null ? null : ctx.password.touched) || (ctx.password == null ? null : ctx.password.dirty)) ? 43 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("border-red-500", (ctx.confirmPassword == null ? null : ctx.confirmPassword.invalid) && ((ctx.confirmPassword == null ? null : ctx.confirmPassword.touched) || (ctx.confirmPassword == null ? null : ctx.confirmPassword.dirty)) || (ctx.form.errors == null ? null : ctx.form.errors["passwordMismatch"]) && (ctx.confirmPassword == null ? null : ctx.confirmPassword.touched))("border-gray-300", !((ctx.confirmPassword == null ? null : ctx.confirmPassword.invalid) && ((ctx.confirmPassword == null ? null : ctx.confirmPassword.touched) || (ctx.confirmPassword == null ? null : ctx.confirmPassword.dirty))) && !(ctx.form.errors == null ? null : ctx.form.errors["passwordMismatch"]));
      \u0275\u0275property("type", ctx.showConfirmPassword ? "text" : "password");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.showConfirmPassword ? 50 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showConfirmPassword ? 51 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.form.errors == null ? null : ctx.form.errors["passwordMismatch"]) && (ctx.confirmPassword == null ? null : ctx.confirmPassword.touched) ? 52 : -1);
      \u0275\u0275advance(10);
      \u0275\u0275property("disabled", ctx.loading || ctx.form.invalid);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading ? 63 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 64 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", ctx.socialLoading["google"] || ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["google"] ? 73 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.socialLoading["google"] ? 74 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["google"] ? 75 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.socialLoading["github"] || ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["github"] ? 77 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.socialLoading["github"] ? 78 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["github"] ? 79 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.socialLoading["facebook"] || ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["facebook"] ? 81 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.socialLoading["facebook"] ? 82 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.socialLoading["facebook"] ? 83 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink, CommonModule, NgClass], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterComponent, [{
    type: Component,
    args: [{ selector: "app-register", standalone: true, imports: [ReactiveFormsModule, RouterLink, CommonModule], template: `<div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">\r
  <div class="w-full max-w-2xl">\r
    <!-- Logo/Header -->\r
    <div class="text-center mb-8">\r
      <h1 class="text-4xl font-bold text-indigo-600 mb-2">Arecofix</h1>\r
      <p class="text-gray-600">Crea tu cuenta y \xFAnete a nosotros</p>\r
    </div>\r
\r
    <!-- Main Card -->\r
    <div class="bg-white rounded-lg shadow-lg p-8">\r
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
      <!-- Registration Form -->\r
      <form [formGroup]="form" (ngSubmit)="handleRegister()" class="space-y-5">\r
        <!-- Names Row -->\r
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">\r
          <!-- First Name -->\r
          <div>\r
            <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>\r
            <input\r
              type="text"\r
              id="first_name"\r
              formControlName="first_name"\r
              placeholder="Juan"\r
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
              [class.border-red-500]="first_name?.invalid && (first_name?.touched || first_name?.dirty)"\r
              [class.border-gray-300]="!(first_name?.invalid && (first_name?.touched || first_name?.dirty))"\r
              />\r
              @if (first_name?.invalid && (first_name?.touched || first_name?.dirty)) {\r
                <div class="text-red-600 text-sm mt-1">\r
                  @if (first_name?.errors?.['required']) {\r
                    <p>El nombre es obligatorio.</p>\r
                  }\r
                  @if (first_name?.errors?.['minlength']) {\r
                    <p>M\xEDnimo 2 caracteres.</p>\r
                  }\r
                </div>\r
              }\r
            </div>\r
\r
            <!-- Last Name -->\r
            <div>\r
              <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>\r
              <input\r
                type="text"\r
                id="last_name"\r
                formControlName="last_name"\r
                placeholder="P\xE9rez"\r
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
                [class.border-red-500]="last_name?.invalid && (last_name?.touched || last_name?.dirty)"\r
                [class.border-gray-300]="!(last_name?.invalid && (last_name?.touched || last_name?.dirty))"\r
                />\r
                @if (last_name?.invalid && (last_name?.touched || last_name?.dirty)) {\r
                  <div class="text-red-600 text-sm mt-1">\r
                    @if (last_name?.errors?.['required']) {\r
                      <p>El apellido es obligatorio.</p>\r
                    }\r
                    @if (last_name?.errors?.['minlength']) {\r
                      <p>M\xEDnimo 2 caracteres.</p>\r
                    }\r
                  </div>\r
                }\r
              </div>\r
            </div>\r
\r
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
                  <div class="text-red-600 text-sm mt-1">\r
                    @if (email?.errors?.['required']) {\r
                      <p>El email es obligatorio.</p>\r
                    }\r
                    @if (email?.errors?.['email']) {\r
                      <p>Debe ser un email v\xE1lido.</p>\r
                    }\r
                  </div>\r
                }\r
              </div>\r
\r
              <!-- Phone Field -->\r
              <div>\r
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Tel\xE9fono</label>\r
                <input\r
                  type="tel"\r
                  id="phone"\r
                  formControlName="phone"\r
                  placeholder="+54 (11) 1234-5678"\r
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
                  [class.border-red-500]="phone?.invalid && (phone?.touched || phone?.dirty)"\r
                  [class.border-gray-300]="!(phone?.invalid && (phone?.touched || phone?.dirty))"\r
                  />\r
                  @if (phone?.invalid && (phone?.touched || phone?.dirty)) {\r
                    <div class="text-red-600 text-sm mt-1">\r
                      @if (phone?.errors?.['required']) {\r
                        <p>El tel\xE9fono es obligatorio.</p>\r
                      }\r
                      @if (phone?.errors?.['pattern']) {\r
                        <p>Ingresa un tel\xE9fono v\xE1lido.</p>\r
                      }\r
                    </div>\r
                  }\r
                </div>\r
\r
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
                        class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"\r
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
\r
                    <!-- Password Strength Indicator -->\r
                    @if (password?.value) {\r
                      <div class="mt-2 flex items-center gap-2">\r
                        <div class="grow h-2 bg-gray-200 rounded-full overflow-hidden">\r
                          <div\r
                            class="h-full transition-all"\r
                [ngClass]="{\r
                  'w-1/4 bg-red-500': getPasswordStrengthText() === 'D\xE9bil',\r
                  'w-2/4 bg-yellow-500': getPasswordStrengthText() === 'Media',\r
                  'w-3/4 bg-blue-500': getPasswordStrengthText() === 'Fuerte',\r
                  'w-full bg-green-500': getPasswordStrengthText() === 'Muy Fuerte'\r
                }"\r
                          ></div>\r
                        </div>\r
                        <span [ngClass]="getPasswordStrengthColor()" class="text-sm font-medium">\r
                          {{ getPasswordStrengthText() }}\r
                        </span>\r
                      </div>\r
                    }\r
\r
                    <p class="text-xs text-gray-500 mt-2">La contrase\xF1a debe incluir may\xFAsculas, min\xFAsculas, n\xFAmeros y caracteres especiales.</p>\r
\r
                    @if (password?.invalid && (password?.touched || password?.dirty)) {\r
                      <div class="text-red-600 text-sm mt-2 space-y-1">\r
                        @if (password?.errors?.['required']) {\r
                          <p>La contrase\xF1a es obligatoria.</p>\r
                        }\r
                        @if (password?.errors?.['minlength']) {\r
                          <p>M\xEDnimo 8 caracteres.</p>\r
                        }\r
                        @if (password?.errors?.['passwordStrength']) {\r
                          <div>\r
                            <p>La contrase\xF1a debe contener:</p>\r
                            <ul class="ml-4 list-disc">\r
                              @if (!passwordStrengthRequirements.hasUpperCase) {\r
                                <li>May\xFAsculas (A-Z)</li>\r
                              }\r
                              @if (!passwordStrengthRequirements.hasLowerCase) {\r
                                <li>Min\xFAsculas (a-z)</li>\r
                              }\r
                              @if (!passwordStrengthRequirements.hasNumeric) {\r
                                <li>N\xFAmeros (0-9)</li>\r
                              }\r
                              @if (!passwordStrengthRequirements.hasSpecialChar) {\r
                                <li>Caracteres especiales (!&#64;#$%^&*...)</li>\r
                              }\r
                            </ul>\r
                          </div>\r
                        }\r
                      </div>\r
                    }\r
                  </div>\r
\r
                  <!-- Confirm Password Field -->\r
                  <div>\r
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contrase\xF1a</label>\r
                    <div class="relative">\r
                      <input\r
                        [type]="showConfirmPassword ? 'text' : 'password'"\r
                        id="confirmPassword"\r
                        formControlName="confirmPassword"\r
                        placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"\r
                        class="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 bg-white"\r
                        [class.border-red-500]="confirmPassword?.invalid && (confirmPassword?.touched || confirmPassword?.dirty) || (form.errors?.['passwordMismatch'] && confirmPassword?.touched)"\r
                        [class.border-gray-300]="!(confirmPassword?.invalid && (confirmPassword?.touched || confirmPassword?.dirty)) && !form.errors?.['passwordMismatch']"\r
                        />\r
                        <button\r
                          type="button"\r
                          (click)="toggleConfirmPasswordVisibility()"\r
                          class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"\r
                          >\r
                          @if (!showConfirmPassword) {\r
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>\r
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>\r
                            </svg>\r
                          }\r
                          @if (showConfirmPassword) {\r
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.596 3.039M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>\r
                            </svg>\r
                          }\r
                        </button>\r
                      </div>\r
                      @if (form.errors?.['passwordMismatch'] && confirmPassword?.touched) {\r
                        <div class="text-red-600 text-sm mt-1">\r
                          <p>Las contrase\xF1as no coinciden.</p>\r
                        </div>\r
                      }\r
                    </div>\r
\r
                    <!-- Terms Checkbox -->\r
                    <div class="flex items-start gap-3">\r
                      <input\r
                        type="checkbox"\r
                        id="terms"\r
                        formControlName="terms"\r
                        class="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer mt-1"\r
                        />\r
                        <label for="terms" class="text-sm text-gray-700 cursor-pointer">\r
                          Acepto los\r
                          <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">t\xE9rminos y condiciones</a>\r
                          y la\r
                          <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">pol\xEDtica de privacidad</a>\r
                        </label>\r
                      </div>\r
\r
                      <!-- Submit Button -->\r
                      <button\r
                        type="submit"\r
                        [disabled]="loading || form.invalid"\r
                        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"\r
                        >\r
                        @if (!loading) {\r
                          <span>Crear Cuenta</span>\r
                        }\r
                        @if (loading) {\r
                          <span class="inline-flex items-center gap-2">\r
                            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                            </svg>\r
                            Creando\u2026\r
                          </span>\r
                        }\r
                      </button>\r
\r
                      <div class="relative my-6">\r
                        <div class="absolute inset-0 flex items-center">\r
                          <div class="w-full border-t border-gray-300"></div>\r
                        </div>\r
                        <div class="relative flex justify-center text-sm">\r
                          <span class="px-2 bg-white text-gray-500">O contin\xFAa con</span>\r
                        </div>\r
                      </div>\r
\r
              <!-- Social Login Options -->\r
              <div class="mt-6 grid grid-cols-2 gap-3">\r
                <!-- Google Button -->\r
                <button\r
                        type="button"\r
                        (click)="handleGoogleLogin()"\r
                        [disabled]="socialLoading['google'] || loading"\r
                        class="w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"\r
                      >\r
                  @if (!socialLoading['google']) {\r
                        <svg class="w-5 h-5" viewBox="0 0 24 24">\r
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>\r
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>\r
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"/>\r
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>\r
                        </svg>\r
                  }\r
                  @if (socialLoading['google']) {\r
                    <svg class="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                    </svg>\r
                  }\r
                  @if (!socialLoading['google']) {\r
                        <span>Google</span>\r
                  }\r
                </button>\r
\r
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
                    </form>\r
\r
                    <!-- Login Link -->\r
                    <div class="mt-6 text-center">\r
                      <p class="text-gray-600">\r
                        \xBFYa tienes cuenta?\r
                        <a routerLink="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold">Inicia sesi\xF3n aqu\xED</a>\r
                      </p>\r
                    </div>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/public/auth/register/register.component.ts", lineNumber: 15 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-S2BAQI7C.js.map
