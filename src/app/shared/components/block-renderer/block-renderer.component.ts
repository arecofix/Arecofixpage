import { Component, Input, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { ServiceBlockDto, CreateLeadDto, ServiceDto } from '@app/features/services/domain/dtos/service.dto';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block-renderer.component.html',
  styleUrls: ['./block-renderer.component.css']
})
export class BlockRendererComponent implements OnInit {
  @Input({ required: true }) block!: ServiceBlockDto;
  @Input() serviceId?: string;
  @Input() serviceName?: string;
  @Input() isPreview = false;

  public sanitizer = inject(DomSanitizer);
  private servicesApp = inject(ServicesApplicationService);

  // Cross-selling service list
  publicServices = signal<ServiceDto[]>([]);

  // Contact form state
  leadName = signal('');
  leadEmail = signal('');
  leadPhone = signal('');
  leadMessage = signal('');
  leadHoneypot = signal('');
  leadSubmitting = signal(false);
  leadSuccess = signal(false);
  leadError = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    if (this.block?.block_type === 'service_list') {
      try {
        const all = await this.servicesApp.getPublicServices();
        const limit = Number(this.block.content?.['limit'] ?? 3);
        const filtered = all
          .filter(s => s.id !== this.serviceId && s.is_published)
          .slice(0, limit);
        this.publicServices.set(filtered);
      } catch (err) {
        console.error('Error cargando servicios para bloque service_list:', err);
      }
    }
  }

  get sanitizedMarkdown(): SafeHtml {
    const raw = this.block.content?.['content'] || '';
    // Basic Markdown converter for SSR (headings, bold, italics, lists, paragraphs)
    const html = raw
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>')
      .replace(/\n\n/gim, '</p><p class="text-gray-700 dark:text-gray-300 my-2 leading-relaxed">')
      .replace(/\n/gim, '<br />');

    const wrappedHtml = `<p class="text-gray-700 dark:text-gray-300 leading-relaxed">${html}</p>`;

    // SEC-001: Sanitize HTML against XSS attacks using DOMPurify with strict whitelist
    const cleanHtml = (typeof window !== 'undefined' && typeof DOMPurify?.sanitize === 'function')
      ? DOMPurify.sanitize(wrappedHtml, {
          ALLOWED_TAGS: ['h1', 'h2', 'h3', 'strong', 'em', 'li', 'p', 'br', 'span', 'b', 'i', 'ul', 'ol', 'a'],
          ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
        })
      : wrappedHtml
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/javascript:/gi, '');

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  get whatsappUrl(): string {
    const phone = '5491125960900';
    const message = encodeURIComponent(
      this.block.content?.['whatsappMessage'] ||
      `Hola! Quisiera consultar por el servicio de ${this.serviceName || 'Arecofix'}.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  }

  async submitLeadForm(): Promise<void> {
    if (this.isPreview) {
      alert('Modo previsualización: el formulario no envía datos reales.');
      return;
    }

    if (!this.leadName().trim()) {
      this.leadError.set('Por favor ingresá tu nombre.');
      return;
    }

    if (!this.leadEmail().trim() && !this.leadPhone().trim()) {
      this.leadError.set('Ingresá al menos un correo electrónico o teléfono.');
      return;
    }

    this.leadSubmitting.set(true);
    this.leadError.set(null);

    try {
      const payload: CreateLeadDto = {
        service_id: this.serviceId || null,
        name: this.leadName().trim(),
        email: this.leadEmail().trim() || null,
        phone: this.leadPhone().trim() || null,
        message: this.leadMessage().trim() || `Consulta desde la landing del servicio: ${this.serviceName || 'General'}`,
        source: 'landing_service_block',
        hp_field: this.leadHoneypot().trim() || undefined,
      };

      await this.servicesApp.submitLead(payload);
      this.leadSuccess.set(true);
      this.leadName.set('');
      this.leadEmail.set('');
      this.leadPhone.set('');
      this.leadMessage.set('');
    } catch (err: unknown) {
      console.error('Error enviando formulario de lead:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al enviar tu consulta. Intentá nuevamente.';
      this.leadError.set(errorMessage);
    } finally {
      this.leadSubmitting.set(false);
    }
  }
}
