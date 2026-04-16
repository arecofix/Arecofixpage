import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferencesService } from '@app/shared/services/preferences.service';
import { inject } from '@angular/core';

interface ImeiService {
  name: string;
  category: string;
  price: number;
  time: string;
  icon?: string;
}

@Component({
  selector: 'app-gsm-imei',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gsm-imei.component.html',
})
export class GsmImeiComponent {
  preferencesService = inject(PreferencesService);
  
  categories = [
    '✨CHECK INFORMACION (GENERAL)✨',
    '✨APPLE IPHONE - USA T-MOBILE / METRO PCS / SPRINT - UNLOCK [ALL STATUS] [PREMIUM]✨',
    '✨HONOR & HUAWEI FRP UNLOCK CODE✨',
    '✨FRPFILE TOOL✨',
    '✨PROMO A12+ XR AL 16 PRO MAX + IPADS✨',
    '✨REPORTE DE IMEI - AGREGAR A BLACKLIST (GSMA MUNDIAL)✨',
    '✨XIAOMI - QUITAR BLOQUEO DE CUENTA MI✨',
    '✨FRP SAMSUNG - QUITAR BLOQUEO DE CUENTA GOOGLE FRP ✨'
  ];

  services: ImeiService[] = [
    { name: 'Check Apple Carrier, SIMLock Status Server 2 (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.24, time: 'Instant' },
    { name: 'Check Apple Carrier, SIMLock, Blacklist Status (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.24, time: 'Instant' },
    { name: 'Check Apple Convertir IMEI ⇄ IMEI2 ⇄ Serial Number (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.18, time: 'Instant' },
    { name: 'Check Apple FMI ON/OFF Status Pro (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.18, time: 'Instant' },
    { name: 'Check Apple FMI ON/OFF/Clean/Lost Status (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.13, time: 'Instant' },
    { name: 'Check Apple Garantia, Estado de Activacion (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.18, time: 'Instant' },
    { name: 'Check Apple Pais de Compra (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.18, time: 'Instant' },
    { name: 'Check Apple Pro Information (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 1.2, time: 'Instant' },
    { name: 'Check Samsung Info + Knox Status (IMEI/SN)', category: '✨CHECK INFORMACION (GENERAL)✨', price: 0.3, time: 'Instant' },
    { name: 'Check Xiaomi Información Completa de Bloqueo (Premium)', category: '✨XIAOMI - QUITAR BLOQUEO DE CUENTA MI✨', price: 0.96, time: 'Instant' },
    { name: 'Xiaomi Argentina - Quitar Bloqueo Clean', category: '✨XIAOMI - QUITAR BLOQUEO DE CUENTA MI✨', price: 25.68, time: '1-24 Hours' },
    { name: 'Xiaomi Latinoamerica - Quitar Bloqueo Clean', category: '✨XIAOMI - QUITAR BLOQUEO DE CUENTA MI✨', price: 26.28, time: '1-48 Hours' },
    { name: 'Xiaomi Mexico - Quitar Bloqueo Clean', category: '✨XIAOMI - QUITAR BLOQUEO DE CUENTA MI✨', price: 6, time: '10-60 Min' },
    { name: 'USA T-Mobile / MetroPCS - Unlock iPhone 15 Series [PREMIUM]', category: '✨APPLE IPHONE - USA T-MOBILE / METRO PCS / SPRINT - UNLOCK [ALL STATUS] [PREMIUM]✨', price: 0, time: '1-24 Hours' },
    { name: 'USA T-Mobile / MetroPCS - Unlock iPhone 16 Series [PREMIUM]', category: '✨APPLE IPHONE - USA T-MOBILE / METRO PCS / SPRINT - UNLOCK [ALL STATUS] [PREMIUM]✨', price: 0, time: '1-24 Hours' },
    { name: 'Honor / Huawei FRP Key Code Por SN - Todos los Modelos', category: '✨HONOR & HUAWEI FRP UNLOCK CODE✨', price: 30.6, time: '12 Hours' },
    { name: '⚡FRPFILE Premium Tool ✔ [Bypass iCloud/Passcode]', category: '✨FRPFILE TOOL✨', price: 3, time: 'Instant' },
    { name: '⚡FRPFILE RAMDISK ✔ [Bypass Hello / Broken Baseband]', category: '✨FRPFILE TOOL✨', price: 4.2, time: 'Instant' },
    { name: '⚡PROMO HFZ (A12+) ✔ [XR a 16 Pro Max + iPads]', category: '✨PROMO A12+ XR AL 16 PRO MAX + IPADS✨', price: 5.04, time: 'Instant' },
    { name: '⚡PROMO iRemoval Pro (A12+) ✔ [XR a 16 Pro Max + iPads]', category: '✨PROMO A12+ XR AL 16 PRO MAX + IPADS✨', price: 7.8, time: 'Instant' },
    { name: '⚡PROMO iRemove (A12+) ✔ [XR a 16 Pro Max + iPads]', category: '✨PROMO A12+ XR AL 16 PRO MAX + IPADS✨', price: 9, time: 'Instant' },
    { name: '⚡FRP Samsung por IMEI [Nivel 3] ✔ [Android 14]', category: '✨FRP SAMSUNG - QUITAR BLOQUEO DE CUENTA GOOGLE FRP ✨', price: 19.215, time: 'Instant' }
  ];

  getServicesByCategory(cat: string) {
    return this.services.filter(s => s.category === cat);
  }
}
