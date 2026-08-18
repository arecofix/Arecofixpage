import { Injectable, inject, PLATFORM_ID, signal, Injector, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  User,
  Session,
  AuthChangeEvent,
  AuthResponse,
  AuthError,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoggerService } from './logger.service';
import { ProfileService } from './profile.service';
import { TenantService } from './tenant.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { TENANT_CONSTANTS } from '../constants/tenant.constants';
import { ToastService } from '@app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  private platformId = inject(PLATFORM_ID);
  private profileService = inject(ProfileService);
  private tenantService = inject(TenantService);
  private ngZone = inject(NgZone);
  private injector = inject(Injector);
  
  // Súper Administrador Global
  public isSuperAdmin = signal<boolean>(false);

  private authState = new BehaviorSubject<{
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    isInitialized: boolean;
  }>({
    session: null,
    user: null,
    profile: null,
    isInitialized: false,
  });

  private currentBranchSubject = new BehaviorSubject<Branch | null>(null);
  public currentBranch$ = this.currentBranchSubject.asObservable();

  public authState$ = this.authState.asObservable();

  private currentProfileSignal = toSignal(this.authState$.pipe(map(state => state.profile)), { initialValue: null });

  // Método para obtener el perfil actual
  getCurrentProfile(): UserProfile | null {
    return this.currentProfileSignal();
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
      this.setupDeepLinks();
      this.setupVisibilityListener();
    }
  }

  /**
   * Monitor tab visibility to wake up the session after long idle periods
   */
  private setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
           this.logger.info('Tab became visible, checking session integrity...');
           const session = this.getCurrentSession();
           
           if (session) {
              const expiresAt = session.expires_at || 0;
              const now = Math.floor(Date.now() / 1000);
              
              // If session expires in less than 5 minutes or is already expired
              if (expiresAt - now < 300) {
                 this.logger.info('Session nearing expiration or expired after dormant period, refreshing...');
                 await this.refreshSession();
              }
           } else {
             // Try to recover session if it was lost
             await this.getSession();
           }
        }
      });
    }
  }

  private setupDeepLinks() {
    App.addListener('appUrlOpen', (data: URLOpenListenerEvent) => {
      this.ngZone.run(async () => {
        const url = new URL(data.url);
        // Clean URL if it has fragments like #access_token
        if (url.hash) {
            const params = new URLSearchParams(url.hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken && refreshToken) {
                await this.supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
                // Close browser if open
                await Browser.close();
            }
        }
      });
    });
  }

  private async initAuth() {
    try {
      let { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (typeof navigator !== 'undefined' && !navigator.onLine && !session) {
        // Fallback: manually read from local storage
        const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (storageKey) {
           const storedSession = JSON.parse(localStorage.getItem(storageKey) || '{}');
           if (storedSession?.session) {
               session = storedSession.session;
               error = null;
               this.logger.info('Recovered session from localStorage for offline mode');
           }
        }
      }

      if (error) {
        this.logger.error('Session retrieval error', error);
        if (error.message.includes('Refresh Token') && navigator.onLine) {
           await this.supabase.auth.signOut();
        }
      }

      if (session) {
        const profile = await this.ensureProfile(session);
        
        if (profile?.tenant_id) {
          await this.tenantService.setCurrentTenant(profile.tenant_id);
        }

        if (profile?.branch_id) {
          await this.fetchBranchDetails(profile.branch_id);
        } else {
          const savedId = localStorage.getItem('arecofix_admin_branch_id');
          if (savedId) {
             await this.fetchBranchDetails(savedId);
          }
        }

        if (profile) {
           this.authState.next({ session, user: session.user, profile, isInitialized: true });
        } else {
           this.authState.next({ ...this.authState.value, session, user: session.user, isInitialized: true });
        }

        if (profile && (TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(profile.email || '') || profile.role === 'super_admin')) {
          this.isSuperAdmin.set(true);
        }
      } else {
        this.authState.next({ ...this.authState.value, isInitialized: true });
      }
    } catch (e) {
      this.logger.error('Critical auth init failure', e);
      this.authState.next({ ...this.authState.value, isInitialized: true });
    }

    this.supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        this.logger.info(`Auth Event: ${event}`);
        
        if (event === 'SIGNED_OUT') {
           this.authState.next({ session: null, user: null, profile: null, isInitialized: true });
           this.isSuperAdmin.set(false);
           this.currentBranchSubject.next(null);
           return;
        }

        if (session) {
          const profile = await this.ensureProfile(session);
          
          if (profile?.tenant_id) {
            await this.tenantService.setCurrentTenant(profile.tenant_id);
          }

          if (profile?.branch_id) {
            await this.fetchBranchDetails(profile.branch_id);
          } else if (profile !== null) {
            this.currentBranchSubject.next(null);
          } else {
            // Error fetching profile (e.g. 401 or offline), try to preserve existing branch
            const savedId = localStorage.getItem('arecofix_admin_branch_id');
            if (savedId) {
               await this.fetchBranchDetails(savedId);
            }
          }

          if (profile) {
            this.authState.next({ session, user: session.user, profile, isInitialized: true });
          } else {
            // Keep existing profile if we failed to fetch
            this.authState.next({ ...this.authState.value, session, user: session.user, isInitialized: true });
          }

          if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
            let returnUrl = localStorage.getItem('arecofix_return_url');
            if (returnUrl !== null) {
               localStorage.removeItem('arecofix_return_url');
            }
            
            const isOAuthRedirect = window.location.hash.includes('access_token');
            if (isOAuthRedirect) {
               const toastService = this.injector.get(ToastService);
               toastService.show(`Bienvenido${profile?.first_name ? ' ' + profile.first_name : ''}! Has iniciado sesión correctamente.`, 'success');
            }

            if (!returnUrl || returnUrl === '') {
              const userRole = profile?.role || 'user';
              const isAdmin = ['admin', 'super_admin', 'tenant_owner', 'technician'].includes(userRole);
              returnUrl = isAdmin ? '/admin' : '/';
            }

            setTimeout(async () => {
              const { Router } = await import('@angular/router');
              const router = this.injector.get(Router);
              
              const currentPath = window.location.pathname;
              // Redirect unless we are already exactly on the intended route (ignoring hash)
              if (currentPath !== returnUrl || returnUrl !== '/') {
                 router.navigateByUrl(returnUrl);
              } else if (isOAuthRedirect) {
                 // Remove hash from URL to clean it up without reloading
                 history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }, 100);
          }

          if (profile && (TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(profile.email || '') || profile.role === 'super_admin')) {
            this.isSuperAdmin.set(true);
          }
        } else {
          this.authState.next({ session: null, user: null, profile: null, isInitialized: true });
          this.currentBranchSubject.next(null);
          this.isSuperAdmin.set(false);
        }
      },
    );
  }

  /**
   * Fetches branch metadata for the assigned branch_id
   */
  private async fetchBranchDetails(branchId: string) {
    try {
      const { data, error } = await this.supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .maybeSingle();

      if (error) throw error;
      this.currentBranchSubject.next(data as Branch | null);
    } catch (err) {
      this.logger.error('Error fetching assigned branch details', err);
      // Prevent resetting to Sede Central if we hit a temporary error like 401 or offline
      if (!this.currentBranchSubject.value) {
         this.currentBranchSubject.next(null);
      }
    }
  }

  /**
   * Refreshes the current profile and branch details
   * Useful when an admin changes the user's branch in real-time
   */
  async refreshProfile() {
    const user = this.getCurrentUser();
    if (!user) return;

    const profile = await this.profileService.getProfile(user.id);
    if (profile) {
      this.authState.next({ 
        ...this.authState.value, 
        profile 
      });
      if (profile.branch_id) {
        await this.fetchBranchDetails(profile.branch_id);
      } else {
        this.currentBranchSubject.next(null);
      }
    }
  }

  /**
   * Ensures a profile row exists for the given session user.
   */
  private async ensureProfile(session: Session): Promise<UserProfile | null> {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const cached = localStorage.getItem(`arecofix_profile_${session.user.id}`);
        if (cached) return JSON.parse(cached);
      }

      const existingProfile = await this.profileService.getProfile(session.user.id);
      const meta = session.user.user_metadata || {};
      const metaAvatar = meta['avatar_url'] || meta['picture'] || null;

      if (existingProfile) {
         if (metaAvatar && existingProfile.avatar_url !== metaAvatar) {
             const { data: updatedProfile, error } = await this.supabase
                 .from('profiles')
                 .update({ avatar_url: metaAvatar, updated_at: new Date().toISOString() })
                 .eq('id', session.user.id)
                 .select()
                 .maybeSingle();
             if (!error && updatedProfile) {
                 localStorage.setItem(`arecofix_profile_${session.user.id}`, JSON.stringify(updatedProfile));
                 return updatedProfile as UserProfile;
             }
         }
         localStorage.setItem(`arecofix_profile_${session.user.id}`, JSON.stringify(existingProfile));
         return existingProfile;
      }

      const currentTenantId = this.tenantService.getTenantId();
      const isFallback = currentTenantId === TENANT_CONSTANTS.FALLBACK_ID;
      const targetTenantId = (!isFallback && currentTenantId) ? currentTenantId : 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

      const metaFullName = meta['full_name'] || meta['name'] || null;
      const metaFirstName = meta['first_name'] || meta['given_name'] || (metaFullName ? metaFullName.split(' ')[0] : null) || (session.user.email ? session.user.email.split('@')[0] : null);
      const metaLastName = meta['last_name'] || meta['family_name'] || (metaFullName && metaFullName.includes(' ') ? metaFullName.split(' ').slice(1).join(' ') : null);
      const computedFullName = metaFullName || (metaFirstName && metaLastName ? `${metaFirstName} ${metaLastName}` : (metaFirstName || ''));

      const payload: Partial<UserProfile> = {
        id: session.user.id,
        email: session.user.email || meta['email'] || '',
        first_name: metaFirstName,
        last_name: metaLastName,
        avatar_url: metaAvatar,
        role: meta['role'] || session.user.app_metadata?.['role'] || 'user',
        tenant_id: targetTenantId,
        branch_id: meta['branch_id'] || 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (payload.email && TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(payload.email)) {
        payload.role = 'super_admin';
        this.isSuperAdmin.set(true);
      }

      const { data, error } = await this.supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to auto-create profile row', error);
        return null;
      }

      this.logger.info(`Profile auto-created for user ${session.user.id}`);
      
      if (data) {
        localStorage.setItem(`arecofix_profile_${session.user.id}`, JSON.stringify(data));
      }
      return data as UserProfile;
    } catch (e) {
      this.logger.error('Unexpected error ensuring profile', e);
      const cached = localStorage.getItem(`arecofix_profile_${session.user.id}`);
      if (cached) return JSON.parse(cached);
      return null;
    }
  }

  async signOut(): Promise<string | null> {
    const { isTauri } = await import('@tauri-apps/api/core');
    const runningInTauri = isTauri();
    
    if (runningInTauri) {
      this.authState.next({ session: null, user: null, profile: null, isInitialized: true });
      this.isSuperAdmin.set(false);
      this.currentBranchSubject.next(null);
    }
    
    const { error } = await this.supabase.auth.signOut();
    return error ? error.message : null;
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  getCurrentSession(): Session | null {
    return this.authState.value.session;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.profileService.getProfile(userId);
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    return this.profileService.updateProfile(userId, profile);
  }

  getSupabaseClient() {
    return this.supabase;
  }

  // Social Logins
  private async signInWithProvider(provider: 'google' | 'facebook' | 'github'): Promise<AuthResponse> {
    const isNative = Capacitor.isNativePlatform();

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: { 
        redirectTo: environment.authRedirectUrl,
        skipBrowserRedirect: isNative
      },
    });

    if (isNative && data?.url) {
      await Browser.open({ url: data.url });
    }

    // Cast correctly according to Supabase v2 structure
    return { data, error } as unknown as AuthResponse;
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    return this.signInWithProvider('google');
  }

  async signInWithFacebook(): Promise<AuthResponse> {
    return this.signInWithProvider('facebook');
  }

  async signInWithGithub(): Promise<AuthResponse> {
    return this.signInWithProvider('github');
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    let runningInTauri = false;
    try {
      const { isTauri } = await import('@tauri-apps/api/core');
      runningInTauri = isTauri();
    } catch (e) {
      runningInTauri = false;
    }
    
    const isOffline = typeof navigator !== 'undefined' && (!navigator.onLine || window.forceOffline);
    let onlineResponse: AuthResponse | null = null;

    if (!isOffline) {
      try {
        onlineResponse = await this.supabase.auth.signInWithPassword({ email, password });
        if (!onlineResponse.error) {
          return onlineResponse;
        }
      } catch (e) {
        // Continue to offline fallback if running in Tauri
        this.logger.warn('Online login threw error', e);
      }
    }

    if (runningInTauri) {
      try {
        // Offline Login via Flask Sidecar with 3 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        let response;
        try {
          response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password: password }),
            signal: controller.signal
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        
        // Mock Supabase Session based on Offline Token
        const mockUser: User = {
          id: data.admin.id,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: email
        };

        const mockSession: Session = {
          access_token: data.token,
          refresh_token: '',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: mockUser
        };

        // Update local auth state to reflect offline login
        const role = data.admin.role || 'super_admin';
        this.authState.next({
          session: mockSession,
          user: mockUser,
          profile: { 
              id: data.admin.id, 
              role: role, 
              email: email,
              branch_id: data.admin.branch_id
          } as UserProfile,
          isInitialized: true
        });
        
        const isSuper = role === 'super_admin' || TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(email);
        this.isSuperAdmin.set(isSuper);
        
        if (data.admin.branch_id) {
           await this.fetchBranchDetails(data.admin.branch_id);
        } else {
           this.currentBranchSubject.next(null);
        }

        return { data: { user: mockUser, session: mockSession }, error: null };

      } catch (error: any) {
        if (onlineResponse && onlineResponse.error) {
          return onlineResponse;
        }
        const authError = error as AuthError;
        if (!authError.message) authError.message = String(error);
        return { data: { user: null, session: null }, error: authError };
      }
    }

    if (onlineResponse) {
      return onlineResponse;
    }
    
    return { data: { user: null, session: null }, error: { message: 'Sin conexión a internet' } as AuthError };
  }

  async signUp(
    email: string,
    password: string,
    profileData: Partial<UserProfile>,
  ): Promise<AuthResponse> {
    const tenantId = this.tenantService.getTenantId();
    this.logger.info(`Attempting signUp for ${email} with tenant: ${tenantId}`);
    
    try {
      const response = await this.supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            ...profileData,
            tenant_id: tenantId
          } 
        },
      });
      
      this.logger.info(`SignUp response for ${email}`, response);
      return response;
    } catch (error) {
      this.logger.error(`Catch error in signUp for ${email}`, error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<string | null> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: environment.authRedirectUrl,
    });
    return error ? error.message : null;
  }

  async verifyOtpRecovery(email: string, token: string): Promise<string | null> {
    const { error } = await this.supabase.auth.verifyOtp({ email, token, type: 'recovery' });
    return error ? error.message : null;
  }

  async updatePassword(newPassword: string): Promise<string | null> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    return error ? error.message : null;
  }

  /**
   * Proactively refreshes the session to ensure a valid token for long operations.
   */
  async refreshSession(): Promise<Session | null> {
    const { data: { session }, error } = await this.supabase.auth.refreshSession();
    if (error) {
      this.logger.error('Error refreshing session', error);
      return null;
    }
    if (session) {
      this.authState.next({ ...this.authState.value, session, user: session.user });
    }
    return session;
  }
}
