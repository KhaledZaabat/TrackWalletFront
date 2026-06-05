import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { ForgotPasswordRequest } from './forget-password-model';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import { ApiErrorMessage } from '../../../shared/helpers';
import { ResetPasswordSent } from '../reset-password-sent/reset-password-sent';

@Component({
  selector: 'app-forget-password',
  imports: [
    RouterLink,
    FormRoot,
    FieldWrapper,
    FieldStyleDirective,
    FormBanner,
    FormField,
    ResetPasswordSent,
  ],
  templateUrl: './forget-password.html',
  styleUrls: ['../shared/auth-shared.css', './forget-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPassword {
  private readonly userStore = inject(UserStore);
  private readonly router    = inject(Router);
  private readonly toast     = inject(ToastService);

  readonly sentTo = signal<string | null>(null);

  readonly forgotPasswordModel = signal<ForgotPasswordRequest>({
    email: 'example@trackwallet.com',
  });

  readonly banner = useFormBanner(this.forgotPasswordModel);

  readonly forgotPasswordForm = form(this.forgotPasswordModel, (schema) => {
    required(schema.email);
    email(schema.email);
  }, {
    submission: {
      action: async () => {
        this.banner.clear();
        try {
          await this.userStore.sendRestPaswordLink(this.forgotPasswordModel());
          this.sentTo.set(this.forgotPasswordModel().email);
        } catch (err: unknown) {
          this.banner.error(ApiErrorMessage.from(err));
        }
      },
    },
  });
}