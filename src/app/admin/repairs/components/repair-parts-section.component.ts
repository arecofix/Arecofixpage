import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repair-parts-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800/50 rounded-4xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/50 relative overflow-hidden group hover:border-emerald-100 transition-colors">
        <div class="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-emerald-400 to-teal-500 opacity-80"></div>
        
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg shadow-inner">
                    <i class="fas fa-toolbox"></i>
                </div>
                <h2 class="text-xl text-gray-800 dark:text-white font-bold">Gestión de Taller</h2>
            </div>
            <button type="button" (click)="onRequestProductModal.emit()" class="btn btn-sm btn-outline hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm">
                <i class="fas fa-plus"></i> Usar Repuesto
            </button>
        </div>
        
        <!-- Tabla de Repuestos -->
        <div class="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-900 font-medium text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">
                    <tr>
                        <th class="py-3 px-4">Ítem / Repuesto</th>
                        <th class="py-3 px-4 text-center w-24">QTY</th>
                        <th class="py-3 px-4 text-right">Unitario</th>
                        <th class="py-3 px-4 text-right">Subtotal</th>
                        <th class="py-3 px-4 text-right w-12"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @for (part of parts(); track $index) {
                    <tr class="hover:bg-gray-50/50 transition-colors group/row">
                        <td class="py-3 px-4 font-bold text-gray-800 dark:text-white flex flex-col justify-center gap-0.5">
                            {{ part.name }}
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-[9px] text-gray-400">Costo Base: {{ part.cost_at_time | currency:'ARS':'symbol':'1.0-0' }}</span>
                                <span class="font-mono text-[9px] font-bold" [ngClass]="(part.current_stock || 0) < part.quantity ? 'text-red-500' : 'text-emerald-500'">Stock Max: {{ part.current_stock || 0 }}</span>
                            </div>
                        </td>
                        <td class="py-3 px-4 text-center relative">
                            <input type="number" [(ngModel)]="part.quantity" [name]="'part_qty_' + $index" (change)="onPartsChange.emit(parts())" class="input input-sm input-bordered rounded-lg w-16 text-center font-bold font-mono focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 bg-white dark:bg-gray-800/50" min="1" [max]="part.current_stock || 99999" />
                        </td>
                        <td class="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                            {{ part.unit_price_at_time | currency:'ARS':'symbol':'1.0-0' }}
                        </td>
                        <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                            {{ (part.unit_price_at_time * part.quantity) | currency:'ARS':'symbol':'1.0-0' }}
                        </td>
                        <td class="py-3 px-4 text-right">
                            <button type="button" (click)="onRemovePart.emit($index)" class="btn btn-circle btn-ghost btn-xs text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                    }
                    @if (parts().length === 0) {
                    <tr>
                        <td colspan="5" class="py-12 text-center text-gray-400">
                            <i class="fas fa-box-open text-3xl mb-2 opacity-50"></i>
                            <p class="text-xs font-medium uppercase tracking-widest opacity-70">No se vincularon repuestos</p>
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>

        <!-- Technical Notes & Report -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fas fa-user-secret text-gray-400"></i> Bitácora Técnica (Privado)</span></label>
                <textarea [ngModel]="technicianNotes()" (ngModelChange)="onTechnicianNotesChange.emit($event)" name="technician_notes" class="textarea textarea-bordered h-32 w-full rounded-2xl bg-[#fffef0] focus:bg-[#fffae8] border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all font-mono text-xs text-yellow-900 leading-relaxed shadow-inner" placeholder="Pistas levantadas, puentes hechos, consumo de la fuente en 0.2A..."></textarea>
            </div>
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-bold text-emerald-600 flex items-center gap-2"><i class="fas fa-file-invoice text-emerald-400"></i> Reporte al Cliente (Público)</span></label>
                <textarea [ngModel]="technicalReport()" (ngModelChange)="onTechnicalReportChange.emit($event)" name="technical_report" class="textarea textarea-bordered h-32 w-full rounded-2xl bg-emerald-50/30 focus:bg-emerald-50 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all text-sm text-emerald-900 leading-relaxed shadow-sm" placeholder="Se limpió el flex de carga. Equipo ensamblado y testeado ok..."></textarea>
            </div>
        </div>

        <!-- Images Upload -->
        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 border-dashed">
             <label class="label pb-1.5"><span class="label-text font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fas fa-camera text-gray-400"></i> Evidencia Fotográfica</span></label>
             <div class="flex flex-col gap-4 mt-2">
                <div class="relative group/file">
                    <input type="file" (change)="onFileSelected.emit($event)" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" [disabled]="uploadingImages()" />
                    <div class="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl py-6 bg-gray-50 dark:bg-gray-800/50 font-medium text-gray-500 dark:text-gray-400 group-hover/file:border-emerald-400 group-hover/file:bg-emerald-50 transition-colors">
                         @if(uploadingImages()) {
                             <span class="loading loading-spinner text-emerald-500"></span> <span class="ml-2 text-emerald-600">Subiendo a Cloud...</span>
                         } @else {
                             <i class="fas fa-cloud-upload-alt text-2xl mr-3 text-gray-400 group-hover/file:text-emerald-500"></i> Click o Arrastrar fotos del equipo
                         }
                    </div>
                </div>

                @if (images().length > 0) {
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                        @for (img of images(); track img; let i = $index) {
                            <div class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                <img [src]="img" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Repair image" />
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <button type="button" (click)="onRemoveImage.emit(i)" class="btn btn-circle btn-sm btn-error text-white shadow-xl hover:scale-110">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    </div>
  `
})
export class RepairPartsSectionComponent {
  parts = input.required<any[]>();
  technicianNotes = input<string>('');
  technicalReport = input<string>('');
  images = input<string[]>([]);
  uploadingImages = input<boolean>(false);

  onRequestProductModal = output<void>();
  onPartsChange = output<any[]>();
  onRemovePart = output<number>();
  onTechnicianNotesChange = output<string>();
  onTechnicalReportChange = output<string>();
  onFileSelected = output<Event>();
  onRemoveImage = output<number>();
}
