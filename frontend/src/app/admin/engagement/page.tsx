'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';
import { Card } from '@/components/ui';

type Overview = {
  totalSessions: number;
  averageEngagementScore: string;
  highestEngagementScore: number;
  totalCtaClicks: number;
  totalJoinFormSubmissions: number;
  totalContactSubmissions: number;
  mostVisitedPage: string;
  mostEngagingPage: string;
};

type SessionRow = {
  id: number;
  sessionToken: string;
  visitorId: number;
  visitorToken: string;
  totalScore: number;
  pagesVisitedCount: number;
  actionsCount: number;
  durationSeconds: number;
  deviceType: string;
  referrer: string;
  lastActivityAt: string;
};

type PageStat = {
  pagePath: string;
  totalViews: number;
  totalTimeSpent: number;
  totalScoreGenerated: number;
  totalCtaClicks: number;
  totalSubmissions: number;
};

type EventStat = {
  eventType: string;
  count: number;
};

type Funnel = {
  homepageVisit: number;
  projectEventOrGalleryView: number;
  ctaClick: number;
  conversionSubmit: number;
};

type SessionDetail = {
  session: SessionRow;
  scoreFromEvents: number;
  pageTimeline: string[];
  events: Array<{
    id: number;
    occurredAt: string;
    pagePath: string;
    eventType: string;
    eventLabel: string;
    pointsAwarded: number;
  }>;
};

export default function AdminEngagementPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [pages, setPages] = useState<PageStat[]>([]);
  const [events, setEvents] = useState<EventStat[]>([]);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('leo_admin_token') || '';
    const client = adminClient(token);
    Promise.all([
      client.get('/admin/engagement/overview'),
      client.get('/admin/engagement/sessions'),
      client.get('/admin/engagement/pages'),
      client.get('/admin/engagement/events'),
      client.get('/admin/engagement/funnel'),
    ])
      .then(([o, s, p, e, f]) => {
        setOverview(o.data);
        setSessions(s.data);
        setPages(p.data);
        setEvents(e.data);
        setFunnel(f.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get(`/admin/engagement/sessions/${selectedSessionId}`)
      .then((res) => setSelectedDetail(res.data));
  }, [selectedSessionId]);

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    const text = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.sessionToken.toLowerCase().includes(text) ||
        String(s.visitorId).includes(text) ||
        (s.deviceType || '').toLowerCase().includes(text),
    );
  }, [sessions, search]);

  const topSessions = useMemo(
    () => [...sessions].sort((a, b) => b.totalScore - a.totalScore).slice(0, 6),
    [sessions],
  );
  const topPages = useMemo(() => pages.slice(0, 8), [pages]);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Visitor Engagement</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Engagement Analytics</h2>
          <p className="mt-1 text-sm text-slate-600">Track visitor behavior, score quality interactions, and monitor conversion journeys.</p>
        </div>

        {loading ? (
          <div className="mt-6 glass-panel rounded-3xl p-6 text-sm text-slate-500">Loading engagement analytics...</div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Sessions" value={String(overview?.totalSessions || 0)} />
              <MetricCard label="Avg Score" value={String(overview?.averageEngagementScore || '0')} />
              <MetricCard label="Highest Score" value={String(overview?.highestEngagementScore || 0)} />
              <MetricCard label="Total CTA Clicks" value={String(overview?.totalCtaClicks || 0)} />
              <MetricCard label="Join Submissions" value={String(overview?.totalJoinFormSubmissions || 0)} />
              <MetricCard label="Contact Submissions" value={String(overview?.totalContactSubmissions || 0)} />
              <MetricCard label="Most Visited Page" value={overview?.mostVisitedPage || '-'} />
              <MetricCard label="Most Engaging Page" value={overview?.mostEngagingPage || '-'} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Conversion Funnel</h3>
                <div className="mt-4 space-y-3">
                  <FunnelRow
                    label="Homepage Visits"
                    value={funnel?.homepageVisit || 0}
                    max={funnel?.homepageVisit || 1}
                  />
                  <FunnelRow
                    label="Project/Event/Gallery Views"
                    value={funnel?.projectEventOrGalleryView || 0}
                    max={funnel?.homepageVisit || 1}
                  />
                  <FunnelRow
                    label="CTA Clicks"
                    value={funnel?.ctaClick || 0}
                    max={funnel?.homepageVisit || 1}
                  />
                  <FunnelRow
                    label="Conversion Submissions"
                    value={funnel?.conversionSubmit || 0}
                    max={funnel?.homepageVisit || 1}
                  />
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Event Breakdown</h3>
                <div className="mt-4 space-y-2">
                  {events.map((event) => (
                    <div key={event.eventType} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/75 px-3 py-2">
                      <span className="text-sm font-medium text-slate-700">{event.eventType}</span>
                      <span className="text-sm font-semibold text-sky-800">{event.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Top Engaged Sessions</h3>
                <div className="mt-4 space-y-2">
                  {topSessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/75 px-3 py-2 text-left transition hover:border-sky-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{session.sessionToken.slice(0, 18)}...</p>
                        <p className="text-xs text-slate-500">Visitor {session.visitorId} · {session.deviceType || 'unknown'}</p>
                      </div>
                      <p className="text-base font-bold text-sky-800">{session.totalScore}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Most Engaging Pages</h3>
                <div className="mt-4 space-y-3">
                  {topPages.map((page) => (
                    <div key={page.pagePath} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{page.pagePath}</span>
                        <span className="font-semibold text-sky-800">{page.totalScoreGenerated} pts</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700"
                          style={{
                            width: `${Math.min(
                              100,
                              (page.totalScoreGenerated /
                                Math.max(1, topPages[0]?.totalScoreGenerated || 1)) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 glass-panel rounded-3xl p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Visitor Sessions</h3>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by session token, visitor id, device..."
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:max-w-sm"
                />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-2 py-2 font-semibold">Session ID</th>
                      <th className="px-2 py-2 font-semibold">Visitor</th>
                      <th className="px-2 py-2 font-semibold">Score</th>
                      <th className="px-2 py-2 font-semibold">Pages</th>
                      <th className="px-2 py-2 font-semibold">Actions</th>
                      <th className="px-2 py-2 font-semibold">Duration</th>
                      <th className="px-2 py-2 font-semibold">Device</th>
                      <th className="px-2 py-2 font-semibold">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="cursor-pointer border-b border-slate-100 hover:bg-sky-50/50"
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <td className="px-2 py-2 font-medium text-slate-700">{session.sessionToken.slice(0, 14)}...</td>
                        <td className="px-2 py-2 text-slate-600">
                          <div>{session.visitorId}</div>
                          <div className="text-xs text-slate-400">{session.visitorToken.slice(0, 10)}...</div>
                        </td>
                        <td className="px-2 py-2 font-semibold text-sky-800">{session.totalScore}</td>
                        <td className="px-2 py-2 text-slate-600">{session.pagesVisitedCount}</td>
                        <td className="px-2 py-2 text-slate-600">{session.actionsCount}</td>
                        <td className="px-2 py-2 text-slate-600">{formatDuration(session.durationSeconds)}</td>
                        <td className="px-2 py-2 text-slate-600">{session.deviceType || '-'}</td>
                        <td className="px-2 py-2 text-slate-600">{session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedSessionId && selectedDetail ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Session Timeline</p>
                  <h4 className="mt-1 text-xl font-semibold text-slate-900">{selectedDetail.session.sessionToken}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Score: {selectedDetail.session.totalScore} · Duration: {formatDuration(selectedDetail.session.durationSeconds)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSessionId(null);
                    setSelectedDetail(null);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {selectedDetail.events.map((event) => (
                  <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        {event.eventType} {event.eventLabel ? `· ${event.eventLabel}` : ''}
                      </p>
                      <p className="text-sm font-semibold text-sky-800">+{event.pointsAwarded}</p>
                    </div>
                    <p className="text-xs text-slate-500">{event.pagePath || '/'} · {new Date(event.occurredAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </AdminShell>
    </AdminGuard>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-2xl font-bold text-sky-800">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </Card>
  );
}

function FunnelRow({ label, value, max }: { label: string; value: number; max: number }) {
  const width = Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-sky-800">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const s = Math.max(0, Number(seconds || 0));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}
