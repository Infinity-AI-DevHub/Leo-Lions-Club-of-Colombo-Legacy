'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';

type Overview = {
  totalComments: number;
  totalLikes: number;
  totalDislikes: number;
};

type CommentItem = {
  id: number;
  targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE';
  targetId: number;
  visitorToken: string;
  authorName: string;
  comment: string;
  createdAt: string;
};

const targetOptions: Array<{ label: string; value: '' | CommentItem['targetType'] }> = [
  { label: 'All Targets', value: '' },
  { label: 'Projects', value: 'PROJECT' },
  { label: 'Events', value: 'EVENT' },
  { label: 'Gallery', value: 'GALLERY_ALBUM' },
  { label: 'Magazines', value: 'MAGAZINE' },
];

function formatTarget(targetType: CommentItem['targetType']) {
  if (targetType === 'PROJECT') return 'Project';
  if (targetType === 'EVENT') return 'Event';
  if (targetType === 'GALLERY_ALBUM') return 'Gallery Album';
  return 'Magazine';
}

export default function AdminCommentsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetType, setTargetType] = useState<'' | CommentItem['targetType']>('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  const token = useMemo(() => localStorage.getItem('leo_admin_token') || '', []);

  useEffect(() => {
    async function loadOverview() {
      try {
        const result = await adminClient(token).get('/admin/interactions/overview');
        setOverview(result.data);
      } catch {
        setNotice('Failed to load interaction overview.');
      }
    }
    void loadOverview();
  }, [token]);

  useEffect(() => {
    async function loadComments() {
      setLoading(true);
      setNotice('');
      try {
        const params = new URLSearchParams();
        if (targetType) params.set('targetType', targetType);
        if (search.trim()) params.set('search', search.trim());
        const suffix = params.toString() ? `?${params.toString()}` : '';
        const result = await adminClient(token).get(`/admin/interactions/comments${suffix}`);
        setComments(result.data);
      } catch {
        setNotice('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    }
    const debounce = setTimeout(() => {
      void loadComments();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, targetType, token]);

  async function handleDelete(id: number) {
    const ok = window.confirm('Delete this comment permanently?');
    if (!ok) return;
    setBusyId(id);
    setNotice('');
    try {
      await adminClient(token).delete(`/admin/interactions/comments/${id}`);
      setComments((prev) => prev.filter((item) => item.id !== id));
      setOverview((prev) => (prev ? { ...prev, totalComments: Math.max(0, prev.totalComments - 1) } : prev));
      setNotice('Comment deleted.');
    } catch {
      setNotice('Failed to delete comment.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Public Interactions</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Comments Moderation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review and manage anonymous comments across projects, events, gallery, and magazines.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Comments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{overview?.totalComments ?? 0}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Likes</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{overview?.totalLikes ?? 0}</p>
          </div>
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Dislikes</p>
            <p className="mt-2 text-3xl font-bold text-rose-700">{overview?.totalDislikes ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 glass-panel rounded-2xl p-4">
          <div className="grid gap-3 md:grid-cols-[240px_1fr]">
            <select
              value={targetType}
              onChange={(event) => setTargetType(event.target.value as '' | CommentItem['targetType'])}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              {targetOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by author or comment..."
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>
          {notice ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              {notice}
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">No comments found.</div>
          ) : (
            comments.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.authorName || 'Guest'} • {formatTarget(item.targetType)} #{item.targetId}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{item.comment}</p>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={busyId === item.id}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {busyId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
