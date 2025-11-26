import { renderHook } from '@testing-library/react-native';
import { useCart } from '../useCart';
import { cartService } from '@app/services/cart';
import { authStore } from '@app/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

jest.mock('@app/services/cart');
jest.mock('@app/stores/authStore');
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe('useCart', () => {
  const mockUser = { documentId: 'user1' };
  const mockCart = {
    documentId: 'cart1',
    userId: 'user1',
    products: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authStore as unknown as jest.Mock).mockReturnValue({ user: mockUser });
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
    (useMutation as jest.Mock).mockReturnValue({
      isPending: false,
      mutateAsync: jest.fn(),
    });
  });

  it('returns cart data', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isMutating).toBe(false);
  });

  it('returns null cart when user is not authenticated', () => {
    (authStore as unknown as jest.Mock).mockReturnValue({ user: null });
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
    const mockAddItem = jest.fn();
    const mockUpdateItem = jest.fn();
    const mockRemoveItem = jest.fn();
    const mockCheckout = jest.fn();

    (useMutation as jest.Mock)
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockAddItem })
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockUpdateItem })
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockRemoveItem })
      .mockReturnValueOnce({ isPending: false, mutateAsync: mockCheckout });

    const { result } = renderHook(() => useCart());

    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.updateItem).toBe('function');
    expect(typeof result.current.removeItem).toBe('function');
    expect(typeof result.current.checkout).toBe('function');
  });

  it('handles isMutating state correctly', () => {
    (useMutation as jest.Mock)
      .mockReturnValueOnce({ isPending: true, mutateAsync: jest.fn() })
      .mockReturnValueOnce({ isPending: false, mutateAsync: jest.fn() })
      .mockReturnValueOnce({ isPending: false, mutateAsync: jest.fn() })
      .mockReturnValueOnce({ isPending: false, mutateAsync: jest.fn() });

    const { result } = renderHook(() => useCart());

    expect(result.current.isMutating).toBe(true);
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
    let mockMutateAsync: jest.Mock;

    beforeEach(() => {
      mockQueryClient = {
        getQueryData: jest.fn(() => null),
        setQueryData: jest.fn(),
      };
      (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
      mockMutateAsync = jest.fn();
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
      mockMutateAsync.mockResolvedValue(updatedCart);

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const addedCart = await result.current.addItem({
        productId: '1',
        quantity: 2,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', quantity: 2 },
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const addedCart = await result.current.addItem({
        productId: '1',
        quantity: 3,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', quantity: 5 },
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const updated = await result.current.updateItem({
        productId: '1',
        quantity: 0,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '2', quantity: 1 },
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const updated = await result.current.updateItem({
        productId: '1',
        quantity: 5,
      });

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '1', quantity: 5 },
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const updated = await result.current.removeItem('1');

      expect(cartService.updateCartProducts).toHaveBeenCalledWith('cart1', [
        { productId: '2', quantity: 1 },
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      const checkedOut = await result.current.checkout();

      expect(cartService.clearCartProducts).toHaveBeenCalledWith('cart1');
      expect(checkedOut).toEqual(clearedCart);
    });

    it('ensureCart returns cached cart when available', async () => {
      const cachedCart = {
        ...mockCart,
        products: [{ productId: '1', quantity: 1 }],
      };
      mockQueryClient.getQueryData.mockReturnValue(cachedCart);

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      await result.current.addItem({ productId: '2', quantity: 1 });

      expect(cartService.ensureActiveCartForUser).not.toHaveBeenCalled();
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

      (useMutation as jest.Mock).mockImplementation(({ mutationFn }) => ({
        isPending: false,
        mutateAsync: async (...args: unknown[]) => {
          return await mutationFn(...args);
        },
      }));

      const { result } = renderHook(() => useCart());

      await result.current.addItem({ productId: '1', quantity: 1 });

      expect(cartService.ensureActiveCartForUser).toHaveBeenCalledWith('user1');
      expect(cartService.updateCartProducts).toHaveBeenCalled();
    });

    it('getCachedCart returns null when userId is null', () => {
      (authStore as unknown as jest.Mock).mockReturnValue({ user: null });
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

    it('setCachedCart does nothing when userId is null', () => {
      (
        authStore as unknown as jest.MockedFunction<typeof authStore>
      ).mockReturnValue({ user: null });

      renderHook(() => useCart());

      expect(mockQueryClient.setQueryData).not.toHaveBeenCalled();
    });
  });
});
