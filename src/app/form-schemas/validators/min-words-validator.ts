import {
  createMetadataKey,
  LogicFn,
  metadata,
  SchemaPath,
  validate,
} from '@angular/forms/signals';

export const MIN_WORDS = createMetadataKey<number>();

export function minWords(path: SchemaPath<string>, minValue: number | LogicFn<string, number>) {
  metadata(path, MIN_WORDS, (ctx) =>
    typeof minValue === 'number' ? minValue : minValue(ctx)
  );

  validate(path, (ctx) => {
    const value = ctx.value();
    const thresholdSignal = ctx.state.metadata(MIN_WORDS);

    if (thresholdSignal === undefined) return ;

    const threshold = thresholdSignal();
    if (threshold === undefined) return;

    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount < threshold) {
      return {
        kind: 'min-words',






        
        message: `Description needs to be at least ${threshold} words long (currently there are ${wordCount} words)`,
      };
    }

    return null;
  });
}





