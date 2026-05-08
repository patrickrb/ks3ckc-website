import React, { ReactNode, useContext, useMemo } from 'react';

import {
  Box,
  ButtonGroup,
  Container,
  ContainerProps,
  Flex,
  FlexProps,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import useMeasure from 'react-use-measure';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import {
  AdminLayoutContextNavDisplayed,
  useAdminLayoutHideNav,
} from '@/features/admin/AdminLayout';

type AdminLayoutPageContextValue = {
  nav: React.ReactNode;
  noContainer: boolean;
  containerMaxWidth: ContainerProps['maxW'];
};

const AdminLayoutPageContext =
  React.createContext<AdminLayoutPageContextValue | null>(null);

const useAdminLayoutPageContext = () => {
  const context = useContext(AdminLayoutPageContext);
  if (context === null) {
    throw new Error('Missing parent <AdminLayoutPage> component');
  }
  return context;
};

const PageContainer = ({ children, maxW, ...rest }: ContainerProps) => {
  const { noContainer, containerMaxWidth } = useAdminLayoutPageContext();

  if (noContainer) return <>{children}</>;
  return (
    <Container
      display="flex"
      flexDirection="column"
      flex="1"
      w="full"
      maxW={maxW ?? containerMaxWidth}
      {...rest}
    >
      {children}
    </Container>
  );
};

type AdminLayoutPageTopBarProps = FlexProps & {
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  isFixed?: boolean;
  isConfirmDiscardChanges?: boolean;
  containerMaxWidth?: ContainerProps['maxW'];
};

export const AdminLayoutPageTopBar = ({
  children,
  leftActions,
  rightActions,
  isFixed = true,
  containerMaxWidth,
  ...rest
}: AdminLayoutPageTopBarProps) => {
  const [ref, { height }] = useMeasure();

  return (
    <>
      {isFixed && <Box h={`${height}px`} />}
      <Flex
        zIndex={2}
        direction="column"
        py={2.5}
        bg={PHOS.bg2}
        ref={ref}
        borderBottom="1px solid"
        borderBottomColor={PHOS.line2}
        fontFamily={PHOS.mono}
        position="relative"
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent, ${PHOS.amber}, transparent)`,
            opacity: 0.4,
          },
        }}
        {...rest}
      >
        <Box w="full" h="0" pb="safe-top" />
        <PageContainer maxW={containerMaxWidth}>
          <HStack spacing={3} align="center">
            <Text
              fontSize="11px"
              color={PHOS.amber}
              opacity={0.7}
              fontWeight={700}
              letterSpacing="0.12em"
              textTransform="uppercase"
              flexShrink={0}
              display={{ base: 'none', md: 'inline' }}
            >
              [admin]
            </Text>
            {!!leftActions && (
              <ButtonGroup size="sm" spacing={2}>
                {leftActions}
              </ButtonGroup>
            )}
            <Box flex="1" minW={0}>
              {children}
            </Box>
            {!!rightActions && (
              <ButtonGroup size="sm" spacing={2}>
                {rightActions}
              </ButtonGroup>
            )}
          </HStack>
        </PageContainer>
      </Flex>
    </>
  );
};

type AdminLayoutPageContentProps = FlexProps & {
  onBack?(): void;
  showBack?: boolean;
  containerMaxWidth?: ContainerProps['maxW'];
};

export const AdminLayoutPageContent = ({
  children,
  containerMaxWidth,
  ...rest
}: AdminLayoutPageContentProps) => {
  const { nav } = useAdminLayoutPageContext();
  return (
    <Flex
      position="relative"
      zIndex="1"
      direction="column"
      flex="1"
      py={4}
      color={PHOS.paper}
      {...rest}
    >
      <PageContainer maxW={containerMaxWidth} pb={16}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: 4, lg: 6 }}
          flex="1"
        >
          {nav && (
            <Flex
              direction="column"
              minW="0"
              w={{ base: 'full', lg: '14rem' }}
              border="1px solid"
              borderColor={PHOS.line2}
              bg={PHOS.panel}
              p={2}
              alignSelf="flex-start"
              fontFamily={PHOS.mono}
            >
              {nav}
            </Flex>
          )}
          <Flex direction="column" flex="1" minW="0">
            {children}
          </Flex>
        </Stack>
      </PageContainer>
      <Box w="full" h="0" pb="safe-bottom" />
    </Flex>
  );
};

type AdminLayoutPageBottomBarProps = FlexProps & {
  containerMaxWidth?: ContainerProps['maxW'];
};

export const AdminLayoutPageBottomBar = ({
  children,
  containerMaxWidth,
  ...rest
}: AdminLayoutPageBottomBarProps) => {
  const [ref, { height }] = useMeasure();

  return (
    <>
      <Box h={`${height}px`} />
      <Flex
        zIndex="3"
        ref={ref}
        direction="column"
        mt="auto"
        position="fixed"
        bottom="0"
        insetStart="0"
        insetEnd="0"
        py={2}
        bg={PHOS.bg2}
        borderTop="1px solid"
        borderTopColor={PHOS.line2}
        fontFamily={PHOS.mono}
        {...rest}
      >
        <PageContainer maxW={containerMaxWidth}>{children}</PageContainer>
        <Box w="full" h="0" pb="safe-bottom" />
      </Flex>
    </>
  );
};

type AdminLayoutPageProps = FlexProps & {
  showNavBar?: AdminLayoutContextNavDisplayed;
  containerMaxWidth?: ContainerProps['maxW'];
  noContainer?: boolean;
  nav?: React.ReactNode;
};

export const AdminLayoutPage = ({
  showNavBar = true,
  noContainer = false,
  containerMaxWidth = 'container.lg',
  nav = null,
  ...rest
}: AdminLayoutPageProps) => {
  useAdminLayoutHideNav(showNavBar);

  const value = useMemo(
    () => ({
      nav,
      noContainer,
      containerMaxWidth,
    }),
    [containerMaxWidth, noContainer, nav]
  );

  return (
    <AdminLayoutPageContext.Provider value={value}>
      <Flex direction="column" flex="1" position="relative" {...rest} />
    </AdminLayoutPageContext.Provider>
  );
};
