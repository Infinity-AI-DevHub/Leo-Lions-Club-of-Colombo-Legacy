'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { Card } from '@/components/ui';
import { adminClient } from '@/lib/admin-api';

type Overview = {
  totalTrackedVisitorSessions: number;
  averageMotivationScore: string;
  highestMotivationScore: number;
  totalJoinCtaClicks: number;
  totalJoinPageVisits: number;
  totalJoinFormStarts: number;
  totalJoinFormSubmissions: number;
  conversionRateFromMotivatedVisitors: number;
};

type SessionRow = {
  id: number;
  sessionToken: string;
  visitorId: number;
  visitorToken: string;
  motivationScore: number;
  motivationLevel: string;
  pagesVisited: number;
  sessionDurationSeconds: number;
  joinCtaClicks: number;
  joinFormStarted: boolean;
  joinFormSubmitted: boolean;
  lastActivityAt: string;
  startedAt: string;
};

type SessionResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: SessionRow[];
};

type Funnel = {
  homepageVisit: number;
  intentPagesVisited: number;
  joinPageVisited: number;
  joinCtaClicked: number;
  joinFormStarted: number;
  joinFormSubmitted: number;
};

type PageStat = {
  id: number;
  pagePath: string;
  totalVisits: number;
  totalScoreGenerated: number;
  avgScoreGenerated: number;
  totalJoinCtaClicks: number;
  totalJoinFormStarts: number;
  totalJoinFormSubmissions: number;
  totalTimeSpent: number;
};

type DistributionRow = { level: string; count: number };

type SessionDetail = {
  visitorToken: string;
  sessionToken: string;
  totalScore: number;
  level: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  pageJourney: string[];
  joinCtaClicks: number;
  joinFormStarted: boolean;
  joinFormSubmitted: boolean;
  events: Array<{
    id: number;
    pagePath: string;
    eventType: string;
    eventLabel: string;
    pointsAwarded: number;
    motivationLevelAfter: string;
    occurredAt: string;
  }>;
};

export default function AdminMotivationPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [sessions, setSessions] = useState<SessionResponse | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [pages, setPages] = useState<PageStat[]>([]);
  const [distribution, setDistribution] = useState<DistributionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [minScore, setMinScore] = useState('0');
  const [maxScore, setMaxScore] = useState('1000');
  const [converted, setConverted] = useState('all');
  const [level, setLevel] = useState('all');

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SessionDetail | null>(null);

  const loadBase = useCallback(async () => {
    const token = localStorage.getItem('leo_admin_token') || '';
    const client = adminClient(token);
    const [o, f, p, d] = await Promise.all([
      client.get('/admin/motivation/overview'),
      client.get('/admin/motivation/funnel'),
      client.get('/admin/motivation/pages'),
      client.get('/admin/motivation/distribution'),
    ]);
    setOverview(o.data);
    setFunnel(f.data);
    setPages(p.data);
    setDistribution(d.data);
  }, []);

  const loadSessions = useCallback(async () => {
    const token = localStorage.getItem('leo_admin_token') || '';
    const client = adminClient(token);
    const params: Record<string, string> = {
      minScore,
      maxScore,
      page: '1',
      pageSize: '120',
      sortBy: 'score',
      sortDir: 'DESC',
    };
    if (converted !== 'all') params.converted = converted;
    if (level !== 'all') params.level = level;
    const query = new URLSearchParams(params);
    const res = await client.get(`/admin/motivation/sessions?${query.toString()}`);
    setSessions(res.data);
  }, [converted, level, maxScore, minScore]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([loadBase(), loadSessions()]).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBase, loadSessions]);

  useEffect(() => {
    if (!selectedSessionId) return;
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get(`/admin/motivation/sessions/${selectedSessionId}`)
      .then((res) => setSelectedDetail(res.data));
  }, [selectedSessionId]);

  const topSessions = useMemo(() => (sessions?.items || []).slice(0, 8), [sessions]);
  const topPages = useMemo(() => pages.slice(0, 10), [pages]);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Membership Intent Analytics</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Join Motivation Analytics</h2>
          <p className="mt-1 text-sm text-slate-600">Understand motivation growth, influence pages, and conversion paths toward membership.</p>
        </div>

        {loading ? (
          <div className="mt-6 glass-panel rounded-3xl p-6 text-sm text-slate-500">Loading motivation analytics...</div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Tracked Sessions" value={String(overview?.totalTrackedVisitorSessions || 0)} />
              <MetricCard label="Average Score" value={String(overview?.averageMotivationScore || 0)} />
              <MetricCard label="Highest Score" value={String(overview?.highestMotivationScore || 0)} />
              <MetricCard label="Join CTA Clicks" value={String(overview?.totalJoinCtaClicks || 0)} />
              <MetricCard label="Join Page Visits" value={String(overview?.totalJoinPageVisits || 0)} />
              <MetricCard label="Join Form Starts" value={String(overview?.totalJoinFormStarts || 0)} />
              <MetricCard label="Join Form Submissions" value={String(overview?.totalJoinFormSubmissions || 0)} />
              <MetricCard
                label="Motivated→Submit Rate"
                value={`${overview?.conversionRateFromMotivatedVisitors || 0}%`}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Motivation Funnel</h3>
                <div className="mt-4 space-y-3">
                  <FunnelRow label="Homepage Visit" value={funnel?.homepageVisit || 0} max={funnel?.homepageVisit || 1} />
                  <FunnelRow label="Intent Pages Visited" value={funnel?.intentPagesVisited || 0} max={funnel?.homepageVisit || 1} />
                  <FunnelRow label="Join Page Visited" value={funnel?.joinPageVisited || 0} max={funnel?.homepageVisit || 1} />
                  <FunnelRow label="Join CTA Clicked" value={funnel?.joinCtaClicked || 0} max={funnel?.homepageVisit || 1} />
                  <FunnelRow label="Join Form Started" value={funnel?.joinFormStarted || 0} max={funnel?.homepageVisit || 1} />
                  <FunnelRow label="Join Form Submitted" value={funnel?.joinFormSubmitted || 0} max={funnel?.homepageVisit || 1} />
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Motivation Level Distribution</h3>
                <div className="mt-4 space-y-2">
                  {distribution.map((row) => (
                    <div key={row.level} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{row.level}</span>
                        <span className="font-semibold text-sky-800">{row.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700"
                          style={{
                            width: `${Math.min(100, (row.count / Math.max(1, distribution[0]?.count || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Most Influential Pages</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="px-2 py-2">Page</th>
                        <th className="px-2 py-2">Visits</th>
                        <th className="px-2 py-2">Avg Score</th>
                        <th className="px-2 py-2">CTA</th>
                        <th className="px-2 py-2">Starts</th>
                        <th className="px-2 py-2">Submits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPages.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="px-2 py-2 text-slate-700">{row.pagePath}</td>
                          <td className="px-2 py-2">{row.totalVisits}</td>
                          <td className="px-2 py-2">{row.avgScoreGenerated}</td>
                          <td className="px-2 py-2">{row.totalJoinCtaClicks}</td>
                          <td className="px-2 py-2">{row.totalJoinFormStarts}</td>
                          <td className="px-2 py-2">{row.totalJoinFormSubmissions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-slate-900">Top Motivated Sessions</h3>
                <div className="mt-4 space-y-2">
                  {topSessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/75 px-3 py-2 text-left transition hover:border-sky-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{session.motivationLevel}</p>
                        <p className="text-xs text-slate-500">{session.sessionToken.slice(0, 18)}...</p>
                      </div>
                      <p className="text-lg font-bold text-sky-800">{session.motivationScore}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 glass-panel rounded-3xl p-6">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Min Score</label>
                  <input value={minScore} onChange={(e) => setMinScore(e.target.value)} className="mt-1 w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Max Score</label>
                  <input value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="mt-1 w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Converted</label>
                  <select value={converted} onChange={(e) => setConverted(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
                    <option value="all">All</option>
                    <option value="true">Submitted</option>
                    <option value="false">Not Submitted</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
                    <option value="all">All</option>
                    <option value="Curious Visitor">Curious Visitor</option>
                    <option value="Interested Explorer">Interested Explorer</option>
                    <option value="Inspired Supporter">Inspired Supporter</option>
                    <option value="Future Changemaker">Future Changemaker</option>
                    <option value="Future Leo">Future Leo</option>
                    <option value="Ready to Join">Ready to Join</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => void loadSessions()}
                  className="rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Apply Filters
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-2 py-2">Session</th>
                      <th className="px-2 py-2">Visitor</th>
                      <th className="px-2 py-2">Score</th>
                      <th className="px-2 py-2">Level</th>
                      <th className="px-2 py-2">Pages</th>
                      <th className="px-2 py-2">Duration</th>
                      <th className="px-2 py-2">Join CTA</th>
                      <th className="px-2 py-2">Join Start</th>
                      <th className="px-2 py-2">Join Submit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sessions?.items || []).map((row) => (
                      <tr key={row.id} className="cursor-pointer border-b border-slate-100 hover:bg-sky-50/50" onClick={() => setSelectedSessionId(row.id)}>
                        <td className="px-2 py-2 text-slate-700">{row.sessionToken.slice(0, 14)}...</td>
                        <td className="px-2 py-2 text-slate-600">{row.visitorToken.slice(0, 10)}...</td>
                        <td className="px-2 py-2 font-semibold text-sky-800">{row.motivationScore}</td>
                        <td className="px-2 py-2">{row.motivationLevel}</td>
                        <td className="px-2 py-2">{row.pagesVisited}</td>
                        <td className="px-2 py-2">{formatDuration(row.sessionDurationSeconds)}</td>
                        <td className="px-2 py-2">{row.joinCtaClicks}</td>
                        <td className="px-2 py-2">{row.joinFormStarted ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-2">{row.joinFormSubmitted ? 'Yes' : 'No'}</td>
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
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Session Detail View</p>
                  <h4 className="mt-1 text-xl font-semibold text-slate-900">{selectedDetail.sessionToken}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Score {selectedDetail.totalScore} · {selectedDetail.level} · {formatDuration(selectedDetail.durationSeconds)}
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

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p>Visitor Token: {selectedDetail.visitorToken}</p>
                <p className="mt-1">Journey: {selectedDetail.pageJourney.join(' → ') || '-'}</p>
              </div>

              <div className="mt-5 space-y-2">
                {selectedDetail.events.map((event) => (
                  <div key={event.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        {event.eventType} {event.eventLabel ? `· ${event.eventLabel}` : ''}
                      </p>
                      <p className="text-sm font-semibold text-sky-800">+{event.pointsAwarded}</p>
                    </div>
                    <p className="text-xs text-slate-500">{event.pagePath || '/'} · {new Date(event.occurredAt).toLocaleString()} · Level: {event.motivationLevelAfter}</p>
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
        <div className="h-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const s = Math.max(0, seconds || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
