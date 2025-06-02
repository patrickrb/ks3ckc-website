import React from 'react';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LuFileEdit, LuNewspaper, LuFileEdit, LuUsers } from 'react-icons/lu';


import { Nav, NavGroup, NavItem } from '@/components/Nav';
import { LinkAdmin } from '@/features/admin/LinkAdmin';
import { ADMIN_PATH } from '@/features/admin/constants';

export const AdminNav = () => {
  const { t } = useTranslation(['management']);
  const pathname = usePathname();
  const isActive = (to: string) => pathname?.startsWith(to);
  return (
    <Nav>
      <NavGroup title={t('management:nav.title')}>
        <NavItem
          as={LinkAdmin}
          href="/management/users"
          isActive={isActive(`${ADMIN_PATH}/management/users`)}
          icon={LuUsers}
        >
          {t('management:nav.users')}
        </NavItem>
        <NavItem
          as={LinkAdmin}
          href="/management/blogs"
          isActive={isActive(`${ADMIN_PATH}/management/blogs`)}
          icon={LuFileEdit}
        >
          Blogs
        </NavItem>
        <NavItem
          as={LinkAdmin}
          href="/management/events"
          isActive={isActive(`${ADMIN_PATH}/management/events`)}
          icon={LuCalendar}
        >
          Events
          href="/management/news"
          isActive={isActive(`${ADMIN_PATH}/management/news`)}
          icon={LuNewspaper}
        >
          News
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
