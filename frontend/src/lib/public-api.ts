import { API_BASE_URL } from './config';
import { PublicContentResponse } from '@/types/content';

export async function getPublicContent(): Promise<PublicContentResponse> {
  const response = await fetch(`${API_BASE_URL}/public/content`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to load public content');
  }
  return response.json();
}
