import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { ApiError } from '../../shared/types';

export const SUPPRESS_TOAST = new HttpContextToken<boolean>(() => false);

export const SKIP_OFFLINE_REDIRECT = new HttpContextToken<boolean>(() => false);

interface ApiProblem {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  codes?: string[];
  errors?: Record<string, string[]>;
}

const FALLBACK_NETWORK = "We couldn't reach the server. Check your connection and try again.";
const FALLBACK_SERVER = 'Something went wrong on our end. Please try again.';
const FALLBACK_GENERIC = 'Something went wrong. Please try again.';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (isAborted(err)) return throwError(() => err);

      const apiError = toApiError(err);

      if (apiError.status === 401) return throwError(() => apiError);
      
      if (apiError.status === 0 && !req.context.get(SKIP_OFFLINE_REDIRECT)) {
        router.navigate(['/offline']);

        return throwError(() => apiError);
      }

      if (!req.context.get(SUPPRESS_TOAST)) toastFromError(toast, apiError);

      return throwError(() => apiError);
    }),
  );
};

function isAborted(err: unknown): boolean {
  if (err instanceof HttpErrorResponse && err.error instanceof DOMException) {
    return err.error.name === 'AbortError';
  }
  return err instanceof DOMException && err.name === 'AbortError';
}

function toApiError(err: unknown): ApiError {
  if (!(err instanceof HttpErrorResponse)) {
    return { status: 0, title: FALLBACK_NETWORK, raw: err };
  }

  // Status 0 — request never reached the server (DNS, network, CORS preflight).
  if (err.status === 0) {
    return { status: 0, title: FALLBACK_NETWORK, raw: err };
  }

  const body = err.error as ApiProblem | string | null;

  if (typeof body === 'string') {
    return {
      status: err.status,
      title: body || err.statusText || FALLBACK_GENERIC,
      raw: err,
    };
  }

  if (body && typeof body === 'object') {
    const fieldErrors = body.errors
      ? Object.entries(body.errors).map(([field, messages]) => ({ field, messages }))
      : undefined;

    return {
      status: err.status,
      title: body.title || firstFieldMessage(fieldErrors) || err.statusText || FALLBACK_GENERIC,
      code: body.code,
      fieldErrors,
      raw: err,
    };
  }

  return {
    status: err.status,
    title: err.statusText || FALLBACK_GENERIC,
    raw: err,
  };
}

function firstFieldMessage(
  fieldErrors: ReadonlyArray<{ field: string; messages: string[] }> | undefined,
): string | undefined {
  return fieldErrors?.[0]?.messages?.[0];
}

function toastFromError(toast: ToastService, error: ApiError): void {
  if (error.fieldErrors?.length) {
    for (const fe of error.fieldErrors) {
      for (const message of fe.messages) toast.warning(message);
    }
    return;
  }
  if (error.status >= 500) {
    toast.error(FALLBACK_SERVER);
    return;
  }
  toast.error(error.title);
}
