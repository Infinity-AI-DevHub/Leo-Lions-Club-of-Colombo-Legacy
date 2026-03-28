import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Magazines',
    description: 'Browse club magazine issues from Leo Lions Club of Colombo Legacy.',
    path: '/magazines',
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default async function BlogPage() {
  redirect('/magazines');
}
