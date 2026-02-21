import {
  LoggerService
} from "./chunk-2IPP5M5M.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  Router,
  isPlatformBrowser
} from "./chunk-B7SLUDL7.js";
import {
  BehaviorSubject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-4O7IFJFV.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/core/di/supabase-token.ts
var SUPABASE_CLIENT = new InjectionToken("SUPABASE_CLIENT");

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  supabase = inject(SUPABASE_CLIENT);
  router = inject(Router);
  logger = inject(LoggerService);
  platformId = inject(PLATFORM_ID);
  authState = new BehaviorSubject({
    user: null,
    session: null
  });
  authState$ = this.authState.asObservable();
  constructor() {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      this.initializeAuth();
    }
  }
  initializeAuth() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.authState.next({
          user: session.user,
          session
        });
      } else {
        this.authState.next({
          user: null,
          session: null
        });
      }
    });
  }
  async signIn(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    this.authState.next({
      user: data.user,
      session: data.session
    });
    return { user: data.user, session: data.session };
  }
  // Complete sign up with profile information
  async signUp(email, password, profile) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: environment.authRedirectUrl,
          // We still send metadata just in case, but we don't rely on the trigger anymore
          data: profile ? __spreadProps(__spreadValues({}, profile), {
            display_name: (profile.display_name ?? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()) || null
          }) : void 0
        }
      });
      if (error) {
        this.logger.error("Supabase signUp error", error);
        return { user: null, session: null, error: error.message };
      }
      this.authState.next({
        user: data.user,
        session: data.session
      });
      return { user: data.user, session: data.session };
    } catch (e) {
      this.logger.error("Unexpected error during signup", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      return { user: null, session: null, error: errorMessage };
    }
  }
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      return error.message;
    }
    this.authState.next({
      user: null,
      session: null
    });
    return null;
  }
  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }
  async getUserProfile(userId) {
    const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) {
      this.logger.error("Error fetching profile", error);
      return null;
    }
    return data;
  }
  async updateUserProfile(userId, profile) {
    const { data, error } = await this.supabase.from("profiles").update(profile).eq("id", userId).select().single();
    if (error) {
      this.logger.error("Error updating profile", error);
      return null;
    }
    return data;
  }
  async resetPassword(email) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: environment.authRedirectUrl
    });
    return error ? error.message : null;
  }
  // Additional utility methods
  isAuthenticated() {
    return this.authState.value.user !== null;
  }
  getCurrentUser() {
    return this.authState.value.user;
  }
  getCurrentSession() {
    return this.authState.value.session;
  }
  getAuthState$() {
    return this.authState.asObservable();
  }
  async testDatabaseConnection() {
    try {
      const { data, error } = await this.supabase.from("profiles").select("id").limit(1);
      this.logger.debug("Database connection test", { data, error });
      return !error;
    } catch (err) {
      this.logger.error("Database connection test failed", err);
      return false;
    }
  }
  async updatePassword(newPassword) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    });
    return error ? error.message : null;
  }
  async updateEmail(newEmail) {
    const { error } = await this.supabase.auth.updateUser({
      email: newEmail
    });
    return error ? error.message : null;
  }
  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    return { user: null, session: null };
  }
  async signInWithGithub() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    return { user: null, session: null };
  }
  async signInWithFacebook() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    return { user: null, session: null };
  }
  async verifyOTP(email, token) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: "email"
    });
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    this.authState.next({
      user: data.user,
      session: data.session
    });
    return { user: data.user, session: data.session };
  }
  async sendMagicLink(email) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: environment.authRedirectUrl
      }
    });
    return error ? error.message : null;
  }
  async checkEmailExists(email) {
    try {
      const { data, error } = await this.supabase.from("profiles").select("id").eq("email", email).single();
      return !error && data !== null;
    } catch (err) {
      return false;
    }
  }
  async deleteAccount() {
    const user = this.getCurrentUser();
    if (!user) {
      return "No user is currently authenticated";
    }
    const { error: profileError } = await this.supabase.from("profiles").delete().eq("id", user.id);
    if (profileError) {
      return profileError.message;
    }
    this.logger.warn("Account deletion requires backend implementation");
    await this.signOut();
    return null;
  }
  async refreshSession() {
    const { data, error } = await this.supabase.auth.refreshSession();
    if (error) {
      this.logger.error("Error refreshing session", error);
      return null;
    }
    if (data.session?.user) {
      this.authState.next({
        user: data.session.user,
        session: data.session
      });
    }
    return data.session;
  }
  getSupabaseClient() {
    return this.supabase;
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  SUPABASE_CLIENT,
  AuthService
};
//# sourceMappingURL=chunk-65AYZUFN.js.map
