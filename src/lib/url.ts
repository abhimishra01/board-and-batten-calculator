// Prefix a site path with the base path (set by PAGES_BASE for GitHub Pages; '/' otherwise).
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const href = (path: string): string => `${base}/${path.replace(/^\/+/, '')}`;
// Remove the base path from a URL path, so the canonical always uses the real domain.
export const stripBase = (pathname: string): string =>
  base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
