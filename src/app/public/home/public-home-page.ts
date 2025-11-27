import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ReservationCalendar } from '../reservation/reservation-calendar';
import { DataService, Producto, Categoria } from '../../services/data';

@Component({
  selector: 'app-public-home-page',
  imports: [ReservationCalendar],
  templateUrl: './public-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage {
  title: string = 'Soluciones Integrales en Tecnología - Arecofix';

  message: string =
    'Expertos en reparación de celulares y computadoras. Encuentra también el catálogo más completo de repuestos, accesorios y equipamiento IT en un solo lugar.';
}