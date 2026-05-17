import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormBannerState } from './use-form-banner';

export type FormBannerVariant = 'error' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-form-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-banner.html',
  styleUrl: './form-banner.css',
})
export class FormBanner {
  readonly state = input.required<FormBannerState>();

  protected readonly visible = computed(() => this.state().visible());
  protected readonly message = computed(() => this.state().message() ?? '');
  protected readonly variant = computed(() => this.state().variant());

  protected readonly role = computed<'alert' | 'status'>(() => {
    const v = this.variant();
    return v === 'error' || v === 'warning' ? 'alert' : 'status';
  });

  protected readonly icon = computed(() => {
    switch (this.variant()) {
      case 'success': return '✓';
      case 'warning': return '!';
      case 'info':    return 'i';
      case 'error':
      default:        return '✕';
    }
  });
}
