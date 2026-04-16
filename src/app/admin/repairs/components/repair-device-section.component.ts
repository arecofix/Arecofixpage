import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repair-device-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800/50 rounded-4xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/50 relative overflow-hidden group hover:border-emerald-100 transition-colors">
        <div class="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-purple-400 to-fuchsia-500 opacity-80"></div>
        
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-lg shadow-inner">
                <i class="fas fa-microchip"></i>
            </div>
            <h2 class="text-xl text-gray-800 dark:text-white font-bold">Diagnóstico y Equipo</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">Modelo del Equipo</span></label>
                <input type="text" [ngModel]="deviceModel()" (ngModelChange)="onDeviceModelChange.emit($event)" name="device_model" class="input input-bordered w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-gray-800 dark:text-white" required placeholder="Ej: iPhone 13 Pro Max" />
            </div>
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">IMEI o N° Serie</span></label>
                <div class="relative group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-barcode text-gray-400 group-focus-within/input:text-purple-500 transition-colors"></i>
                    </div>
                    <input type="text" [ngModel]="imei()" (ngModelChange)="onImeiChange.emit($event)" name="imei" class="input input-bordered pl-11 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-mono text-gray-600 dark:text-gray-300 tracking-wider" placeholder="Opcional..." />
                </div>
            </div>
        </div>

        <div class="form-control mb-8">
            <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">Motivo de Ingreso / Fallas reportadas</span></label>
            <textarea [ngModel]="issueDescription()" (ngModelChange)="onIssueDescriptionChange.emit($event)" name="issue_description" class="textarea textarea-bordered h-28 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-700 dark:text-gray-200 leading-relaxed resize-none" placeholder="El cliente indica que la pantalla no enciende, pero vibra al conectarlo al cargador..."></textarea>
        </div>

        <!-- Estado y Seguridad -->
        <div class="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2"><i class="fas fa-lock text-gray-400"></i> Protocolo de Seguridad</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="form-control">
                    <input type="text" [ngModel]="securityPin()" (ngModelChange)="onSecurityPinChange.emit($event)" name="security_pin" class="input input-sm input-bordered rounded-xl text-center font-bold tracking-[0.2em] bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" placeholder="PIN EJ: 1234" />
                </div>
                <div class="form-control">
                    <input type="text" [ngModel]="securityPattern()" (ngModelChange)="onSecurityPatternChange.emit($event)" name="security_pattern" class="input input-sm input-bordered rounded-xl text-center font-medium bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" placeholder="Patrón: (L, Z, M)" />
                </div>
                <div class="form-control">
                    <input type="text" [ngModel]="devicePasscode()" (ngModelChange)="onDevicePasscodeChange.emit($event)" name="device_passcode" class="input input-sm input-bordered rounded-xl text-center font-medium bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-xs" placeholder="Passcode Texto" />
                </div>
            </div>

            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 mt-2"><i class="fas fa-box text-gray-400"></i> Inventario de Recepción</h3>
            
            <div class="flex flex-wrap gap-2.5">
                <label class="cursor-pointer select-none transition-all duration-200 border rounded-xl px-4 py-2 flex items-center gap-2 "
                    [ngClass]="checklist().charger ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm scale-105' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300'">
                    <input type="checkbox" [(ngModel)]="checklist().charger" name="check_charger" class="hidden" (change)="onChecklistChange.emit(checklist())" />
                    <i class="fas" [ngClass]="checklist().charger ? 'fa-check-circle text-indigo-500' : 'fa-circle text-gray-300'"></i> <span class="font-medium text-sm">Cargador</span>
                </label>
                
                <label class="cursor-pointer select-none transition-all duration-200 border rounded-xl px-4 py-2 flex items-center gap-2"
                    [ngClass]="checklist().battery ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm scale-105' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300'">
                    <input type="checkbox" [(ngModel)]="checklist().battery" name="check_battery" class="hidden" (change)="onChecklistChange.emit(checklist())" />
                    <i class="fas" [ngClass]="checklist().battery ? 'fa-check-circle text-indigo-500' : 'fa-circle text-gray-300'"></i> <span class="font-medium text-sm">Batería extraíble</span>
                </label>
                
                <label class="cursor-pointer select-none transition-all duration-200 border rounded-xl px-4 py-2 flex items-center gap-2"
                    [ngClass]="checklist().chip ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm scale-105' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300'">
                    <input type="checkbox" [(ngModel)]="checklist().chip" name="check_chip" class="hidden" (change)="onChecklistChange.emit(checklist())" />
                    <i class="fas" [ngClass]="checklist().chip ? 'fa-check-circle text-indigo-500' : 'fa-circle text-gray-300'"></i> <span class="font-medium text-sm">SIM / NanoSIM</span>
                </label>
                
                <label class="cursor-pointer select-none transition-all duration-200 border rounded-xl px-4 py-2 flex items-center gap-2"
                    [ngClass]="checklist().sd ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm scale-105' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300'">
                    <input type="checkbox" [(ngModel)]="checklist().sd" name="check_sd" class="hidden" (change)="onChecklistChange.emit(checklist())" />
                    <i class="fas" [ngClass]="checklist().sd ? 'fa-check-circle text-indigo-500' : 'fa-circle text-gray-300'"></i> <span class="font-medium text-sm">MicroSD</span>
                </label>
                
                <label class="cursor-pointer select-none transition-all duration-200 border rounded-xl px-4 py-2 flex items-center gap-2"
                    [ngClass]="checklist().case ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm scale-105' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300'">
                    <input type="checkbox" [(ngModel)]="checklist().case" name="check_case" class="hidden" (change)="onChecklistChange.emit(checklist())" />
                    <i class="fas" [ngClass]="checklist().case ? 'fa-check-circle text-indigo-500' : 'fa-circle text-gray-300'"></i> <span class="font-medium text-sm">Funda</span>
                </label>
            </div>
        </div>
    </div>
  `
})
export class RepairDeviceSectionComponent {
  deviceModel = input.required<string>();
  imei = input<string>('');
  issueDescription = input<string>('');
  securityPin = input<string>('');
  securityPattern = input<string>('');
  devicePasscode = input<string>('');
  checklist = input<any>({
    charger: false,
    battery: false,
    chip: false,
    sd: false,
    case: false
  });

  onDeviceModelChange = output<string>();
  onImeiChange = output<string>();
  onIssueDescriptionChange = output<string>();
  onSecurityPinChange = output<string>();
  onSecurityPatternChange = output<string>();
  onDevicePasscodeChange = output<string>();
  onChecklistChange = output<any>();
}
