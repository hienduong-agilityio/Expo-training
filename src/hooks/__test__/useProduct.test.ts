import { renderHook } from '@testing-library/react-native';
import {
  useCategorizedProducts,
  useProductById,
  useProductsByCategory,
  useSearchProducts,
  useProductsByIds,
} from '../useProduct';
import { useQuery, useQueries } from '@tanstack/react-query';

jest.mock('@app/services/product');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueries: jest.fn(),
}));

describe('useProduct hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCategorizedProducts', () => {
    it('returns categorized products', () => {
      const mockData = {
        deals: [],
        trending: [],
        newArrivals: [],
      };

      (useQuery as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useCategorizedProducts());

      expect(result.current.products).toEqual(mockData);
    });

    it('returns empty categorized products when data is null', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useCategorizedProducts());

      expect(result.current.products).toEqual({
        deals: [],
        trending: [],
        newArrivals: [],
      });
    });
  });

  describe('useProductById', () => {
    it('returns product by id', () => {
      const mockProduct = { id: '1', name: 'Test Product' };

      (useQuery as jest.Mock).mockReturnValue({
        data: mockProduct,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useProductById('1'));

      expect(result.current.product).toEqual(mockProduct);
    });

    it('is disabled when productId is empty', () => {
      renderHook(() => useProductById(''));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });
  });

  describe('useProductsByCategory', () => {
    it('returns products by category', () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];

      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useProductsByCategory('electronics'));

      expect(result.current.products).toEqual(mockProducts);
    });

    it('normalizes category slug', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useProductsByCategory('  electronics  '));

      // Check that useQuery was called with normalized slug in queryFn
      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            'products',
            'category',
            'electronics',
          ]),
        }),
      );
    });

    it('handles undefined category slug', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useProductsByCategory(undefined));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'category', 'all']),
        }),
      );
    });

    it('handles empty category slug', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useProductsByCategory(''));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'category', 'all']),
        }),
      );
    });

    it('returns empty array when data is null', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useProductsByCategory('electronics'));

      expect(result.current.products).toEqual([]);
    });
  });

  describe('useSearchProducts', () => {
    it('returns search results', () => {
      const mockProducts = [{ id: '1' }];

      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useSearchProducts('test query', 'electronics'),
      );

      expect(result.current.products).toEqual(mockProducts);
    });

    it('is disabled when query is empty', () => {
      renderHook(() => useSearchProducts('', 'electronics'));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });

    it('is disabled when query is undefined', () => {
      renderHook(() => useSearchProducts(undefined, 'electronics'));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });

    it('is disabled when query is null', () => {
      renderHook(() => useSearchProducts(null, 'electronics'));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });

    it('normalizes search query', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useSearchProducts('  test  ', 'electronics'));

      // Check that useQuery was called with normalized query
      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'search', 'test']),
        }),
      );
    });

    it('handles undefined category slug', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useSearchProducts('test', undefined));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            'products',
            'search',
            'test',
            'all',
          ]),
        }),
      );
    });

    it('handles null category slug', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useSearchProducts('test', null));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            'products',
            'search',
            'test',
            'all',
          ]),
        }),
      );
    });

    it('uses empty query key when query is empty', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useSearchProducts('', 'electronics'));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'search', 'empty']),
        }),
      );
    });

    it('returns empty array when data is null', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useSearchProducts('test', 'electronics'),
      );

      expect(result.current.products).toEqual([]);
    });
  });

  describe('useProductsByIds', () => {
    it('returns products by ids', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];

      const mockQueries = [
        { data: mockProducts[0], isLoading: false, isError: false },
        { data: mockProducts[1], isLoading: false, isError: false },
      ];

      (useQueries as jest.Mock).mockReturnValue(mockQueries);

      const { result } = renderHook(() => useProductsByIds(['1', '2']));

      expect(result.current.products).toHaveLength(2);
      expect(result.current.productMap).toBeInstanceOf(Map);
    });

    it('filters out invalid ids', () => {
      (useQueries as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() =>
        useProductsByIds(['1', '', null as unknown as string, '2']),
      );

      expect(result.current.products).toEqual([]);
    });

    it('handles loading state', () => {
      const mockQueries = [
        { isLoading: true, isError: false, data: null },
        { isLoading: false, isError: false, data: { id: '2' } },
      ];

      (useQueries as jest.Mock).mockReturnValue(mockQueries);

      const { result } = renderHook(() => useProductsByIds(['1', '2']));

      expect(result.current.isLoading).toBe(true);
    });

    it('handles error state', () => {
      const mockQueries = [
        { isLoading: false, isError: true, data: null },
        { isLoading: false, isError: false, data: { id: '2' } },
      ];

      (useQueries as jest.Mock).mockReturnValue(mockQueries);

      const { result } = renderHook(() => useProductsByIds(['1', '2']));

      expect(result.current.isError).toBe(true);
    });

    it('filters out null/undefined products', () => {
      const mockQueries = [
        { isLoading: false, isError: false, data: { id: '1' } },
        { isLoading: false, isError: false, data: null },
        { isLoading: false, isError: false, data: undefined },
      ];

      (useQueries as jest.Mock).mockReturnValue(mockQueries);

      const { result } = renderHook(() => useProductsByIds(['1', '2', '3']));

      expect(result.current.products).toHaveLength(1);
    });
  });
});
