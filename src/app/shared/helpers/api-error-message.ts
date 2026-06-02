import { isApiError } from './is-api-error';

const MESSAGES = {
  UNKNOWN: 'Something went wrong. Please try again.',
  NETWORK: 'Unable to reach the server. Check your connection.',
  RATE_LIMIT: 'Too many attempts. Please wait a moment and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

/**
 * Converts an unknown thrown value into a human-readable message.
 *
 * Usage:
 *   ApiErrorMessage.from(err)                        // generic fallback
 *   ApiErrorMessage.from(err, 'Login failed.')       // action-specific fallback
 */
export class ApiErrorMessage {
  private constructor() {}

  static readonly messages = MESSAGES;

  /**
   * Returns the most specific user-facing message for a caught error.
   *
   * Resolution order:
   *  1. Non-API error              → generic unknown message
   *  2. status 0  (network/CORS)   → network message
   *  3. status 429 (rate-limited)  → rate-limit message
   *  4. status 5xx (server fault)  → server error message
   *  5. API title present          → API title
   *  6. fallback                   → caller-supplied or generic unknown
   */
  static from(err: unknown, fallback: string = MESSAGES.UNKNOWN): string {
    if (!isApiError(err)) return MESSAGES.UNKNOWN;
    if (err.status === 0) return MESSAGES.NETWORK;
    if (err.status === 429) return MESSAGES.RATE_LIMIT;
    if (err.status >= 500) return MESSAGES.SERVER;
    return err.title || fallback;
  }
}
