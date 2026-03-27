import { redirect } from 'next/navigation';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  redirect('/magazines');
}
