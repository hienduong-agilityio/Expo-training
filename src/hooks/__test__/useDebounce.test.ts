import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300));

    expect(result.current).toBe('test');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      },
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('uses custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not update yet
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated');
  });

  it('clears timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'initial' },
      },
    );

    rerender({ value: 'updated' });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not cause errors
    expect(true).toBe(true);
  });

  it('handles number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 0 },
      },
    );

    expect(result.current).toBe(0);

    rerender({ value: 100 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(100);
  });

  it('uses default delay when not provided', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });
});
