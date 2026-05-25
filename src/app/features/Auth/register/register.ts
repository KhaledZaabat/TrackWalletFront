import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { useFormBanner } from '../../../shared/form-banner';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { PasswordFormComponent } from '../password-form/password-form';
import { isApiError, toIsoDate } from '../../../shared/helpers';

import { RegisterFormModel, toRegisterRequest } from './register.model';
import { registerSchema } from '../../../form-schemas/schemas/register-schema';


@Component({
  selector: 'app-register',
  imports: [FormField, FormRoot, FieldWrapper, FieldStyleDirective, PasswordFormComponent, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['../shared/auth-shared.css', './register.css'],
})
export class RegisterComponent {
  private readonly userStore = inject(UserStore);
  private readonly router    = inject(Router);
  private readonly route     = inject(ActivatedRoute);
  private readonly toast     = inject(ToastService);

  readonly registerModel = signal<RegisterFormModel>({
    fullName:     '',
    username:     '',
    email:        '',
    passwordForm: { password: '', confirmPassword: '' },
    isMale:       true,
    birthDate:    toIsoDate(new Date()),
    profileImage: null,
  });

  readonly banner = useFormBanner(this.registerModel);

  readonly registerForm = form(this.registerModel, registerSchema, {
    submission: {
      action: async (t) => {
      
        this.banner.clear();
        try {
          await this.userStore.register(toRegisterRequest(this.registerModel()));
          this.toast.success('Welcome, hero!');
          const target = this.route.snapshot.queryParamMap.get('redirectTo');

          if (target) {
            await this.router.navigateByUrl(target);
              } else {
              await this.router.navigate(['/confirmation-email-sent'], { queryParams: { email: t.email().value() }});
              }
        } catch (err: unknown) {
          this.banner.error(this.toUserMessage(err));
        }
      },
    },
  });

  setGender(isMale: boolean): void {
    this.registerModel.update((m) => ({ ...m, isMale }));
  }

  readonly imagePreview = signal<string | null>(null);

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.imagePreview.set(file ? URL.createObjectURL(file) : null);
    this.registerModel.update((m) => ({ ...m, profileImage: file }));
  }

  removeImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.imagePreview.set(null);
    this.registerModel.update((m) => ({ ...m, profileImage: null }));
  }


  private toUserMessage(err: unknown): string {
      if (!isApiError(err)) return 'Something went wrong. Please try again.';
      if (err.status === 0)   return 'Unable to reach the server. Check your connection.';
      if (err.status === 429) return 'Too many attempts. Please wait a moment and try again.';
      if (err.status >= 500)  return 'Server error. Please try again later.';
      return err.title || 'Register failed. Please try again.';
    }
}
