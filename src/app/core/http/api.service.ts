import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type QueryParamValue = string | number | boolean;

export type QueryParams = Record<
  string,
  QueryParamValue | ReadonlyArray<QueryParamValue> | null | undefined
>;

export type HeaderInput =
  | HttpHeaders
  | Record<string, string | ReadonlyArray<string>>;

/** Options accepted by every verb. */
export interface ApiRequestOptions {
  headers?: HeaderInput;
  params?: QueryParams | HttpParams;
  context?: HttpContext;
  withCredentials?: boolean;
  reportProgress?: boolean;
}

export interface ApiResponseOptions extends ApiRequestOptions {
  observe: 'response';
}

export interface ApiEventsOptions extends ApiRequestOptions {
  observe: 'events';
  reportProgress: true;
}

export type ApiOptions = ApiRequestOptions;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  get<T>(path: string, options?: ApiOptions): Observable<T>;
  get<T>(path: string, options: ApiResponseOptions): Observable<HttpResponse<T>>;
  get<T>(path: string, options: ApiEventsOptions): Observable<HttpEvent<T>>;
  get<T>(path: string, options: ApiOptions | ApiResponseOptions | ApiEventsOptions = {}): Observable<unknown> {
    return this.http.get<T>(this.url(path), this.toAngularOptions(options) as never);
  }

  post<T>(path: string, body: unknown, options?: ApiOptions): Observable<T>;
  post<T>(path: string, body: unknown, options: ApiResponseOptions): Observable<HttpResponse<T>>;
  post<T>(path: string, body: unknown, options: ApiEventsOptions): Observable<HttpEvent<T>>;
  post<T>(path: string, body: unknown, options: ApiOptions | ApiResponseOptions | ApiEventsOptions = {}): Observable<unknown> {
    return this.http.post<T>(this.url(path), body, this.toAngularOptions(options) as never);
  }

  put<T>(path: string, body: unknown, options?: ApiOptions): Observable<T>;
  put<T>(path: string, body: unknown, options: ApiResponseOptions): Observable<HttpResponse<T>>;
  put<T>(path: string, body: unknown, options: ApiEventsOptions): Observable<HttpEvent<T>>;
  put<T>(path: string, body: unknown, options: ApiOptions | ApiResponseOptions | ApiEventsOptions = {}): Observable<unknown> {
    return this.http.put<T>(this.url(path), body, this.toAngularOptions(options) as never);
  }

  patch<T>(path: string, body: unknown, options?: ApiOptions): Observable<T>;
  patch<T>(path: string, body: unknown, options: ApiResponseOptions): Observable<HttpResponse<T>>;
  patch<T>(path: string, body: unknown, options: ApiEventsOptions): Observable<HttpEvent<T>>;
  patch<T>(path: string, body: unknown, options: ApiOptions | ApiResponseOptions | ApiEventsOptions = {}): Observable<unknown> {
    return this.http.patch<T>(this.url(path), body, this.toAngularOptions(options) as never);
  }

  delete<T>(path: string, options?: ApiOptions): Observable<T>;
  delete<T>(path: string, options: ApiResponseOptions): Observable<HttpResponse<T>>;
  delete<T>(path: string, options: ApiEventsOptions): Observable<HttpEvent<T>>;
  delete<T>(path: string, options: ApiOptions | ApiResponseOptions | ApiEventsOptions = {}): Observable<unknown> {
    return this.http.delete<T>(this.url(path), this.toAngularOptions(options) as never);
  }


  private url(path: string): string {
    return path.startsWith('http') ? path : `${this.base}${path}`;
  }

  private buildParams(params?: QueryParams | HttpParams): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;

    let httpParams = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) continue;
      if (Array.isArray(v)) {
        for (const item of v) httpParams = httpParams.append(k, String(item));
      } else {
        httpParams = httpParams.set(k, String(v));
      }
    }
    return httpParams;
  }

  private buildHeaders(headers?: HeaderInput): HttpHeaders | undefined {
    if (!headers) return undefined;
    if (headers instanceof HttpHeaders) return headers;
    const init: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(headers)) {
      init[k] = Array.isArray(v) ? [...v] : (v as string);
    }
    return new HttpHeaders(init);
  }

  private toAngularOptions(options: ApiRequestOptions & { observe?: 'body' | 'response' | 'events' }) {
    return {
      headers: this.buildHeaders(options.headers),
      params: this.buildParams(options.params),
      context: options.context,
      withCredentials: options.withCredentials,
      reportProgress: options.reportProgress,
      observe: options.observe ?? 'body',
    };
  }
}
