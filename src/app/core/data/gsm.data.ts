import { GsmTool, BrandService, DownloadItem } from '@app/public/gsm/services/gsm.service';

import { environment } from 'src/environments/environment';

export const GSM_TOOLS: GsmTool[] = [
  {
    name: 'UnlockTool',
    description: 'Herramienta profesional para desbloqueo de FRP, Mi Account y Flasheo.',
    price: 'Consultar',
    icon: 'fas fa-unlock-alt',
    loginUrl: environment.externalUrls.gsm.unlocktool
  },
  {
    name: 'Chimera Tool',
    description: 'Soporte multimarca para reparación de IMEI, desbloqueo y más.',
    price: 'Consultar',
    icon: 'fas fa-dragon',
    loginUrl: environment.externalUrls.gsm.chimeratool
  },
  {
    name: 'Z3X Box',
    description: 'Especializada en Samsung y LG. Reparación de IMEI y Flasheo.',
    price: 'Consultar',
    icon: 'fas fa-box-open',
    loginUrl: environment.externalUrls.gsm.z3x_team
  },
  {
    name: 'SigmaKey',
    description: 'Solución para Huawei, Motorola y otras marcas MTK/Qualcomm.',
    price: 'Consultar',
    icon: 'fas fa-key',
    loginUrl: environment.externalUrls.gsm.sigmakey
  }
];

export const BRAND_SERVICES: BrandService[] = [
  {
    name: 'Apple',
    logo: 'fab fa-apple',
    services: ['iCloud Bypass', 'FMI Off', 'Carrier Unlock']
  },
  {
    name: 'Samsung',
    logo: 'fab fa-android',
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
];

// Note: Ensure interfaces are exported from a shared location if circular dependency occurs. 
// For now, I will import them from the service to avoid breaking types, 
// but ideally interfaces should live in a separate .model.ts or .interface.ts file.
