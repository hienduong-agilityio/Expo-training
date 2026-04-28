import { renderHook } from '@testing-library/react-native';

// Hooks
import { useWishlist, useWishlistActions } from '../useWishlist';

// Services
import { wishlistService } from '@app/services/wishlist';

// Stores
import { authStore } from '@app/stores/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const mockShowToast = jest.fn();

jest.mock('@app/services/wishlist');
jest.mock('@app/stores/authStore');
jest.mock('@app/stores/toastStore', () => ({
  toastStore: jest.fn(selector => {
    const state = { showToast: mockShowToast };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('@tanstack/react-query', () => {
  const React = require('react');
  const { act } = require('@testing-library/react-native');

  const useMutation = jest.fn(options => {
    const [isPending, setIsPending] = React.useState(false);
    return {
      mutateAsync: jest.fn(async variables => {
        let context;
        await act(async () => {
          setIsPending(true);
        });
        try {
          if (typeof options.onMutate === 'function') {
            context = await options.onMutate(variables);
          }
          const result = await options.mutationFn(variables);
          if (typeof options.onSuccess === 'function') {
            options.onSuccess(result, variables, context);
          }
          return result;
        } catch (error) {
          if (typeof options.onError === 'function') {
            options.onError(error, variables, context);
          }
          throw error;
        } finally {
          if (typeof options.onSettled === 'function') {
            options.onSettled();
          }
          await act(async () => {
            setIsPending(false);
          });
        }
      }),
      isPending,
    };
  });

  return {
    useQuery: jest.fn(),
    useMutation,
    useQueryClient: jest.fn(),
  };
});

describe('useWishlist', () => {
  const mockUser = { documentId: 'user1' };
  const mockWishlist = {
    documentId: 'wishlist1',
    userId: 'user1',
    products: [{ productId: '1' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockShowToast.mockClear();
    (authStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = { user: mockUser };
      return selector ? selector(state) : state;
    });
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
  });

  it('returns wishlist data', () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.wishlist).toEqual(mockWishlist);
    expect(result.current.wishlistItems).toEqual([{ productId: '1' }]);
    expect(result.current.wishlistProductIds).toEqual(['1']);
    expect(result.current.isLoading).toBe(false);
  });

  it('checks if product is in wishlist', () => {
    const { result } = renderHook(() => useWishlist());

    expect(result.current.isInWishlist('1')).toBe(true);
    expect(result.current.isInWishlist('2')).toBe(false);
  });

  it('returns null wishlist when user is not authenticated', () => {
    (authStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = { user: null };
      return selector ? selector(state) : state;
    });
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

  it('provides mutation functions from useWishlistActions', () => {
    const { result } = renderHook(() => useWishlistActions());

    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
  });

  it('handles isMutating state in useWishlistActions', () => {
    const { result } = renderHook(() => useWishlistActions());

    expect(result.current.isMutating).toBe(false);
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
        cancelQueries: jest.fn(() => Promise.resolve()),
        invalidateQueries: jest.fn(() => Promise.resolve()),
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

      const { result } = renderHook(() => useWishlistActions());

      const added = await result.current.addItem('2');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '2', product: '2' }],
      );
      expect(added).toEqual(updatedWishlist);
      expect(mockShowToast).toHaveBeenCalled();
    });

    it('addItem syncs wishlist when product already exists', async () => {
      const wishlistWithItem = {
        ...mockWishlist,
        products: [{ productId: '1' }],
      };

      mockQueryClient.getQueryData.mockReturnValue(wishlistWithItem);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        wishlistWithItem,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue(
        wishlistWithItem,
      );

      const { result } = renderHook(() => useWishlistActions());

      const added = await result.current.addItem('1');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '1', product: '1' }],
      );
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

      const { result } = renderHook(() => useWishlistActions());

      const removed = await result.current.removeItem('1');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '2', product: '2' }],
      );
      expect(removed).toEqual(updatedWishlist);
      expect(mockShowToast).toHaveBeenCalled();
    });

    it('addItem onError restores wishlist and shows toast', async () => {
      const prev = { ...mockWishlist };
      mockQueryClient.getQueryData.mockReturnValue(prev);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        prev,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockRejectedValue(
        new Error('fail'),
      );

      const { result } = renderHook(() => useWishlistActions());

      await expect(result.current.addItem('2')).rejects.toThrow('fail');
      expect(mockShowToast).toHaveBeenCalled();
      expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
        expect.anything(),
        prev,
      );
    });

    it('ensureWishlist always resolves wishlist before update', async () => {
      const cachedWishlist = {
        ...mockWishlist,
        products: [{ productId: '1' }],
      };
      mockQueryClient.getQueryData.mockReturnValue(cachedWishlist);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        cachedWishlist,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockResolvedValue(
        mockWishlist,
      );

      const { result } = renderHook(() => useWishlistActions());

      await result.current.addItem('2');

      expect(wishlistService.ensureWishlistForUser).toHaveBeenCalledWith(
        'user1',
      );
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

      const { result } = renderHook(() => useWishlistActions());

      await result.current.addItem('2');

      expect(wishlistService.ensureWishlistForUser).toHaveBeenCalledWith(
        'user1',
      );
      expect(wishlistService.updateWishlistProducts).toHaveBeenCalled();
    });

    it('getCachedWishlist returns null when userId is null', () => {
      (authStore as unknown as jest.Mock).mockImplementation(selector => {
        const state = { user: null };
        return selector ? selector(state) : state;
      });
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
      (authStore as unknown as jest.Mock).mockImplementation(selector => {
        const state = { user: null };
        return selector ? selector(state) : state;
      });

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

      const { result } = renderHook(() => useWishlistActions());

      await result.current.addItem('1');

      expect(wishlistService.updateWishlistProducts).toHaveBeenCalledWith(
        'wishlist1',
        [{ productId: '1', product: '1' }],
      );
    });

    it('removeItem onError restores wishlist', async () => {
      const prev = {
        ...mockWishlist,
        products: [{ productId: '1' }, { productId: '2' }],
      };
      mockQueryClient.getQueryData.mockReturnValue(prev);
      (wishlistService.ensureWishlistForUser as jest.Mock).mockResolvedValue(
        prev,
      );
      (wishlistService.updateWishlistProducts as jest.Mock).mockRejectedValue(
        new Error('rm fail'),
      );

      const { result } = renderHook(() => useWishlistActions());

      await expect(result.current.removeItem('1')).rejects.toThrow('rm fail');
      expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
        expect.anything(),
        prev,
      );
    });
  });
});
