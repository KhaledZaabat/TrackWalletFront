import { ConfirmDialogVariant } from './confirm-dialog.model';

export interface DialogState {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly variant: ConfirmDialogVariant;
}
