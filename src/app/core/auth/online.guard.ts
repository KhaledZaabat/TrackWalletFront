import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user.store';

export const onlineGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router    = inject(Router);

  if (userStore.isOffline()) {
    return router.createUrlTree(['/offline']);
  }

  return true;
};
