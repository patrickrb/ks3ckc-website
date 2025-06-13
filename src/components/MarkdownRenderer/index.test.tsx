import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { MarkdownRenderer } from './index';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe('MarkdownRenderer', () => {
  it('renders markdown content with headers', () => {
    const content = '# Heading 1\n## Heading 2\n### Heading 3';
    render(<MarkdownRenderer content={content} />);

    const container = screen
      .getByText('Heading 1')
      .closest('.markdown-content');
    expect(container?.innerHTML).toContain('<h1>Heading 1</h1>');
    expect(container?.innerHTML).toContain('<h2>Heading 2</h2>');
    expect(container?.innerHTML).toContain('<h3>Heading 3</h3>');
  });

  it('renders markdown content with formatting', () => {
    const content = 'This is **bold** and this is *italic*.';
    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');
    expect(container?.innerHTML).toContain('<strong>bold</strong>');
    expect(container?.innerHTML).toContain('<em>italic</em>');
  });

  it('renders markdown content with links', () => {
    const content = 'Check out [this link](https://example.com).';
    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');
    expect(container?.innerHTML).toContain(
      '<a href="https://example.com">this link</a>'
    );
  });

  it('renders markdown content with images', () => {
    const content = '![Alt text](https://example.com/image.jpg)';
    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');
    expect(container?.innerHTML).toContain(
      '<img alt="Alt text" src="https://example.com/image.jpg">'
    );
  });

  it('renders markdown content with lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');
    expect(container?.innerHTML).toContain('<ul>');
    expect(container?.innerHTML).toContain('<li>Item 1</li>');
    expect(container?.innerHTML).toContain('<li>Item 2</li>');
    expect(container?.innerHTML).toContain('<li>Item 3</li>');
  });

  it('renders markdown content with paragraphs', () => {
    const content = 'First paragraph.\n\nSecond paragraph.';
    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');
    expect(container?.innerHTML).toContain('<p>First paragraph.</p>');
    expect(container?.innerHTML).toContain('<p>Second paragraph.</p>');
  });

  it('handles empty content', () => {
    render(<MarkdownRenderer content="" />);

    // Should render nothing when content is empty
    expect(document.querySelector('.markdown-content')).not.toBeInTheDocument();
  });

  it('renders complex markdown content', () => {
    const content = `# Main Title

This is a paragraph with **bold** and *italic* text.

## Subheading

Here's a list:
- First item
- Second item

And here's a [link](https://example.com).

![Sample Image](https://example.com/sample.jpg)`;

    render(<MarkdownRenderer content={content} />);

    const container = document.querySelector('.markdown-content');

    // Check for various elements
    expect(container?.innerHTML).toContain('<h1>Main Title</h1>');
    expect(container?.innerHTML).toContain('<h2>Subheading</h2>');
    expect(container?.innerHTML).toContain('<strong>bold</strong>');
    expect(container?.innerHTML).toContain('<em>italic</em>');
    expect(container?.innerHTML).toContain('<ul>');
    expect(container?.innerHTML).toContain('<li>First item</li>');
    expect(container?.innerHTML).toContain(
      '<a href="https://example.com">link</a>'
    );
    expect(container?.innerHTML).toContain(
      '<img alt="Sample Image" src="https://example.com/sample.jpg">'
    );
  });
});
