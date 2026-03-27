import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicShell } from '@/components/public-shell';
import { Card, Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';

export default async function GalleryPage() {
  const content = await getPublicContent();
  const { siteSettings, galleryAlbums } = content;

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="Gallery" subtitle="Moments of service, leadership, and community transformation.">
        <div className="space-y-8">
          {galleryAlbums.map((album) => (
            <div key={album.id} id={`album-${album.id}`} className="glass-panel rounded-2xl p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-900">{album.title}</h3>
                <PublicInteractionPanel
                  targetType="GALLERY_ALBUM"
                  targetId={album.id}
                  compact
                  mode="counts"
                  shareUrl={`/gallery#album-${album.id}`}
                  shareTitle={album.title}
                  shareImageUrl={toAssetUrl(album.images[0]?.imageUrl) || '/logo.png'}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {album.images.map((image) => (
                  <div key={image.id} data-engagement-event="gallery_open" data-engagement-label={image.caption || `album_${album.id}_image_${image.id}`}>
                    <Card>
                      <img src={toAssetUrl(image.imageUrl) || 'https://placehold.co/600x400'} alt={image.caption || 'Gallery image'} className="h-44 w-full rounded-lg object-cover" />
                      <p className="mt-2 text-sm text-slate-600">{image.caption}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
