import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    title: 'home', 
    loadComponent: 
        () => import('@pages/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'dashboard', 
        loadComponent: 
            () => import('@pages/home/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'info',
        loadComponent:
          () => import('@pages/home/info/info.component').then(m => m.InfoComponent),
      },
    ]
  }
];

