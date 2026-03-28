'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { BookOpenText, ChartColumnIncreasing, LayoutDashboard, LogOut, Menu, MenuSquare, ShieldCheck, X, Inbox, MessageSquare, Vote } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cms', label: 'Website Content', icon: BookOpenText },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { href: '/admin/poll-votes', label: 'Poll Votes', icon: Vote },
  { href: '/admin/motivation', label: 'Join Motivation Analytics', icon: ChartColumnIncreasing },
  { href: '/admin/engagement', label: 'Engagement Analytics', icon: ChartColumnIncreasing },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageTitle =
    pathname === '/admin/cms'
      ? 'Website Content'
      : pathname === '/admin/leads'
        ? 'Leads Inbox'
      : pathname === '/admin/comments'
        ? 'Comments Moderation'
      : pathname === '/admin/poll-votes' || pathname.startsWith('/admin/poll-votes/')
        ? 'Poll Votes'
      : pathname === '/admin/motivation'
        ? 'Join Motivation Analytics'
      : pathname === '/admin/engagement'
        ? 'Engagement Analytics'
        : 'Dashboard Overview';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sky-100 bg-gradient-to-b from-slate-950 via-blue-950 to-sky-900 p-6 text-sky-50 lg:flex lg:flex-col">
        <div>
          <Image
            src="/logo.png"
            alt="Leo Lions Club of Colombo Legacy logo"
            width={52}
            height={52}
            className="h-[52px] w-[52px] rounded-full border border-sky-200/40 object-cover shadow-sm"
            priority
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">CMS Dashboard</p>
          <h1 className="mt-2 text-lg font-bold">Colombo Legacy Admin</h1>
          <p className="mt-1 text-xs text-sky-100/70">Premium content management workspace</p>
        </div>
        <nav className="mt-7 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  pathname === item.href
                    ? 'bg-white/20 text-white shadow'
                    : 'text-sky-100/85 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-sky-200/30 bg-white/8 p-3 text-xs text-sky-100/80">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span>Authenticated session</span>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-sky-200/40 bg-white/10 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:bg-white/20"
          onClick={() => {
            localStorage.removeItem('leo_admin_token');
            localStorage.removeItem('leo_admin_user');
            setMobileMenuOpen(false);
            router.replace('/admin/login');
          }}
        >
          <LogOut size={15} />
          Log Out
        </button>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-sky-100/70 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Admin Workspace</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">{pageTitle}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2 text-xs text-slate-600 md:flex">
                <Image
                  src="/logo.png"
                  alt="Leo Lions Club logo"
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full border border-sky-100 object-cover"
                />
                <MenuSquare size={14} className="text-sky-700" />
                <span>Leo Lions Club of Colombo Legacy</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="admin-mobile-menu"
              >
                {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                Menu
              </button>
            </div>
          </div>
          <div className="overflow-x-auto border-t border-sky-100/70 px-4 py-2 lg:hidden">
            <div className="flex min-w-max gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold',
                    pathname === item.href ? 'bg-sky-100 text-sky-800' : 'text-slate-600',
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
            </div>
          </div>
        </header>
        {mobileMenuOpen ? (
          <div
            id="admin-mobile-menu"
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-40 bg-slate-950/35" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed inset-y-0 left-0 z-50 w-[84vw] max-w-sm overflow-y-auto border-r border-sky-100 bg-gradient-to-b from-slate-950 via-blue-950 to-sky-900 p-5 text-sky-50 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">CMS Dashboard</p>
                  <h3 className="mt-1 text-base font-bold">Colombo Legacy Admin</h3>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-sky-200/40 bg-white/10 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="mt-5 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                        pathname === item.href
                          ? 'bg-white/20 text-white shadow'
                          : 'text-sky-100/85 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200/40 bg-white/10 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:bg-white/20"
                onClick={() => {
                  localStorage.removeItem('leo_admin_token');
                  localStorage.removeItem('leo_admin_user');
                  setMobileMenuOpen(false);
                  router.replace('/admin/login');
                }}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </aside>
          </div>
        ) : null}
        <main className="min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
