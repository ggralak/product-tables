import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTableFilters } from './useTableFilters';

type TestColumn = 'name' | 'category' | 'price' | 'supplier';

describe('useTableFilters', () => {
  it('should initialize with empty filters', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    expect(result.current.filters).toEqual({});
  });

  it('should add a filter', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
    });

    expect(result.current.filters).toEqual({ name: 'test' });
  });

  it('should update an existing filter', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
    });

    act(() => {
      result.current.handleFilterChange('name', 'updated');
    });

    expect(result.current.filters).toEqual({ name: 'updated' });
  });

  it('should handle multiple filters', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
      result.current.handleFilterChange('category', 'electronics');
    });

    expect(result.current.filters).toEqual({
      name: 'test',
      category: 'electronics'
    });
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
      result.current.handleFilterChange('category', 'electronics');
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
  });

  it('should handle empty string as filter value', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', '');
    });

    expect(result.current.filters).toEqual({ name: '' });
  });

  it('should preserve other filters when updating one', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
      result.current.handleFilterChange('category', 'electronics');
      result.current.handleFilterChange('price', '100');
    });

    act(() => {
      result.current.handleFilterChange('category', 'furniture');
    });

    expect(result.current.filters).toEqual({
      name: 'test',
      category: 'furniture',
      price: '100'
    });
  });

  it('should handle special characters in filter values', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test@#$%');
      result.current.handleFilterChange('category', 'a & b');
    });

    expect(result.current.filters).toEqual({
      name: 'test@#$%',
      category: 'a & b'
    });
  });

  it('should handle adding filters after clearing', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 'test');
    });

    act(() => {
      result.current.clearFilters();
    });

    act(() => {
      result.current.handleFilterChange('category', 'electronics');
    });

    expect(result.current.filters).toEqual({ category: 'electronics' });
  });

  it('should handle rapid filter changes', () => {
    const { result } = renderHook(() => useTableFilters<TestColumn>());

    act(() => {
      result.current.handleFilterChange('name', 't');
      result.current.handleFilterChange('name', 'te');
      result.current.handleFilterChange('name', 'tes');
      result.current.handleFilterChange('name', 'test');
    });

    expect(result.current.filters).toEqual({ name: 'test' });
  });
});
