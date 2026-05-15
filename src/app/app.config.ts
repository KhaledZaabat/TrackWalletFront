import { ApplicationConfig, inject, Injector, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { credentialsInterceptor } from './core/interceptors';
import { authInitializer } from './core/auth';
import { authInterceptor } from './core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor, authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),

    provideAppInitializer(() => {
      const injector = inject(Injector);
      return authInitializer(injector)();
    }),
  ]
};
