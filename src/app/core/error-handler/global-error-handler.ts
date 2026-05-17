import { ErrorHandler, Injectable, isDevMode } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (isDevMode()) {
      console.error('[GlobalErrorHandler]', error);
      return;
    }

  
    console.error('[GlobalErrorHandler]', error);
  }
}
