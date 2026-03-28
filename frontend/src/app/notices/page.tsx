import type { Metadata } from 'next';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { RichTextContent } from '@/components/rich-text-content';
import { PublicShell } from '@/components/public-shell';
import { Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';
import { SITE_NAME, SITE_URL, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Public Notices',
  description:
    'Stay informed with official notices and announcements from Leo Lions Club of Colombo Legacy.',
  path: '/notices',
});

export default async function NoticesPage() {
  const content = await getPublicContent();
  const { siteSettings, notices } = content;
  const publishedNotices = notices.filter((item) => item.status === 'PUBLISHED');
  const noticesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Public Notices',
    url: `${SITE_URL}/notices`,
    about: SITE_NAME,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: publishedNotices.length,
      itemListElement: publishedNotices.map((notice, index) => ({
        '@type': 'Article',
        position: index + 1,
        headline: notice.title,
        datePublished: notice.noticeDate || undefined,
      })),
    },
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(noticesSchema) }}
      />
      <Section title="Public Notices" subtitle="Stay updated and share important club announcements.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publishedNotices.map((notice) => (
            <article key={notice.id} id={`notice-${notice.id}`} className="card-hover glass-panel rounded-2xl p-4">
              <img
                src={toAssetUrl(notice.thumbnailImage) || '/logo.png'}
                alt={`${notice.title} thumbnail`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                {notice.noticeDate || 'Notice'}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{notice.title}</h3>
              <div className="mt-2 line-clamp-3">
                <RichTextContent
                  text={notice.summary || notice.content || 'Public notice'}
                  className="space-y-1"
                  paragraphClassName="text-sm text-slate-700"
                />
              </div>
              {notice.externalLink ? (
                <a
                  href={notice.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  Read More →
                </a>
              ) : null}
              <div className="mt-3">
                <PublicInteractionPanel
                  targetType="NOTICE"
                  targetId={notice.id}
                  compact
                  mode="reactions"
                  shareUrl={`/notices#notice-${notice.id}`}
                  shareTitle={notice.title}
                  shareImageUrl={toAssetUrl(notice.thumbnailImage) || '/logo.png'}
                />
              </div>
            </article>
          ))}
        </div>
        {publishedNotices.length === 0 ? <p className="text-sm text-slate-500">No notices published yet.</p> : null}
      </Section>
    </PublicShell>
  );
}
