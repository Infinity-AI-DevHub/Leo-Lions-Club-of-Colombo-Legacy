import { PublicShell } from '@/components/public-shell';
import { Section } from '@/components/ui';
import { getPublicContent } from '@/lib/public-api';
import { toAssetUrl } from '@/lib/assets';
import Link from 'next/link';

type LeadershipMember = {
  id: number;
  fullName: string;
  roleTitle: string;
  photoUrl?: string;
  shortBio: string;
  committeeType?: 'EXECUTIVE_COMMITTEE' | 'BOARD_MEMBER';
  socialLinks?: Array<{ label: string; url: string }>;
};

function resolveCommittee(member: LeadershipMember) {
  if (member.committeeType) return member.committeeType;
  if (/board/i.test(member.roleTitle || '')) return 'BOARD_MEMBER';
  return 'EXECUTIVE_COMMITTEE';
}

export default async function LeadershipPage() {
  const content = await getPublicContent();
  const { siteSettings, leadership } = content;
  const executiveCommittee = leadership.filter((member) => resolveCommittee(member) === 'EXECUTIVE_COMMITTEE');
  const boardMembers = leadership.filter((member) => resolveCommittee(member) === 'BOARD_MEMBER');

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="Leadership" subtitle="Meet the young leaders driving purpose, service, and impact.">
        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Executive Committee</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {executiveCommittee.map((member) => (
                <ProfileCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Board Members</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boardMembers.map((member) => (
                <ProfileCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}

function ProfileCard({ member }: { member: LeadershipMember }) {
  return (
    <article className="card-hover glass-panel flex h-full min-h-[520px] flex-col rounded-2xl p-5">
      <img
        src={toAssetUrl(member.photoUrl) || '/default-profile.webp'}
        alt={`${member.fullName} profile`}
        className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
      />
      <h4 className="mt-4 text-lg font-semibold text-slate-900">{member.fullName}</h4>
      <p className="text-sm font-medium text-sky-700">{member.roleTitle}</p>
      <p className="mt-2 max-h-20 overflow-hidden text-sm text-slate-600">{member.shortBio}</p>
      {member.socialLinks && member.socialLinks.length > 0 ? (
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {member.socialLinks.map((link, index) => (
            <Link
              key={`${member.id}-${index}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
