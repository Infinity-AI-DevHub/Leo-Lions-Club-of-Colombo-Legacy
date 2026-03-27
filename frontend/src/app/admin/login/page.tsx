'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(event.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    const data = await res.json();
    localStorage.setItem('leo_admin_token', data.accessToken);
    localStorage.setItem('leo_admin_user', JSON.stringify(data.user));
    setLoading(false);
    router.push('/admin');
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-sky-700 px-4">
      <div className="absolute -left-10 top-16 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -right-14 bottom-14 h-60 w-60 rounded-full bg-blue-300/30 blur-3xl" />
      <form
        onSubmit={onSubmit}
        className="glass-panel relative z-10 w-full max-w-md space-y-4 rounded-3xl p-8 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Colombo Legacy CMS</p>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600">Sign in to manage website content with simple forms.</p>
        {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-xl border border-slate-300 bg-white/75 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-xl border border-slate-300 bg-white/75 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="button-pop w-full rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
