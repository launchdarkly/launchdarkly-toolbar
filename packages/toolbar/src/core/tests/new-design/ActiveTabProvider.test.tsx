import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActiveTabProvider, useActiveTabContext } from '../../ui/Toolbar/context/state/ActiveTabProvider';
import React from 'react';

describe('ActiveTabProvider', () => {
  it('should provide initial undefined activeTab', () => {
    const { result } = renderHook(() => useActiveTabContext(), {
      wrapper: ActiveTabProvider,
    });

    expect(result.current.activeTab).toBeUndefined();
  });

  it('should update activeTab when setActiveTab is called', () => {
    const { result } = renderHook(() => useActiveTabContext(), {
      wrapper: ActiveTabProvider,
    });

    act(() => {
      result.current.setActiveTab('flags');
    });

    expect(result.current.activeTab).toBe('flags');
  });

  it('should handle multiple tab changes', () => {
    const { result } = renderHook(() => useActiveTabContext(), {
      wrapper: ActiveTabProvider,
    });

    act(() => {
      result.current.setActiveTab('flags');
    });
    expect(result.current.activeTab).toBe('flags');

    act(() => {
      result.current.setActiveTab('monitoring');
    });
    expect(result.current.activeTab).toBe('monitoring');

    act(() => {
      result.current.setActiveTab('settings');
    });
    expect(result.current.activeTab).toBe('settings');
  });

  it('should allow setting activeTab to undefined', () => {
    const { result } = renderHook(() => useActiveTabContext(), {
      wrapper: ActiveTabProvider,
    });

    act(() => {
      result.current.setActiveTab('flags');
    });
    expect(result.current.activeTab).toBe('flags');

    act(() => {
      result.current.setActiveTab(undefined);
    });
    expect(result.current.activeTab).toBeUndefined();
  });

  it('should throw error when used outside provider', () => {
    // ActiveTabProvider requires a provider, should throw when used without one
    expect(() => {
      renderHook(() => useActiveTabContext());
    }).toThrow('useActiveTabContext must be used within an ActiveTabProvider');
  });

  it('should maintain state across re-renders', () => {
    const { result, rerender } = renderHook(() => useActiveTabContext(), {
      wrapper: ActiveTabProvider,
    });

    act(() => {
      result.current.setActiveTab('monitoring');
    });

    rerender();

    expect(result.current.activeTab).toBe('monitoring');
  });
});
