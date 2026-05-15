import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

import { MeResponse } from '../models/me-response.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../../interceptors/auth.interceptor';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

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

  withMethods((store, http = inject(HttpClient)) => ({

    async load(): Promise<void> {
      patchState(store, { status: 'loading' });

      try {
        const user = await firstValueFrom(
          http.get<MeResponse>(`${environment.apiUrl}/identity/me`, {
            context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
          })
        );

        patchState(store, {
          user,
          status: 'loaded',
        });

      } catch (err: any) {

        if (err?.status !== 401) {
          throw err;
        }
        patchState(store, {
          user: null,
          status: 'unauthenticated',
        });
      }
    },

    clear(): void {
      patchState(store, {
        user: null,
        status: 'unauthenticated',
      });
    },

  }))
);