import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user.store';

/**
 * Blocks access to authenticated-only routes.
 * If the user is not authenticated, redirects to /login and preserves
 * the originally requested URL via `?redirectTo=`.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  if (userStore.isAuthenticated()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url },
  });
};
