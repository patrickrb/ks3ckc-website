import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from '@formiz/core';
import { FieldTextarea } from './index';

// Mock Formiz hook
const mockField = {
  id: 'test-textarea',
  value: '',
  setValue: jest.fn(),
  setIsTouched: jest.fn(),
  errorMessage: '',
  shouldDisplayError: false,
  isRequired: false,
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

// Mock Chakra UI Textarea
jest.mock('@chakra-ui/react', () => ({
  Textarea: ({ onChange, onFocus, onBlur, ...props }: any) => (
    <textarea
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      data-testid="field-textarea"
      {...props}
    />
  ),
}));

const mockUseField = useField as jest.MockedFunction<typeof useField>;

describe('FieldTextarea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseField.mockReturnValue(mockField);
  });

  it('renders basic textarea field', () => {
    render(<FieldTextarea name="test" />);
    
    expect(screen.getByTestId('field-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
  });

  it('displays field value', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'test textarea content',
    });

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    expect(textarea).toHaveValue('test textarea content');
  });

  it('handles value changes', () => {
    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    fireEvent.change(textarea, { target: { value: 'new content' } });
    
    expect(mockField.setValue).toHaveBeenCalledWith('new content');
  });

  it('handles focus events', () => {
    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    fireEvent.focus(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
  });

  it('handles blur events', () => {
    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    fireEvent.blur(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
  });

  it('passes placeholder to textarea', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        placeholder: 'Enter your text here',
      },
    });

    render(<FieldTextarea name="test" placeholder="Enter your text here" />);
    
    const textarea = screen.getByTestId('field-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter your text here');
  });

  it('handles empty value gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: null,
    });

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    expect(textarea).toHaveValue('');
  });

  it('passes through textareaProps', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: {
          'data-testid': 'custom-textarea',
          rows: 5,
        },
      },
    });

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('custom-textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '5');
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

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    fireEvent.change(textarea, { target: { value: 'test' } });
    
    expect(mockField.setValue).toHaveBeenCalledWith('test');
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

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
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

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    fireEvent.blur(textarea);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
    expect(customOnBlur).toHaveBeenCalled();
  });

  it('passes form group props correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      errorMessage: 'Field is required',
      shouldDisplayError: true,
      isRequired: true,
    });

    render(<FieldTextarea name="test" label="Test Textarea" />);
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-id', 'test-textarea');
    expect(formGroup).toHaveAttribute('data-is-required', 'true');
    expect(formGroup).toHaveAttribute('data-error-message', 'Field is required');
    expect(formGroup).toHaveAttribute('data-show-error', 'true');
  });

  it('renders children when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        children: <div data-testid="textarea-children">Help text</div>,
      },
    });

    render(
      <FieldTextarea name="test">
        <div data-testid="textarea-children">Help text</div>
      </FieldTextarea>
    );
    
    expect(screen.getByTestId('textarea-children')).toBeInTheDocument();
  });

  it('handles undefined textareaProps gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        textareaProps: undefined,
      },
    });

    expect(() => render(<FieldTextarea name="test" />)).not.toThrow();
    expect(screen.getByTestId('field-textarea')).toBeInTheDocument();
  });

  it('maintains textarea ID consistency', () => {
    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    const formGroup = screen.getByTestId('form-group');
    
    expect(textarea).toHaveAttribute('id', 'test-textarea');
    expect(formGroup).toHaveAttribute('data-id', 'test-textarea');
  });

  it('handles multiline content correctly', () => {
    const multilineContent = 'Line 1\nLine 2\nLine 3';
    mockUseField.mockReturnValue({
      ...mockField,
      value: multilineContent,
    });

    render(<FieldTextarea name="test" />);
    
    const textarea = screen.getByTestId('field-textarea');
    expect(textarea).toHaveValue(multilineContent);
  });
});