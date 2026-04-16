import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repair-customer-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800/50 rounded-4xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800/50 relative overflow-hidden group hover:border-emerald-100 transition-colors">
        <div class="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-blue-400 to-indigo-500 opacity-80"></div>
        
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-lg shadow-inner">
                <i class="fas fa-user-astronaut"></i>
            </div>
            <h2 class="text-xl text-gray-800 dark:text-white font-bold">Datos del Cliente</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">Nombre Completo</span></label>
                <div class="relative group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400 group-focus-within/input:text-blue-500 transition-colors"></i>
                    </div>
                    <input type="text" [ngModel]="customerName()" (ngModelChange)="onNameChange.emit($event)" 
                        name="customer_name" class="input input-bordered pl-11 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-200" list="repair-clients-list" placeholder="Seleccionar en cartera..." required autocomplete="off" />
                </div>
                <datalist id="repair-clients-list">
                    @for (client of clients(); track client.id) {
                        <option [value]="client.displayName">{{ client.phone ? client.phone + ' - ' : '' }}{{ client.email }}</option>
                    }
                </datalist>
            </div>
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">Whatsapp / Teléfono</span></label>
                <div class="relative group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fab fa-whatsapp text-gray-400 group-focus-within/input:text-green-500 transition-colors"></i>
                    </div>
                    <input type="tel" [ngModel]="customerPhone()" (ngModelChange)="onPhoneChange.emit($event)" name="customer_phone" class="input input-bordered pl-11 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-200" placeholder="+54 9..." />
                </div>
            </div>
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">Correo Electrónico <span class="text-xs font-normal text-gray-400">(Opcional)</span></span></label>
                <div class="relative group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-envelope text-gray-400 group-focus-within/input:text-blue-500 transition-colors"></i>
                    </div>
                    <input type="email" [ngModel]="customerEmail()" (ngModelChange)="onEmailChange.emit($event)" name="customer_email" class="input input-bordered pl-11 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-200" placeholder="cliente@email.com" />
                </div>
            </div>
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-600 dark:text-gray-300">DNI <span class="text-xs font-normal text-gray-400">(Opcional)</span></span></label>
                <div class="relative group/input">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-id-card text-gray-400 group-focus-within/input:text-blue-500 transition-colors"></i>
                    </div>
                    <input type="text" [ngModel]="customerDni()" (ngModelChange)="onDniChange.emit($event)" name="customer_dni" class="input input-bordered pl-11 w-full rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-200" placeholder="Ej. 30123456" />
                </div>
            </div>
        </div>
    </div>
  `
})
export class RepairCustomerSectionComponent {
  customerName = input.required<string>();
  customerPhone = input<string>('');
  customerEmail = input<string>('');
  customerDni = input<string>('');
  clients = input<any[]>([]);

  onNameChange = output<string>();
  onPhoneChange = output<string>();
  onEmailChange = output<string>();
  onDniChange = output<string>();
}
