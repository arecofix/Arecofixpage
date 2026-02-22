import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule, NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
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

  shareOn(platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin') {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('¡Mira esta página de Arecofix!');
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }
}