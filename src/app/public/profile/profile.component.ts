import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
})
export class ProfileComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: UserProfile | null = null;
  loading = false;
  saving = false;
  error = '';
  success = '';
  isEditing = false;
  isLoggedIn = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9\-\+\s\(\)]*$/)]],
      bio: ['', [Validators.maxLength(500)]],
      avatar_url: [''],
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.cdr.markForCheck();
    try {
      const currentUser = await this.authService.getUser();
      this.isLoggedIn = !!currentUser;
      if (!currentUser) {
        // No redirigimos, mostramos pantalla de invitación a registrarse
        this.user = null;
        return;
      }

      const profile = await this.authService.getUserProfile(currentUser.id);
      if (profile) {
        this.user = profile;
        this.form.patchValue(profile);
      }
    } catch (err) {
      this.error = 'Error al cargar el perfil.';
      console.error('Profile load error:', err);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
    
    // Safety timeout
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = 'Tiempo de espera agotado al cargar el perfil.';
        this.cdr.markForCheck();
      }
    }, 5000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async handleLogout() {
    const error = await this.authService.signOut();
    if (error) {
      this.error = error;
      this.cdr.markForCheck();
      return;
    }
    this.router.navigate(['/login']);
  }

  async updateProfile() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.error = 'Por favor completa correctamente los campos.';
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();
    try {
      const currentUser = await this.authService.getUser();
      if (!currentUser) {
        // No hay sesión, mostramos error y sugerimos iniciar sesión
        this.saving = false;
        this.error = 'Necesitas iniciar sesión para actualizar tu perfil.';
        this.cdr.markForCheck();
        return;
      }

      const profileData = {
        first_name: this.form.get('first_name')?.value,
        last_name: this.form.get('last_name')?.value,
        phone: this.form.get('phone')?.value,
        bio: this.form.get('bio')?.value,
        avatar_url: this.form.get('avatar_url')?.value,
      };

      const updated = await this.authService.updateUserProfile(currentUser.id, profileData);
      this.saving = false;

      if (updated) {
        this.user = updated;
        this.success = 'Perfil actualizado exitosamente.';
        this.isEditing = false;
      } else {
        this.error = 'Error al actualizar el perfil.';
      }
      this.cdr.markForCheck();
    } catch (err) {
      this.saving = false;
      this.error = 'Error al actualizar el perfil.';
      console.error('Profile update error:', err);
      this.cdr.markForCheck();
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.form.patchValue(this.user);
    }
    this.cdr.markForCheck();
  }

  resetForm() {
    if (this.user) {
      this.form.patchValue(this.user);
      this.isEditing = false;
      this.cdr.markForCheck();
    }
  }
}
