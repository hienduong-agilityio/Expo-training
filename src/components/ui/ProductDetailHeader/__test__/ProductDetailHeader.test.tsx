import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

// Components
import { ProductDetailHeaderRight } from '@app/components/ui/ProductDetailHeader';

// Hooks
import { useWishlist, useWishlistActions } from '@app/hooks/useWishlist';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Constants
import { STATUS, POSITION } from '@app/constants';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@app/hooks/useWishlist', () => ({
  useWishlist: jest.fn(),
  useWishlistActions: jest.fn(),
}));
jest.mock('@app/stores/toastStore', () => ({
  toastStore: jest.fn(),
}));

describe('ProductDetailHeaderRight', () => {
  const mockUseWishlist = useWishlist as jest.Mock;
  const mockUseWishlistActions = useWishlistActions as jest.Mock;
  const mockToastStore = toastStore as jest.MockedFunction<typeof toastStore>;

  const mockShowToast = jest.fn();
  const mockIsInWishlist = jest.fn();
  const mockAddItem = jest.fn();
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockIsInWishlist.mockReturnValue(false);
    mockAddItem.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);

    mockUseWishlist.mockReturnValue({
      isInWishlist: mockIsInWishlist,
    });

    mockUseWishlistActions.mockReturnValue({
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
    });

    mockToastStore.mockImplementation(selector => {
      const state = {
        showToast: mockShowToast,
        visible: false,
        message: '',
        type: STATUS.INFO,
        position: POSITION.TOP,
        duration: 1000,
        hideToast: jest.fn(),
      };
      return selector ? selector(state) : state;
    });
  });

  const renderComponent = (productId = '1') => {
    return render(<ProductDetailHeaderRight productId={productId} />);
  };

  it('renders correctly', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  it('navigates to cart when cart icon is pressed', () => {
    renderComponent();

    fireEvent.press(screen.getByLabelText('Go to cart'));

    expect(mockPush).toHaveBeenCalledWith('/cart');
  });

  describe('Wishlist actions', () => {
    it('adds item to wishlist when not wishlisted', async () => {
      mockIsInWishlist.mockReturnValue(false);
      renderComponent();

      fireEvent.press(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith('1');
      });
    });
  });
});
