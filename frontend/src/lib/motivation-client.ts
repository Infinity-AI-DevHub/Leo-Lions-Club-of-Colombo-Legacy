'use client';

import { API_BASE_URL } from './config';

const VISITOR_KEY = 'motivation_visitor_token';
const SESSION_KEY = 'motivation_session_token';
const STARTED_KEY = 'motivation_session_started';
const SCORE_KEY = 'motivation_session_score';
const LEVEL_KEY = 'motivation_session_level';

export const MOTIVATION_SCORE_EVENT = 'motivation-score-updated';

function token(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function getMotivationVisitorToken() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const created = token('mv');
  localStorage.setItem(VISITOR_KEY, created);
  return created;
}

export function getMotivationSessionToken() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = token('ms');
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

function emitScore(score: number, level?: string) {
  sessionStorage.setItem(SCORE_KEY, String(score));
  if (level) sessionStorage.setItem(LEVEL_KEY, level);
  window.dispatchEvent(new CustomEvent(MOTIVATION_SCORE_EVENT, { detail: { score, level } }));
}

export function getMotivationScore() {
  return Number(sessionStorage.getItem(SCORE_KEY) || 0);
}

export function getMotivationLevel() {
  return sessionStorage.getItem(LEVEL_KEY) || 'Curious Visitor';
}

export function startMotivationSession(pagePath: string) {
  if (sessionStorage.getItem(STARTED_KEY) === '1') return;
  sessionStorage.setItem(STARTED_KEY, '1');

  const visitorToken = getMotivationVisitorToken();
  const sessionToken = getMotivationSessionToken();
  const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

  void postJson('/motivation/session/start', {
    visitorToken,
    sessionToken,
    pagePath,
    referrer: document.referrer || '',
    deviceType,
    browserInfo: navigator.userAgent.slice(0, 240),
  }).then((result) => {
    if (!result) return;
    const score = typeof result.totalScore === 'number' ? result.totalScore : getMotivationScore();
    emitScore(score, typeof result.motivationLevel === 'string' ? result.motivationLevel : undefined);
  });
}

export function trackMotivationEvent(
  eventType: string,
  pagePath: string,
  eventLabel?: string,
  metadata?: Record<string, unknown>,
) {
  const visitorToken = getMotivationVisitorToken();
  const sessionToken = getMotivationSessionToken();
  const payload: Record<string, unknown> = {
    visitorToken,
    sessionToken,
    pagePath,
    eventType,
    eventLabel: eventLabel || eventType,
  };
  if (metadata && Object.keys(metadata).length > 0) {
    payload.metadata = metadata;
  }

  void postJson('/motivation/event', payload).then((result) => {
    if (!result || !result.accepted) return;
    const score = typeof result.totalScore === 'number' ? result.totalScore : getMotivationScore();
    const level = typeof result.motivationLevel === 'string' ? result.motivationLevel : undefined;
    emitScore(score, level);
  });
}

export function endMotivationSession() {
  const visitorToken = localStorage.getItem(VISITOR_KEY);
  const sessionToken = sessionStorage.getItem(SESSION_KEY);
  if (!visitorToken || !sessionToken) return;
  const payload = JSON.stringify({ visitorToken, sessionToken });
  try {
    navigator.sendBeacon(
      `${API_BASE_URL}/motivation/session/end`,
      new Blob([payload], { type: 'application/json' }),
    );
  } catch {
    void postJson('/motivation/session/end', { visitorToken, sessionToken }, true);
  }
}
