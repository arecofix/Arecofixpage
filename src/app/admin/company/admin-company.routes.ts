import { Routes } from '@angular/router';

export const ADMIN_COMPANY_ROUTES: Routes = [
  {
    path: '',
    title: 'Empresa',
    loadComponent: () => import('./admin-company-settings-page').then(m => m.AdminCompanySettingsPage)
  }
];
