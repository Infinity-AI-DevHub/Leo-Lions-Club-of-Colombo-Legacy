'use client';

import { useEffect, useState } from 'react';
import { getInteractionVisitorToken } from '@/lib/interactions-client';
import { getPollResults, PollResults, undoPollVote, voteOnPoll } from '@/lib/polls-client';

export function PublicPollVoting({
  pollId,
  options,
  isClosed = false,
}: {
  pollId: number;
  options: string[];
  isClosed?: boolean;
}) {
  const [visitorToken, setVisitorToken] = useState('');
  const [results, setResults] = useState<PollResults | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getInteractionVisitorToken();
    setVisitorToken(token);
    getPollResults(pollId, token)
      .then(setResults)
      .catch(() => setError('Failed to load votes.'));
  }, [pollId]);

  async function onVote(optionIndex: number) {
    if (!visitorToken || busy || isClosed) return;
    setBusy(true);
    setError('');
    try {
      const next = await voteOnPoll(pollId, visitorToken, optionIndex);
      setResults(next);
    } catch {
      setError('Failed to save your vote.');
    } finally {
      setBusy(false);
    }
  }

  async function onUndoVote() {
    if (!visitorToken || busy || isClosed) return;
    setBusy(true);
    setError('');
    try {
      const next = await undoPollVote(pollId, visitorToken);
      setResults(next);
    } catch {
      setError('Failed to undo your vote.');
    } finally {
      setBusy(false);
    }
  }

  const safeOptions =
    results?.options && results.options.length > 0
      ? results.options
      : options.map((label, index) => ({ index, label, votes: 0, percentage: 0 }));

  return (
    <div className="mt-3 space-y-2">
      {safeOptions.map((option) => {
        const selected = results?.selectedOptionIndex === option.index;
        return (
          <button
            key={`${pollId}-${option.index}`}
            type="button"
            disabled={busy || isClosed}
            onClick={() => onVote(option.index)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${
              selected
                ? 'border-sky-400 bg-sky-50'
                : 'border-slate-200 bg-white/85 hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">{option.label}</p>
              <p className="text-xs text-slate-500">
                {option.votes} votes • {option.percentage}%
              </p>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full bg-sky-600" style={{ width: `${option.percentage}%` }} />
            </div>
          </button>
        );
      })}
      <p className="text-xs text-slate-500">Total votes: {results?.totalVotes ?? 0}</p>
      {isClosed ? (
        <p className="text-xs font-semibold text-amber-700">Voting is closed. Results are visible only.</p>
      ) : null}
      {typeof results?.selectedOptionIndex === 'number' && !isClosed ? (
        <button
          type="button"
          disabled={busy}
          onClick={onUndoVote}
          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
        >
          Undo Vote
        </button>
      ) : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
