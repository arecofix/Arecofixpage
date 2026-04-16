import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferencesService } from '@app/shared/services/preferences.service';
import { inject } from '@angular/core';

interface RemoteService {
  name: string;
  category: string;
  price: number;
  time: string;
  stock?: boolean;
}

@Component({
  selector: 'app-gsm-remote',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gsm-remote.component.html',
})
export class GsmRemoteComponent {
  preferencesService = inject(PreferencesService);

  services: RemoteService[] = [
    { name: 'UnlockTool Rent [Time: 6 Hours] Server 1', category: 'UnlockTool - Stock Unlimited', price: 1.2, time: 'Instant', stock: true },
    { name: 'UnlockTool Rent [Time: 6 Hours] Server 2', category: 'UnlockTool - Stock Unlimited', price: 1.44, time: 'Instant', stock: true },
    { name: 'TSM Rent [Time: 12 Hours] Server 1', category: 'TSM - Stock Unlimited', price: 1.32, time: 'Instant', stock: true },
    { name: 'TSM Rent [Time: 10 Hours] Server 2', category: 'TSM - Stock Unlimited', price: 1.68, time: 'Instant', stock: true },
    { name: 'ChimeraTool Rent [Time: 48 Hours]', category: 'Rents - UltraViewer', price: 25.2, time: 'Minutes' },
    { name: 'Pandora Digital Rent [Time: 48 Hours]', category: 'Rents - UltraViewer', price: 9.6, time: '1-30 Minutes' },
    { name: 'Pandora Digital Rent [Time: 80 Days]', category: 'Rents - UltraViewer', price: 27.6, time: 'Minutes' },
    { name: 'DFT Pro Tool Rent (Login Password) [Time: 48 Hours]', category: 'DFT Pro - Stock Unlimited', price: 2.9, time: 'Instant', stock: true },
    { name: 'DFT Pro Tool Rent (Login Password) [Time: 30 Days]', category: 'DFT Pro - Stock Unlimited', price: 16.08, time: '1-60 Min', stock: true },
    { name: 'AnonySHU Rent [ 12 Hours ] V1', category: 'Digital Tools Rents', price: 3.24, time: '1-30 Min' },
    { name: 'MDM FIX TOOL RENT [ 6 Hours ] V1', category: 'Digital Tools Rents', price: 2.88, time: 'Instant' },
    { name: 'Griffin-Unlocker Tool RENT [6 Hours ] V1', category: 'Digital Tools Rents', price: 2.53, time: 'Instant' },
    { name: 'Phoenix Key RENT [ 2 Hours ] V1', category: 'Digital Tools Rents', price: 0.88, time: 'Instant' }
  ];

  getCategories() {
    return Array.from(new Set(this.services.map(s => s.category)));
  }

  getServicesByCategory(cat: string) {
    return this.services.filter(s => s.category === cat);
  }
}
