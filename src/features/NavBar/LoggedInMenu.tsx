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
import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { ADMIN_PATH } from '@/features/admin/constants';
import { APP_PATH } from '@/features/app/constants';
import { useAuth } from '@/hooks/useAuth';

export const LoggedInMenu = ({ ...rest }: StackProps) => {
  const router = useRouter();
  const { account, refreshAuth } = useAuth();
  const menuButtonBg = useColorModeValue('white', 'gray.800');
  const menuButtonColor = useColorModeValue('black', 'white');
  const menuItemColor = useColorModeValue('gray.800', 'white');

  const handleLogout = () => {
    // Call refreshAuth to update auth state
    refreshAuth();

    // Use window.location.href instead of router.push to force a full page reload
    window.location.href = `/logout?redirect=${APP_PATH}/login`;
  };

  return (
    rest.direction === 'row' && (
      <Stack display={{ base: 'none', md: 'flex' }}>
        <Menu>
          <MenuButton as={Button} bg={menuButtonBg} color={menuButtonColor}>
            Profile
          </MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem
                color={menuItemColor}
                onClick={() => router.push(`/app/account`)}
              >
                My Account
              </MenuItem>
            </MenuGroup>
            {account?.authorizations.includes('ADMIN') && (
              <MenuGroup>
                <MenuItem
                  color={menuItemColor}
                  onClick={() => router.push(`${ADMIN_PATH}/management/users`)}
                >
                  Users
                </MenuItem>
              </MenuGroup>
            )}
            <MenuDivider />
            <MenuGroup>
              <MenuItem color={menuItemColor} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Stack>
    )
  );
};
