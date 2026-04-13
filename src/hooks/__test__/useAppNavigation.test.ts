import { renderHook, act } from '@testing-library/react-native';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

// Hooks
import { useAppNavigation } from '../useAppNavigation';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
}));

describe('useAppNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handleGoBack calls goBack when navigation can go back', () => {
    mockCanGoBack.mockReturnValue(true);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handleGoBack navigates to main tabs when cannot go back', () => {
    mockCanGoBack.mockReturnValue(false);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(PRIVATE_SCREENS.MAIN_TABS);
  });

  it('navigateToDetail navigates to product detail with id', () => {
    mockCanGoBack.mockReturnValue(true);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.navigateToDetail('prod-99');
    });

    expect(mockNavigate).toHaveBeenCalledWith(PRIVATE_SCREENS.PRODUCT_DETAIL, {
      productId: 'prod-99',
    });
  });
});
