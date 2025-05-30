import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useField } from '@formiz/core';
import { FieldSelect } from './index';

// Mock Formiz hook
const mockField = {
  id: 'test-select',
  value: null,
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

// Mock Select component
jest.mock('@/components/Select', () => ({
  Select: ({ 
    onChange, 
    onFocus, 
    onBlur, 
    options, 
    value, 
    placeholder,
    isMulti,
    isClearable,
    isSearchable,
    autoFocus,
    ...props 
  }: any) => (
    <select
      onChange={(e) => {
        if (isMulti) {
          const selectedOptions = Array.from(e.target.selectedOptions).map(opt => 
            options?.find((o: any) => o.value === opt.value)
          );
          onChange(selectedOptions);
        } else {
          const selectedOption = options?.find((o: any) => o.value === e.target.value);
          onChange(selectedOption);
        }
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      data-testid="field-select"
      data-placeholder={placeholder}
      data-is-multi={isMulti}
      data-is-clearable={isClearable}
      data-is-searchable={isSearchable}
      data-auto-focus={autoFocus}
      value={isMulti ? (value || []).map((v: any) => v.value) : value?.value || ''}
      multiple={isMulti}
      {...props}
    >
      <option value="">Select...</option>
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const mockUseField = useField as jest.MockedFunction<typeof useField>;

const mockOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

describe('FieldSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseField.mockReturnValue(mockField);
  });

  it('renders basic select field', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    expect(screen.getByTestId('field-select')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
  });

  it('displays options correctly', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(4); // 3 options + 1 default "Select..." option
    expect(options[1]).toHaveTextContent('Option 1');
    expect(options[2]).toHaveTextContent('Option 2');
    expect(options[3]).toHaveTextContent('Option 3');
  });

  it('displays selected value for single select', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: 'option2',
    });

    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveValue('option2');
  });

  it('displays selected values for multi select', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: ['option1', 'option3'],
      otherProps: {
        isMulti: true,
      },
    });

    render(<FieldSelect name="test" options={mockOptions} isMulti />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-is-multi', 'true');
    expect(select).toHaveValue(['option1', 'option3']);
  });

  it('handles single value changes', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    fireEvent.change(select, { target: { value: 'option1' } });
    
    expect(mockField.setValue).toHaveBeenCalled();
  });

  it('handles multi value changes', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        isMulti: true,
      },
    });

    render(<FieldSelect name="test" options={mockOptions} isMulti />);
    
    const select = screen.getByTestId('field-select');
    
    // Simulate change event with multiple selections
    fireEvent.change(select, { 
      target: { 
        value: ['option1', 'option2'],
        selectedOptions: [
          { value: 'option1' },
          { value: 'option2' }
        ]
      } 
    });
    
    expect(mockField.setValue).toHaveBeenCalled();
  });

  it('handles focus events', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    fireEvent.focus(select);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(false);
  });

  it('handles blur events', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    fireEvent.blur(select);
    
    expect(mockField.setIsTouched).toHaveBeenCalledWith(true);
  });

  it('passes placeholder to select', () => {
    render(<FieldSelect name="test" options={mockOptions} placeholder="Choose an option" />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-placeholder', 'Choose an option');
  });

  it('uses default placeholder when none provided', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-placeholder', 'Select...');
  });

  it('passes clearable prop', () => {
    render(<FieldSelect name="test" options={mockOptions} isClearable />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-is-clearable', 'true');
  });

  it('passes searchable prop', () => {
    render(<FieldSelect name="test" options={mockOptions} isSearchable />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-is-searchable', 'true');
  });

  it('passes autoFocus prop', () => {
    render(<FieldSelect name="test" options={mockOptions} autoFocus />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-auto-focus', 'true');
  });

  it('handles empty options array', () => {
    render(<FieldSelect name="test" options={[]} />);
    
    const select = screen.getByTestId('field-select');
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(1); // Only default "Select..." option
  });

  it('handles null/undefined value gracefully', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: null,
    });

    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveValue('');
  });

  it('passes form group props correctly', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      errorMessage: 'Field is required',
      shouldDisplayError: true,
      isRequired: true,
    });

    render(<FieldSelect name="test" options={mockOptions} label="Test Select" />);
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-id', 'test-select');
    expect(formGroup).toHaveAttribute('data-is-required', 'true');
    expect(formGroup).toHaveAttribute('data-error-message', 'Field is required');
    expect(formGroup).toHaveAttribute('data-show-error', 'true');
  });

  it('renders children when provided', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        children: <div data-testid="select-children">Help text</div>,
      },
    });

    render(
      <FieldSelect name="test" options={mockOptions}>
        <div data-testid="select-children">Help text</div>
      </FieldSelect>
    );
    
    expect(screen.getByTestId('select-children')).toBeInTheDocument();
  });

  it('maintains select ID consistency', () => {
    render(<FieldSelect name="test" options={mockOptions} />);
    
    const select = screen.getByTestId('field-select');
    const formGroup = screen.getByTestId('form-group');
    
    expect(select).toHaveAttribute('id', 'test-select');
    expect(formGroup).toHaveAttribute('data-id', 'test-select');
  });

  it('handles creatable mode with new values', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: ['option1', 'custom-value'],
      otherProps: {
        isMulti: true,
        selectProps: {
          type: 'creatable',
        },
      },
    });

    render(
      <FieldSelect 
        name="test" 
        options={mockOptions} 
        isMulti
        selectProps={{ type: 'creatable' }}
      />
    );
    
    // The component should handle created values that aren't in options
    expect(screen.getByTestId('field-select')).toBeInTheDocument();
  });

  it('filters out existing options from created values', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: ['option1', 'option2', 'custom-value'],
      otherProps: {
        isMulti: true,
        selectProps: {
          type: 'creatable',
        },
      },
    });

    render(
      <FieldSelect 
        name="test" 
        options={mockOptions} 
        isMulti
        selectProps={{ type: 'creatable' }}
      />
    );
    
    // Component should work without throwing errors
    expect(screen.getByTestId('field-select')).toBeInTheDocument();
  });

  it('handles async-creatable mode', () => {
    mockUseField.mockReturnValue({
      ...mockField,
      value: ['custom-async-value'],
      otherProps: {
        isMulti: true,
        selectProps: {
          type: 'async-creatable',
        },
      },
    });

    render(
      <FieldSelect 
        name="test" 
        options={mockOptions} 
        isMulti
        selectProps={{ type: 'async-creatable' }}
      />
    );
    
    expect(screen.getByTestId('field-select')).toBeInTheDocument();
  });

  it('handles selectProps correctly', () => {
    const customSelectProps = {
      className: 'custom-select',
      'data-custom': 'value',
    };

    mockUseField.mockReturnValue({
      ...mockField,
      otherProps: {
        selectProps: customSelectProps,
      },
    });

    render(
      <FieldSelect 
        name="test" 
        options={mockOptions}
        selectProps={customSelectProps}
      />
    );
    
    const select = screen.getByTestId('field-select');
    expect(select).toHaveAttribute('data-custom', 'value');
  });
});