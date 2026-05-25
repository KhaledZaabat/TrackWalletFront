import { Component, inject, input, signal, OnDestroy } from '@angular/core';
import { ToastService } from '../../../shared/toast/toast.service';
import { UserStore } from '../../../core/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  imports: [RouterLink],
  templateUrl: './email-sent.html',
  styleUrl: './email-sent.css',
})
export class ConfirmationEmailSentComponent implements OnDestroy {
  readonly toast = inject(ToastService);
  readonly email = input.required<string>();
  readonly userStore = inject(UserStore);

  readonly resendCooldown = signal(0);
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  async resend(): Promise<void> {
    if (this.resendCooldown() > 0) return;

    try {
      await this.userStore.resendConfirmationLink(this.email());
      this.toast.success('Confirmation email sent');

      this.startCooldown(60);
    } catch {
      this.toast.error('Failed to resend confirmation email');
    }
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown.set(seconds);

    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }

    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update((val) => val - 1);

      if (this.resendCooldown() <= 0) {
        if (this.cooldownTimer) {
          clearInterval(this.cooldownTimer);
          this.cooldownTimer = null;
        }
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }
}