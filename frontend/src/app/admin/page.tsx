'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';
import { Card } from '@/components/ui';
import { CountUp } from '@/components/motion/count-up';
import Link from 'next/link';

type Overview = {
  projects: number;
  events: number;
  blogPosts: number;
  galleryItems: number;
  leadership: number;
};

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get('/admin/overview')
      .then((res) => setOverview(res.data))
      .catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">CMS Overview</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-slate-600">Monitor content volume and quickly update sections from the CMS.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/cms" className="rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white">
              Open Content Manager
            </Link>
            <Link href="/" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              View Public Website
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {overview ? (
            <>
              <StatCard label="Projects" value={overview.projects} />
              <StatCard label="Events" value={overview.events} />
              <StatCard label="Magazines" value={overview.blogPosts} />
              <StatCard label="Gallery Items" value={overview.galleryItems} />
              <StatCard label="Leadership" value={overview.leadership} />
            </>
          ) : (
            <div className="glass-panel col-span-full rounded-2xl p-6 text-sm text-slate-500">Loading dashboard metrics...</div>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-3xl font-bold text-sky-800">
        <CountUp value={String(value)} />
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
    </Card>
  );
}
