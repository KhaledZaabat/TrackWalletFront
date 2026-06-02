import { Routes } from '@angular/router';
import { authGuard, guestGuard, onlineGuard } from './core/auth';

export const routes: Routes = [
  {

    path: '',
    canActivate: [onlineGuard],
    children: [
      {
        path: '',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
      },
      {
        path: 'confirmation-email-sent',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/email-sent/email-sent').then(
            (m) => m.ConfirmationEmailSentComponent,
          ),
      },
      {
        path: '',
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
          },
        ],
      },
    ],
  },
  {
    // No onlineGuard here — always reachable so the user can retry.
    path: 'offline',
    loadComponent: () => import('./features/offline/offline').then((m) => m.OfflineComponent),
  },
  { path: '**', redirectTo: '' },
];
