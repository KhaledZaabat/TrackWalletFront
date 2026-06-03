import { ChangeDetectionStrategy, Component, inject, input, OnInit ,computed} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast';
import { UserStore } from '../../../core/auth';

@Component({
  selector: 'app-confirm-email',
  imports: [],
  templateUrl: './confirm-email.html',
  styleUrls: ['../shared/auth-shared.css', './confirm-email.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmail implements OnInit {

  private readonly toast     = inject(ToastService);
  private readonly userStore = inject(UserStore);
  private readonly router    = inject(Router);
confirmRequest = computed(() => ({
  email: this.email(),
  token: this.token(),
}));  readonly email = input.required<string>();
  readonly token = input.required<string>();

  async ngOnInit(): Promise<void> {
    try {
      await this.userStore.confirmEmail(this.confirmRequest);
      this.toast.success('Email confirmed! You can now log in.');
      this.router.navigate(['/login']);
    } catch {
      this.toast.error('Confirmation failed. The link may be expired or invalid.');
    }
  }
}