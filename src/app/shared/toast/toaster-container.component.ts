import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastItem, ToastSeverity } from './toast.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toaster-container',
  standalone: true,
  templateUrl: './toaster-container.component.html',
  styleUrl: './toaster-container.component.css',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterContainerComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  onMouseEnter(id: string): void {
    this.toastService.pauseTimer(id);
  }

  onMouseLeave(id: string): void {
    this.toastService.resumeTimer(id);
  }

  onDismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  trackById(_index: number, toast: ToastItem): string {
    return toast.id;
  }

  getAriaLive(severity: ToastSeverity): 'polite' | 'assertive' {
    return severity === 'error' || severity === 'warning' ? 'assertive' : 'polite';
  }

  getRole(severity: ToastSeverity): 'alert' | 'status' {
    return severity === 'error' || severity === 'warning' ? 'alert' : 'status';
  }

 readonly toastClassMap = {
  success: 'toast--success',
  error: 'toast--error',
  warning: 'toast--warning',
  info: 'toast--info',
} as const;
}
