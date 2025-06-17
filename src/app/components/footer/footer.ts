import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
userEmail: string = '';

subscribe() {
  if (this.userEmail) {
    console.log('Email enviado:', this.userEmail);
    // Lógica real: enviar a API, mostrar mensaje, etc.
  }
}

}
