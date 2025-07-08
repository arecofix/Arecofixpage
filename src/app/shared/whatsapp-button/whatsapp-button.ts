import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.css'
})
export class WhatsappButton {
  @Input() phoneNumber: string = '5491125960900'; // Tu número aquí
  @Input() defaultMessage: string = 'Hola, necesito información';

  get encodedMessage(): string {
    return encodeURIComponent(this.defaultMessage);
  }
}