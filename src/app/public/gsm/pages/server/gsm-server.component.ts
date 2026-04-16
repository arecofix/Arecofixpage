import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferencesService } from '@app/shared/services/preferences.service';
import { inject } from '@angular/core';

interface ServerService {
  name: string;
  category: string;
  price: number;
  time: string;
}

@Component({
  selector: 'app-gsm-server',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gsm-server.component.html',
})
export class GsmServerComponent {
  preferencesService = inject(PreferencesService);

  services: ServerService[] = [
    { name: 'TheMagicTool - Usuario Existente', category: 'TheMagicTool', price: 1.14, time: 'Instant' },
    { name: 'TheMagicTool - Usuario Nuevo', category: 'TheMagicTool', price: 1.14, time: 'Instant' },
    { name: 'DZKJ Schematics Tools - 1 Año - 3 PC', category: 'DZKJ Tool - Schematics', price: 40.8, time: 'Instant' },
    { name: 'DZKJ Schematics Tools - 3 Años - 3 PC', category: 'DZKJ Tool - Schematics', price: 76.68, time: 'Instant' },
    { name: 'DZKJ Schematics Tools - 3 Meses - 3 PC', category: 'DZKJ Tool - Schematics', price: 11.39, time: 'Instant' },
    { name: 'EFT Dongle - 1 Año (Activacion)', category: 'EFT Tool', price: 24.84, time: 'Instant' },
    { name: 'EFT Dongle - 2 Años (Activacion)', category: 'EFT Tool', price: 33.24, time: 'Instant' },
    { name: 'EFT Pro Tool - 1 Año - Sin Dongle', category: 'EFT Tool', price: 61.86, time: '1-5 Min' },
    { name: 'Hydra Tool - 12 Meses - Sin Dongle', category: 'Hydra Tool', price: 47.4, time: '1-5 Min' },
    { name: 'Hydra Tool - 3 Meses - Sin Dongle', category: 'Hydra Tool', price: 20.04, time: '1-5 Min' },
    { name: 'Sigma Plus (Box/Dongle) - 12 Meses', category: 'Sigma Plus', price: 66.6, time: 'Instant' },
    { name: 'Borneo Schematics 1 PC - 12 Meses', category: 'Borneo Schematics', price: 41.28, time: 'Instant' },
    { name: 'Borneo Schematics 2 PC - 12 Meses', category: 'Borneo Schematics', price: 59.28, time: 'Instant' },
    { name: 'UnlockTool - 12 Meses', category: 'UnlockTool', price: 48, time: '1-6 Hours' },
    { name: 'UnlockTool - 3 Meses', category: 'UnlockTool', price: 19.191, time: '1-6 Hours' },
    { name: 'Chimera Tool Basic - 12 Meses', category: 'Chimera Tool', price: 110.76, time: 'Instant' },
    { name: 'Chimera Tool Professional - 12 Meses', category: 'Chimera Tool', price: 165.6, time: 'Instant' },
    { name: 'Chimera Tool Premium - 12 Meses', category: 'Chimera Tool', price: 209.88, time: '1-5 Hours' },
    { name: 'Octoplus Box FRP Activacion', category: 'Octoplus', price: 51.48, time: 'Instant' },
    { name: 'Pandora Box Digital Licencia - 1 Año', category: 'Pandora Box', price: 78.96, time: 'Instant' }
  ];

  getCategories() {
    return Array.from(new Set(this.services.map(s => s.category)));
  }

  getServicesByCategory(cat: string) {
    return this.services.filter(s => s.category === cat);
  }
}
