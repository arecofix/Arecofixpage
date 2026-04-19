import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  User,
  Session,
  AuthChangeEvent,
  AuthResponse,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { ProfileService } from './profile.service';
import { TenantService } from './tenant.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { TENANT_CONSTANTS } from '../constants/tenant.constants';

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

  // Método para obtener el perfil actual
  getCurrentProfile(): UserProfile | null {
    return this.authState.value.profile;
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
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        this.logger.error('Session retrieval error', error);
        if (error.message.includes('Refresh Token')) {
           await this.supabase.auth.signOut();
        }
      }

      if (session) {
        const profile = await this.ensureProfile(session);
        
        if (profile?.branch_id) {
          await this.fetchBranchDetails(profile.branch_id);
        }

        this.authState.next({ session, user: session.user, profile, isInitialized: true });

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
          
          if (profile?.branch_id) {
            await this.fetchBranchDetails(profile.branch_id);
          } else {
            this.currentBranchSubject.next(null);
          }

          this.authState.next({ session, user: session.user, profile, isInitialized: true });

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
      this.currentBranchSubject.next(null);
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
      const existingProfile = await this.profileService.getProfile(session.user.id);
      if (existingProfile) return existingProfile;

      const meta = session.user.user_metadata || {};
      const tenantId = this.tenantService.getTenantId();
      const isFallback = tenantId === TENANT_CONSTANTS.FALLBACK_ID;

      const payload: Partial<UserProfile> = {
        id: session.user.id,
        email: session.user.email || meta['email'] || '',
        first_name: meta['first_name'] || meta['given_name'] || null,
        last_name: meta['last_name'] || meta['family_name'] || null,
        full_name: meta['full_name'] || meta['name'] || null,
        avatar_url: meta['avatar_url'] || meta['picture'] || null,
        role: meta['role'] || session.user.app_metadata?.['role'] || 'user',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (payload.email && TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(payload.email)) {
        payload.role = 'super_admin';
        this.isSuperAdmin.set(true);
      }

      if (!isFallback) {
        payload.tenant_id = tenantId;
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
      
      const createdProfile = data as UserProfile | null;
      if (createdProfile && (TENANT_CONSTANTS.SUPER_ADMIN_EMAILS.includes(createdProfile.email || '') || createdProfile.role === 'super_admin')) {
        this.isSuperAdmin.set(true);
      }
      
      return createdProfile;
    } catch (err) {
      this.logger.error('ensureProfile error', err);
      return null;
    }
  }

  async signOut(): Promise<string | null> {
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
    return { data, error } as any as AuthResponse;
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
    return this.supabase.auth.signInWithPassword({ email, password });
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
