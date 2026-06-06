import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormRoot, form, required, validate } from '@angular/forms/signals';

import { PasswordFormComponent } from '../password-form/password-form';
import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { strongPasswordChecklist } from '../../../form-schemas';
import { ApiErrorMessage } from '../../../shared/helpers';
import { ResetPasswordRequest } from '../../../core/auth/store/reset-password-request';

interface ResetPasswordForm {
  passwordForm: PasswordForm;
}

@Component({
  selector: 'app-reset-password',
  imports: [FormRoot, PasswordFormComponent, FormBanner, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['../shared/auth-shared.css', './reset-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly userStore = inject(UserStore);
  private readonly toast = inject(ToastService);

  readonly email = input.required<string>();
  readonly token = input.required<string>();

  readonly resetModel = signal<ResetPasswordForm>({
    passwordForm: {
      password: '',
      confirmPassword: '',
    },
  });

  readonly banner = useFormBanner(this.resetModel);

  readonly resetRequest = computed<ResetPasswordRequest>(() => ({
    email: this.email(),
    token: this.token(),
    newPassword: this.resetModel().passwordForm.password,
  }));

  readonly resetForm = form(
    this.resetModel,
    (schema) => {
      required(schema.passwordForm.password);
      strongPasswordChecklist(schema.passwordForm.password);

      required(schema.passwordForm.confirmPassword);

      validate(
        schema.passwordForm.confirmPassword,
        ({ value, valueOf, stateOf }) => {
          if (!stateOf(schema.passwordForm.password).touched()) {
            return undefined;
          }

          return value() !== valueOf(schema.passwordForm.password)
            ? {
                kind: 'passwordMismatch',
                message: 'Passwords do not match',
              }
            : undefined;
        }
      );
    },
    {
      submission: {
        action: async () => {
          this.banner.clear();

          try {
            await this.userStore.resetPassword(this.resetRequest());

  this.toast.success('Your password has been reset successfully.');    
      } catch (err: unknown) {
            this.banner.error(ApiErrorMessage.from(err));
          }
        },
      },
    }
  );
}