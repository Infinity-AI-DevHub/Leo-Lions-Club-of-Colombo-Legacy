'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';

type PollOverviewItem = {
  id: number;
  title: string;
  status: string;
  totalVotes: number;
  optionBreakdown: Array<{ index: number; label: string; votes: number }>;
  createdAt: string;
};

export default function AdminPollVotesPage() {
  const [items, setItems] = useState<PollOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get('/admin/polls/votes')
      .then((res) => setItems(res.data))
      .catch(() => setNotice('Failed to load poll vote data.'))
      .finally(() => setLoading(false));
  }, []);

  const totalVotes = items.reduce((sum, item) => sum + item.totalVotes, 0);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Public Poll Analytics</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Poll Votes Overview</h2>
          <p className="mt-1 text-sm text-slate-600">View total votes across all polls and open detailed poll-level vote records.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Polls</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{items.length}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Votes</p>
            <p className="mt-2 text-3xl font-bold text-sky-800">{totalVotes}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Published Polls</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{items.filter((item) => item.status === 'PUBLISHED').length}</p>
          </div>
        </div>

        {notice ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{notice}</div>
        ) : null}

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">Loading poll votes...</div>
          ) : items.length === 0 ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">No polls available yet.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">
                      {item.status} • Created {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Votes</p>
                    <p className="text-2xl font-bold text-sky-800">{item.totalVotes}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.optionBreakdown.map((option) => (
                    <div key={`${item.id}-${option.index}`} className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-2">
                        <span className="line-clamp-1">{option.label}</span>
                        <span className="font-semibold text-slate-800">{option.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/admin/poll-votes/${item.id}`}
                    className="inline-block rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100"
                  >
                    View Vote Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
