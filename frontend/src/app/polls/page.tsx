import { PublicInteractionPanel } from '@/components/public-interaction-panel';
import { PublicPollVoting } from '@/components/public-poll-voting';
import { PublicShell } from '@/components/public-shell';
import { Section } from '@/components/ui';
import { toAssetUrl } from '@/lib/assets';
import { getPublicContent } from '@/lib/public-api';

export default async function PollsPage() {
  const content = await getPublicContent();
  const { siteSettings, polls } = content;
  const publishedPolls = polls.filter((item) => item.status === 'PUBLISHED' || item.status === 'CLOSED');

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="Public Polls" subtitle="Voice your opinion and share club polls with your network.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publishedPolls.map((poll) => (
            <article key={poll.id} id={`poll-${poll.id}`} className="card-hover glass-panel rounded-2xl p-4">
              <img
                src={toAssetUrl(poll.thumbnailImage) || '/logo.png'}
                alt={`${poll.title} thumbnail`}
                className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
              />
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{poll.title}</h3>
              {poll.status === 'CLOSED' ? (
                <span className="mt-2 inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  Poll Closed
                </span>
              ) : null}
              <p className="mt-2 text-sm text-slate-700">{poll.description || 'Participate in this community poll.'}</p>
              {poll.options && poll.options.length > 0 ? (
                <PublicPollVoting pollId={poll.id} options={poll.options} isClosed={poll.status === 'CLOSED'} />
              ) : null}
              {poll.externalLink ? (
                <a
                  href={poll.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  Open Poll →
                </a>
              ) : null}
              <div className="mt-3">
                <PublicInteractionPanel
                  targetType="POLL"
                  targetId={poll.id}
                  compact
                  mode="reactions"
                  shareUrl={`/polls#poll-${poll.id}`}
                  shareTitle={poll.title}
                  shareImageUrl={toAssetUrl(poll.thumbnailImage) || '/logo.png'}
                />
              </div>
            </article>
          ))}
        </div>
        {publishedPolls.length === 0 ? <p className="text-sm text-slate-500">No polls published yet.</p> : null}
      </Section>
    </PublicShell>
  );
}
