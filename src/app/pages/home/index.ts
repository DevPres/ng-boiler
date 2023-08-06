import { Routes } from '@angular/router';

export const routes: Routes = [
        { 
            path: '', 
            title: 'home', 
            loadComponent: 
                () => import('@pages/home/home.component').then(m => m.HomeComponent)
        }
    ];

