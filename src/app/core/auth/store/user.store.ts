import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { exhaustMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';

import { AuthService } from '..';
import { initialState } from './user-state';
import {
  markAuthenticated,
  markIdle,
  markLoading,
  markOffline,
  markUnauthenticated,
} from './user-updaters';
import { isApiError } from '../../../shared/helpers';
import { LoginCredentials } from '../../../features/auth/login/login.model';
import { RegisterFormModel, toRegisterRequest } from '../../../features/auth/register/register.model';
import { ConfirmEmailRequest } from '../confirm-email-request';

export const UserStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'loaded'),
    isOffline: computed(() => status() === 'offline'),
    fullName: computed(() => user()?.fullName ?? ''),
  })),

  withMethods((store, auth = inject(AuthService)) => ({


    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, markLoading())),

        exhaustMap(() =>
          auth.me().pipe(
            tapResponse({
              next: user => patchState(store, markAuthenticated(user)),

              error: err => {
                if (isApiError(err) && err.status === 401) {
                  patchState(store, markUnauthenticated());
                  return;
                }

                if (isApiError(err) && err.status === 0) {
                  patchState(store, markOffline());
                  return;
                }

                patchState(store, markUnauthenticated());
                throw err;
              },
            })
          )
        )
      )
    ),

 
    login: rxMethod<LoginCredentials>(
      pipe(
        tap(() => patchState(store, markLoading())),

        exhaustMap(credentials =>
          auth.login(credentials).pipe(
            tapResponse({
              next: user => patchState(store, markAuthenticated(user)),
              error: err => {
                patchState(store, markUnauthenticated());
                throw err;
              },
            })
          )
        )
      )
    ),


    register: rxMethod<RegisterFormModel>(
      pipe(
        tap(() => patchState(store, markLoading())),

        exhaustMap(req =>
          auth.register( toRegisterRequest(req)).pipe(
            tapResponse({
              next: () => patchState(store, markIdle()),
              error: err => {
                patchState(store, markUnauthenticated());
                throw err;
              },
            })
          )
        )
      )
    ),

   
    logout: rxMethod<void>(
      pipe(
        exhaustMap(() =>
          auth.logout().pipe(
            tapResponse({
              next: () => patchState(store, markUnauthenticated()),
              error: () => patchState(store, markUnauthenticated()),
            })
          )
        )
      )
    ),

 
    resendConfirmationLink: rxMethod<string>(
      pipe(
        exhaustMap(req =>
          auth.resendConfirmationLink({email:req}).pipe(
            tapResponse({
              next: () => {},
              error: err => {
                throw err;
              },
            })
          )
        )
      )
    ),

  
    confirmEmail: rxMethod<ConfirmEmailRequest>(
      pipe(
        exhaustMap(req =>
          auth.confrimEmail(req).pipe(
            tapResponse({
              next: () => {},
              error: err => {
                throw err;
              },
            })
          )
        )
      )
    ),

 
    clear() {
      patchState(store, markUnauthenticated());
    },
  }))
);