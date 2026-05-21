import { required, schema } from '@angular/forms/signals';
import { emailOrUsername } from '../validators/email-or-username-validator';
import { strongPassword } from '../validators/strong-password.validator';
import { minChars } from '../validators/min-chars-validator';
import { LoginCredentials } from '../../features/Auth/login/login.model';


export const loginSchema = schema<LoginCredentials>((path) => {
  required(path.emailOrUsername);
  emailOrUsername(path.emailOrUsername);
  required(path.password);
  strongPassword(path.password);
});
