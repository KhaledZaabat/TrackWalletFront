import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { useFormBanner } from '../../../shared/form-banner';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { PasswordFormComponent } from '../password-form/password-form';
import { toIsoDate } from '../../../shared/helpers';

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
          const target = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
          await this.router.navigateByUrl(target);
        } catch {
          // banner.error(...) once AuthService surfaces ApiError
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
}
