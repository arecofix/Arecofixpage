import { Routes } from '@angular/router';
import { Nosotros } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
    {
        title: 'Home',
        path: '',
        loadChildren: () => import('@app/public/public.routes'),
    },
        {path: 'nosotros', component: Nosotros }, 
        {path: 'contacto', component: ContactoComponent },  

];
