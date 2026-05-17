import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const COOKIE_NAME = 'XSRF-TOKEN';
const HEADER_NAME = 'X-XSRF-TOKEN';
const COOKIE_REGEX = new RegExp(`(^|;\\s*)${escapeRegex(COOKIE_NAME)}=([^;]+)`);

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (!UNSAFE_METHODS.has(req.method)) return next(req);

  const doc = inject(DOCUMENT);
  const token = readCookie(doc);
  if (!token) return next(req);

  return next(req.clone({ setHeaders: { [HEADER_NAME]: token } }));
};

function readCookie(doc: Document): string | null {
  const match = doc.cookie.match(COOKIE_REGEX);
  return match ? decodeURIComponent(match[2]) : null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
