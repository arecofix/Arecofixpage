import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../core/services/ai-agent.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrls: ['./ai-assistant.css'],
})
export class AiAssistant implements AfterViewChecked {
  aiService = inject(AiAgentService);
  
  isOpen = signal(false);
  userInput = signal('');
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen() && !this.aiService.modelLoaded()) {
      this.aiService.initModel();
    }
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;
    
    this.aiService.sendMessage(text);
    this.userInput.set('');
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
