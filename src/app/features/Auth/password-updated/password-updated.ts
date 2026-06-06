import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-updated',
  imports: [RouterLink],
  templateUrl: './password-updated.html',
  styleUrls: ['../shared/auth-shared.css', './password-updated.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordUpdated {}
