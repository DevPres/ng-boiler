import { Routes } from "@angular/router";

export const routes: Routes = [
  { 
      path: 'home',
      loadChildren: () => import('@pages/home/').then(m => m.routes)  
  },
  { 
      path: '', 
      redirectTo: 'home',
      pathMatch: 'full' 
  },


];

