import { Injectable, inject, PLATFORM_ID } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  private platformId = inject(PLATFORM_ID);
  private profileService = inject(ProfileService);
  private tenantService = inject(TenantService);

  private authState = new BehaviorSubject<{
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
  }>({
    session: null,
    user: null,
    profile: null,
  });

  public authState$ = this.authState.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }

  private async initAuth() {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    if (session) {
      const profile = await this.profileService.getProfile(session.user.id);
      this.authState.next({ session, user: session.user, profile });
    }

    this.supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          const profile = await this.profileService.getProfile(session.user.id);
          this.authState.next({ session, user: session.user, profile });
        } else {
          this.authState.next({ session: null, user: null, profile: null });
        }
      },
    );
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
  async signInWithGoogle(): Promise<any> {
    const response = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: environment.authRedirectUrl },
    });
    return response;
  }

  async signInWithFacebook(): Promise<any> {
    const response = await this.supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: environment.authRedirectUrl },
    });
    return response;
  }

  async signInWithGithub(): Promise<any> {
    const response = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: environment.authRedirectUrl },
    });
    return response;
  }

  async signIn(email: string, password: string): Promise<any> {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(
    email: string,
    password: string,
    profileData: Partial<UserProfile>,
  ): Promise<any> {
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

  // Auth specific utilities
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
}
