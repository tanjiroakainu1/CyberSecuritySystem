import { AppStore } from '@/types/entities';
import { createSeedData } from '@/data/seed';
import { DEFAULT_ACCOUNTS, DEFAULT_PASSWORD } from '@/data/defaultAccounts';

export const STORAGE_KEY = 'cms_app_data';
export const SESSION_KEY = 'cms_auth_session';

export interface AuthSession {
  userId: string;
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function patchUsersPasswords(store: AppStore): AppStore {
  const needsPatch = store.users.some((u) => !u.password);
  if (!needsPatch) return store;

  const users = store.users.map((u) => {
    if (u.password) return u;
    const defaults = DEFAULT_ACCOUNTS.find((a) => a.email === u.email);
    return { ...u, password: defaults?.password ?? DEFAULT_PASSWORD };
  });

  const patched = { ...store, users };
  saveStore(patched);
  return patched;
}

export function loadStore(): AppStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return patchUsersPasswords(JSON.parse(raw) as AppStore);
    }
  } catch {
    // fall through to seed
  }
  const seed = createSeedData();
  saveStore(seed);
  return seed;
}

export function saveStore(data: AppStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetStore(): AppStore {
  const seed = createSeedData();
  saveStore(seed);
  return seed;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}
