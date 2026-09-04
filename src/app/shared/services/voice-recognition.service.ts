import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  private readonly platformId = inject(PLATFORM_ID);
  
  public isListening = signal<boolean>(false);
  public transcript = signal<string>('');
  public error = signal<string | null>(null);

  private recognition: any;
  private isSupported = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.isSupported = true;
        this.recognition = new SpeechRec();
        this.recognition.lang = 'es-AR';
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListening.set(true);
          this.error.set(null);
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          this.transcript.set(finalTranscript || interimTranscript);
        };

        this.recognition.onerror = (event: any) => {
          this.isListening.set(false);
          let msg = 'Error en reconocimiento de voz';
          if (event.error === 'not-allowed') {
            msg = 'Permiso de micrófono denegado. Por favor, habilitalo en tu navegador.';
          } else if (event.error === 'no-speech') {
            // 'no-speech' is common if user doesn't say anything, it's not always a hard error.
            msg = 'No se detectó audio.';
          }
          this.error.set(msg);
        };

        this.recognition.onend = () => {
          this.isListening.set(false);
        };
      }
    }
  }

  public get supported(): boolean {
    return this.isSupported;
  }

  public start(options: { continuous?: boolean } = {}): void {
    if (!this.isSupported) {
      this.error.set('Tu navegador no soporta dictado por voz.');
      return;
    }
    
    // Stop if already running to restart with new config
    if (this.isListening()) {
      this.stop();
    }
    
    this.recognition.continuous = options.continuous ?? false;
    this.transcript.set('');
    this.error.set(null);
    
    try {
      this.recognition.start();
    } catch (e) {
      console.error(e);
    }
  }

  public stop(): void {
    if (!this.isSupported) return;
    try {
      this.recognition.stop();
    } catch(e) {}
  }
}
