import React from 'react';

import { CopyIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { trpc } from '@/lib/trpc/client';

interface BlogImageManagerProps {
  blogId: string;
}

interface BlogImage {
  id: string;
  filename: string;
  originalName: string;
  blobUrl: string;
  blobName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

export const BlogImageManager: React.FC<BlogImageManagerProps> = ({
  blogId,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = React.useState<BlogImage | null>(
    null
  );
  const [imageToDelete, setImageToDelete] = React.useState<BlogImage | null>(
    null
  );
  const deleteAlertRef = React.useRef<HTMLButtonElement>(null);

  const { data: images = [], refetch } = trpc.blogImages.getByBlogId.useQuery({
    blogId,
  });
  const deleteImage = trpc.blogImages.delete.useMutation();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyImageMarkdown = (image: BlogImage) => {
    const markdown = `![${image.originalName}](${image.blobUrl})`;
    navigator.clipboard.writeText(markdown);
    toast({
      title: 'Copied to clipboard',
      description: 'Image markdown copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const openImageInNewTab = (image: BlogImage) => {
    window.open(image.blobUrl, '_blank');
  };

  const handleDeleteImage = async (image: BlogImage) => {
    try {
      await deleteImage.mutateAsync({ imageId: image.id });
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetch();
      setImageToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteAlert = (image: BlogImage) => {
    setImageToDelete(image);
  };

  const closeDeleteAlert = () => {
    setImageToDelete(null);
  };

  const viewImage = (image: BlogImage) => {
    setSelectedImage(image);
    onOpen();
  };

  if (images.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">No images uploaded yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="md" fontWeight="semibold" mb={4}>
        Blog Images ({images.length})
      </Text>

      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
        {images.map((image) => (
          <GridItem key={image.id}>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={3}
              _hover={{ borderColor: 'blue.300' }}
              transition="border-color 0.2s"
            >
              <VStack spacing={2} align="stretch">
                <Box
                  position="relative"
                  cursor="pointer"
                  onClick={() => viewImage(image)}
                >
                  <Image
                    src={image.blobUrl}
                    alt={image.originalName}
                    maxH="120px"
                    objectFit="cover"
                    borderRadius="md"
                    w="100%"
                  />
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    left={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ExternalLinkIcon color="white" boxSize={6} />
                  </Box>
                </Box>

                <VStack spacing={1} align="stretch">
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {image.originalName}
                  </Text>
                  <HStack justify="space-between">
                    <Badge colorScheme="blue" fontSize="xs">
                      {formatFileSize(image.size)}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>

                <HStack justify="space-between">
                  <Tooltip label="Copy markdown">
                    <IconButton
                      icon={<CopyIcon />}
                      size="sm"
                      variant="outline"
                      onClick={() => copyImageMarkdown(image)}
                      aria-label="Copy markdown"
                    />
                  </Tooltip>
                  <Tooltip label="View image">
                    <IconButton
                      icon={<ExternalLinkIcon />}
                      size="sm"
                      variant="outline"
                      onClick={() => openImageInNewTab(image)}
                      aria-label="View image"
                    />
                  </Tooltip>
                  <Tooltip label="Delete image">
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => openDeleteAlert(image)}
                      aria-label="Delete image"
                    />
                  </Tooltip>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Image Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedImage?.originalName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <VStack spacing={4}>
                <Image
                  src={selectedImage.blobUrl}
                  alt={selectedImage.originalName}
                  maxH="400px"
                  objectFit="contain"
                />
                <HStack justify="space-between" w="100%">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.600">
                      Size: {formatFileSize(selectedImage.size)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Type: {selectedImage.mimeType}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Uploaded:{' '}
                      {new Date(selectedImage.createdAt).toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<CopyIcon />}
              onClick={() => selectedImage && copyImageMarkdown(selectedImage)}
              mr={3}
            >
              Copy Markdown
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={!!imageToDelete}
        leastDestructiveRef={deleteAlertRef}
        onClose={closeDeleteAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Image
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{imageToDelete?.originalName}"?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteAlertRef} onClick={closeDeleteAlert}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() =>
                  imageToDelete && handleDeleteImage(imageToDelete)
                }
                ml={3}
                isLoading={deleteImage.isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
