import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlagItem } from '../../ui/Toolbar/components/new/FeatureFlags/FlagItem';
import {
  BooleanFlagControl,
  MultivariateFlagControl,
  StringNumberFlagControl,
} from '../../ui/Toolbar/components/new/FeatureFlags/FlagControls';
import { NormalizedFlag } from '../../ui/Toolbar/components/new/FeatureFlags/FlagList';
import { AnalyticsProvider } from '../../ui/Toolbar/context/telemetry/AnalyticsProvider';
import { InternalClientProvider } from '../../ui/Toolbar/context/telemetry/InternalClientProvider';
import ReactMountContext from '../../context/ReactMountContext';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock motion components
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock context hooks
vi.mock('../../ui/Toolbar/context', () => ({
  useAnalytics: () => ({
    trackFlagKeyCopy: vi.fn(),
    trackStarredFlag: vi.fn(),
  }),
  useStarredFlags: () => ({
    isStarred: vi.fn().mockReturnValue(false),
    toggleStarred: vi.fn(),
    clearAllStarred: vi.fn(),
    starredCount: 0,
  }),
}));

// Test wrapper with portal support for Select components
function TestWrapper({ children }: { children: React.ReactNode }) {
  const [portalTarget] = React.useState(() => document.createElement('div'));

  React.useEffect(() => {
    document.body.appendChild(portalTarget);
    return () => {
      document.body.removeChild(portalTarget);
    };
  }, [portalTarget]);

  return (
    <ReactMountContext.Provider value={portalTarget}>
      <InternalClientProvider>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </InternalClientProvider>
    </ReactMountContext.Provider>
  );
}

describe('Flag Content Components', () => {
  const mockOnOverride = vi.fn();
  const mockOnClearOverride = vi.fn();
  const mockHandleHeightChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BooleanFlagControl', () => {
    const createBooleanFlag = (value: boolean): NormalizedFlag => ({
      key: 'boolean-flag',
      name: 'Boolean Flag',
      type: 'boolean',
      currentValue: value,
      isOverridden: false,
      availableVariations: [],
    });

    it('should render switch control', () => {
      const flag = createBooleanFlag(true);
      render(<BooleanFlagControl flag={flag} onOverride={mockOnOverride} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('should call onOverride when switch is toggled', () => {
      const flag = createBooleanFlag(false);
      render(<BooleanFlagControl flag={flag} onOverride={mockOnOverride} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(mockOnOverride).toHaveBeenCalledWith(true);
    });

    it('should render correctly when disabled', () => {
      const flag = createBooleanFlag(true);
      render(<BooleanFlagControl flag={flag} onOverride={mockOnOverride} disabled={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });
  });

  describe('MultivariateFlagControl', () => {
    const createMultivariateFlag = (currentValue: any): NormalizedFlag => ({
      key: 'multivariate-flag',
      name: 'Multivariate Flag',
      type: 'multivariate',
      currentValue,
      isOverridden: false,
      availableVariations: [
        { _id: 'var-1', name: 'Variation 1', value: 'value-1' },
        { _id: 'var-2', name: 'Variation 2', value: 'value-2' },
        { _id: 'var-3', name: 'Variation 3', value: 'value-3' },
      ],
    });

    it('should render select component with current value', () => {
      const flag = createMultivariateFlag('value-2');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      // The select button should show the current variation's value
      const selectButton = screen.getByRole('button');
      expect(selectButton).toBeInTheDocument();
      expect(selectButton).toHaveTextContent('value-2');
    });

    it('should show placeholder when no matching variation is found', () => {
      const flag = createMultivariateFlag('unknown-value');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      const selectButton = screen.getByRole('button');
      expect(selectButton).toHaveTextContent('Select variant');
    });

    it('should open dropdown when clicked', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      // Dropdown should be open with all options
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'value-1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'value-2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'value-3' })).toBeInTheDocument();
    });

    it('should call onOverride with correct value when option is selected', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      // Open dropdown
      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      // Select a different option
      const option2 = screen.getByRole('option', { name: 'value-2' });
      fireEvent.click(option2);

      // Should call onOverride with the variation's value
      expect(mockOnOverride).toHaveBeenCalledWith('value-2');
      expect(mockOnOverride).toHaveBeenCalledTimes(1);
    });

    it('should call onOverride with the third variation value', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      // Open dropdown
      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      // Select variation 3
      const option3 = screen.getByRole('option', { name: 'value-3' });
      fireEvent.click(option3);

      expect(mockOnOverride).toHaveBeenCalledWith('value-3');
    });

    it('should close dropdown after selecting an option', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} />
        </TestWrapper>,
      );

      // Open dropdown
      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Select an option
      const option2 = screen.getByRole('option', { name: 'value-2' });
      fireEvent.click(option2);

      // Dropdown should be closed
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should render correctly when disabled', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} disabled={true} />
        </TestWrapper>,
      );

      const selectButton = screen.getByRole('button');
      expect(selectButton).toBeInTheDocument();
    });

    it('should not open dropdown when disabled', () => {
      const flag = createMultivariateFlag('value-1');
      render(
        <TestWrapper>
          <MultivariateFlagControl flag={flag} onOverride={mockOnOverride} disabled={true} />
        </TestWrapper>,
      );

      const selectButton = screen.getByRole('button');
      fireEvent.click(selectButton);

      // Dropdown should not open when disabled
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('StringNumberFlagControl', () => {
    const createStringFlag = (value: string): NormalizedFlag => ({
      key: 'string-flag',
      name: 'String Flag',
      type: 'string',
      currentValue: value,
      isOverridden: false,
      availableVariations: [],
    });

    const createNumberFlag = (value: number): NormalizedFlag => ({
      key: 'number-flag',
      name: 'Number Flag',
      type: 'number',
      currentValue: value,
      isOverridden: false,
      availableVariations: [],
    });

    it('should display current string value', () => {
      const flag = createStringFlag('test-value');
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      expect(screen.getByText('test-value')).toBeInTheDocument();
    });

    it('should display current number value', () => {
      const flag = createNumberFlag(42);
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should show edit button', () => {
      const flag = createStringFlag('test-value');
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      expect(editButton).toBeInTheDocument();
    });

    it('should enter edit mode when edit button is clicked', () => {
      const flag = createStringFlag('test-value');
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByPlaceholderText('Enter string value');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('test-value');
    });

    it('should call onOverride with new string value when confirmed', () => {
      const flag = createStringFlag('old-value');
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByPlaceholderText('Enter string value');
      fireEvent.change(input, { target: { value: 'new-value' } });

      const confirmButton = screen.getByLabelText('Confirm');
      fireEvent.click(confirmButton);

      expect(mockOnOverride).toHaveBeenCalledWith('new-value');
    });

    it('should call onOverride with number type for number flags', () => {
      const flag = createNumberFlag(10);
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByPlaceholderText('Enter number value');
      fireEvent.change(input, { target: { value: '42' } });

      const confirmButton = screen.getByLabelText('Confirm');
      fireEvent.click(confirmButton);

      expect(mockOnOverride).toHaveBeenCalledWith(42);
    });

    it('should submit on Enter key', () => {
      const flag = createStringFlag('old-value');
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByPlaceholderText('Enter string value');
      fireEvent.change(input, { target: { value: 'new-value' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnOverride).toHaveBeenCalledWith('new-value');
    });

    it('should not save invalid number values', () => {
      const flag = createNumberFlag(42);
      render(<StringNumberFlagControl flag={flag} onOverride={mockOnOverride} />);

      const editButton = screen.getByLabelText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByPlaceholderText('Enter number value');
      fireEvent.change(input, { target: { value: 'not-a-number' } });

      const confirmButton = screen.getByLabelText('Confirm');
      fireEvent.click(confirmButton);

      expect(mockOnOverride).not.toHaveBeenCalled();
    });
  });

  describe('FlagItem', () => {
    const booleanFlag: NormalizedFlag = {
      key: 'boolean-flag',
      name: 'Boolean Flag',
      type: 'boolean',
      currentValue: true,
      isOverridden: false,
      availableVariations: [],
    };

    const objectFlag: NormalizedFlag = {
      key: 'object-flag',
      name: 'Object Flag',
      type: 'object',
      currentValue: { showNewModule: true },
      isOverridden: false,
      availableVariations: [],
    };

    it('should render boolean flag with switch control', () => {
      render(
        <TestWrapper>
          <FlagItem
            flag={booleanFlag}
            onOverride={mockOnOverride}
            onClearOverride={mockOnClearOverride}
            handleHeightChange={mockHandleHeightChange}
            index={0}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Boolean Flag')).toBeInTheDocument();
      expect(screen.getByText('boolean-flag')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render object flag with Edit JSON button', () => {
      render(
        <TestWrapper>
          <FlagItem
            flag={objectFlag}
            onOverride={mockOnOverride}
            onClearOverride={mockOnClearOverride}
            handleHeightChange={mockHandleHeightChange}
            index={0}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Object Flag')).toBeInTheDocument();
      expect(screen.getByText('Edit JSON')).toBeInTheDocument();
    });

    it('should show override indicator for overridden flags', () => {
      const overriddenFlag = { ...booleanFlag, isOverridden: true };

      render(
        <TestWrapper>
          <FlagItem
            flag={overriddenFlag}
            onOverride={mockOnOverride}
            onClearOverride={mockOnClearOverride}
            handleHeightChange={mockHandleHeightChange}
            index={0}
          />
        </TestWrapper>,
      );

      const overrideDot = screen.getByTestId('override-dot');
      expect(overrideDot).toBeInTheDocument();
    });

    it('should call onClearOverride when override dot is clicked', () => {
      const overriddenFlag = { ...booleanFlag, isOverridden: true };

      render(
        <TestWrapper>
          <FlagItem
            flag={overriddenFlag}
            onOverride={mockOnOverride}
            onClearOverride={mockOnClearOverride}
            handleHeightChange={mockHandleHeightChange}
            index={0}
          />
        </TestWrapper>,
      );

      const overrideDot = screen.getByTestId('override-dot');
      fireEvent.click(overrideDot);

      expect(mockOnClearOverride).toHaveBeenCalled();
    });

    it('should show Save and Cancel buttons when editing JSON', () => {
      render(
        <TestWrapper>
          <FlagItem
            flag={objectFlag}
            onOverride={mockOnOverride}
            onClearOverride={mockOnClearOverride}
            handleHeightChange={mockHandleHeightChange}
            index={0}
          />
        </TestWrapper>,
      );

      const editButton = screen.getByText('Edit JSON');
      fireEvent.click(editButton);

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});
