import { HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';


export const SUPPRESS_CREDENTIALS = new HttpContextToken<boolean>(() => false);


export const credentialsInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next) => {

  const shouldSuppress = req.context.get(SUPPRESS_CREDENTIALS);

  const clonedReq = shouldSuppress
    ? req
    : req.clone({
        withCredentials: true
      });

  return next(clonedReq);
};