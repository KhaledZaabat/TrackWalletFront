import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { FormBanner, useFormBanner } from '../../../shared/form-banner';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { PasswordFormComponent } from '../password-form/password-form';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { gameFemale, gameMale } from '@ng-icons/game-icons';
import { ApiErrorMessage, toIsoDate } from '../../../shared/helpers';
import { registerSchema } from '../../../form-schemas';

import { RegisterFormModel } from './register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormField,
    FormRoot,
    FieldWrapper,
    FieldStyleDirective,
    PasswordFormComponent,
    FormBanner,
    RouterLink,
    NgIcon,
  ],
  viewProviders: [provideIcons({ gameMale, gameFemale })],
  templateUrl: './register.html',
  styleUrls: ['../shared/auth-shared.css', './register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly registerModel = signal<RegisterFormModel>({
    fullName: '',
    username: '',
    email: '',
    passwordForm: { password: '', confirmPassword: '' },
    isMale: true,
    birthDate: toIsoDate(new Date()),
    profileImage: null,
  });

  readonly banner = useFormBanner(this.registerModel);

  readonly registerForm = form(this.registerModel, registerSchema, {
    submission: {
      action: async (t) => {
        this.banner.clear();
        try {
          await this.userStore.register(this.registerModel);
          this.toast.success('Welcome, hero!');
          const target = this.route.snapshot.queryParamMap.get('redirectTo');

          if (target) {
            await this.router.navigateByUrl(target);
          } else {
            await this.router.navigate(['/confirmation-email-sent'], {
              queryParams: { email: t.email().value() },
            });
          }
        } catch (err: unknown) {
          this.banner.error(ApiErrorMessage.from(err));
        }
      },
    },
  });

  readonly imagePreview = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      const preview = this.imagePreview();
      if (preview) URL.revokeObjectURL(preview);
    });
  }

  setGender(isMale: boolean): void {
    this.registerModel.update((m) => ({ ...m, isMale }));
  }

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
