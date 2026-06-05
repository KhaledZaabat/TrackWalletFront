
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormRoot, form } from '@angular/forms/signals';
import { PasswordFormComponent } from '../password-form/password-form';

import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import {  UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';

interface ResetPasswordForm {
  passwordForm: PasswordForm;
}

@Component({
  selector: 'app-reset-password',
  imports: [FormRoot, PasswordFormComponent, FormBanner, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['../shared/auth-shared.css','./reset-password.html'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly authService = inject(UserStore);
  private readonly toast = inject(ToastService);
  readonly email=input.required<string>();
  readonly token=input.required<string>();

  readonly resetModel= signal<ResetPasswordForm>({
    passwordForm: {
      password: '',
      confirmPassword: '',
    },
  });
      readonly banner = useFormBanner(this.resetModel);

  readonly resetForm =form(this.resetModel,{
    submission:{
      action :async ()=>{

this.toast.success("sdfasf");

      }
    }
  })



}