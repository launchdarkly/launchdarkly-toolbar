import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IconBar } from '../../ui/Toolbar/components/new/IconBar/IconBar';
import { InteractiveContent } from '../../ui/Toolbar/components/new/Interactive/InteractiveContent';
import { SelectionOverlay } from '../../ui/Toolbar/components/new/Interactive/SelectionOverlay';
import { ContentActions } from '../../ui/Toolbar/components/new/ContentActions';
import { ActiveTabProvider } from '../../ui/Toolbar/context/state/ActiveTabProvider';
import { ActiveSubtabProvider } from '../../ui/Toolbar/components/new/context/ActiveSubtabProvider';
import { TabSearchProvider } from '../../ui/Toolbar/components/new/context/TabSearchProvider';
import { FiltersProvider } from '../../ui/Toolbar/components/new/context/FiltersProvider';
import { SearchProvider } from '../../ui/Toolbar/context/state/SearchProvider';
import { DevServerProvider } from '../../ui/Toolbar/context/DevServerProvider';
import { ApiBundleProvider } from '../../ui/Toolbar/context/api/ApiBundleProvider';
import { AnalyticsProvider } from '../../ui/Toolbar/context/telemetry/AnalyticsProvider';
import { InternalClientProvider } from '../../ui/Toolbar/context/telemetry/InternalClientProvider';
import { PluginsProvider } from '../../ui/Toolbar/context/state/PluginsProvider';
import { ToolbarStateProvider } from '../../ui/Toolbar/context/state/ToolbarStateProvider';
import { ElementSelectionProvider, useElementSelection } from '../../ui/Toolbar/context/ElementSelectionProvider';
import { getElementInfo } from '../../ui/Toolbar/components/new/Interactive/utils/elementUtils';
import '@testing-library/jest-dom/vitest';
import React from 'react';

const mockEnableInteractiveIcon = vi.fn();
const mockEnableAiIcon = vi.fn();
const mockEnableOptimizeIcon = vi.fn();

vi.mock('../../../flags/toolbarFlags', () => ({
  enableInteractiveIcon: () => mockEnableInteractiveIcon(),
  enableAiIcon: () => mockEnableAiIcon(),
  enableOptimizeIcon: () => mockEnableOptimizeIcon(),
}));

vi.mock('../../ui/Toolbar/components/new/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div title={content}>{children}</div>
  ),
}));

vi.mock('../../ui/Toolbar/components/new/Interactive/SelectionOverlay', () => ({
  SelectionOverlay: () => {
    const { isSelecting, selectedElement } = useElementSelection();
    return (
      <div data-testid="selection-overlay" data-selecting={isSelecting} data-selected={!!selectedElement}>
        {isSelecting && <div data-testid="selection-mode-active">Selection mode active</div>}
        {selectedElement && <div data-testid="element-selected">Element selected</div>}
      </div>
    );
  },
}));

vi.mock('../../ui/Toolbar/components/new/Interactive/SelectedElementInfo', () => ({
  SelectedElementInfo: () => {
    const { selectedElementInfo } = useElementSelection();
    if (!selectedElementInfo) return null;
    return (
      <div data-testid="selected-element-info">
        <div data-testid="element-selector">{selectedElementInfo.selector}</div>
        <div data-testid="element-primary-identifier">{selectedElementInfo.primaryIdentifier}</div>
      </div>
    );
  },
}));

describe('Element Selection Integration', () => {
  const defaultProps = {
    defaultActiveTab: 'flags' as const,
  };

  const renderWithProviders = (children: React.ReactNode) => {
    return render(
      <InternalClientProvider>
        <AnalyticsProvider>
          <SearchProvider>
            <ActiveTabProvider>
              <ApiBundleProvider authUrl="https://app.launchdarkly.com" clientSideId="test-client-id">
                <ElementSelectionProvider>
                  <ActiveSubtabProvider>
                    <TabSearchProvider>
                      <FiltersProvider>
                        <DevServerProvider config={{ devServerUrl: '', pollIntervalInMs: 5000 }}>
                          <ToolbarStateProvider domId="test-toolbar">
                            <PluginsProvider baseUrl="https://app.launchdarkly.com">{children}</PluginsProvider>
                          </ToolbarStateProvider>
                        </DevServerProvider>
                      </FiltersProvider>
                    </TabSearchProvider>
                  </ActiveSubtabProvider>
                </ElementSelectionProvider>
              </ApiBundleProvider>
            </ActiveTabProvider>
          </SearchProvider>
        </AnalyticsProvider>
      </InternalClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnableInteractiveIcon.mockReturnValue(true);
    mockEnableAiIcon.mockReturnValue(false);
    mockEnableOptimizeIcon.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Starting Selection Mode', () => {
    it('should start selection mode when clicking interactive icon from another tab', () => {
      renderWithProviders(
        <>
          <IconBar {...defaultProps} />
          <SelectionOverlay />
        </>,
      );

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      fireEvent.click(interactiveButton);

      const overlay = screen.getByTestId('selection-overlay');
      expect(overlay).toHaveAttribute('data-selecting', 'true');
      expect(overlay).toHaveAttribute('data-selected', 'false');
    });

    it('should start selection mode when clicking interactive icon while already in interactive tab', () => {
      renderWithProviders(
        <>
          <IconBar {...defaultProps} />
          <SelectionOverlay />
        </>,
      );

      const interactiveButton = screen.getByLabelText('Interactive Mode');

      // First click switches to interactive tab
      fireEvent.click(interactiveButton);

      // Second click starts selection
      fireEvent.click(interactiveButton);

      const overlay = screen.getByTestId('selection-overlay');
      expect(overlay).toHaveAttribute('data-selecting', 'true');
    });
  });

  describe('Selecting an Element', () => {
    it('should select an element and extract its information', async () => {
      const testElement = document.createElement('button');
      testElement.id = 'test-button';
      testElement.className = 'btn primary';
      testElement.textContent = 'Click me';
      document.body.appendChild(testElement);

      renderWithProviders(
        <>
          <IconBar {...defaultProps} />
          <SelectionOverlay />
          <InteractiveContent />
        </>,
      );

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      fireEvent.click(interactiveButton);

      // Simulate clicking on the test element
      const overlay = screen.getByTestId('selection-overlay');
      expect(overlay).toHaveAttribute('data-selecting', 'true');

      // In a real scenario, SelectionOverlay would handle the click
      // For testing, we'll directly trigger selection via the context
      // This simulates what happens when a user clicks an element
      const { useElementSelection } = await import('../../ui/Toolbar/context/ElementSelectionProvider');

      const TestSelectionComponent = () => {
        const { selectElement } = useElementSelection();
        React.useEffect(() => {
          selectElement(testElement);
        }, [selectElement]);
        return null;
      };

      renderWithProviders(
        <>
          <TestSelectionComponent />
          <InteractiveContent />
        </>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('selected-element-info')).toBeInTheDocument();
      });

      // Verify element info was extracted
      expect(screen.getByTestId('element-selector')).toBeInTheDocument();
      expect(screen.getByTestId('element-primary-identifier')).toBeInTheDocument();

      // Cleanup
      document.body.removeChild(testElement);
    });
  });

  describe('Clearing Selection', () => {
    it('should clear selection when clear button is clicked', async () => {
      const testElement = document.createElement('div');
      testElement.id = 'test-div';
      document.body.appendChild(testElement);

      renderWithProviders(
        <>
          <IconBar {...defaultProps} />
          <ContentActions />
          <InteractiveContent />
        </>,
      );

      // Start in interactive tab
      const interactiveButton = screen.getByLabelText('Interactive Mode');
      fireEvent.click(interactiveButton);

      // Simulate selection (simplified for test)
      const TestSelectionComponent = () => {
        const { selectElement, clearSelection, selectedElement } = useElementSelection();
        React.useEffect(() => {
          selectElement(testElement);
        }, [selectElement]);
        return selectedElement ? (
          <button onClick={clearSelection} data-testid="clear-button">
            Clear
          </button>
        ) : null;
      };

      renderWithProviders(
        <>
          <TestSelectionComponent />
          <ContentActions />
          <InteractiveContent />
        </>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('selected-element-info')).toBeInTheDocument();
      });

      // Click clear button
      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByTestId('selected-element-info')).not.toBeInTheDocument();
      });

      document.body.removeChild(testElement);
    });
  });

  describe('Selection State Management', () => {
    it('should show empty state when no element is selected', () => {
      renderWithProviders(<InteractiveContent />);

      expect(screen.getByTestId('interactive-content')).toBeInTheDocument();
      // Empty state message should be visible
      expect(screen.getByText(/Click the/i)).toBeInTheDocument();
    });

    it('should exit selection mode after selecting an element', async () => {
      const testElement = document.createElement('div');
      testElement.id = 'test';
      document.body.appendChild(testElement);

      renderWithProviders(
        <>
          <SelectionOverlay />
        </>,
      );

      const TestComponent = () => {
        const { startSelection, selectElement, isSelecting } = useElementSelection();
        return (
          <div>
            <button onClick={startSelection} data-testid="start-btn">
              Start
            </button>
            <button onClick={() => selectElement(testElement)} data-testid="select-btn">
              Select
            </button>
            <div data-testid="selecting-state">{isSelecting ? 'selecting' : 'not-selecting'}</div>
          </div>
        );
      };

      renderWithProviders(
        <>
          <TestComponent />
          <SelectionOverlay />
        </>,
      );

      // Start selection
      fireEvent.click(screen.getByTestId('start-btn'));
      expect(screen.getByTestId('selecting-state')).toHaveTextContent('selecting');

      // Select element
      fireEvent.click(screen.getByTestId('select-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('selecting-state')).toHaveTextContent('not-selecting');
      });

      document.body.removeChild(testElement);
    });
  });

  describe('Element Info Extraction', () => {
    it('should extract correct element information', () => {
      const testElement = document.createElement('button');
      testElement.id = 'submit-btn';
      testElement.className = 'btn primary large';
      testElement.setAttribute('data-testid', 'submit-button');
      testElement.textContent = 'Submit Form';
      document.body.appendChild(testElement);

      const elementInfo = getElementInfo(testElement);

      expect(elementInfo.id).toBe('submit-btn');
      expect(elementInfo.tagName).toBe('button');
      expect(elementInfo.classes).toContain('btn');
      expect(elementInfo.classes).toContain('primary');
      expect(elementInfo.textContent).toBe('Submit Form');
      expect(elementInfo.selector).toContain('button#submit-btn');
      expect(elementInfo.primaryIdentifier).toContain('<button>');
      expect(elementInfo.primaryIdentifier).toContain('#submit-btn');

      document.body.removeChild(testElement);
    });

    it('should throw error for invalid element', () => {
      expect(() => getElementInfo(null as any)).toThrow('Invalid element provided to getElementInfo');
      expect(() => getElementInfo(undefined as any)).toThrow('Invalid element provided to getElementInfo');
      expect(() => getElementInfo({} as any)).toThrow('Invalid element provided to getElementInfo');
    });
  });
});
