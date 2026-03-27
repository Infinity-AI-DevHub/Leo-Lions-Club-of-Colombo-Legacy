'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowRight, Sparkles, Target } from 'lucide-react';
import {
  getMotivationLevel,
  getMotivationScore,
  MOTIVATION_SCORE_EVENT,
} from '@/lib/motivation-client';

type LevelDef = {
  name: string;
  min: number;
  max: number;
  message: string;
};

const LEVELS: LevelDef[] = [
  { name: 'Curious Visitor', min: 0, max: 19, message: 'You are just getting started.' },
  { name: 'Interested Explorer', min: 20, max: 39, message: 'You are discovering what makes us different.' },
  { name: 'Inspired Supporter', min: 40, max: 59, message: 'You are getting closer to becoming part of the legacy.' },
  { name: 'Future Changemaker', min: 60, max: 79, message: 'You are building strong momentum toward impact.' },
  { name: 'Future Leo', min: 80, max: 99, message: 'You look ready to make an impact with us.' },
  { name: 'Ready to Join', min: 100, max: 9999, message: 'You are ready to join the movement.' },
];

function resolveLevel(score: number) {
  return LEVELS.find((level) => score >= level.min && score <= level.max) || LEVELS[0];
}

function ctaForScore(score: number) {
  if (score >= 90) return { label: 'Apply to Join Now', href: '/membership' };
  if (score >= 65) return { label: 'Start Your Membership Journey', href: '/membership' };
  if (score >= 35) return { label: 'See How You Can Join', href: '/membership' };
  return { label: 'Explore Our Impact', href: '/projects' };
}

function progressPercent(score: number, level: LevelDef) {
  if (level.name === 'Ready to Join') return 100;
  const range = Math.max(1, level.max - level.min + 1);
  return Math.min(100, Math.max(0, ((score - level.min) / range) * 100));
}

export function JoinMotivationWidget() {
  const [score, setScore] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [toast, setToast] = useState('');
  const lastLevel = useRef<string>('Curious Visitor');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initialScore = getMotivationScore();
      const initialLevel = getMotivationLevel();
      setScore(initialScore);
      lastLevel.current = initialLevel || resolveLevel(initialScore).name;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ score?: number }>;
      const nextScore = Number(custom.detail?.score || 0);
      setScore(nextScore);
      const nextLevel = resolveLevel(nextScore).name;
      if (nextLevel !== lastLevel.current) {
        setToast(`You unlocked: ${nextLevel}`);
        lastLevel.current = nextLevel;
      }
    };
    window.addEventListener(MOTIVATION_SCORE_EVENT, handler as EventListener);
    return () => window.removeEventListener(MOTIVATION_SCORE_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const level = useMemo(() => resolveLevel(score), [score]);
  const cta = useMemo(() => ctaForScore(score), [score]);
  const progress = useMemo(() => progressPercent(score, level), [score, level]);

  if (dismissed) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 w-[290px] rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white/95 via-sky-50/95 to-blue-100/95 p-4 shadow-[0_18px_36px_rgba(10,70,130,0.26)] backdrop-blur-md sm:bottom-6 sm:right-6">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">Join Motivation Meter</p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded px-1 text-xs text-slate-500 hover:bg-white/70 hover:text-slate-700"
            aria-label="Close meter"
          >
            ×
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Sparkles size={16} className="text-sky-700" />
          <p className="text-sm font-semibold text-slate-900">{level.name}</p>
        </div>
        <div className="mt-2">
          <div className="h-2.5 rounded-full bg-sky-100/90">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-700 to-cyan-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-2xl font-bold text-sky-900">{score}</p>
          <span className="rounded-full border border-sky-200 bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
            Live
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-600">{level.message}</p>
        <Link
          href={cta.href}
          data-motivation-event={cta.href === '/membership' ? 'join_cta_click' : 'learn_more_click'}
          data-motivation-label="motivation_widget_cta"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-700 to-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm"
        >
          {cta.label}
          <ArrowRight size={14} />
        </Link>
      </div>

      {toast ? (
        <div className="fixed bottom-24 right-4 z-40 rounded-xl border border-sky-200 bg-white/95 px-3 py-2 text-xs font-semibold text-sky-800 shadow-lg sm:right-6">
          {toast}
        </div>
      ) : null}
    </>
  );
}

export function JoinMotivationInline({ compact = false }: { compact?: boolean }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setScore(getMotivationScore()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ score?: number }>;
      setScore(Number(custom.detail?.score || 0));
    };
    window.addEventListener(MOTIVATION_SCORE_EVENT, handler as EventListener);
    return () => window.removeEventListener(MOTIVATION_SCORE_EVENT, handler as EventListener);
  }, []);

  const level = useMemo(() => resolveLevel(score), [score]);
  const cta = useMemo(() => ctaForScore(score), [score]);
  const progress = useMemo(() => progressPercent(score, level), [score, level]);

  return (
    <div
      className={clsx(
        'rounded-3xl border border-sky-200/70 bg-gradient-to-r from-sky-900 via-blue-800 to-cyan-700 text-white shadow-xl',
        compact ? 'p-4' : 'p-6 md:p-8',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Join Motivation Meter</p>
          <h3 className="mt-1 text-2xl font-bold">{level.name}</h3>
          <p className="mt-1 max-w-xl text-sm text-sky-100/95">{level.message}</p>
        </div>
        <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.15em] text-sky-100/90">Motivation Score</p>
          <p className="text-3xl font-bold">{score}</p>
        </div>
      </div>
      <div className="mt-4 h-2.5 rounded-full bg-white/20">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-cyan-300 to-sky-100 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={cta.href}
          data-motivation-event={cta.href === '/membership' ? 'join_cta_click' : 'learn_more_click'}
          data-motivation-label="motivation_inline_cta"
          className="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-900"
        >
          <Target size={14} />
          {cta.label}
        </Link>
        <span className="text-xs text-sky-100/90">Progress persists while you explore.</span>
      </div>
    </div>
  );
}
