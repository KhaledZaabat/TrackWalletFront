import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';

export const SUPPRESS_TOAST = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (!req.context.get(SUPPRESS_TOAST)) {
        const message = buildErrorMessage(error.status, req.url);
        toastService.error(message);
      }
      return throwError(() => error);
    })
  );
};

function buildErrorMessage(status: number, url: string): string {
  if (status === 0) {
    return 'Unable to reach the server';
  }
  if (status >= 500) {
    return `Server error (${status})`;
  }
  return `Request failed (${status}): ${url}`;
}
