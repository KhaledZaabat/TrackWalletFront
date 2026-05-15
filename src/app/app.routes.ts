import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/home/home')
      .then(m => m.Homecomponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
          .then(m => m.DashboardComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
