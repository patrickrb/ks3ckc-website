import { ReactNode } from 'react';

import { Metadata } from 'next';

import { Document } from '@/app/Document';
import { NextLoader } from '@/app/NextLoader';

export const metadata: Metadata = {
  title: 'KS3CKC - Kansas City Ham Radio Club | Amateur Radio Community',
  applicationName: 'KS3CKC - Kansas City Ham Radio Club',
  description:
    'Join KS3CKC, the premier ham radio club in Kansas City. Amateur radio enthusiasts, emergency communication, technical workshops, and community events. Serving Kansas City and surrounding areas.',
  keywords: [
    'Kansas City Ham Radio Club',
    'ham radio clubs Kansas City',
    'amateur radio Kansas City',
    'KS3CKC',
    'SecKC Amateur Radio',
    'emergency communication',
    'ham radio training',
    'amateur radio community',
    'radio operators Kansas City',
  ],
  authors: [
    { name: 'Patrick Burns', url: 'https://github.com/patrickrb' },
    { name: 'Reid Crowe', url: 'https://github.com/Reid-n0rc' },
  ],
  creator: 'KS3CKC Amateur Radio Club',
  publisher: 'KS3CKC Amateur Radio Club',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ks3ckc.org',
    siteName: 'KS3CKC - Kansas City Ham Radio Club',
    title: 'KS3CKC - Kansas City Ham Radio Club | Amateur Radio Community',
    description:
      'Join KS3CKC, the premier ham radio club in Kansas City. Amateur radio enthusiasts, emergency communication, technical workshops, and community events.',
    images: [
      {
        url: '/logos/ks3ckc-logo.png',
        width: 1200,
        height: 630,
        alt: 'KS3CKC Kansas City Ham Radio Club Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ks3ckc',
    creator: '@ks3ckc',
    title: 'KS3CKC - Kansas City Ham Radio Club',
    description:
      'Join KS3CKC, the premier ham radio club in Kansas City. Amateur radio enthusiasts, emergency communication, and technical workshops.',
    images: ['/logos/ks3ckc-logo.png'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Document>
      <NextLoader />
      {children}
    </Document>
  );
}
