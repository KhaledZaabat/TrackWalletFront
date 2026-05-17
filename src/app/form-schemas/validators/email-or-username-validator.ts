import { SchemaPath, validate } from '@angular/forms/signals';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

export function emailOrUsername(path: SchemaPath<string>) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (!value) return null;
    if (EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value)) return null;
    return {
      kind: 'emailOrUsername',
      message: 'Enter a valid email or username',
    };
  });
}