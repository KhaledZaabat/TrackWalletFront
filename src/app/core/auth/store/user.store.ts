import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, Observable, firstValueFrom, of, pipe, throwError } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { AuthService } from '..';
import { initialState } from './user-state';
import { markAuthenticated, markIdle, markLoading, markOffline, markUnauthenticated } from './user-updaters';
import { isApiError } from '../../../shared/helpers';
import { LoginCredentials } from '../../../features/auth/login/login.model';
import { RegisterFormModel, toRegisterRequest } from '../../../features/auth/register/register.model';
import { ConfirmEmailRequest } from '../confirm-email-request';
import { ForgotPasswordRequest } from '../../../features/auth/forget-password/forget-password-model';
import { ResetPasswordRequest } from './reset-password-request';

export const UserStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'loaded'),
    isOffline:       computed(() => status() === 'offline'),
    fullName:        computed(() => user()?.fullName ?? ''),
  })),

 withMethods((store, auth = inject(AuthService)) => {

  const fetchAndUpdate$ = () => auth.me().pipe(
    tap(user => patchState(store, markAuthenticated(user))),
    catchError(err => {
      patchState(store, isApiError(err) && err.status === 0 ? markOffline() : markUnauthenticated());
      return EMPTY;
    }),
  );

  const action = <T>(
    op$: Observable<T>,
    onSuccess: (val: T) => void,
    onError:   ()       => void = () => patchState(store, markIdle()),
  ): Promise<void> => {
    patchState(store, markLoading());
    return firstValueFrom(
      op$.pipe(
        tap(onSuccess),
        catchError(err => { onError(); return throwError(() => err); }),
        map(() => undefined),
      )
    );
  };

  return {

    load: rxMethod<void>(pipe(
      tap(() => patchState(store, markLoading())),
      exhaustMap(() => fetchAndUpdate$()),
    )),

    initialize(): Observable<void> {
      patchState(store, markLoading());
      return fetchAndUpdate$().pipe(map(() => undefined));
    },

    login: (credentials: LoginCredentials) =>
      action(
        auth.login(credentials),
        user => patchState(store, markAuthenticated(user)),
        ()   => patchState(store, markUnauthenticated()),
      ),

    register: (req: RegisterFormModel) =>
      action(
        auth.register(toRegisterRequest(req)),
        () => patchState(store, markIdle()),
      ),

    resendConfirmationLink: (email: string) =>
      action(
        auth.resendConfirmationLink({ email }),
        () => patchState(store, markIdle()),
      ),

    confirmEmail: (req: ConfirmEmailRequest) =>
      action(
        auth.confirmEmail(req),
        () => patchState(store, markIdle()),
      ),

    logout: (): Promise<void> =>
      firstValueFrom(
        auth.logout().pipe(
          catchError(() => of(null)),
          tap(() => patchState(store, markUnauthenticated())),
          map(() => undefined),
        )
      ),
      sendRestPaswordLink:(request:ForgotPasswordRequest):Promise<void>=>{
      
        return action(auth.sendRestPaswordLink(request),
        ()=>patchState(store,markIdle()));
  
        
      
      },
      resetPassword:(request:ResetPasswordRequest)=>action(
        auth.resetPassword(request),
        () => patchState(store, markIdle()),


      )
      ,
    clear: (): void => patchState(store, markUnauthenticated()),
  };
})
);