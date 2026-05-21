import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';

import { UserStore } from '../../../core/auth';
import { ToastService } from '../../../shared/toast';
import { useFormBanner } from '../../../shared/form-banner';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';
import { PasswordFormComponent } from '../password-form/password-form';

import { RegisterFormModel, toRegisterRequest } from './register.model';
import { registerSchema } from '../../../form-schemas/schemas/register-schema';

const MONTHS = [
  { value: 0,  label: 'JAN' }, { value: 1,  label: 'FEB' }, { value: 2,  label: 'MAR' },
  { value: 3,  label: 'APR' }, { value: 4,  label: 'MAY' }, { value: 5,  label: 'JUN' },
  { value: 6,  label: 'JUL' }, { value: 7,  label: 'AUG' }, { value: 8,  label: 'SEP' },
  { value: 9,  label: 'OCT' }, { value: 10, label: 'NOV' }, { value: 11, label: 'DEC' },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 100;

const DEFAULT_BIRTH_DATE = new Date();

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
    birthDate:    DEFAULT_BIRTH_DATE,
    profileImage: null,
  });

  readonly banner = useFormBanner(this.registerModel);

  readonly registerForm = form(this.registerModel, registerSchema, {
    submission: {
      action: async (t) => {
        this.banner.clear();
        try {
           await this.userStore.register(toRegisterRequest(this.registerModel()));
          const target = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
          console.log(t().value());
          // await this.router.navigateByUrl(target);
        } catch {
          // this.banner.error(this.toUserMessage(err));
        }
      },
    },
  });

  // ── Birth date pickers (seeded from DEFAULT_BIRTH_DATE) ─────────
  readonly day   = signal<number>(DEFAULT_BIRTH_DATE.getDate());
  readonly month = signal<number>(DEFAULT_BIRTH_DATE.getMonth());
  readonly year  = signal<number>(DEFAULT_BIRTH_DATE.getFullYear());

  readonly months = MONTHS;
  readonly years  = computed(() =>
    Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => CURRENT_YEAR - i),
  );
  readonly days = computed(() => {
    const max = new Date(this.year(), this.month() + 1, 0).getDate();
    return Array.from({ length: max }, (_, i) => i + 1);
  });

  onDayChange(e: Event):   void { this.day.set(this.toNum(e));   this.syncDate(); }
  onMonthChange(e: Event): void { this.month.set(this.toNum(e)); this.syncDate(); }
  onYearChange(e: Event):  void { this.year.set(this.toNum(e));  this.syncDate(); }

  private syncDate(): void {
    // Clamp the day if month/year change made it invalid (e.g. Feb 30 → Feb 28).
    const max = this.days().length;
    if (this.day() > max) this.day.set(max);

    const date = new Date(this.year(), this.month(), this.day());
    this.registerModel.update((model) => ({ ...model, birthDate: date }));
  }

  setGender(isMale: boolean): void {
    this.registerModel.update((m) => ({ ...m, isMale }));
  }

  // ── Profile image (with preview) ──────────────────────────
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

  private toNum(event: Event): number {
    return Number((event.target as HTMLSelectElement).value);
  }
}
