'use client';

import React, { FC, useContext, useEffect, useMemo, useState } from 'react';

import { Box, Flex, UseDisclosureProps, useDisclosure } from '@chakra-ui/react';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { Viewport } from '@/components/Viewport';

export type AdminLayoutContextNavDisplayed = boolean | 'desktop';

type AdminLayoutContextValue = {
  navDisplayed: AdminLayoutContextNavDisplayed;
  setNavDisplayed: React.Dispatch<
    React.SetStateAction<AdminLayoutContextNavDisplayed>
  >;
  navDrawer: UseDisclosureProps;
};

export const AdminLayoutContext =
  React.createContext<AdminLayoutContextValue | null>(null);

export const useAdminLayoutContext = () => {
  const ctx = useContext(AdminLayoutContext);
  if (ctx === null) {
    throw new Error('Missing parent <AdminLayout> component');
  }
  return ctx;
};

export const useAdminLayoutHideNav = (
  displayed: AdminLayoutContextNavDisplayed = true
) => {
  const { setNavDisplayed } = useAdminLayoutContext();

  useEffect(() => {
    setNavDisplayed(displayed);
    return () => setNavDisplayed(true);
  }, [setNavDisplayed, displayed]);
};

export const AdminLayout: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [navDisplayed, setNavDisplayed] =
    useState<AdminLayoutContextNavDisplayed>(true);
  const navDrawer = useDisclosure();

  const providerValue = useMemo(
    () => ({
      navDisplayed,
      setNavDisplayed,
      navDrawer,
    }),
    [navDisplayed, setNavDisplayed, navDrawer]
  );

  return (
    <AdminLayoutContext.Provider value={providerValue}>
      <Viewport
        data-testid="admin-layout"
        bg={PHOS.bg}
        color={PHOS.paper}
        fontFamily={PHOS.mono}
        position="relative"
        sx={{
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            background:
              'repeating-linear-gradient(to bottom, rgba(255,176,0,0.025) 0px, rgba(255,176,0,0.025) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            zIndex: 0,
          },
        }}
      >
        <Box
          position="relative"
          zIndex={1}
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <Flex flex="1" direction="column">
            {children}
          </Flex>
        </Box>
      </Viewport>
    </AdminLayoutContext.Provider>
  );
};
