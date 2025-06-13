import React from 'react';

import { useField } from '@formiz/core';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { FieldImageUpload } from './index';

// Mock Formiz hook
const mockField = {
  id: 'test-image-upload',
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
    end: jest.fn(),
  },
  isExternalProcessing: false,
  isDebouncing: false,
  hasBeenModified: false,
  resetKey: 0,
  formattedValue: '',
  otherProps: {},
};

jest.mock('@formiz/core', () => ({
  useField: jest.fn(() => mockField),
}));

// Mock FormGroup component
jest.mock('@/components/FormGroup', () => ({
  FormGroup: ({
    children,
    errorMessage,
    id,
    isRequired,
    showError,
    ...props
  }: any) => {
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
  Box: ({ children, ...props }: any) => (
    <div data-testid="image-upload-box" {...props}>
      {children}
    </div>
  ),
  Button: ({
    children,
    onClick,
    variant,
    colorScheme,
    size,
    mr,
    ...props
  }: any) => (
    <button
      data-testid="image-upload-button"
      data-variant={variant}
      data-color-scheme={colorScheme}
      data-size={size}
      data-mr={mr}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Flex: ({ children, direction, alignItems, mt, ...props }: any) => (
    <div
      data-testid="image-upload-flex"
      data-direction={direction}
      data-align-items={alignItems}
      data-mt={mt}
      {...props}
    >
      {children}
    </div>
  ),
  Image: ({ src, alt, maxHeight, borderRadius, ...props }: any) => (
    <div
      data-testid="image-preview"
      data-src={src}
      data-alt={alt}
      data-max-height={maxHeight}
      data-border-radius={borderRadius}
      {...props}
    />
  ),
  Input: ({
    type,
    accept,
    onChange,
    onFocus,
    onBlur,
    display,
    ref,
    ...props
  }: any) => (
    <input
      type={type}
      accept={accept}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      data-testid="file-input"
      data-display={display}
      ref={ref}
      {...props}
    />
  ),
  Text: ({ children, fontSize, color, mt, ...props }: any) => (
    <span
      data-testid="image-upload-text"
      data-font-size={fontSize}
      data-color={color}
      data-mt={mt}
      {...props}
    >
      {children}
    </span>
  ),
}));

const mockUseField = useField as jest.MockedFunction<typeof useField>;

// Mock FileReader
const mockFileReader = {
  readAsDataURL: jest.fn(),
  result: null as string | null,
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
};

global.FileReader = jest.fn(
  () => mockFileReader
) as unknown as typeof FileReader;

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;

describe('FieldImageUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseField.mockReturnValue(mockField);
    mockFileReader.readAsDataURL.mockClear();
    mockCreateObjectURL.mockClear();
  });

  it('renders basic image upload field', () => {
    render(<FieldImageUpload name="test" />);

    expect(screen.getByTestId('image-upload-box')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
  });

  it('renders select button when no image is uploaded', () => {
    render(<FieldImageUpload name="test" />);

    const button = screen.getByTestId('image-upload-button');
    expect(button).toHaveTextContent('Select Image');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('renders change button when image is uploaded', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    });

    render(<FieldImageUpload name="test" />);

    const button = screen.getByTestId('image-upload-button');
    expect(button).toHaveTextContent('Change Image');
  });

  it('displays image preview when value is set', () => {
    const imageDataUrl =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';
    mockUseField.mockReturnValue({
      ...mockField,
      value: imageDataUrl,
    });

    render(<FieldImageUpload name="test" />);

    const preview = screen.getByTestId('image-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', imageDataUrl);
    expect(preview).toHaveAttribute('alt', 'Blog preview image');
    expect(preview).toHaveAttribute('data-max-height', '200px');
    expect(preview).toHaveAttribute('data-border-radius', 'md');
  });

  it('renders remove button when image is uploaded', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    });

    render(<FieldImageUpload name="test" />);

    const buttons = screen.getAllByTestId('image-upload-button');
    expect(buttons).toHaveLength(2); // Change and Remove buttons

    const removeButton = buttons[1];
    expect(removeButton).toHaveTextContent('Remove');
    expect(removeButton).toHaveAttribute('data-color-scheme', 'red');
    expect(removeButton).toHaveAttribute('data-variant', 'outline');
  });

  it('shows recommendation text when no image is uploaded', () => {
    render(<FieldImageUpload name="test" />);

    const text = screen.getByTestId('image-upload-text');
    expect(text).toHaveTextContent('Recommended size: 1200x630 pixels');
    expect(text).toHaveAttribute('data-font-size', 'sm');
    expect(text).toHaveAttribute('data-color', 'gray.500');
    expect(text).toHaveAttribute('data-mt', '2');
  });

  it('hides recommendation text when image is uploaded', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    });

    render(<FieldImageUpload name="test" />);

    expect(
      screen.queryByText('Recommended size: 1200x630 pixels')
    ).not.toBeInTheDocument();
  });

  it('configures file input correctly', () => {
    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('data-display', 'none');
    expect(input).toHaveAttribute('id', 'test-image-upload');
  });

  it('uses custom accept attribute when provided', () => {
    render(<FieldImageUpload name="test" accept="image/png,image/jpeg" />);

    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('accept', 'image/png,image/jpeg');
  });

  it('handles click on select button', () => {
    const mockClick = jest.fn();
    const mockRef = { current: { click: mockClick, value: '' } };

    // Mock useRef to return our mock ref
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

    render(<FieldImageUpload name="test" />);

    const button = screen.getByTestId('image-upload-button');
    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalled();
  });

  it('handles file selection and reads file', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');

    // Mock the FileReader behavior
    mockFileReader.result =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

    // Simulate FileReader onload
    if (mockFileReader.onload) {
      mockFileReader.onload();
    }

    expect(mockField.setValue).toHaveBeenCalledWith(
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'
    );
  });

  it('handles remove button click', () => {
    const mockRef = { current: { click: jest.fn(), value: '' } };
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

    mockUseField.mockReturnValue({
      ...mockField,
      value: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    });

    render(<FieldImageUpload name="test" />);

    const buttons = screen.getAllByTestId('image-upload-button');
    // Ensure we have the removeButton before accessing it
    expect(buttons.length).toBeGreaterThan(1);
    const removeButton = buttons[1];

    if (removeButton) {
      fireEvent.click(removeButton);
    }

    expect(mockField.setValue).toHaveBeenCalledWith(null);
    expect(mockRef.current.value).toBe('');
  });

  it('handles focus events', () => {
    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    fireEvent.focus(input);

    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
  });

  it('handles blur events', () => {
    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    fireEvent.blur(input);

    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
  });

  it('calls custom onFocus handler from inputProps', () => {
    const customOnFocus = jest.fn();
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        inputProps: {
          onFocus: customOnFocus,
        },
      },
    });

    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    fireEvent.focus(input);

    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
    expect(customOnFocus).toHaveBeenCalled();
  });

  it('calls custom onBlur handler from inputProps', () => {
    const customOnBlur = jest.fn();
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        inputProps: {
          onBlur: customOnBlur,
        },
      },
    });

    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    fireEvent.blur(input);

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

    render(<FieldImageUpload name="test" label="Test Image Upload" />);

    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-id', 'test-image-upload');
    expect(formGroup).toHaveAttribute('data-is-required', 'true');
    expect(formGroup).toHaveAttribute(
      'data-error-message',
      'Field is required'
    );
    expect(formGroup).toHaveAttribute('data-show-error', 'true');
  });

  it('renders children when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        children: <div data-testid="image-upload-children">Help text</div>,
      },
    });

    render(
      <FieldImageUpload name="test">
        <div data-testid="image-upload-children">Help text</div>
      </FieldImageUpload>
    );

    expect(screen.getByTestId('image-upload-children')).toBeInTheDocument();
  });

  it('passes through inputProps', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        inputProps: {
          'data-testid': 'custom-file-input',
          className: 'custom-input',
        },
      },
    });

    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('custom-file-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('custom-input');
  });

  it('maintains input ID consistency', () => {
    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');
    const formGroup = screen.getByTestId('form-group');

    expect(input).toHaveAttribute('id', 'test-image-upload');
    expect(formGroup).toHaveAttribute('data-id', 'test-image-upload');
  });

  it('updates preview when field value changes', () => {
    const { rerender } = render(<FieldImageUpload name="test" />);

    expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();

    // Update field value
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    });

    rerender(<FieldImageUpload name="test" />);

    expect(screen.getByTestId('image-preview')).toBeInTheDocument();
  });

  it('handles undefined inputProps gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        inputProps: undefined,
      },
    });

    expect(() => render(<FieldImageUpload name="test" />)).not.toThrow();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('handles no file selection gracefully', () => {
    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');

    // Clear any previous calls
    mockField.setValue.mockClear();

    // Simulate change event with no files
    fireEvent.change(input, { target: { files: [] } });

    // Should not call setValue when no files are selected
    expect(mockField.setValue).not.toHaveBeenCalled();
  });

  it('handles FileReader error gracefully', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(<FieldImageUpload name="test" />);

    const input = screen.getByTestId('file-input');

    fireEvent.change(input, { target: { files: [file] } });

    // Simulate FileReader error
    if (mockFileReader.onerror) {
      mockFileReader.onerror();
    }

    // Should handle error gracefully without crashing
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('handles null field value correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: null,
    });

    render(<FieldImageUpload name="test" />);

    expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    expect(screen.getByText('Select Image')).toBeInTheDocument();
    expect(
      screen.getByText('Recommended size: 1200x630 pixels')
    ).toBeInTheDocument();
  });
});
