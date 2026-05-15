import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required ,email} from '@angular/forms/signals';

import { LoginCredentials } from './login.model';
import { FieldWrapper } from '../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../shared/directives/field-styling.directive';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot,FieldWrapper, FieldStyleDirective],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  showPassword = signal(false);

  loginModel = signal<LoginCredentials>({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (s) => {
      required(s.email);
      required(s.password);
      email(s.email)
    },
    {
      submission: {
        action: async (field) => {
          console.log(field().value());
          // TODO: call auth service here
        },
      },
    },
  );

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }
}