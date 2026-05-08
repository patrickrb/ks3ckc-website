'use client';

import React, { FC, useContext, useEffect, useMemo, useState } from 'react';

import { Box, Flex, UseDisclosureProps, useDisclosure } from '@chakra-ui/react';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { Viewport } from '@/components/Viewport';

export type AppLayoutContextNavDisplayed = boolean | 'desktop';

type AppLayoutContextValue = {
  navDisplayed: AppLayoutContextNavDisplayed;
  setNavDisplayed: React.Dispatch<
    React.SetStateAction<AppLayoutContextNavDisplayed>
  >;
  navDrawer: UseDisclosureProps;
};

export const AppLayoutContext =
  React.createContext<AppLayoutContextValue | null>(null);

export const useAppLayoutContext = () => {
  const ctx = useContext(AppLayoutContext);
  if (ctx === null) {
    throw new Error('Missing parent <AppLayout> component');
  }
  return ctx;
};

export const useAppLayoutHideNav = (
  displayed: AppLayoutContextNavDisplayed = true
) => {
  const { setNavDisplayed } = useAppLayoutContext();

  useEffect(() => {
    setNavDisplayed(displayed);
    return () => setNavDisplayed(true);
  }, [setNavDisplayed, displayed]);
};

export const AppLayout: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [navDisplayed, setNavDisplayed] =
    useState<AppLayoutContextNavDisplayed>(true);
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
    <AppLayoutContext.Provider value={providerValue}>
      <Viewport
        data-testid="app-layout"
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
              'repeating-linear-gradient(to bottom, rgba(57,255,20,0.025) 0px, rgba(57,255,20,0.025) 1px, transparent 1px, transparent 3px)',
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
    </AppLayoutContext.Provider>
  );
};
