import React, { useEffect } from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Code,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

export const DemoModalInterceptor = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();

  const toastCloseAll = toast.closeAll;

  useEffect(() => {
    setTimeout(() => {
      toastCloseAll();
    });
  }, [toastCloseAll]);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay style={{ backdropFilter: 'blur(6px)' }} />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>👋 Demo Mode</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Text>
              This is a <strong>read-only demo</strong>, this action is
              disabled.
            </Text>
            <Stack>
              <Text>
                You can learn more about KS3CKC and amateur radio by visiting our website:
              </Text>
              <Text>
                Visit{' '}
                <Link href="https://ks3ckc.radio" isExternal>
                  ks3ckc.radio
                </Link>{' '}
                for more information about our club.
              </Text>
            </Stack>
            <Alert colorScheme="brand">
              <AlertIcon />
              <AlertTitle>Need help?</AlertTitle>
              <AlertDescription pb={2}>
                <Stack>
                  <Text>
                    Have questions about amateur radio or want to get involved with KS3CKC?{' '}
                    <Link href="https://ks3ckc.radio" isExternal>
                      Visit our website
                    </Link>
                    {' '}or contact us!
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      as="a"
                      href="https://ks3ckc.radio"
                      size="sm"
                      variant="@primary"
                    >
                      Visit Website
                    </Button>
                    <span>ks3ckc.radio</span>
                  </HStack>
                </Stack>
              </AlertDescription>
            </Alert>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
