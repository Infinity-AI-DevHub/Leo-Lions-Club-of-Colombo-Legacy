'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Mail, MapPin, Phone } from 'lucide-react';
import { JoinMotivationTracker } from './join-motivation-tracker';
import { JoinMotivationWidget } from './join-motivation-widget';

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

type NavGroup = {
  key: string;
  label: string;
  href?: string;
  items?: NavItem[];
};

const navGroups: NavGroup[] = [
  { key: 'home', label: 'Home', href: '/' },
  {
    key: 'about',
    label: 'About',
    items: [
      { href: '/about', label: 'About Us', description: 'Who we are and our mission' },
      { href: '/about', label: 'Vision & Mission', description: 'Purpose and direction' },
      { href: '/about', label: 'Our Legacy', description: 'Journey and milestones' },
    ],
  },
  {
    key: 'leadership',
    label: 'Leadership',
    items: [
      { href: '/leadership', label: 'Executive Committee', description: 'Core leadership team' },
      { href: '/leadership', label: 'Board Members', description: 'Strategic guidance and governance' },
    ],
  },
  {
    key: 'what-we-do',
    label: 'What We Do',
    items: [
      { href: '/projects', label: 'Projects', description: 'Flagship initiatives and campaigns' },
      { href: '/projects', label: 'Community Service', description: 'Service-driven outreach work' },
      { href: '/projects', label: 'Impact', description: 'Measurable social outcomes' },
    ],
  },
  {
    key: 'media',
    label: 'Media',
    items: [
      { href: '/events', label: 'Events', description: 'Upcoming and past programs' },
      { href: '/gallery', label: 'Gallery', description: 'Photos from projects and events' },
      { href: '/magazines', label: 'Magazines', description: 'Club magazine issues and archives' },
      { href: '/polls', label: 'Polls', description: 'Public polls and opinions' },
      { href: '/notices', label: 'Notices', description: 'Official public notices' },
    ],
  },
  {
    key: 'join-us',
    label: 'Join Us',
    items: [
      { href: '/membership', label: 'Membership', description: 'Become part of Colombo Legacy' },
      { href: '/membership', label: 'Volunteer Opportunities', description: 'Contribute through service' },
    ],
  },
];

function isPathActive(pathname: string, href?: string, items?: NavItem[]) {
  if (href && pathname === href) return true;
  if (!items) return false;
  return items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

export function PublicShell({
  children,
  organizationName,
  socialLinks,
  contact,
  footerBuilderName,
  footerBuilderUrl,
}: {
  children: ReactNode;
  organizationName: string;
  socialLinks: Array<{ id: number; platform: string; url: string }>;
  contact: { email: string; phone: string; address: string };
  footerBuilderName?: string;
  footerBuilderUrl?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string[]>([]);
  const resolvedCopyright = '© Leo Lions Club of Colombo Legacy.';
  const resolvedBuilderName = (footerBuilderName || '').trim() || 'Infinity AI (Pvt) Ltd';
  const resolvedBuilderUrl = (footerBuilderUrl || '').trim() || 'https://dev.iinfinityai.com';

  function toggleMobileSection(key: string) {
    setMobileExpanded((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  return (
    <div className="site-gradient-bg min-h-screen text-slate-800">
      <JoinMotivationTracker />
      <JoinMotivationWidget />
      <header className="sticky top-0 z-30 border-b border-sky-100/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="relative flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${organizationName} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-sky-100 object-cover shadow-sm"
              priority
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Empower You!</p>
              <p className="text-base font-bold text-slate-900 md:text-lg">{organizationName}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 xl:flex">
            {navGroups.map((group) => {
              const active = isPathActive(pathname, group.href, group.items);
              if (group.href) {
                return (
                  <Link
                    key={group.key}
                    href={group.href}
                    className={clsx(
                      'rounded-xl px-4 py-2 text-sm font-medium transition',
                      active
                        ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 shadow-sm'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900',
                    )}
                  >
                    {group.label}
                  </Link>
                );
              }

              return (
                <div key={group.key} className="group relative">
                  <button
                    type="button"
                    className={clsx(
                      'rounded-xl px-4 py-2 text-sm font-medium transition',
                      active
                        ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 shadow-sm'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900',
                    )}
                  >
                    {group.label}
                  </button>
                  <div className="invisible absolute left-0 top-full z-40 w-[290px] pt-2 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-sky-100/80 bg-white/96 p-2 shadow-[0_18px_36px_rgba(12,57,107,0.14)] backdrop-blur-md">
                      {group.items?.map((item) => (
                        <Link
                          key={`${group.key}-${item.label}`}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 transition hover:bg-sky-100"
                        >
                          <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 xl:hidden"
              onClick={() => {
                setOpen((prev) => !prev);
                setMobileExpanded([]);
              }}
            >
              Menu
            </button>
            <Link
              href="/contact"
              className={clsx(
                'hidden rounded-xl px-4 py-2 text-sm font-semibold transition lg:block',
                pathname === '/contact'
                  ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800'
                  : 'bg-white/75 text-slate-700 hover:bg-white',
              )}
            >
              Contact
            </Link>
            <Link href="/admin/login" className="button-pop rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white">
              Admin
            </Link>
          </div>
        </div>
        {open ? (
          <div className="border-t border-sky-100/70 bg-white/95 px-4 py-3 xl:hidden">
            <div className="space-y-2">
              {navGroups.map((group) => {
                const active = isPathActive(pathname, group.href, group.items);
                if (group.href) {
                  return (
                    <Link
                      key={group.key}
                      href={group.href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        'block rounded-xl px-4 py-3 text-sm font-semibold',
                        active ? 'bg-sky-100 text-sky-800' : 'bg-slate-50 text-slate-700',
                      )}
                    >
                      {group.label}
                    </Link>
                  );
                }
                const expanded = mobileExpanded.includes(group.key);
                return (
                  <div key={group.key} className="rounded-xl border border-slate-200 bg-white/80">
                    <button
                      type="button"
                      onClick={() => toggleMobileSection(group.key)}
                      className={clsx(
                        'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold',
                        active ? 'text-sky-800' : 'text-slate-700',
                      )}
                    >
                      <span>{group.label}</span>
                      <span className={clsx('text-xs transition', expanded ? 'rotate-180' : '')}>▼</span>
                    </button>
                    <div
                      className={clsx(
                        'grid overflow-hidden px-2 transition-all duration-200',
                        expanded ? 'grid-rows-[1fr] pb-2' : 'grid-rows-[0fr]',
                      )}
                    >
                      <div className="min-h-0 space-y-1">
                        {group.items?.map((item) => (
                          <Link
                            key={`${group.key}-${item.label}`}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={clsx(
                              'block rounded-lg px-3 py-2 text-sm',
                              pathname === item.href ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:bg-slate-50',
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={clsx(
                  'block rounded-xl px-4 py-3 text-sm font-semibold',
                  pathname === '/contact' ? 'bg-sky-100 text-sky-800' : 'bg-slate-50 text-slate-700',
                )}
              >
                Contact
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative">{children}</main>

      <footer className="mt-20 border-t border-sky-100/70 bg-gradient-to-br from-slate-950 via-sky-950 to-blue-950 text-sky-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Official Contact</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-sky-50/90">
              <Mail size={14} className="text-sky-200" />
              {contact.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-sky-50/90">
              <Phone size={14} className="text-sky-200" />
              {contact.phone}
            </p>
            <p className="flex items-center gap-2 text-sm text-sky-50/90">
              <MapPin size={14} className="text-sky-200" />
              {contact.address}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Explore</p>
            <div className="mt-3 space-y-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/projects', label: 'Projects' },
                { href: '/events', label: 'Events' },
                { href: '/membership', label: 'Membership' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-sky-50/80 transition hover:translate-x-0.5 hover:text-sky-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Connect</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-sky-300/30 bg-sky-900/35 px-3 py-1 text-sm text-sky-100 transition hover:border-sky-200/70 hover:bg-sky-800/55"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-sky-200/20 px-4 py-5 text-center text-xs text-sky-100/90 md:px-8">
          <p>
            {resolvedCopyright}{' '}Built by{' '}
            <a
              href={resolvedBuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-sky-100 underline decoration-sky-300/70 underline-offset-2 transition hover:text-white"
            >
              {resolvedBuilderName}
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
