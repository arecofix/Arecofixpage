import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { LoggerService } from '../core/services/logger.service';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  role?: 'user' | 'admin' | 'staff';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private router = inject(Router);
  private logger = inject(LoggerService);
  private authState = new BehaviorSubject<{ user: User | null; session: Session | null }>({
    user: null,
    session: null,
  });

  public authState$ = this.authState.asObservable();

  constructor() {

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initializeAuth();
  }

  private initializeAuth() {
    // Set up auth state listener
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        this.authState.next({
          user: session.user,
          session: session,
        });
      } else {
        this.authState.next({
          user: null,
          session: null,
        });
      }
    });
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }
    this.authState.next({
      user: data.user,
      session: data.session,
    });

    // Perfil: gestión 100% lado Supabase. No realizar upsert desde el cliente.
    // Eliminado bloque de ensure-profile tras login.

    return { user: data.user, session: data.session };
  }

  // Complete sign up with profile information
  async signUp(
    email: string,
    password: string,
    profile?: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      phone?: string;
    }
  ): Promise<AuthResponse> {
    try {
      // 1. Create Auth User
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: environment.authRedirectUrl,
          // We still send metadata just in case, but we don't rely on the trigger anymore
          data: profile ? {
            ...profile,
            display_name: (profile.display_name ?? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()) || null,
          } : undefined,
        },
      });

      if (error) {
        this.logger.error('Supabase signUp error', error);
        return { user: null, session: null, error: error.message };
      }

      // 2. Manually Create Profile (Client-side)
      if (data.user && profile) {
        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          display_name: profile.display_name || `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone,
          full_name: `${profile.first_name} ${profile.last_name}`,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        const { error: profileError } = await this.supabase
          .from('profiles')
          .insert(userProfile);

        if (profileError) {
          this.logger.error('Error creating profile manually', profileError);
          // We don't fail the whole signup if profile fails, but we log it.
        }
      }

      this.authState.next({
        user: data.user,
        session: data.session,
      });

      return { user: data.user, session: data.session };

    } catch (e: any) {
      this.logger.error('Unexpected error during signup', e);
      return { user: null, session: null, error: e.message || 'Unknown error' };
    }
  }

  async signOut(): Promise<string | null> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      return error.message;
    }
    this.authState.next({
      user: null,
      session: null,
    });
    return null;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      this.logger.error('Error fetching profile', error);
      return null;
    }

    return data as UserProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      this.logger.error('Error updating profile', error);
      return null;
    }

    return data as UserProfile;
  }

  async resetPassword(email: string): Promise<string | null> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: environment.authRedirectUrl,
    });
    return error ? error.message : null;
  }

  // Additional utility methods
  isAuthenticated(): boolean {
    return this.authState.value.user !== null;
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  getCurrentSession(): Session | null {
    return this.authState.value.session;
  }

  getAuthState$(): Observable<{ user: User | null; session: Session | null }> {
    return this.authState.asObservable();
  }

  async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1);

      this.logger.debug('Database connection test', { data, error });
      return !error;
    } catch (err) {
      this.logger.error('Database connection test failed', err);
      return false;
    }
  }

  async updatePassword(newPassword: string): Promise<string | null> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    return error ? error.message : null;
  }

  async updateEmail(newEmail: string): Promise<string | null> {
    const { error } = await this.supabase.auth.updateUser({
      email: newEmail,
    });
    return error ? error.message : null;
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: environment.authRedirectUrl,
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: null, session: null };
  }

  async signInWithGithub(): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: environment.authRedirectUrl,
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: null, session: null };
  }

  async verifyOTP(email: string, token: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    this.authState.next({
      user: data.user,
      session: data.session,
    });

    return { user: data.user, session: data.session };
  }

  async sendMagicLink(email: string): Promise<string | null> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: environment.authRedirectUrl,
      },
    });

    return error ? error.message : null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      return !error && data !== null;
    } catch (err) {
      return false;
    }
  }

  async deleteAccount(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) {
      return 'No user is currently authenticated';
    }

    // First delete the profile
    const { error: profileError } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      return profileError.message;
    }

    // Then delete the auth user
    // Note: supabase.auth.admin is not available on the client side with anon key.
    // This needs to be done via a secure backend endpoint or Edge Function.
    // const { error: authError } = await this.supabase.auth.admin.deleteUser(user.id);

    // if (authError) {
    //   return authError.message;
    // }

    this.logger.warn('Account deletion requires backend implementation');

    // Sign out
    await this.signOut();

    return null;
  }

  async refreshSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.refreshSession();

    if (error) {
      this.logger.error('Error refreshing session', error);
      return null;
    }

    if (data.session?.user) {
      this.authState.next({
        user: data.session.user,
        session: data.session,
      });
    }

    return data.session;
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}
