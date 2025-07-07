import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        title: 'Home',
        path: '',
        loadChildren: () => import('@app/public/public.routes'),
        
    }
];
