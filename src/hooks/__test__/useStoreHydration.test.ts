import { renderHook, act } from '@testing-library/react-native';
import { useStoreHydration } from '../useStoreHydration';
import type { TPersistedStore } from '../useStoreHydration';

describe('useStoreHydration', () => {
  let mockStore: TPersistedStore;
  let mockHasHydrated: jest.Mock;
  let mockOnHydrate: jest.Mock;
  let mockOnFinishHydration: jest.Mock;
  let hydrateCallbacks: Array<() => void>;
  let finishHydrationCallbacks: Array<() => void>;

  beforeEach(() => {
    hydrateCallbacks = [];
    finishHydrationCallbacks = [];

    mockHasHydrated = jest.fn(() => false);

    mockOnHydrate = jest.fn((callback: () => void) => {
      hydrateCallbacks.push(callback);
      return () => {
        const index = hydrateCallbacks.indexOf(callback);
        if (index > -1) {
          hydrateCallbacks.splice(index, 1);
        }
      };
    });

    mockOnFinishHydration = jest.fn((callback: () => void) => {
      finishHydrationCallbacks.push(callback);
      return () => {
        const index = finishHydrationCallbacks.indexOf(callback);
        if (index > -1) {
          finishHydrationCallbacks.splice(index, 1);
        }
      };
    });

    mockStore = {
      persist: {
        hasHydrated: mockHasHydrated,
        onHydrate: mockOnHydrate,
        onFinishHydration: mockOnFinishHydration,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    hydrateCallbacks = [];
    finishHydrationCallbacks = [];
  });

  it('should return false when store has not hydrated', () => {
    mockHasHydrated.mockReturnValue(false);

    const { result } = renderHook(() => useStoreHydration(mockStore));

    expect(result.current).toBe(false);
    expect(mockHasHydrated).toHaveBeenCalled();
  });

  it('should return true when store has hydrated', () => {
    mockHasHydrated.mockReturnValue(true);

    const { result } = renderHook(() => useStoreHydration(mockStore));

    expect(result.current).toBe(true);
    expect(mockHasHydrated).toHaveBeenCalled();
  });

  it('should subscribe to onHydrate and onFinishHydration events', () => {
    renderHook(() => useStoreHydration(mockStore));

    expect(mockOnHydrate).toHaveBeenCalledTimes(1);
    expect(mockOnFinishHydration).toHaveBeenCalledTimes(1);
    expect(typeof mockOnHydrate.mock.calls[0][0]).toBe('function');
    expect(typeof mockOnFinishHydration.mock.calls[0][0]).toBe('function');
  });

  it('should update when hydration starts (onHydrate callback)', () => {
    mockHasHydrated.mockReturnValue(false);

    const { result } = renderHook(() => useStoreHydration(mockStore));

    expect(result.current).toBe(false);

    const initialCallCount = mockHasHydrated.mock.calls.length;

    act(() => {
      hydrateCallbacks.forEach(callback => callback());
    });

    expect(mockHasHydrated.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('should update when hydration finishes (onFinishHydration callback)', () => {
    let hydrated = false;
    mockHasHydrated.mockImplementation(() => hydrated);

    const { result } = renderHook(() => useStoreHydration(mockStore));

    expect(result.current).toBe(false);

    act(() => {
      hydrated = true;
      finishHydrationCallbacks.forEach(callback => callback());
    });

    expect(result.current).toBe(true);
  });

  it('should unsubscribe from events on unmount', () => {
    const unsubscribeHydrate = jest.fn();
    const unsubscribeFinish = jest.fn();

    mockOnHydrate.mockReturnValue(unsubscribeHydrate);
    mockOnFinishHydration.mockReturnValue(unsubscribeFinish);

    const { unmount } = renderHook(() => useStoreHydration(mockStore));

    unmount();

    expect(unsubscribeHydrate).toHaveBeenCalledTimes(1);
    expect(unsubscribeFinish).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple hydration state changes', () => {
    let hydrated = false;
    mockHasHydrated.mockImplementation(() => hydrated);

    const { result } = renderHook(() => useStoreHydration(mockStore));

    expect(result.current).toBe(false);

    act(() => {
      hydrateCallbacks.forEach(callback => callback());
    });

    expect(result.current).toBe(false);

    act(() => {
      hydrated = true;
      finishHydrationCallbacks.forEach(callback => callback());
    });

    expect(result.current).toBe(true);
  });

  it('should handle store with different hydration states', () => {
    mockHasHydrated.mockReturnValue(true);

    const { result: result1 } = renderHook(() => useStoreHydration(mockStore));
    expect(result1.current).toBe(true);

    mockHasHydrated.mockReturnValue(false);

    const { result: result2 } = renderHook(() => useStoreHydration(mockStore));
    expect(result2.current).toBe(false);
  });

  it('should maintain separate subscriptions for multiple hook instances', () => {
    const { unmount: unmount1 } = renderHook(() =>
      useStoreHydration(mockStore),
    );
    const { unmount: unmount2 } = renderHook(() =>
      useStoreHydration(mockStore),
    );

    expect(mockOnHydrate).toHaveBeenCalledTimes(2);
    expect(mockOnFinishHydration).toHaveBeenCalledTimes(2);
    expect(hydrateCallbacks.length).toBe(2);
    expect(finishHydrationCallbacks.length).toBe(2);

    unmount1();
    unmount2();

    expect(hydrateCallbacks.length).toBe(0);
    expect(finishHydrationCallbacks.length).toBe(0);
  });
});
