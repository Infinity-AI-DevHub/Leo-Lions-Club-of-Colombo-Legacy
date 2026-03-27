import { API_BASE_URL } from './config';

export function toAssetUrl(path?: string | null) {
  if (!path) return '';
  const normalized = String(path).trim();
  if (!normalized || normalized === 'null' || normalized === 'undefined') return '';
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  if (normalized.startsWith('localhost:') || normalized.startsWith('127.0.0.1:')) return `http://${normalized}`;
  if (normalized.startsWith('//localhost:') || normalized.startsWith('//127.0.0.1:')) return `http:${normalized}`;
  if (normalized.startsWith('/uploads/')) return `${API_BASE_URL}${normalized}`;
  if (normalized.startsWith('uploads/')) return `${API_BASE_URL}/${normalized}`;
  const uploadsIndex = normalized.indexOf('/uploads/');
  if (uploadsIndex >= 0) return `${API_BASE_URL}${normalized.slice(uploadsIndex)}`;
  if (normalized.startsWith('uploads\\')) {
    return `${API_BASE_URL}/${normalized.replace(/\\/g, '/').replace(/^\/+/, '')}`;
  }
  return normalized;
}
