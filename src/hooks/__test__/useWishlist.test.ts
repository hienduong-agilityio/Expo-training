import { renderHook } from '@testing-library/react-native';

// Hooks
import { useWishlist } from '../useWishlist';

// Services
import { wishlistService } from '@app/services/wishlist';

// Stores
import { authStore } from '@app/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

jest.mock('@app/services/wishlist');
jest.mock('@app/stores/authStore');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe('useWishlist', () => {
  const mockUser = { documentId: 'user1' };
  const mockWishlist = {
    documentId: 'wishlist1',
    userId: 'user1',
    products: [{ productId: '1' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authStore as unknown as jest.Mock).mockReturnValue({ user: mockUser });
    (useQueryClient as jest.Mock).mockReturnValue({
      getQueryData: jest.fn(() => null),
      setQueryData: jest.fn(),
    });
    (useQuery as jest.Mock).mockReturnValue({
      data: mockWishlist,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });
    (useMutation as jest.Mock).mockReturnValue({
      isPending: false,
      mutateAsync: jest.fn(),
    });
  });

  it('returns wishlist data', () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.wishlist).toEqual(mockWishlist);
    expect(result.current.wishlistItems).toEqual([{ productId: '1' }]);
    expect(result.current.wishlistProductIds).toEqual(['1']);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isMutating).toBe(false);
  });

  it('checks if product is in wishlist', () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.isInWishlist('1')).toBe(true);
    expect(result.current.isInWishlist('2')).toBe(false);
  });

  it('returns null wishlist when user is not authenticated', () => {
    (authStore as unknown as jest.Mock).mockReturnValue({ user: null });
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.wishlist).toBeNull();
    expect(result.current.wishlistItems).toEqual([]);
    expect(result.current.isInWishlist('1')).toBe(false);
  });

  it('provides mutation functions', () => {
    const mockAddItem = jest.fn();
    const mockRemoveItem = jest.fn();

    (useMutation as jest.Mock)
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockAddItem })
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockRemoveItem });

    const { result } = renderHook(() => useWishlist());

    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
  });

  it('handles isMutating state', () => {
    (useMutation as jest.Mock)
      .mockReturnValueOnce({ isPending: true, mutateAsync: jest.fn() })
      .mockReturnValueOnce({ isPending: false, mutateAsync: jest.fn() });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.isMutating).toBe(true);
  });

  it('handles error state', () => {
    const mockError = { message: 'Error', status: 500 };

    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: mockError,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.error).toEqual(mockError);
  });

  it('handles loading and fetching states', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockWishlist,
      isLoading: true,
      isFetching: true,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('handles wishlist with null products', () => {
    const wishlistWithNullProducts = {
      ...mockWishlist,
      products: null,
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: wishlistWithNullProducts,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.wishlistItems).toEqual([]);
    expect(result.current.wishlistProductIds).toEqual([]);
  });

  it('handles error with null', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockWishlist,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useWishlist());

    expect(result.current.error).toBeNull();
  });

  describe('mutations', () => {
    let mockQueryClient: { getQueryData: jest.Mock; setQueryData: jest.Mock };

    beforeEach(() => {
      mockQueryClient = {
        getQueryData: jest.fn(() => null),
        setQueryData: jest.fn(),
      };
      (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    });

    it('addItem adds new item when product not in wishlist', async () => {
      const emptyWishlist = { ...mockWishlist, products: [] };
      const updatedWishlist = {
        ...mockWishlist,
        products: [{ productId: '2' }],
      };

      mockQueryClient.getQueryData.mockReturnValue(emptyWishlist);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        emptyWishlist,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue(
        updatedWishlist,
      );

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      const added = await result.current.addItem('2');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '2' }],
      );
      expect(added).toEqual(updatedWishlist);
    });

    it('addItem returns existing wishlist when product already exists', async () => {
      const wishlistWithItem = {
        ...mockWishlist,
        products: [{ productId: '1' }],
      };

      mockQueryClient.getQueryData.mockReturnValue(wishlistWithItem);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        wishlistWithItem,
      );

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      const added = await result.current.addItem('1');

      expect(wishlistService.updateWishlistProducts).not.toHaveBeenCalled();
      expect(added).toEqual(wishlistWithItem);
    });

    it('removeItem removes product from wishlist', async () => {
      const wishlistWithItems = {
        ...mockWishlist,
        products: [{ productId: '1' }, { productId: '2' }],
      };
      const updatedWishlist = {
        ...mockWishlist,
        products: [{ productId: '2' }],
      };

      mockQueryClient.getQueryData.mockReturnValue(wishlistWithItems);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        wishlistWithItems,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue(
        updatedWishlist,
      );

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      const removed = await result.current.removeItem('1');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '2' }],
      );
      expect(removed).toEqual(updatedWishlist);
    });

    it('ensureWishlist returns cached wishlist when available', async () => {
      const cachedWishlist = {
        ...mockWishlist,
        products: [{ productId: '1' }],
      };
      mockQueryClient.getQueryData.mockReturnValue(cachedWishlist);

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      await result.current.addItem('2');

      expect(wishlistService.ensureWishlistForUser).not.toHaveBeenCalled();
      expect(wishlistService.updateWishlistProducts).toHaveBeenCalled();
    });

    it('ensureWishlist creates new wishlist when no cached wishlist', async () => {
      mockQueryClient.getQueryData.mockReturnValue(null);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        mockWishlist,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue(
        mockWishlist,
      );

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      await result.current.addItem('2');

      expect(wishlistService.ensureWishlistForUser).toHaveBeenCalledWith(
        'user1',
      );
      expect(wishlistService.updateWishlistProducts).toHaveBeenCalled();
    });

    it('getCachedWishlist returns null when userId is null', () => {
      (authStore as unknown as jest.Mock).mockReturnValue({ user: null });
      mockQueryClient.getQueryData.mockReturnValue(null);
      (useQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useWishlist());

      expect(result.current.wishlist).toBeNull();
    });

    it('setCachedWishlist does nothing when userId is null', () => {
      (authStore as unknown as jest.Mock).mockReturnValue({ user: null });

      renderHook(() => useWishlist());

      expect(mockQueryClient.setQueryData).not.toHaveBeenCalled();
    });

    it('handles wishlist with empty products array', async () => {
      const emptyWishlist = { ...mockWishlist, products: [] };

      mockQueryClient.getQueryData.mockReturnValue(emptyWishlist);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        emptyWishlist,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue({
        ...emptyWishlist,
        products: [{ productId: '1' }],
      });

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useWishlist());

      await result.current.addItem('1');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '1' }],
      );
    });
  });
});
