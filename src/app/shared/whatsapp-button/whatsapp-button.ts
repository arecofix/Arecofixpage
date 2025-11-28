import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.css'
})
export class WhatsappButton {
  @Input() phoneNumber: string = environment.contact.whatsappNumber;
  @Input() defaultMessage: string = 'Hola, necesito información';

  get encodedMessage(): string {
    return encodeURIComponent(this.defaultMessage);
  }
}