import { Injectable, signal } from '@angular/core';
import { ConfirmDialogConfig, CONFIRM_DIALOG_DEFAULTS } from './confirm-dialog.model';
import { DialogState } from './dialog-state.model';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly _state = signal<DialogState>({
    open: false,
    title: '',
    description: '',
    confirmLabel: CONFIRM_DIALOG_DEFAULTS.CONFIRM_LABEL,
    cancelLabel: CONFIRM_DIALOG_DEFAULTS.CANCEL_LABEL,
    variant: CONFIRM_DIALOG_DEFAULTS.VARIANT,
  });

  private _resolve: ((confirmed: boolean) => void) | null = null;

  //Public readonly signal of the dialog state 
  readonly state = this._state.asReadonly();

   //Opens the confirm dialog and returns a Promise that resolves
   //to `true` if confirmed, `false` if cancelled or dismissed.
   
  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
      this._state.set({
        open: true,
        title: config.title,
        description: config.description,
        confirmLabel: config.confirmLabel ?? CONFIRM_DIALOG_DEFAULTS.CONFIRM_LABEL,
        cancelLabel: config.cancelLabel ?? CONFIRM_DIALOG_DEFAULTS.CANCEL_LABEL,
        variant: config.variant ?? CONFIRM_DIALOG_DEFAULTS.VARIANT,
      });
    });
  }

  //Called internally by the dialog component when user confirms 
  _handleConfirm(): void {
    this._resolve?.(true);
    this._resolve = null;
    this._close();
  }

  // Called internally by the dialog component when user cancels or dismisses 
  _handleCancel(): void {
    this._resolve?.(false);
    this._resolve = null;
    this._close();
  }

  private _close(): void {
    this._state.update(s => ({ ...s, open: false }));
  }
}
