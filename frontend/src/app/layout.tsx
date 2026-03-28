import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { SitePreloader } from '@/components/site-preloader';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://colombolegacy.org'),
  title: {
    default: 'Leo Lions Club of Colombo Legacy',
    template: '%s | Leo Lions Club of Colombo Legacy',
  },
  description:
    'Official website of Leo Lions Club of Colombo Legacy. Explore projects, events, leadership, magazines, notices, and membership opportunities.',
  keywords: [
    'Leo Lions Club of Colombo Legacy',
    'Leo Club Sri Lanka',
    'Youth leadership Colombo',
    'Community service Colombo',
    'Lions clubs Sri Lanka',
    'Volunteer Sri Lanka',
    'Leo projects and events',
  ],
  alternates: {
    canonical: 'https://colombolegacy.org',
  },
  openGraph: {
    type: 'website',
    url: 'https://colombolegacy.org',
    siteName: 'Leo Lions Club of Colombo Legacy',
    title: 'Leo Lions Club of Colombo Legacy',
    description:
      'Empowering youth through leadership, service, and impact-driven community initiatives.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'Leo Lions Club of Colombo Legacy logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leo Lions Club of Colombo Legacy',
    description:
      'Empowering youth through leadership, service, and impact-driven community initiatives.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SitePreloader>{children}</SitePreloader>
      </body>
    </html>
  );
}
