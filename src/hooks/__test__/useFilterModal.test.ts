import { renderHook, act } from '@testing-library/react-native';
import { useFilterModal } from '../useFilterModal';

// Types
import type { ICategory } from '@app/interfaces/categories';

describe('useFilterModal', () => {
  const mockCategories: ICategory[] = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://example.com/1.jpg',
      slug: 'electronics',
    },
    {
      id: '2',
      name: 'Clothing',
      image: 'https://example.com/2.jpg',
      slug: 'clothing',
    },
  ];

  const mockOnApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    expect(result.current.isVisible).toBe(false);
    expect(result.current.selectedCategoryId).toBe(null);
  });

  it('initializes with initialCategoryId', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
        initialCategoryId: '1',
      }),
    );

    expect(result.current.selectedCategoryId).toBe('1');
  });

  it('opens modal and resets to initial category', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
        initialCategoryId: '1',
      }),
    );

    act(() => {
      result.current.selectCategory('2');
    });

    expect(result.current.selectedCategoryId).toBe('2');

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.selectedCategoryId).toBe('1');
  });

  it('closes modal', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('selects category', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.selectCategory('1');
    });

    expect(result.current.selectedCategoryId).toBe('1');
  });

  it('applies filter with selected category', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.selectCategory('1');
    });

    expect(result.current.selectedCategoryId).toBe('1');

    act(() => {
      result.current.applyFilter();
    });

    expect(mockOnApply).toHaveBeenCalledWith('1', 'Electronics');
    expect(result.current.isVisible).toBe(false);
  });

  it('applies filter with null category', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.applyFilter();
    });

    expect(mockOnApply).toHaveBeenCalledWith(null, 'All Categories');
    expect(result.current.isVisible).toBe(false);
  });

  it('applies filter with category name fallback when category not found', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.selectCategory('999');
    });

    expect(result.current.selectedCategoryId).toBe('999');

    act(() => {
      result.current.applyFilter();
    });

    // When category is not found, it should still call onApply with the ID and empty name
    expect(mockOnApply).toHaveBeenCalledWith('999', '');
    expect(result.current.isVisible).toBe(false);
  });

  it('clears filter', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.selectCategory('1');
    });

    expect(result.current.selectedCategoryId).toBe('1');

    act(() => {
      result.current.clearFilter();
    });

    expect(result.current.selectedCategoryId).toBe(null);
  });

  it('handles initialCategoryId as null', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
        initialCategoryId: null,
      }),
    );

    expect(result.current.selectedCategoryId).toBe(null);
  });

  it('handles openModal when initialCategoryId is null', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
        initialCategoryId: null,
      }),
    );

    act(() => {
      result.current.selectCategory('1');
    });

    act(() => {
      result.current.openModal();
    });

    expect(result.current.selectedCategoryId).toBe(null);
    expect(result.current.isVisible).toBe(true);
  });

  it('handles openModal when initialCategoryId is undefined', () => {
    const { result } = renderHook(() =>
      useFilterModal({
        categories: mockCategories,
        onApply: mockOnApply,
      }),
    );

    act(() => {
      result.current.selectCategory('1');
    });

    act(() => {
      result.current.openModal();
    });

    expect(result.current.selectedCategoryId).toBe(null);
    expect(result.current.isVisible).toBe(true);
  });
});
