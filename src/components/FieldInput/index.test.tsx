import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from '@formiz/core';
import { FieldInput } from './index';

// Mock Formiz hook
const mockField = {
  id: 'test-field',
  value: '',
  setValue: jest.fn(),
  setIsTouched: jest.fn(),
  errorMessage: '',
  shouldDisplayError: false,
  isRequired: false,
  isValidating: false,
  isTouched: false,
  isSubmitted: false,
  otherProps: {}
};

jest.mock('@formiz/core', () => ({
  useField: jest.fn(() => mockField),
}));

// Mock FormGroup component
jest.mock('@/components/FormGroup', () => ({
  FormGroup: ({ children, errorMessage, id, isRequired, showError, ...props }: any) => {
    // Filter out React DOM warning props
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
  IconButton: ({ _children, onClick, 'aria-label': ariaLabel, icon, ...props }: any) => (
    <button onClick={onClick} aria-label={ariaLabel} {...props}>
      {icon}
    </button>
  ),
  Input: ({ onChange, onFocus, onBlur, ...props }: any) => (
    <input
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      data-testid="field-input"
      {...props}
    />
  ),
  InputGroup: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  InputLeftElement: ({ children }: any) => <div data-testid="left-element">{children}</div>,
  InputRightElement: ({ children }: any) => <div data-testid="right-element">{children}</div>,
  Spinner: (props: any) => <div data-testid="spinner" {...props} />,
}));

// Mock react-icons
jest.mock('react-icons/ri', () => ({
  RiEyeCloseLine: () => <span data-testid="eye-closed-icon" />,
  RiEyeLine: () => <span data-testid="eye-open-icon" />,
}));

const mockUseField = useField as jest.MockedFunction<typeof useField>;

describe('FieldInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseField.mockReturnValue(mockField);
  });

  it('renders basic input field', () => {
    render(<FieldInput name="test" />);
    
    expect(screen.getByTestId('field-input')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
  });

  it('displays field value', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'test value',
    });

    render(<FieldInput name="test" />);
    
    const input = screen.getByTestId('field-input');
    expect(input).toHaveValue('test value');
  });

  it('handles value changes', () => {
    render(<FieldInput name="test" />);
    
    const input = screen.getByTestId('field-input');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockField.setValue).toHaveBeenCalledWith('new value');
  });

  it('handles focus and blur events', () => {
    render(<FieldInput name="test" />);
    
    const input = screen.getByTestId('field-input');
    
    fireEvent.focus(input);
    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
    
    fireEvent.blur(input);
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
  });

  it('renders password field with toggle button', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        type: 'password',
      },
    });

    render(<FieldInput name="password" type="password" />);
    
    expect(screen.getByTestId('field-input')).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('left-element')).toBeInTheDocument();
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    expect(screen.getByTestId('eye-closed-icon')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        type: 'password',
      },
    });

    render(<FieldInput name="password" type="password" />);
    
    const input = screen.getByTestId('field-input');
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(input).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    expect(screen.getByTestId('eye-open-icon')).toBeInTheDocument();
  });

  it('shows spinner when validating', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      isValidating: true,
      isTouched: true,
    });

    render(<FieldInput name="test" />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('right-element')).toBeInTheDocument();
  });

  it('shows spinner when submitted and validating', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      isValidating: true,
      isSubmitted: true,
    });

    render(<FieldInput name="test" />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('does not show spinner when not validating', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      isValidating: false,
      isTouched: true,
    });

    render(<FieldInput name="test" />);
    
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('passes placeholder to input', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        placeholder: 'Enter text here',
      },
    });

    render(<FieldInput name="test" placeholder="Enter text here" />);
    
    const input = screen.getByTestId('field-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('handles autoFocus prop', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        autoFocus: true,
      },
    });

    // Just check that the component renders without error when autoFocus is provided
    expect(() => render(<FieldInput name="test" autoFocus />)).not.toThrow();
    expect(screen.getByTestId('field-input')).toBeInTheDocument();
  });

  it('handles empty value gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: null,
    });

    render(<FieldInput name="test" />);
    
    const input = screen.getByTestId('field-input');
    expect(input).toHaveValue('');
  });

  it('passes through inputProps', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        inputProps: {
          'data-testid': 'custom-input',
          size: 'lg',
        },
      },
    });

    render(<FieldInput name="test" />);
    
    const input = screen.getByTestId('custom-input');
    expect(input).toBeInTheDocument();
  });

  it('passes form group props correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      errorMessage: 'Field is required',
      shouldDisplayError: true,
      isRequired: true,
    });

    render(<FieldInput name="test" label="Test Field" />);
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-id', 'test-field');
    expect(formGroup).toHaveAttribute('data-is-required', 'true');
  });

  it('renders children when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        children: <div data-testid="field-children">Extra content</div>,
      },
    });

    render(
      <FieldInput name="test">
        <div data-testid="field-children">Extra content</div>
      </FieldInput>
    );
    
    expect(screen.getByTestId('field-children')).toBeInTheDocument();
  });

  it('handles different input types', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        type: 'email',
      },
    });

    render(<FieldInput name="test" type="email" />);
    
    const input = screen.getByTestId('field-input');
    expect(input).toHaveAttribute('type', 'email');
  });
});