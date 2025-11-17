import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTableSort } from './useTableSort';

type TestColumn = 'id' | 'name' | 'price' | 'category';

describe('useTableSort', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id'));

    expect(result.current.sortBy).toBe('id');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('should initialize with custom sort order', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('name', 'desc'));

    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('desc');
  });

  it('should toggle sort order when clicking same column', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id'));

    act(() => {
      result.current.handleSort('id');
    });

    expect(result.current.sortBy).toBe('id');
    expect(result.current.sortOrder).toBe('desc');

    act(() => {
      result.current.handleSort('id');
    });

    expect(result.current.sortOrder).toBe('asc');
  });

  it('should reset to asc when sorting by new column', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id', 'desc'));

    act(() => {
      result.current.handleSort('name');
    });

    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('should handle multiple column changes', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id'));

    // Sort by name (should be asc)
    act(() => {
      result.current.handleSort('name');
    });
    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('asc');

    // Toggle name to desc
    act(() => {
      result.current.handleSort('name');
    });
    expect(result.current.sortOrder).toBe('desc');

    // Sort by price (should reset to asc)
    act(() => {
      result.current.handleSort('price');
    });
    expect(result.current.sortBy).toBe('price');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('should maintain state across multiple toggles', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id'));

    // Toggle id multiple times
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.handleSort('id');
      });
    }

    // After 5 toggles (odd number), should be desc
    expect(result.current.sortBy).toBe('id');
    expect(result.current.sortOrder).toBe('desc');
  });

  it('should handle switching between columns correctly', () => {
    const { result } = renderHook(() => useTableSort<TestColumn>('id'));

    // id -> desc
    act(() => {
      result.current.handleSort('id');
    });
    expect(result.current.sortOrder).toBe('desc');

    // Switch to name -> asc
    act(() => {
      result.current.handleSort('name');
    });
    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('asc');

    // Toggle name -> desc
    act(() => {
      result.current.handleSort('name');
    });
    expect(result.current.sortOrder).toBe('desc');

    // Switch back to id -> asc
    act(() => {
      result.current.handleSort('id');
    });
    expect(result.current.sortBy).toBe('id');
    expect(result.current.sortOrder).toBe('asc');
  });
});
