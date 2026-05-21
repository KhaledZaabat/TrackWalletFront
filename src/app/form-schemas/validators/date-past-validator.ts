import { SchemaPath, SchemaPathRules, validate, ValidationError } from "@angular/forms/signals";

export function dateInPast(path: SchemaPath<Date | null, SchemaPathRules.Supported>) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (!(value instanceof Date)) return null;
    if (value > new Date()) return { kind: 'custom', message: 'Date cannot be in the future.' } as ValidationError;
    return null;
  });
}
