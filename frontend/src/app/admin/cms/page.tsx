'use client';

import { ComponentType, useCallback, useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { AdminShell } from '@/components/admin-shell';
import { adminClient } from '@/lib/admin-api';
import { API_BASE_URL } from '@/lib/config';
import { toAssetUrl } from '@/lib/assets';
import {
  BellRing,
  Blocks,
  Briefcase,
  Globe,
  Image as ImageIcon,
  Newspaper,
  PhoneCall,
  Settings2,
  ShieldCheck,
  Users,
  UsersRound,
} from 'lucide-react';

type Tab =
  | 'homepage'
  | 'about'
  | 'membership'
  | 'contact'
  | 'footer'
  | 'site-settings'
  | 'leadership'
  | 'projects'
  | 'events'
  | 'gallery'
  | 'polls'
  | 'notices'
  | 'blog'
  | 'social';

const tabs: Array<{ key: Tab; label: string; hint: string; icon: ComponentType<{ size?: number; className?: string }> }> = [
  { key: 'homepage', label: 'Homepage', hint: 'Hero and highlights', icon: Blocks },
  { key: 'about', label: 'About', hint: 'Vision and mission', icon: Globe },
  { key: 'leadership', label: 'Leadership', hint: 'Team profiles', icon: Users },
  { key: 'projects', label: 'Projects', hint: 'Community initiatives', icon: Briefcase },
  { key: 'events', label: 'Events', hint: 'Upcoming and past', icon: BellRing },
  { key: 'gallery', label: 'Gallery', hint: 'Albums and media', icon: ImageIcon },
  { key: 'polls', label: 'Polls', hint: 'Public polls', icon: Blocks },
  { key: 'notices', label: 'Notices', hint: 'Public notices', icon: BellRing },
  { key: 'membership', label: 'Membership', hint: 'Join information', icon: UsersRound },
  { key: 'blog', label: 'Magazines', hint: 'Magazine PDFs and covers', icon: Newspaper },
  { key: 'contact', label: 'Contact', hint: 'Address and recipient', icon: PhoneCall },
  { key: 'footer', label: 'Footer', hint: 'Footer builder details', icon: Settings2 },
  { key: 'social', label: 'Social Links', hint: 'Public channels', icon: ShieldCheck },
  { key: 'site-settings', label: 'Site Settings', hint: 'Brand and SEO defaults', icon: Settings2 },
];

type Notice = { text: string; type: 'success' | 'error' | 'info' };
type FieldType = 'text' | 'textarea' | 'select' | 'image' | 'images' | 'file';
type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  imageAspect?: '4:4';
  allowCropOption?: boolean;
};

function getToken() {
  return localStorage.getItem('leo_admin_token') || '';
}

function noticeClass(type: Notice['type']) {
  if (type === 'success') return 'bg-emerald-100 text-emerald-700';
  if (type === 'error') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-600';
}

function entityFolder(entity: string) {
  const map: Record<string, string> = {
    leadership: 'leadership',
    projects: 'projects',
    events: 'events',
    galleryAlbums: 'gallery',
    polls: 'polls',
    notices: 'notices',
    blogPosts: 'blog',
    socialLinks: 'site-settings',
  };
  return map[entity] || 'general';
}

async function uploadAsset(file: File, folder: string): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/upload/image?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  const data = await response.json();
  return data.url as string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function readImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Image decode failed'));
    };
    img.src = imageUrl;
  });
}

async function cropImageToSquare(file: File): Promise<File> {
  const img = await readImageFromFile(file);
  const size = Math.min(img.width, img.height);
  const sx = Math.floor((img.width - size) / 2);
  const sy = Math.floor((img.height - size) / 2);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');
  ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

  const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((output) => {
      if (!output) {
        reject(new Error('Image crop failed'));
        return;
      }
      resolve(output);
    }, mimeType, 0.92);
  });

  return new File([blob], file.name, { type: blob.type || mimeType, lastModified: Date.now() });
}

const CROP_PREVIEW_SIZE = 320;

type SquareCropTransform = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

function getCropBounds(width: number, height: number, zoom: number) {
  const baseScale = Math.max(CROP_PREVIEW_SIZE / width, CROP_PREVIEW_SIZE / height);
  const scaledWidth = width * baseScale * zoom;
  const scaledHeight = height * baseScale * zoom;
  return {
    baseScale,
    maxOffsetX: Math.max(0, (scaledWidth - CROP_PREVIEW_SIZE) / 2),
    maxOffsetY: Math.max(0, (scaledHeight - CROP_PREVIEW_SIZE) / 2),
  };
}

async function cropImageWithTransform(file: File, transform: SquareCropTransform): Promise<File> {
  const img = await readImageFromFile(file);
  const { baseScale, maxOffsetX, maxOffsetY } = getCropBounds(img.width, img.height, transform.zoom);
  const offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, transform.offsetX));
  const offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, transform.offsetY));
  const scaledWidth = img.width * baseScale * transform.zoom;
  const scaledHeight = img.height * baseScale * transform.zoom;
  const left = (CROP_PREVIEW_SIZE - scaledWidth) / 2 + offsetX;
  const top = (CROP_PREVIEW_SIZE - scaledHeight) / 2 + offsetY;
  const sourceSize = CROP_PREVIEW_SIZE / (baseScale * transform.zoom);
  const sx = Math.max(0, Math.min(img.width - sourceSize, -left / (baseScale * transform.zoom)));
  const sy = Math.max(0, Math.min(img.height - sourceSize, -top / (baseScale * transform.zoom)));

  const outputSize = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');
  ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, outputSize, outputSize);

  const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((output) => {
      if (!output) {
        reject(new Error('Image crop failed'));
        return;
      }
      resolve(output);
    }, mimeType, 0.92);
  });

  return new File([blob], file.name, { type: blob.type || mimeType, lastModified: Date.now() });
}

function parseStringArrayField(value: string): string[] | null {
  const raw = value.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => String(item || '').trim()).filter(Boolean);
  } catch {
    return null;
  }
}

function parseStringArrayForDisplay(value: string): string[] {
  const parsed = parseStringArrayField(value);
  if (parsed) return parsed;
  const single = value.trim();
  return single ? [single] : [];
}

function parseImageCollectionForDisplay(value: string): string[] {
  const raw = value.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') return String(item.imageUrl || '').trim();
        return '';
      })
      .filter(Boolean);
  } catch {
    return parseStringArrayForDisplay(value);
  }
}

export default function CmsPage() {
  const [tab, setTab] = useState<Tab>('homepage');
  const currentTab = tabs.find((entry) => entry.key === tab);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Content Management</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Website Content</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage all public content with simple forms. Changes appear on the live website immediately.
          </p>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass-panel rounded-3xl p-3 lg:sticky lg:top-24 lg:h-fit">
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sections</p>
            <div className="mt-2 space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-700 to-blue-700 text-white shadow'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-sky-700'} />
                    <div>
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className={`text-xs ${isActive ? 'text-sky-100/90' : 'text-slate-500'}`}>{t.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
          <div>
            <div className="mb-4 rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Editing Section</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{currentTab?.label}</p>
            </div>
            {tab === 'homepage' && <HomepageManager />}
            {tab === 'about' && <AboutManager />}
            {tab === 'membership' && <MembershipManager />}
            {tab === 'contact' && <ContactManager />}
            {tab === 'footer' && <FooterManager />}
            {tab === 'site-settings' && <SiteSettingsManager />}
            {tab === 'leadership' && <CrudManager entity="leadership" fields={leadershipFields} />}
            {tab === 'projects' && <CrudManager entity="projects" fields={projectFields} />}
            {tab === 'events' && <CrudManager entity="events" fields={eventFields} />}
            {tab === 'gallery' && <CrudManager entity="galleryAlbums" fields={galleryAlbumFields} />}
            {tab === 'polls' && <CrudManager entity="polls" fields={pollFields} />}
            {tab === 'notices' && <CrudManager entity="notices" fields={noticeFields} />}
            {tab === 'blog' && <CrudManager entity="blogPosts" fields={blogPostFields} />}
            {tab === 'social' && <CrudManager entity="socialLinks" fields={socialLinkFields} />}
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}

function AdminLoadingCard({ message }: { message: string }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-3 w-64 animate-pulse rounded bg-slate-200" />
      <p className="mt-4 text-sm text-slate-500">{message}</p>
    </div>
  );
}

/* ---------- Singleton content managers ---------- */

function useSingleton<T extends Record<string, unknown>>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [msg, setMsg] = useState<Notice>({
    text: '',
    type: 'info',
  });
  const load = useCallback(() => {
    adminClient(getToken())
      .get(`/admin/${endpoint}`)
      .then((r) => setData(r.data))
      .catch(() => setMsg({ text: 'Error loading content.', type: 'error' }));
  }, [endpoint]);
  useEffect(() => {
    load();
  }, [load]);
  function save(payload: Partial<T>) {
    setMsg({ text: 'Saving changes...', type: 'info' });
    adminClient(getToken())
      .patch(`/admin/${endpoint}`, payload)
      .then((r) => {
        setData(r.data);
        setMsg({ text: 'Saved successfully.', type: 'success' });
      })
      .catch(() => setMsg({ text: 'Error saving changes.', type: 'error' }));
  }
  return { data, save, msg };
}

function HomepageManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('homepage');
  if (!data) return <AdminLoadingCard message="Loading homepage content..." />;
  return (
    <SingletonForm
      uploadFolder="homepage"
      title="Homepage Content"
      fields={[
        { name: 'heroTitle', label: 'Hero Title', type: 'text' },
        { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
        { name: 'heroBackgroundImage', label: 'Hero Background Image', type: 'image' },
        { name: 'ctaPrimaryLabel', label: 'Primary CTA Label', type: 'text' },
        { name: 'ctaPrimaryLink', label: 'Primary CTA Link', type: 'text' },
        { name: 'ctaSecondaryLabel', label: 'Secondary CTA Label', type: 'text' },
        { name: 'ctaSecondaryLink', label: 'Secondary CTA Link', type: 'text' },
        { name: 'ctaThirdLabel', label: 'Third CTA Label', type: 'text' },
        { name: 'ctaThirdLink', label: 'Third CTA Link', type: 'text' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

function AboutManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('about');
  if (!data) return <AdminLoadingCard message="Loading about content..." />;
  return (
    <SingletonForm
      uploadFolder="about"
      title="About Page Content"
      fields={[
        { name: 'introduction', label: 'Introduction', type: 'textarea' },
        { name: 'vision', label: 'Vision', type: 'textarea' },
        { name: 'mission', label: 'Mission', type: 'textarea' },
        { name: 'presidentsMessage', label: "President's Message", type: 'textarea' },
        { name: 'presidentsImage', label: "President's Image", type: 'image' },
        { name: 'bannerImage', label: 'Banner Image', type: 'image' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

function MembershipManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('membership');
  if (!data) return <AdminLoadingCard message="Loading membership content..." />;
  return (
    <SingletonForm
      uploadFolder="membership"
      title="Membership Page"
      fields={[
        { name: 'introText', label: 'Intro Text', type: 'textarea' },
        { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
        { name: 'joinFormLink', label: 'Join Form Link', type: 'text' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

function ContactManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('contact-info');
  if (!data) return <AdminLoadingCard message="Loading contact information..." />;
  return (
    <SingletonForm
      uploadFolder="contact"
      title="Contact Information"
      fields={[
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'googleMapsEmbed', label: 'Google Maps Embed', type: 'textarea' },
        { name: 'contactFormRecipientEmail', label: 'Contact Form Recipient Email', type: 'text' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

function SiteSettingsManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('site-settings');
  if (!data) return <AdminLoadingCard message="Loading site settings..." />;
  return (
    <SingletonForm
      uploadFolder="site-settings"
      title="Site Settings"
      fields={[
        { name: 'organizationName', label: 'Organization Name', type: 'text' },
        { name: 'theme', label: 'Theme', type: 'text' },
        { name: 'primaryColor', label: 'Primary Color', type: 'text' },
        { name: 'secondaryColor', label: 'Secondary Color', type: 'text' },
        { name: 'logoUrl', label: 'Logo', type: 'image' },
        { name: 'faviconUrl', label: 'Favicon', type: 'image' },
        { name: 'defaultSeoTitle', label: 'Default SEO Title', type: 'text' },
        { name: 'defaultSeoDescription', label: 'Default SEO Description', type: 'textarea' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

function FooterManager() {
  const { data, save, msg } = useSingleton<Record<string, unknown>>('site-settings');
  if (!data) return <AdminLoadingCard message="Loading footer settings..." />;
  return (
    <SingletonForm
      uploadFolder="site-settings"
      title="Footer Settings"
      fields={[
        { name: 'footerBuilderName', label: 'Footer Builder Name', type: 'text' },
        { name: 'footerBuilderUrl', label: 'Footer Builder URL', type: 'text' },
      ]}
      data={data}
      onSave={save}
      message={msg}
    />
  );
}

/* ---------- Singleton Form ---------- */

function SingletonForm({
  uploadFolder,
  title,
  fields,
  data,
  onSave,
  message,
}: {
  uploadFolder: string;
  title: string;
  fields: FieldDef[];
  data: Record<string, unknown>;
  onSave: (payload: Record<string, unknown>) => void;
  message: Notice;
}) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [cropOptions, setCropOptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const f of fields) initial[f.name] = String(data[f.name] ?? '');
    setForm(initial);
  }, [data, fields]);

  async function onPickImage(
    fieldName: string,
    file?: File,
    shouldCrop = false
  ) {
    if (!file) return;
    setUploadError('');
    setUploadingField(fieldName);
    try {
      const fileToUpload = shouldCrop ? await cropImageToSquare(file) : file;
      const uploadedPath = await uploadAsset(fileToUpload, uploadFolder);
      setForm((prev) => ({ ...prev, [fieldName]: uploadedPath }));
    } catch {
      setUploadError(`Failed to upload image for ${fieldName}.`);
    } finally {
      setUploadingField('');
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700">{f.label}</label>
            {f.type === 'image' ? (
              <div className="mt-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(f.name, e.target.files?.[0], Boolean(cropOptions[f.name]))}
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(cropOptions[f.name])}
                    onChange={(e) =>
                      setCropOptions((prev) => ({
                        ...prev,
                        [f.name]: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Crop to square (4:4) before upload
                </label>
                <div className="flex items-center gap-2">
                  {uploadingField === f.name ? <span className="text-xs text-slate-500">Uploading...</span> : null}
                  {form[f.name] ? (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, [f.name]: '' }))}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>
                <input
                  value={form[f.name] || ''}
                  readOnly
                  placeholder="Uploaded image path will appear here"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                />
                <p className="text-xs text-slate-500">
                  Cropping is optional. Enable the checkbox to crop to square (4:4) before upload.
                </p>
              </div>
            ) : f.type === 'textarea' ? (
              <textarea
                value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            ) : (
              <input
                value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            )}
            {f.type === 'image' && form[f.name] ? (
              <img
                src={toAssetUrl(form[f.name])}
                alt="Preview"
                className="mt-2 h-24 w-40 rounded-lg border border-slate-200 object-cover"
              />
            ) : null}
          </div>
        ))}
      </div>
      {uploadError ? <p className="mt-3 text-sm text-red-700">{uploadError}</p> : null}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="button-pop rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-5 py-2 text-sm font-semibold text-white"
        >
          Save Changes
        </button>
        {message.text ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${noticeClass(message.type)}`}>
            {message.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Generic CRUD Manager ---------- */
type CrudField = FieldDef;

const leadershipFields: CrudField[] = [
  { name: 'fullName', label: 'Full Name', type: 'text' },
  {
    name: 'committeeType',
    label: 'Committee',
    type: 'select',
    options: ['EXECUTIVE_COMMITTEE', 'BOARD_MEMBER'],
  },
  { name: 'roleTitle', label: 'Role/Title', type: 'text' },
  { name: 'photoUrl', label: 'Photo', type: 'image', imageAspect: '4:4', allowCropOption: true },
  { name: 'shortBio', label: 'Short Bio', type: 'textarea' },
  { name: 'socialLinks', label: 'Social Links (JSON)', type: 'textarea' },
  { name: 'displayOrder', label: 'Display Order', type: 'text' },
  { name: 'isPublished', label: 'Published', type: 'select', options: ['true', 'false'] },
];

const projectFields: CrudField[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'date', label: 'Date (YYYY-MM-DD)', type: 'text' },
  { name: 'coverImage', label: 'Cover Image', type: 'image' },
  { name: 'galleryImages', label: 'Project Gallery Images', type: 'images' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'objectives', label: 'Objectives', type: 'textarea' },
  { name: 'outcomes', label: 'Outcomes / Impact', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
];

const eventFields: CrudField[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'eventDateTime', label: 'Start Date & Time (YYYY-MM-DDTHH:MM)', type: 'text' },
  { name: 'endDateTime', label: 'End Date & Time (YYYY-MM-DDTHH:MM)', type: 'text' },
  { name: 'venue', label: 'Location / Venue', type: 'text' },
  { name: 'description', label: 'Short Description (for cards)', type: 'textarea' },
  { name: 'detailedDescription', label: 'Full Event Details', type: 'textarea' },
  { name: 'participantsInfo', label: 'Participants', type: 'text' },
  { name: 'organizer', label: 'Organizer', type: 'text' },
  { name: 'contactInfo', label: 'Contact Info', type: 'text' },
  { name: 'posterUrl', label: 'Thumbnail Image', type: 'image' },
  { name: 'galleryImages', label: 'Other Event Images', type: 'images' },
  { name: 'registrationLink', label: 'Registration Link', type: 'text' },
  { name: 'eventStatus', label: 'Event Status', type: 'select', options: ['UPCOMING', 'PAST'] },
  { name: 'isFeatured', label: 'Featured', type: 'select', options: ['true', 'false'] },
  { name: 'publishStatus', label: 'Publish Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
];

const galleryAlbumFields: CrudField[] = [
  { name: 'title', label: 'Album Title', type: 'text' },
  { name: 'referenceType', label: 'Reference Type (event / project)', type: 'text' },
  { name: 'referenceId', label: 'Reference ID', type: 'text' },
  { name: 'images', label: 'Album Images', type: 'images' },
  { name: 'isPublished', label: 'Published', type: 'select', options: ['true', 'false'] },
];

const blogPostFields: CrudField[] = [
  { name: 'title', label: 'Magazine Title', type: 'text' },
  { name: 'publishDate', label: 'Publish Date (YYYY-MM-DD)', type: 'text' },
  { name: 'featuredImage', label: 'Thumbnail Image', type: 'image' },
  { name: 'magazinePdfUrl', label: 'Magazine PDF', type: 'file' },
  { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
];

const pollFields: CrudField[] = [
  { name: 'title', label: 'Poll Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'options', label: 'Options (JSON array)', type: 'textarea' },
  { name: 'thumbnailImage', label: 'Thumbnail Image', type: 'image' },
  { name: 'externalLink', label: 'Poll Link', type: 'text' },
  { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED', 'CLOSED'] },
];

const noticeFields: CrudField[] = [
  { name: 'title', label: 'Notice Title', type: 'text' },
  { name: 'summary', label: 'Summary', type: 'textarea' },
  { name: 'content', label: 'Full Content', type: 'textarea' },
  { name: 'noticeDate', label: 'Notice Date (YYYY-MM-DD)', type: 'text' },
  { name: 'thumbnailImage', label: 'Thumbnail Image', type: 'image' },
  { name: 'externalLink', label: 'External Link', type: 'text' },
  { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] },
];

const socialLinkFields: CrudField[] = [
  { name: 'platform', label: 'Platform', type: 'text' },
  { name: 'url', label: 'URL', type: 'text' },
  { name: 'displayOrder', label: 'Order', type: 'text' },
  { name: 'isVisible', label: 'Visible', type: 'select', options: ['true', 'false'] },
];

function CrudManager({ entity, fields }: { entity: string; fields: CrudField[] }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Record<string, unknown> | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [msg, setMsg] = useState<Notice>({
    text: '',
    type: 'info',
  });

  const load = useCallback(() => {
    adminClient(getToken())
      .get(`/admin/content?entity=${entity}`)
      .then((r) => setItems(r.data))
      .catch(() => setMsg({ text: 'Error loading entries.', type: 'error' }));
  }, [entity]);

  useEffect(() => {
    load();
  }, [load]);

  function submitForm(formData: Record<string, string>, id?: number) {
    const payload: Record<string, unknown> = { ...formData };
    // Cast boolean strings
    for (const f of fields) {
      if (f.type === 'select' && f.options?.includes('true') && (payload[f.name] === 'true' || payload[f.name] === 'false')) {
        payload[f.name] = payload[f.name] === 'true';
      }
    }

    if (entity === 'leadership') {
      if (typeof payload.displayOrder === 'string' && payload.displayOrder.trim() !== '') {
        payload.displayOrder = Number(payload.displayOrder);
      }
      if (typeof payload.socialLinks === 'string') {
        const raw = payload.socialLinks.trim();
        if (!raw) {
          payload.socialLinks = [];
        } else {
          try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
              setMsg({ text: 'Social links must be a JSON array.', type: 'error' });
              return;
            }
            const normalized = parsed
              .map((item) => ({
                label: String(item?.label || '').trim(),
                url: String(item?.url || '').trim(),
              }))
              .filter((item) => item.label && item.url);
            payload.socialLinks = normalized;
          } catch {
            setMsg({
              text: 'Invalid Social Links JSON. Example: [{"label":"Facebook","url":"https://facebook.com/..."}]',
              type: 'error',
            });
            return;
          }
        }
      }
    }
    if (entity === 'projects' && typeof payload.galleryImages === 'string') {
      const parsed = parseStringArrayField(payload.galleryImages);
      if (!parsed) {
        setMsg({ text: 'Project gallery images must be a JSON array of image paths.', type: 'error' });
        return;
      }
      payload.galleryImages = parsed;
    }
    if (entity === 'events' && typeof payload.galleryImages === 'string') {
      const parsed = parseStringArrayField(payload.galleryImages);
      if (!parsed) {
        setMsg({ text: 'Event gallery images must be a JSON array of image paths.', type: 'error' });
        return;
      }
      payload.galleryImages = parsed;
    }
    if (entity === 'polls' && typeof payload.options === 'string') {
      const parsed = parseStringArrayField(payload.options);
      if (!parsed) {
        setMsg({ text: 'Poll options must be a JSON array of strings.', type: 'error' });
        return;
      }
      payload.options = parsed;
    }
    if (entity === 'galleryAlbums' && typeof payload.images === 'string') {
      const parsed = parseStringArrayField(payload.images);
      if (!parsed) {
        setMsg({ text: 'Album images must be a JSON array of image paths.', type: 'error' });
        return;
      }
      payload.images = parsed;
    }
    if (entity === 'blogPosts') {
      const title = String(payload.title || '').trim();
      if (!title) {
        setMsg({ text: 'Magazine title is required.', type: 'error' });
        return;
      }
      if (!payload.magazinePdfUrl || !String(payload.magazinePdfUrl).trim()) {
        setMsg({ text: 'Please upload the magazine PDF.', type: 'error' });
        return;
      }
      if (!payload.publishDate || !String(payload.publishDate).trim()) {
        setMsg({ text: 'Publish date is required.', type: 'error' });
        return;
      }

      // Keep legacy DB fields populated while using blog_posts for magazines.
      payload.slug = String(payload.slug || `${slugify(title)}-${Date.now()}`);
      payload.author = String(payload.author || 'Leo Lions Club of Colombo Legacy');
      payload.content = String(payload.content || `<p>${title}</p>`);
      payload.seoTitle = String(payload.seoTitle || title);
      payload.seoDescription = String(payload.seoDescription || `Download ${title}`);
    }

    setMsg({ text: 'Saving entry...', type: 'info' });
    const client = adminClient(getToken());
    const promise = id
      ? client.patch(`/admin/content/${id}?entity=${entity}`, payload)
      : client.post(`/admin/content?entity=${entity}`, payload);

    promise
      .then(() => {
        setMsg({ text: 'Entry saved.', type: 'success' });
        setEditing(null);
        setCreating(false);
        load();
      })
      .catch(() => setMsg({ text: 'Error saving entry.', type: 'error' }));
  }

  function deleteItem(id: number) {
    adminClient(getToken())
      .delete(`/admin/content/${id}?entity=${entity}`)
      .then(() => {
        setMsg({ text: 'Entry deleted.', type: 'success' });
        load();
      })
      .catch(() => setMsg({ text: 'Error deleting entry.', type: 'error' }));
  }

  const filtered = items
    .filter((item) => {
      if (!search.trim()) return true;
      const text = JSON.stringify(item).toLowerCase();
      return text.includes(search.trim().toLowerCase());
    })
    .sort((a, b) => {
      const av = String(a.createdAt || a.id || '');
      const bv = String(b.createdAt || b.id || '');
      return sortBy === 'newest' ? bv.localeCompare(av) : av.localeCompare(bv);
    });

  if (creating || editing) {
    return (
      <CrudForm
        uploadFolder={entityFolder(entity)}
        fields={fields}
        initial={editing || {}}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(data) => submitForm(data, editing?.id as number | undefined)}
        message={msg}
      />
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize text-slate-900">{entity.replace(/([A-Z])/g, ' $1')}</h3>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="button-pop rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white"
        >
          + Add New
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries..."
          className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
          className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      {msg.text ? (
        <p
          className={`mt-3 text-sm ${
            msg.type === 'success' ? 'text-emerald-700' : msg.type === 'error' ? 'text-red-700' : 'text-slate-600'
          }`}
        >
          {msg.text}
        </p>
      ) : null}
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id as number} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/75 px-4 py-3">
              <div>
                <p className="font-semibold text-slate-800">
                  {(item.title || item.fullName || item.platform || `ID ${item.id}`) as string}
                </p>
                <p className="text-sm text-slate-500">
                  {(item.status || item.publishStatus || item.roleTitle || item.url || '') as string}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(item)}
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-900">Delete item?</h4>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. Are you sure you want to delete{' '}
              <strong>{String(pendingDelete.title || pendingDelete.fullName || pendingDelete.platform || `ID ${pendingDelete.id}`)}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteItem(pendingDelete.id as number);
                  setPendingDelete(null);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- CRUD Form ---------- */

function CrudForm({
  uploadFolder,
  fields,
  initial,
  onCancel,
  onSubmit,
  message,
}: {
  uploadFolder: string;
  fields: CrudField[];
  initial: Record<string, unknown>;
  onCancel: () => void;
  onSubmit: (data: Record<string, string>) => void;
  message: Notice;
}) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {};
    for (const f of fields) {
      const value = initial[f.name];
      if (f.name === 'images' && Array.isArray(value)) {
        const imageUrls = value
          .map((item) => {
            if (typeof item === 'string') return item.trim();
            if (item && typeof item === 'object') return String(item.imageUrl || '').trim();
            return '';
          })
          .filter(Boolean);
        state[f.name] = JSON.stringify(imageUrls, null, 2);
        continue;
      }
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        state[f.name] = JSON.stringify(value, null, 2);
      } else {
        state[f.name] = String(value ?? '');
      }
    }
    return state;
  });
  const [uploadingField, setUploadingField] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [cropOptions, setCropOptions] = useState<Record<string, boolean>>({});
  const [leaderCropModal, setLeaderCropModal] = useState<{
    fieldName: string;
    file: File;
    previewUrl: string;
    zoom: number;
    offsetX: number;
    offsetY: number;
    imageWidth: number;
    imageHeight: number;
  } | null>(null);

  function closeLeaderCropModal() {
    setLeaderCropModal((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }

  useEffect(() => {
    return () => {
      if (leaderCropModal?.previewUrl) URL.revokeObjectURL(leaderCropModal.previewUrl);
    };
  }, [leaderCropModal?.previewUrl]);

  const isLeadershipPhotoField = useCallback(
    (fieldName: string) => uploadFolder === 'leadership' && fieldName === 'photoUrl',
    [uploadFolder]
  );

  async function uploadPreparedImage(fieldName: string, file: File) {
    setUploadError('');
    setUploadingField(fieldName);
    try {
      const uploadedPath = await uploadAsset(file, uploadFolder);
      setForm((prev) => ({ ...prev, [fieldName]: uploadedPath }));
    } catch {
      setUploadError(`Failed to upload image for ${fieldName}.`);
    } finally {
      setUploadingField('');
    }
  }

  async function onPickImage(
    fieldName: string,
    file?: File,
    shouldCrop = false
  ) {
    if (!file) return;
    setUploadError('');
    setUploadingField(fieldName);
    try {
      const fileToUpload = shouldCrop ? await cropImageToSquare(file) : file;
      const uploadedPath = await uploadAsset(fileToUpload, uploadFolder);
      setForm((prev) => ({ ...prev, [fieldName]: uploadedPath }));
    } catch {
      setUploadError(`Failed to upload image for ${fieldName}.`);
    } finally {
      setUploadingField('');
    }
  }

  async function onPickImages(fieldName: string, files?: FileList | null, shouldCrop = false) {
    if (!files || files.length === 0) return;
    setUploadError('');
    setUploadingField(fieldName);
    try {
      const uploadedPaths: string[] = [];
      for (const file of Array.from(files)) {
        const fileToUpload = shouldCrop ? await cropImageToSquare(file) : file;
        const uploadedPath = await uploadAsset(fileToUpload, uploadFolder);
        uploadedPaths.push(uploadedPath);
      }
      setForm((prev) => {
        const existing = parseImageCollectionForDisplay(prev[fieldName] || '');
        const merged = [...existing, ...uploadedPaths];
        return { ...prev, [fieldName]: JSON.stringify(merged, null, 2) };
      });
    } catch {
      setUploadError(`Failed to upload images for ${fieldName}.`);
    } finally {
      setUploadingField('');
    }
  }

  async function onPickFile(fieldName: string, file?: File) {
    if (!file) return;
    setUploadError('');
    setUploadingField(fieldName);
    try {
      const uploadedPath = await uploadAsset(file, uploadFolder);
      setForm((prev) => ({ ...prev, [fieldName]: uploadedPath }));
    } catch {
      setUploadError(`Failed to upload file for ${fieldName}.`);
    } finally {
      setUploadingField('');
    }
  }

  async function onSelectImage(fieldName: string, file?: File, shouldCrop = false) {
    if (!file) return;
    if (isLeadershipPhotoField(fieldName)) {
      try {
        const img = await readImageFromFile(file);
        const previewUrl = URL.createObjectURL(file);
        setLeaderCropModal({
          fieldName,
          file,
          previewUrl,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
          imageWidth: img.width,
          imageHeight: img.height,
        });
      } catch {
        setUploadError('Failed to open crop tool for this image.');
      }
      return;
    }
    await onPickImage(fieldName, file, shouldCrop);
  }

  async function onUploadOriginalLeaderImage() {
    if (!leaderCropModal) return;
    const { fieldName, file } = leaderCropModal;
    closeLeaderCropModal();
    await uploadPreparedImage(fieldName, file);
  }

  async function onCropAndUploadLeaderImage() {
    if (!leaderCropModal) return;
    const { fieldName, file, zoom, offsetX, offsetY } = leaderCropModal;
    closeLeaderCropModal();
    try {
      const cropped = await cropImageWithTransform(file, { zoom, offsetX, offsetY });
      await uploadPreparedImage(fieldName, cropped);
    } catch {
      setUploadError(`Failed to crop and upload image for ${fieldName}.`);
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-slate-900">{initial.id ? 'Edit Entry' : 'Add Entry'}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700">{f.label}</label>
            {f.type === 'image' ? (
              <div className="mt-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onSelectImage(f.name, e.target.files?.[0], Boolean(cropOptions[f.name]))}
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {!isLeadershipPhotoField(f.name) ? (
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={Boolean(cropOptions[f.name])}
                      onChange={(e) =>
                        setCropOptions((prev) => ({
                          ...prev,
                          [f.name]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    Crop to square (4:4) before upload
                  </label>
                ) : null}
                <div className="flex items-center gap-2">
                  {uploadingField === f.name ? <span className="text-xs text-slate-500">Uploading...</span> : null}
                  {form[f.name] ? (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, [f.name]: '' }))}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600"
                    >
                      Remove Image
                    </button>
                  ) : null}
                </div>
                <input
                  value={form[f.name] || ''}
                  readOnly
                  placeholder="Uploaded image path will appear here"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                />
                <p className="text-xs text-slate-500">
                  {isLeadershipPhotoField(f.name)
                    ? 'Selecting a leadership image opens the crop tool before upload.'
                    : 'Cropping is optional. Enable the checkbox to crop to square (4:4) before upload.'}
                </p>
              </div>
            ) : f.type === 'images' ? (
              <div className="mt-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onPickImages(f.name, e.target.files, Boolean(cropOptions[f.name]))}
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(cropOptions[f.name])}
                    onChange={(e) =>
                      setCropOptions((prev) => ({
                        ...prev,
                        [f.name]: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Crop to square (4:4) before upload
                </label>
                {uploadingField === f.name ? <span className="text-xs text-slate-500">Uploading...</span> : null}
                <p className="text-xs text-slate-500">
                  {f.name === 'images'
                    ? 'Upload one or more images for this album.'
                    : 'Upload one or more images for the project gallery.'}{' '}
                  Cropping is optional.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {parseImageCollectionForDisplay(form[f.name] || '').map((imagePath, index) => (
                    <div key={`${imagePath}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2">
                      <img
                        src={toAssetUrl(imagePath)}
                        alt={`Project gallery ${index + 1}`}
                        className="h-20 w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => {
                            const existing = parseImageCollectionForDisplay(prev[f.name] || '');
                            const next = existing.filter((_, idx) => idx !== index);
                            return { ...prev, [f.name]: JSON.stringify(next, null, 2) };
                          })
                        }
                        className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <textarea
                  value={form[f.name] || ''}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2 text-xs outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            ) : f.type === 'file' ? (
              <div className="mt-1 space-y-2">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => onPickFile(f.name, e.target.files?.[0])}
                  className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                {uploadingField === f.name ? <span className="text-xs text-slate-500">Uploading...</span> : null}
                <input
                  value={form[f.name] || ''}
                  readOnly
                  placeholder="Uploaded file path will appear here"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                />
                {form[f.name] ? (
                  <a
                    href={toAssetUrl(form[f.name])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold text-sky-700 hover:text-sky-800"
                  >
                    Open Uploaded PDF
                  </a>
                ) : null}
              </div>
            ) : f.type === 'textarea' ? (
              <textarea
                value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                rows={f.name === 'socialLinks' ? 6 : 4}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            ) : f.type === 'select' ? (
              <select
                value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Select</option>
                {(f.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            )}
            {f.type === 'image' && form[f.name] ? (
              <img
                src={toAssetUrl(form[f.name])}
                alt="Preview"
                className="mt-2 h-24 w-40 rounded-lg border border-slate-200 object-cover"
              />
            ) : null}
            {f.name === 'socialLinks' ? (
              <p className="mt-1 text-xs text-slate-500">
                Use JSON format, e.g. <code>{'[{"label":"Facebook","url":"https://facebook.com/your-page"}]'}</code>
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {uploadError ? <p className="mt-3 text-sm text-red-700">{uploadError}</p> : null}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSubmit(form)}
          className="button-pop rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-5 py-2 text-sm font-semibold text-white"
        >
          {initial.id ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        {message.text ? (
          <span className="text-sm text-slate-600">{message.text}</span>
        ) : null}
      </div>
      {leaderCropModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h4 className="text-lg font-semibold text-slate-900">Crop Leadership Photo</h4>
            <p className="mt-1 text-sm text-slate-600">Adjust the image, then crop and upload or keep original.</p>
            <div className="mt-4 grid gap-5 md:grid-cols-[auto_1fr]">
              <div className="relative h-80 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={leaderCropModal.previewUrl}
                  alt="Leader crop preview"
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                  style={{
                    width: `${leaderCropModal.imageWidth}px`,
                    height: `${leaderCropModal.imageHeight}px`,
                    transform: `translate(-50%, -50%) translate(${leaderCropModal.offsetX}px, ${leaderCropModal.offsetY}px) scale(${leaderCropModal.zoom})`,
                    transformOrigin: 'center center',
                  }}
                />
                <div className="pointer-events-none absolute inset-0 border-2 border-sky-500/70" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={leaderCropModal.zoom}
                    onChange={(e) => {
                      const nextZoom = Number(e.target.value);
                      const bounds = getCropBounds(leaderCropModal.imageWidth, leaderCropModal.imageHeight, nextZoom);
                      setLeaderCropModal((prev) =>
                        prev
                          ? {
                              ...prev,
                              zoom: nextZoom,
                              offsetX: Math.max(-bounds.maxOffsetX, Math.min(bounds.maxOffsetX, prev.offsetX)),
                              offsetY: Math.max(-bounds.maxOffsetY, Math.min(bounds.maxOffsetY, prev.offsetY)),
                            }
                          : prev
                      );
                    }}
                    className="mt-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Horizontal Position</label>
                  <input
                    type="range"
                    min={-getCropBounds(leaderCropModal.imageWidth, leaderCropModal.imageHeight, leaderCropModal.zoom).maxOffsetX}
                    max={getCropBounds(leaderCropModal.imageWidth, leaderCropModal.imageHeight, leaderCropModal.zoom).maxOffsetX}
                    step={1}
                    value={leaderCropModal.offsetX}
                    onChange={(e) =>
                      setLeaderCropModal((prev) => (prev ? { ...prev, offsetX: Number(e.target.value) } : prev))
                    }
                    className="mt-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Vertical Position</label>
                  <input
                    type="range"
                    min={-getCropBounds(leaderCropModal.imageWidth, leaderCropModal.imageHeight, leaderCropModal.zoom).maxOffsetY}
                    max={getCropBounds(leaderCropModal.imageWidth, leaderCropModal.imageHeight, leaderCropModal.zoom).maxOffsetY}
                    step={1}
                    value={leaderCropModal.offsetY}
                    onChange={(e) =>
                      setLeaderCropModal((prev) => (prev ? { ...prev, offsetY: Number(e.target.value) } : prev))
                    }
                    className="mt-2 w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeLeaderCropModal}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onUploadOriginalLeaderImage}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Upload Original
                  </button>
                  <button
                    type="button"
                    onClick={onCropAndUploadLeaderImage}
                    className="rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Crop & Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
