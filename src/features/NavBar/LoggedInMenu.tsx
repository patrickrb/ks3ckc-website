import React from 'react';

import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  StackProps,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { ADMIN_PATH } from '@/features/admin/constants';
import { APP_PATH } from '@/features/app/constants';
import { trpc } from '@/lib/trpc/client';

export const LoggedInMenu = ({ ...rest }: StackProps) => {
  const router = useRouter();
  const accountResponse = trpc.account.get.useQuery();
  const account = React.useMemo(() => accountResponse.data, [accountResponse]);

  return (
    rest.direction === 'row' && (
      <Stack display={{ base: 'none', md: 'flex' }}>
        <Menu>
          <MenuButton as={Button}>Profile</MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem onClick={() => router.push(`/app/account`)}>
                My Account
              </MenuItem>
            </MenuGroup>
            {account?.authorizations.includes('ADMIN') && (
              <MenuGroup>
                <MenuItem
                  onClick={() => router.push(`${ADMIN_PATH}/management/users`)}
                >
                  Users
                </MenuItem>
              </MenuGroup>
            )}
            <MenuDivider />
            <MenuGroup>
              <MenuItem
                onClick={() =>
                  router.push(`/logout?redirect=${APP_PATH}/login`)
                }
              >
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Stack>
    )
  );
};
