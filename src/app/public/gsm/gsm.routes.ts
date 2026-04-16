import { Routes } from '@angular/router';
import { GsmComponent } from './gsm.component';
import { authenticatedGuard } from '@app/guards/authenticated.guard';

export const gsmRoutes: Routes = [
  {
    path: '',
    component: GsmComponent,
    canActivate: [authenticatedGuard]
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
