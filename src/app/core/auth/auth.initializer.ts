import { Injector } from '@angular/core';
import { UserStore } from './user.store';

/**
 * Loads the current user once at app startup so guards have an
 * accurate `isAuthenticated()` signal before the first navigation.
 */
export function authInitializer(injector: Injector): () => Promise<void> {
  return () => {
    const userStore = injector.get(UserStore);
    return userStore.load();
  };
}
