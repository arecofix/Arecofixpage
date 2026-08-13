import { Component, ChangeDetectionStrategy, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <!-- Chat Window -->
      <div *ngIf="isOpen()" 
           class="bg-white dark:bg-gray-800 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden mb-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 origin-bottom-right"
           style="height: 500px; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="bg-blue-600 dark:bg-blue-800 text-white p-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 class="font-bold text-sm">Arecofix Asistente</h3>
              <p class="text-xs text-blue-200">En línea</p>
            </div>
          </div>
          <button (click)="toggleChat()" class="text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div #scrollContainer class="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex flex-col gap-3">
          <div *ngFor="let msg of messages()" 
               class="max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm"
               [ngClass]="msg.isBot ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start border border-gray-100 dark:border-gray-700 rounded-tl-sm' : 'bg-blue-600 text-white self-end rounded-tr-sm'">
            {{ msg.text }}
          </div>
          <div *ngIf="isLoading()" class="self-start bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form (ngSubmit)="sendMessage()" class="flex items-center gap-2">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              name="userInput"
              placeholder="Escribe tu mensaje..." 
              class="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              [disabled]="isLoading()"
              autocomplete="off"
            >
            <button 
              type="submit" 
              class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              [disabled]="!userInput.trim() || isLoading()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Floating Button -->
      <button 
        *ngIf="!isOpen()"
        (click)="toggleChat()" 
        class="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent implements AfterViewChecked {
  private http = inject(HttpClient);

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([
    { text: '¡Hola! Soy el asistente virtual de Arecofix. ¿En qué te puedo ayudar hoy?', isBot: true }
  ]);
  isLoading = signal(false);
  userInput = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  toggleChat() {
    this.isOpen.update(val => !val);
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading()) return;

    const text = this.userInput.trim();
    this.userInput = '';
    
    this.messages.update(msgs => [...msgs, { text, isBot: false }]);
    this.isLoading.set(true);
    
    // Call AI backend
    this.http.post<{reply: string}>('https://ragchat-carreras.onrender.com/api/chat', { message: text })
      .subscribe({
        next: (res) => {
          this.messages.update(msgs => [...msgs, { text: res.reply || 'Recibí tu mensaje.', isBot: true }]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.messages.update(msgs => [...msgs, { text: 'Lo siento, hubo un error de conexión.', isBot: true }]);
          this.isLoading.set(false);
        }
      });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
