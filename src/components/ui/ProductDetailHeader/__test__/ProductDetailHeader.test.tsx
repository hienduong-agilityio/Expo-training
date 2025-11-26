import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

// Components
import { ProductDetailHeaderRight } from '@app/components/ui/ProductDetailHeader';

// Hooks
import { useWishlist } from '@app/hooks/useWishlist';

// Stores
import { toastStore } from '@app/stores/toastStore';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';

// Constants
import {
  PRIVATE_SCREENS,
  STATUS,
  POSITION,
  TOAST_MESSAGES,
} from '@app/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '@app/interfaces/navigation';

jest.mock('@app/hooks/useWishlist');
jest.mock('@app/stores/toastStore', () => ({
  toastStore: jest.fn(),
}));

describe('ProductDetailHeaderRight', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as BottomTabNavigationProp<ParamListBase, string>;

  const mockUseWishlist = useWishlist as jest.MockedFunction<
    typeof useWishlist
  >;
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
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
    } as unknown as ReturnType<typeof useWishlist>);

    // Mock toastStore as a hook that returns an object
    mockToastStore.mockReturnValue({
      showToast: mockShowToast,
    } as unknown as ReturnType<typeof toastStore>);
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

    expect(mockNavigation.navigate).toHaveBeenCalledWith(PRIVATE_SCREENS.HOME, {
      screen: PRIVATE_SCREENS.CART,
    });
  });

  describe('Wishlist actions', () => {
    it('adds item to wishlist when not wishlisted', async () => {
      mockIsInWishlist.mockReturnValue(false);
      renderComponent();

      fireEvent.press(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith('1');
      });
      expect(mockShowToast).toHaveBeenCalledWith({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.ADDED_TO_WISHLIST,
        position: POSITION.TOP,
      });
    });

    it('removes item from wishlist when wishlisted', async () => {
      mockIsInWishlist.mockReturnValue(true);
      renderComponent();

      fireEvent.press(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(mockRemoveItem).toHaveBeenCalledWith('1');
      });
      expect(mockShowToast).toHaveBeenCalledWith({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REMOVED_FROM_WISHLIST,
        position: POSITION.TOP,
      });
    });
  });
});
