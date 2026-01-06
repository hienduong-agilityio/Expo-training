import { renderHook, act } from '@testing-library/react-native';
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';
import { useNetworkStatus } from '../useNetworkStatus';

describe('useNetworkStatus', () => {
  let mockUnsubscribe: jest.Mock;
  let networkCallback: ((state: NetInfoState) => void) | null = null;

  beforeEach(() => {
    mockUnsubscribe = jest.fn();
    networkCallback = null;

    (NetInfo.addEventListener as jest.Mock).mockImplementation(callback => {
      networkCallback = callback;
      return mockUnsubscribe;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    networkCallback = null;
  });

  it('initializes with connected state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isConnected).toBe(true);
    expect(result.current.showOfflineModal).toBe(false);
  });

  it('updates to offline when network is disconnected', () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      if (networkCallback) {
        networkCallback({
          isConnected: false,
          isInternetReachable: false,
          type: NetInfoStateType.none,
          details: null,
        });
      }
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.showOfflineModal).toBe(true);
  });

  it('updates to offline when internet is not reachable', () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      if (networkCallback) {
        networkCallback({
          isConnected: true,
          isInternetReachable: false,
          type: NetInfoStateType.other,
          details: {
            isConnectionExpensive: false,
          },
        });
      }
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.showOfflineModal).toBe(true);
  });

  it('updates to online when network is connected', () => {
    const { result } = renderHook(() => useNetworkStatus());

    // First set to offline
    act(() => {
      if (networkCallback) {
        networkCallback({
          isConnected: false,
          isInternetReachable: false,
          type: NetInfoStateType.none,
          details: null,
        });
      }
    });

    expect(result.current.isConnected).toBe(false);

    // Then set to online
    act(() => {
      if (networkCallback) {
        networkCallback({
          isConnected: true,
          isInternetReachable: true,
          type: NetInfoStateType.other,
          details: {
            isConnectionExpensive: false,
          },
        });
      }
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.showOfflineModal).toBe(false);
  });

  it('closes offline modal when closeModal is called', () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Set to offline
    act(() => {
      if (networkCallback) {
        networkCallback({
          isConnected: false,
          isInternetReachable: false,
          type: NetInfoStateType.none,
          details: null,
        });
      }
    });

    expect(result.current.showOfflineModal).toBe(true);

    // Close modal
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.showOfflineModal).toBe(false);
  });

  it('unsubscribes from network listener on unmount', () => {
    const { unmount } = renderHook(() => useNetworkStatus());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
