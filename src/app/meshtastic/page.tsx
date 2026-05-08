'use client';

import { ReactNode } from 'react';

import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { FaAndroid, FaApple, FaDesktop } from 'react-icons/fa';

import PhosPageHeader from '@/components/HomeRedesign/PhosPageHeader';
import PhosPanel from '@/components/HomeRedesign/PhosPanel';
import { PHOS } from '@/components/HomeRedesign/phosphorTheme';

const HARDWARE = [
  'Heltec LoRa 32 V3',
  'T-Beam or T-Echo devices',
  'LilyGO T-Deck',
  'RAK WisBlock devices',
];

const FLASH_STEPS = [
  <>
    visit{' '}
    <Link
      href="https://meshtastic.org/docs/getting-started"
      isExternal
      color={PHOS.greenD}
      textDecoration="underline"
      textUnderlineOffset="3px"
      _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
    >
      meshtastic.org/docs/getting-started
    </Link>
  </>,
  'select your device type (ESP32, nRF52, or RP2040)',
  'use a data-capable USB cable (charging-only cables won&apos;t enumerate)',
  'follow the device-specific flashing instructions',
];

const CONNECT_STEPS = [
  'open the Meshtastic app',
  'tap the "+" button to find devices',
  'connect via Bluetooth, Wi-Fi, or USB',
  'pair if required (default PIN is often 123456)',
  'set your region in the app',
  'choose a unique name for yourself',
];

const JOIN_STEPS = [
  'scan the QR code at the top of this page, OR',
  <>
    tap the link:{' '}
    <Link
      href="https://meshtastic.org/e/#CgcSAQE6AggNEg4IATgBQANIAVAeWBRoAQ"
      isExternal
      color={PHOS.greenD}
      textDecoration="underline"
      textUnderlineOffset="3px"
      _hover={{ color: PHOS.green, bg: 'rgba(57,255,20,0.12)' }}
    >
      Join SecKC Channel ↗
    </Link>
  </>,
  'your device will auto-configure to join our mesh',
  'start messaging with other SecKC members',
];

function PhosOl({ items }: { items: ReactNode[] }) {
  return (
    <OrderedList styleType="none" m={0} pl={0}>
      {items.map((s, i) => (
        <ListItem
          key={i}
          fontSize="14px"
          color={PHOS.paper}
          opacity={0.9}
          py="3px"
          display="flex"
          alignItems="baseline"
          gap={2}
        >
          <Text as="span" color={PHOS.green} fontWeight="700" minW="22px">
            {String(i + 1).padStart(2, '0')}
          </Text>
          <Text as="span" flex="1">
            {s}
          </Text>
        </ListItem>
      ))}
    </OrderedList>
  );
}

function PhosUl({ items }: { items: string[] }) {
  return (
    <UnorderedList styleType="none" m={0} pl={0}>
      {items.map((s) => (
        <ListItem
          key={s}
          fontSize="14px"
          color={PHOS.paper}
          opacity={0.9}
          py="3px"
          _before={{
            content: '"+ "',
            color: PHOS.green,
            marginRight: '6px',
          }}
        >
          {s}
        </ListItem>
      ))}
    </UnorderedList>
  );
}

function AppButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FaAndroid;
  label: string;
}) {
  return (
    <Link
      href={href}
      isExternal
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={3.5}
      py={2}
      border="1px solid"
      borderColor={PHOS.green}
      color={PHOS.green}
      fontSize="13px"
      fontWeight="600"
      letterSpacing="0.02em"
      _hover={{ bg: PHOS.green, color: PHOS.bg, textDecoration: 'none' }}
    >
      <Box as={Icon} boxSize="14px" />
      {label}
    </Link>
  );
}

export default function MeshtasticPage() {
  return (
    <Box>
      <PhosPageHeader
        cmd="ssh seckc-mesh.local"
        title="seckc meshtastic"
        subtitle="local LoRa mesh network for emergency comms and experimentation. join us on the air without the air."
        comment="region: US · 906.875 MHz default"
      />

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <Flex direction="column" gap={6}>
          {/* QR + connect alert */}
          <PhosPanel title="./join.qr" meta="point your phone at this">
            <Box
              px={{ base: 4, md: 6 }}
              py={6}
              fontFamily={PHOS.mono}
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              gap={6}
              alignItems="center"
            >
              <Image
                src="/seckc_meshtastic_qr_code.png"
                alt="SECKC Meshtastic QR Code"
                maxW="240px"
                w="100%"
                border="1px solid"
                borderColor={PHOS.line2}
              />
              <Box flex="1">
                <Text
                  fontSize="11px"
                  color={PHOS.greenDim}
                  textTransform="uppercase"
                  letterSpacing="0.14em"
                  mb={2}
                >
                  $ qr-decode ./join.qr
                </Text>
                <Text
                  fontSize="14px"
                  color={PHOS.paper}
                  mb={3}
                  lineHeight="1.6"
                >
                  scan the code with your meshtastic app, or tap the link below
                  to auto-configure your device for the SecKC mesh.
                </Text>
                <Link
                  href="https://meshtastic.org/e/#CgcSAQE6AggNEg4IATgBQANIAVAeWBRoAQ"
                  isExternal
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={3.5}
                  py={2}
                  border="1px solid"
                  borderColor={PHOS.green}
                  color={PHOS.bg}
                  bg={PHOS.green}
                  fontSize="13px"
                  fontWeight="600"
                  letterSpacing="0.02em"
                  _hover={{ bg: PHOS.greenD, textDecoration: 'none' }}
                >
                  ▶ join channel ↗
                </Link>
              </Box>
            </Box>
          </PhosPanel>

          <PhosPanel title="./what-is-meshtastic" meta="man page">
            <Box px={{ base: 4, md: 6 }} py={5} fontFamily={PHOS.mono}>
              <Text
                fontSize="14px"
                color={PHOS.paper}
                opacity={0.9}
                lineHeight="1.7"
                mb={3}
              >
                Meshtastic is an open-source LoRa mesh networking platform.
                long-range, low-power, peer-to-peer text + telemetry. perfect
                for emergency comms, hiking, camping, areas with no cell
                coverage.
              </Text>
              <Text
                fontSize="14px"
                color={PHOS.paper}
                opacity={0.9}
                lineHeight="1.7"
              >
                our SecKC mesh is a regional network for members to experiment
                with — and depend on when normal infrastructure is down.
              </Text>
            </Box>
          </PhosPanel>

          <PhosPanel title="./getting-started.sh" meta="step-by-step">
            <Box px={{ base: 4, md: 6 }} py={5} fontFamily={PHOS.mono}>
              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
              >
                # step 01 — hardware
              </Text>
              <Text fontSize="14px" color={PHOS.paper} mb={3}>
                grab a meshtastic-compatible device:
              </Text>
              <PhosUl items={HARDWARE} />
              <Box
                mt={4}
                px={3.5}
                py={2.5}
                border="1px solid"
                borderColor={PHOS.amber}
                color={PHOS.amber}
                fontSize="12px"
              >
                ⚠ never power on a radio without an antenna attached.
              </Box>

              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
                mt={6}
              >
                # step 02 — flash firmware
              </Text>
              <PhosOl items={FLASH_STEPS} />

              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
                mt={6}
              >
                # step 03 — install the app
              </Text>
              <Flex gap={2.5} flexWrap="wrap">
                <AppButton
                  href="https://play.google.com/store/apps/details?id=com.geeksville.mesh"
                  icon={FaAndroid}
                  label="android"
                />
                <AppButton
                  href="https://apps.apple.com/us/app/meshtastic/id1586432531"
                  icon={FaApple}
                  label="ios"
                />
                <AppButton
                  href="https://meshtastic.org/docs/software/web-client"
                  icon={FaDesktop}
                  label="web client"
                />
              </Flex>

              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
                mt={6}
              >
                # step 04 — connect device
              </Text>
              <PhosOl items={CONNECT_STEPS} />

              <Text
                fontSize="11px"
                color={PHOS.greenDim}
                textTransform="uppercase"
                letterSpacing="0.14em"
                mb={2}
                mt={6}
              >
                # step 05 — join the channel
              </Text>
              <PhosOl items={JOIN_STEPS} />
            </Box>
          </PhosPanel>

          <PhosPanel title="./help" meta="when things go sideways">
            <Box px={{ base: 4, md: 6 }} py={5} fontFamily={PHOS.mono}>
              <Text fontSize="14px" color={PHOS.paper} mb={3}>
                stuck? we&apos;ve been there.
              </Text>
              <PhosUl
                items={[
                  'ask in #seckc discord',
                  'show up to a wednesday meeting',
                  'check the official meshtastic docs for troubleshooting',
                ]}
              />
              <Text
                fontSize="12px"
                color={PHOS.greenDim}
                mt={4}
                lineHeight="1.6"
              >
                {'// '}meshtastic is for experimentation and emergency comms.
                follow proper amateur radio practices and FCC regs.
              </Text>
            </Box>
          </PhosPanel>
        </Flex>
      </Container>
    </Box>
  );
}
