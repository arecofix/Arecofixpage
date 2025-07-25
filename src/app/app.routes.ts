import { Routes } from '@angular/router';
import { Nosotros } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';
import { Servicios } from './pages/servicios/servicios';
import { Repuestos } from './pages/repuestos/repuestos';
import { Cursos } from './pages/cursos/cursos';

export const routes: Routes = [
    {
        title: 'Home',
        path: '',
        loadChildren: () => import('@app/public/public.routes'),
    },
        {path: 'nosotros', component: Nosotros }, 
        {path: 'contacto', component: ContactoComponent },
        {path: 'servicios', component: Servicios },
        {path: 'repuestos', component: Repuestos },
        {path: 'cursos', component: Cursos },
];
