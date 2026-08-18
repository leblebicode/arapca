/** Bump this string before each publish to invalidate client sessions and cached bundles. */
export const APP_VERSION = '1.0.2';

export const STORAGE_PREFIX = 'arapca.';
export const VERSION_KEY = 'arapca.app.version';
const REFRESH_PARAM = '_v';

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

/** Returns true when a newer published version was found and a reload was triggered. */
export async function checkForAppUpdate(): Promise<boolean> {
  try {
    const response = await fetch(versionJsonUrl(), { cache: 'no-store' });
    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { version?: string };
    const remote = payload.version;
    if (!remote || remote === APP_VERSION) {
      return false;
    }

    const page = new URL(window.location.href);
    if (page.searchParams.get(REFRESH_PARAM) === remote) {
      return false;
    }

    await clearBrowserCaches();

    page.searchParams.set(REFRESH_PARAM, remote);
    window.location.replace(page.toString());
    return true;
  } catch {
    return false;
  }
}

function versionJsonUrl(): string {
  const base = document.querySelector('base')?.href ?? window.location.href;
  return new URL(`version.json?t=${Date.now()}`, base).toString();
}

async function clearBrowserCaches(): Promise<void> {
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
}
