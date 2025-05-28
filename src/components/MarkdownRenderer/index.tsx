import React from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

export interface MarkdownRendererProps extends BoxProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  ...boxProps
}) => {
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
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return (
      <Box
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: processedMarkdown }}
        sx={{
          '& h1': {
            fontSize: '2xl',
            fontWeight: 'bold',
            marginBottom: '1rem',
            marginTop: '1.5rem',
          },
          '& h2': {
            fontSize: 'xl',
            fontWeight: 'semibold',
            marginBottom: '0.75rem',
            marginTop: '1.25rem',
          },
          '& h3': {
            fontSize: 'lg',
            fontWeight: 'semibold',
            marginBottom: '0.5rem',
            marginTop: '1rem',
          },
          '& strong': {
            fontWeight: 'bold',
          },
          '& em': {
            fontStyle: 'italic',
          },
          '& a': {
            color: 'blue.500',
            textDecoration: 'underline',
            _hover: {
              color: 'blue.600',
            },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            marginY: '1rem',
            borderRadius: 'md',
          },
          '& li': {
            marginLeft: '1.5rem',
            listStyleType: 'disc',
            marginBottom: '0.25rem',
          },
        }}
        {...boxProps}
      />
    );
  };

  return renderMarkdown(content);
};