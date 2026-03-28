import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicShell } from '@/components/public-shell';
import { Card, Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

function resolveEventImage(value: unknown) {
  if (typeof value === 'string') return toAssetUrl(value);
  if (value && typeof value === 'object') return toAssetUrl(String((value as { imageUrl?: string }).imageUrl || ''));
  return '';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const content = await getPublicContent();
  const event = content.events.find((item) => String(item.id) === id);
  if (!event) {
    return {
      title: 'Event Not Found',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${event.title} | Event`,
    description: event.description || `Event by ${content.siteSettings.organizationName}`,
    alternates: { canonical: `https://colombolegacy.org/events/${event.id}` },
    openGraph: {
      title: event.title,
      description: event.description || '',
      url: `https://colombolegacy.org/events/${event.id}`,
      images: [absoluteUrl(resolveEventImage(event.posterUrl) || '/logo.png')],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | ${SITE_NAME}`,
      description: event.description || '',
      images: [absoluteUrl(resolveEventImage(event.posterUrl) || '/logo.png')],
    },
  };
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getPublicContent();
  const { siteSettings, events } = content;
  const event = events.find((item) => String(item.id) === id);

  if (!event) {
    notFound();
  }

  const galleryImages = (event.galleryImages || [])
    .map((image) => resolveEventImage(image))
    .filter(Boolean);
  const startDate = event.eventDateTime ? new Date(event.eventDateTime) : null;
  const endDate = event.endDateTime ? new Date(event.endDateTime) : null;
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.eventDateTime || undefined,
    endDate: event.endDateTime || undefined,
    eventStatus: event.eventStatus || undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue || 'Location TBA',
      address: event.venue || 'Location TBA',
    },
    image: [absoluteUrl(resolveEventImage(event.posterUrl) || '/logo.png')],
    description: event.detailedDescription || event.description,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || siteSettings.organizationName,
      url: SITE_URL,
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${SITE_URL}/events` },
      { '@type': 'ListItem', position: 3, name: event.title, item: `${SITE_URL}/events/${event.id}` },
    ],
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Section title={event.title} subtitle={event.description || 'Event details'}>
        <Link href="/events" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          ← Back to Events
        </Link>

        <div className="mt-4 mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
          <img
            src={resolveEventImage(event.posterUrl) || '/logo.png'}
            alt={`${event.title} banner`}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Date & Time</h3>
            <p className="mt-2 text-slate-700">
              {startDate ? startDate.toLocaleString() : 'Start date not provided'}
              {endDate ? ` - ${endDate.toLocaleString()}` : ''}
            </p>
            <p className="mt-2 text-sm text-slate-600">{event.eventStatus}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Location</h3>
            <p className="mt-2 text-slate-700">{event.venue || 'Location to be announced'}</p>
            {event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Register
              </a>
            ) : null}
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900">Full Event Description</h3>
            <p className="mt-2 whitespace-pre-line text-slate-700">{event.detailedDescription || event.description}</p>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {event.participantsInfo ? (
            <Card>
              <h3 className="text-base font-semibold text-slate-900">Participants</h3>
              <p className="mt-2 text-sm text-slate-700">{event.participantsInfo}</p>
            </Card>
          ) : null}
          {event.organizer ? (
            <Card>
              <h3 className="text-base font-semibold text-slate-900">Organizer</h3>
              <p className="mt-2 text-sm text-slate-700">{event.organizer}</p>
            </Card>
          ) : null}
          {event.contactInfo ? (
            <Card>
              <h3 className="text-base font-semibold text-slate-900">Contact</h3>
              <p className="mt-2 text-sm text-slate-700">{event.contactInfo}</p>
            </Card>
          ) : null}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-slate-900">Event Gallery</h3>
          {galleryImages.length > 0 ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white/80">
                  <img
                    src={image}
                    alt={`${event.title} image ${index + 1}`}
                    className="h-52 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No additional event images available yet.</p>
          )}
        </div>

        <div className="mt-8">
          <PublicInteractionPanel
            targetType="EVENT"
            targetId={event.id}
            shareUrl={`/events/${event.id}`}
            shareTitle={event.title}
            shareImageUrl={resolveEventImage(event.posterUrl) || '/logo.png'}
          />
        </div>
      </Section>
    </PublicShell>
  );
}
