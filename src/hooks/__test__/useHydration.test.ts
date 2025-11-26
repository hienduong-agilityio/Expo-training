import { renderHook, act } from '@testing-library/react-native';
import { TPersistedStore, useHydration } from '../useHydration';

describe('useHydration', () => {
  it('returns false initially when not hydrated', () => {
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

    expect(result.current).toBe(false);
  });

  it('returns true when already hydrated', () => {
    const mockStore = {
      persist: {
        hasHydrated: jest.fn(() => true),
        onHydrate: jest.fn(() => jest.fn()),
        onFinishHydration: jest.fn(() => jest.fn()),
      },
    };

    const { result } = renderHook(() =>
      useHydration(mockStore as unknown as TPersistedStore),
    );

    expect(result.current).toBe(true);
  });

  it('subscribes to hydration events', () => {
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

  it('updates when finish hydration callback is called', () => {
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

    expect(result.current).toBe(false);

    if (finishCallback) {
      act(() => {
        finishCallback?.();
      });
      rerender({});
    }

    expect(result.current).toBe(true);
  });

  it('updates when hydrate callback is called', () => {
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

    expect(result.current).toBe(true);

    if (hydrateCallback) {
      act(() => {
        hydrateCallback?.();
      });
      rerender({});
    }

    expect(result.current).toBe(false);
  });

  it('handles store change', () => {
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

    expect(result.current).toBe(false);

    rerender({ store: mockStore2 as unknown as TPersistedStore });

    expect(result.current).toBe(true);
  });
});
