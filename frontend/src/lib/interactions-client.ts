'use client';

import { API_BASE_URL } from './config';

export type InteractionTargetType = 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';

const VISITOR_KEY = 'public_interaction_visitor_token';

function token(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function getInteractionVisitorToken() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const created = token('iv');
  localStorage.setItem(VISITOR_KEY, created);
  return created;
}

export async function getInteractionSummary(targetType: InteractionTargetType, targetId: number, visitorToken?: string) {
  const query = new URLSearchParams({
    targetType,
    targetId: String(targetId),
  });
  if (visitorToken) query.set('visitorToken', visitorToken);
  const response = await fetch(`${API_BASE_URL}/public/interactions/summary?${query.toString()}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to load interactions');
  return response.json();
}

export async function submitReaction(
  targetType: InteractionTargetType,
  targetId: number,
  reactionType: 'LIKE' | 'DISLIKE',
  visitorToken: string,
) {
  const response = await fetch(`${API_BASE_URL}/public/interactions/reaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetType, targetId, reactionType, visitorToken }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to submit reaction');
  }
  return response.json();
}

export async function submitComment(
  targetType: InteractionTargetType,
  targetId: number,
  payload: { visitorToken: string; authorName?: string; comment: string },
) {
  const response = await fetch(`${API_BASE_URL}/public/interactions/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetType,
      targetId,
      visitorToken: payload.visitorToken,
      authorName: payload.authorName || 'Guest',
      comment: payload.comment,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to submit comment');
  }
  return response.json();
}

export async function submitShare(
  targetType: InteractionTargetType,
  targetId: number,
  visitorToken: string,
) {
  const response = await fetch(`${API_BASE_URL}/public/interactions/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetType, targetId, visitorToken }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to record share');
  }
  return response.json();
}
