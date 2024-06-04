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

import { APP_PATH } from '@/features/app/constants';

export const LoggedInMenu = ({ ...rest }: StackProps) => {
  const router = useRouter();
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
