/**
 * expo-modules-core reads globalThis.expo.EventEmitter at load time.
 * Native runtimes install this; Jest does not, so we polyfill before any Expo package loads.
 */

/** Minimal shape expo-modules-core reads from `globalThis.expo` in Jest. */
type ExpoNativeEventEmitterCtor = new () => {
  addListener(): { remove: () => void };
  removeListener(): void;
  removeAllListeners(): void;
  emit(): void;
};

/** Do not intersect with `typeof globalThis`: Expo’s typings merge `expo.EventEmitter` with a different constructor. */
const globalForJest = globalThis as unknown as {
  expo?: { EventEmitter: ExpoNativeEventEmitterCtor };
};

if (globalForJest.expo === undefined) {
  const noop = (): void => {};

  class MockExpoNativeEventEmitter {
    addListener(): { remove: () => void } {
      return { remove: noop };
    }
    removeListener(): void {}
    removeAllListeners(): void {}
    emit(): void {}
  }

  globalForJest.expo = {
    EventEmitter:
      MockExpoNativeEventEmitter as unknown as ExpoNativeEventEmitterCtor,
  };
}
