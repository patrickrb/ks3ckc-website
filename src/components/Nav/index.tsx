import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import {
  Button,
  ChakraComponent,
  Flex,
  FlexProps,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';
import { Icon } from '@/components/Icons';
import { useIsHydrated } from '@/hooks/useIsHydrated';

type NavContextValue = {
  active: ReactNode;
  setActive: (active: ReactNode) => void;
  isMenu: boolean;
};

const NavContext = React.createContext<NavContextValue>({
  active: '',
  setActive: () => undefined,
  isMenu: false,
});
const useNavContext = () => React.useContext(NavContext);

type NavProps = React.PropsWithChildren<MenuProps> & {
  breakpoint?: string;
};

export const Nav = ({ children, breakpoint = 'lg', ...rest }: NavProps) => {
  const isHydrated = useIsHydrated();
  const isMenu = useBreakpointValue({
    base: true,
    [breakpoint]: false,
  });

  const [active, setActive] = useState<ReactNode>(<>-</>);
  return (
    <NavContext.Provider value={{ active, setActive, isMenu: !!isMenu }}>
      <Menu matchWidth {...rest}>
        {!isMenu && (
          <Stack spacing="1" opacity={!isHydrated ? 0 : undefined}>
            {children}
          </Stack>
        )}
        {isMenu && (
          <>
            <MenuButton
              opacity={!isHydrated ? 0 : undefined}
              textAlign="left"
              as={Button}
              rightIcon={<LuChevronDown />}
              bg={PHOS.bg}
              color={PHOS.green}
              border="1px solid"
              borderColor={PHOS.line2}
              borderRadius={0}
              fontFamily={PHOS.mono}
              fontWeight={600}
              _hover={{ bg: PHOS.greenDeep, borderColor: PHOS.greenDim }}
              _active={{ bg: PHOS.greenDeep, borderColor: PHOS.green }}
              sx={{ '> *': { minW: 0 } }}
            >
              {active}
            </MenuButton>
            <Portal>
              <MenuList
                bg={PHOS.panel}
                border="1px solid"
                borderColor={PHOS.line2}
                borderRadius={0}
                py={0}
                fontFamily={PHOS.mono}
              >
                {children}
              </MenuList>
            </Portal>
          </>
        )}
      </Menu>
    </NavContext.Provider>
  );
};

type NavItemProps = FlexProps & {
  icon?: React.FC<React.PropsWithChildren<unknown>>;
  isActive?: boolean;
};

export const NavItem: ChakraComponent<'span', NavItemProps> = ({
  children,
  icon,
  isActive = false,
  ...rest
}) => {
  const { setActive, isMenu } = useNavContext();
  const Item: TODO = isMenu ? MenuItem : Flex;

  const itemContent = useMemo(
    () => (
      <Flex as="span" align="center" minW="0">
        {icon && (
          <Icon
            icon={icon}
            mt="0.05rem"
            me="2"
            fontSize="lg"
            color={isActive ? PHOS.green : PHOS.greenDim}
          />
        )}
        <Text as="span" noOfLines={isMenu ? 1 : 2}>
          {children}
        </Text>
      </Flex>
    ),
    [icon, children, isActive, isMenu]
  );

  useEffect(() => {
    if (isActive) {
      setActive(itemContent);
    }
  }, [isActive, setActive, itemContent]);

  return (
    <Item
      px={3}
      py={2}
      borderRadius={0}
      transition="0.15s"
      fontSize="sm"
      fontWeight={isActive ? 700 : 500}
      fontFamily={PHOS.mono}
      bg={isActive ? PHOS.greenDeep : 'transparent'}
      border="1px solid"
      borderColor={isActive ? PHOS.line2 : 'transparent'}
      borderLeftWidth={isMenu ? 0 : '2px'}
      borderLeftColor={isActive ? PHOS.green : 'transparent'}
      color={isActive ? PHOS.green : PHOS.paper}
      _hover={
        !isActive
          ? {
              bg: 'rgba(57,255,20,0.06)',
              color: PHOS.green,
              borderLeftColor: PHOS.greenDim,
            }
          : {}
      }
      {...rest}
    >
      {itemContent}
    </Item>
  );
};

export const NavGroup: FC<React.PropsWithChildren<FlexProps>> = ({
  children,
  title,
  ...rest
}) => {
  const { isMenu } = useNavContext();

  if (isMenu) {
    return (
      <MenuGroup title={title?.toString()} {...rest}>
        {children}
      </MenuGroup>
    );
  }
  return (
    <Flex direction="column">
      <Flex
        fontSize="10px"
        fontWeight={700}
        px={3}
        pt={2}
        pb={2}
        color={PHOS.greenDim}
        textTransform="uppercase"
        letterSpacing="0.14em"
        fontFamily={PHOS.mono}
        {...rest}
      >
        {title ? `// ${title}` : null}
      </Flex>
      <Stack spacing="1">{children}</Stack>
    </Flex>
  );
};
