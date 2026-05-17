import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

import { MeResponse } from './models/me-response.model';
import { AuthService } from './auth.service';
import { isApiError } from '../../shared/helpers';

type UserState = {
  user: MeResponse | null;
  status: 'idle' | 'loading' | 'loaded' | 'unauthenticated';
};

const initialState: UserState = {
  user: null,
  status: 'idle',
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('User'),
  withState<UserState>(initialState),

  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'loaded'),
    fullName: computed(() => user()?.fullName ?? ''),
  })),

  withMethods((store, auth = inject(AuthService)) => ({

    async load(): Promise<void> {
      patchState(store, { status: 'loading' });

      try {
        const user = await firstValueFrom(auth.me());
        patchState(store, { user, status: 'loaded' });
      } catch (err: unknown) {
        if (isApiError(err) && err.status === 401) {
          patchState(store, { user: null, status: 'unauthenticated' });
          return;
        }
        throw err;
      }
    },

    async login(emailOrUsername: string, password: string): Promise<void> {
      patchState(store, { status: 'loading' });

      try {
        const user = await firstValueFrom(
          auth.login({ emailOrUsername, password }),
        );
        patchState(store, { user, status: 'loaded' });
      } catch (err: unknown) {
        patchState(store, { user: null, status: 'unauthenticated' });
        throw err;
      }
    },

    async logout(): Promise<void> {
      try {
        await firstValueFrom(auth.logout());
      } finally {
        patchState(store, { user: null, status: 'unauthenticated' });
      }
    },

    clear(): void {
      patchState(store, { user: null, status: 'unauthenticated' });
    },

  })),
);
