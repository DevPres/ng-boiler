import { Routes } from "@angular/router";
import { PageNotFoundComponent } from "@pages/page-not-found.component";

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  { 
      path: 'home',
      loadChildren: () => import('@pages/home/').then(m => m.routes)  
  },
  {
      path: "**",
      loadComponent: () => import('@pages/page-not-found.component').then(m => m.PageNotFoundComponent)
  }
];

