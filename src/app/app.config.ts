import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  Injector,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import {
  authInterceptor,
  credentialsInterceptor,
  csrfInterceptor,
  errorInterceptor,
} from './core/interceptors';
import { authInitializer } from './core/auth';
import { GlobalErrorHandler } from './core/error-handler/global-error-handler';
import { LOCAL_STORAGE_CONFIG } from './core/local-storage/local-storage.service';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        csrfInterceptor,
        authInterceptor,
        errorInterceptor,
      ]),
    ),

    provideAppInitializer(() => {
      const injector = inject(Injector);
      return authInitializer(injector)();
    }),

    {
      provide: LOCAL_STORAGE_CONFIG,
      useValue: {
        prefix: environment.storagePrefix,   
        obfuscationKey: environment.storageKey  
      }
    }
  ],
};
