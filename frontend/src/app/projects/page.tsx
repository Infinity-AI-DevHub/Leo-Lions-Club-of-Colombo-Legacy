import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicShell } from '@/components/public-shell';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { RichTextContent } from '@/components/rich-text-content';
import { Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';
import { SITE_NAME, SITE_URL, absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Projects',
  description:
    'Explore community service projects and measurable social impact initiatives by Leo Lions Club of Colombo Legacy.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const content = await getPublicContent();
  const { siteSettings, projects } = content;
  const projectsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects',
    url: `${SITE_URL}/projects`,
    about: SITE_NAME,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: project.title,
          description: project.description,
          image: absoluteUrl(toAssetUrl(project.coverImage) || '/default-project.png'),
          url: `${SITE_URL}/projects/${project.id}`,
        },
      })),
    },
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <Section title="Projects & Service" subtitle="Our service portfolio reflects innovation, compassion, and measurable impact.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="card-hover glass-panel rounded-2xl p-4">
              <Link
                href={`/projects/${project.id}`}
                data-engagement-event="project_open"
                data-engagement-label={project.title}
                className="block"
              >
                <img
                  src={toAssetUrl(project.coverImage) || '/default-project.png'}
                  alt={`${project.title} thumbnail`}
                  className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
                />
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{project.category}</p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug">{project.title}</h3>
                  <p className="text-sm text-slate-500">{project.date}</p>
                  <div className="mt-3 line-clamp-2">
                    <RichTextContent text={project.description} className="space-y-1" paragraphClassName="text-sm text-slate-700" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-sky-700">View Full Details →</p>
                </div>
              </Link>
              <div className="mt-3">
                <PublicInteractionPanel
                  targetType="PROJECT"
                  targetId={project.id}
                  compact
                  mode="counts"
                  shareUrl={`/projects/${project.id}`}
                  shareTitle={project.title}
                  shareImageUrl={toAssetUrl(project.coverImage) || '/default-project.png'}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
