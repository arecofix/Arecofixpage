import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  email: string = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

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
  shareOn(platform: string) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('¡Mira este sitio increíble de Arecofix!');
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }
}