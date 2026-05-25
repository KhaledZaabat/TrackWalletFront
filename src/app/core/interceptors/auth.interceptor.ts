import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserStore } from '../auth';

export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.context.get(SKIP_AUTH_REDIRECT)) {
        userStore.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
