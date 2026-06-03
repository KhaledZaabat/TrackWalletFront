import { ChangeDetectionStrategy, Component, inject, input, signal, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../../shared/toast/toast.service';
import { UserStore } from '../../../core/auth';
import { RouterLink } from '@angular/router';
import { LocalStorageService, TTL } from '../../../core/local-storage/local-storage.service';

@Component({
  selector: 'app-email-sent',
  imports: [RouterLink],
  templateUrl: './email-sent.html',
  styleUrls: ['../shared/auth-shared.css', './email-sent.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationEmailSentComponent implements OnInit, OnDestroy {
  private readonly toast    = inject(ToastService);
  private readonly userStore = inject(UserStore);
  private readonly storage  = inject(LocalStorageService);

  readonly email         = input.required<string>();
  readonly resendCooldown = signal(0);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;
  private readonly COOLDOWN_DURATION = 60;
  private readonly STORAGE_KEY_PREFIX = 'email_confirm_';

  ngOnInit(): void {
    const expiresAt = this.storage.getItemOrDefault<number>(this.storageKey, 0);
    if (expiresAt > 0) {
      const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
      if (remaining > 0) this.startCooldown(remaining);
    }
  }

  async resend(): Promise<void> {
    if (this.resendCooldown() > 0) return;

    try {
      await this.userStore.resendConfirmationLink(this.email);
      this.toast.success('Confirmation email sent');
      this.startCooldown(this.COOLDOWN_DURATION);
    } catch {
      this.toast.error('Failed to resend confirmation email');
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