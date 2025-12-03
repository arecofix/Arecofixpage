import { Injectable, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Auth Helper Service
 * Proporciona funciones de utilidad para operaciones comunes de autenticación
 * 
 * Ejemplo de uso en componentes:
 * 
 * export class MyComponent {
 *   constructor(private authHelper: AuthHelperService) {}
 *   
 *   async logout() {
 *     await this.authHelper.logout();
 *   }
 * }
 */

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  private authState$ = new BehaviorSubject<AuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    this.authService.authState$.subscribe(state => {
      this.authState$.next({
        isLoading: false,
        isAuthenticated: !!state.user,
        user: state.user,
        error: null,
      });
    });
  }

  /**
   * Observable del estado de autenticación
   * Usa en componentes con: authHelper.getAuthState$() | async
   */
  getAuthState$(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  /**
   * Observable: true si el usuario está autenticado
   */
  isAuthenticated$(): Observable<boolean> {
    return this.getAuthState$().pipe(
      map(state => state.isAuthenticated)
    );
  }

  /**
   * Observable: usuario actual
   */
  getCurrentUser$(): Observable<any | null> {
    return this.getAuthState$().pipe(
      map(state => state.user)
    );
  }

  /**
   * Login simple
   * @param email Email del usuario
   * @param password Contraseña
   * @returns Promise con el resultado
   */
  async login(email: string, password: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.authService.signIn(email, password);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      // Opcional: Redirigir al dashboard
      // this.router.navigate(['/dashboard']);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    }
  }

  /**
   * Registro de nuevo usuario
   * @param userData Datos del usuario a registrar
   * @returns Promise con el resultado
   */
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Validar que el email no exista
      const emailExists = await this.authService.checkEmailExists(userData.email);
      if (emailExists) {
        return { success: false, error: 'Este email ya está registrado' };
      }

      const response = await this.authService.signUp(
        userData.email,
        userData.password,
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          display_name: `${userData.first_name} ${userData.last_name}`,
        }
      );

      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  }

  /**
   * Logout - Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getCurrentUserProfile() {
    const user = this.authService.getCurrentUser();
    if (!user) return null;

    return await this.authService.getUserProfile(user.id);
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(profileData: any): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        return { success: false, error: 'No user authenticated' };
      }

      const result = await this.authService.updateUserProfile(user.id, profileData);

      if (!result) {
        return { success: false, error: 'Failed to update profile' };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  }

  /**
   * Recuperar contraseña
   */
  async resetPassword(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const error = await this.authService.resetPassword(email);

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Reset failed' };
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(newPassword: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const error = await this.authService.updatePassword(newPassword);

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Password change failed' };
    }
  }

  /**
   * Cambiar email
   */
  async changeEmail(newEmail: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const error = await this.authService.updateEmail(newEmail);

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Email change failed' };
    }
  }

  /**
   * Eliminar cuenta del usuario
   */
  async deleteAccount(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const error = await this.authService.deleteAccount();

      if (error) {
        return { success: false, error };
      }

      this.router.navigate(['/login']);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Account deletion failed' };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  /**
   * Refrescar sesión
   */
  async refreshSession(): Promise<boolean> {
    const session = await this.authService.refreshSession();
    return !!session;
  }
}
