import { renderHook, act } from '@testing-library/react-native';

// Hooks
import { useProductCart } from '../useProductCart';
import { useCartActions } from '@app/hooks/useCart';
import { toastStore } from '@app/stores/toastStore';

// Constants
import { STATUS, MESSAGES, TOAST_MESSAGES } from '@app/constants';

// Types
import { IProduct } from '@app/interfaces/product';

// Mocks
jest.mock('@app/hooks/useCart');
jest.mock('@app/stores/toastStore');
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

describe('useProductCart', () => {
  const mockAddItem = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartActions as jest.Mock).mockReturnValue({
      addItem: mockAddItem,
    });
    (toastStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = { showToast: mockShowToast };
      return selector ? selector(state) : state;
    });
  });

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    currency: 'USD',
    imageSource: { uri: 'test-image' },
    rating: 4.5,
    reviewCount: 10,
  } as unknown as IProduct;

  it('adds item to cart and shows success toast', async () => {
    mockAddItem.mockResolvedValueOnce({});
    const { result } = renderHook(() => useProductCart());

    await act(async () => {
      await result.current.handleAddToCart(mockProduct, 'M');
    });

    expect(mockAddItem).toHaveBeenCalledWith({
      productId: '1',
      quantity: 1,
    });
    expect(mockShowToast).toHaveBeenCalledWith({
      type: STATUS.SUCCESS,
      message: 'Test Product (M) added to cart',
    });
  });

  it('adds item to cart without size and shows success toast', async () => {
    mockAddItem.mockResolvedValueOnce({});
    const { result } = renderHook(() => useProductCart());

    await act(async () => {
      await result.current.handleAddToCart(mockProduct);
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      type: STATUS.SUCCESS,
      message: 'Test Product  added to cart',
    });
  });

  it('handles error when adding to cart fails', async () => {
    mockAddItem.mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useProductCart());

    await act(async () => {
      await result.current.handleAddToCart(mockProduct);
    });

    expect(mockAddItem).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith({
      type: STATUS.ERROR,
      message: TOAST_MESSAGES.ADD_TO_CART_FAILED,
    });
  });

  it('shows buy now toast', () => {
    const { result } = renderHook(() => useProductCart());

    act(() => {
      result.current.handleBuyNow(mockProduct);
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      type: STATUS.SUCCESS,
      message: `${MESSAGES.OR_CONTINUE_WITH} ${mockProduct.name}`,
    });
  });
});
