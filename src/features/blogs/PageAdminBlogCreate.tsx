import React, { useState } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';

import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc/client';

// Dynamically import React Quill for WYSIWYG editing
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function PageAdminBlogCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { account } = useAuth();
  const createBlog = trpc.blogs.create.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!account) throw new Error('No authenticated user.');
      await createBlog.mutateAsync({
        title,
        content,
        author: {
          id: account.id,
          name: account.name ?? '',
          email: account.email,
          authorizations: account.authorizations,
          language: account.language,
          callsign: account.callsign ?? null,
          dmrid: account.dmrid ?? null,
          isPubliclyVisible: account.isPubliclyVisible ?? false,
          notes: account.notes ?? null,
          accountStatus: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          image: null,
          lastLoginAt: null,
        },
      });
      toast({ title: 'Blog created', status: 'success' });
      router.push('/admin/management/blogs');
    } catch (err: any) {
      toast({
        title: 'Error creating blog',
        description: err.message,
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="2xl" mx="auto" py={8}>
      <Heading mb={6}>Create Blog</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Blog Title</FormLabel>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter blog title"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Blog Content</FormLabel>
            <ReactQuill
              value={content}
              onChange={setContent as any}
              theme="snow"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Create Blog
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
