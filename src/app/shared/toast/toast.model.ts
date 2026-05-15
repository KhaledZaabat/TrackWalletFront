export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  readonly id: string;              // UUID v4
  readonly message: string;         // max 200 characters
  readonly severity: ToastSeverity;
  readonly createdAt: number;       // Date.now() timestamp
  readonly duration: number;        // ms; 0 = indefinite
}

export interface TimerState {
  timeoutId: ReturnType<typeof setTimeout> | null;
  startedAt: number;      // timestamp when timer was last started/resumed
  remaining: number;      // ms remaining when paused
  paused: boolean;
}

export const TOAST_DEFAULTS = {
  MAX_QUEUE_SIZE: 5,
  DEFAULT_DURATION: 5000,    // ms
  MAX_DURATION: 60000,       // ms
  MAX_MESSAGE_LENGTH: 200,
  ANIMATION_DURATION: 300,   // ms
} as const;
