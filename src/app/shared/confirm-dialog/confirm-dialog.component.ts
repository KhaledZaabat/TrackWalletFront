import {
  Component, ChangeDetectionStrategy, inject,
  computed, effect, viewChild, ElementRef
} from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private readonly dialogService = inject(ConfirmDialogService);
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogRef');

  readonly state     = this.dialogService.state;
  readonly isOpen    = computed(() => this.state().open);
  readonly title     = computed(() => this.state().title);
  readonly description  = computed(() => this.state().description);
  readonly confirmLabel = computed(() => this.state().confirmLabel);
  readonly cancelLabel  = computed(() => this.state().cancelLabel);
  readonly variant   = computed(() => this.state().variant);

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      this.isOpen() ? dialog.showModal() : dialog.close();
    });
  }

  onConfirm(): void { this.dialogService._handleConfirm(); }
  onCancel(): void  { this.dialogService._handleCancel(); }

  // Clicking ::backdrop fires click on <dialog> itself
  onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dialogService._handleCancel();
    }
  }
}