import {
  AuthService
} from "./chunk-QVICQRN7.js";
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
} from "./chunk-KKQQWBWK.js";
import "./chunk-VKFH2DYL.js";
import "./chunk-3R5MH5C6.js";
import {
  Router,
  RouterLink
} from "./chunk-OCHCYWDE.js";
import {
  Component,
  Subject,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-K7T46PVE.js";
import "./chunk-GOMI4DH3.js";

// src/app/public/profile/profile.component.ts
function ProfileComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Cargando perfil...");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "h1", 3);
    \u0275\u0275text(2, "No est\xE1s logueado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 4);
    \u0275\u0275text(4, "Para ver tu perfil, por favor inicia sesi\xF3n o reg\xEDstrate.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 5)(6, "a", 6);
    \u0275\u0275text(7, "Iniciar sesion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 7);
    \u0275\u0275text(9, "Registrarse");
    \u0275\u0275elementEnd()()();
  }
}
function ProfileComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function ProfileComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.success);
  }
}
function ProfileComponent_Conditional_3_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function ProfileComponent_Conditional_3_Conditional_31_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleEditMode());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isEditing ? "Cancelar" : "Editar perfil", " ");
  }
}
function ProfileComponent_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ProfileComponent_Conditional_3_Conditional_36_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.handleLogout());
    });
    \u0275\u0275text(1, "Cerrar sesi\xF3n");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h1", 8);
    \u0275\u0275text(1, "Mi Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, ProfileComponent_Conditional_3_Conditional_2_Template, 2, 1, "div", 9);
    \u0275\u0275conditionalCreate(3, ProfileComponent_Conditional_3_Conditional_3_Template, 2, 1, "div", 10);
    \u0275\u0275elementStart(4, "form", 11);
    \u0275\u0275listener("ngSubmit", function ProfileComponent_Conditional_3_Template_form_ngSubmit_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateProfile());
    });
    \u0275\u0275elementStart(5, "div", 12)(6, "div")(7, "label", 13);
    \u0275\u0275text(8, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div")(11, "label", 13);
    \u0275\u0275text(12, "Apellido");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div")(15, "label", 13);
    \u0275\u0275text(16, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div")(19, "label", 13);
    \u0275\u0275text(20, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "input", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 18)(23, "label", 13);
    \u0275\u0275text(24, "Biograf\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "textarea", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 18)(27, "label", 13);
    \u0275\u0275text(28, "Avatar URL");
    \u0275\u0275elementEnd();
    \u0275\u0275element(29, "input", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 21);
    \u0275\u0275conditionalCreate(31, ProfileComponent_Conditional_3_Conditional_31_Template, 2, 1, "button", 22);
    \u0275\u0275elementStart(32, "button", 23);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "button", 24);
    \u0275\u0275listener("click", function ProfileComponent_Conditional_3_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetForm());
    });
    \u0275\u0275text(35, "Resetear");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(36, ProfileComponent_Conditional_3_Conditional_36_Template, 2, 0, "button", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.success ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(5);
    \u0275\u0275property("readonly", !ctx_r1.isEditing);
    \u0275\u0275advance(4);
    \u0275\u0275property("readonly", !ctx_r1.isEditing);
    \u0275\u0275advance(8);
    \u0275\u0275property("readonly", !ctx_r1.isEditing);
    \u0275\u0275advance(4);
    \u0275\u0275property("readonly", !ctx_r1.isEditing);
    \u0275\u0275advance(4);
    \u0275\u0275property("readonly", !ctx_r1.isEditing);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.saving ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving || !ctx_r1.isEditing);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.saving ? "Guardando..." : "Guardar cambios", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving || !ctx_r1.isEditing);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.saving ? 36 : -1);
  }
}
var ProfileComponent = class _ProfileComponent {
  form;
  user = null;
  loading = false;
  saving = false;
  error = "";
  success = "";
  isEditing = false;
  isLoggedIn = false;
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  destroy$ = new Subject();
  constructor() {
    this.form = this.fb.group({
      first_name: ["", [Validators.required, Validators.minLength(2)]],
      last_name: ["", [Validators.required, Validators.minLength(2)]],
      email: [{ value: "", disabled: true }, [Validators.required, Validators.email]],
      phone: ["", [Validators.pattern(/^[0-9\-\+\s\(\)]*$/)]],
      bio: ["", [Validators.maxLength(500)]],
      avatar_url: [""]
    });
  }
  async ngOnInit() {
    this.loading = true;
    try {
      const currentUser = await this.authService.getUser();
      this.isLoggedIn = !!currentUser;
      if (!currentUser) {
        this.user = null;
        return;
      }
      const profile = await this.authService.getUserProfile(currentUser.id);
      if (profile) {
        this.user = profile;
        this.form.patchValue(profile);
      }
    } catch (err) {
      this.error = "Error al cargar el perfil.";
      console.error("Profile load error:", err);
    } finally {
      this.loading = false;
    }
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = "Tiempo de espera agotado al cargar el perfil.";
      }
    }, 5e3);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async handleLogout() {
    const error = await this.authService.signOut();
    if (error) {
      this.error = error;
      return;
    }
    this.router.navigate(["/login"]);
  }
  async updateProfile() {
    this.error = "";
    this.success = "";
    if (this.form.invalid) {
      this.error = "Por favor completa correctamente los campos.";
      return;
    }
    this.saving = true;
    try {
      const currentUser = await this.authService.getUser();
      if (!currentUser) {
        this.saving = false;
        this.error = "Necesitas iniciar sesi\xF3n para actualizar tu perfil.";
        return;
      }
      const profileData = {
        first_name: this.form.get("first_name")?.value,
        last_name: this.form.get("last_name")?.value,
        phone: this.form.get("phone")?.value,
        bio: this.form.get("bio")?.value,
        avatar_url: this.form.get("avatar_url")?.value
      };
      const updated = await this.authService.updateUserProfile(currentUser.id, profileData);
      this.saving = false;
      if (updated) {
        this.user = updated;
        this.success = "Perfil actualizado exitosamente.";
        this.isEditing = false;
      } else {
        this.error = "Error al actualizar el perfil.";
      }
    } catch (err) {
      this.saving = false;
      this.error = "Error al actualizar el perfil.";
      console.error("Profile update error:", err);
    }
  }
  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.form.patchValue(this.user);
    }
  }
  resetForm() {
    if (this.user) {
      this.form.patchValue(this.user);
      this.isEditing = false;
    }
  }
  static \u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], decls: 4, vars: 3, consts: [[1, "container", "mx-auto", "p-6"], [1, "alert", "alert-info"], [1, "text-center", "space-y-4"], [1, "text-2xl", "font-bold"], [1, "text-gray-600"], [1, "flex", "gap-4", "justify-center"], ["routerLink", "/login", 1, "btn", "btn-primary"], ["routerLink", "/register", 1, "btn", "btn-secondary"], [1, "text-2xl", "font-bold", "mb-4"], [1, "alert", "alert-error", "mb-4"], [1, "alert", "alert-success", "mb-4"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium"], ["type", "text", "formControlName", "first_name", 1, "input", "input-bordered", "w-full", 3, "readonly"], ["type", "text", "formControlName", "last_name", 1, "input", "input-bordered", "w-full", 3, "readonly"], ["type", "email", "formControlName", "email", "readonly", "", 1, "input", "input-bordered", "w-full"], ["type", "text", "formControlName", "phone", 1, "input", "input-bordered", "w-full", 3, "readonly"], [1, "md:col-span-2"], ["formControlName", "bio", "rows", "4", 1, "textarea", "textarea-bordered", "w-full", 3, "readonly"], ["type", "text", "formControlName", "avatar_url", 1, "input", "input-bordered", "w-full", 3, "readonly"], [1, "flex", "gap-3", "mt-4"], ["type", "button", 1, "btn"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-ghost", 3, "click", "disabled"], ["type", "button", 1, "btn", "btn-outline"], ["type", "button", 1, "btn", 3, "click"], ["type", "button", 1, "btn", "btn-outline", 3, "click"]], template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, ProfileComponent_Conditional_1_Template, 2, 0, "div", 1);
      \u0275\u0275conditionalCreate(2, ProfileComponent_Conditional_2_Template, 10, 0, "div", 2);
      \u0275\u0275conditionalCreate(3, ProfileComponent_Conditional_3_Template, 37, 13);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading && !ctx.isLoggedIn ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading && ctx.isLoggedIn ? 3 : -1);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ selector: "app-profile", standalone: true, imports: [ReactiveFormsModule, RouterLink], template: `<div class="container mx-auto p-6">\r
  @if (loading) {\r
    <div class="alert alert-info">Cargando perfil...</div>\r
  }\r
\r
  @if (!loading && !isLoggedIn) {\r
    <div class="text-center space-y-4">\r
      <h1 class="text-2xl font-bold">No est\xE1s logueado</h1>\r
      <p class="text-gray-600">Para ver tu perfil, por favor inicia sesi\xF3n o reg\xEDstrate.</p>\r
      <div class="flex gap-4 justify-center">\r
        <a routerLink="/login" class="btn btn-primary">Iniciar sesion</a>\r
        <a routerLink="/register" class="btn btn-secondary">Registrarse</a>\r
      </div>\r
    </div>\r
  }\r
\r
  @if (!loading && isLoggedIn) {\r
    <h1 class="text-2xl font-bold mb-4">Mi Perfil</h1>\r
    @if (error) {\r
      <div class="alert alert-error mb-4">{{ error }}</div>\r
    }\r
    @if (success) {\r
      <div class="alert alert-success mb-4">{{ success }}</div>\r
    }\r
    <form [formGroup]="form" (ngSubmit)="updateProfile()" class="space-y-4">\r
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">\r
        <div>\r
          <label class="block text-sm font-medium">Nombre</label>\r
          <input type="text" formControlName="first_name" class="input input-bordered w-full" [readonly]="!isEditing" />\r
        </div>\r
        <div>\r
          <label class="block text-sm font-medium">Apellido</label>\r
          <input type="text" formControlName="last_name" class="input input-bordered w-full" [readonly]="!isEditing" />\r
        </div>\r
        <div>\r
          <label class="block text-sm font-medium">Email</label>\r
          <input type="email" formControlName="email" class="input input-bordered w-full" readonly />\r
        </div>\r
        <div>\r
          <label class="block text-sm font-medium">Tel\xE9fono</label>\r
          <input type="text" formControlName="phone" class="input input-bordered w-full" [readonly]="!isEditing" />\r
        </div>\r
        <div class="md:col-span-2">\r
          <label class="block text-sm font-medium">Biograf\xEDa</label>\r
          <textarea formControlName="bio" rows="4" class="textarea textarea-bordered w-full" [readonly]="!isEditing"></textarea>\r
        </div>\r
        <div class="md:col-span-2">\r
          <label class="block text-sm font-medium">Avatar URL</label>\r
          <input type="text" formControlName="avatar_url" class="input input-bordered w-full" [readonly]="!isEditing" />\r
        </div>\r
      </div>\r
      <div class="flex gap-3 mt-4">\r
        @if (!saving) {\r
          <button type="button" class="btn" (click)="toggleEditMode()">\r
            {{ isEditing ? 'Cancelar' : 'Editar perfil' }}\r
          </button>\r
        }\r
        <button type="submit" class="btn btn-primary" [disabled]="saving || !isEditing">\r
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}\r
        </button>\r
        <button type="button" class="btn btn-ghost" (click)="resetForm()" [disabled]="saving || !isEditing">Resetear</button>\r
        @if (!saving) {\r
          <button type="button" class="btn btn-outline" (click)="handleLogout()">Cerrar sesi\xF3n</button>\r
        }\r
      </div>\r
    </form>\r
  }\r
</div>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/public/profile/profile.component.ts", lineNumber: 14 });
})();
export {
  ProfileComponent
};
//# sourceMappingURL=chunk-3XXBD5FV.js.map
