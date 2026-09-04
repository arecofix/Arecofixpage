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
import { ChatbotService, ChatSource } from '../services/chatbot.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { effect } from '@angular/core';

// ── Tipos locales ─────────────────────────────────────────────────────────────

type MessageType = 'text' | 'whatsapp-btn' | 'streaming' | 'error';

interface ChatMessage {
  from: 'user' | 'bot';
  type: MessageType;
  text: string;
  /** Fuentes RAG adjuntas a este mensaje (solo mensajes bot) */
  sources?: ChatSource[];
  /** Indica si el acordeón de fuentes está expandido */
  isSourcesExpanded?: boolean;
  /** Indica si este bubble aún está recibiendo tokens (streaming activo) */
  isStreaming?: boolean;
}

interface QuickOption {
  label: string;
  /** Si tiene question, delega al RAG; si tiene response, responde directo */
  question?: string;
  response?: ChatMessage;
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
  private readonly chatbot = inject(ChatbotService);
  public readonly voiceService = inject(VoiceRecognitionService);

  @ViewChild('chatBody') chatBodyRef!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  inputText = signal('');
  inputError = signal('');
  showQuickOptions = signal(true);

  /** Expone el estado de carga/streaming del servicio a la template */
  readonly isLoading = this.chatbot.loading;
  readonly isStreaming = this.chatbot.streaming;
  readonly serviceError = this.chatbot.error;

  readonly waUrl = WA_URL;
  readonly waCelularUrl = WA_CELULAR_URL;

  // Estado para la voz
  private textBeforeDictation = '';

  constructor() {
    // Sincronizar el transcrito con el input text
    effect(() => {
      const transcript = this.voiceService.transcript();
      const isListening = this.voiceService.isListening();
      
      if (isListening) {
        // Mientras escucha, combinamos el texto anterior con el nuevo transcrito
        const newText = (this.textBeforeDictation + ' ' + transcript).trim();
        this.inputText.set(newText);
      }
    });

    // Mostrar errores del servicio de voz en el inputError del chat
    effect(() => {
      const voiceErr = this.voiceService.error();
      if (voiceErr) {
        this.showError(voiceErr);
      }
    });
  }

  readonly isCelularRoute = computed(() => this.currentUrl() === '/celular');

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** Opciones rápidas: las RAG-aware delegan al Worker, las directas responden local */
  readonly quickOptions: QuickOption[] = [
    {
      label: '🔧 ¿Qué servicios ofrecen?',
      question: '¿Qué servicios de reparación ofrecen en Arecofix?',
    },
    {
      label: '📦 ¿Tienen productos en stock?',
      question: '¿Qué productos tienen disponibles actualmente?',
    },
    {
      label: '📚 ¿Tienen cursos disponibles?',
      question: '¿Qué cursos o capacitaciones ofrece la academia Arecofix?',
    },
    {
      label: '💬 Contactar por WhatsApp',
      response: {
        from: 'bot',
        type: 'whatsapp-btn',
        text: 'Para una atención rápida y personalizada, escribinos directamente por WhatsApp:',
      },
    },
  ];

  private errorTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldScroll = false;

  ngOnInit(): void {
    this.messages.set([
      {
        from: 'bot',
        type: 'text',
        text: '¡Hola! Soy el asistente inteligente de Arecofix. Puedo ayudarte con consultas sobre productos, servicios, manuales técnicos y más. ¿En qué te puedo ayudar?',
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

  toggleSources(index: number): void {
    this.messages.update((msgs) => {
      const updated = [...msgs];
      if (updated[index] && updated[index].sources) {
        updated[index] = {
          ...updated[index],
          isSourcesExpanded: !updated[index].isSourcesExpanded
        };
      }
      return updated;
    });
    setTimeout(() => this.scrollToBottom(), 50);
  }

  private scrollToBottom(): void {
    this.shouldScroll = true;
  }

  toggleChat(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.shouldScroll = true;
    } else {
      // Limpiar historial al cerrar para empezar fresco la próxima vez
      // Comentar esta línea si preferís persistir la conversación
      this.chatbot.clearHistory();
      this.voiceService.stop();
    }
  }

  onInputChange(value: string): void {
    this.inputText.set(value);
    // Si el usuario tipea manualmente, actualizamos el texto base por si luego dicta
    if (!this.voiceService.isListening()) {
      this.textBeforeDictation = value;
    }
  }

  toggleVoiceDictation(): void {
    if (this.voiceService.isListening()) {
      this.voiceService.stop();
    } else {
      this.textBeforeDictation = this.inputText();
      this.voiceService.start({ continuous: false });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  selectOption(option: QuickOption): void {
    this.showQuickOptions.set(false);

    // Opción con respuesta directa (ej. WhatsApp)
    if (option.response) {
      this.messages.update((msgs) => [
        ...msgs,
        { from: 'user', type: 'text', text: option.label },
        option.response!,
      ]);
      this.shouldScroll = true;
      return;
    }

    // Opción que consulta al RAG
    if (option.question) {
      this.dispatchToRag(option.question, option.label);
    }
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
    if (this.isLoading() || this.isStreaming()) return;

    this.inputText.set('');
    this.showQuickOptions.set(false);
    this.dispatchToRag(raw);
  }

  /**
   * Envía una pregunta al Worker RAG y muestra la respuesta en streaming.
   * @param question Texto de la pregunta para el Worker
   * @param displayText Texto visible en el bubble de usuario (si difiere de question)
   */
  private dispatchToRag(question: string, displayText?: string): void {
    // 1. Agregar mensaje del usuario
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'user', type: 'text', text: displayText ?? question },
    ]);
    this.shouldScroll = true;

    // 2. Agregar bubble del bot en estado streaming (vacío al inicio)
    const streamingBubbleIndex = this.messages().length;
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'bot', type: 'streaming', text: '', isStreaming: true },
    ]);

    // 3. Llamar al Worker RAG con SSE
    this.chatbot.askStream(question, {
      onToken: (chunk) => {
        // Acumular tokens en el bubble de streaming
        this.messages.update((msgs) => {
          const updated = [...msgs];
          const bubble = updated[streamingBubbleIndex];
          if (bubble) {
            updated[streamingBubbleIndex] = { ...bubble, text: bubble.text + chunk };
          }
          return updated;
        });
        this.shouldScroll = true;
      },

      onSources: (sources) => {
        // Desduplicar fuentes usando un Set para los títulos
        const uniqueSources: ChatSource[] = [];
        const seenTitles = new Set<string>();
        for (const src of sources) {
          if (!seenTitles.has(src.title)) {
            seenTitles.add(src.title);
            uniqueSources.push(src);
          }
        }

        // Adjuntar fuentes al bubble cuando llegan
        this.messages.update((msgs) => {
          const updated = [...msgs];
          const bubble = updated[streamingBubbleIndex];
          if (bubble) {
            updated[streamingBubbleIndex] = { ...bubble, sources: uniqueSources };
          }
          return updated;
        });
      },

      onDone: () => {
        // Marcar el bubble como completo (deja de mostrar cursor)
        this.messages.update((msgs) => {
          const updated = [...msgs];
          const bubble = updated[streamingBubbleIndex];
          if (bubble) {
            updated[streamingBubbleIndex] = {
              ...bubble,
              type: 'text',
              isStreaming: false,
            };
          }
          return updated;
        });
        this.shouldScroll = true;
      },

      onError: (msg) => {
        // Reemplazar el bubble de streaming por un mensaje de error
        this.messages.update((msgs) => {
          const updated = [...msgs];
          updated[streamingBubbleIndex] = {
            from: 'bot',
            type: 'error',
            text: msg,
            isStreaming: false,
          };
          return updated;
        });
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
    if (this.errorTimer) clearTimeout(this.errorTimer);
  }
}
