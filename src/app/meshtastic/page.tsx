'use client';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  Heading,
  Icon,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaAndroid, FaApple, FaDesktop, FaQrcode } from 'react-icons/fa';

import HeroComponent from '@/components/HeroComponent';

export default function MeshtasticPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const linkColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Box>
      <HeroComponent />
      <Container maxW="container.lg" py={10}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Connect to SECKC Meshtastic
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }}>
              Join our local mesh network for emergency communications and
              experimentation
            </Text>
          </Box>

          <Box display="flex" justifyContent="center" my={8}>
            <Image
              src="/seckc_meshtastic_qr_code.png"
              alt="SECKC Meshtastic QR Code"
              maxW="300px"
              borderRadius="lg"
              boxShadow="lg"
            />
          </Box>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Quick Connect!</AlertTitle>
              <AlertDescription>
                Scan the QR code above with your Meshtastic app or use this
                link:{' '}
                <Link
                  href="https://meshtastic.org/e/#CgcSAQE6AggNEg4IATgBQANIAVAeWBRoAQ"
                  color={linkColor}
                  isExternal
                >
                  https://meshtastic.org/e/#CgcSAQE6AggNEg4IATgBQANIAVAeWBRoAQ
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </AlertDescription>
            </Box>
          </Alert>

          <Card bg={cardBg}>
            <CardBody>
              <Heading as="h2" size="lg" mb={4}>
                What is Meshtastic?
              </Heading>
              <Text mb={4}>
                Meshtastic is an open-source mesh networking platform that
                enables long-range, low-power communication between devices.
                It's perfect for emergency communications, hiking, camping, and
                areas with limited cellular coverage.
              </Text>
              <Text>
                Our SECKC network provides a local mesh for members to
                experiment with and use during emergencies or events.
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Heading as="h2" size="lg" mb={4}>
                Getting Started
              </Heading>

              <Heading as="h3" size="md" mb={3}>
                Step 1: Get Compatible Hardware
              </Heading>
              <Text mb={4}>
                You'll need a Meshtastic-compatible device. Popular options
                include:
              </Text>
              <UnorderedList mb={4} spacing={1}>
                <ListItem>Heltec LoRa 32 V3</ListItem>
                <ListItem>T-Beam or T-Echo devices</ListItem>
                <ListItem>LilyGO T-Deck</ListItem>
                <ListItem>RAK WisBlock devices</ListItem>
              </UnorderedList>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <AlertDescription>
                  <strong>Important:</strong> Never power on your device without
                  attaching an antenna first!
                </AlertDescription>
              </Alert>

              <Heading as="h3" size="md" mb={3}>
                Step 2: Flash Firmware
              </Heading>
              <OrderedList mb={4} spacing={2}>
                <ListItem>
                  Visit{' '}
                  <Link
                    href="https://meshtastic.org/docs/getting-started"
                    color={linkColor}
                    isExternal
                  >
                    meshtastic.org/docs/getting-started{' '}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </ListItem>
                <ListItem>
                  Select your device type (ESP32, nRF52, or RP2040)
                </ListItem>
                <ListItem>
                  Use a data-capable USB cable (not just a charging cable)
                </ListItem>
                <ListItem>
                  Follow the device-specific flashing instructions
                </ListItem>
              </OrderedList>

              <Heading as="h3" size="md" mb={3}>
                Step 3: Install the App
              </Heading>
              <HStack spacing={4} mb={4}>
                <Button
                  leftIcon={<Icon as={FaAndroid} />}
                  colorScheme="green"
                  as={Link}
                  href="https://play.google.com/store/apps/details?id=com.geeksville.mesh"
                  isExternal
                >
                  Android
                </Button>
                <Button
                  leftIcon={<Icon as={FaApple} />}
                  colorScheme="blue"
                  as={Link}
                  href="https://apps.apple.com/us/app/meshtastic/id1586432531"
                  isExternal
                >
                  iOS
                </Button>
                <Button
                  leftIcon={<Icon as={FaDesktop} />}
                  colorScheme="purple"
                  as={Link}
                  href="https://meshtastic.org/docs/software/web-client"
                  isExternal
                >
                  Web Client
                </Button>
              </HStack>

              <Heading as="h3" size="md" mb={3}>
                Step 4: Connect to Your Device
              </Heading>
              <OrderedList mb={4} spacing={2}>
                <ListItem>Open the Meshtastic app</ListItem>
                <ListItem>Tap the "+" button to find devices</ListItem>
                <ListItem>Connect via Bluetooth, Wi-Fi, or USB</ListItem>
                <ListItem>
                  Pair if required (default PIN is often '123456')
                </ListItem>
                <ListItem>Set your region in the app</ListItem>
                <ListItem>Choose a unique name for yourself</ListItem>
              </OrderedList>

              <Heading as="h3" size="md" mb={3}>
                Step 5: Join the SECKC Channel
              </Heading>
              <OrderedList spacing={2}>
                <ListItem>
                  <Icon as={FaQrcode} mr={2} />
                  Scan the QR code at the top of this page, OR
                </ListItem>
                <ListItem>
                  Tap the link:{' '}
                  <Link
                    href="https://meshtastic.org/e/#CgcSAQE6AggNEg4IATgBQANIAVAeWBRoAQ"
                    color={linkColor}
                    isExternal
                  >
                    Join SECKC Channel <ExternalLinkIcon mx="2px" />
                  </Link>
                </ListItem>
                <ListItem>
                  Your device will automatically configure to join our mesh
                  network
                </ListItem>
                <ListItem>Start messaging with other SECKC members!</ListItem>
              </OrderedList>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Heading as="h2" size="lg" mb={4}>
                Need Help?
              </Heading>
              <Text mb={4}>
                If you need assistance getting connected, reach out to us:
              </Text>
              <UnorderedList spacing={2}>
                <ListItem>Ask questions during our regular meetings</ListItem>
                <ListItem>Visit our website for contact information</ListItem>
                <ListItem>
                  Check the official Meshtastic documentation for
                  troubleshooting
                </ListItem>
              </UnorderedList>
              <Text
                mt={4}
                fontSize="sm"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Remember: Meshtastic is for experimentation and emergency
                communications. Follow proper amateur radio practices and
                regulations.
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
