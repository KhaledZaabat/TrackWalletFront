import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/toast';
import { UserStore } from '../../../core/auth';
import { LocalStorageService, TTL } from '../../../core/local-storage/local-storage.service';

@Component({
  selector: 'app-reset-password-sent',
  imports: [RouterLink],
  templateUrl: './reset-password-sent.html',
  styleUrls: ['../shared/auth-shared.css', './reset-password-sent.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordSent implements OnInit, OnDestroy {
  private readonly toast     = inject(ToastService);
  private readonly userStore = inject(UserStore);
  private readonly storage   = inject(LocalStorageService);

  readonly email          = input.required<string>();
  readonly resendCooldown = signal(0);
  readonly resending      = signal(false);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;
  private readonly COOLDOWN_DURATION = 60;
  private readonly STORAGE_KEY_PREFIX = 'password_reset_';

  ngOnInit(): void {
    const expiresAt = this.storage.getItemOrDefault<number>(this.storageKey, 0);
    if (expiresAt > 0) {
      const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
      if (remaining > 0) this.startCooldown(remaining);
    }
  }

  async resend(): Promise<void> {
    if (this.resendCooldown() > 0 || this.resending()) return;

    this.resending.set(true);
    try {
      await this.userStore.sendRestPaswordLink({ email: this.email() });
      this.toast.success('Reset email resent!');
      this.startCooldown(this.COOLDOWN_DURATION);
    } catch {
      this.toast.error('Failed to resend reset email');
    } finally {
      this.resending.set(false);
    }
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown.set(seconds);
    this.storage.setItem(this.storageKey, Date.now() + seconds * 1000, TTL.SECONDS(seconds));

    if (this.cooldownTimer) clearInterval(this.cooldownTimer);

    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update((v) => v - 1);
      if (this.resendCooldown() <= 0) {
        clearInterval(this.cooldownTimer!);
        this.cooldownTimer = null;
      }
    }, 1000);
  }

  private get storageKey(): string {
    return this.STORAGE_KEY_PREFIX + this.email();
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }
}