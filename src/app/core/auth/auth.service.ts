import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../http/api.service';
import { SKIP_AUTH_REDIRECT } from '../interceptors/auth.interceptor';
import { SUPPRESS_TOAST } from '../interceptors/error.interceptor';
import { MeResponse } from './models/me-response.model';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  me(): Observable<MeResponse> {
    return this.api.get<MeResponse>('/identity/me', {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
    });
  }

  login(credentials: LoginRequest): Observable<MeResponse> {
    const ctx = new HttpContext()
      .set(SKIP_AUTH_REDIRECT, true)
      .set(SUPPRESS_TOAST, true);
    return this.api.post<MeResponse>('/identity/login', credentials, { context: ctx });
  }

  logout(): Observable<void> {
    return this.api.post<void>('/identity/logout', {});
  }
}
