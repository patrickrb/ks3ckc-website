import React, { ReactNode } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Import BlogForm after mocking
import { BlogForm } from './BlogForm';

// Mock the Formiz module
jest.mock('@formiz/core', () => ({
  Formiz: ({ children }: { children: ReactNode }) => children,
  useForm: jest.fn(),
  useField: jest.fn(() => ({
    id: 'test-id',
    value: '',
    setValue: jest.fn(),
    setIsTouched: jest.fn(),
    isValid: true,
    isSubmitted: false,
    isPristine: true,
    isRequired: false,
    errorMessage: '',
    shouldDisplayError: false,
    otherProps: {
      label: 'Test Label',
    },
  })),
}));

// Mock the FormGroup component from @/components/FormGroup
jest.mock('@/components/FormGroup', () => ({
  FormGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

// Mock the FieldInput component
jest.mock('@/components/FieldInput', () => ({
  FieldInput: () => (
    <div>
      <label htmlFor="title">Title</label>
      <input aria-label="Title" />
    </div>
  ),
}));

// Mock the FieldImageUpload component
jest.mock('@/components/FieldImageUpload', () => ({
  FieldImageUpload: () => (
    <div>
      <label htmlFor="featuredImage">Featured Image</label>
      <input aria-label="Featured Image" type="file" />
    </div>
  ),
}));

// Mock the FieldMarkdown component
jest.mock('@/components/FieldMarkdown', () => ({
  FieldMarkdown: () => (
    <div>
      <label htmlFor="content">Content (Markdown)</label>
      <textarea aria-label="Content (Markdown)" />
    </div>
  ),
}));

// Mock the FieldTags component
jest.mock('@/components/FieldTags', () => ({
  FieldTags: () => (
    <div>
      <label htmlFor="tags">Tags</label>
      <input aria-label="Tags" />
    </div>
  ),
}));

describe('BlogForm', () => {
  it('renders the blog form with title, image, tags, and content fields', () => {
    render(<BlogForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/featured image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });
});
