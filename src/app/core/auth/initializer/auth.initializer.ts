import { inject, Injector } from "@angular/core";
import { UserStore } from "./user.store";


export function authInitializer(injector: Injector): () => Promise<void> {
  return () => {
    const userStore = injector.get(UserStore);
    return userStore.load();
  };
}