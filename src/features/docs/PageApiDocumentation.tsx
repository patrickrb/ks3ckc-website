'use client';

import React, { useEffect, useRef } from 'react';

import { Flex, useBreakpointValue } from '@chakra-ui/react';
import Script from 'next/script';

import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'elements-api': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

// Stoplight is loaded as a self-contained web component bundle to avoid
// pulling its React entry through the build — the React build references
// ReactDOM.render at module scope, which fails Next 15's webpack analysis.
const STOPLIGHT_VERSION = '9.0.13';
const STOPLIGHT_BASE = `https://unpkg.com/@stoplight/elements@${STOPLIGHT_VERSION}`;

export default function PageApiDocumentation() {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const layout = isMobile ? 'stacked' : 'sidebar';
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.setAttribute('apiDescriptionUrl', '/api/openapi.json');
    el.setAttribute('layout', layout);
    el.setAttribute('router', 'memory');
  }, [layout]);

  return (
    <AdminLayoutPage noContainer>
      <link rel="stylesheet" href={`${STOPLIGHT_BASE}/styles.min.css`} />
      <Script
        src={`${STOPLIGHT_BASE}/web-components.min.js`}
        strategy="afterInteractive"
      />
      <AdminLayoutPageContent>
        <Flex
          direction="column"
          position="absolute"
          inset="0"
          overflow="auto"
          p={{ base: '4', lg: '0' }}
        >
          <elements-api ref={elRef} />
        </Flex>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}
