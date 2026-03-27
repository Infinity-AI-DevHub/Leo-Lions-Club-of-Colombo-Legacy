import Link from 'next/link';
import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicShell } from '@/components/public-shell';
import { Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';

function resolveEventImage(value: unknown) {
  if (typeof value === 'string') return toAssetUrl(value);
  if (value && typeof value === 'object') return toAssetUrl(String((value as { imageUrl?: string }).imageUrl || ''));
  return '';
}

export default async function EventsPage() {
  const content = await getPublicContent();
  const { siteSettings, events } = content;

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="Events" subtitle="Leadership workshops, service campaigns, and collaborative forums.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="card-hover glass-panel overflow-hidden rounded-2xl p-3">
              <Link
                href={`/events/${event.id}`}
                data-engagement-event="event_open"
                data-engagement-label={event.title}
                className="relative block aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={resolveEventImage(event.posterUrl) || '/logo.png'}
                  alt={`${event.title} thumbnail`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent p-4 text-white">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-sky-100">
                    {event.eventDateTime ? new Date(event.eventDateTime).toLocaleString() : 'Date & time TBA'}
                  </p>
                  <p className="text-xs text-sky-100/90">{event.venue}</p>
                  <p className="mt-2 text-xs font-semibold text-white">View Full Event Details →</p>
                </div>
              </Link>
              <div className="mt-2">
                <PublicInteractionPanel
                  targetType="EVENT"
                  targetId={event.id}
                  compact
                  mode="counts"
                  shareUrl={`/events/${event.id}`}
                  shareTitle={event.title}
                  shareImageUrl={resolveEventImage(event.posterUrl) || '/logo.png'}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PublicShell>
  );
}
