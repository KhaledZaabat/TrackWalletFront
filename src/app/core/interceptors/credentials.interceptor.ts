import {
  HttpContextToken,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const SUPPRESS_CREDENTIALS = new HttpContextToken<boolean>(() => false);

export const credentialsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next,
) => {
  if (req.context.get(SUPPRESS_CREDENTIALS)) return next(req);
  return next(req.clone({ withCredentials: true }));
};
