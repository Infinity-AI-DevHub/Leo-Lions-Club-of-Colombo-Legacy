'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';

type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  function loadLeads() {
    const token = localStorage.getItem('leo_admin_token') || '';
    adminClient(token)
      .get('/admin/leads')
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function deleteLead(id: number) {
    const ok = window.confirm('Delete this lead? This action cannot be undone.');
    if (!ok) return;
    const token = localStorage.getItem('leo_admin_token') || '';
    setBusyId(id);
    setNotice('');
    try {
      await adminClient(token).delete(`/admin/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      setNotice('Lead deleted.');
    } catch {
      setNotice('Failed to delete lead.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Leads Inbox</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Contact Leads</h2>
          <p className="mt-1 text-sm text-slate-600">All inquiries submitted through the public contact form.</p>
        </div>

        <div className="mt-6 space-y-3">
          {notice ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">{notice}</div>
          ) : null}
          {loading ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="glass-panel rounded-2xl p-5 text-sm text-slate-500">No leads received yet.</div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="glass-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{lead.subject || 'General Inquiry'}</h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">{lead.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{lead.name}</span> • {lead.email}
                  {lead.phone ? ` • ${lead.phone}` : ''}
                </p>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{lead.message}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => deleteLead(lead.id)}
                    disabled={busyId === lead.id}
                    className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {busyId === lead.id ? 'Deleting...' : 'Delete'}
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
