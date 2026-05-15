import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type QueryParams = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  private url(path: string): string {
    return `${this.base}${path}`;
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    Object.entries(params).forEach(([k, v]) => {
      httpParams = httpParams.set(k, String(v));
    });
    return httpParams;
  }

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(this.url(path), {
      params: this.buildParams(params),
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.url(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path));
  }
}