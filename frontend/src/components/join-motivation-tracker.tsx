'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import {
  endMotivationSession,
  getMotivationSessionToken,
  startMotivationSession,
  trackMotivationEvent,
} from '@/lib/motivation-client';

const KEY_PAGES = [/^\/about/, /^\/leadership/, /^\/projects/, /^\/events/, /^\/membership/, /^\/contact/];

const LEGACY_EVENT_MAP: Record<string, string> = {
  project_open: 'project_view',
  event_open: 'event_view',
  gallery_open: 'gallery_open',
  contact_submit: 'contact_submit',
  membership_submit: 'join_form_submit',
};

function pathEvent(pathname: string): string | null {
  if (/^\/membership(\/|$)/.test(pathname)) return 'join_page_view';
  if (/^\/leadership(\/|$)/.test(pathname)) return 'leadership_view';
  if (/^\/projects\/[^/]+/.test(pathname)) return 'project_view';
  if (/^\/events\/[^/]+/.test(pathname)) return 'event_view';
  if (/^\/gallery(\/|$)/.test(pathname)) return 'gallery_open';
  return null;
}

export function JoinMotivationTracker() {
  const pathname = usePathname();
  const dedup = useRef<Set<string>>(new Set());
  const clickCooldown = useRef<Record<string, number>>({});
  const rafLock = useRef(false);

  const isKeyPage = useMemo(() => KEY_PAGES.some((rule) => rule.test(pathname)), [pathname]);

  useEffect(() => {
    startMotivationSession(pathname);
  }, [pathname]);

  useEffect(() => {
    trackMotivationEvent('page_view', pathname, 'page_view');
    const routeEvent = pathEvent(pathname);
    if (routeEvent) {
      const key = `${pathname}:${routeEvent}`;
      if (!dedup.current.has(key)) {
        dedup.current.add(key);
        trackMotivationEvent(routeEvent, pathname, routeEvent);
      }
    }

    if (!isKeyPage) return;
    const t30 = window.setTimeout(() => {
      const key = `${pathname}:page_time_30s`;
      if (dedup.current.has(key)) return;
      dedup.current.add(key);
      trackMotivationEvent('page_time_30s', pathname, '30_seconds');
    }, 30000);

    const t60 = window.setTimeout(() => {
      const key = `${pathname}:page_time_60s`;
      if (dedup.current.has(key)) return;
      dedup.current.add(key);
      trackMotivationEvent('page_time_60s', pathname, '60_seconds');
    }, 60000);

    return () => {
      window.clearTimeout(t30);
      window.clearTimeout(t60);
    };
  }, [pathname, isKeyPage]);

  useEffect(() => {
    function onScroll() {
      if (!isKeyPage || rafLock.current) return;
      rafLock.current = true;
      window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const max = root.scrollHeight - root.clientHeight;
        const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;

        if (ratio >= 50) {
          const key = `${pathname}:scroll_50`;
          if (!dedup.current.has(key)) {
            dedup.current.add(key);
            trackMotivationEvent('scroll_50', pathname, 'scroll_50_percent');
          }
        }
        if (ratio >= 80) {
          const key = `${pathname}:scroll_80`;
          if (!dedup.current.has(key)) {
            dedup.current.add(key);
            trackMotivationEvent('scroll_80', pathname, 'scroll_80_percent');
          }
        }
        rafLock.current = false;
      });
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest('[data-motivation-event], [data-engagement-event]') as HTMLElement | null;
      if (!clickable) return;

      const explicit = clickable.dataset.motivationEvent || '';
      const legacy = clickable.dataset.engagementEvent || '';
      let eventType = explicit || LEGACY_EVENT_MAP[legacy] || '';

      if (!eventType && legacy === 'cta_click') {
        const labelLower = (clickable.dataset.engagementLabel || clickable.textContent || '').toLowerCase();
        eventType = labelLower.includes('join') || labelLower.includes('membership') ? 'join_cta_click' : 'learn_more_click';
      }

      if (!eventType) return;
      const label =
        clickable.dataset.motivationLabel ||
        clickable.dataset.engagementLabel ||
        clickable.textContent?.trim() ||
        eventType;
      const dedupKey = `${pathname}:${eventType}:${label}`;
      const now = Date.now();
      if (clickCooldown.current[dedupKey] && now - clickCooldown.current[dedupKey] < 3000) return;
      clickCooldown.current[dedupKey] = now;

      trackMotivationEvent(eventType, pathname, label, {
        href: clickable.getAttribute('href') || '',
      });

      const followup = clickable.dataset.motivationFollowup || '';
      if (followup) {
        window.setTimeout(() => {
          trackMotivationEvent(followup, pathname, `${followup}_auto`);
        }, 1200);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onDocumentClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDocumentClick);
    };
  }, [pathname, isKeyPage]);

  useEffect(() => {
    const onBeforeUnload = () => endMotivationSession();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  useEffect(() => {
    getMotivationSessionToken();
  }, []);

  return null;
}
