import { Component, computed, contentChild, input, Signal } from '@angular/core';
import { FormField, FieldState } from '@angular/forms/signals';
import { MIN_WORDS } from '../../form-schemas/validators/min-words-validator';
import { MIN_CHARS } from '../../form-schemas/validators/min-chars-validator';

@Component({
  selector: 'app-field',
  imports: [],
  templateUrl: './field-wrapper.html',
  styleUrl: './field-wrapper.css',
})
export class FieldWrapper<T> {
  readonly label = input('');
  readonly formField = contentChild.required<FormField<T>>(FormField);

  readonly fieldState: Signal<FieldState<T>> = computed(() =>
    this.formField().state(),
  );

  readonly errors   = computed(() => this.fieldState().errors());
  readonly required = computed(() => this.fieldState().required());
  readonly touched  = computed(() => this.fieldState().touched());
  readonly dirty    = computed(() => this.fieldState().dirty());

  /** Only show errors after user has interacted with the field */
  readonly visibleErrors = computed(() =>
    this.touched() || this.dirty() ? this.errors() : [],
  );

  private readonly showHints = computed(() => !this.touched() && !this.dirty());

  readonly minWords = computed(() => this.fieldState().metadata(MIN_WORDS)?.() ?? 0);
  readonly hasMinWords = computed(() => this.minWords() > 0 && this.showHints());

  readonly minChars = computed(() => this.fieldState().metadata(MIN_CHARS)?.() ?? 0);
  readonly hasMinChars = computed(() => this.minChars() > 0 && this.showHints());
}