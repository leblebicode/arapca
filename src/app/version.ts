/** Bump this string before each publish to invalidate client sessions. */
export const APP_VERSION = '1.0.1';

export const STORAGE_PREFIX = 'arapca.';
export const VERSION_KEY = 'arapca.app.version';

/** Clears all app localStorage keys when APP_VERSION changes. */
export function syncAppStorageVersion(): void {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored === APP_VERSION) {
      return;
    }

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
      }
    }

    for (const key of keys) {
      localStorage.removeItem(key);
    }

    localStorage.setItem(VERSION_KEY, APP_VERSION);
  } catch {
    // Some mobile privacy modes can block storage access.
  }
}
