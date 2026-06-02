import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialState, UserState } from './user-state';
import { AuthService } from '..';
import { isApiError } from '../../../shared/helpers';
import {
  markAuthenticated,
  markIdle,
  markLoading,
  markOffline,
  markUnauthenticated,
} from './user-updaters';
import { RegisterRequest } from '../../../features/auth/register/register.model';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('User'),
  withState<UserState>(initialState),

  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'loaded'),
    isOffline: computed(() => status() === 'offline'),
    fullName: computed(() => user()?.fullName ?? ''),
  })),

  withMethods((store, auth = inject(AuthService)) => ({
    async load(): Promise<void> {
      patchState(store, markLoading());

      try {
        const user = await firstValueFrom(auth.me());
        patchState(store, markAuthenticated(user));
      } catch (err: unknown) {
        if (isApiError(err) && err.status === 401) {
          patchState(store, markUnauthenticated());
          return;
        }
        if (isApiError(err) && err.status === 0) {
          patchState(store, markOffline());
          return;
        }
        throw err;
      }
    },

    async login(emailOrUsername: string, password: string): Promise<void> {
      patchState(store, markLoading());

      try {
        const user = await firstValueFrom(auth.login({ emailOrUsername, password }));
        patchState(store, markAuthenticated(user));
      } catch (err: unknown) {
        patchState(store, markUnauthenticated());
        throw err;
      }
    },
    async resendConfirmationLink(email: string): Promise<void> {
      try {
        await firstValueFrom(auth.resendConfirmationLink({ email }));
      } catch (err: unknown) {
        throw err;
      }
    },
    async logout(): Promise<void> {
      try {
        await firstValueFrom(auth.logout());
      } finally {
        patchState(store, markUnauthenticated());
      }
    },

    clear(): void {
      patchState(store, markUnauthenticated());
    },
    async register(req: RegisterRequest): Promise<void> {
      patchState(store, markLoading());
      try {
        await firstValueFrom(auth.register(req));
        patchState(store, markIdle());
      } catch (err) {
        patchState(store, markUnauthenticated());
        throw err;
      }
    },
  })),
);
