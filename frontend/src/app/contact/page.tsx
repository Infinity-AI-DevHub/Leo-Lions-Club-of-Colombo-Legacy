import { PublicShell } from '@/components/public-shell';
import { Card, Section } from '@/components/ui';
import { getPublicContent } from '@/lib/public-api';
import { ContactForm } from '@/components/contact-form';
import { Mail, MapPin, Phone, Clock3 } from 'lucide-react';

export default async function ContactPage() {
  const content = await getPublicContent();
  const { siteSettings, contact } = content;

  return (
    <PublicShell organizationName={siteSettings.organizationName} socialLinks={content.socialLinks} contact={content.contact} footerBuilderName={siteSettings.footerBuilderName} footerBuilderUrl={siteSettings.footerBuilderUrl}>
      <Section title="Contact Us" subtitle="Reach out for partnerships, volunteering, sponsorships, and media inquiries.">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Card>
              <h3 className="text-xl font-semibold text-slate-900">Let&apos;s Build Impact Together</h3>
              <p className="mt-2 text-slate-600">
                Our team responds to all inquiries as quickly as possible. Share your details and we&apos;ll get in touch.
              </p>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-sky-700" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <p className="text-slate-700">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-sky-700" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                    <p className="text-slate-700">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-sky-700" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
                    <p className="text-slate-700">{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 size={18} className="mt-0.5 text-sky-700" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
                    <p className="text-slate-700">Monday to Saturday, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            {contact.googleMapsEmbed ? (
              <Card>
                <h3 className="text-lg font-semibold text-slate-900">Find Us</h3>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  <iframe
                    src={contact.googleMapsEmbed}
                    className="h-[280px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Card>
            ) : null}
          </div>

          <div>
            <Card>
              <h3 className="text-lg font-semibold text-sky-900">Send a Message</h3>
              <p className="mt-1 text-sm text-slate-600">
                Fill in your details and we&apos;ll direct your inquiry to the right team member.
              </p>
              <ContactForm />
            </Card>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
