import { ApiError } from '../types';

/** Type guard for the normalized {@link ApiError} produced by the error interceptor. */
export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'title' in err
  );
}
