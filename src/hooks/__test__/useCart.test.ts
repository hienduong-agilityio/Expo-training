import { renderHook } from '@testing-library/react-native';
import { useCart, useCartActions } from '../useCart';
import { cartService } from '@app/services/cart';
import { authStore } from '@app/stores/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const mockShowToast = jest.fn();

jest.mock('@app/services/cart');
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

describe('useCart', () => {
  const mockUser = { documentId: 'user1' };
  const mockCart = {
    documentId: 'cart1',
    userId: 'user1',
    products: [],
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
      data: mockCart,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('returns cart data', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns null cart when user is not authenticated', () => {
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

    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toBeNull();
    expect(result.current.cartItems).toEqual([]);
  });

  it('provides mutation functions', () => {
    const { result } = renderHook(() => useCartActions());

    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.updateItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
    expect(typeof result.current.checkout).toBe('function');
  });

  it('handles isMutating state correctly', () => {
    const { result } = renderHook(() => useCartActions());

    expect(result.current.isMutating).toBe(false);
  });

  it('returns empty cartItems when cart is null', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.cartItems).toEqual([]);
  });

  it('handles cart with products', () => {
    const cartWithProducts = {
      ...mockCart,
      products: [{ productId: '1', quantity: 2 }],
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: cartWithProducts,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].productId).toBe('1');
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

    const { result } = renderHook(() => useCart());

    expect(result.current.error).toEqual(mockError);
  });

  it('handles cart with null products', () => {
    const cartWithNullProducts = {
      ...mockCart,
      products: null,
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: cartWithNullProducts,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.cartItems).toEqual([]);
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

    it('addItem adds new item when product not in cart', async () => {
      const newCart = { ...mockCart, products: [] };
      const updatedCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 2 }],
      };

      mockQueryClient.getQueryData.mockReturnValue(newCart);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        newCart,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(
        updatedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const addedCart = await result.current.addItem({
        productId: '1',
        quantity: 2,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', product: '1', quantity: 2 },
      ]);
      expect(addedCart).toEqual(updatedCart);
    });

    it('addItem updates quantity when product already in cart', async () => {
      const cartWithItem = {
        ...mockCart,
        products: [{ productId: '1', quantity: 2 }],
      };
      const updatedCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 5 }],
      };

      mockQueryClient.getQueryData.mockReturnValue(cartWithItem);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cartWithItem,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(
        updatedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const addedCart = await result.current.addItem({
        productId: '1',
        quantity: 3,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', product: '1', quantity: 5 },
      ]);
      expect(addedCart).toEqual(updatedCart);
    });

    it('updateItem removes item when quantity <= 0', async () => {
      const cartWithItem = {
        ...mockCart,
        products: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };
      const updatedCart = {
        ...mockCart,
        products: [{ productId: '2', quantity: 1 }],
      };

      mockQueryClient.getQueryData.mockReturnValue(cartWithItem);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cartWithItem,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(
        updatedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const updated = await result.current.updateItem({
        productId: '1',
        quantity: 0,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '2', product: '2', quantity: 1 },
      ]);
      expect(updated).toEqual(updatedCart);
    });

    it('updateItem updates quantity when quantity > 0', async () => {
      const cartWithItem = {
        ...mockCart,
        products: [{ productId: '1', quantity: 2 }],
      };
      const updatedCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 5 }],
      };

      mockQueryClient.getQueryData.mockReturnValue(cartWithItem);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cartWithItem,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(
        updatedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const updated = await result.current.updateItem({
        productId: '1',
        quantity: 5,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', product: '1', quantity: 5 },
      ]);
      expect(updated).toEqual(updatedCart);
    });

    it('removeItem removes product from cart', async () => {
      const cartWithItems = {
        ...mockCart,
        products: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };
      const updatedCart = {
        ...mockCart,
        products: [{ productId: '2', quantity: 1 }],
      };

      mockQueryClient.getQueryData.mockReturnValue(cartWithItems);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cartWithItems,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(
        updatedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const updated = await result.current.removeItem('1');

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '2', product: '2', quantity: 1 },
      ]);
      expect(updated).toEqual(updatedCart);
    });

    it('checkout clears all products', async () => {
      const cartWithItems = {
        ...mockCart,
        products: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 },
        ],
      };
      const clearedCart = {
        ...mockCart,
        products: [],
      };

      mockQueryClient.getQueryData.mockReturnValue(cartWithItems);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cartWithItems,
      );
      (cartService.clearCartProducts as jest.Mock).mockResolvedValue(
        clearedCart,
      );

      const { result } = renderHook(() => useCartActions());

      const checkedOut = await result.current.checkout();

      expect(cartService.clearCartProducts).toHaveBeenCalledWith('cart1');
      expect(checkedOut).toEqual(clearedCart);
    });

    it('ensureCart always resolves active cart before update', async () => {
      const cachedCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 1 }],
      };
      mockQueryClient.getQueryData.mockReturnValue(cachedCart);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        cachedCart,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartActions());

      await result.current.addItem({ productId: '2', quantity: 1 });

      expect(cartService.ensureActiveCartForUser).toHaveBeenCalledWith('user1');
      expect(cartService.updateCartProducts).toHaveBeenCalledWith(
        'cart1',
        expect.any(Array),
      );
    });

    it('ensureCart creates new cart when no cached cart', async () => {
      mockQueryClient.getQueryData.mockReturnValue(null);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        mockCart,
      );
      (cartService.updateCartProducts as jest.Mock).mockResolvedValue(mockCart);

      const { result } = renderHook(() => useCartActions());

      await result.current.addItem({ productId: '1', quantity: 1 });

      expect(cartService.ensureActiveCartForUser).toHaveBeenCalledWith('user1');
      expect(cartService.updateCartProducts).toHaveBeenCalled();
    });

    it('getCachedCart returns null when userId is null', () => {
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

      const { result } = renderHook(() => useCart());

      expect(result.current.cart).toBeNull();
    });

    it('addItem onError restores previous cart and shows toast', async () => {
      const previousCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 1 }],
      };
      mockQueryClient.getQueryData.mockReturnValue(previousCart);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        previousCart,
      );
      (cartService.updateCartProducts as jest.Mock).mockRejectedValue(
        new Error('network'),
      );

      const { result } = renderHook(() => useCartActions());

      await expect(
        result.current.addItem({ productId: '2', quantity: 1 }),
      ).rejects.toThrow('network');

      expect(mockShowToast).toHaveBeenCalled();
      expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
        expect.anything(),
        previousCart,
      );
    });

    it('checkout onError shows payment failed toast', async () => {
      mockQueryClient.getQueryData.mockReturnValue(mockCart);
      (cartService.ensureActiveCartForUser as jest.Mock).mockResolvedValue(
        mockCart,
      );
      (cartService.clearCartProducts as jest.Mock).mockRejectedValue(
        new Error('pay failed'),
      );

      const { result } = renderHook(() => useCartActions());

      await expect(result.current.checkout()).rejects.toThrow('pay failed');
      expect(mockShowToast).toHaveBeenCalled();
    });
  });
});
