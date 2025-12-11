import { GsmTool, BrandService, DownloadItem } from '@app/public/gsm/services/gsm.service';

export const GSM_TOOLS: GsmTool[] = [
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
