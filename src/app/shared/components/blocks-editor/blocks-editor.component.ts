import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ServiceBlockDto } from '@app/features/services/domain/dtos/service.dto';
import { BlockType, validateBlockContent } from '@app/features/services/domain/dtos/block-schemas';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { BlockRendererComponent } from '../block-renderer/block-renderer.component';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

@Component({
  selector: 'app-blocks-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BlockRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blocks-editor.component.html',
  styleUrls: ['./blocks-editor.component.css'],
})
export class BlocksEditorComponent implements OnInit {
  @Input({ required: true }) ownerType: 'service' | 'post' = 'service';
  @Input({ required: true }) ownerId!: string;
  @Input() initialBlocks: ServiceBlockDto[] = [];
  @Output() blocksChange = new EventEmitter<ServiceBlockDto[]>();

  private servicesApp = inject(ServicesApplicationService);

  blocks = signal<ServiceBlockDto[]>([]);
  selectedBlockIndex = signal<number>(0);
  saveStatus = signal<SaveStatus>('saved');
  errorMessage = signal<string | null>(null);
  showAddMenu = signal(false);
  previewMode = signal<'split' | 'editor' | 'preview'>('split');

  currentSelectedBlock = computed(() => {
    const list = this.blocks();
    const idx = this.selectedBlockIndex();
    return list[idx] || null;
  });

  availableBlockTypes: Array<{ type: BlockType; label: string; icon: string; description: string }> = [
    { type: 'hero', label: 'Encabezado (Hero)', icon: 'fa-star', description: 'Título principal, subtítulo, llamada a la acción e imagen' },
    { type: 'features', label: 'Características', icon: 'fa-list-check', description: 'Rejilla de beneficios con íconos descriptivos' },
    { type: 'rich_text', label: 'Texto / Markdown', icon: 'fa-align-left', description: 'Párrafos, viñetas, títulos y texto enriquecido' },
    { type: 'gallery', label: 'Galería de Imágenes', icon: 'fa-images', description: 'Rejilla de fotos con leyendas' },
    { type: 'cta', label: 'Llamada a la Acción (CTA)', icon: 'fa-bullhorn', description: 'Banner llamativo con botón de contacto o WhatsApp' },
    { type: 'faq', label: 'Preguntas Frecuentes', icon: 'fa-circle-question', description: 'Acordeón interactivo accesible para resolver dudas' },
    { type: 'testimonials', label: 'Testimonios', icon: 'fa-comments', description: 'Comentarios y valoraciones con estrellas de clientes' },
    { type: 'contact', label: 'Formulario de Contacto', icon: 'fa-envelope', description: 'Formulario de captura de leads con anti-spam' },
    { type: 'map', label: 'Mapa y Ubicación', icon: 'fa-map-location-dot', description: 'Mapa interactivo de Google Maps y dirección física' },
    { type: 'service_list', label: 'Lista de Servicios', icon: 'fa-cubes', description: 'Rejilla para promocionar otros servicios relacionados' },
  ];

  private debounceTimer: any = null;

  ngOnInit(): void {
    if (this.initialBlocks && this.initialBlocks.length > 0) {
      this.blocks.set(JSON.parse(JSON.stringify(this.initialBlocks)));
    } else {
      this.loadBlocks();
    }
  }

  async loadBlocks(): Promise<void> {
    if (!this.ownerId) return;
    try {
      const data = await this.servicesApp.getBlocks(this.ownerType, this.ownerId);
      this.blocks.set(data);
      if (data.length > 0) {
        this.selectedBlockIndex.set(0);
      }
    } catch (e: any) {
      console.error('Error cargando bloques:', e);
    }
  }

  onDrop(event: CdkDragDrop<ServiceBlockDto[]>): void {
    const list = [...this.blocks()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    list.forEach((b, idx) => (b.order_index = idx));
    this.blocks.set(list);
    this.selectedBlockIndex.set(event.currentIndex);
    this.triggerAutoSave();
  }

  moveBlock(index: number, direction: 'up' | 'down'): void {
    const list = [...this.blocks()];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    moveItemInArray(list, index, target);
    list.forEach((b, idx) => (b.order_index = idx));
    this.blocks.set(list);
    this.selectedBlockIndex.set(target);
    this.triggerAutoSave();
  }

  addBlock(type: BlockType): void {
    const defaultContent: Record<string, any> = this.getDefaultContentForType(type);
    const newBlock: ServiceBlockDto = {
      id: '',
      owner_type: this.ownerType,
      owner_id: this.ownerId,
      block_type: type,
      content: defaultContent,
      order_index: this.blocks().length,
      is_enabled: true,
    };

    const updated = [...this.blocks(), newBlock];
    this.blocks.set(updated);
    this.selectedBlockIndex.set(updated.length - 1);
    this.showAddMenu.set(false);
    this.triggerAutoSave();
  }

  removeBlock(index: number): void {
    const list = [...this.blocks()];
    const toRemove = list[index];
    if (!toRemove) return;

    if (!confirm('¿Estás seguro de eliminar este bloque?')) return;

    list.splice(index, 1);
    list.forEach((b, idx) => (b.order_index = idx));
    this.blocks.set(list);

    if (toRemove.id) {
      this.servicesApp.deleteBlock(toRemove.id).catch(err => {
        console.error('Error eliminando bloque en BD:', err);
      });
    }

    if (this.selectedBlockIndex() >= list.length) {
      this.selectedBlockIndex.set(Math.max(0, list.length - 1));
    }
    this.triggerAutoSave();
  }

  toggleBlockEnabled(index: number): void {
    const list = [...this.blocks()];
    if (list[index]) {
      list[index].is_enabled = !list[index].is_enabled;
      this.blocks.set(list);
      this.triggerAutoSave();
    }
  }

  onContentChange(): void {
    this.saveStatus.set('unsaved');
    this.triggerAutoSave();
  }

  triggerAutoSave(): void {
    this.saveStatus.set('saving');
    this.errorMessage.set(null);
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(async () => {
      try {
        const payload = this.blocks().map((b, idx) => ({
          id: b.id || undefined,
          owner_type: this.ownerType,
          owner_id: this.ownerId,
          block_type: b.block_type,
          content: b.content,
          order_index: idx,
          is_enabled: b.is_enabled,
        }));

        // Validate all blocks client-side first
        for (const b of payload) {
          const val = validateBlockContent(b.block_type, b.content);
          if (!val.success) {
            this.saveStatus.set('error');
            this.errorMessage.set(`Error en bloque ${b.block_type}: ${val.error}`);
            return;
          }
        }

        if (this.ownerId && this.ownerId !== 'temp') {
          const saved = await this.servicesApp.upsertBlocks(this.ownerType, this.ownerId, payload);
          this.blocks.set(saved);
        }

        this.saveStatus.set('saved');
        this.blocksChange.emit(this.blocks());
      } catch (err: any) {
        console.error('Error guardando bloques:', err);
        this.saveStatus.set('error');
        this.errorMessage.set(err.message || 'Error al guardar los bloques.');
      }
    }, 500);
  }

  // Helpers for nested items in block forms
  addFeatureItem(): void {
    const block = this.currentSelectedBlock();
    if (!block) return;
    if (!block.content['items']) block.content['items'] = [];
    block.content['items'].push({ title: 'Nueva característica', description: '', icon: 'fa-check' });
    this.onContentChange();
  }

  removeFeatureItem(itemIdx: number): void {
    const block = this.currentSelectedBlock();
    if (!block?.content['items']) return;
    block.content['items'].splice(itemIdx, 1);
    this.onContentChange();
  }

  addFaqItem(): void {
    const block = this.currentSelectedBlock();
    if (!block) return;
    if (!block.content['items']) block.content['items'] = [];
    block.content['items'].push({ question: 'Pregunta frecuente', answer: 'Respuesta detallada...' });
    this.onContentChange();
  }

  removeFaqItem(itemIdx: number): void {
    const block = this.currentSelectedBlock();
    if (!block?.content['items']) return;
    block.content['items'].splice(itemIdx, 1);
    this.onContentChange();
  }

  addGalleryImage(): void {
    const block = this.currentSelectedBlock();
    if (!block) return;
    if (!block.content['images']) block.content['images'] = [];
    block.content['images'].push({ url: '', caption: '', alt: 'Foto de servicio' });
    this.onContentChange();
  }

  removeGalleryImage(imgIdx: number): void {
    const block = this.currentSelectedBlock();
    if (!block?.content['images']) return;
    block.content['images'].splice(imgIdx, 1);
    this.onContentChange();
  }

  addTestimonialItem(): void {
    const block = this.currentSelectedBlock();
    if (!block) return;
    if (!block.content['items']) block.content['items'] = [];
    block.content['items'].push({ author: 'Cliente', role: 'Usuario', text: 'Excelente atención y servicio.', rating: 5 });
    this.onContentChange();
  }

  removeTestimonialItem(itemIdx: number): void {
    const block = this.currentSelectedBlock();
    if (!block?.content['items']) return;
    block.content['items'].splice(itemIdx, 1);
    this.onContentChange();
  }

  private getDefaultContentForType(type: BlockType): Record<string, any> {
    switch (type) {
      case 'hero':
        return {
          title: 'Título Destacado',
          subtitle: 'Descripción concisa de la propuesta de valor.',
          ctaLabel: 'Consultar Ahora',
          ctaHref: '#contacto',
          align: 'left',
          imageUrl: '',
        };
      case 'features':
        return {
          title: '¿Por qué elegirnos?',
          subtitle: 'Garantía y calidad técnica.',
          items: [
            { title: 'Diagnóstico en el Acto', description: 'Revisión rápida de tu equipo.', icon: 'fa-bolt' },
            { title: 'Repuestos Originales', description: 'Calidad asegurada.', icon: 'fa-shield-halved' },
            { title: 'Garantía Escrita', description: '3 meses de respaldo.', icon: 'fa-certificate' },
          ],
        };
      case 'rich_text':
        return {
          content: '### Información detallada\n\nEscribí aquí toda la explicación del servicio...',
        };
      case 'gallery':
        return {
          title: 'Trabajos Realizados',
          images: [],
        };
      case 'cta':
        return {
          title: '¿Listo para solucionar tu problema?',
          subtitle: 'Escribinos ahora y te respondemos en minutos.',
          buttonLabel: 'Pedir Presupuesto',
          buttonHref: '#contacto',
          style: 'whatsapp',
          whatsappMessage: 'Hola! Quiero solicitar un presupuesto.',
        };
      case 'faq':
        return {
          title: 'Preguntas Frecuentes',
          items: [
            { question: '¿Cuánto demora el servicio?', answer: 'Generalmente entre 24 y 48 horas según disponibilidad.' },
            { question: '¿Tienen garantía?', answer: 'Sí, todos nuestros trabajos cuentan con garantía escrita.' },
          ],
        };
      case 'testimonials':
        return {
          title: 'Opiniones de Nuestros Clientes',
          items: [
            { author: 'Juan Pérez', role: 'Cliente Particular', text: 'Excelente servicio y rapidez.', rating: 5 },
          ],
        };
      case 'contact':
        return {
          title: 'Contactanos',
          subtitle: 'Completá tus datos y te responderemos a la brevedad.',
          showPhone: true,
          showEmail: true,
          messagePlaceholder: 'Describí brevemente qué necesitás...',
        };
      case 'map':
        return {
          title: 'Ubicación de nuestro Local',
          address: 'Jorge Newbery 69, Marcos Paz, Buenos Aires',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.4716766447844!2d-58.8205479234856!3d-34.76767577289808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc92c6e61a49c9%3A0x673418525e9e0f07!2sJorge%20Newbery%2069%2C%20Marcos%20Paz%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1714000000000!5m2!1ses-419!2sar',
          zoom: 16,
        };
      case 'service_list':
        return {
          title: 'Otros Servicios Recomendados',
          maxItems: 3,
        };
    }
  }
}
