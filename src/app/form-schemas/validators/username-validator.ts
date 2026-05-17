import {
  SchemaPath,
  validate,
  validateHttp,
  debounce,
} from '@angular/forms/signals';
import { environment } from '../../environments/environment';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;

export function username(path: SchemaPath<string>): void {

  validate(path, (ctx) => {
    const value = ctx.value() ?? '';

    if (USERNAME_REGEX.test(value)) return null;

    return {
      kind: 'username',
      message: 'Enter a valid username',
    };
  });

  debounce(path, 300);

  validateHttp(path, {
    request: ({ value }) => {
      const username = value();
      if (!username || username.length < 3) return undefined;

      return `${environment.apiUrl}/users/check-username?username=${username}`;
    },

    onSuccess: (response: { isAvailable: boolean }) => {
      return response.isAvailable
        ? null
        : {
            kind: 'usernameTaken',
            message: 'Username is already taken',
          };
    },

    onError: (error) => {
      console.error('Username check failed:', error);
      return {
        kind: 'serverError',
        message: 'Could not verify username availability',
      };
    },
  });
}