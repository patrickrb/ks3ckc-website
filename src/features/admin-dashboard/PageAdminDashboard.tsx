import React from 'react';

import { Box, HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import { LuAlertCircle, LuBookOpen, LuGithub } from 'react-icons/lu';

import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS, blink } from '@/components/HomeRedesign/phosphorTheme';
import {
  AdminLayoutPage,
  AdminLayoutPageContent,
  AdminLayoutPageTopBar,
} from '@/features/admin/AdminLayoutPage';

const ToolLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
}) => (
  <Box
    as="a"
    href={href}
    target="_blank"
    rel="noreferrer"
    border="1px solid"
    borderColor={PHOS.line2}
    color={PHOS.green}
    px={3}
    py={2}
    fontSize="12px"
    fontFamily={PHOS.mono}
    display="inline-flex"
    alignItems="center"
    gap={2}
    _hover={{
      borderColor: PHOS.green,
      bg: PHOS.greenDeep,
      textDecoration: 'none',
    }}
  >
    <Icon size={14} />
    {children}
  </Box>
);

export default function PageAdminDashboard() {
  const { t } = useTranslation(['adminDashboard']);
  return (
    <AdminLayoutPage>
      <AdminLayoutPageTopBar>
        <HStack spacing={2}>
          <Text color={PHOS.greenDim} fontSize="11px">
            $
          </Text>
          <Text color={PHOS.amber} fontSize="11px" fontWeight={700}>
            admin --dashboard
          </Text>
          <Box
            as="span"
            color={PHOS.amber}
            animation={`${blink} 1s steps(1) infinite`}
          >
            █
          </Box>
        </HStack>
      </AdminLayoutPageTopBar>
      <AdminLayoutPageContent>
        <Stack spacing={4}>
          <PhosPanel
            title={t('adminDashboard:welcome.title')}
            meta="welcome aboard"
          >
            <Box px={4} py={4} fontFamily={PHOS.mono}>
              <Text
                fontSize="13px"
                color={PHOS.paper}
                opacity={0.85}
                lineHeight="1.7"
              >
                {t('adminDashboard:welcome.description')}
              </Text>
              <Text mt={2} fontSize="12px" color={PHOS.greenDim}>
                <Box
                  as="a"
                  href="https://ks3ckc.radio"
                  color={PHOS.green}
                  textDecoration="underline"
                  textUnderlineOffset="3px"
                  _hover={{ color: PHOS.greenD }}
                >
                  <Trans t={t} i18nKey="adminDashboard:welcome.author" />
                </Box>
              </Text>
            </Box>
          </PhosPanel>

          <PhosPanel title="ops.tools" meta="external">
            <Box px={4} py={4}>
              <Wrap spacing={2}>
                <ToolLink
                  href="https://github.com/patrickrb/ks3ckc-website"
                  icon={LuGithub}
                >
                  {t('adminDashboard:links.github')}
                </ToolLink>
                <ToolLink href="https://ks3ckc.radio" icon={LuBookOpen}>
                  {t('adminDashboard:links.documentation')}
                </ToolLink>
                <ToolLink
                  href="https://github.com/patrickrb/ks3ckc-website/issues/new"
                  icon={LuAlertCircle}
                >
                  {t('adminDashboard:links.openIssue')}
                </ToolLink>
              </Wrap>
            </Box>
          </PhosPanel>
        </Stack>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}
