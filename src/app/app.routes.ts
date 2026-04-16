import { Routes } from '@angular/router';
import { branchAdminGuard } from '@app/guards/branch-admin.guard';

export const routes: Routes = [
    {
        title: 'Admin',
        path: 'admin',
        loadChildren: () => import('@app/admin/admin.routes').then(m => m.default),
    },
    {
        title: 'Branch Admin',
        path: ':branchSlug/admin',
        canActivate: [branchAdminGuard],
        loadChildren: () => import('@app/admin/admin.routes').then(m => m.default),
    },
    {
        title: 'Home',
        path: '',
        loadChildren: () => import('@app/public/public.routes'),
    },
    {
        title: 'Upgrade Requerido',
        path: 'upgrade-required',
        loadComponent: () => import('@app/shared/components/upgrade-required/upgrade-required.component').then(m => m.UpgradeRequiredComponent)
    },
    {
        path: '**',
        redirectTo: '',
    }
];
