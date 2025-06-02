'use client';

import PageAdminEventUpdate from '@/features/events/PageAdminEventUpdate';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <PageAdminEventUpdate params={params} />;
}