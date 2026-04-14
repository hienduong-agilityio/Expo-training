import { renderHook, act } from '@testing-library/react-native';

import { useAppNavigation } from '../useAppNavigation';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    push: mockPush,
    canGoBack: mockCanGoBack,
  }),
}));

describe('useAppNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handleGoBack calls back when can go back', () => {
    mockCanGoBack.mockReturnValue(true);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockBack).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('handleGoBack replaces with home when cannot go back', () => {
    mockCanGoBack.mockReturnValue(false);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });

  it('navigateToDetail pushes product route', () => {
    mockCanGoBack.mockReturnValue(true);
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.navigateToDetail('prod-99');
    });

    expect(mockPush).toHaveBeenCalledWith('/product/prod-99');
  });
});
