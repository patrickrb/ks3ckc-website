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
      // Images with alignment (must come before regular images)
      .replace(
        /!\[(.*?)\]\((.*?)\s+"align-left"\)/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="image-link float-left"><img alt="$1" src="$2" class="float-left" /></a>'
      )
      .replace(
        /!\[(.*?)\]\((.*?)\s+"align-right"\)/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="image-link float-right"><img alt="$1" src="$2" class="float-right" /></a>'
      )
      // Regular images (must come after aligned images)
      .replace(
        /!\[(.*?)\]\((.*?)\)/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="image-link"><img alt="$1" src="$2" /></a>'
      )
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // Lists (wrap in ul tags)
      .replace(/(^- .*$\n?)+/gim, (match) => {
        const listItems = match.replace(/^- (.*$)/gim, '<li>$1</li>');
        return `<ul>${listItems}</ul>`;
      })
      // Paragraphs (wrap non-empty lines that aren't headers, lists, or HTML in p tags)
      .split('\n\n')
      .map((paragraph) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<')) return trimmed; // Already HTML
        if (trimmed.startsWith('#')) return trimmed; // Header
        if (trimmed.startsWith('-')) return trimmed; // List
        return `<p>${trimmed}</p>`;
      })
      .join('\n')
      // Line breaks within paragraphs
      .replace(/\n(?!<)/g, '<br />');

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
            lineHeight: '1.2',
          },
          '& h2': {
            fontSize: 'xl',
            fontWeight: 'semibold',
            marginBottom: '0.75rem',
            marginTop: '1.25rem',
            lineHeight: '1.3',
          },
          '& h3': {
            fontSize: 'lg',
            fontWeight: 'semibold',
            marginBottom: '0.5rem',
            marginTop: '1rem',
            lineHeight: '1.4',
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
          '& a.image-link': {
            textDecoration: 'none',
            cursor: 'pointer',
            _hover: {
              opacity: 0.8,
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease',
            },
          },
          '& a.image-link.float-left': {
            float: 'left',
            margin: '0 1rem 1rem 0',
            maxWidth: { base: '150px', sm: '200px', md: '300px' },
          },
          '& a.image-link.float-right': {
            float: 'right',
            margin: '0 0 1rem 1rem',
            maxWidth: { base: '150px', sm: '200px', md: '300px' },
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            marginY: '1rem',
            borderRadius: 'md',
            boxShadow: 'sm',
          },
          '& img.float-left': {
            maxWidth: { base: '150px', sm: '200px', md: '300px' },
            height: 'auto',
            borderRadius: 'md',
            boxShadow: 'sm',
          },
          '& img.float-right': {
            maxWidth: { base: '150px', sm: '200px', md: '300px' },
            height: 'auto',
            borderRadius: 'md',
            boxShadow: 'sm',
          },
          '& li': {
            marginLeft: '1.5rem',
            listStyleType: 'disc',
            marginBottom: '0.25rem',
          },
          '& ul': {
            marginY: '1rem',
          },
          '& p': {
            marginBottom: '1rem',
            lineHeight: '1.6',
          },
          // Clear floats after content
          '&:after': {
            content: '""',
            display: 'table',
            clear: 'both',
          },
        }}
        {...boxProps}
      />
    );
  };

  return renderMarkdown(content);
};
