import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [],
  templateUrl: './offline.html',
  styleUrl: './offline.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineComponent {
  private readonly router = inject(Router);

  readonly retrying = signal(false);

  retry(): void {
    this.retrying.set(true);
    window.location.replace('/');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
