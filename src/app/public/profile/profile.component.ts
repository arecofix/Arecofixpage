import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { FavoritesService } from '@app/shared/services/favorites.service';
import { CartService } from '@app/shared/services/cart.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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

  public favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
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

      const updated = await this.authService.updateUserProfile(
        currentUser.id,
        profileData,
      );
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

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  removeFavorite(productId: string) {
    this.favoritesService.removeFavorite(productId);
  }

  async generateReferralCode() {
    if (!this.user) return;

    // Si ya tiene código, no generamos uno nuevo
    if (this.user.referral_code) {
      this.success = 'Tu código de referido es: ' + this.user.referral_code;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    try {
      const prefix = (this.user.first_name || 'AFX')
        .substring(0, 3)
        .toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newCode = `${prefix}${randomNum}`;

      const updated = await this.authService.updateUserProfile(this.user.id, {
        referral_code: newCode,
      });

      this.loading = false;
      if (updated) {
        this.user = updated;
        this.success =
          '¡Código generado exitosamente! Tu código es: ' + newCode;
      } else {
        this.error = 'Error al generar el código de referido.';
      }
      this.cdr.markForCheck();
    } catch (err) {
      this.loading = false;
      this.error = 'Error al generar el código de referido.';
      this.cdr.markForCheck();
    }
  }
}
