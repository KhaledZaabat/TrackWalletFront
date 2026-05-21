import { SchemaPath, validate } from '@angular/forms/signals';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function dateInPast(path: SchemaPath<string>) {
  validate(path, ({ value }) => {
    const v = value();
    if (!v || !ISO_DATE.test(v)) return null;

    const today = new Date();
    const todayIso =
      `${today.getFullYear()}-` +
      `${String(today.getMonth() + 1).padStart(2, '0')}-` +
      `${String(today.getDate()).padStart(2, '0')}`;

    return v > todayIso
      ? { kind: 'date-future', message: 'Date cannot be in the future.' }
      : null;
  });
}
