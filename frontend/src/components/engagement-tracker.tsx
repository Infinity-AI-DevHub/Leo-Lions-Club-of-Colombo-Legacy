'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  endEngagementSession,
  getSessionToken,
  startEngagementSession,
  trackEngagementEvent,
} from '@/lib/engagement-client';

export function EngagementTracker() {
  const pathname = usePathname();
  const trackedMilestones = useRef<Set<string>>(new Set());
  const lastTrackedClick = useRef<Record<string, number>>({});

  useEffect(() => {
    startEngagementSession(pathname);
  }, [pathname]);

  useEffect(() => {
    trackEngagementEvent('page_view', pathname, 'page_view');

    const t30 = window.setTimeout(() => {
      const key = `${pathname}:page_time_30s`;
      if (!trackedMilestones.current.has(key)) {
        trackedMilestones.current.add(key);
        trackEngagementEvent('page_time_30s', pathname, '30_seconds');
      }
    }, 30000);

    const t60 = window.setTimeout(() => {
      const key = `${pathname}:page_time_60s`;
      if (!trackedMilestones.current.has(key)) {
        trackedMilestones.current.add(key);
        trackEngagementEvent('page_time_60s', pathname, '60_seconds');
      }
    }, 60000);

    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const ratio = (window.scrollY / max) * 100;

      if (ratio >= 50) {
        const key50 = `${pathname}:scroll_50`;
        if (!trackedMilestones.current.has(key50)) {
          trackedMilestones.current.add(key50);
          trackEngagementEvent('scroll_50', pathname, 'scroll_50_percent');
        }
      }
      if (ratio >= 80) {
        const key80 = `${pathname}:scroll_80`;
        if (!trackedMilestones.current.has(key80)) {
          trackedMilestones.current.add(key80);
          trackEngagementEvent('scroll_80', pathname, 'scroll_80_percent');
        }
      }
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest('[data-engagement-event]') as HTMLElement | null;
      if (!clickable) return;
      const eventType = clickable.dataset.engagementEvent || '';
      if (!eventType) return;

      const label = clickable.dataset.engagementLabel || clickable.textContent?.trim() || eventType;
      const dedupKey = `${pathname}:${eventType}:${label}`;
      const now = Date.now();
      if (lastTrackedClick.current[dedupKey] && now - lastTrackedClick.current[dedupKey] < 2500) {
        return;
      }
      lastTrackedClick.current[dedupKey] = now;
      trackEngagementEvent(eventType, pathname, label, {
        href: clickable.getAttribute('href') || '',
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onDocumentClick);
    return () => {
      window.clearTimeout(t30);
      window.clearTimeout(t60);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDocumentClick);
    };
  }, [pathname]);

  useEffect(() => {
    function onBeforeUnload() {
      endEngagementSession();
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  useEffect(() => {
    // keep session token generated early
    getSessionToken();
  }, []);

  return null;
}
