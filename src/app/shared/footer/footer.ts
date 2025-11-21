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
}