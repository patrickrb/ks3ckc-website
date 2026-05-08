import { NextResponse } from 'next/server';

import { FREQUENCIES } from '@/components/HomeRedesign/freqsData';

export function GET() {
  return NextResponse.json(
    {
      club: 'KS3CKC',
      updated: new Date().toISOString(),
      count: FREQUENCIES.length,
      frequencies: FREQUENCIES.map(
        ({ label, freq, tone, mode, type, loc, lastHeard }) => ({
          name: label.trim(),
          freq_mhz: freq.trim(),
          tone,
          mode,
          primary: type === 'primary',
          location: loc,
          last_heard: lastHeard,
        })
      ),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    }
  );
}
