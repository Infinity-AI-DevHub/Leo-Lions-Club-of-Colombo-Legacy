import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/admin/*', '/api/*'],
      },
    ],
    sitemap: 'https://colombolegacy.org/sitemap.xml',
    host: 'https://colombolegacy.org',
  };
}
