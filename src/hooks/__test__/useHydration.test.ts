import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TPersistedStore, useHydration } from '../useHydration';

describe('useHydration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns false initially when not hydrated and not checked onboarding', async () => {
    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => false),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    const { result } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        hydrated: false,
        isFirstLaunch: true,
      });
    });
  });

  it('returns true when already hydrated and checked onboarding', async () => {
    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => true),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        hydrated: true,
        isFirstLaunch: false,
      });
    });
  });

  it('subscribes to hydration events', async () => {
    const unsubscribeHydrate = jest.fn();
    const unsubscribeFinish = jest.fn();

    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => false),
        onHydrate: jest.fn(() => unsubscribeHydrate),
        onFinishHydration: jest.fn(() => unsubscribeFinish),
      },
    };

    const { unmount } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    expect(mockStore.persist.onHydrate).toHaveBeenCalled();
    expect(mockStore.persist.onFinishHydration).toHaveBeenCalled();

    unmount();

    expect(unsubscribeHydrate).toHaveBeenCalled();
    expect(unsubscribeFinish).toHaveBeenCalled();
  });

  it('updates when finish hydration callback is called', async () => {
    let finishCallback: (() => void) | undefined;
    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => false),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn((callback: () => void) => {
          finishCallback = callback;
          return jest.fn();
        }),
      },
    };

    const { result, rerender } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    await waitFor(() => {
      expect(result.current.hydrated).toBe(false);
    });

    if (finishCallback) {
      act(() => {
        finishCallback?.();
      });
      rerender({});
    }

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });
  });

  it('updates when hydrate callback is called', async () => {
    let hydrateCallback: (() => void) | undefined;
    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => true),
        onHydrate: jest.fn((callback: () => void) => {
          hydrateCallback = callback;
          return jest.fn();
        }),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    const { result, rerender } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    if (hydrateCallback) {
      act(() => {
        hydrateCallback?.();
      });
      rerender({});
    }

    await waitFor(() => {
      expect(result.current.hydrated).toBe(false);
    });
  });

  it('handles store change', async () => {
    const mockStore1 = {
      persist: {
        hasHydrated: jest.fn(() => false),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    const mockStore2 = {
      persist: {
        hasHydrated: jest.fn(() => true),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    const { result, rerender } = renderHook(
      ({ store }) => useHydration(store),
      {
        initialProps: { store: mockStore1 as unknown as TPersistedStore },
      },
    );

    await waitFor(() => {
      expect(result.current.hydrated).toBe(false);
    });

    rerender({ store: mockStore2 as unknown as TPersistedStore });

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });
  });
});
