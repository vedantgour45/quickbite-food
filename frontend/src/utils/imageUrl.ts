import { apiBaseURL } from '@/api/axiosInstance';

// Compose a full URL for an image path returned by the backend.
// - Absolute URLs pass through unchanged (http://…, https://…, data:…).
// - Relative paths are resolved against VITE_API_BASE_URL.
export const resolveImageUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const base = apiBaseURL().replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};
