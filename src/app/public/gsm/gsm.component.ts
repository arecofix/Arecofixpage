import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

interface GsmTool {
  name: string;
  description: string;
  icon: string;
  loginUrl?: string;
}

interface BrandService {
  name: string;
  logo?: string;
}

interface Download {
  name: string;
  description?: string;
  downloadUrl?: string;
  icon: string;
}

@Component({
  selector: 'app-gsm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gsm.component.html',
  styleUrl: './gsm.component.css',
})
export class GsmComponent implements OnInit {

  gsmTools: GsmTool[] = [
    {
      name: 'Octoplus FRP Digital',
      description: 'Solución profesional para servicio de LG, Samsung y otros.',
      icon: 'fas fa-mobile-alt',
      loginUrl: '#'
    },
    {
      name: 'Borneo Schematics',
      description: 'Solución de esquemáticos y hardware para técnicos.',
      icon: 'fas fa-project-diagram',
      loginUrl: '#'
    },
    {
      name: 'DFT Pro Tool',
      description: 'Herramienta profesional para servicios en dispositivos Android.',
      icon: 'fab fa-android',
      loginUrl: '#'
    },
    {
      name: 'SigmaKey',
      description: 'Herramienta de flasheo y desbloqueo para múltiples marcas.',
      icon: 'fas fa-key',
      loginUrl: '#'
    },
    {
      name: 'UMT Pro Digital',
      description: 'Ultimate Multi Tool para servicio de móviles.',
      icon: 'fas fa-toolbox',
      loginUrl: '#'
    },
    {
      name: 'Pandora Tool',
      description: 'Herramienta de Z3X Team para dispositivos Mediatek.',
      icon: 'fas fa-box-open',
      loginUrl: '#'
    },
    {
      name: 'DFT Tool Pro',
      description: 'Herramienta avanzada para flasheo y reparación de software.',
      icon: 'fas fa-download',
      loginUrl: '#'
    },
    {
      name: 'TSM Pro',
      description: 'Herramienta de servicio para dispositivos Samsung.',
      icon: 'fas fa-mobile',
      loginUrl: '#'
    },
    {
      name: 'Chimera Tool',
      description: 'Herramienta de servicio universal para una amplia gama de teléfonos.',
      icon: 'fas fa-wrench',
      loginUrl: '#'
    },
    {
      name: 'UnlockTool',
      description: 'Potente herramienta para desbloqueo y reparación de múltiples marcas.',
      icon: 'fas fa-unlock-alt',
      loginUrl: '#'
    },
    {
      name: 'Cheetah Tool',
      description: 'Herramienta de servicio para dispositivos Qualcomm y Mediatek.',
      icon: 'fas fa-bolt',
      loginUrl: '#'
    },
    {
      name: 'TFM Tool Pro',
      description: 'Software de servicio para dispositivos Mediatek, Qualcomm y más.',
      icon: 'fas fa-cogs',
      loginUrl: '#'
    },
    {
      name: 'MRT Tool',
      description: 'Mobile Repair Tool, especializada en marcas chinas.',
      icon: 'fas fa-tools',
      loginUrl: '#'
    },
    {
      name: 'EFT Pro Dongle',
      description: 'Easy-Firmware Team Dongle para desbloqueo y reparación.',
      icon: 'fas fa-usb',
      loginUrl: '#'
    },
    {
      name: 'e-GSM Tool',
      description: 'Solución de software para reparación y mantenimiento de móviles.',
      icon: 'fas fa-laptop-code',
      loginUrl: '#'
    },
    {
      name: 'Hydra Tool',
      description: 'Herramienta todo en uno para una gran variedad de CPUs.',
      icon: 'fas fa-microchip',
      loginUrl: '#'
    },
    {
      name: 'GCPro Key',
      description: 'Herramienta para servicio de Samsung, LG, Huawei y más.',
      icon: 'fas fa-shield-alt',
      loginUrl: '#'
    },
    {
      name: 'NCK Pro Digital',
      description: 'Herramienta de servicio para una gran variedad de CPUs.',
      icon: 'fas fa-server',
      loginUrl: '#'
    }
  ];

  brandServices: BrandService[] = [
    { name: 'BLU' },
    { name: 'Hisense' },
    { name: 'Infinix' },
    { name: 'Motorola' },
    { name: 'Oppo' },
    { name: 'Realme' },
    { name: 'Samsung' },
    { name: 'TCL' },
    { name: 'Tecno' },
    { name: 'Vivo' },
    { name: 'Xiaomi' },
    { name: 'ZTE' }
  ];

  downloads: Download[] = [
    {
      name: '3uTools',
      description: 'Herramienta completa para dispositivos iOS',
      icon: 'fab fa-apple',
      downloadUrl: '#'
    },
    {
      name: 'Redirector 1.9.7',
      description: 'Herramienta de redirección',
      icon: 'fas fa-exchange-alt',
      downloadUrl: '#'
    },
    {
      name: 'AnyDesk',
      description: 'Software de escritorio remoto',
      icon: 'fas fa-desktop',
      downloadUrl: '#'
    },
    {
      name: 'Drivers MTK SPD',
      description: 'Drivers para dispositivos Mediatek y Spreadtrum',
      icon: 'fas fa-hdd',
      downloadUrl: '#'
    },
    {
      name: 'VirtualHere Client',
      description: 'Cliente USB sobre red',
      icon: 'fas fa-network-wired',
      downloadUrl: '#'
    },
    {
      name: 'UltraViewer',
      description: 'Software de control remoto',
      icon: 'fas fa-eye',
      downloadUrl: '#'
    },
    {
      name: 'Tool Bypass ARECOFIX A12 2.0',
      description: 'Herramienta de bypass para Android 12',
      icon: 'fas fa-unlock',
      downloadUrl: '#'
    },
    {
      name: 'Tool Activator A12+ XR to 17P MAX',
      description: 'Activador para dispositivos Android 12+',
      icon: 'fas fa-check-circle',
      downloadUrl: '#'
    }
  ];

  whatsappUrl = 'https://wa.me/541125960900?text=Hola,%20necesito%20ayuda%20con%20herramientas%20GSM';

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    // SEO Optimization
    this.titleService.setTitle('Herramientas GSM Profesionales - Licencias Digitales | ARECOFIX');

    this.metaService.addTags([
      { name: 'description', content: 'Plataforma integral para técnicos GSM con herramientas profesionales, licencias digitales, servicios FRP y descargas útiles. ARECOFIX - Tu socio en reparación de móviles.' },
      { name: 'keywords', content: 'GSM, herramientas GSM, FRP, licencias digitales, reparación móviles, Octoplus, SigmaKey, UMT Pro, desbloqueo, flasheo, técnicos móviles' },
      { name: 'author', content: 'ARECOFIX' },
      { property: 'og:title', content: 'Herramientas GSM Profesionales | ARECOFIX' },
      { property: 'og:description', content: 'Accede a las mejores herramientas GSM, licencias digitales y recursos para técnicos profesionales.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://arecofix.com.ar/#/gsm' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Herramientas GSM Profesionales | ARECOFIX' },
      { name: 'twitter:description', content: 'Plataforma integral para técnicos GSM con herramientas profesionales y licencias digitales.' }
    ]);
  }
}
