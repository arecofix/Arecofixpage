import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '@app/core/services/contact.service';
import { Message } from '@app/features/customers/domain/entities/message.entity';

@Component({
  selector: 'app-admin-messages-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages-page.html',
})
export class AdminMessagesPage implements OnInit {
  private contactService = inject(ContactService);
  messages = signal<Message[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadMessages();
  }

  async loadMessages() {
    this.loading.set(true);
    try {
      const data = await this.contactService.getMessages();
      this.messages.set(data);
    } catch (error) {
      console.error('Error loading messages', error);
    } finally {
      this.loading.set(false);
    }
  }

  async markAsRead(id: string) {
    try {
      await this.contactService.markAsRead(id);
      this.messages.update(msgs =>
        msgs.map(m => m.id === id ? { ...m, is_read: true } : m)
      );
    } catch (error) {
      console.error('Error marking as read', error);
    }
  }

  async deleteMessage(id: string) {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    try {
      await this.contactService.deleteMessage(id);
      this.messages.update(msgs => msgs.filter(m => m.id !== id));
    } catch (error) {
      alert('Error al eliminar el mensaje');
      console.error('Error deleting message', error);
    }
  }
}
