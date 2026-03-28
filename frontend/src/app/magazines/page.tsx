import type { Metadata } from 'next';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicShell } from '@/components/public-shell';
import { Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';
import { SITE_NAME, SITE_URL, absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Magazines',
  description:
    'Read and download published magazines from Leo Lions Club of Colombo Legacy.',
  path: '/magazines',
});

export default async function MagazinesPage() {
  const content = await getPublicContent();
  const { siteSettings, blogPosts } = content;
  const magazines = blogPosts.filter((post) => post.status === 'PUBLISHED' && post.magazinePdfUrl);
  const magazinesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Magazines',
    url: `${SITE_URL}/magazines`,
    about: SITE_NAME,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: magazines.length,
      itemListElement: magazines.map((magazine, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: magazine.title,
          datePublished: magazine.publishDate || undefined,
          image: absoluteUrl(toAssetUrl(magazine.featuredImage) || '/logo.png'),
          url: `${SITE_URL}/magazines#mag-${magazine.id}`,
        },
      })),
    },
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(magazinesSchema) }}
      />
      <Section title="Magazines" subtitle="Browse and download club magazine issues.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {magazines.map((magazine) => (
            <div key={magazine.id} id={`mag-${magazine.id}`} className="card-hover glass-panel rounded-2xl p-4">
              <img
                src={toAssetUrl(magazine.featuredImage) || '/logo.png'}
                alt={`${magazine.title} thumbnail`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
                {magazine.publishDate || 'Issue'}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{magazine.title}</h3>
              <div className="mt-3">
                <PublicInteractionPanel
                  targetType="MAGAZINE"
                  targetId={magazine.id}
                  compact
                  mode="reactions"
                  shareUrl={`/magazines#mag-${magazine.id}`}
                  shareTitle={magazine.title}
                  shareImageUrl={toAssetUrl(magazine.featuredImage) || '/logo.png'}
                />
              </div>
              <a
                href={`/api/magazines/download?url=${encodeURIComponent(
                  toAssetUrl(magazine.magazinePdfUrl),
                )}&filename=${encodeURIComponent(`${magazine.title}.pdf`)}`}
                className="mt-3 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                Download Magazine PDF
              </a>
            </div>
          ))}
        </div>
        {magazines.length === 0 ? <p className="text-sm text-slate-500">No magazines published yet.</p> : null}
      </Section>
    </PublicShell>
  );
}
