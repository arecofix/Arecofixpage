import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { Message } from '@app/features/customers/domain/entities/message.entity';

@Component({
  selector: 'app-admin-messages-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages-page.html',
})
export class AdminMessagesPage implements OnInit {
  private auth = inject(AuthService);
  messages = signal<Message[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadMessages();
  }

  async loadMessages() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      this.messages.set(data);
    }
    this.loading.set(false);
  }

  async markAsRead(id: string) {
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      this.messages.update(msgs =>
        msgs.map(m => m.id === id ? { ...m, is_read: true } : m)
      );
    }
  }

  async deleteMessage(id: string) {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);

    if (!error) {
      this.messages.update(msgs => msgs.filter(m => m.id !== id));
    } else {
      alert('Error al eliminar el mensaje');
    }
  }
}
