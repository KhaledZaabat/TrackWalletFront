import { computed, effect, Signal, signal } from '@angular/core';
import { FormBannerVariant } from './form-banner';

export interface FormBannerState {
  readonly message: Signal<string | null>;
  readonly variant: Signal<FormBannerVariant>;
  readonly visible: Signal<boolean>;
  show(message: string, variant?: FormBannerVariant): void;
  error(message: string): void;
  success(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  clear(): void;
}


export function useFormBanner<T>(modelSignal: Signal<T>): FormBannerState {
  const message = signal<string | null>(null);
  const variant = signal<FormBannerVariant>('error');
  let snapshot: T | null = null;

  // Auto-clear when the model changes after a banner was shown.
  effect(() => {
    const current = modelSignal();
    if (snapshot !== null && message() && !shallowEqual(current, snapshot)) {
      message.set(null);
      snapshot = null;
    }
  });

  const show = (msg: string, v: FormBannerVariant = 'error') => {
    snapshot = structuredClone(modelSignal());
    variant.set(v);
    message.set(msg);
  };

  return {
    message: message.asReadonly(),
    variant: variant.asReadonly(),
    visible: computed(() => message() !== null),
    show,
    error: (m) => show(m, 'error'),
    success: (m) => show(m, 'success'),
    warning: (m) => show(m, 'warning'),
    info: (m) => show(m, 'info'),
    clear: () => {
      message.set(null);
      snapshot = null;
    },
  };
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const ak = Object.keys(a as object);
  const bk = Object.keys(b as object);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if ((a as Record<string, unknown>)[k] !== (b as Record<string, unknown>)[k]) return false;
  }
  return true;
}
