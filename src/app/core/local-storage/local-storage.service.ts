import {
  Injectable,
  InjectionToken,
  inject,
  signal,
  computed,
  Signal,
  DestroyRef,
} from '@angular/core';


export const TTL = {
  SECONDS: (n: number) => n * 1_000,
  MINUTES: (n: number) => n * 60_000,
  HOURS:   (n: number) => n * 3_600_000,
  DAYS:    (n: number) => n * 86_400_000,
} as const;


export interface LocalStorageConfig {
  prefix?:         string;
  obfuscationKey?: string;
}

export const LOCAL_STORAGE_CONFIG =
new InjectionToken<LocalStorageConfig>('LOCAL_STORAGE_CONFIG');


interface StorageEntry<T> {
  value:     T;
  expiresAt: number | null;
  version:   number;
}


@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private readonly destroyRef      = inject(DestroyRef);
  private readonly config          = inject(LOCAL_STORAGE_CONFIG, { optional: true });

  private readonly prefix          = this.config?.prefix        ? `${this.config.prefix}:` : '';
  private readonly obfuscationKey  = this.config?.obfuscationKey ?? null;

  private readonly _tick           = signal(0);

  constructor() {
    if (this.isBrowser) {
      const handler = (e: StorageEvent) => {
        if (e.storageArea === localStorage) this.bump();
      };

      window.addEventListener('storage', handler);
      this.destroyRef.onDestroy(() => window.removeEventListener('storage', handler));
    }
  }

setItem<T>(key: string, value: T, ttlMs?: number, version = 1): boolean {
    if (!this.isBrowser) return false;

    try {
      const entry: StorageEntry<T> = {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : null,
        version,
      };

      localStorage.setItem(this.ns(key), this.encode(JSON.stringify(entry)));
      this.bump();
      return true;

    } catch (err) {
      this.handleError('setItem', key, err);
      return false;
    }
  }

  getItem<T>(key: string, minVersion = 1): T | null {
    if (!this.isBrowser) return null;

    try {
      const raw = localStorage.getItem(this.ns(key));
      if (!raw) return null;

      const entry = this.parseEntry<T>(this.decode(raw));
      if (!entry) { this.removeItem(key); return null; }

      if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
        this.removeItem(key); return null;
      }

      if (entry.version < minVersion) {
        this.removeItem(key); return null;
      }

      return entry.value;

    } catch (err) {
      this.handleError('getItem', key, err);
      return null;
    }
  }

  getItemOrDefault<T>(key: string, defaultValue: T): T {
    return this.getItem<T>(key) ?? defaultValue;
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.ns(key));
    this.bump();
  }

  clear(): void {
    if (!this.isBrowser) return;
    for (const key of this.keys()) localStorage.removeItem(key);
    this.bump();
  }

  has(key: string): boolean {
    return this.getItem(key) !== null;
  }

  update<T>(
    key: string,
    updater: (current: T | null) => T,
    options?: { ttlMs?: number; version?: number }
  ): boolean {
    const current = this.getRawEntry<T>(key);

    return this.setItem(
      key,
      updater(current?.value ?? null),
      options?.ttlMs ?? (current?.expiresAt ? current.expiresAt - Date.now() : undefined),
      options?.version ?? current?.version ?? 1
    );
  }

  keys(): readonly string[] {
    if (!this.isBrowser) return [];
    return Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
  }

  approximateSizeBytes(): number {
    return this.keys().reduce((sum, key) => {
      const value = localStorage.getItem(key) ?? '';
      return sum + (key.length + value.length) * 2;
    }, 0);
  }

  purgeExpired(): number {
    let removed = 0;
    for (const key of this.keys()) {
      const plain = key.slice(this.prefix.length);
      if (this.getItem(plain) === null) removed++;
    }
    return removed;
  }


  watchSignal<T>(key: string, minVersion = 1): Signal<T | null> {
    return computed(() => {
      this._tick();
      return this.getItem<T>(key, minVersion);
    });
  }

  watchSignalOrDefault<T>(key: string, defaultValue: T): Signal<T> {
    return computed(() => {
      this._tick();
      return this.getItem<T>(key) ?? defaultValue;
    });
  }

  get tick(): Signal<number> {
    return this._tick.asReadonly();
  }


  private bump(): void {
    this._tick.update(v => v + 1);
  }

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private ns(key: string): string {
    return `${this.prefix}${key}`;
  }

  private encode(value: string): string {
    return this.obfuscationKey ? this.xor(value) : value;
  }

  private decode(value: string): string {
    return this.obfuscationKey ? this.xor(value) : value;
  }

  private xor(text: string): string {
    const key = this.obfuscationKey!;
    return Array.from(text)
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join('');
  }

  private parseEntry<T>(raw: string): StorageEntry<T> | null {
    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('value'   in parsed) ||
        !('version' in parsed)
      ) return null;
      return parsed as StorageEntry<T>;
    } catch {
      return null;
    }
  }

  private getRawEntry<T>(key: string): StorageEntry<T> | null {
    const raw = localStorage.getItem(this.ns(key));
    if (!raw) return null;
    return this.parseEntry<T>(this.decode(raw));
  }

  private handleError(operation: string, key: string, err: unknown): void {
    if (
      err instanceof DOMException &&
      ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(err.name)
    ) {
      console.warn(`[Storage] quota exceeded for "${key}"`);
      return;
    }
    console.error(`[Storage] ${operation}("${key}") failed`, err);
  }
}