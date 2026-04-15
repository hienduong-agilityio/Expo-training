import { renderHook, act } from '@testing-library/react-native';
import * as ExpoNetwork from 'expo-network';
import { useNetworkStatus } from '../useNetworkStatus';

const NetworkStateType = {
  NONE: 'NONE',
  WIFI: 'WIFI',
  OTHER: 'OTHER',
} as const;

jest.mock('expo-network', () => ({
  NetworkStateType: {
    NONE: 'NONE',
    UNKNOWN: 'UNKNOWN',
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
    OTHER: 'OTHER',
  },
  useNetworkState: jest.fn(() => ({
    type: 'WIFI',
    isConnected: true,
    isInternetReachable: true,
  })),
}));

const useNetworkStateMock = ExpoNetwork.useNetworkState as jest.MockedFunction<
  typeof ExpoNetwork.useNetworkState
>;

describe('useNetworkStatus', () => {
  beforeEach(() => {
    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.WIFI,
      isConnected: true,
      isInternetReachable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with connected state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isConnected).toBe(true);
    expect(result.current.showOfflineModal).toBe(false);
  });

  it('updates to offline when network is disconnected', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus());

    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.NONE,
      isConnected: false,
      isInternetReachable: false,
    });
    rerender(undefined);

    expect(result.current.isConnected).toBe(false);
    expect(result.current.showOfflineModal).toBe(true);
  });

  it('updates to offline when internet is not reachable', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus());

    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.OTHER,
      isConnected: true,
      isInternetReachable: false,
    });
    rerender(undefined);

    expect(result.current.isConnected).toBe(false);
    expect(result.current.showOfflineModal).toBe(true);
  });

  it('updates to online when network is connected', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus());

    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.NONE,
      isConnected: false,
      isInternetReachable: false,
    });
    rerender(undefined);

    expect(result.current.isConnected).toBe(false);

    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.OTHER,
      isConnected: true,
      isInternetReachable: true,
    });
    rerender(undefined);

    expect(result.current.isConnected).toBe(true);
    expect(result.current.showOfflineModal).toBe(false);
  });

  it('closes offline modal when closeModal is called', () => {
    const { result, rerender } = renderHook(() => useNetworkStatus());

    useNetworkStateMock.mockReturnValue({
      type: NetworkStateType.NONE,
      isConnected: false,
      isInternetReachable: false,
    });
    rerender(undefined);

    expect(result.current.showOfflineModal).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.showOfflineModal).toBe(false);
  });

  it('unmounts without throwing', () => {
    const { unmount } = renderHook(() => useNetworkStatus());

    expect(() => unmount()).not.toThrow();
  });
});
