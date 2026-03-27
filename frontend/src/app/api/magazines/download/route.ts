import { NextRequest } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

function sanitizeFilename(input: string) {
  const base = input
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return base || 'magazine.pdf';
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url') || '';
  const filename = sanitizeFilename(request.nextUrl.searchParams.get('filename') || 'magazine.pdf');
  const allowedPrefix = `${API_BASE_URL}/uploads/`;

  if (!source.startsWith(allowedPrefix)) {
    return new Response('Invalid file URL', { status: 400 });
  }

  const upstream = await fetch(source);
  if (!upstream.ok || !upstream.body) {
    return new Response('Unable to fetch file', { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
