import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicShell } from '@/components/public-shell';
import { Card, Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getPublicContent();
  const { siteSettings, projects } = content;
  const project = projects.find((item) => String(item.id) === id);

  if (!project) {
    notFound();
  }

  const galleryImages = project.galleryImages || [];

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title={project.title} subtitle={`${project.category} • ${project.date || 'Date TBA'}`}>
        <Link href="/projects" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          ← Back to Projects
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
          <img
            src={toAssetUrl(project.coverImage) || '/default-project.png'}
            alt={`${project.title} cover`}
            className="h-72 w-full object-cover md:h-[420px]"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Project Overview</h3>
            <p className="mt-2 text-slate-700">{project.description}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Objectives</h3>
            <p className="mt-2 text-slate-700">{project.objectives || 'No objectives added yet.'}</p>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Outcomes / Impact</h3>
            <p className="mt-2 text-slate-700">{project.outcomes || 'No outcomes added yet.'}</p>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-slate-900">Project Gallery</h3>
          {galleryImages.length > 0 ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80">
                  <img
                    src={toAssetUrl(image)}
                    alt={`${project.title} image ${index + 1}`}
                    className="h-52 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No additional project images available yet.</p>
          )}
        </div>

        <div className="mt-8">
          <PublicInteractionPanel
            targetType="PROJECT"
            targetId={project.id}
            shareUrl={`/projects/${project.id}`}
            shareTitle={project.title}
            shareImageUrl={toAssetUrl(project.coverImage) || '/default-project.png'}
          />
        </div>
      </Section>
    </PublicShell>
  );
}
