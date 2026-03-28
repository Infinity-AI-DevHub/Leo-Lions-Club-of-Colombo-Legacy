import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Magazine Issue',
    description: 'Download published magazine issues from Leo Lions Club of Colombo Legacy.',
    path: '/magazines',
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  redirect('/magazines');
}
