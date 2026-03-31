import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappButton {
  phoneNumber = input<string>(environment.contact.whatsappNumber);
  defaultMessage = input<string>('Hola, necesito información');

  encodedMessage = computed(() => encodeURIComponent(this.defaultMessage()));
  
  whatsappUrl = computed(() => `https://wa.me/${this.phoneNumber()}?text=${this.encodedMessage()}`);
}