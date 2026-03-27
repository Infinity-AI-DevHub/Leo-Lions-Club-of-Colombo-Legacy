'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ENGAGEMENT_SCORE_EVENT, getEngagementScore } from '@/lib/engagement-client';

function level(score: number) {
  if (score >= 220) return 'Legacy Champion';
  if (score >= 140) return 'Impact Explorer';
  if (score >= 70) return 'Inspired Visitor';
  return 'Getting Started';
}

export function EngagementFloatingCard() {
  const [score, setScore] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const initialScore = window.setTimeout(() => setScore(getEngagementScore()), 0);
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ score?: number }>;
      setScore(Number(custom.detail?.score || 0));
    };
    window.addEventListener(ENGAGEMENT_SCORE_EVENT, handler as EventListener);
    return () => {
      window.clearTimeout(initialScore);
      window.removeEventListener(ENGAGEMENT_SCORE_EVENT, handler as EventListener);
    };
  }, []);

  const label = useMemo(() => level(score), [score]);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[220px] rounded-2xl border border-sky-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:bottom-6 sm:right-6 sm:w-[250px]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Visitor Engagement</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded px-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close engagement card"
        >
          ×
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Sparkles size={16} className="text-sky-700" />
        <p className="text-sm font-semibold text-slate-800">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-sky-800">{score}</p>
      <p className="text-xs text-slate-500">Your session activity score</p>
    </div>
  );
}
