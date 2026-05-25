import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoginCredentials } from './login.model';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import { loginSchema } from '../../../form-schemas';
import { isApiError } from '../../../shared/helpers';
import { ToastService } from '../../../shared/toast';
import { UserStore } from '../../../core/auth';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot, FieldWrapper, FieldStyleDirective, FormBanner, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['../shared/auth-shared.css', './login.css'],
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
      action: async (field) => {
        this.banner.clear();
        try {
          await this.userStore.login(
            field.emailOrUsername().value(),
            field.password().value(),
          );
          this.toast.success(`Welcome back, ${this.userStore.fullName() || 'player'}!`);
          const target = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
          await this.router.navigateByUrl(target);
        } catch (err: unknown) {
          this.banner.error(this.toUserMessage(err));
        }
      },
    },
  });

  readonly submitting = computed(() => this.loginForm().submitting());

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  private toUserMessage(err: unknown): string {
    if (!isApiError(err)) return 'Something went wrong. Please try again.';
    if (err.status === 0)   return 'Unable to reach the server. Check your connection.';
    if (err.status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (err.status >= 500)  return 'Server error. Please try again later.';
    return err.title || 'Login failed. Please try again.';
  }
}
