import { computed, Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive({
  selector: '[formFieldDir]',
  host: {
    '[class.invalid]': 'invalid()',
    '[class.valid]': 'valid()',
    '[class.pending]': 'pending()',
    '[class.touched]': 'touched()',
    '[class.untouched]': '!touched()',
    '[class.dirty]': 'dirty()',
    '[class.pristine]': '!dirty()',
    '[class.disabled]': 'disabled()',
    '[class.readonly]': 'readonly()',
    '[class.required]': 'required()',
    '[class.hidden]': 'hidden()',
    '[class.submitting]': 'submitting()',
    '[class.has-errors]': 'hasErrors()',
    '[class.has-child-errors]': 'hasChildErrors()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[attr.aria-busy]': 'pending() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class FieldStyleDirective<T> {
  readonly formFieldDir = input.required<FieldTree<T>>();

  private readonly field = computed(() => this.formFieldDir());

  private readonly fieldState = computed(() => this.field()());

  readonly invalid = computed(() => this.fieldState().invalid());
  readonly valid = computed(() => this.fieldState().valid());
  readonly pending = computed(() => this.fieldState().pending());

  readonly touched = computed(() => this.fieldState().touched());
  readonly dirty = computed(() => this.fieldState().dirty());

  readonly disabled = computed(() => this.fieldState().disabled());
  readonly readonly = computed(() => this.fieldState().readonly());
  readonly required = computed(() => this.fieldState().required());
  readonly hidden = computed(() => this.fieldState().hidden());
  readonly submitting = computed(() => this.fieldState().submitting());

  readonly errors = computed(() => this.fieldState().errors());
  readonly errorSummary = computed(() => this.fieldState().errorSummary());

  readonly hasErrors = computed(() => this.errors().length > 0);
  readonly hasChildErrors = computed(() =>
    this.errorSummary().some((e) => e.fieldTree !== this.fieldState().fieldTree),
  );
  readonly firstError = computed(() => this.errors()[0] ?? null);
}
