import { SchemaPath, validate } from '@angular/forms/signals';

const HAS_LOWERCASE = /(?=.*[a-z])/;
const HAS_UPPERCASE = /(?=.*[A-Z])/;
const HAS_DIGIT     = /(?=.*\d)/;
const HAS_SPECIAL   = /(?=.*[!@#$%^&*(),.?"':{}|<>])/;
const MIN_LENGTH    = 8;

export function strongPasswordChecklist(path: SchemaPath<string>): void {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (!value) return null;

    const errors = [];

    if (!HAS_LOWERCASE.test(value))
      errors.push({ kind: 'password-lowercase', message: 'At least one lowercase letter' });

    if (!HAS_UPPERCASE.test(value))
      errors.push({ kind: 'password-uppercase', message: 'At least one uppercase letter' });

    if (!HAS_DIGIT.test(value))
      errors.push({ kind: 'password-digit', message: 'At least one number' });

    if (!HAS_SPECIAL.test(value))
      errors.push({ kind: 'password-special', message: 'At least one special character (!@#$%^&*...)' });

    if (value.length < MIN_LENGTH)
      errors.push({ kind: 'password-length', message: `At least ${MIN_LENGTH} characters` });

    return errors.length ? errors : null;
  });
}

export function strongPassword(path: SchemaPath<string>): void {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (!value) return null;

    if (!HAS_LOWERCASE.test(value))
      return { kind: 'password', message: 'Password must contain at least one lowercase letter' };

    if (!HAS_UPPERCASE.test(value))
      return { kind: 'password', message: 'Password must contain at least one uppercase letter' };

    if (!HAS_DIGIT.test(value))
      return { kind: 'password', message: 'Password must contain at least one number' };

    if (!HAS_SPECIAL.test(value))
      return { kind: 'password', message: 'Password must contain at least one special character (!@#$%^&*...)' };

    if (value.length < MIN_LENGTH)
      return { kind: 'password', message: `Password must be at least ${MIN_LENGTH} characters` };

    return null;
  });
}