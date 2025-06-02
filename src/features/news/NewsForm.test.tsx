import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewsForm } from './NewsForm';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Stack: ({ children, ...props }: any) => <div data-testid="stack" {...props}>{children}</div>,
}));

// Mock form components
jest.mock('@/components/FieldInput', () => ({
  FieldInput: ({ name, label, ...props }: any) => (
    <input data-testid={`field-${name}`} placeholder={label} {...props} />
  ),
}));

jest.mock('@/components/FieldTextarea', () => ({
  FieldTextarea: ({ name, label, ...props }: any) => (
    <textarea data-testid={`field-${name}`} placeholder={label} {...props} />
  ),
}));

describe('NewsForm', () => {
  it('renders form fields correctly', () => {
    render(<NewsForm />);
    
    expect(screen.getByTestId('stack')).toBeInTheDocument();
    expect(screen.getByTestId('field-title')).toBeInTheDocument();
    expect(screen.getByTestId('field-content')).toBeInTheDocument();
  });

  it('renders title input with correct props', () => {
    render(<NewsForm />);
    
    const titleInput = screen.getByTestId('field-title');
    expect(titleInput).toHaveAttribute('placeholder', 'Title');
  });

  it('renders content textarea with correct props', () => {
    render(<NewsForm />);
    
    const contentTextarea = screen.getByTestId('field-content');
    expect(contentTextarea).toHaveAttribute('placeholder', 'Content');
  });
});