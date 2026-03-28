import type { Metadata } from 'next';
import Link from 'next/link';
import { CountUp } from '@/components/motion/count-up';
import { PublicShell } from '@/components/public-shell';
import { JoinMotivationInline } from '@/components/join-motivation-widget';
import { RichTextContent } from '@/components/rich-text-content';
import { Card, Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';
import { CalendarDays, Compass, Goal, Images, Lightbulb, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Discover Leo Lions Club of Colombo Legacy: youth leadership, social impact projects, events, galleries, and opportunities to join.',
  alternates: { canonical: 'https://colombolegacy.org/' },
  openGraph: {
    title: 'Leo Lions Club of Colombo Legacy',
    description:
      'Youth-led leadership and service movement creating sustainable community impact in Colombo.',
    url: 'https://colombolegacy.org/',
    images: ['/logo.png'],
  },
};

function resolveEventImage(value: unknown) {
  if (typeof value === 'string') return toAssetUrl(value);
  if (value && typeof value === 'object') return toAssetUrl(String((value as { imageUrl?: string }).imageUrl || ''));
  return '';
}

export default async function HomePage() {
  const content = await getPublicContent();
  const { siteSettings, homepage, about, leadership, projects, events, galleryAlbums, notices } = content;
  const featuredProjects = projects.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const leaders = leadership.slice(0, 3);
  const galleryPreview = galleryAlbums.flatMap((album) => album.images).slice(0, 6);
  const publishedNotices = notices.filter((item) => item.status === 'PUBLISHED').slice(0, 3);
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.organizationName,
    url: 'https://colombolegacy.org',
    logo: 'https://colombolegacy.org/logo.png',
    sameAs: content.socialLinks.map((item) => item.url).filter(Boolean),
  };
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.organizationName,
    url: 'https://colombolegacy.org',
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <section
        className="hero-glow relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white"
        style={{
          backgroundImage: homepage.heroBackgroundImage
            ? `linear-gradient(rgba(5, 23, 41, 0.75), rgba(12, 74, 110, 0.82)), url(${toAssetUrl(homepage.heroBackgroundImage)})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-ambient-layer" aria-hidden>
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-orb hero-orb-three" />
          <div className="hero-shimmer" />
          <div className="hero-grid" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="hero-content relative z-10">
            <p className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100">
              {siteSettings.theme}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{homepage.heroTitle}</h1>
            <p className="mt-5 max-w-3xl text-lg text-sky-100/95 md:text-xl">{homepage.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={homepage.ctaPrimaryLink || '/membership'}
                data-engagement-event="cta_click"
                data-engagement-label="hero_join_us"
                className="button-pop rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-900 hover:bg-sky-100"
              >
                {homepage.ctaPrimaryLabel || 'Join Us'}
              </Link>
              <Link
                href={homepage.ctaSecondaryLink || '/projects'}
                data-engagement-event="cta_click"
                data-engagement-label="hero_explore_impact"
                className="button-pop rounded-xl border border-sky-300 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {homepage.ctaSecondaryLabel || 'Explore Our Impact'}
              </Link>
              <Link
                href={homepage.ctaThirdLink || '/contact'}
                data-engagement-event="cta_click"
                data-engagement-label="hero_contact_us"
                className="button-pop rounded-xl border border-sky-300 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {homepage.ctaThirdLabel || 'Contact Us'}
              </Link>
            </div>
          </div>
          <div className="glass-panel relative z-10 rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-800">Leadership Focus</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Empowering Youth Through Service</h3>
            <p className="mt-3 text-sm text-slate-700">
              We combine leadership development, social innovation, and community service to create a lasting legacy.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(homepage.impactStats || []).slice(0, 4).map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="rounded-xl border border-sky-100 bg-white/65 p-3">
                  <p className="text-xl font-bold text-sky-800">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <JoinMotivationInline />
      </section>

      <Section title="Vision & Mission" subtitle="A purpose-driven movement shaping future-ready leaders and resilient communities.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-sky-900">
              <Compass size={18} />
              Vision
            </h3>
            <RichTextContent text={about.vision} className="mt-2 space-y-1" paragraphClassName="text-slate-600" />
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-sky-900">
              <Goal size={18} />
              Mission
            </h3>
            <RichTextContent text={about.mission} className="mt-2 space-y-1" paragraphClassName="text-slate-600" />
          </Card>
        </div>
      </Section>

      <Section title="Featured Projects" subtitle="High-impact initiatives that combine compassion, strategy, and measurable outcomes.">
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id}>
              <img
                src={toAssetUrl(project.coverImage) || '/default-project.png'}
                alt={`${project.title} thumbnail`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                <Lightbulb size={14} />
                {project.category}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
              <RichTextContent text={project.description} className="mt-2 space-y-1" paragraphClassName="text-sm text-slate-600" />
              <Link
                href="/projects"
                data-engagement-event="project_open"
                data-engagement-label={project.title}
                className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View Project →
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Upcoming Events" subtitle="Workshops, forums, and campaigns designed to engage and inspire.">
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <img
                src={resolveEventImage(event.posterUrl) || '/logo.png'}
                alt={`${event.title} thumbnail`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
                <CalendarDays size={14} className="text-sky-700" />
                {event.eventDateTime ? new Date(event.eventDateTime).toLocaleString() : 'TBA'}
              </p>
              <p className="text-sm text-slate-600">{event.venue}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-sky-700">{event.eventStatus}</p>
            </Card>
          ))}
        </div>
      </Section>

      {publishedNotices.length > 0 ? (
        <Section title="Public Notices" subtitle="Official updates and important announcements.">
          <div className="grid gap-4 md:grid-cols-3">
            {publishedNotices.map((notice) => (
              <Card key={notice.id}>
                <img
                  src={toAssetUrl(notice.thumbnailImage) || '/logo.png'}
                  alt={`${notice.title} thumbnail`}
                  className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
                />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {notice.noticeDate || 'Notice'}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{notice.title}</h3>
                <div className="mt-2 line-clamp-3">
                  <RichTextContent
                    text={notice.summary || notice.content || 'Public notice'}
                    className="space-y-1"
                    paragraphClassName="text-sm text-slate-600"
                  />
                </div>
                <Link href="/notices" className="mt-3 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
                  View Notice →
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-sky-800 to-cyan-700 p-8 text-white shadow-xl md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Empower You! Journey</p>
          <h2 className="mt-2 flex items-center gap-2 text-3xl font-bold md:text-4xl">
            <Sparkles size={28} />
            Ready to Lead, Serve, and Inspire?
          </h2>
          <p className="mt-3 max-w-2xl text-sky-50/90">
            Join Leo Lions Club of Colombo Legacy and be part of a youth movement creating lasting community transformation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/membership"
              data-engagement-event="membership_submit"
              data-engagement-label="join_banner_click"
              className="button-pop rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              {homepage.ctaPrimaryLabel || 'Join Us'}
            </Link>
            <Link
              href="/contact"
              data-engagement-event="cta_click"
              data-engagement-label="partner_with_us"
              className="button-pop rounded-xl border border-sky-200/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <Section title="Leadership Spotlight" subtitle="Meet the passionate individuals shaping our mission and momentum.">
        <div className="grid gap-4 md:grid-cols-3">
          {leaders.map((leader) => (
            <Card key={leader.id}>
              <img
                src={toAssetUrl(leader.photoUrl) || '/default-profile.webp'}
                alt={`${leader.fullName} profile`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Users size={16} className="text-sky-700" />
                {leader.fullName}
              </h3>
              <p className="text-sm text-sky-700">{leader.roleTitle}</p>
              <RichTextContent text={leader.shortBio} className="mt-2 space-y-1" paragraphClassName="text-sm text-slate-600" />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Impact Statistics">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {(homepage.impactStats || []).map((stat, index) => (
            <Card key={`${stat.label}-${index}`}>
              <p className="flex items-center gap-2 text-3xl font-bold text-sky-800">
                <ShieldCheck size={18} />
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Gallery Preview" subtitle="Snapshots from projects, events, and impact moments across the community.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {galleryPreview.map((image) => (
            <a
              key={image.id}
              href="/gallery"
              data-engagement-event="gallery_open"
              data-engagement-label={image.caption || `gallery_item_${image.id}`}
              className="card-hover block overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm"
            >
              <img
                src={toAssetUrl(image.imageUrl) || 'https://placehold.co/600x400'}
                alt={image.caption || 'Gallery image'}
                className="aspect-square w-full object-cover transition duration-500 hover:scale-110"
              />
              <div className="flex items-center gap-1 px-3 py-2 text-xs text-slate-500">
                <Images size={13} />
                Visual Story
              </div>
            </a>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
