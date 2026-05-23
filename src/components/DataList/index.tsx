import { ReactNode } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  FlexProps,
  Skeleton,
  Stack,
  Text,
  TextProps,
  Wrap,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';

import { PHOS } from '@/components/HomeRedesign/phosphorTheme';

export type DataListProps = FlexProps;

export const DataList = (props: DataListProps) => {
  return (
    <Flex
      flexDirection="column"
      position="relative"
      overflowX="auto"
      overflowY="hidden"
      minH="10rem"
      bg={PHOS.panel}
      color={PHOS.paper}
      fontFamily={PHOS.mono}
      border="1px solid"
      borderColor={PHOS.line2}
      borderRadius={0}
      {...props}
    />
  );
};

export type DataListRowProps = FlexProps & { withHover?: boolean };

export const DataListRow = ({ withHover, ...props }: DataListRowProps) => {
  return (
    <Flex
      borderBottom="1px solid"
      borderBottomColor={PHOS.line}
      transition="0.15s"
      px={2}
      {...props}
      _last={{
        mb: '-1px',
        ...props._last,
      }}
      _hover={{
        ...(withHover
          ? {
              bg: 'rgba(57,255,20,0.06)',
              borderBottomColor: PHOS.line2,
            }
          : {}),
        ...props._hover,
      }}
    />
  );
};

export type DataListCellProps = FlexProps;

export const DataListCell = (props: DataListCellProps) => {
  const isFluid = props.w === undefined && props.width === undefined;

  return (
    <Flex
      flexDirection="column"
      minW={0}
      flex={isFluid ? 1 : undefined}
      py="2"
      px="1.5"
      align="flex-start"
      justifyContent="center"
      {...props}
    >
      {props.children}
    </Flex>
  );
};

export type DataListTextHeaderProps = DataListTextProps;

export const DataListTextHeader = (props: DataListTextHeaderProps) => {
  return (
    <DataListText
      fontWeight="bold"
      fontSize="11px"
      letterSpacing="0.12em"
      textTransform="uppercase"
      color={PHOS.greenDim}
      {...props}
    >
      {props.children}
    </DataListText>
  );
};

export type DataListTextProps = TextProps;

export const DataListText = (props: DataListTextProps) => {
  return (
    <Text
      as="div"
      fontSize="sm"
      maxW="full"
      noOfLines={1}
      color={PHOS.paper}
      {...props}
    />
  );
};

export const DataListLoadingState = () => {
  return (
    <>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.6} p={2}>
            <Skeleton
              w="30%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
            <Skeleton
              w="20%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.4} p={2}>
            <Skeleton
              w="30%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
            <Skeleton
              w="20%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.2} p={2}>
            <Skeleton
              w="30%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
            <Skeleton
              w="20%"
              h={2}
              noOfLines={1}
              startColor={PHOS.greenDeep}
              endColor={PHOS.line2}
            />
          </Stack>
        </DataListCell>
      </DataListRow>
    </>
  );
};

export type DataListEmptyStateProps = {
  children?: ReactNode;
  searchTerm?: string;
};

export const DataListEmptyState = (props: DataListEmptyStateProps) => {
  const { t } = useTranslation(['components']);
  return (
    <DataListRow flex={1}>
      <DataListCell
        flex={1}
        justifyContent="center"
        alignItems="center"
        fontSize="12px"
        fontFamily={PHOS.mono}
        color={PHOS.greenDim}
        py={6}
      >
        {props.searchTerm ? (
          <Box>
            <Box as="span" color={PHOS.amber} mr={2}>
              {'//'}
            </Box>
            {t('components:datalist.noResultsTitle', {
              searchTerm: props.searchTerm,
            })}
          </Box>
        ) : (
          props.children ?? (
            <Box>
              <Box as="span" color={PHOS.amber} mr={2}>
                {'//'}
              </Box>
              {t('components:datalist.emptyTitle')}
            </Box>
          )
        )}
      </DataListCell>
    </DataListRow>
  );
};

export type DataListErrorStateProps = {
  title?: ReactNode;
  children?: ReactNode;
  retry?: () => void;
};

export const DataListErrorState = (props: DataListErrorStateProps) => {
  const { t } = useTranslation(['components']);
  return (
    <DataListRow>
      <DataListCell>
        <Alert
          status="error"
          bg={PHOS.bg2}
          color={PHOS.red}
          border="1px solid"
          borderColor={PHOS.red}
          borderRadius={0}
          fontFamily={PHOS.mono}
        >
          <AlertTitle>
            <Box as="span" color={PHOS.red} mr={2}>
              !!
            </Box>
            {props.title ?? t('components:datalist.errorTitle')}
          </AlertTitle>
          {(!!props.children || !!props.retry) && (
            <AlertDescription>
              <Wrap spacingX={2} spacingY={1}>
                {!!props.children && (
                  <Box alignSelf="center" color={PHOS.paper}>
                    {props.children}
                  </Box>
                )}
                {!!props.retry && (
                  <Button
                    size="sm"
                    leftIcon={<LuRefreshCw />}
                    onClick={() => props.retry?.()}
                    bg="transparent"
                    color={PHOS.red}
                    border="1px solid"
                    borderColor={PHOS.red}
                    borderRadius={0}
                    fontFamily={PHOS.mono}
                    _hover={{ bg: 'rgba(255,58,58,0.1)' }}
                  >
                    {t('components:datalist.retry')}
                  </Button>
                )}
              </Wrap>
            </AlertDescription>
          )}
        </Alert>
      </DataListCell>
    </DataListRow>
  );
};
