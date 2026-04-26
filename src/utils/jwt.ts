import type { JwtPayload, UserPreferences } from '@/types';

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function normalizeRoles(roles: JwtPayload['roles']): string[] {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return list.map((v) => `${v}`.trim()).filter(Boolean);
}

export function getValidStr(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const clean = value.trim();
  return clean.length > 0 ? clean : undefined;
}

export function buildPreferences(payload: JwtPayload | null): UserPreferences {
  if (!payload) return {};
  const lang = getValidStr(payload.lang)?.slice(0, 2).toLowerCase();
  const ui = payload.uiPreferences ?? {};
  return {
    ...(lang ? { lang } : {}),
    ...(typeof ui.isDarkMode === 'boolean' ? { isDarkMode: ui.isDarkMode } : {}),
    ...(typeof ui.pinHeader === 'boolean' ? { pinHeader: ui.pinHeader } : {}),
    ...(typeof ui.pinFooter === 'boolean' ? { pinFooter: ui.pinFooter } : {}),
    ...(typeof ui.navbarCollapsed === 'boolean' ? { navbarCollapsed: ui.navbarCollapsed } : {})
  };
}
