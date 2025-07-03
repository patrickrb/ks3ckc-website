import React, { useRef, useState } from 'react';

import {
  Box,
  Button,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  TextareaProps,
  useToast,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';
import { trpc } from '@/lib/trpc/client';

type Value = TextareaProps['value'];

type UsualTextareaProps = 'placeholder';

export type FieldMarkdownProps<FormattedValue = Value> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps &
  Pick<TextareaProps, UsualTextareaProps> & {
    textareaProps?: Omit<TextareaProps, UsualTextareaProps>;
    blogId?: string;
  };

export const FieldMarkdown = <FormattedValue = Value,>(
  props: FieldMarkdownProps<FormattedValue>
) => {
  const field = useField(props);
  const [tabIndex, setTabIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState<any>(null);
  const [showAlignmentMenu, setShowAlignmentMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

  const { textareaProps, children, placeholder, blogId, ...rest } =
    field.otherProps;

  const uploadImage = trpc.blogImages.upload.useMutation();

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  } satisfies FormGroupProps;

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleFileUpload = async (file: File) => {
    if (!blogId) {
      toast({
        title: 'Error',
        description: 'Blog ID is required for image upload',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]!;

        const result = await uploadImage.mutateAsync({
          blogId,
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64Data,
          },
        });

        // Show alignment menu for uploaded image
        showImageAlignmentMenu(result);

        toast({
          title: 'Success',
          description: 'Image uploaded successfully. Choose alignment.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0 && imageFiles[0]) {
      handleFileUpload(imageFiles[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));

    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        handleFileUpload(file);
      }
    }
  };

  const showImageAlignmentMenu = (imageResult: any) => {
    setPendingImage(imageResult);
    setShowAlignmentMenu(true);
    setIsUploading(false);
  };

  const insertImageWithAlignment = (alignment: 'none' | 'left' | 'right') => {
    if (!pendingImage || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = field.value?.toString() || '';

    let imageMarkdown;
    switch (alignment) {
      case 'left':
        imageMarkdown = `![${pendingImage.originalName}](${pendingImage.blobUrl} "align-left")`;
        break;
      case 'right':
        imageMarkdown = `![${pendingImage.originalName}](${pendingImage.blobUrl} "align-right")`;
        break;
      default:
        imageMarkdown = `![${pendingImage.originalName}](${pendingImage.blobUrl})`;
    }

    const newValue =
      currentValue.slice(0, start) + imageMarkdown + currentValue.slice(end);

    field.setValue(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + imageMarkdown.length,
        start + imageMarkdown.length
      );
    }, 0);

    setShowAlignmentMenu(false);
    setPendingImage(null);

    toast({
      title: 'Success',
      description: 'Image inserted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // A simple markdown renderer
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null;

    const processedMarkdown = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // Images with alignment
      .replace(
        /!\[(.*?)\]\((.*?)\s+"align-left"\)/gim,
        '<img alt="$1" src="$2" style="float: left; margin: 0 1rem 1rem 0; max-width: 300px; height: auto;" />'
      )
      .replace(
        /!\[(.*?)\]\((.*?)\s+"align-right"\)/gim,
        '<img alt="$1" src="$2" style="float: right; margin: 0 0 1rem 1rem; max-width: 300px; height: auto;" />'
      )
      // Regular images (no alignment)
      .replace(
        /!\[(.*?)\]\((.*?)\)/gim,
        '<img alt="$1" src="$2" style="max-width: 100%; height: auto; display: block; margin: 1rem auto;" />'
      )
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return (
      <Box
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: processedMarkdown }}
      />
    );
  };

  return (
    <FormGroup {...formGroupProps}>
      <Tabs variant="enclosed" index={tabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Edit</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding={0} paddingTop={4}>
            <Textarea
              {...textareaProps}
              ref={textareaRef}
              placeholder={
                placeholder ||
                'Enter markdown content... (supports **bold**, *italic*, and more)\n\nDrop or paste images to upload them!'
              }
              id={field.id}
              value={field.value ?? ''}
              onChange={(e) => {
                field.setValue(e.target.value);
                textareaProps?.onChange?.(e);
              }}
              onFocus={(e) => {
                field.setIsTouched(false);
                textareaProps?.onFocus?.(e);
              }}
              onBlur={(e) => {
                field.setIsTouched(true);
                textareaProps?.onBlur?.(e);
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onPaste={handlePaste}
              minHeight="400px"
              fontFamily="mono"
              opacity={isUploading ? 0.6 : 1}
              cursor={isUploading ? 'wait' : 'text'}
            />
            {tabIndex === 0 && (
              <div
                className="markdown-help"
                style={{ marginTop: '8px', fontSize: '0.8rem' }}
              >
                <p>Markdown syntax:</p>
                <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                  <li>
                    <code>**bold**</code> for <strong>bold</strong>
                  </li>
                  <li>
                    <code>*italic*</code> for <em>italic</em>
                  </li>
                  <li>
                    <code>[link](https://example.com)</code> for links
                  </li>
                  <li>
                    <code>![image alt](image-url.jpg)</code> for images
                  </li>
                  <li>
                    <code>![image alt](url "align-left")</code> for left-aligned
                    images
                  </li>
                  <li>
                    <code>![image alt](url "align-right")</code> for
                    right-aligned images
                  </li>
                  <li>
                    <strong>Drag & drop</strong> or <strong>paste</strong>{' '}
                    images to upload
                  </li>
                  <li>
                    <code># Heading</code> for headings (# to #####)
                  </li>
                  <li>
                    <code>- item</code> for bullet lists
                  </li>
                </ul>
              </div>
            )}
          </TabPanel>
          <TabPanel padding={0} paddingTop={4}>
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              minHeight="400px"
              bg="white"
              color="gray.800"
              sx={{
                '& img[style*="float"]': {
                  '&:after': {
                    content: '""',
                    display: 'table',
                    clear: 'both',
                  },
                },
                '& p': {
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                },
                // Clear floats after content
                '&:after': {
                  content: '""',
                  display: 'table',
                  clear: 'both',
                },
              }}
            >
              {renderMarkdown(field.value?.toString() || '')}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      {children}

      {/* Image Alignment Menu */}
      {showAlignmentMenu && pendingImage && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          boxShadow="xl"
          borderRadius="md"
          p={6}
          zIndex={1000}
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Choose image alignment
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            {pendingImage.originalName}
          </Text>
          <HStack spacing={3}>
            <Button
              onClick={() => insertImageWithAlignment('left')}
              colorScheme="blue"
              variant="outline"
            >
              Float Left
            </Button>
            <Button
              onClick={() => insertImageWithAlignment('right')}
              colorScheme="blue"
              variant="outline"
            >
              Float Right
            </Button>
            <Button
              onClick={() => insertImageWithAlignment('none')}
              colorScheme="blue"
              variant="outline"
            >
              Center
            </Button>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            mt={3}
            onClick={() => {
              setShowAlignmentMenu(false);
              setPendingImage(null);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}

      {/* Overlay for alignment menu */}
      {showAlignmentMenu && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          zIndex={999}
          onClick={() => {
            setShowAlignmentMenu(false);
            setPendingImage(null);
          }}
        />
      )}
    </FormGroup>
  );
};
