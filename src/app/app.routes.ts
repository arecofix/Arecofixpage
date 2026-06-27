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
        title: 'Upgrade Requerido',
        path: 'upgrade-required',
        loadComponent: () => import('@app/shared/components/upgrade-required/upgrade-required.component').then(m => m.UpgradeRequiredComponent)
    },
    {
        title: 'Pago Requerido',
        path: 'payment-required',
        loadComponent: () => import('@app/public/payment-required/payment-required.component').then(m => m.PaymentRequiredComponent)
    },
    {
        title: 'Home',
        path: '',
        loadChildren: () => import('@app/public/public.routes'),
    },
    {
        title: 'Página no encontrada | Arecofix',
        path: '**',
        loadComponent: () => import('@app/public/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
