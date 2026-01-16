'use client';

import { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/next';
import { ColorModeScript } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Providers } from '@/app/Providers';
import { NavBar } from '@/components/NavBar';
import { Viewport } from '@/components/Viewport';
import { DevEnvHint } from '@/features/devtools/DevEnvHint';
import i18n from '@/lib/i18n/client';
import { AVAILABLE_LANGUAGES } from '@/lib/i18n/constants';
import { TrpcProvider } from '@/lib/trpc/TrpcProvider';
import theme, { COLOR_MODE_STORAGE_KEY } from '@/theme';

export const Document = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang={i18n.language}
      dir={
        AVAILABLE_LANGUAGES.find(({ key }) => key === i18n.language)?.dir ??
        'ltr'
      }
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <link rel="canonical" href="https://ks3ckc.org" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={theme.colors.gray?.['800']}
        />
        <meta
          name="msapplication-TileColor"
          content={theme.colors.gray?.['800']}
        />
        <meta name="theme-color" content={theme.colors.gray?.['800']} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'KS3CKC - Kansas City Amateur Radio Club',
              alternateName: 'SecKC Amateur Radio Club',
              url: 'https://ks3ckc.org',
              logo: 'https://ks3ckc.org/logos/ks3ckc-logo.png',
              description:
                'Premier ham radio club in Kansas City offering amateur radio training, emergency communication, technical workshops, and community events.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kansas City',
                addressRegion: 'MO',
                addressCountry: 'US',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'General Information',
                email: 'info@ks3ckc.org',
              },
              sameAs: [
                'https://groups.io/g/SecKCARC/',
                'https://discord.gg/seckc',
                'https://seckc.org',
              ],
              memberOf: {
                '@type': 'Organization',
                name: 'SecKC',
                url: 'https://seckc.org',
              },
              keywords: [
                'ham radio',
                'amateur radio',
                'Kansas City',
                'emergency communication',
                'radio training',
                'KS3CKC',
              ],
            }),
          }}
        />
      </head>
      <body>
        {/* https://github.com/chakra-ui/chakra-ui/issues/7040 */}
        <ColorModeScript
          initialColorMode={theme.config.initialColorMode}
          storageKey={COLOR_MODE_STORAGE_KEY}
        />
        <Providers>
          <TrpcProvider>
            <NavBar />
            <Viewport>{children}</Viewport>
            <DevEnvHint />
            <ReactQueryDevtools initialIsOpen={false} />
          </TrpcProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
};
