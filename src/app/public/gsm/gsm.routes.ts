import { Routes } from '@angular/router';
import { GsmComponent } from './gsm.component';
import { authenticatedGuard } from '@app/guards/authenticated.guard';

export const gsmRoutes: Routes = [
  {
    path: '',
    component: GsmComponent,
    canActivate: [authenticatedGuard],
    data: {
      seo: {
        title: 'Bypass iPhone iCloud hasta 16 Pro Max | Oferta Limitada | ARECOFIX',
        description: '¿iPhone bloqueado con iCloud? Solución de Bypass profesional hasta iPhone 16 Pro Max. 100% remoto, seguro y garantizado. ¡Oferta por tiempo limitado para revendedores!',
        imageUrl: '/assets/img/gsm/gsm-og-banner.png',
        url: '/gsm',
        keywords: 'bypass iphone, bypass icloud, desbloqueo icloud, iphone 16 prm bypass, bypass remoto, frp, gsm tools, arecofix',
        type: 'website'
      }
    }
  },
  {
    path: 'imei',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./pages/imei/gsm-imei.component').then(m => m.GsmImeiComponent)
  },
  {
    path: 'server',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./pages/server/gsm-server.component').then(m => m.GsmServerComponent)
  },
  {
    path: 'remote',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./pages/remote/gsm-remote.component').then(m => m.GsmRemoteComponent)
  }
];
