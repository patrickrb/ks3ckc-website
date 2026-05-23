'use client';

import { useState } from 'react';

import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LuMenu } from 'react-icons/lu';

import { useAuth } from '@/hooks/useAuth';
import { getAvatarFallbackName, getAvatarUrl } from '@/lib/avatar';

import { PHOS } from './phosphorTheme';

const NAV_ITEMS: {
  label: string;
  href: string;
  matches: (p: string) => boolean;
}[] = [
  {
    label: '~/home',
    href: '/home',
    matches: (p) => p === '/' || p === '/home',
  },
  { label: './about', href: '/about', matches: (p) => p.startsWith('/about') },
  {
    label: './events',
    href: '/events',
    matches: (p) => p.startsWith('/events'),
  },
  { label: './blog', href: '/blog', matches: (p) => p.startsWith('/blog') },
  {
    label: './members',
    href: '/members',
    matches: (p) => p.startsWith('/members'),
  },
  {
    label: './mesh',
    href: '/meshtastic',
    matches: (p) => p.startsWith('/meshtastic'),
  },
  {
    label: './dash',
    href: '/dashboard',
    matches: (p) => p.startsWith('/dashboard'),
  },
];

function PhosUserMenu() {
  const router = useRouter();
  const { account } = useAuth();

  if (!account) return null;

  const fallback = getAvatarFallbackName(account.name, account.email);
  const avatarSrc = getAvatarUrl(account.image, fallback);
  const isAdmin = account.authorizations?.includes('ADMIN');
  const display = account.name || account.email || 'operator';

  const handleLogout = () => {
    window.location.href = '/logout?redirect=/home';
  };

  return (
    <Menu placement="bottom-end" gutter={6} autoSelect={false}>
      <MenuButton
        aria-label="account menu"
        bg="transparent"
        border="1px solid"
        borderColor={PHOS.line2}
        px={2}
        py={1}
        fontFamily={PHOS.mono}
        fontSize="11px"
        color={PHOS.green}
        _hover={{ borderColor: PHOS.green, bg: 'rgba(57,255,20,0.08)' }}
        _active={{ borderColor: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
      >
        <HStack spacing={2}>
          <Avatar
            size="2xs"
            name={fallback}
            src={avatarSrc}
            bg={PHOS.greenDeep}
            color={PHOS.green}
            border="1px solid"
            borderColor={PHOS.line2}
            borderRadius="0"
          />
          <Text
            display={{ base: 'none', md: 'inline' }}
            color={PHOS.green}
            fontSize="11px"
          >
            {display}
          </Text>
          <Text color={PHOS.greenDim} fontSize="10px">
            ▾
          </Text>
        </HStack>
      </MenuButton>
      <MenuList
        bg={PHOS.panel}
        border="1px solid"
        borderColor={PHOS.line2}
        borderRadius={0}
        py={0}
        minW="200px"
        boxShadow="0 0 0 1px rgba(57,255,20,0.18), 0 6px 24px rgba(0,0,0,0.6)"
      >
        <Box
          px={3}
          py={2}
          borderBottom="1px dashed"
          borderColor={PHOS.line2}
          fontFamily={PHOS.mono}
        >
          <Text fontSize="10px" color={PHOS.greenDim} letterSpacing="0.12em">
            $ whoami
          </Text>
          <Text fontSize="12px" color={PHOS.green} mt={0.5} noOfLines={1}>
            {display}
          </Text>
          {account.email && account.email !== display && (
            <Text fontSize="10px" color={PHOS.greenDim} noOfLines={1}>
              {account.email}
            </Text>
          )}
        </Box>

        <MenuItem
          onClick={() => router.push('/app/account')}
          bg="transparent"
          color={PHOS.paper}
          fontFamily={PHOS.mono}
          fontSize="12px"
          borderRadius={0}
          _hover={{ bg: PHOS.greenDeep, color: PHOS.green }}
          _focus={{ bg: PHOS.greenDeep, color: PHOS.green }}
        >
          <Box as="span" color={PHOS.greenDim} mr={2}>
            ./
          </Box>
          account
        </MenuItem>
        <MenuItem
          onClick={() => router.push('/app')}
          bg="transparent"
          color={PHOS.paper}
          fontFamily={PHOS.mono}
          fontSize="12px"
          borderRadius={0}
          _hover={{ bg: PHOS.greenDeep, color: PHOS.green }}
          _focus={{ bg: PHOS.greenDeep, color: PHOS.green }}
        >
          <Box as="span" color={PHOS.greenDim} mr={2}>
            ./
          </Box>
          app
        </MenuItem>

        {isAdmin && (
          <>
            <MenuDivider borderColor={PHOS.line2} my={0} />
            <MenuItem
              onClick={() => router.push('/admin/management/users')}
              bg="transparent"
              color={PHOS.amber}
              fontFamily={PHOS.mono}
              fontSize="12px"
              borderRadius={0}
              _hover={{ bg: 'rgba(255,176,0,0.1)', color: PHOS.amber }}
              _focus={{ bg: 'rgba(255,176,0,0.1)', color: PHOS.amber }}
            >
              <Box as="span" color={PHOS.amber} opacity={0.6} mr={2}>
                #
              </Box>
              admin
            </MenuItem>
          </>
        )}

        <MenuDivider borderColor={PHOS.line2} my={0} />
        <MenuItem
          onClick={handleLogout}
          bg="transparent"
          color={PHOS.red}
          fontFamily={PHOS.mono}
          fontSize="12px"
          borderRadius={0}
          _hover={{ bg: 'rgba(255,58,58,0.1)', color: PHOS.red }}
          _focus={{ bg: 'rgba(255,58,58,0.1)', color: PHOS.red }}
        >
          <Box as="span" color={PHOS.red} opacity={0.6} mr={2}>
            ✕
          </Box>
          logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default function PhosNav() {
  const pathname = usePathname() ?? '';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <Box
      as="header"
      borderBottom="1px solid"
      borderColor={PHOS.line2}
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      bg={PHOS.bg}
      zIndex={20}
      fontFamily={PHOS.mono}
    >
      <Flex align="center" justify="space-between" gap={4}>
        <HStack spacing={3.5} flexShrink={0}>
          <Text
            fontSize="11px"
            color={PHOS.greenDim}
            display={{ base: 'none', md: 'inline' }}
          >
            [ root@ks3ckc ~ ]$
          </Text>
          <Link
            as={NextLink}
            href="/home"
            fontSize={{ base: '14px', md: '18px' }}
            fontWeight="700"
            color={PHOS.green}
            letterSpacing="0.04em"
            _hover={{ textDecoration: 'none' }}
          >
            KS3CKC
            <Box as="span" color={PHOS.greenDim}>
              .radio
            </Box>
          </Link>
          <Box
            as="span"
            fontSize="10px"
            color={PHOS.amber}
            border="1px solid"
            borderColor={PHOS.amber}
            px="6px"
            py="2px"
            display={{ base: 'none', sm: 'inline-block' }}
          >
            501(c)(3)
          </Box>
        </HStack>

        <HStack
          spacing={1}
          fontSize="12px"
          display={{ base: 'none', lg: 'flex' }}
        >
          {NAV_ITEMS.map((l) => {
            const active = l.matches(pathname);
            return (
              <Link
                as={NextLink}
                key={l.label}
                href={l.href}
                px="10px"
                py="6px"
                textDecoration="none"
                color={active ? PHOS.green : PHOS.greenDim}
                bg={active ? PHOS.greenDeep : 'transparent'}
                _hover={{
                  color: PHOS.green,
                  bg: 'rgba(57,255,20,0.12)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </HStack>

        <HStack spacing={3} fontSize="11px" color={PHOS.greenDim}>
          <Text display={{ base: 'none', md: 'inline' }}>↻ 14.230 MHz</Text>
          <Text color={PHOS.green}>● ON-AIR</Text>
          {isLoggedIn ? (
            <PhosUserMenu />
          ) : (
            <Link
              as={NextLink}
              href="/app/login"
              color={PHOS.green}
              _hover={{ color: PHOS.greenD, textDecoration: 'underline' }}
            >
              login
            </Link>
          )}
          <IconButton
            aria-label="menu"
            icon={<LuMenu />}
            onClick={() => setDrawerOpen(true)}
            variant="ghost"
            color={PHOS.green}
            _hover={{ bg: 'rgba(57,255,20,0.12)' }}
            display={{ base: 'inline-flex', lg: 'none' }}
            size="sm"
          />
        </HStack>
      </Flex>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent bg={PHOS.bg} color={PHOS.green} fontFamily={PHOS.mono}>
          <DrawerCloseButton color={PHOS.green} />
          <DrawerHeader
            borderBottom="1px solid"
            borderColor={PHOS.line2}
            fontSize="14px"
            color={PHOS.green}
          >
            $ ls /
          </DrawerHeader>
          <DrawerBody p={2}>
            <Stack spacing={0}>
              {NAV_ITEMS.map((l) => {
                const active = l.matches(pathname);
                return (
                  <Link
                    as={NextLink}
                    key={l.label}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    px={3}
                    py={2.5}
                    color={active ? PHOS.green : PHOS.greenDim}
                    bg={active ? PHOS.greenDeep : 'transparent'}
                    _hover={{
                      color: PHOS.green,
                      bg: 'rgba(57,255,20,0.12)',
                      textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
