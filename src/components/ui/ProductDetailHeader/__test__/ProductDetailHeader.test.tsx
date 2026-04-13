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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';

// Constants
import { PRIVATE_SCREENS, STATUS, POSITION } from '@app/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '@app/interfaces/navigation';

jest.mock('@app/hooks/useWishlist', () => ({
  useWishlist: jest.fn(),
  useWishlistActions: jest.fn(),
}));
jest.mock('@app/stores/toastStore', () => ({
  toastStore: jest.fn(),
}));

describe('ProductDetailHeaderRight', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as BottomTabNavigationProp<ParamListBase, string>;

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

    // Mock toastStore as a hook that returns an object
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
    return render(
      <ProductDetailHeaderRight
        navigation={
          mockNavigation as unknown as NativeStackNavigationProp<PrivateStackParamList>
        }
        productId={productId}
      />,
    );
  };

  it('renders correctly', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  it('navigates to cart when cart icon is pressed', () => {
    renderComponent();

    fireEvent.press(screen.getByLabelText('Go to cart'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      PRIVATE_SCREENS.MAIN_TABS,
      {
        screen: PRIVATE_SCREENS.CART,
      },
    );
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
