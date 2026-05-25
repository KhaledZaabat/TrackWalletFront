import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user.store';


export const guestGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  if (userStore.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
