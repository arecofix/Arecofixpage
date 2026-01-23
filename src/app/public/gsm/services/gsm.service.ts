import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GSM_TOOLS, BRAND_SERVICES } from '@app/core/data/gsm.data';
import { environment } from 'src/environments/environment';

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
    return of(GSM_TOOLS);
  }

  getBrandServices(): Observable<BrandService[]> {
    return of(BRAND_SERVICES);
  }

  getDownloads(): Observable<DownloadItem[]> {
    return of([
      {
        name: 'Samsung USB Drivers',
        version: 'v1.7.59',
        size: '35 MB',
        downloadUrl: environment.externalUrls.gsm['samsung_usb'],
        icon: 'fab fa-usb',
        description: 'Drivers oficiales para dispositivos Samsung.'
      },
      {
        name: 'Odin Flash Tool',
        version: 'v3.14.4',
        size: '2.5 MB',
        downloadUrl: environment.externalUrls.gsm['odin'],
        icon: 'fas fa-bolt',
        description: 'Herramienta de flasheo para Samsung.'
      },
      {
        name: 'Xiaomi ADB/Fastboot Tools',
        version: 'v7.0.3',
        size: '15 MB',
        downloadUrl: environment.externalUrls.gsm['xiaomi_adb'],
        icon: 'fas fa-tools',
        description: 'Herramienta para gestionar dispositivos Xiaomi.'
      },
      {
        name: 'Platform Tools (ADB/Fastboot)',
        version: 'Latest',
        size: '12 MB',
        downloadUrl: environment.externalUrls.gsm['platform_tools'],
        icon: 'fas fa-terminal',
        description: 'Herramientas de línea de comandos del SDK de Android.'
      },
      {
        name: 'FlexiHub',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['flexihub'],
        icon: 'fas fa-network-wired',
        description: 'Acceso remoto a dispositivos USB y puertos COM.'
      },
      {
        name: 'Radmin VPN',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['radmin_vpn'],
        icon: 'fas fa-shield-alt',
        description: 'Red privada virtual segura y fácil de usar.'
      },
      {
        name: 'USB Redirector 2.5',
        version: 'v2.5',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['usb_redirector'], // Assuming same base URL for now or need separate if different
        icon: 'fas fa-plug',
        description: 'Redirección de dispositivos USB por red.'
      },
      {
        name: 'USB Redirector 1.9.7',
        version: 'v1.9.7',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['usb_redirector'],
        icon: 'fas fa-plug',
        description: 'Versión legacy para compatibilidad específica.'
      },
      {
        name: 'RustDesk',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['rustdesk'],
        icon: 'fas fa-desktop',
        description: 'Software de escritorio remoto de código abierto.'
      },
      {
        name: 'TeamViewer',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['teamviewer'],
        icon: 'fas fa-exchange-alt',
        description: 'Solución líder para soporte remoto.'
      },
      {
        name: 'UltraViewer',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['ultraviewer'],
        icon: 'fas fa-eye',
        description: 'Control remoto de escritorio alternativo.'
      },
      {
        name: 'Psiphon',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['psiphon'],
        icon: 'fas fa-globe',
        description: 'Herramienta de elusión de censura en Internet.'
      },
      {
        name: 'AnyDesk',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['anydesk'],
        icon: 'fas fa-laptop-house',
        description: 'Aplicación de escritorio remoto rápida.'
      },
      {
        name: 'VirtualHere Client',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['virtualhere'],
        icon: 'fas fa-server',
        description: 'Cliente para compartir USB sobre IP.'
      },
      {
        name: 'SamFw Tool',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['samfw'],
        icon: 'fab fa-android',
        description: 'Herramienta gratuita para Samsung FRP y más.'
      },
      {
        name: 'SamFirm',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['samfirm'],
        icon: 'fas fa-download',
        description: 'Descarga firmwares oficiales de Samsung.'
      },
      {
        name: '3uTools',
        version: 'Latest',
        size: '-',
        downloadUrl: environment.externalUrls.gsm['tres_u_tools'],
        icon: 'fab fa-apple',
        description: 'Herramienta todo en uno para dispositivos iOS.'
      }
    ]);
  }
}
