import { CanActivateFn, Router } from "@angular/router";
import { UserStore } from "./initializer/user.store";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router    = inject(Router);

  if (userStore.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']); 
  }

  return true; 
};