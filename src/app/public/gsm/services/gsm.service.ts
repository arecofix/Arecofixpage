import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface GsmTool {
  name: string;
  description: string;
  price: string;
  icon: string;
  loginUrl: string; // Renamed from link
}

export interface BrandService {
  name: string;
  logo: string;
  services: string[];
}

export interface DownloadItem {
  name: string;
  version: string;
  size: string;
  downloadUrl: string; // Renamed from link
  icon: string;
  description: string; // Added
}

@Injectable({
  providedIn: 'root'
})
export class GsmService {

  getGsmTools(): Observable<GsmTool[]> {
    return of([
      {
        name: 'UnlockTool',
        description: 'Herramienta profesional para desbloqueo de FRP, Mi Account y Flasheo.',
        price: 'Consultar',
        icon: 'fas fa-unlock-alt',
        loginUrl: 'https://unlocktool.net'
      },
      {
        name: 'Chimera Tool',
        description: 'Soporte multimarca para reparación de IMEI, desbloqueo y más.',
        price: 'Consultar',
        icon: 'fas fa-dragon',
        loginUrl: 'https://chimeratool.com'
      },
      {
        name: 'Z3X Box',
        description: 'Especializada en Samsung y LG. Reparación de IMEI y Flasheo.',
        price: 'Consultar',
        icon: 'fas fa-box-open',
        loginUrl: 'https://z3x-team.com'
      },
      {
        name: 'SigmaKey',
        description: 'Solución para Huawei, Motorola y otras marcas MTK/Qualcomm.',
        price: 'Consultar',
        icon: 'fas fa-key',
        loginUrl: 'https://sigmakey.com'
      }
    ]);
  }

  getBrandServices(): Observable<BrandService[]> {
    return of([
      {
        name: 'Apple',
        logo: 'fab fa-apple',
        services: ['iCloud Bypass', 'FMI Off', 'Carrier Unlock']
      },
      {
        name: 'Samsung',
        logo: 'fab fa-android', // Using android icon as generic for Samsung if brand icon not available
        services: ['FRP Unlock', 'KG Unlock', 'Network Unlock']
      },
      {
        name: 'Xiaomi',
        logo: 'fas fa-mobile',
        services: ['Mi Account Remove', 'Bootloader Unlock', 'Unbrick']
      },
      {
        name: 'Motorola',
        logo: 'fas fa-mobile-alt',
        services: ['FRP Reset', 'Repair IMEI', 'Flash Firmware']
      }
    ]);
  }

  getDownloads(): Observable<DownloadItem[]> {
    return of([
      {
        name: 'Samsung USB Drivers',
        version: 'v1.7.59',
        size: '35 MB',
        downloadUrl: 'https://developer.samsung.com/android-usb-driver',
        icon: 'fab fa-usb',
        description: 'Drivers oficiales para dispositivos Samsung.'
      },
      {
        name: 'Odin Flash Tool',
        version: 'v3.14.4',
        size: '2.5 MB',
        downloadUrl: 'https://odindownload.com/',
        icon: 'fas fa-bolt',
        description: 'Herramienta de flasheo para Samsung.'
      },
      {
        name: 'Xiaomi ADB/Fastboot Tools',
        version: 'v7.0.3',
        size: '15 MB',
        downloadUrl: 'https://github.com/Szaki/XiaomiADBFastbootTools',
        icon: 'fas fa-tools',
        description: 'Herramienta para gestionar dispositivos Xiaomi.'
      },
      {
        name: 'Platform Tools (ADB/Fastboot)',
        version: 'Latest',
        size: '12 MB',
        downloadUrl: 'https://developer.android.com/studio/releases/platform-tools',
        icon: 'fas fa-terminal',
        description: 'Herramientas de línea de comandos del SDK de Android.'
      }
    ]);
  }
}
