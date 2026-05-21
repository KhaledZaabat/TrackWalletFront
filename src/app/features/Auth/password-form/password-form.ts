import { Component, computed, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldWrapper } from '../../../shared/field-wrapper/field-wrapper';
import { FieldStyleDirective } from '../../../shared/directives/field-styling.directive';

export interface PasswordForm {
  password:        string;
  confirmPassword: string;
}

const REQUIREMENTS = [
  { kind: 'password-length',    label: 'MIN 8 CHARACTERS'  },
  { kind: 'password-uppercase', label: 'UPPERCASE LETTER'  },
  { kind: 'password-lowercase', label: 'LOWERCASE LETTER'  },
  { kind: 'password-digit',     label: 'NUMBER'            },
  { kind: 'password-special',   label: 'SPECIAL CHARACTER' },
] as const;

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

@Component({
  selector: 'app-password',
  imports: [FormField, FieldWrapper, FieldStyleDirective],
  templateUrl: './password-form.html',
  styleUrls: ['../shared/auth-shared.css', './password-form.css'],
})
export class PasswordFormComponent {
  readonly fields = input.required<FieldTree<PasswordForm>>();

  readonly showNew     = signal(false);
  readonly showConfirm = signal(false);

  private readonly passwordValue = computed(
    () => this.fields().password().value() ?? '',
  );

  private readonly errorKinds = computed(() =>
    new Set(this.fields().password().errors().map((e) => e.kind)),
  );

  readonly reqsMet = computed(() => {

    if (!this.passwordValue()) {
      return REQUIREMENTS.map((r) => ({ ...r, met: false }));
    }
    return REQUIREMENTS.map((r) => ({ ...r, met: !this.errorKinds().has(r.kind) }));
  });

  readonly strengthLevel = computed(() =>
    this.reqsMet().filter((r) => r.met).length,
  );

  readonly strengthBand = computed<StrengthLevel>(() => {
    const lvl = this.strengthLevel();
    if (lvl <= 1) return 'weak';
    if (lvl === 2) return 'fair';
    if (lvl <= 4) return 'good';
    return 'strong';
  });
}
