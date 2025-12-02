import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ReservationCalendar } from '../reservation/reservation-calendar';
import { DataService, Producto, Categoria } from '../../services/data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-home-page',
  imports: [ReservationCalendar],
  templateUrl: './public-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage {
  title: string = 'Soluciones Integrales en Tecnología - Arecofix';
  whatsappNumber = environment.contact.whatsappNumber;
  googleMapsLink = environment.contact.socialMedia.googleMaps;

  message: string =
    'Expertos en reparación de celulares y computadoras. Encuentra también el catálogo más completo de repuestos, accesorios y equipamiento IT en un solo lugar.';
}