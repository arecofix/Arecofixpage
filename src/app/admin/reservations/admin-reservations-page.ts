import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '@app/core/services/contact.service';
import { Message } from '@app/features/customers/domain/entities/message.entity';

@Component({
  selector: 'app-admin-reservations-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reservations-page.html',
})
export class AdminReservationsPage implements OnInit {
  private contactService = inject(ContactService);
  reservations = signal<Message[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadReservations();
  }

  async loadReservations() {
    this.loading.set(true);
    try {
      const data = await this.contactService.getReservations();
      this.reservations.set(data);
    } catch (error) {
      console.error('Error loading reservations', error);
    } finally {
      this.loading.set(false);
    }
  }

  async markAsRead(id: string) {
    try {
      await this.contactService.markAsRead(id);
      this.reservations.update(msgs =>
        msgs.map(m => m.id === id ? { ...m, is_read: true } : m)
      );
    } catch (error) {
      console.error('Error marking as read', error);
    }
  }

  async deleteReservation(id: string) {
    if (!confirm('¿Estás seguro de eliminar este turno reservado?')) return;

    try {
      await this.contactService.deleteMessage(id);
      this.reservations.update(msgs => msgs.filter(m => m.id !== id));
    } catch (error) {
      alert('Error al eliminar la reserva');
      console.error('Error deleting reservation', error);
    }
  }
}
