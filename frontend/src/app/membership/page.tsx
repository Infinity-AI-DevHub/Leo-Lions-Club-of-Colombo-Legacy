import type { Metadata } from 'next';
import { PublicShell } from '@/components/public-shell';
import { JoinMotivationInline } from '@/components/join-motivation-widget';
import { Card, Section } from '@/components/ui';
import { getPublicContent } from '@/lib/public-api';
import { SITE_NAME, SITE_URL, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Membership',
  description:
    'Join Leo Lions Club of Colombo Legacy and discover membership benefits, eligibility, and application details.',
  path: '/membership',
});

export default async function MembershipPage() {
  const content = await getPublicContent();
  const { siteSettings, membership } = content;
  const membershipSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Membership / Join Us',
    url: `${SITE_URL}/membership`,
    about: SITE_NAME,
    description: membership.introText,
  };

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipSchema) }}
      />
      <Section title="Membership / Join Us" subtitle={membership.introText}>
        <div className="mb-6">
          <JoinMotivationInline compact />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-sky-900">Why Join</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {(membership.whyJoinPoints || []).map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-sky-900">Benefits</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {(membership.benefits || []).map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <h3 className="text-lg font-semibold text-sky-900">Eligibility</h3>
            <p className="mt-2 whitespace-pre-line text-slate-700">{membership.eligibility}</p>
            {membership.joinFormLink ? (
              <a
                href={membership.joinFormLink}
                target="_blank"
                rel="noreferrer"
                data-motivation-event="join_form_start"
                data-motivation-followup="join_form_submit"
                data-motivation-label="membership_page_submit_application"
                className="mt-4 inline-block rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Submit Application
              </a>
            ) : null}
          </Card>
        </div>
      </Section>
    </PublicShell>
  );
}
