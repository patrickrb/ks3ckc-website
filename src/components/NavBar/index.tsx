import React from 'react';

import {
  Box,
  BoxProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
  useBreakpointValue,
  useTheme,
} from '@chakra-ui/react';
import { Heading } from '@react-email/components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LuMenu } from 'react-icons/lu';

import { SeckKCLogo } from '@/components/Logo';
import { LoggedInMenu } from '@/features/NavBar/LoggedInMenu';
import { ADMIN_PATH } from '@/features/admin/constants';
import { useRtl } from '@/hooks/useRtl';
import { trpc } from '@/lib/trpc/client';

export const ADMIN_NAV_BAR_HEIGHT = `calc(4rem + env(safe-area-inset-top))`;

const NavBarMainMenu = ({ ...rest }: StackProps) => {
  const { t } = useTranslation(['navbar']);
  const theme = useTheme();
  return (
    <Stack direction="row" spacing="1" {...rest}>
      <NavBarMainMenuItem href="/home">
        {t('navbar:layout.mainMenu.home')}
      </NavBarMainMenuItem>
      <NavBarMainMenuItem href="/blog">
        {t('navbar:layout.mainMenu.blog')}
      </NavBarMainMenuItem>
      <NavBarMainMenuItem href="/contests">
        {t('navbar:layout.mainMenu.contests')}
      </NavBarMainMenuItem>
      <NavBarMainMenuItem href="/about">
        {t('navbar:layout.mainMenu.about')}
      </NavBarMainMenuItem>
    </Stack>
  );
};

const NavBarAuthMenu = ({ ...rest }: StackProps) => {
  const { t } = useTranslation(['navbar']);
  const accountResponse = trpc.account.get.useQuery();
  const account = React.useMemo(() => accountResponse.data, [accountResponse]);

  return account ? (
    <LoggedInMenu {...rest} />
  ) : (
    <Stack spacing="1" {...rest}>
      <NavBarMainMenuItem href="/app/login">
        {t('navbar:layout.mainMenu.login')}
      </NavBarMainMenuItem>
      <NavBarMainMenuItem href="/app/register">
        {t('navbar:layout.mainMenu.register')}
      </NavBarMainMenuItem>
    </Stack>
  );
};

export const NavBar = (props: BoxProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const showDrawer = useBreakpointValue({
    base: true,
    md: false,
  });

  const NavBarDrawerButton = (props: Partial<IconButtonProps>) => {
    return (
      <IconButton
        aria-label="Navigation"
        icon={<LuMenu size="1.5em" />}
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        variant="unstyled"
        _active={{ bg: 'gray.700' }}
        _hover={{ bg: 'gray.900' }}
        {...props}
      />
    );
  };

  const NavBarDrawer = ({ ...rest }) => {
    const { rtlValue } = useRtl();
    return (
      <Drawer
        isOpen={isDrawerOpen}
        placement={rtlValue('left', 'right')}
        onClose={() => setIsDrawerOpen(false)}
        {...rest}
      >
        <DrawerOverlay>
          <DrawerContent
            bg="gray.800"
            color="white"
            pt="safe-top"
            pb="safe-bottom"
          >
            <DrawerCloseButton mt="safe-top" />
            <DrawerHeader>
              <SeckKCLogo width="83" height="83" />
            </DrawerHeader>
            <DrawerBody p="2">
              <NavBarMainMenu direction="column" />
              <NavBarAuthMenu direction="column" />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  };

  return (
    <Box {...props}>
      <Flex
        zIndex="sticky"
        position="fixed"
        top="0"
        insetStart="0"
        insetEnd="0"
        color="gray.50"
        align="center"
        pt="safe-top"
        px="4"
        h={ADMIN_NAV_BAR_HEIGHT}
        bg="gray.800"
        boxShadow="layout"
        borderBottom="1px solid transparent"
        _dark={{
          bg: 'gray.900',
          color: 'white',
          borderBottomColor: 'gray.800',
          boxShadow: 'layout-dark',
        }}
      >
        <NavBarDrawerButton
          display={{ base: 'flex', md: 'none' }}
          ms="-0.5rem"
        />
        <Box as={Link} href="/" mx={{ base: 'auto', md: 0 }}>
          <SeckKCLogo width="83" height="83" />
        </Box>
        <Heading as="h1" color="gray.50" />
        <NavBarMainMenu
          me="auto"
          ms="4"
          display={{ base: 'none', md: 'flex' }}
        />
        <NavBarAuthMenu
          direction="row"
          display={{ base: 'none', md: 'flex' }}
        />
        {/* <NavBarAccountMenu /> */}
      </Flex>
      <Box h={ADMIN_NAV_BAR_HEIGHT} />
      {showDrawer && <NavBarDrawer />}
    </Box>
  );
};

const NavBarMainMenuItem = ({ href, ...rest }: BoxProps & { href: string }) => {
  const { rtlValue } = useRtl();
  const pathname = usePathname() ?? '';
  const isActive =
    href === '/'
      ? pathname === (ADMIN_PATH || '/')
      : pathname.startsWith(`${ADMIN_PATH}${href}`);

  return (
    <Box
      as={Link}
      href={href}
      bg="transparent"
      justifyContent="flex-start"
      position="relative"
      opacity={isActive ? 1 : 0.8}
      fontWeight="semibold"
      borderRadius="md"
      px="4"
      py="2"
      _active={{ bg: 'gray.700' }}
      _hover={{
        bg: 'gray.900',
        _after: {
          opacity: 1,
          w: '2rem',
        },
      }}
      _focusVisible={{
        outline: 'none',
        bg: 'gray.900',
        _after: {
          opacity: 1,
          w: '2rem',
        },
      }}
      _after={{
        opacity: isActive ? 1 : 0,
        content: '""',
        position: 'absolute',
        insetStart: { base: 8, md: '50%' },
        bottom: '0.2em',
        transform: rtlValue('translateX(-50%)', 'translateX(50%)'),
        transition: '0.2s',
        w: isActive ? '2rem' : 0,
        h: '2px',
        borderRadius: 'full',
        bg: 'currentColor',
      }}
      {...rest}
    />
  );
};
