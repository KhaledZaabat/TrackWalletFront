import {
  createMetadataKey,
  LogicFn,
  metadata,
  SchemaPath,
  validate,
} from '@angular/forms/signals';

export const MIN_CHARS = createMetadataKey<number>();

export function minChars(
  path: SchemaPath<string>,
  minValue: number | LogicFn<string, number>,
) {
  metadata(path, MIN_CHARS, (ctx) =>
    typeof minValue === 'number' ? minValue : minValue(ctx),
  );

  validate(path, (ctx) => {
    const value = ctx.value() ?? '';
    const thresholdSignal = ctx.state.metadata(MIN_CHARS);
    if (thresholdSignal === undefined) return null;

    const threshold = thresholdSignal();
    if (threshold === undefined) return null;

    const charCount = value.trim().length;
    if (charCount < threshold) {
      return {
        kind: 'min-chars',
        message: `Must be at least ${threshold} characters long (currently ${charCount})`,
      };
    }
    return null;
  });
}