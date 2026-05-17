import { required, schema } from '@angular/forms/signals';
import { LoginCredentials } from '../../features/login/login.model';
import { emailOrUsername } from '../validators/email-or-username-validator';
import { strongPassword } from '../validators/strong-password.validator';


export const loginSchema = schema<LoginCredentials>((path) => {
  required(path.emailOrUsername);
  emailOrUsername(path.emailOrUsername);
  required(path.password);
  strongPassword(path.password);

});
