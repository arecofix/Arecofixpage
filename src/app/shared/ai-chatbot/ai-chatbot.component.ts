import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  computed,
  ViewChild,
  AfterViewChecked,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

type MessageType = 'text' | 'whatsapp-btn';

interface ChatMessage {
  from: 'user' | 'bot';
  type: MessageType;
  text: string;
}

interface QuickOption {
  label: string;
  response: ChatMessage;
}

const WA_NUMBER = '541125960900';
const WA_URL = `https://wa.me/${WA_NUMBER}`;
const WA_CELULAR_URL = `https://wa.me/${WA_NUMBER}?text=Hola,%20necesito%20consultar%20por%20la%20reparaci%C3%B3n%20de%20un%20celular`;

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  private readonly router = inject(Router);

  @ViewChild('chatBody') chatBodyRef!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  inputText = signal('');
  inputError = signal('');
  showQuickOptions = signal(true);

  readonly waUrl = WA_URL;
  readonly waCelularUrl = WA_CELULAR_URL;

  /** true cuando la ruta actual es exactamente /celular */
  readonly isCelularRoute = computed(() => this.currentUrl() === '/celular');

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly quickOptions: QuickOption[] = [
    {
      label: '💬 Contactarse / WhatsApp',
      response: {
        from: 'bot',
        type: 'whatsapp-btn',
        text: 'Para una atención rápida y personalizada, escribinos directamente por WhatsApp:',
      },
    },
    {
      label: '📍 ¿Dónde están ubicados?',
      response: {
        from: 'bot',
        type: 'text',
        text: 'Nuestro taller está ubicado en Jorge Newbery 69, Marcos Paz, Buenos Aires. ¡Te esperamos!',
      },
    },
    {
      label: '🔧 ¿Qué servicios ofrecen?',
      response: {
        from: 'bot',
        type: 'text',
        text: 'Nos especializamos en microelectrónica, reparación de celulares, tablets y notebooks. Cambios de módulo, pines de carga, y diagnóstico de placas.',
      },
    },
  ];

  private errorTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldScroll = false;

  ngOnInit(): void {
    // Mensaje de bienvenida automático
    this.messages.set([
      {
        from: 'bot',
        type: 'text',
        text: '¡Hola! Bienvenido a Arecofix. ¿En qué te puedo ayudar hoy?',
      },
    ]);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.chatBodyRef) {
      const el = this.chatBodyRef.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.shouldScroll = true;
    }
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

  selectOption(option: QuickOption): void {
    // Mostrar la opción elegida como mensaje del usuario
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'user', type: 'text', text: option.label },
    ]);
    // Ocultar botones de opciones rápidas después de elegir
    this.showQuickOptions.set(false);
    // Respuesta inmediata del bot
    this.messages.update((msgs) => [...msgs, option.response]);
    this.shouldScroll = true;
  }

  sendMessage(): void {
    const raw = this.inputText().trim();

    if (!raw) {
      this.showError('Por favor, escribí un mensaje.');
      return;
    }
    if (raw.length < 2) {
      this.showError('El mensaje es demasiado corto.');
      return;
    }

    // Agrega mensaje del usuario
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'user', type: 'text', text: raw },
    ]);
    this.inputText.set('');
    this.showQuickOptions.set(false);
    this.shouldScroll = true;

    // Respuesta genérica con botón de WhatsApp
    this.messages.update((msgs) => [
      ...msgs,
      {
        from: 'bot',
        type: 'whatsapp-btn',
        text: '¡Hola! Para poder brindarte un presupuesto exacto y una mejor atención, contactanos directamente por WhatsApp:',
      },
    ]);
    this.shouldScroll = true;
  }

  private showError(msg: string): void {
    this.inputError.set(msg);
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => this.inputError.set(''), 3000);
  }

  ngOnDestroy(): void {
    if (this.errorTimer) clearTimeout(this.errorTimer);
  }
}
