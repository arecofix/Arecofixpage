import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer'; //
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button'; // <-- Sin .component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Footer,
    WhatsappButton,
  ],
  templateUrl: './app.html'
})
export class App {}