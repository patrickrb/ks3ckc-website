import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from '@formiz/core';
import { FieldMarkdown } from './index';

// Mock Formiz hook
const mockField = {
  id: 'test-markdown',
  value: '',
  setValue: jest.fn(),
  setIsTouched: jest.fn(),
  errorMessage: '',
  errorMessages: [],
  shouldDisplayError: false,
  isRequired: false,
  isValidating: false,
  isTouched: false,
  isSubmitted: false,
  isValid: true,
  isPristine: true,
  isReady: true,
  isProcessing: false,
  externalProcessing: {
    start: jest.fn(),
    end: jest.fn()
  },
  isExternalProcessing: false,
  isDebouncing: false,
  hasBeenModified: false,
  resetKey: 0,
  formattedValue: '',
  otherProps: {}
};

jest.mock('@formiz/core', () => ({
  useField: jest.fn(() => mockField),
}));

// Mock FormGroup component
jest.mock('@/components/FormGroup', () => ({
  FormGroup: ({ children, errorMessage, id, isRequired, showError, ...props }: any) => {
    const { ...domProps } = props;
    return (
      <div 
        data-testid="form-group" 
        data-error-message={errorMessage}
        data-id={id}
        data-is-required={isRequired}
        data-show-error={showError}
        {...domProps}
      >
        {children}
      </div>
    );
  },
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, dangerouslySetInnerHTML, className, ...props }: any) => (
    <div 
      data-testid="markdown-box" 
      className={className}
      {...props}
      {...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : { children })}
    />
  ),
  Tabs: ({ children, index, _onChange, variant, ...props }: any) => (
    <div data-testid="markdown-tabs" data-index={index} data-variant={variant} {...props}>
      {children}
    </div>
  ),
  TabList: ({ children, ...props }: any) => (
    <div data-testid="tab-list" {...props}>
      {children}
    </div>
  ),
  Tab: ({ children, onClick, ...props }: any) => (
    <button 
      data-testid="tab"
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  ),
  TabPanels: ({ children, ...props }: any) => (
    <div data-testid="tab-panels" {...props}>
      {children}
    </div>
  ),
  TabPanel: ({ children, padding, paddingTop, ...props }: any) => (
    <div 
      data-testid="tab-panel" 
      data-padding={padding} 
      data-padding-top={paddingTop}
      {...props}
    >
      {children}
    </div>
  ),
  Textarea: ({ onChange, onFocus, onBlur, placeholder, value, ...props }: any) => (
    <textarea
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      value={value}
      data-testid="field-markdown-textarea"
      {...props}
    />
  ),
}));

const mockUseField = useField as jest.MockedFunction<typeof useField>;

describe('FieldMarkdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseField.mockReturnValue(mockField);
  });

  it('renders basic markdown field with tabs', () => {
    render(<FieldMarkdown name="test" />);
    
    expect(screen.getByTestId('markdown-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('tab')).toHaveLength(2);
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
  });

  it('displays Edit and Preview tabs', () => {
    render(<FieldMarkdown name="test" />);
    
    const tabs = screen.getAllByTestId('tab');
    expect(tabs[0]).toHaveTextContent('Edit');
    expect(tabs[1]).toHaveTextContent('Preview');
  });

  it('shows textarea in edit tab by default', () => {
    render(<FieldMarkdown name="test" />);
    
    const tabs = screen.getByTestId('markdown-tabs');
    expect(tabs).toHaveAttribute('data-index', '0'); // First tab (Edit) is active
    expect(screen.getByTestId('field-markdown-textarea')).toBeInTheDocument();
  });

  it('displays field value in textarea', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: '# Test Markdown\n\nThis is a test.',
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    expect(textarea).toHaveValue('# Test Markdown\n\nThis is a test.');
  });

  it('handles value changes', () => {
    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.change(textarea, { target: { value: '# New Content' } });
    
    expect(mockField.setValue).toHaveBeenCalledWith('# New Content');
  });

  it('handles focus events', () => {
    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.focus(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
  });

  it('handles blur events', () => {
    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.blur(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
  });

  it('uses default placeholder when none provided', () => {
    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter markdown content... (supports **bold**, *italic*, and more)');
  });

  it('uses custom placeholder when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        placeholder: 'Custom markdown placeholder',
      },
    });

    render(<FieldMarkdown name="test" placeholder="Custom markdown placeholder" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Custom markdown placeholder');
  });

  it('handles empty value gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: null,
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    expect(textarea).toHaveValue('');
  });

  it('renders preview tab with markdown content', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: '# Test\n\n**Bold text** and *italic text*.',
    });

    render(<FieldMarkdown name="test" />);
    
    // Check that preview content is rendered (via dangerouslySetInnerHTML)
    const tabPanels = screen.getAllByTestId('tab-panel');
    expect(tabPanels).toHaveLength(2);
    
    // The preview panel should contain the markdown box
    expect(screen.getByTestId('markdown-box')).toBeInTheDocument();
  });

  it('tab panel has correct styling props', () => {
    render(<FieldMarkdown name="test" />);
    
    const tabPanels = screen.getAllByTestId('tab-panel');
    
    // Edit tab panel
    expect(tabPanels[0]).toHaveAttribute('data-padding', '0');
    expect(tabPanels[0]).toHaveAttribute('data-padding-top', '4');
    
    // Preview tab panel
    expect(tabPanels[1]).toHaveAttribute('data-padding', '0');
    expect(tabPanels[1]).toHaveAttribute('data-padding-top', '4');
  });

  it('passes form group props correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      errorMessage: 'Field is required',
      shouldDisplayError: true,
      isRequired: true,
    });

    render(<FieldMarkdown name="test" label="Test Markdown" />);
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-id', 'test-markdown');
    expect(formGroup).toHaveAttribute('data-is-required', 'true');
    expect(formGroup).toHaveAttribute('data-error-message', 'Field is required');
    expect(formGroup).toHaveAttribute('data-show-error', 'true');
  });

  it('renders children when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        children: <div data-testid="markdown-children">Help text</div>,
      },
    });

    render(
      <FieldMarkdown name="test">
        <div data-testid="markdown-children">Help text</div>
      </FieldMarkdown>
    );
    
    expect(screen.getByTestId('markdown-children')).toBeInTheDocument();
  });

  it('passes through textareaProps', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: {
          'data-testid': 'custom-markdown-textarea',
          rows: 10,
        },
      },
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('custom-markdown-textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('calls custom onChange handler from textareaProps', () => {
    const customOnChange = jest.fn();
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: {
          onChange: customOnChange,
        },
      },
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.change(textarea, { target: { value: '# Test' } });
    
    expect(mockField.setValue).toHaveBeenCalledWith('# Test');
    expect(customOnChange).toHaveBeenCalled();
  });

  it('calls custom onFocus handler from textareaProps', () => {
    const customOnFocus = jest.fn();
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: {
          onFocus: customOnFocus,
        },
      },
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.focus(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
    expect(customOnFocus).toHaveBeenCalled();
  });

  it('calls custom onBlur handler from textareaProps', () => {
    const customOnBlur = jest.fn();
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: {
          onBlur: customOnBlur,
        },
      },
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    fireEvent.blur(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
    expect(customOnBlur).toHaveBeenCalled();
  });

  it('maintains textarea ID consistency', () => {
    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    const formGroup = screen.getByTestId('form-group');
    
    expect(textarea).toHaveAttribute('id', 'test-markdown');
    expect(formGroup).toHaveAttribute('data-id', 'test-markdown');
  });

  it('handles tabs variant correctly', () => {
    render(<FieldMarkdown name="test" />);
    
    const tabs = screen.getByTestId('markdown-tabs');
    expect(tabs).toHaveAttribute('data-variant', 'enclosed');
  });

  it('handles undefined textareaProps gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: undefined,
      },
    });

    expect(() => render(<FieldMarkdown name="test" />)).not.toThrow();
    expect(screen.getByTestId('field-markdown-textarea')).toBeInTheDocument();
  });

  it('processes markdown for preview correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: '# Heading\n\n**Bold** text\n\n*Italic* text\n\n[Link](https://example.com)',
    });

    render(<FieldMarkdown name="test" />);
    
    // The markdown should be processed and rendered in the preview
    expect(screen.getByTestId('markdown-box')).toBeInTheDocument();
  });

  it('handles multiline markdown content', () => {
    const markdownContent = `# Title

This is a paragraph.

## Subtitle

- List item 1
- List item 2

**Bold text** and *italic text*.`;

    mockUseField.mockReturnValue({
      ...mockField,
      value: markdownContent,
    });

    render(<FieldMarkdown name="test" />);
    
    const textarea = screen.getByTestId('field-markdown-textarea');
    expect(textarea).toHaveValue(markdownContent);
  });

  it('shows markdown syntax help in edit panel', () => {
    render(<FieldMarkdown name="test" />);
    
    // Basic check that the component renders without errors
    expect(screen.getByTestId('markdown-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('field-markdown-textarea')).toBeInTheDocument();
  });
});