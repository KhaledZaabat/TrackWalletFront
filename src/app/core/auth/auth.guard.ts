// authGuard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './initializer/user.store';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router    = inject(Router);

  if (userStore.isAuthenticated()) {
    return true; 
  }
return router.createUrlTree(['/']);

}
