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
  },
  {
    name: 'Octoplus Box',
    description: 'Líder en LG, Samsung y servicios de JTAG/Especializados.',
    price: 'Consultar',
    icon: 'fas fa-microchip',
    loginUrl: 'https://octoplusbox.com'
  },
  {
    name: 'Hydra Tool',
    description: 'Potente dongle para reparaciones MTK, Qualcomm y Spreadtrum.',
    price: 'Consultar',
    icon: 'fas fa-water',
    loginUrl: 'https://hydra-dongle.com'
  },
  {
    name: 'EFT Pro',
    description: 'Especialista en Samsung (Flash/FRP) y dispositivos Huawei.',
    price: 'Consultar',
    icon: 'fas fa-shield-virus',
    loginUrl: 'https://eft-dongle.com'
  },
  {
    name: 'DFT Pro',
    description: 'Herramienta moderna para Xiaomi, Samsung y procesadores MediaTek.',
    price: 'Consultar',
    icon: 'fas fa-bolt',
    loginUrl: 'https://dftpro.com'
  }
];

export const BRAND_SERVICES: BrandService[] = [
  {
    name: 'Apple',
    logo: 'fab fa-apple',
    services: ['iCloud Bypass', 'FMI Off', 'Carrier Unlock', 'Check GSX']
  },
  {
    name: 'Samsung',
    logo: 'fab fa-android',
    services: ['FRP Unlock', 'KG Unlock', 'MDM Remove', 'Network Unlock']
  },
  {
    name: 'Xiaomi',
    logo: 'fas fa-mobile',
    services: ['Mi Account Remove', 'Bootloader Unlock', 'Auth Flash']
  },
  {
    name: 'Motorola',
    logo: 'fas fa-mobile-alt',
    services: ['FRP Reset', 'Repair IMEI', 'Factory Enabler']
  },
  {
    name: 'Huawei',
    logo: 'fas fa-h-square',
    services: ['Huawei ID Remove', 'FRP Reset', 'OemInfo Change']
  },
  {
    name: 'OPPO / VIVO',
    logo: 'fas fa-mobile',
    services: ['Demo Remove', 'Passcode Reset', 'App Lock']
  },
  {
    name: 'Google Pixel',
    logo: 'fab fa-google',
    services: ['FRP All Models', 'Bootloader Unlock']
  },
  {
    name: 'LG',
    logo: 'fas fa-mobile-alt',
    services: ['Network Unlock', 'FRP Reset']
  }
];

// Note: Ensure interfaces are exported from a shared location if circular dependency occurs. 
// For now, I will import them from the service to avoid breaking types, 
// but ideally interfaces should live in a separate .model.ts or .interface.ts file.
