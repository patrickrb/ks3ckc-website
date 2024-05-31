import { ReactNode } from 'react';

import { Metadata } from 'next';

import { Document } from '@/app/Document';
import { NextLoader } from '@/app/NextLoader';

export const metadata: Metadata = {
  title:
    'KS3CKC - SecKC Amateur Radio Club of Kansas City and Surrounding Cities for Amateur Radio',
  applicationName:
    'KS3CKC - SecKC Amateur Radio Club of Kansas City and Surrounding Cities for Amateur Radio',
  description:
    'Home page for the SecKC Amateur Radio Club of Kansas City and Surrounding Cities for Amateur Radio',
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
