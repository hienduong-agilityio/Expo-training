import { renderHook } from '@testing-library/react-native';
import {
  useCategorizedProducts,
  useProductById,
  useProductsByCategory,
  useSearchProducts,
  useProductsByIds,
} from '../useProduct';
import { useQuery, useQueries } from '@tanstack/react-query';

// Mocks
jest.mock('@app/services/product');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueries: jest.fn(),
}));
jest.mock('@app/helpers/products', () => ({
  filterProductsByCategorySlug: jest.fn(products => products),
  filterProductsBySearchQuery: jest.fn(products => products),
}));

import {
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
} from '@app/helpers/products';

describe('useProduct hooks', () => {
  it('sanity check', () => {
    expect(true).toBe(true);
  });

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

      (filterProductsByCategorySlug as jest.Mock).mockReturnValue(mockProducts);

      const { result } = renderHook(() => useProductsByCategory('electronics'));

      expect(result.current.products).toEqual(mockProducts);
    });

    it('uses cached query for category', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderHook(() => useProductsByCategory('electronics'));

      // Check that useQuery was called with the ALL products key
      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'all']),
        }),
      );
    });

    it('calls filter helper with normalized slug', () => {
      const mockProducts = [{ id: '1' }];
      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
      });

      renderHook(() => useProductsByCategory('  Electronics  '));

      expect(filterProductsByCategorySlug).toHaveBeenCalledWith(
        mockProducts,
        'electronics',
      );
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

      (filterProductsBySearchQuery as jest.Mock).mockReturnValue(mockProducts);

      const { result } = renderHook(() =>
        useSearchProducts('test query', 'electronics'),
      );

      expect(result.current.products).toEqual(mockProducts);
    });

    it('uses cached query for search', () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderHook(() => useSearchProducts('test', 'electronics'));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['products', 'all']),
        }),
      );
    });

    it('calls filter helpers with correct params', () => {
      const mockProducts = [{ id: '1' }];
      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
      });

      // Setup chain of filtering
      (filterProductsBySearchQuery as jest.Mock).mockReturnValue(mockProducts);
      (filterProductsByCategorySlug as jest.Mock).mockReturnValue(mockProducts);

      renderHook(() => useSearchProducts('  Test  ', '  Electronics  '));

      expect(filterProductsBySearchQuery).toHaveBeenCalledWith(
        mockProducts,
        'test',
      );
      expect(filterProductsByCategorySlug).toHaveBeenCalledWith(
        mockProducts,
        'electronics',
      );
    });

    it('returns empty array when query is empty', () => {
      const mockProducts = [{ id: '1' }];
      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
      });

      const { result } = renderHook(() => useSearchProducts('', 'electronics'));

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
