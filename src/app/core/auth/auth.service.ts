import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../http/api.service';
import { SKIP_AUTH_REDIRECT } from '../interceptors/auth.interceptor';
import { SKIP_OFFLINE_REDIRECT, SUPPRESS_TOAST } from '../interceptors/error.interceptor';
import { User } from './models/me-response.model';
import { RegisterRequest } from '../../features/auth/register/register.model';
import { ConfirmEmailRequest, SendConfirmEmailRequest } from './confirm-email-request';
import { ForgotPasswordRequest } from '../../features/auth/forget-password/forget-password-model';
import { ResetPasswordRequest } from './store/reset-password-request';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  me(): Observable<User> {
    return this.api.get<User>('/identity/me', {

      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true).set(SKIP_OFFLINE_REDIRECT, true),
    });
  }

  login(credentials: LoginRequest): Observable<User> {
    const ctx = new HttpContext()
      .set(SKIP_AUTH_REDIRECT, true)
      .set(SUPPRESS_TOAST, true)
      .set(SKIP_OFFLINE_REDIRECT, true);
    return this.api.post<User>('/identity/login', credentials, { context: ctx });
  }

  register(req: RegisterRequest): Observable<void> {
    const fd = new FormData();
    fd.append('Email', req.email);
    fd.append('Password', req.password);
    fd.append('UserName', req.userName);
    fd.append('FullName', req.fullName);
    fd.append('BirthDate', req.birthDate);
    fd.append('IsMale', String(req.isMale));

    if (req.profileImage) {
      fd.append('ProfileImage', req.profileImage, req.profileImage.name);
    }

    return this.api.post<void>('/identity/register', fd, {
      context: new HttpContext().set(SKIP_OFFLINE_REDIRECT, true),
    });
  }
  resendConfirmationLink(request: SendConfirmEmailRequest): Observable<void> {
    return this.api.post<void>('/identity/confirm-account/email/resend', request, {});
  }
  confirmEmail(request: ConfirmEmailRequest): Observable<void> {
    return this.api.post<void>('/identity/confirm-account', request, {});
  }
  sendRestPaswordLink(request:ForgotPasswordRequest):Observable<void>{
    return this.api.post<void>('/identity/forgot-password',request,{});
  }
  resetPassword(request:ResetPasswordRequest):Observable<void>{
 return this.api.post<void>('/identity/reset-password',request,{});
  }
  
  logout(): Observable<void> {
    return this.api.post<void>('/identity/logout', {});
  }
}
