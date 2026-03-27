import { PublicShell } from '@/components/public-shell';
import { Card, Section } from '@/components/ui';
import { getPublicContent } from '@/lib/public-api';
import { toAssetUrl } from '@/lib/assets';
import Image from 'next/image';

export default async function AboutPage() {
  const content = await getPublicContent();
  const { siteSettings, about } = content;

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="About Us" subtitle={about.introduction}>
        {toAssetUrl(about.bannerImage) ? (
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
            <img
              src={toAssetUrl(about.bannerImage)}
              alt="About banner"
              className="h-56 w-full object-cover md:h-72"
            />
          </div>
        ) : null}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt={`${siteSettings.organizationName} logo`}
            width={120}
            height={120}
            className="h-[120px] w-[120px] rounded-full border border-sky-200 bg-white object-cover shadow-sm"
            priority
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-sky-900">Vision</h3>
            <p className="mt-2 text-slate-600">{about.vision}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-sky-900">Mission</h3>
            <p className="mt-2 text-slate-600">{about.mission}</p>
          </Card>
        </div>
      </Section>

      <Section title="Core Values">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {(about.coreValues || []).map((value, index) => (
            <Card key={`${value}-${index}`}>
              <p className="font-semibold text-slate-800">{value}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="President's Message">
        <Card>
          <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
            <img
              src={toAssetUrl(about.presidentsImage) || '/logo.png'}
              alt="President"
              className="h-56 w-full rounded-xl border border-slate-200 object-cover md:h-[220px]"
            />
            <p className="text-slate-700">{about.presidentsMessage}</p>
          </div>
        </Card>
      </Section>
    </PublicShell>
  );
}
