const UTM_STORAGE_KEY = 'papercraft_utms';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtms(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }

  if (Object.keys(utms).length > 0) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms));
  }
}

export function getStoredUtms(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getFbc(): string | null {
  return getCookie('_fbc');
}

export function getFbp(): string | null {
  return getCookie('_fbp');
}
