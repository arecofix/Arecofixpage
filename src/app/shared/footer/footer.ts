import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.css',
})
export class Footer {
  email: string = '';
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Exposed configuration
  socialLinks = environment.contact.socialMedia;
  whatsappNumber = environment.contact.whatsappNumber;
  currentYear = new Date().getFullYear();

  constructor(private preferencesService: PreferencesService) {}

  openAccessibilityMenu(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.preferencesService.toggleSidebar();
  }

  subscribe() {
    if (!this.email) {
      this.errorMessage = 'Por favor, ingresa un email válido.';
      this.successMessage = '';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulación de subscripción async (reemplazar con servicio real)
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = '¡Gracias por suscribirte!';
      this.email = '';
    }, 1500);
  }
}
