import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  KnowledgeBaseAdminService,
  KnowledgeDoc,
  IngestTextPayload,
} from './knowledge-base-admin.service';

type Tab = 'docs' | 'add-text' | 'add-file';
type SourceType = IngestTextPayload['source_type'];

@Component({
  selector: 'app-admin-knowledge-base-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

  <!-- ── Header ──────────────────────────────────────────────────────── -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <h1 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
        <i class="fas fa-brain text-indigo-500"></i>
        Base de Conocimiento IA
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Indexá documentos y texto para alimentar el chatbot RAG · {{ docs().length }} documentos indexados
      </p>
    </div>
    <button (click)="activeTab.set('add-text')"
      class="btn btn-primary gap-2 self-start sm:self-auto">
      <i class="fas fa-plus"></i> Agregar contenido
    </button>
  </div>

  <!-- ── Alert de error global ───────────────────────────────────────── -->
  @if (svc.error()) {
    <div class="alert alert-error shadow-lg">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ svc.error() }}</span>
      <button class="btn btn-ghost btn-xs" (click)="svc.error.set(null)">✕</button>
    </div>
  }

  <!-- ── Tabs ─────────────────────────────────────────────────────────── -->
  <div class="tabs tabs-boxed bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 w-fit rounded-xl p-1 shadow-sm">
    <button class="tab gap-2 transition-all" [class.tab-active]="activeTab() === 'docs'"
      (click)="activeTab.set('docs')">
      <i class="fas fa-database text-xs"></i> Documentos
    </button>
    <button class="tab gap-2 transition-all" [class.tab-active]="activeTab() === 'add-text'"
      (click)="activeTab.set('add-text')">
      <i class="fas fa-pen text-xs"></i> Agregar Texto
    </button>
    <button class="tab gap-2 transition-all" [class.tab-active]="activeTab() === 'add-file'"
      (click)="activeTab.set('add-file')">
      <i class="fas fa-file-upload text-xs"></i> Subir Archivo
    </button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       TAB 1 — Lista de Documentos Indexados
  ══════════════════════════════════════════════════════════════════ -->
  @if (activeTab() === 'docs') {
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <!-- Toolbar -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">
          <i class="fas fa-list-ul mr-2 text-indigo-500"></i>Documentos indexados (1 fila = 1 documento)
        </p>
        <button class="btn btn-ghost btn-sm gap-2" (click)="loadDocs()" [disabled]="svc.loading()">
          <i class="fas fa-sync-alt" [class.fa-spin]="svc.loading()"></i> Actualizar
        </button>
      </div>

      @if (svc.loading()) {
        <div class="flex items-center justify-center py-16 gap-3 text-gray-400">
          <span class="loading loading-spinner loading-md"></span> Cargando documentos...
        </div>
      } @else if (docs().length === 0) {
        <div class="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
          <i class="fas fa-inbox text-5xl opacity-30"></i>
          <p class="text-sm">No hay documentos indexados aún.</p>
          <button class="btn btn-outline btn-sm" (click)="activeTab.set('add-text')">
            Agregar el primero
          </button>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-900/50 text-xs text-gray-500 uppercase">
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th class="hidden md:table-cell">Chunks</th>
                <th class="hidden lg:table-cell">Archivo R2</th>
                <th class="hidden md:table-cell">Fecha</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of docs(); track doc.id) {
                <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                  <td class="font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                    {{ doc.title }}
                  </td>
                  <td>
                    <span class="badge badge-sm font-medium"
                      [class]="badgeClass(doc.source_type)">
                      {{ doc.source_type }}
                    </span>
                  </td>
                  <td class="hidden md:table-cell text-center font-mono text-indigo-600 dark:text-indigo-400">
                    {{ (doc.metadata['total_chunks'] ?? '—') }}
                  </td>
                  <td class="hidden lg:table-cell max-w-[180px]">
                    @if (doc.source_url) {
                      <a [href]="doc.source_url" target="_blank" rel="noopener"
                        class="link link-primary text-xs truncate block" title="{{ doc.source_url }}">
                        <i class="fas fa-external-link-alt mr-1"></i>Ver archivo
                      </a>
                    } @else {
                      <span class="text-gray-400 text-xs">—</span>
                    }
                  </td>
                  <td class="hidden md:table-cell text-xs text-gray-400">
                    {{ doc.created_at | date:'dd/MM/yy HH:mm' }}
                  </td>
                  <td class="text-right">
                    <button class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                      [disabled]="deletingId() === doc.id"
                      (click)="confirmDelete(doc)">
                      @if (deletingId() === doc.id) {
                        <span class="loading loading-spinner loading-xs"></span>
                      } @else {
                        <i class="fas fa-trash"></i>
                      }
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  }

  <!-- ══════════════════════════════════════════════════════════════════
       TAB 2 — Agregar Texto Directo
  ══════════════════════════════════════════════════════════════════ -->
  @if (activeTab() === 'add-text') {
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-5">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <i class="fas fa-pen-nib text-indigo-500"></i> Indexar texto directo
      </h2>
      <p class="text-sm text-gray-500">
        Pegá el contenido que querés que el chatbot conozca: descripciones de productos, servicios, preguntas frecuentes, etc.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Título -->
        <div class="form-control col-span-full">
          <label class="label"><span class="label-text font-semibold">Título del documento *</span></label>
          <input [(ngModel)]="textForm.title" type="text" placeholder="ej. Servicio de Reparación de iPhone"
            class="input input-bordered w-full dark:bg-slate-900" maxlength="200" />
        </div>

        <!-- Tipo -->
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Tipo de fuente *</span></label>
          <select [(ngModel)]="textForm.source_type" class="select select-bordered dark:bg-slate-900 w-full">
            <option value="service">🔧 Servicio de reparación</option>
            <option value="product">📦 Producto</option>
            <option value="faq">❓ Pregunta frecuente</option>
            <option value="manual">📘 Manual técnico</option>
            <option value="course">🎓 Curso / Academia</option>
            <option value="blog">📰 Blog / Noticia</option>
            <option value="custom">🏷️ Contenido personalizado</option>
          </select>
        </div>

        <!-- Tags (metadata) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Tags (separados por coma)</span>
            <span class="label-text-alt text-gray-400">opcional</span>
          </label>
          <input [(ngModel)]="textTags" type="text" placeholder="ej. iPhone, pantalla, garantía"
            class="input input-bordered dark:bg-slate-900 w-full" />
        </div>

        <!-- Contenido -->
        <div class="form-control col-span-full">
          <label class="label">
            <span class="label-text font-semibold">Contenido *</span>
            <span class="label-text-alt" [class.text-red-500]="textForm.content.length > 15000">
              {{ textForm.content.length }}/15000
            </span>
          </label>
          <textarea [(ngModel)]="textForm.content"
            placeholder="Escribí o pegá el contenido aquí. El sistema lo dividirá automáticamente en chunks de 1500 caracteres con solapamiento para mayor precisión semántica."
            class="textarea textarea-bordered dark:bg-slate-900 w-full h-52 resize-y leading-relaxed"
            maxlength="15000"></textarea>
        </div>
      </div>

      <!-- Acción -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
        <p class="text-xs text-gray-400">
          <i class="fas fa-info-circle mr-1"></i>
          El texto se dividirá en ~{{ estimatedChunks }} chunk{{ estimatedChunks !== 1 ? 's' : '' }} de embedding.
        </p>
        <button class="btn btn-primary gap-2 min-w-[160px]"
          [disabled]="!textFormValid || svc.loading()"
          (click)="submitText()">
          @if (svc.loading()) {
            <span class="loading loading-spinner loading-sm"></span> Indexando...
          } @else {
            <i class="fas fa-bolt"></i> Indexar ahora
          }
        </button>
      </div>

      <!-- Success -->
      @if (textSuccess()) {
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <span>{{ textSuccess() }}</span>
        </div>
      }
    </div>
  }

  <!-- ══════════════════════════════════════════════════════════════════
       TAB 3 — Subir Archivo (PDF / TXT)
  ══════════════════════════════════════════════════════════════════ -->
  @if (activeTab() === 'add-file') {
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-5">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <i class="fas fa-cloud-upload-alt text-indigo-500"></i> Subir archivo a R2 e indexar
      </h2>
      <p class="text-sm text-gray-500">
        El archivo se sube a <strong>Cloudflare R2</strong> y el texto se extrae automáticamente para indexarlo en el chatbot.
        Formatos soportados: <code class="bg-gray-100 dark:bg-slate-700 px-1 rounded">.pdf</code>,
        <code class="bg-gray-100 dark:bg-slate-700 px-1 rounded">.txt</code>
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Título del doc -->
        <div class="form-control col-span-full">
          <label class="label"><span class="label-text font-semibold">Título del documento *</span></label>
          <input [(ngModel)]="fileForm.title" type="text"
            placeholder="ej. Manual de Servicio Samsung Galaxy S24"
            class="input input-bordered dark:bg-slate-900 w-full" maxlength="200" />
        </div>

        <!-- Tipo -->
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Tipo de fuente *</span></label>
          <select [(ngModel)]="fileForm.source_type" class="select select-bordered dark:bg-slate-900 w-full">
            <option value="manual">📘 Manual técnico</option>
            <option value="course">🎓 Curso / Academia</option>
            <option value="service">🔧 Servicio de reparación</option>
            <option value="product">📦 Producto</option>
            <option value="faq">❓ Preguntas frecuentes</option>
            <option value="blog">📰 Blog / Noticia</option>
            <option value="custom">🏷️ Contenido personalizado</option>
          </select>
        </div>

        <!-- Tags -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Tags</span>
            <span class="label-text-alt text-gray-400">opcional</span>
          </label>
          <input [(ngModel)]="fileTags" type="text" placeholder="ej. Samsung, S24, servicio oficial"
            class="input input-bordered dark:bg-slate-900 w-full" />
        </div>

        <!-- Drop zone -->
        <div class="form-control col-span-full">
          <label class="label"><span class="label-text font-semibold">Archivo *</span></label>
          <div
            class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
            [class.border-indigo-400]="dragOver()"
            [class.bg-indigo-50]="dragOver()"
            [class.dark:bg-indigo-900\/10]="dragOver()"
            [class.border-gray-300]="!dragOver()"
            (dragover)="onDragOver($event)"
            (dragleave)="dragOver.set(false)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input #fileInput type="file" class="hidden"
              accept=".pdf,.txt,application/pdf,text/plain"
              (change)="onFileSelected($event)" />

            @if (selectedFile()) {
              <div class="flex items-center justify-center gap-3">
                <i class="fas text-3xl"
                  [class.fa-file-pdf]="selectedFile()!.type === 'application/pdf'"
                  [class.fa-file-alt]="selectedFile()!.type !== 'application/pdf'"
                  [class.text-red-500]="selectedFile()!.type === 'application/pdf'"
                  [class.text-blue-500]="selectedFile()!.type !== 'application/pdf'"></i>
                <div class="text-left">
                  <p class="font-semibold text-gray-800 dark:text-white">{{ selectedFile()!.name }}</p>
                  <p class="text-xs text-gray-400">{{ formatBytes(selectedFile()!.size) }}</p>
                </div>
                <button class="btn btn-ghost btn-circle btn-sm text-gray-400"
                  (click)="selectedFile.set(null); $event.stopPropagation()">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            } @else {
              <div class="space-y-2">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-300 dark:text-gray-600"></i>
                <p class="text-sm text-gray-500">Arrastrá un archivo aquí o hacé click para seleccionar</p>
                <p class="text-xs text-gray-400">PDF o TXT · máx. 10MB</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Progress bar de subida -->
      @if (svc.uploading()) {
        <div class="space-y-2">
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ uploadStep() }}</span>
          </div>
          <progress class="progress progress-primary w-full"></progress>
        </div>
      }

      <!-- Acción -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
        <p class="text-xs text-gray-400">
          <i class="fas fa-lock mr-1 text-green-500"></i>
          El archivo se almacena en Cloudflare R2 con egress gratuito.
        </p>
        <button class="btn btn-primary gap-2 min-w-[200px]"
          [disabled]="!fileFormValid || svc.uploading()"
          (click)="submitFile()">
          @if (svc.uploading()) {
            <span class="loading loading-spinner loading-sm"></span> {{ uploadStep() }}
          } @else {
            <i class="fas fa-rocket"></i> Subir e indexar
          }
        </button>
      </div>

      <!-- Success -->
      @if (fileSuccess()) {
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <span>{{ fileSuccess() }}</span>
        </div>
      }
    </div>
  }

</div>

<!-- ── Confirm Delete Modal ─────────────────────────────────────────────── -->
@if (docToDelete()) {
  <div class="modal modal-open">
    <div class="modal-box dark:bg-slate-800 shadow-2xl">
      <h3 class="font-bold text-lg flex items-center gap-2">
        <i class="fas fa-exclamation-triangle text-red-500"></i> Eliminar documento
      </h3>
      <p class="py-4 text-gray-600 dark:text-gray-300">
        ¿Estás seguro de eliminar <strong>{{ docToDelete()?.title }}</strong>?
        Se borrarán todos sus chunks de la knowledge base. Esta acción no se puede deshacer.
      </p>
      <div class="modal-action gap-3">
        <button class="btn btn-ghost" (click)="docToDelete.set(null)">Cancelar</button>
        <button class="btn btn-error gap-2" (click)="deleteDoc()">
          <i class="fas fa-trash"></i> Sí, eliminar
        </button>
      </div>
    </div>
    <div class="modal-backdrop" (click)="docToDelete.set(null)"></div>
  </div>
}
  `,
})
export class AdminKnowledgeBasePage implements OnInit {
  readonly svc = inject(KnowledgeBaseAdminService);

  // ── Estado de UI ──────────────────────────────────────────────────────────
  activeTab = signal<Tab>('docs');
  docs = signal<KnowledgeDoc[]>([]);
  deletingId = signal<string | null>(null);
  docToDelete = signal<KnowledgeDoc | null>(null);
  dragOver = signal(false);
  selectedFile = signal<File | null>(null);
  uploadStep = signal('Subiendo a R2...');
  textSuccess = signal('');
  fileSuccess = signal('');
  textTags = '';
  fileTags = '';

  // ── Formularios reactivos simples ─────────────────────────────────────────
  textForm: IngestTextPayload = { title: '', content: '', source_type: 'service' };
  fileForm: { title: string; source_type: IngestTextPayload['source_type'] } = {
    title: '', source_type: 'manual',
  };

  // ── Getters (reemplazan a computed porque dependen de objetos mutables) ──
  get textFormValid(): boolean {
    return this.textForm.title.trim().length > 2 && this.textForm.content.trim().length >= 10;
  }
  get fileFormValid(): boolean {
    return this.fileForm.title.trim().length > 2 && this.selectedFile() !== null;
  }
  get estimatedChunks(): number {
    const len = this.textForm.content.trim().length;
    return len < 1500 ? 1 : Math.ceil(len / 1350);
  }

  ngOnInit(): void { this.loadDocs(); }

  async loadDocs(): Promise<void> {
    this.docs.set(await this.svc.listDocs());
  }

  // ── Texto ─────────────────────────────────────────────────────────────────
  async submitText(): Promise<void> {
    if (!this.textFormValid) return;
    this.textSuccess.set('');
    const tags = this.textTags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const { chunks_processed } = await this.svc.ingestText({
        ...this.textForm,
        metadata: tags.length ? { tags } : undefined,
      });
      this.textSuccess.set(`✅ Indexado correctamente en ${chunks_processed} chunk${chunks_processed !== 1 ? 's' : ''}.`);
      this.textForm = { title: '', content: '', source_type: 'service' };
      this.textTags = '';
      await this.loadDocs();
    } catch { /* error ya en svc.error() */ }
  }

  // ── Archivo ───────────────────────────────────────────────────────────────
  onDragOver(e: DragEvent): void { e.preventDefault(); this.dragOver.set(true); }
  onDrop(e: DragEvent): void {
    e.preventDefault(); this.dragOver.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.selectedFile.set(file);
  }
  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.selectedFile.set(file);
  }

  async submitFile(): Promise<void> {
    if (!this.fileFormValid) return;
    this.fileSuccess.set('');
    this.uploadStep.set('Subiendo a R2...');
    const tags = this.fileTags.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const { chunks_processed, r2_url } = await this.svc.ingestFile(
        this.selectedFile()!,
        this.fileForm.title,
        this.fileForm.source_type,
        tags.length ? { tags } : undefined,
      );
      this.fileSuccess.set(
        `✅ Archivo subido a R2 e indexado en ${chunks_processed} chunk${chunks_processed !== 1 ? 's' : ''}.`,
      );
      this.selectedFile.set(null);
      this.fileForm = { title: '', source_type: 'manual' };
      this.fileTags = '';
      await this.loadDocs();
    } catch { /* error ya en svc.error() */ }
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────
  confirmDelete(doc: KnowledgeDoc): void { this.docToDelete.set(doc); }

  async deleteDoc(): Promise<void> {
    const doc = this.docToDelete();
    if (!doc) return;
    this.deletingId.set(doc.id);
    this.docToDelete.set(null);
    try {
      await this.svc.deleteDoc(doc.source_id ?? doc.id);
      this.docs.update(d => d.filter(x => x.id !== doc.id));
    } finally {
      this.deletingId.set(null);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  badgeClass(type: string): string {
    const map: Record<string, string> = {
      product: 'badge-success', service: 'badge-info', manual: 'badge-warning',
      course: 'badge-secondary', faq: 'badge-ghost', blog: 'badge-accent', custom: 'badge-neutral',
    };
    return map[type] ?? 'badge-neutral';
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
