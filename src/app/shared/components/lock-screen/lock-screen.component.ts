import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InactivityService } from '@app/core/services/inactivity.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lock-screen.component.html',
})
export class LockScreenComponent implements OnInit {
  private inactivityService = inject(InactivityService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public isLocked$ = this.inactivityService.isLocked$;
  public userEmail = '';
  public userInitial = '';
  public error = '';
  public loading = false;

  public unlockForm = this.fb.group({
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    this.inactivityService.isLocked$.subscribe(locked => {
      if (locked) {
        const user = this.authService.getCurrentUser();
        this.userEmail = user?.email || '';
        this.userInitial = this.userEmail ? this.userEmail.charAt(0).toUpperCase() : '?';
        this.unlockForm.reset();
        this.error = '';
      }
    });
  }

  async onUnlock() {
    if (this.unlockForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      const password = this.unlockForm.value.password!;
      
      if (!this.userEmail) {
         this.error = 'No se encontró un usuario activo para verificar.';
         this.loading = false;
         return;
      }

      const response = await this.authService.signIn(this.userEmail, password);
      
      if (response.error) {
         this.error = 'Contraseña incorrecta.';
      } else {
         this.inactivityService.unlock();
      }
    } catch (e) {
      this.error = 'Error de conexión. Intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  // Si el usuario quiere forzar el cierre de sesión en vez de desbloquear
  async forceLogout() {
    this.inactivityService.unlock();
    await this.authService.signOut();
    // La redirección está manejada probablemente en el authService / admin-layout o requiere reload
    window.location.href = '/login';
  }
}
