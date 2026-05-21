import { email, required, schema, validate } from '@angular/forms/signals';
import { strongPasswordChecklist } from '../validators/strong-password.validator';
import { username } from '../validators/username-validator';
import { minWords } from '../validators/min-words-validator';
import { fileType } from '../validators/image-validator';
import { dateInPast } from '../validators/date-past-validator';
import { RegisterFormModel } from '../../features/Auth/register/register.model';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const registerSchema = schema<RegisterFormModel>((path) => {

  required(path.fullName);
  minWords(path.fullName, 2);

  required(path.username);
  username(path.username);

  required(path.email);
  email(path.email);
  required(path.birthDate);
  dateInPast(path.birthDate);

  required(path.passwordForm.password);
  strongPasswordChecklist(path.passwordForm.password);

  required(path.passwordForm.confirmPassword);
  validate(path.passwordForm.confirmPassword, ({ value, valueOf, stateOf }) => {
    if (!stateOf(path.passwordForm.password).touched()) return undefined;
    return value() !== valueOf(path.passwordForm.password)
      ? { kind: 'passwordMismatch', message: 'Passwords do not match' }
      : undefined;
  });

  fileType(path.profileImage, ALLOWED_IMAGE_TYPES);
});
