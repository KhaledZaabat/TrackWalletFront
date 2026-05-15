import { Component, computed, contentChild, input, Signal } from '@angular/core';
import { FormField, FieldState } from '@angular/forms/signals';
import { MIN_WORDS } from '../../form-schemas/min-words-validator';

@Component({
  selector: 'app-field',
  imports: [],
  templateUrl: './field-wrapper.html',
  styleUrl: './field-wrapper.css',
})
export class FieldWrapper<T> {
  readonly label = input('');

  readonly formField = contentChild.required<FormField<T>>(FormField);
  
  readonly fieldState: Signal<FieldState<T>> = computed(() => this.formField().state());
  readonly errors = computed(() => this.fieldState().errors());
  readonly required = computed(() => this.fieldState().required());

  readonly minWords = computed(() => {
    const metaSignal = this.fieldState().metadata(MIN_WORDS);
    return metaSignal?.() ?? 0;
  });

  readonly hasMinWords = computed(() => this.minWords() > 0);
}