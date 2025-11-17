import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(25);
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() => usePagination(3, 50));

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(50);
  });

  it('should update page', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.page).toBe(5);
  });

  it('should update pageSize and reset to first page', () => {
    const { result } = renderHook(() => usePagination(5, 25));

    act(() => {
      result.current.setPageSize(100);
    });

    expect(result.current.pageSize).toBe(100);
    expect(result.current.page).toBe(1);
  });

  it('should reset to first page', () => {
    const { result } = renderHook(() => usePagination(10, 25));

    act(() => {
      result.current.resetToFirstPage();
    });

    expect(result.current.page).toBe(1);
  });

  it('should handle multiple page changes', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setPage(1);
    });
    expect(result.current.page).toBe(1);
  });

  it('should maintain pageSize when changing pages', () => {
    const { result } = renderHook(() => usePagination(1, 50));

    act(() => {
      result.current.setPage(5);
    });

    expect(result.current.page).toBe(5);
    expect(result.current.pageSize).toBe(50);
  });

  it('should handle edge case of page 0', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(0);
    });

    expect(result.current.page).toBe(0);
  });

  it('should handle negative page numbers', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(-1);
    });

    expect(result.current.page).toBe(-1);
  });
});
