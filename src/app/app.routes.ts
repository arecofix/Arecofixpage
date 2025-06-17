import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
    {path: '', component: Home },
    {path: 'nosotros', component: About }, 
    {path: 'productos', component: Products },
    {path: 'contacto', component: Contact },
    {path: '**', redirectTo: ''},   
];
