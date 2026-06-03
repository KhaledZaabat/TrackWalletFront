import { Injector } from "@angular/core";
import { UserStore } from "./store/user.store";

export function authInitializer(injector: Injector): () => void {
  return () => {
    const userStore = injector.get(UserStore);
    userStore.load(); 
  };
}