import { Injectable, computed, signal } from '@angular/core';
import { ToastItem, ToastSeverity, TOAST_DEFAULTS, TimerState } from './toast.model';


@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<ToastItem[]>([]);
  private readonly _timers = new Map<string, TimerState>();

  // Public readonly signal of active toasts 
  readonly toasts = computed(() => this._toasts() as ReadonlyArray<ToastItem>);

  show(message: string, severity: ToastSeverity = 'info', duration?: number): string {
    const normalizedMessage = message.slice(0, TOAST_DEFAULTS.MAX_MESSAGE_LENGTH);
    const effectiveDuration = this.normalizeDuration(duration);
    const id = crypto.randomUUID();
    const toast: ToastItem = {
      id,
      message: normalizedMessage,
      severity,
      createdAt: Date.now(),
      duration: effectiveDuration,
    };

    this._toasts.update(queue => {
      let next = [...queue];
      // Evict oldest if at capacity
      if (next.length >= TOAST_DEFAULTS.MAX_QUEUE_SIZE) {
        const oldest = next.reduce((min, t) => t.createdAt < min.createdAt ? t : min);
        this.cancelTimer(oldest.id);
        next = next.filter(t => t.id !== oldest.id);
      }
      next.push(toast);
      return next;
    });

    // Schedule auto-dismiss
    if (effectiveDuration > 0) {
      this.scheduleTimer(id, effectiveDuration);
    }

    return id;
  }

  dismiss(id: string): void {
    const exists = this._toasts().some(t => t.id === id);
    if (!exists) return;
    this.cancelTimer(id);
    this._toasts.update(queue => queue.filter(t => t.id !== id));
  }

  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  pauseTimer(id: string): void {
    const timer = this._timers.get(id);
    if (!timer || timer.paused || !timer.timeoutId) return;
    clearTimeout(timer.timeoutId);
    const elapsed = Date.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
    timer.paused = true;
    timer.timeoutId = null;
  }

  resumeTimer(id: string): void {
    const timer = this._timers.get(id);
    if (!timer || !timer.paused || timer.remaining <= 0) return;
    timer.paused = false;
    timer.startedAt = Date.now();
    timer.timeoutId = setTimeout(() => this.dismiss(id), timer.remaining);
  }

  private normalizeDuration(duration?: number): number {
    if (duration === undefined || duration === null) return TOAST_DEFAULTS.DEFAULT_DURATION;
    if (duration === 0) return 0;
    if (duration < 0) return TOAST_DEFAULTS.DEFAULT_DURATION;
    return Math.min(duration, TOAST_DEFAULTS.MAX_DURATION);
  }

  private scheduleTimer(id: string, duration: number): void {
    const timeoutId = setTimeout(() => this.dismiss(id), duration);
    this._timers.set(id, {
      timeoutId,
      startedAt: Date.now(),
      remaining: duration,
      paused: false,
    });
  }

  private cancelTimer(id: string): void {
    const timer = this._timers.get(id);
    if (timer?.timeoutId) {
      clearTimeout(timer.timeoutId);
    }
    this._timers.delete(id);
  }
}
