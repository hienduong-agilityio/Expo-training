import { renderHook } from '@testing-library/react-native';
import {
  useCategorizedProducts,
  useProductById,
  useSearchProducts,
  useProductsByIds,
  useInfiniteProducts,
  useProductsByCategory,
} from '../useProduct';
import { useQuery, useQueries, useInfiniteQuery } from '@tanstack/react-query';
import { productsService } from '@app/services/product';
import {
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
  mapApiProductToCard,
} from '@app/helpers/products';

// Mocks
jest.mock('@app/services/product');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueries: jest.fn(),
  useInfiniteQuery: jest.fn(),
}));
jest.mock('@app/helpers/products', () => ({
  filterProductsByCategorySlug: jest.fn(),
  filterProductsBySearchQuery: jest.fn(),
  mapApiProductToCard: jest.fn(p => p),
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

  describe('useInfiniteProducts', () => {
    it('calls useInfiniteQuery with correct parameters', () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
        data: { pages: [] },
        isLoading: false,
      });

      renderHook(() => useInfiniteProducts(20));

      expect(useInfiniteQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['products', 'infinite', 20],
          initialPageParam: 1,
        }),
      );
    });

    it('queryFn fetches and maps products correctly', async () => {
      const mockApiProducts = [{ id: '1' }, { id: '2' }, { id: '3' }];
      (productsService.fetchAllProducts as jest.Mock).mockResolvedValue(
        mockApiProducts,
      );

      renderHook(() => useInfiniteProducts(2));

      const queryOptions = (useInfiniteQuery as jest.Mock).mock.calls[0][0];
      const result = await queryOptions.queryFn({ pageParam: 1 });

      expect(result.data).toHaveLength(2);
      expect(result.nextPage).toBe(2);
      expect(mapApiProductToCard).toHaveBeenCalled();
    });

    it('queryFn handles last page correctly', async () => {
      const mockApiProducts = [{ id: '1' }, { id: '2' }];
      (productsService.fetchAllProducts as jest.Mock).mockResolvedValue(
        mockApiProducts,
      );

      renderHook(() => useInfiniteProducts(2));

      const queryOptions = (useInfiniteQuery as jest.Mock).mock.calls[0][0];
      const result = await queryOptions.queryFn({ pageParam: 1 });

      expect(result.nextPage).toBeUndefined();
    });

    it('getNextPageParam returns nextPage from lastPage', () => {
      renderHook(() => useInfiniteProducts());
      const queryOptions = (useInfiniteQuery as jest.Mock).mock.calls[0][0];

      expect(queryOptions.getNextPageParam({ nextPage: 2 })).toBe(2);
      expect(
        queryOptions.getNextPageParam({ nextPage: undefined }),
      ).toBeUndefined();
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

    it('queryFn works correctly with productId', async () => {
      renderHook(() => useProductById('123'));
      const queryOptions = (useQuery as jest.Mock).mock.calls.find(
        call => call[0].queryKey[0] === 'product',
      )[0];

      (productsService.getProductById as jest.Mock).mockResolvedValue({
        id: '123',
      });
      const result = await queryOptions.queryFn();
      expect(result).toEqual({ id: '123' });
      expect(productsService.getProductById).toHaveBeenCalledWith('123');
    });

    it('queryFn rejects when productId is missing', async () => {
      renderHook(() => useProductById(undefined));
      const queryOptions = (useQuery as jest.Mock).mock.calls.find(
        call => call[0].queryKey[0] === 'product',
      )[0];

      await expect(queryOptions.queryFn()).rejects.toBe('No ID');
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
      expect(result.current.productMap.get('1')).toEqual(mockProducts[0]);
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

  describe('useProductsByCategory', () => {
    it('returns all products when category slug is empty', () => {
      const mockProducts = [{ id: '1', category: { slug: 'cat1' } }];
      (useQuery as jest.Mock).mockReturnValue({ data: mockProducts });

      const { result } = renderHook(() => useProductsByCategory(''));

      expect(result.current.products).toHaveLength(1);
      expect(filterProductsByCategorySlug).not.toHaveBeenCalled();
    });

    it('filters products by category slug', () => {
      const mockProducts = [{ id: '1', category: { slug: 'cat1' } }];
      (useQuery as jest.Mock).mockReturnValue({ data: mockProducts });
      (filterProductsByCategorySlug as jest.Mock).mockReturnValue(mockProducts);

      const { result } = renderHook(() => useProductsByCategory('cat1'));

      expect(filterProductsByCategorySlug).toHaveBeenCalledWith(
        mockProducts,
        'cat1',
      );
      expect(result.current.products).toHaveLength(1);
    });

    it('returns empty array when data is not yet available', () => {
      (useQuery as jest.Mock).mockReturnValue({ data: null });
      const { result } = renderHook(() => useProductsByCategory('cat1'));
      expect(result.current.products).toEqual([]);
    });

    it('returns empty array when disabled', () => {
      (useQuery as jest.Mock).mockReturnValue({ data: [{ id: '1' }] });
      const { result } = renderHook(() => useProductsByCategory('cat1', false));
      expect(result.current.products).toEqual([]);
    });
  });

  describe('useSearchProducts', () => {
    it('returns empty array when query is empty', () => {
      const mockProducts = [{ id: '1' }];
      (useQuery as jest.Mock).mockReturnValue({
        data: mockProducts,
        isLoading: false,
      });

      const { result } = renderHook(() => useSearchProducts('', 'electronics'));

      expect(result.current.products).toEqual([]);
    });

    it('filters by search query and category', () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];
      (useQuery as jest.Mock).mockReturnValue({ data: mockProducts });
      (filterProductsBySearchQuery as jest.Mock).mockReturnValue([
        mockProducts[0],
      ]);
      (filterProductsByCategorySlug as jest.Mock).mockReturnValue([
        mockProducts[0],
      ]);

      const { result } = renderHook(() => useSearchProducts('test', 'cat1'));

      expect(filterProductsBySearchQuery).toHaveBeenCalledWith(
        mockProducts,
        'test',
      );
      expect(filterProductsByCategorySlug).toHaveBeenCalledWith(
        [mockProducts[0]],
        'cat1',
      );
      expect(result.current.products).toHaveLength(1);
    });

    it('returns empty array when data is missing', () => {
      (useQuery as jest.Mock).mockReturnValue({ data: null });
      const { result } = renderHook(() => useSearchProducts('test'));
      expect(result.current.products).toEqual([]);
    });
  });
});
