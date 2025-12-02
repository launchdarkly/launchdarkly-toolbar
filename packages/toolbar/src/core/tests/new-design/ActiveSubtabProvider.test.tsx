import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  ActiveSubtabProvider,
  useActiveSubtabContext,
} from '../../ui/Toolbar/components/new/context/ActiveSubtabProvider';
import React from 'react';

describe('ActiveSubtabProvider', () => {
  it('should provide initial default activeSubtab of "flags"', () => {
    const { result } = renderHook(() => useActiveSubtabContext(), {
      wrapper: ActiveSubtabProvider,
    });

    expect(result.current.activeSubtab).toBe('flags');
  });

  it('should update activeSubtab when setActiveSubtab is called', () => {
    const { result } = renderHook(() => useActiveSubtabContext(), {
      wrapper: ActiveSubtabProvider,
    });

    act(() => {
      result.current.setActiveSubtab('flags');
    });

    expect(result.current.activeSubtab).toBe('flags');
  });

  it('should handle multiple subtab changes', () => {
    const { result } = renderHook(() => useActiveSubtabContext(), {
      wrapper: ActiveSubtabProvider,
    });

    act(() => {
      result.current.setActiveSubtab('flags');
    });
    expect(result.current.activeSubtab).toBe('flags');

    act(() => {
      result.current.setActiveSubtab('context');
    });
    expect(result.current.activeSubtab).toBe('context');

    act(() => {
      result.current.setActiveSubtab('events');
    });
    expect(result.current.activeSubtab).toBe('events');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useActiveSubtabContext());
    }).toThrow('useActiveSubtabContext must be used within ActiveSubtabProvider');

    console.error = consoleError;
  });

  it('should maintain state across re-renders', () => {
    const { result, rerender } = renderHook(() => useActiveSubtabContext(), {
      wrapper: ActiveSubtabProvider,
    });

    act(() => {
      result.current.setActiveSubtab('context');
    });

    rerender();

    expect(result.current.activeSubtab).toBe('context');
  });
});
