'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';

type VoteDetails = {
  poll: { id: number; title: string; description?: string; status: string };
  totalVotes: number;
  optionBreakdown: Array<{ index: number; label: string; votes: number }>;
  votes: Array<{
    id: number;
    visitorToken: string;
    optionIndex: number;
    optionLabel: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

export default function AdminPollVoteDetailsPage() {
  const params = useParams<{ id: string }>();
  const pollId = Number(params?.id || 0);
  const [details, setDetails] = useState<VoteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!pollId) return;
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get(`/admin/polls/votes/${pollId}`)
      .then((res) => setDetails(res.data))
      .catch(() => setNotice('Failed to load poll vote details.'))
      .finally(() => setLoading(false));
  }, [pollId]);

  const maxVotes = useMemo(
    () => Math.max(1, ...(details?.optionBreakdown.map((item) => item.votes) || [1])),
    [details?.optionBreakdown],
  );

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6">
          <Link href="/admin/poll-votes" className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            ← Back to Poll Votes
          </Link>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{details?.poll.title || 'Poll Vote Details'}</h2>
          <p className="mt-1 text-sm text-slate-600">{details?.poll.description || 'Detailed vote records for this poll.'}</p>
        </div>

        {notice ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{notice}</div>
        ) : null}

        {loading ? (
          <div className="mt-4 glass-panel rounded-2xl p-5 text-sm text-slate-500">Loading vote details...</div>
        ) : details ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Votes</p>
                <p className="mt-2 text-3xl font-bold text-sky-800">{details.totalVotes}</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Options</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{details.optionBreakdown.length}</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">{details.poll.status}</p>
              </div>
            </div>

            <div className="mt-6 glass-panel rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-900">Option Breakdown</h3>
              <div className="mt-4 space-y-3">
                {details.optionBreakdown.map((item) => (
                  <div key={`${item.index}-${item.label}`}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.votes}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700"
                        style={{ width: `${Math.round((item.votes / maxVotes) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 glass-panel rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-900">Vote Records</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-2 py-2">Token</th>
                      <th className="px-2 py-2">Selected Option</th>
                      <th className="px-2 py-2">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.votes.map((vote) => (
                      <tr key={vote.id} className="border-b border-slate-100 text-slate-700">
                        <td className="px-2 py-2 font-mono text-xs">{vote.visitorToken}</td>
                        <td className="px-2 py-2">{vote.optionLabel}</td>
                        <td className="px-2 py-2">{new Date(vote.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {details.votes.length === 0 ? (
                  <p className="py-4 text-sm text-slate-500">No vote records yet.</p>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </AdminShell>
    </AdminGuard>
  );
}
