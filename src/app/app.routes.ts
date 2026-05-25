import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/home/home')
      .then(m => m.HomeComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/Auth/login/login')
      .then(m => m.LoginComponent)
  },
    {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/Auth/register/register')
      .then(m => m.RegisterComponent)
  },
  {
  path: 'confirmation-email-sent',
  canActivate: [guestGuard],
  loadComponent: () => import('./features/Auth/email-sent/email-sent')
    .then(m => m.ConfirmationEmailSentComponent)
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
