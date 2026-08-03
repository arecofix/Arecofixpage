import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationCalendar } from '@app/public/reservation/reservation-calendar';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-standalone-reservation',
  standalone: true,
  imports: [CommonModule, ReservationCalendar, RouterModule],
  templateUrl: './standalone-reservation.component.html'
})
export class StandaloneReservationComponent {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Reserva de Turno | Arecofix');
  }
}
