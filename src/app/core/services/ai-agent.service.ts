import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// import { CreateMLCEngine, MLCEngine, InitProgressCallback } from "@mlc-ai/web-llm"; // Removed static import

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  private platformId = inject(PLATFORM_ID);
  private engine: any | null = null; // Type 'any' because strict type is not available without static import
  
  // Signals for UI State
  isLoadingModel = signal(false);
  isGenerating = signal(false);
  loadingProgress = signal('');
  modelLoaded = signal(false);
  
  // Full conversation history (for LLM context)
  messages = signal<ChatMessage[]>([]);

  // Visible messages for UI (filters out system prompts and tool outputs)
  visibleMessages = computed(() => 
    this.messages().filter(m => m.role !== 'system')
  );

  // Default model - Using Phi-3-mini-4k-instruct which is efficient for browser
  private selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC"; 

  constructor() {}

  async initModel() {
    if (!isPlatformBrowser(this.platformId)) {
        console.warn('AI Model cannot be initialized on server');
        return;
    }

    if (this.modelLoaded()) return;

    this.isLoadingModel.set(true);
    
    // Dynamic import to avoid SSR crashes
    try {
        const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
        
        const initProgressCallback = (report: { text: string }) => {
            this.loadingProgress.set(report.text);
        };

        this.engine = await CreateMLCEngine(
            this.selectedModel,
            { initProgressCallback }
        );
        this.modelLoaded.set(true);
        this.isLoadingModel.set(false);
        
        this.initializeSystemPrompt();

    } catch (error) {
      console.error("Failed to load model", error);
      this.isLoadingModel.set(false);
      this.loadingProgress.set("Error loading model: " + error);
    }
  }

  private initializeSystemPrompt() {
      // System Prompt with MCP capabilities definition
      this.messages.set([
        { role: 'system', content: `You are Arecofix AI Assistant. You help users with IT support, phone repairs, and website quotes.
        
        You have access to the following tools (simulated MCP):
        - get_repair_status(trackingId): Check repair status.
        - list_services(): Show available services.
        - book_appointment(serviceType, date): Schedule a repair.
        
        When a user asks something that requires a tool, reply with a JSON object strictly in this format:
        {"tool": "tool_name", "args": { ... }}
        
        Answer normally if no tool is needed. Keep responses concise and helpful.` }
      ]);
  }

  async sendMessage(text: string) {
    if (!this.engine) {
        await this.initModel();
        if (!this.engine) {
             this.messages.update(msgs => [...msgs, { role: 'assistant', content: "Error crítico: El modelo IA no pudo cargarse. Verifica que tu navegador soporte WebGPU." }]);
             return;
        }
    }

    this.isGenerating.set(true);
    
    // Add user message
    const userMsg: ChatMessage = { role: 'user', content: text };
    this.messages.update(msgs => this.limitHistory([...msgs, userMsg]));

    try {
      const reply = await this.generateResponse();
      const responseContent = reply.choices[0].message.content || "";
      
      this.handleResponse(responseContent);

    } catch (error) {
      console.error("Chat error", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.messages.update(msgs => [...msgs, { role: 'assistant', content: `Lo siento, hubo un error técnico: ${errorMsg}. Por favor intenta de nuevo.` }]);
    } finally {
      this.isGenerating.set(false);
    }
  }

  private async generateResponse() {
    const history = this.messages().map(m => ({ role: m.role, content: m.content }));
    return await this.engine!.chat.completions.create({
        messages: history as any
    });
  }

  private async handleResponse(content: string) {
    // Check for tool usage
    const toolCall = this.extractJson(content);
    
    if (toolCall && toolCall.tool) {
         try {
             await this.handleToolCall(toolCall);
         } catch (e) {
             console.error("Tool execution error", e);
             // Fallback if tool execution fails
             this.messages.update(msgs => [...msgs, { role: 'assistant', content: content }]);
         }
    } else {
         this.messages.update(msgs => [...msgs, { role: 'assistant', content: content }]);
    }
  }

  private extractJson(content: string): any {
      // 1. Try stripping markdown code blocks first
      const cleanContent = content.replace(/```json\s*|```/g, '').trim();
      
      // 2. Scan for the first '{' and try to find a valid JSON object
      const startIndex = cleanContent.indexOf('{');
      if (startIndex === -1) return null;

      // Try parsing from the first open brace to the end, then shrinking if needed
      // Naive approach: try to find the matching closing brace? 
      // Better approach: Try parsing increasingly longer substrings? 
      // Or just try to parse the whole thing from startIndex
      
      const potentialJson = cleanContent.substring(startIndex);
      
      try {
        return JSON.parse(potentialJson);
      } catch (e) {
        // If full parse fails, it might have trailing text.
        // Attempt to find the closing brace by counting balance
        let balance = 0;
        let endIndex = -1;
        
        for (let i = 0; i < potentialJson.length; i++) {
            if (potentialJson[i] === '{') balance++;
            else if (potentialJson[i] === '}') {
                balance--;
                if (balance === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        
        if (endIndex !== -1) {
            try {
                return JSON.parse(potentialJson.substring(0, endIndex + 1));
            } catch (err) { }
        }
      }
      return null;
  }

  private async handleToolCall(toolCall: any) {
      console.log("Executing Tool:", toolCall);
      let result = "";

      // Simulate output
      switch(toolCall.tool) {
          case 'list_services':
              result = "Available Services: iPhone Screen Repair, Android Battery Replacement, PC Optimization, Custom Web Development, SEO Consulting.";
              break;
          case 'get_repair_status':
               const id = toolCall.args?.trackingId || 'Unknown';
               result = `Repair ${id} is currently In Progress (Phase 2: Component Testing). ETA: 24hrs.`;
               break;
          case 'book_appointment':
               result = `Appointment request received for ${toolCall.args?.serviceType} on ${toolCall.args?.date}. Please confirm via WhatsApp.`;
               break;
          default:
               result = "Tool not found or not supported.";
      }

      // Add tool interaction context (hidden from user via visibleMessages)
      this.messages.update(msgs => [
          ...msgs, 
          { role: 'assistant', content: `Checking... (Tool: ${toolCall.tool})` },
          { role: 'user', content: `[Tool Output]: ${result}` } // Changed to 'user' to be safer for LLM context
      ]);
      
      // Trigger re-generation with tool output
      const reply = await this.generateResponse();
      const finalResponse = reply.choices[0].message.content || "";
      
      this.messages.update(msgs => [...msgs, { role: 'assistant', content: finalResponse }]);
  }

  private limitHistory(msgs: ChatMessage[]): ChatMessage[] {
      const maxHistory = 20; // Keep roughly last 20 messages + system prompt
      if (msgs.length <= maxHistory) return msgs;

      // Always keep the first message (System Prompt)
      const systemPrompt = msgs[0];
      const recentMessages = msgs.slice(msgs.length - (maxHistory - 1));
      
      return [systemPrompt, ...recentMessages];
  }
}
