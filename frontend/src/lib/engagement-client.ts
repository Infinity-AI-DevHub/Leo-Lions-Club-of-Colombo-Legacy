'use client';

import { API_BASE_URL } from './config';

const VISITOR_KEY = 'engagement_visitor_token';
const SESSION_KEY = 'engagement_session_token';
const STARTED_KEY = 'engagement_session_started';
const SCORE_KEY = 'engagement_session_score';
export const ENGAGEMENT_SCORE_EVENT = 'engagement-score-updated';

function token(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function getVisitorToken() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const created = token('v');
  localStorage.setItem(VISITOR_KEY, created);
  return created;
}

export function getSessionToken() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = token('s');
  sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

async function postJson(path: string, payload: Record<string, unknown>, keepalive = false) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive,
  }).catch(() => undefined);
  if (!response || !response.ok) return null;
  return response.json().catch(() => null);
}

function emitScore(score: number) {
  sessionStorage.setItem(SCORE_KEY, String(score));
  window.dispatchEvent(new CustomEvent(ENGAGEMENT_SCORE_EVENT, { detail: { score } }));
}

export function getEngagementScore() {
  return Number(sessionStorage.getItem(SCORE_KEY) || 0);
}

export function startEngagementSession(pagePath: string) {
  if (sessionStorage.getItem(STARTED_KEY) === '1') return;
  const visitorToken = getVisitorToken();
  const sessionToken = getSessionToken();
  const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  sessionStorage.setItem(STARTED_KEY, '1');
  void postJson(
    '/engagement/session/start',
    {
      visitorToken,
      sessionToken,
      pagePath,
      referrer: document.referrer || '',
      deviceType,
      browserInfo: navigator.userAgent.slice(0, 250),
    },
  ).then((result) => {
    if (result && typeof result.totalScore === 'number') {
      emitScore(result.totalScore);
    } else {
      emitScore(getEngagementScore());
    }
  });
}

export function endEngagementSession() {
  const visitorToken = localStorage.getItem(VISITOR_KEY);
  const sessionToken = sessionStorage.getItem(SESSION_KEY);
  if (!visitorToken || !sessionToken) return;
  const payload = JSON.stringify({ visitorToken, sessionToken });
  try {
    navigator.sendBeacon(
      `${API_BASE_URL}/engagement/session/end`,
      new Blob([payload], { type: 'application/json' }),
    );
  } catch {
    void postJson('/engagement/session/end', { visitorToken, sessionToken }, true);
  }
}

export function trackEngagementEvent(
  eventType: string,
  pagePath: string,
  eventLabel?: string,
  metadata?: Record<string, unknown>,
) {
  const visitorToken = getVisitorToken();
  const sessionToken = getSessionToken();
  const payload: Record<string, unknown> = {
    visitorToken,
    sessionToken,
    pagePath,
    eventType,
    eventLabel: eventLabel || '',
  };
  if (metadata && Object.keys(metadata).length > 0) {
    payload.metadata = metadata;
  }

  void postJson('/engagement/event', payload).then((result) => {
    if (!result) return;
    if (typeof result.totalScore === 'number') {
      emitScore(result.totalScore);
      return;
    }
    if (typeof result.pointsAwarded === 'number' && result.accepted) {
      emitScore(getEngagementScore() + result.pointsAwarded);
    }
  });
}
