import { Routes } from '@angular/router';

export const ADMIN_MESSAGES_ROUTES: Routes = [
  {
    path: '',
    title: 'Mensajes',
    loadComponent: () => import('./admin-messages-page').then(m => m.AdminMessagesPage)
  }
];
