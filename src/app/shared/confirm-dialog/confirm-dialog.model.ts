export interface ConfirmDialogConfig {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly variant?: ConfirmDialogVariant;
}

export type ConfirmDialogVariant = 'default' | 'destructive';

export const CONFIRM_DIALOG_DEFAULTS = {
  CONFIRM_LABEL: 'Continue',
  CANCEL_LABEL: 'Cancel',
  VARIANT: 'default' as ConfirmDialogVariant,
} as const;
