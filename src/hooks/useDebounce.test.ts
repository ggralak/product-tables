import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('should debounce value after default delay (300ms)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated' });

    // Value should still be 'initial' before delay expires
    expect(result.current).toBe('initial');

    // Fast-forward time by 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should debounce value after custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });

    // Should not update after 300ms (less than custom delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Should update after 500ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should only update once after multiple rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Rapidly change the value multiple times
    rerender({ value: 'change1' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'change2' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'change3' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'final' });

    // Should still be initial value before any timeout completes
    expect(result.current).toBe('initial');

    // Fast-forward full delay from last change
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should update to the final value only
    expect(result.current).toBe('final');
  });

  it('should reset timer when value changes before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Advance time partway through delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Value should still not have updated
    expect(result.current).toBe('initial');

    // Change value again before first delay completes
    rerender({ value: 'second update' });

    // Advance time by another 200ms (total 400ms from first change, but only 200ms from second)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should still be initial because timer was reset
    expect(result.current).toBe('initial');

    // Advance remaining time to complete second delay
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should now show second update
    expect(result.current).toBe('second update');
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    unmount();

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle different data types (number)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('should handle different data types (object)', () => {
    const initialObj = { name: 'initial' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: initialObj } }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });

  it('should handle different data types (array)', () => {
    const initialArray = [1, 2, 3];
    const updatedArray = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: initialArray } }
    );

    expect(result.current).toEqual([1, 2, 3]);

    rerender({ value: updatedArray });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual([4, 5, 6]);
  });

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: null as string | null | undefined } }
    );

    expect(result.current).toBe(null);

    rerender({ value: 'defined' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('defined');

    rerender({ value: undefined });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(undefined);
  });

  it('should handle delay of 0', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // With 0 delay, should update immediately after timeout
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('should update debounced value when delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // Advance partway
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Change the delay
    rerender({ value: 'updated', delay: 500 });

    // Original timeout should be cleared, new one set
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be initial (only 500ms total, need 500ms from delay change)
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated');
  });

  it('should handle empty string value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'not empty' } }
    );

    expect(result.current).toBe('not empty');

    rerender({ value: '' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('');
  });

  it('should handle boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: false } }
    );

    expect(result.current).toBe(false);

    rerender({ value: true });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });
});
