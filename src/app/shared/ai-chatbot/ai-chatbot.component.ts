import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

interface ApiResponse {
  query: string;
  output: string;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatbotComponent implements AfterViewChecked, OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  private readonly API_URL = 'https://ragchat-carreras.onrender.com/generate-api';
  private readonly TOP_K = 5;

  @ViewChild('chatBody') chatBodyRef!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  inputText = signal('');
  isLoading = signal(false);
  inputError = signal('');

  private errorTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldScroll = false;

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.chatBodyRef) {
      const el = this.chatBodyRef.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen.update((v) => !v);
  }

  onInputChange(value: string): void {
    this.inputText.set(value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const raw = this.inputText().trim();

    if (!raw) {
      this.showError('Por favor, escribí un mensaje.');
      return;
    }
    if (raw.length < 3) {
      this.showError('El mensaje es demasiado corto.');
      return;
    }
    if (raw.length > 500) {
      this.showError('El mensaje es demasiado largo (máx. 500 caracteres).');
      return;
    }

    // Add user message
    this.messages.update((msgs) => [...msgs, { from: 'user', text: raw }]);
    this.inputText.set('');
    this.isLoading.set(true);
    this.shouldScroll = true;

    this.http
      .post<ApiResponse>(this.API_URL, { query: raw, top_k: this.TOP_K })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messages.update((msgs) => [
            ...msgs,
            { from: 'bot', text: res.output ?? 'Sin respuesta.' },
          ]);
          this.isLoading.set(false);
          this.shouldScroll = true;
        },
        error: () => {
          this.messages.update((msgs) => [
            ...msgs,
            {
              from: 'bot',
              text: 'Lo siento, tuve un problema al conectarme. Intentá de nuevo.',
            },
          ]);
          this.isLoading.set(false);
          this.shouldScroll = true;
        },
      });
  }

  private showError(msg: string): void {
    this.inputError.set(msg);
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => this.inputError.set(''), 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.errorTimer) clearTimeout(this.errorTimer);
  }
}
