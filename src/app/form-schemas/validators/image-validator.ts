import { LogicFn, PathKind, SchemaPath, SchemaPathRules, validate, ValidationError } from "@angular/forms/signals";


export function fileType(path: SchemaPath<File | null, SchemaPathRules.Supported>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (!(value instanceof File)) return null;
    if (!allowed.includes(value.type)) return { kind: 'custom', message: `Allowed types: ${allowed.join(', ')}` } as ValidationError;
    return null;
  });
}