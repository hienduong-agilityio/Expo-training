import { renderHook, act } from '@testing-library/react-native';
import { useProductSizeSelection } from '../useProductSizeSelection';
import { IProductSize } from '@app/interfaces/product';

describe('useProductSizeSelection', () => {
  const mockSizes: IProductSize[] = [
    { id: 's1', size: 'S', available: true },
    { id: 's2', size: 'M', available: false },
    { id: 's3', size: 'L', available: true },
  ];

  it('returns default size when no selection made', () => {
    const { result } = renderHook(() =>
      useProductSizeSelection('p1', mockSizes),
    );

    expect(result.current.selectedSize).toBe('S');
  });

  it('updates selected size when available size is selected', () => {
    const { result } = renderHook(() =>
      useProductSizeSelection('p1', mockSizes),
    );

    act(() => {
      result.current.handleSizeSelect('s3');
    });

    expect(result.current.selectedSize).toBe('L');
  });

  it('does not update size if productId is missing', () => {
    const { result } = renderHook(() =>
      useProductSizeSelection(undefined, mockSizes),
    );

    act(() => {
      result.current.handleSizeSelect('s3');
    });

    expect(result.current.selectedSize).toBe('S');
  });

  it('does not update size if selected size is unavailable', () => {
    const { result } = renderHook(() =>
      useProductSizeSelection('p1', mockSizes),
    );

    act(() => {
      result.current.handleSizeSelect('s2');
    });

    expect(result.current.selectedSize).toBe('S');
  });

  it('returns empty string if no sizes available', () => {
    const { result } = renderHook(() => useProductSizeSelection('p1', []));

    expect(result.current.selectedSize).toBe('');
  });

  it('remembers selections for different products', () => {
    const { result, rerender } = renderHook(
      ({ productId }) => useProductSizeSelection(productId, mockSizes),
      {
        initialProps: { productId: 'p1' },
      },
    );

    act(() => {
      result.current.handleSizeSelect('s3');
    });
    expect(result.current.selectedSize).toBe('L');

    rerender({ productId: 'p2' });
    expect(result.current.selectedSize).toBe('S'); // Default for p2

    act(() => {
      result.current.handleSizeSelect('s1');
    });
    expect(result.current.selectedSize).toBe('S');

    rerender({ productId: 'p1' });
    expect(result.current.selectedSize).toBe('L'); // Remembered p1 selection
  });
});
