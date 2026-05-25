import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../http/api.service';
import { SKIP_AUTH_REDIRECT } from '../interceptors/auth.interceptor';
import { SUPPRESS_TOAST } from '../interceptors/error.interceptor';
import { User } from './models/me-response.model';
import { RegisterRequest } from '../../features/Auth/register/register.model';
import { ComfirmEmailRequest } from './confirm-email-request';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  me(): Observable<User> {
    return this.api.get<User>('/identity/me', {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
    });
  }

  login(credentials: LoginRequest): Observable<User> {
    const ctx = new HttpContext()
      .set(SKIP_AUTH_REDIRECT, true)
      .set(SUPPRESS_TOAST, true);
    return this.api.post<User>('/identity/login', credentials, { context: ctx });
  }

  register(req: RegisterRequest): Observable<void> {
    const fd = new FormData();
    fd.append('Email',     req.email);
    fd.append('Password',  req.password);
    fd.append('UserName',  req.userName);
    fd.append('FullName',  req.fullName);
    fd.append('BirthDate', req.birthDate);            
    fd.append('IsMale',    String(req.isMale));

    if (req.profileImage) {
      fd.append('ProfileImage', req.profileImage, req.profileImage.name);
    }

    return this.api.post<void>('/identity/register', fd);
  }
  resendConfirmationLink(request:ComfirmEmailRequest):Observable<void>{

return this.api.post<void>("/identity/confirm-account/email/resend",request,{});

  }
  logout(): Observable<void> {
    return this.api.post<void>('/identity/logout', {});
  }
}
