import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { loginSchema } from '../../../form-schemas';
import { ApiErrorMessage } from '../../../shared/helpers';
import type { LoginCredentials } from './login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, FormRoot, FieldWrapper, FieldStyleDirective, FormBanner, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['../shared/auth-shared.css', './login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly showPassword = signal(false);

  readonly loginModel = signal<LoginCredentials>({
    emailOrUsername: '',
    password: '',
  });

  readonly banner = useFormBanner(this.loginModel);

  readonly loginForm = form(this.loginModel, loginSchema, {
    submission: {
      action: async () => {
        this.banner.clear();
        try {
        

    await  this.userStore.login(this.loginModel());
          this.toast.success(`Welcome back, ${this.userStore.fullName() || 'player'}!`);
          const target = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
          await this.router.navigateByUrl(target);
        } catch (err: unknown) {
          this.banner.error(ApiErrorMessage.from(err));
        }
      },
    },
  });

  readonly submitting = computed(() => this.loginForm().submitting());

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }
}
